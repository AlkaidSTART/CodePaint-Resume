package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/codepaint-studio/resumeflow/backend/internal/auth"
	"github.com/codepaint-studio/resumeflow/backend/internal/domain"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Postgres struct {
	db *pgxpool.Pool
}

func NewPostgres(ctx context.Context, databaseURL string) (*Postgres, error) {
	db, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return nil, fmt.Errorf("create postgres pool: %w", err)
	}
	if err := db.Ping(ctx); err != nil {
		db.Close()
		return nil, fmt.Errorf("ping postgres: %w", err)
	}
	return &Postgres{db: db}, nil
}

func (r *Postgres) Close() { r.db.Close() }

func (r *Postgres) CreateUser(ctx context.Context, email, name, passwordHash string) (auth.User, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return auth.User{}, err
	}
	defer tx.Rollback(ctx)
	var user auth.User
	if err := tx.QueryRow(ctx, `INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id::text, email, name, status`, email, name, passwordHash).Scan(&user.ID, &user.Email, &user.Name, &user.Status); err != nil {
		return auth.User{}, err
	}
	var roleID string
	if err := tx.QueryRow(ctx, `SELECT id::text FROM roles WHERE code = 'user'`).Scan(&roleID); err != nil {
		return auth.User{}, err
	}
	if _, err := tx.Exec(ctx, `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`, user.ID, roleID); err != nil {
		return auth.User{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return auth.User{}, err
	}
	user.Roles = []string{"user"}
	return user, nil
}

func (r *Postgres) FindUserByEmail(ctx context.Context, email string) (auth.User, string, error) {
	var user auth.User
	var passwordHash string
	err := r.db.QueryRow(ctx, `SELECT u.id::text, u.email, u.name, u.status, COALESCE(u.password_hash, ''), COALESCE(array_agg(DISTINCT ro.code) FILTER (WHERE ro.code IS NOT NULL), '{}') FROM users u LEFT JOIN user_roles ur ON ur.user_id = u.id LEFT JOIN roles ro ON ro.id = ur.role_id WHERE u.email = $1 GROUP BY u.id`, email).Scan(&user.ID, &user.Email, &user.Name, &user.Status, &passwordHash, &user.Roles)
	return user, passwordHash, err
}

func (r *Postgres) CreateSession(ctx context.Context, userID, tokenHash string, expiresAt time.Time) error {
	_, err := r.db.Exec(ctx, `INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`, userID, tokenHash, expiresAt)
	return err
}

func (r *Postgres) FindSessionPrincipal(ctx context.Context, tokenHash string) (auth.Principal, error) {
	var principal auth.Principal
	err := r.db.QueryRow(ctx, `SELECT u.id::text, COALESCE(array_agg(DISTINCT ro.code) FILTER (WHERE ro.code IS NOT NULL), ARRAY[]::text[]) FROM sessions s JOIN users u ON u.id = s.user_id LEFT JOIN user_roles ur ON ur.user_id = u.id LEFT JOIN roles ro ON ro.id = ur.role_id WHERE s.token_hash = $1 AND s.expires_at > now() AND u.status = 'active' GROUP BY u.id`, tokenHash).Scan(&principal.UserID, &principal.Roles)
	if err == nil {
		_, _ = r.db.Exec(ctx, `UPDATE sessions SET last_seen_at = now() WHERE token_hash = $1`, tokenHash)
	}
	return principal, err
}

func (r *Postgres) DeleteSession(ctx context.Context, tokenHash string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM sessions WHERE token_hash = $1`, tokenHash)
	return err
}

func (r *Postgres) Roles(ctx context.Context, workspaceID string) ([]domain.Role, error) {
	rows, err := r.db.Query(ctx, `SELECT id::text, slug, name, name, description FROM recruitment_roles WHERE workspace_id = $1 AND is_public = true ORDER BY created_at`, workspaceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	roles := make([]domain.Role, 0)
	for rows.Next() {
		var role domain.Role
		if err := rows.Scan(&role.ID, &role.Slug, &role.Name, &role.ShortName, &role.Description); err != nil {
			return nil, err
		}
		roles = append(roles, role)
	}
	return roles, rows.Err()
}

func (r *Postgres) Applications(ctx context.Context, workspaceID string) ([]domain.Application, error) {
	rows, err := r.db.Query(ctx, `SELECT a.id::text, u.name, rr.name, rr.slug, a.status, COALESCE(a.submitted_at, a.created_at), '' FROM applications a JOIN users u ON u.id = a.applicant_user_id JOIN recruitment_roles rr ON rr.id = a.intended_role_id WHERE a.workspace_id = $1 ORDER BY a.updated_at DESC LIMIT 100`, workspaceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	applications := make([]domain.Application, 0)
	for rows.Next() {
		var item domain.Application
		if err := rows.Scan(&item.ID, &item.ApplicantName, &item.Role, &item.RoleSlug, &item.Status, &item.SubmittedAt, &item.Summary); err != nil {
			return nil, err
		}
		applications = append(applications, item)
	}
	return applications, rows.Err()
}

func (r *Postgres) Tasks(ctx context.Context, workspaceID string) ([]domain.Task, error) {
	rows, err := r.db.Query(ctx, `SELECT id::text, COALESCE(type, 'processing'), status, status, updated_at::text FROM processing_tasks WHERE workspace_id = $1 ORDER BY updated_at DESC LIMIT 100`, workspaceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	tasks := make([]domain.Task, 0)
	for rows.Next() {
		var item domain.Task
		if err := rows.Scan(&item.ID, &item.Title, &item.Status, &item.Stage, &item.UpdatedAt); err != nil {
			return nil, err
		}
		tasks = append(tasks, item)
	}
	return tasks, rows.Err()
}

func (r *Postgres) Dashboard(ctx context.Context, workspaceID string) (domain.Dashboard, error) {
	applications, err := r.Applications(ctx, workspaceID)
	if err != nil {
		return domain.Dashboard{}, err
	}
	tasks, err := r.Tasks(ctx, workspaceID)
	if err != nil {
		return domain.Dashboard{}, err
	}
	dashboard := domain.Dashboard{RecentApplications: applications, Tasks: tasks}
	for _, app := range applications {
		if app.Status == "submitted" {
			dashboard.PendingReview++
		}
	}
	for _, task := range tasks {
		if task.Status == "processing" {
			dashboard.Processing++
		}
		if task.Status == "failed" {
			dashboard.Failed++
		}
	}
	return dashboard, nil
}
