package repository

import (
	"context"
	"fmt"

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
	rows, err := r.db.Query(ctx, `SELECT id::text, COALESCE(type, 'processing'), status, status, updated_at FROM processing_tasks WHERE workspace_id = $1 ORDER BY updated_at DESC LIMIT 100`, workspaceID)
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
