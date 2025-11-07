// Package urls provides URL shortening, redirect, and caching functionality.
//
// It is designed to be minimal, safe, and idiomatic according to Google Go style.
// Redis is used for caching, and PostgreSQL is used for persistent storage.
package urls

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"go_backend/internal/models"
	"go_backend/internal/security"
	"go_backend/internal/storage"
	"go_backend/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// SlugCache represents a cached URL entry.
type SlugCache struct {
	URL    string `json:"url"`
	ID     string `json:"id"`
	UserID string `json:"user_id"`
	Plan   string `json:"plan"`
}

// getBaseURLFromRequest returns the full base URL from the request or environment.
func getBaseURLFromRequest(c *gin.Context) string {
	if baseURL := os.Getenv("BASE_URL"); baseURL != "" {
		return baseURL
	}
	scheme := "http"
	if c.Request.TLS != nil {
		scheme = "https"
	}
	return fmt.Sprintf("%s://%s", scheme, c.Request.Host)
}

// ShortenPublicURL creates a public (unauthenticated) short URL.
// The generated URL automatically expires after 2 weeks.
func ShortenPublicURL(c *gin.Context) {
	var input models.URLRequest
	if err := c.ShouldBindJSON(&input); err != nil || input.OriginalURL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	db := storage.GetPostgres()

	// Generate a unique slug for the URL
	slug, err := utils.GenerateUniqueSlug(db, input.Slug, 8)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	urlID := uuid.NewString()
	expiry := time.Now().Add(14 * 24 * time.Hour) // 2-week expiry

	// Insert URL into the database with expires_at
	_, err = db.Exec(`
		INSERT INTO urls (id, original_url, slug, created_at, expires_at)
		VALUES ($1, $2, $3, $4, $5)
	`, urlID, input.OriginalURL, slug, time.Now(), expiry)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database insert failed"})
		return
	}

	// Cache the URL in Redis with the same TTL
	cacheValue := SlugCache{
		URL:  utils.EnsureProtocol(input.OriginalURL),
		ID:   urlID,
		Plan: "default",
	}
	jsonVal, _ := json.Marshal(cacheValue)
	cacheKey := "slug:" + slug
	cacheTTL := 24 * time.Hour // 24hour expiry in redis
	if err := storage.RedisClient.Set(storage.Ctx, cacheKey, jsonVal, cacheTTL).Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis caching failed"})
		return
	}

	baseURL := getBaseURLFromRequest(c)
	c.JSON(http.StatusOK, gin.H{
		"slug":      slug,
		"short_url": baseURL + "/" + slug,
	})
}

// ShortenURL handles authenticated URL shortening requests.
// It validates the user, generates a unique slug, stores the URL in Postgres,
// caches the result in Redis, and returns the shortened URL.
func ShortenURL(c *gin.Context) {
	var input models.URLRequest
	if err := c.ShouldBindJSON(&input); err != nil || input.OriginalURL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Authenticate the user via JWT cookie
	claims, err := security.ValidateJWTFromCookie(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	db := storage.GetPostgres()

	// Generate a unique slug
	slug, err := utils.GenerateUniqueSlug(db, input.Slug, 8)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	// Insert the new URL into the database
	urlID := uuid.NewString()
	_, err = db.Exec(`
		INSERT INTO urls (id, user_id, original_url, slug, created_at)
		VALUES ($1, $2, $3, $4, $5)`,
		urlID, claims.UserID, input.OriginalURL, slug, time.Now())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database insert failed"})
		return
	}

	// Cache the slug in Redis for fast retrieval
	cacheValue := SlugCache{
		URL:    utils.EnsureProtocol(input.OriginalURL),
		ID:     urlID,
		UserID: claims.UserID,
	}
	jsonVal, _ := json.Marshal(cacheValue)
	cacheKey := "slug:" + slug
	ttl := 24 * time.Hour // default TTL
	if err := storage.RedisClient.Set(storage.Ctx, cacheKey, jsonVal, ttl).Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis caching failed"})
		return
	}

	// Return the shortened URL
	baseURL := getBaseURLFromRequest(c)
	c.JSON(http.StatusOK, gin.H{
		"slug":      slug,
		"short_url": baseURL + "/" + slug,
	})
}

// RedirectURL redirects a short slug to its original URL.
// Caching via Redis is used to reduce DB load.
func RedirectURL(c *gin.Context) {
	slug := c.Param("slug")
	db := storage.GetPostgres()

	cacheKey := "slug:" + slug
	var cached SlugCache
	val, err := storage.RedisClient.Get(storage.Ctx, cacheKey).Result()
	if err == nil && json.Unmarshal([]byte(val), &cached) == nil {
		c.Redirect(http.StatusFound, cached.URL)
		return
	}

	var urlID, originalURL string
	err = db.QueryRow(`SELECT id, original_url FROM urls WHERE slug = $1`, slug).Scan(&urlID, &originalURL)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		}
		return
	}

	originalURL = utils.EnsureProtocol(originalURL)
	cacheValue := SlugCache{
		URL: originalURL,
		ID:  urlID,
	}
	jsonVal, _ := json.Marshal(cacheValue)
	_ = storage.RedisClient.Set(storage.Ctx, cacheKey, jsonVal, 6*time.Hour).Err()

	c.Redirect(http.StatusFound, originalURL)
}
