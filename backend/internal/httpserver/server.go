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

type registerRequest struct {
	Email    string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"password"`
}
type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func New(cfg config.Config, recruitment *service.RecruitmentService, authService *auth.Service) *Server {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery(), auth.Authenticate(cfg.AllowDemoAuth, authService))
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
	v1.POST("/auth/register", func(c *gin.Context) { register(c, authService, cfg.CookieSecure) })
	v1.POST("/auth/login", func(c *gin.Context) { login(c, authService, cfg.CookieSecure) })
	v1.POST("/auth/logout", func(c *gin.Context) { logout(c, authService, cfg.CookieSecure) })
	v1.GET("/auth/me", func(c *gin.Context) {
		principal, ok := auth.PrincipalFromContext(c)
		if !ok {
			respondError(c, http.StatusUnauthorized, "AUTH_REQUIRED", "需要登录")
			return
		}
		respond(c, http.StatusOK, gin.H{"id": principal.UserID, "roles": principal.Roles})
	})
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

func register(c *gin.Context, authService *auth.Service, secure bool) {
	if authService == nil {
		respondError(c, http.StatusNotImplemented, "AUTH_NOT_CONFIGURED", "认证服务尚未配置")
		return
	}
	var input registerRequest
	if c.ShouldBindJSON(&input) != nil {
		respondError(c, http.StatusUnprocessableEntity, "VALIDATION_FAILED", "注册信息无效")
		return
	}
	user, token, err := authService.Register(c.Request.Context(), input.Email, input.Name, input.Password)
	if err != nil {
		respondError(c, http.StatusUnprocessableEntity, "VALIDATION_FAILED", "注册信息无效")
		return
	}
	setSessionCookie(c, token, secure)
	respond(c, http.StatusCreated, gin.H{"user": user})
}

func login(c *gin.Context, authService *auth.Service, secure bool) {
	if authService == nil {
		respondError(c, http.StatusNotImplemented, "AUTH_NOT_CONFIGURED", "认证服务尚未配置")
		return
	}
	var input loginRequest
	if c.ShouldBindJSON(&input) != nil {
		respondError(c, http.StatusUnprocessableEntity, "VALIDATION_FAILED", "登录信息无效")
		return
	}
	user, token, err := authService.Login(c.Request.Context(), input.Email, input.Password)
	if err != nil {
		respondError(c, http.StatusUnauthorized, "INVALID_CREDENTIALS", "邮箱或密码错误")
		return
	}
	setSessionCookie(c, token, secure)
	respond(c, http.StatusOK, gin.H{"user": user})
}

func logout(c *gin.Context, authService *auth.Service, secure bool) {
	if authService != nil {
		if cookie, err := c.Cookie("codepaint_session"); err == nil {
			_ = authService.Logout(c.Request.Context(), cookie)
		}
	}
	http.SetCookie(c.Writer, &http.Cookie{Name: "codepaint_session", Value: "", Path: "/", MaxAge: -1, HttpOnly: true, Secure: secure, SameSite: http.SameSiteLaxMode})
	c.Status(http.StatusNoContent)
}

func setSessionCookie(c *gin.Context, token string, secure bool) {
	http.SetCookie(c.Writer, &http.Cookie{Name: "codepaint_session", Value: token, Path: "/", MaxAge: 7 * 24 * 60 * 60, HttpOnly: true, Secure: secure, SameSite: http.SameSiteLaxMode})
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

func respondError(c *gin.Context, status int, code, message string) {
	c.JSON(status, gin.H{"data": nil, "error": gin.H{"code": code, "message": message}, "request_id": c.GetString("request_id")})
}
