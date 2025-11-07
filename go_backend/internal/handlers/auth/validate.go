package auth

import (
	"go_backend/internal/security"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// Validate checks the Authorization header for a valid JWT.
// Returns the user ID if the token is valid.
func Validate(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing or malformed Authorization header"})
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")
	claims, err := security.ValidateJWTFromString(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Session valid",
		"userID":  claims.UserID,
	})
}
