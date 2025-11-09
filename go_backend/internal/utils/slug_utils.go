// Package utils provides helper functions for URL shortening,
// user plan checks, and general utility operations.
package utils

import (
	"crypto/rand"
	"database/sql"
	"errors"
	"math/big"
	"strings"
)

const (
	slugCharset     = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	maxSlugAttempts = 5
)

// GenerateRandomSlug returns a cryptographically secure random Base62 slug of the specified length.
func GenerateRandomSlug(length int) (string, error) {
	slug := make([]byte, length)
	for i := 0; i < length; i++ {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(slugCharset))))
		if err != nil {
			return "", err
		}
		slug[i] = slugCharset[n.Int64()]
	}
	return string(slug), nil
}

// GenerateUniqueSlug generates a unique slug by checking the database.
// If custom is provided, it validates availability; otherwise, it generates random slugs.
func GenerateUniqueSlug(db *sql.DB, custom string, length int) (string, error) {
	if custom != "" {
		available, err := IsSlugAvailable(db, custom)
		if err != nil {
			return "", err
		}
		if !available {
			return "", errors.New("custom slug already in use")
		}
		return custom, nil
	}

	for i := 0; i < maxSlugAttempts; i++ {
		slug, err := GenerateRandomSlug(length)
		if err != nil {
			return "", err
		}

		available, err := IsSlugAvailable(db, slug)
		if err != nil {
			return "", err
		}
		if available {
			return slug, nil
		}
	}


	return "", errors.New("failed to generate a unique slug after multiple attempts")
}

// IsSlugAvailable checks if the slug already exists in the database.
func IsSlugAvailable(db *sql.DB, slug string) (bool, error) {
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM urls WHERE slug = $1)", slug).Scan(&exists)
	if err != nil {
		return false, err
	}
	return !exists, nil
}

// CanUserShortenMore checks if a user has not exceeded their allowed number of shortened URLs.
// Limit applies to non-pro users.
func CanUserShortenMore(db *sql.DB, userID string, limit int) (bool, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM urls WHERE user_id=$1", userID).Scan(&count)
	if err != nil {
		return false, err
	}
	return count < limit, nil
}

// IsUserPro returns true if the user has a pro plan.
func IsUserPro(db *sql.DB, userID string) bool {
	var plan string
	err := db.QueryRow("SELECT plan FROM users WHERE id = $1", userID).Scan(&plan)
	return err == nil && strings.ToLower(plan) == "pro"
}

// GetUserPlan retrieves the user's subscription plan.
func GetUserPlan(db *sql.DB, userID string) (string, error) {
	var plan string
	err := db.QueryRow("SELECT plan FROM users WHERE id = $1", userID).Scan(&plan)
	return strings.ToLower(plan), err
}

// EnsureProtocol prepends https:// if the URL does not already have a scheme.
func EnsureProtocol(rawURL string) string {
	if !strings.HasPrefix(rawURL, "http://") && !strings.HasPrefix(rawURL, "https://") {
		return "https://" + rawURL
	}
	return rawURL
}
