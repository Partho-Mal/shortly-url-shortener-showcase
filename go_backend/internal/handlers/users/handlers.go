// Package users provides HTTP handlers related to user profile and link management.
//
// This package follows Google Go style conventions:
//   - Each handler is concise, stateless, and context-driven.
//   - Errors are handled explicitly with minimal side effects.
//   - Structs are defined locally for clarity and JSON contract consistency.
package users

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"go_backend/internal/storage"
)

// GetUserDetails retrieves authenticated user details from the database.
// It uses the "userID" extracted from the authentication middleware context.
func GetUserDetails(c *gin.Context) {
	userID := c.MustGet("userID").(string)
	db := storage.GetPostgres()

	var user struct {
		ID                string       `json:"id"`
		Email             string       `json:"email"`
		Username          string       `json:"username"`
		Provider          string       `json:"provider"`
		Plan              string       `json:"plan"`
		Avatar            string       `json:"avatar"`
		CreatedAt         string       `json:"created_at"`
		UpdatedAt         string       `json:"updated_at"`
		UsernameUpdatedAt sql.NullTime `json:"username_updated_at"`
	}

	err := db.QueryRow(`
		SELECT id, email, username, provider, plan, avatar, created_at, updated_at, last_username_change
		FROM users_with_plan
		WHERE id = $1
	`, userID).Scan(
		&user.ID,
		&user.Email,
		&user.Username,
		&user.Provider,
		&user.Plan,
		&user.Avatar,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch user details"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// GetUserShortLinks retrieves all short links created by the authenticated user.
// Links are returned in descending order of creation time.
func GetUserShortLinks(c *gin.Context) {
	userID := c.MustGet("userID").(string)
	db := storage.GetPostgres()

	rows, err := db.Query(`
		SELECT id, original_url, slug, created_at, created_qrcode, click_count, last_clicked_at
		FROM urls
		WHERE user_id = $1
		ORDER BY created_at DESC
	`, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch URLs"})
		return
	}
	defer rows.Close()

	type ShortLink struct {
		ID            string  `json:"id"`
		OriginalURL   string  `json:"original_url"`
		Slug          string  `json:"slug"`
		CreatedAt     string  `json:"created_at"`
		CreatedQRCode bool    `json:"created_qrcode"`
		ClickCount    int     `json:"click_count"`
		LastClickedAt *string `json:"last_clicked_at,omitempty"`
	}

	var links []ShortLink
	for rows.Next() {
		var link ShortLink
		var lastClicked sql.NullTime

		if err := rows.Scan(
			&link.ID,
			&link.OriginalURL,
			&link.Slug,
			&link.CreatedAt,
			&link.CreatedQRCode,
			&link.ClickCount,
			&lastClicked,
		); err != nil {
			continue
		}

		if lastClicked.Valid {
			t := lastClicked.Time.Format(time.RFC3339)
			link.LastClickedAt = &t
		}

		links = append(links, link)
	}

	c.JSON(http.StatusOK, links)
}
