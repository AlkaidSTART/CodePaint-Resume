package httpserver

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestDocsEndpoints(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	registerDocs(r)

	t.Run("GET /openapi.yaml returns spec", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/openapi.yaml", nil)
		rec := httptest.NewRecorder()
		r.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d", rec.Code)
		}
		contentType := rec.Header().Get("Content-Type")
		if !strings.Contains(contentType, "application/yaml") {
			t.Fatalf("expected application/yaml content-type, got %s", contentType)
		}
		if !strings.Contains(rec.Body.String(), "ResumeFlow API") {
			t.Fatalf("expected body to contain 'ResumeFlow API'")
		}
	})

	t.Run("GET /docs returns scalar html", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/docs", nil)
		rec := httptest.NewRecorder()
		r.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d", rec.Code)
		}
		contentType := rec.Header().Get("Content-Type")
		if !strings.Contains(contentType, "text/html") {
			t.Fatalf("expected text/html content-type, got %s", contentType)
		}
		if !strings.Contains(rec.Body.String(), "@scalar/api-reference") {
			t.Fatalf("expected body to contain '@scalar/api-reference'")
		}
	})
}
