// Package main provides a lightweight test server entrypoint for Shortly.
//
// This entrypoint is designed for performance, integration, and load testing.
// It avoids rate limits and heavy middleware to allow pure benchmarking.
//
// Usage:
//
//	# Step 1: Go to project root
//	cd go_backend
//
//	# Step 2: Start Redis via Docker
//	docker compose up -d
//
//	# Step 3: (Optional) Comment out RateLimitMiddleware() in router.go for better benchmarking
//
//	# Step 4: Run the test server with the test environment file
//	go run ./cmd/server_test --env=.env.test
//
//	# Step 5: Run load tests using 'hey'
//	$(go env GOPATH)/bin/hey -n 10000 -c 500 http://localhost:8080/test
//	$(go env GOPATH)/bin/hey -n 5000 -c 200 -m POST -H "Content-Type: application/json" \
//	    -d '{"url": "https://example.com"}' http://localhost:8080/shorten
//
//	# Step 6: Cleanup
//	docker compose down
//	docker system prune -a
package main

import (
	"flag"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"go_backend/internal/storage"
	"go_backend/router"
)

// RunTestServer initializes and runs a simplified Gin server
// configured for load and integration testing.
func RunTestServer() {
	envFile := flag.String("env", ".env.test", "path to environment file to load")
	flag.Parse()

	// Load test environment variables.
	if err := godotenv.Load(*envFile); err != nil {
		log.Printf("could not load %s: %v", *envFile, err)
	} else {
		log.Printf("loaded environment: %s", *envFile)
	}

	// Initialize Redis connection.
	storage.InitRedis()

	// Determine port from environment or fallback.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Create a new Gin engine for testing.
	r := gin.New()
	r.Use(gin.Recovery()) // no logger for accurate benchmarking

	// Register all routes.
	r = router.SetupRouter(r)

	log.Printf("test server running on port http://localhost:%s (env: %s)", port, *envFile)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("failed to start test server: %v", err)
	}
}

// main serves as the entrypoint to run the test server.
func main() {
	RunTestServer()
}
