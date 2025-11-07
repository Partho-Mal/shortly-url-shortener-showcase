// Package security provides defensive mechanisms such as rate limiting,
// input validation, and abuse prevention logic for the backend services.
package security

import (
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
	"go_backend/internal/storage"
)

// ctx is a shared Redis context for rate limiting operations.
var ctx = storage.Ctx

// Configuration constants and defaults.
var (
	rateLimitKeyPrefix = "ratelimit:"
	maxRequests        = mustGetEnvInt("RATE_LIMIT_MAX", 30) // 30 requests/minute/IP
	rateLimitWindow    = time.Minute
)

// AllowRequest enforces Redis-backed rate limiting based on client IP.
// It returns (allowed, retryAfterSeconds).
//
// If Redis is unavailable, the function fails open (allows the request)
// to avoid denying legitimate traffic during infrastructure issues.
func AllowRequest(r *http.Request) (bool, int) {
	ip := clientIP(r)
	key := rateLimitKeyPrefix + ip

	client := storage.RedisClient
	if client == nil {
		// Redis not initialized; allow by default
		return true, 0
	}

	count, err := client.Get(ctx, key).Int()
	if err != nil && err != redis.Nil {
		return true, 0 // fail open on Redis error
	}

	if count >= maxRequests {
		ttl, err := client.TTL(ctx, key).Result()
		if err != nil || ttl < 0 {
			return false, 60 // fallback retry window
		}
		return false, int(ttl.Seconds())
	}

	pipe := client.TxPipeline()
	pipe.Incr(ctx, key)
	pipe.Expire(ctx, key, rateLimitWindow)
	_, err = pipe.Exec(ctx)
	if err != nil {
		return true, 0 // fail open if Redis pipeline fails
	}

	return true, 0
}

// clientIP extracts the real client IP address from the request,
// respecting the X-Forwarded-For header when behind a proxy.
func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		parts := strings.Split(xff, ",")
		return strings.TrimSpace(parts[0])
	}
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}

// mustGetEnvInt reads an environment variable as integer or returns fallback.
func mustGetEnvInt(env string, fallback int) int {
	val := os.Getenv(env)
	if val == "" {
		return fallback
	}
	v, err := strconv.Atoi(val)
	if err != nil {
		return fallback
	}
	return v
}
