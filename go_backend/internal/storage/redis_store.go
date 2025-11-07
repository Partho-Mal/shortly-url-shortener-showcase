// Package storage provides initialization and shared connections for
// persistent storage systems such as PostgreSQL and Redis.
package storage

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
)

var (
	// RedisClient is the global Redis connection instance.
	RedisClient *redis.Client

	// Ctx is the global Redis context used for background operations.
	Ctx = context.Background()
)

// InitRedis initializes and verifies the Redis client connection using
// the REDIS_URL environment variable. It terminates the application
// if the connection cannot be established.
func InitRedis() error {
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		return fmt.Errorf("redis: REDIS_URL environment variable not set")
	}

	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		return fmt.Errorf("redis: failed to parse Redis URL: %w", err)
	}

	RedisClient = redis.NewClient(opt)

	if _, err := RedisClient.Ping(Ctx).Result(); err != nil {
		return fmt.Errorf("redis: connection failed: %w", err)
	}

	log.Println("redis: connection established successfully")
	return nil
}
