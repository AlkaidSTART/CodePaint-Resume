package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

var ErrInvalidCredentials = errors.New("invalid credentials")

type User struct {
	ID     string   `json:"id"`
	Email  string   `json:"email"`
	Name   string   `json:"name"`
	Roles  []string `json:"roles"`
	Status string   `json:"status"`
}

type SessionStore interface {
	CreateUser(ctx context.Context, email, name, passwordHash string) (User, error)
	FindUserByEmail(ctx context.Context, email string) (User, string, error)
	CreateSession(ctx context.Context, userID, tokenHash string, expiresAt time.Time) error
	FindSessionPrincipal(ctx context.Context, tokenHash string) (Principal, error)
	DeleteSession(ctx context.Context, tokenHash string) error
}

type Service struct {
	store SessionStore
	clock func() time.Time
}

func NewService(store SessionStore) *Service { return &Service{store: store, clock: time.Now} }

func (s *Service) Register(ctx context.Context, email, name, password string) (User, string, error) {
	if !strings.Contains(email, "@") || len(password) < 8 || strings.TrimSpace(name) == "" {
		return User{}, "", ErrInvalidCredentials
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return User{}, "", err
	}
	user, err := s.store.CreateUser(ctx, strings.ToLower(strings.TrimSpace(email)), strings.TrimSpace(name), string(hash))
	if err != nil {
		return User{}, "", err
	}
	token, err := s.createSession(ctx, user.ID)
	return user, token, err
}

func (s *Service) Login(ctx context.Context, email, password string) (User, string, error) {
	user, hash, err := s.store.FindUserByEmail(ctx, strings.ToLower(strings.TrimSpace(email)))
	if err != nil || user.Status != "active" || bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) != nil {
		return User{}, "", ErrInvalidCredentials
	}
	token, err := s.createSession(ctx, user.ID)
	return user, token, err
}

func (s *Service) Principal(ctx context.Context, token string) (Principal, error) {
	if token == "" {
		return Principal{}, ErrInvalidCredentials
	}
	return s.store.FindSessionPrincipal(ctx, hashToken(token))
}

func (s *Service) Logout(ctx context.Context, token string) error {
	if token == "" {
		return nil
	}
	return s.store.DeleteSession(ctx, hashToken(token))
}

func (s *Service) createSession(ctx context.Context, userID string) (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	token := hex.EncodeToString(bytes)
	expiresAt := s.clock().Add(7 * 24 * time.Hour)
	return token, s.store.CreateSession(ctx, userID, hashToken(token), expiresAt)
}

func hashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}
