package auth

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestAuthenticateDoesNotTrustDemoHeaderWhenDisabled(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(Authenticate(false))
	r.GET("/workspace", RequireRole("recruiter"), func(c *gin.Context) { c.Status(http.StatusNoContent) })

	req := httptest.NewRequest(http.MethodGet, "/workspace", nil)
	req.Header.Set("X-Demo-Role", "recruiter")
	recorder := httptest.NewRecorder()
	r.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusForbidden {
		t.Fatalf("expected 403 when demo auth is disabled, got %d", recorder.Code)
	}
}

func TestAuthenticateAcceptsDemoHeaderWhenEnabled(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(Authenticate(true))
	r.GET("/workspace", RequireRole("recruiter"), func(c *gin.Context) { c.Status(http.StatusNoContent) })

	req := httptest.NewRequest(http.MethodGet, "/workspace", nil)
	req.Header.Set("X-Demo-Role", "recruiter")
	recorder := httptest.NewRecorder()
	r.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusNoContent {
		t.Fatalf("expected demo recruiter request to pass, got %d", recorder.Code)
	}
}
