// Package models defines data structures for URL shortening functionality.
package models

import (
	"time"

	"github.com/google/uuid"
)

// URL represents a shortened URL stored in the database.
type URL struct {
	ID            uuid.UUID  `json:"id"`                        // Unique identifier for the URL
	UserID        uuid.UUID  `json:"user_id"`                   // Owner of the URL (nullable for public URLs)
	OriginalURL   string     `json:"original_url"`              // Original long URL
	Slug          string     `json:"slug"`                      // Short slug for URL redirection
	CreatedAt     time.Time  `json:"created_at"`                // Timestamp of creation
	ClickCount    int        `json:"click_count"`               // Number of times the URL has been clicked
	LastClicked   *time.Time `json:"last_clicked_at,omitempty"` // Last click timestamp (optional)
	CreatedQRCode bool       `json:"created_qrcode"`            // Flag if QR code was generated for this URL
}

// URLRequest represents incoming request payload to create a new shortened URL.
type URLRequest struct {
	OriginalURL   string `json:"original_url" binding:"required"` // URL to shorten (required)
	Slug          string `json:"slug"`                             // Optional custom slug
	CreatedQRCode bool   `json:"created_qrcode"`                   // Flag to indicate QR code generation
}
