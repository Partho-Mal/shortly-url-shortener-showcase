// Package auth provides HTTP handlers for user authentication operations
// including login, logout, and token validation.
package auth

import (
	"go_backend/internal/storage"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// Logout clears the user's JWT cookie and ends the session.
// It dynamically adjusts cookie behavior for localhost and production environments.
// Logout clears the user's JWT cookie and removes the token from Redis.
// It dynamically adjusts cookie behavior for localhost and production environments.
func Logout(c *gin.Context) {
	// Retrieve token from cookie
	token, err := c.Cookie("token")
	if err == nil && token != "" {
		// Remove token from Redis
		if err := storage.RedisClient.Del(storage.Ctx, token).Err(); err != nil {
			// Log the error but don't block logout
			log.Printf("failed to delete token from Redis: %v", err)
		}
	}

	// Determine frontend origin
	frontendOrigin := os.Getenv("FRONTEND_ORIGIN")
	if frontendOrigin == "" {
		frontendOrigin = "http://localhost:3000"
	}

	isLocal := strings.Contains(frontendOrigin, "localhost")
	cookieDomain := "localhost"
	secure := false
	sameSite := http.SameSiteLaxMode

	if !isLocal {
		// Production domain adjustments
		cookieDomain = strings.Split(strings.TrimPrefix(strings.TrimPrefix(frontendOrigin, "https://"), "http://"), ":")[0]
		secure = true
		sameSite = http.SameSiteNoneMode
	}

	// Invalidate cookie by setting MaxAge < 0
	c.SetSameSite(sameSite)
	c.SetCookie("token", "", -1, "/", cookieDomain, secure, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "logged out successfully",
	})
}
