package repository

import (
	"time"

	"github.com/codepaint-studio/resumeflow/apps/api/internal/domain"
)

type RecruitmentRepository interface {
	Roles() []domain.Role
	Dashboard() domain.Dashboard
	Applications() []domain.Application
	Tasks() []domain.Task
}

type demoRepository struct {
	roles []domain.Role
	data  domain.Dashboard
}

func NewDemo() RecruitmentRepository {
	tasks := []domain.Task{{ID: "task_001", Title: "林同学_resume.pdf", Status: "completed", Stage: "校验完成", UpdatedAt: "今天 09:12"}}
	applications := []domain.Application{{ID: "app_001", ApplicantName: "林同学", Role: "工程", RoleSlug: "engineering", Status: "submitted", SubmittedAt: time.Now().Format(time.RFC3339), Summary: "希望参与工具开发", Skills: []string{"Go", "React", "PostgreSQL"}, Score: 89}}
	return &demoRepository{
		roles: []domain.Role{
			{ID: "role_engineering", Slug: "engineering", Name: "工程", ShortName: "Engineering", Description: "做产品、工具和实验，把想法变成可使用的东西。"},
			{ID: "role_design", Slug: "design", Name: "设计", ShortName: "Design", Description: "让复杂的想法变得清楚、好用，也有自己的性格。"},
			{ID: "role_content", Slug: "content", Name: "内容", ShortName: "Content", Description: "把正在发生的事情讲清楚，让好想法被更多人看见。"},
		},
		data: domain.Dashboard{PendingReview: 12, Processing: 4, Failed: 1, NewThisWeek: 21, RecentApplications: applications, Tasks: tasks},
	}
}

func (r *demoRepository) Roles() []domain.Role               { return r.roles }
func (r *demoRepository) Dashboard() domain.Dashboard        { return r.data }
func (r *demoRepository) Applications() []domain.Application { return r.data.RecentApplications }
func (r *demoRepository) Tasks() []domain.Task               { return r.data.Tasks }
