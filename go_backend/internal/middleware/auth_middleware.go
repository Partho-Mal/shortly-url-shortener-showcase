// Package middleware provides reusable Gin middleware for authentication,
// CORS handling, rate limiting, and request blocking.
package middleware

import (
	"go_backend/internal/security"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("middleware: .env file not found, using system environment variables")
	}
}

// AuthMiddleware validates the JWT token from a cookie or header
// and ensures the user is authenticated before accessing protected routes.
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, err := security.ValidateJWTFromCookie(c)
		if err != nil {
			log.Printf("auth: invalid JWT: %v", err)

			if cookie, err := c.Request.Cookie("token"); err != nil {
				log.Println("auth: no token cookie found")
			} else {
				log.Printf("auth: cookie found: %s", cookie.Value)
			}

			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		log.Printf("auth: JWT valid — userID=%s", claims.UserID)
		c.Set("userID", claims.UserID)
		c.Next()
	}
}

// CORSMiddleware configures CORS headers dynamically depending on the
// environment (development vs production). It allows localhost for local testing.
func CORSMiddleware() gin.HandlerFunc {
	allowedOrigin := os.Getenv("FRONTEND_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:3000"
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		if origin == allowedOrigin || strings.Contains(origin, "localhost") {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		}

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

// RateLimitMiddleware enforces a simple per-IP rate limit to
// prevent abuse and excessive API requests.
func RateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		allowed, retryAfter := security.AllowRequest(c.Request)
		if !allowed {
			c.Header("Retry-After", strconv.Itoa(retryAfter))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error":       "too many requests",
				"retry_after": retryAfter,
			})
			return
		}
		c.Next()
	}
}
