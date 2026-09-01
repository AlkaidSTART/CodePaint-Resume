package service

import (
	"github.com/codepaint-studio/resumeflow/apps/api/internal/domain"
	"github.com/codepaint-studio/resumeflow/apps/api/internal/repository"
)

type RecruitmentService struct {
	repo repository.RecruitmentRepository
}

func NewRecruitment(repo repository.RecruitmentRepository) *RecruitmentService {
	return &RecruitmentService{repo: repo}
}

func (s *RecruitmentService) Roles() []domain.Role               { return s.repo.Roles() }
func (s *RecruitmentService) Dashboard() domain.Dashboard        { return s.repo.Dashboard() }
func (s *RecruitmentService) Applications() []domain.Application { return s.repo.Applications() }
func (s *RecruitmentService) Tasks() []domain.Task               { return s.repo.Tasks() }
