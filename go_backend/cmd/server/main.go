// Command server runs the main HTTP server for the Go backend.
//
// Usage:
//   go run cmd/server/main.go --env=.env
package main

import (
	"flag"
	"go_backend/internal/storage"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	// Load environment
	envFile := flag.String("env", ".env", "environment file to load")
	flag.Parse()

	// Try loading environment variables. Ignore errors in Docker.
	if err := godotenv.Load(*envFile); err != nil {
		log.Printf("could not load %s %v", *envFile, err)
	} else {
		log.Printf("loaded environment from %s", *envFile)
	}

	// Optimize runtime performance
	gin.SetMode(gin.ReleaseMode)

	// Initialize external services (e.g., Redis, Database)
	if err := storage.InitRedis(); err != nil {
		log.Fatalf("Redis initialization falied: %v", err)
	}

	// Configuration (with Docker-friendly fallbacks)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	trustedProxy := os.Getenv("TRUSTED_PROXY")
	if trustedProxy == "" {
		trustedProxy = "0.0.0.0" 
	}

	// Setup Gin router
	routerEngine := gin.New()
	routerEngine.Use(gin.Logger(), gin.Recovery())

	if err := routerEngine.SetTrustedProxies([]string{trustedProxy}); err != nil {
		log.Fatalf("Failed to set trusted proxies: %v", err)
	}

	// Load routes from router package
	routerEngine = router.SetupRouter(routerEngine)

	// Start HTTP server
	log.Printf("Server starting on :%s", port)

	if err := routerEngine.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v")
	}
}
