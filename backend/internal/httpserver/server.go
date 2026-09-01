package httpserver

import (
	"log"
	"net/http"

	"github.com/codepaint-studio/resumeflow/backend/internal/auth"
	"github.com/codepaint-studio/resumeflow/backend/internal/config"
	"github.com/codepaint-studio/resumeflow/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
	port   string
}

func New(cfg config.Config, recruitment *service.RecruitmentService) *Server {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery(), auth.Authenticate(cfg.AllowDemoAuth))
	r.GET("/healthz", func(c *gin.Context) { respond(c, http.StatusOK, gin.H{"status": "ok", "service": "resumeflow-api"}) })
	v1 := r.Group("/api/v1")
	v1.GET("/public/recruitment", func(c *gin.Context) {
		respond(c, http.StatusOK, gin.H{"title": "一起把想法做成真正能运行的作品", "intro": "CodePaint Studio 2026 秋季招新"})
	})
	v1.GET("/public/recruitment/roles", func(c *gin.Context) {
		roles, err := recruitment.Roles(c.Request.Context(), cfg.WorkspaceID)
		if err != nil {
			serverError(c, err)
			return
		}
		respond(c, http.StatusOK, roles)
	})
	v1.POST("/auth/register", func(c *gin.Context) {
		respond(c, http.StatusCreated, gin.H{"user": gin.H{"id": "usr_demo", "roles": []string{"user"}, "status": "active"}})
	})
	v1.GET("/auth/me", func(c *gin.Context) { respond(c, http.StatusOK, gin.H{"user": nil}) })
	workspace := v1.Group("/workspace", auth.RequireRole("recruiter"))
	workspace.GET("/dashboard", func(c *gin.Context) {
		data, err := recruitment.Dashboard(c.Request.Context(), cfg.WorkspaceID)
		if err != nil {
			serverError(c, err)
			return
		}
		respond(c, http.StatusOK, data)
	})
	workspace.GET("/applicants", func(c *gin.Context) {
		data, err := recruitment.Applications(c.Request.Context(), cfg.WorkspaceID)
		if err != nil {
			serverError(c, err)
			return
		}
		respond(c, http.StatusOK, data)
	})
	workspace.GET("/tasks", func(c *gin.Context) {
		data, err := recruitment.Tasks(c.Request.Context(), cfg.WorkspaceID)
		if err != nil {
			serverError(c, err)
			return
		}
		respond(c, http.StatusOK, data)
	})
	return &Server{router: r, port: cfg.Port}
}

func (s *Server) Run() error { return s.router.Run(":" + s.port) }

func respond(c *gin.Context, status int, data any) {
	c.JSON(status, gin.H{"data": data, "request_id": c.GetString("request_id")})
}

func serverError(c *gin.Context, err error) {
	log.Printf("request_id=%s internal_error=%v", c.GetString("request_id"), err)
	c.JSON(http.StatusInternalServerError, gin.H{
		"data":       nil,
		"error":      gin.H{"code": "INTERNAL_ERROR", "message": "服务暂时不可用"},
		"request_id": c.GetString("request_id"),
	})
}
