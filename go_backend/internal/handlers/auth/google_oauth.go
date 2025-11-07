// Package auth provides HTTP handlers for user authentication,
// including Google OAuth2 login, callback, and JWT session handling.
package auth

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"os"
	"strings"

	"go_backend/internal/security"
	"go_backend/internal/storage"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func init() {
	// Load .env variables if available (for local development)
	_ = godotenv.Load()
}

// GoogleUser represents user information returned from Google OAuth2.
type GoogleUser struct {
	Sub     string `json:"sub"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

// getGoogleOAuthConfig builds the OAuth2 configuration
// from environment variables securely.
func getGoogleOAuthConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URI"),
		Scopes: []string{
			"openid",
			"email",
			"profile",
		},
		Endpoint: google.Endpoint,
	}
}

// GoogleLogin starts the OAuth2 flow by redirecting the user to Google’s login page.
func GoogleLogin(c *gin.Context) {
	config := getGoogleOAuthConfig()

	// Optionally support `state` query (e.g. billing, invite, etc.)
	state := c.Query("state")
	if state == "" {
		state = "default"
	}

	authURL := config.AuthCodeURL(state, oauth2.AccessTypeOffline)
	c.Redirect(http.StatusTemporaryRedirect, authURL)
}

// GoogleCallback handles Google's OAuth2 redirect,
// exchanges the code for an access token, and logs in or registers the user.
func GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	state := c.Query("state")

	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing authorization code"})
		return
	}

	config := getGoogleOAuthConfig()
	token, err := config.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Token exchange failed",
			"details": err.Error(),
		})
		return
	}

	// Fetch user info from Google
	client := config.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
	if err != nil || resp.StatusCode != http.StatusOK {
		statusCode := http.StatusInternalServerError
		if resp != nil {
			statusCode = resp.StatusCode
		}
		c.JSON(statusCode, gin.H{
			"error":   "Failed to fetch user info",
			"details": err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	var userinfo GoogleUser
	if err := json.NewDecoder(resp.Body).Decode(&userinfo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse user info"})
		return
	}

	// Insert or get user from database
	db := storage.GetPostgres()
	var userID string
	err = db.QueryRow(`SELECT id FROM users WHERE email=$1`, userinfo.Email).Scan(&userID)

	switch {
	case err == sql.ErrNoRows:
		userID = uuid.New().String()
		_, err = db.Exec(`
			INSERT INTO users (id, email, username, avatar, provider, plan, provider_id)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
		`, userID, userinfo.Email, userinfo.Name, userinfo.Picture, "google", "free", userinfo.Sub)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "User registration failed",
				"details": err.Error(),
			})
			return
		}
	case err != nil:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Generate JWT for session
	jwtToken, err := security.GenerateJWT(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT generation failed"})
		return
	}

	// Redirect user to frontend with token
	redirect := os.Getenv("FRONTEND_REDIRECT_URL") // e.g. https://shortly.vercel.app/auth/callback
	if redirect == "" {
		redirect = "http://localhost:3000/auth/callback"
	}

	// Example: redirect user to billing page if state == "billing"
	redirectURL := redirect + "?token=" + jwtToken
	if strings.EqualFold(state, "billing") {
		redirectURL += "&from=billing"
	}

	c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}
