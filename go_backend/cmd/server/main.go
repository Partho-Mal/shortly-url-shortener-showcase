// Command server runs the main HTTP server for the Shortly backend.
//
// Usage:
//
// docker compose up postgres redis
//	go run cmd/server/main.go --env=.env
//	go run cmd/server/main.go --env=.env.local
//
// or
// docker compose run --service-ports shortly
package main

import (
	"flag"
	"go_backend/internal/storage"
	"go_backend/router"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from file (optional for Docker)
	envFile := flag.String("env", ".env", "path to environment file")
	flag.Parse()

	if err := godotenv.Load(*envFile); err != nil {
		log.Printf("server: could not load %s: %v", *envFile, err)
	} else {
		log.Printf("server: environment loaded from %s", *envFile)
	}

	// Use ReleaseMode for optimized production performance.
	gin.SetMode(gin.ReleaseMode)

	// Initialize external services.
	if err := storage.InitRedis(); err != nil {
		log.Fatalf("server: Redis initialization failed: %v", err)
	}

	// Read configuration values (Docker-friendly defaults).
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	trustedProxy := os.Getenv("TRUSTED_PROXY")
	if trustedProxy == "" {
		trustedProxy = "0.0.0.0"
	}

	// Create a new Gin router and attach middlewares.
	engine := gin.New()
	engine.Use(gin.Logger(), gin.Recovery())

	if err := engine.SetTrustedProxies([]string{trustedProxy}); err != nil {
		log.Fatalf("server: failed to set trusted proxies: %v", err)
	}

	// Register all routes.
	engine = router.SetupRouter(engine)

	// Start the HTTP server.
	log.Printf("server: starting on port http://localhost:%s", port)
	if err := engine.Run(":" + port); err != nil {
		log.Fatalf("server: startup failed: %v", err)
	}
}
