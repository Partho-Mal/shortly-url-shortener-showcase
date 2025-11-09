// Package router configures and registers HTTP routes for the Shortly backend.
//
// It follows Google-style Go conventions:
//   - Each handler lives in its own package (auth, urls, users)
//   - Middleware is applied globally in correct order
//   - No side effects or global state are introduced here.
package router

import (
	"net/http"

	"go_backend/internal/handlers/auth"
	"go_backend/internal/handlers/urls"
	"go_backend/internal/handlers/users"
	"go_backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRouter wires all routes and middleware.
// It should be called once from cmd/server/main.go.
func SetupRouter(r *gin.Engine) *gin.Engine {
	// Register global middleware.
	r.Use(
		middleware.CORSMiddleware(),
		middleware.BlockBadRequests(),
		middleware.RateLimitMiddleware(),
	)

	// Register health and root routes.
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "shortly.streamlab backend running"})
	})
	r.GET("/health", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	// Register public URL routes.
	r.POST("/shorten", urls.ShortenPublicURL)
	r.GET("/:slug", urls.RedirectURL)

	// Register authentication routes.
	r.GET("/google/login", auth.GoogleLogin)
	r.GET("/google/callback", auth.GoogleCallback)
	r.POST("/register", auth.Register)
	r.POST("/login", auth.Login)
	
	// Register protected API routes.
	api := r.Group("/api")
	{
		api.POST("/publicshorturl", urls.ShortenPublicURL)
		api.POST("/set-cookie", auth.SetCookieHandler)
		api.GET("/validate", auth.Validate)
		api.POST("/logout", middleware.AuthMiddleware(), auth.Logout)
		api.POST("/user/shorten", middleware.AuthMiddleware(), urls.ShortenURL)
		api.POST("/delete/shortlink", middleware.AuthMiddleware(), urls.DeleteShortlink)
		api.GET("/user/details", middleware.AuthMiddleware(), users.GetUserDetails)
		api.GET("/user/shortlinks", middleware.AuthMiddleware(), users.GetUserShortLinks)
	}

	// Ignore favicon requests.
	r.GET("/favicon.ico", func(c *gin.Context) {
		c.Status(204) // 204 No Content
	})

	return r
}
