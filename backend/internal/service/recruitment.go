package service

import (
	"context"
	"github.com/codepaint-studio/resumeflow/backend/internal/domain"
	"github.com/codepaint-studio/resumeflow/backend/internal/repository"
)

type RecruitmentService struct {
	repo repository.RecruitmentRepository
}

func NewRecruitment(repo repository.RecruitmentRepository) *RecruitmentService {
	return &RecruitmentService{repo: repo}
}

func (s *RecruitmentService) Roles(ctx context.Context, workspaceID string) ([]domain.Role, error) {
	return s.repo.Roles(ctx, workspaceID)
}
func (s *RecruitmentService) Dashboard(ctx context.Context, workspaceID string) (domain.Dashboard, error) {
	return s.repo.Dashboard(ctx, workspaceID)
}
func (s *RecruitmentService) Applications(ctx context.Context, workspaceID string) ([]domain.Application, error) {
	return s.repo.Applications(ctx, workspaceID)
}
func (s *RecruitmentService) Tasks(ctx context.Context, workspaceID string) ([]domain.Task, error) {
	return s.repo.Tasks(ctx, workspaceID)
}
