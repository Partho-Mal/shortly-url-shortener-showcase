// Package utils provides helper functions for authentication,
// cookie handling, password hashing, and other utility operations.
package utils

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// SetAuthCookie sets a secure authentication cookie containing the JWT token.
// It automatically adjusts domain, SameSite, and security settings depending
// on whether the environment is local or production.
func SetAuthCookie(c *gin.Context, token string) {
	frontendOrigin := os.Getenv("FRONTEND_ORIGIN")

	var cookieDomain string
	var secure bool
	var sameSite http.SameSite

	if frontendOrigin == "" {
		frontendOrigin = "http://localhost:3000"
	}

	if strings.Contains(frontendOrigin, "localhost") {
		cookieDomain = "localhost"
		secure = false
		sameSite = http.SameSiteLaxMode
	} else {
		// Use .env override or fallback to domain parsed from origin.
		cookieDomain = os.Getenv("COOKIE_DOMAIN")
		if cookieDomain == "" {
			cookieDomain = extractDomain(frontendOrigin)
		}
		secure = true
		sameSite = http.SameSiteNoneMode
	}

	c.SetSameSite(sameSite)
	c.SetCookie("token", token, 30*24*60*60, "/", cookieDomain, secure, true)
}

// extractDomain removes protocol prefixes (http/https) and any path suffixes
// from a given origin, returning only the clean domain name.
// Example: "https://app.example.com/landing" → "app.example.com".
func extractDomain(origin string) string {
	if strings.HasPrefix(origin, "http://") {
		origin = strings.TrimPrefix(origin, "http://")
	} else if strings.HasPrefix(origin, "https://") {
		origin = strings.TrimPrefix(origin, "https://")
	}

	// Remove trailing paths, if present.
	if idx := strings.Index(origin, "/"); idx != -1 {
		origin = origin[:idx]
	}
	return origin
}
