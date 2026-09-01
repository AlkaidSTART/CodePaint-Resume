package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Principal struct {
	UserID string
	Roles  []string
}

const principalKey = "auth.principal"

// Authenticate is the API-side boundary for session or bearer-token parsing.
// The demo header keeps local development runnable until a persistent session store is wired.
func Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		role := c.GetHeader("X-Demo-Role")
		if role != "" {
			c.Set(principalKey, Principal{UserID: "usr_demo", Roles: []string{role}})
		}
		c.Next()
	}
}

func RequireRole(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		principal, ok := PrincipalFromContext(c)
		if !ok || !hasRole(principal, role) {
			c.JSON(http.StatusForbidden, gin.H{
				"data":       nil,
				"error":      gin.H{"code": "FORBIDDEN", "message": "需要招新成员权限"},
				"request_id": "req_local_demo",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}

func PrincipalFromContext(c *gin.Context) (Principal, bool) {
	value, exists := c.Get(principalKey)
	if !exists {
		return Principal{}, false
	}
	principal, ok := value.(Principal)
	return principal, ok
}

func hasRole(principal Principal, role string) bool {
	for _, candidate := range principal.Roles {
		if candidate == role {
			return true
		}
	}
	return false
}
