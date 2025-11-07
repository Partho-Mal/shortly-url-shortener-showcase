// Package auth provides HTTP handlers for user authentication operations
// including login, logout, and token validation.
package auth

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// Logout clears the user's JWT cookie and ends the session.
// It dynamically adjusts cookie behavior for localhost and production environments.
func Logout(c *gin.Context) {
	frontendOrigin := os.Getenv("FRONTEND_ORIGIN")
	if frontendOrigin == "" {
		frontendOrigin = "http://localhost:3000"
	}

	isLocal := strings.Contains(frontendOrigin, "localhost")

	// Default: development settings
	cookieDomain := "localhost"
	secure := false
	sameSite := http.SameSiteLaxMode

	// Production adjustments
	if !isLocal {
		cookieDomain = strings.TrimPrefix(strings.TrimPrefix(frontendOrigin, "https://"), "http://")
		cookieDomain = strings.Split(cookieDomain, ":")[0] // strip port if any
		secure = true
		sameSite = http.SameSiteNoneMode
	}

	// Invalidate cookie by setting MaxAge < 0
	c.SetSameSite(sameSite)
	c.SetCookie("token", "", -1, "/", cookieDomain, secure, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Logged out successfully",
	})
}
