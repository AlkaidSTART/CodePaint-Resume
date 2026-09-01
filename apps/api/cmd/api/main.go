package main

import (
	"net/http"
	"os"
	"time"

	"github.com/codepaint-studio/resumeflow/apps/api/internal/auth"
	"github.com/gin-gonic/gin"
)

type Role struct {
	ID          string `json:"id"`
	Slug        string `json:"slug"`
	Name        string `json:"name"`
	ShortName   string `json:"shortName"`
	Description string `json:"description"`
}
type Application struct {
	ID            string   `json:"id"`
	ApplicantName string   `json:"applicantName"`
	Role          string   `json:"role"`
	RoleSlug      string   `json:"roleSlug"`
	Status        string   `json:"status"`
	SubmittedAt   string   `json:"submittedAt"`
	Summary       string   `json:"summary"`
	Skills        []string `json:"skills,omitempty"`
	Score         int      `json:"score,omitempty"`
}
type Task struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Status    string `json:"status"`
	Stage     string `json:"stage"`
	UpdatedAt string `json:"updatedAt"`
}

func respond(c *gin.Context, status int, data any) {
	c.JSON(status, gin.H{"data": data, "request_id": "req_local_demo"})
}
func main() {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())
	r.GET("/healthz", func(c *gin.Context) { respond(c, http.StatusOK, gin.H{"status": "ok", "service": "resumeflow-api"}) })
	r.Use(auth.Authenticate())
	v1 := r.Group("/api/v1")
	v1.GET("/public/recruitment", func(c *gin.Context) {
		respond(c, http.StatusOK, gin.H{"title": "一起把想法做成真正能运行的作品", "intro": "CodePaint Studio 2026 秋季招新"})
	})
	v1.GET("/public/recruitment/roles", func(c *gin.Context) {
		respond(c, http.StatusOK, []Role{{"role_engineering", "engineering", "工程", "Engineering", "做产品、工具和实验，把想法变成可使用的东西。"}, {"role_design", "design", "设计", "Design", "让复杂的想法变得清楚、好用，也有自己的性格。"}, {"role_content", "content", "内容", "Content", "把正在发生的事情讲清楚，让好想法被更多人看见。"}})
	})
	v1.POST("/auth/register", func(c *gin.Context) {
		respond(c, http.StatusCreated, gin.H{"user": gin.H{"id": "usr_demo", "roles": []string{"user"}, "status": "active"}})
	})
	v1.GET("/auth/me", func(c *gin.Context) { respond(c, http.StatusOK, gin.H{"user": nil}) })
	workspace := v1.Group("/workspace", auth.RequireRole("recruiter"))
	workspace.GET("/dashboard", func(c *gin.Context) {
		respond(c, http.StatusOK, gin.H{"pendingReview": 12, "processing": 4, "failed": 1, "newThisWeek": 21, "recentApplications": []Application{{"app_001", "林同学", "工程", "engineering", "submitted", time.Now().Format(time.RFC3339), "希望参与工具开发", []string{"Go", "React", "PostgreSQL"}, 89}}, "tasks": []Task{{"task_001", "林同学_resume.pdf", "completed", "校验完成", "今天 09:12"}}})
	})
	workspace.GET("/applicants", func(c *gin.Context) { respond(c, http.StatusOK, []Application{}) })
	workspace.GET("/tasks", func(c *gin.Context) { respond(c, http.StatusOK, []Task{}) })
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	_ = r.Run(":" + port)
}
