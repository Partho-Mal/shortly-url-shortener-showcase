// Package security provides utilities for generating and validating JWT tokens
// used for secure user authentication within the application.
package security

import (
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

// JWTClaim defines the structure of claims embedded within JWT tokens.
// It includes both custom and registered claims.
type JWTClaim struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

// GenerateJWT creates a new JWT token for the specified user ID.
// The token expires in 15 minutes and is signed using the secret key from environment variables.
func GenerateJWT(userID string) (string, error) {
	expirationTime := time.Now().Add(15 * time.Minute)

	claims := jwt.RegisteredClaims{
		Subject:   userID,
		ExpiresAt: jwt.NewNumericDate(expirationTime),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		Issuer:    "your-app-name",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtKey := getJWTKey()
	return token.SignedString(jwtKey)
}

// ValidateJWT extracts and validates a JWT token from an HTTP request.
// It first checks for a token in cookies, then in the Authorization header.
// Returns parsed JWT claims if valid, otherwise returns an error.
func ValidateJWT(r *http.Request) (*JWTClaim, error) {
	jwtKey := getJWTKey()
	var tokenStr string

	// Try reading from cookie first
	if cookie, err := r.Cookie("token"); err == nil {
		tokenStr = cookie.Value
	} else {
		// Fallback to Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			return nil, errors.New("authorization token not provided")
		}
		tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
	}

	claims := &JWTClaim{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid or malformed JWT")
	}

	// Check expiration explicitly
	if claims.ExpiresAt == nil || claims.ExpiresAt.Before(time.Now()) {
		return nil, errors.New("token has expired")
	}

	return claims, nil
}

// ValidateJWTFromCookie validates a JWT token specifically from a Gin context.
// It internally calls ValidateJWT using the HTTP request object.
func ValidateJWTFromCookie(c *gin.Context) (*JWTClaim, error) {
	return ValidateJWT(c.Request)
}

// ValidateJWTFromString validates a JWT token directly from a token string.
// This is useful when the token is obtained through an external source, not an HTTP request.
func ValidateJWTFromString(tokenStr string) (*JWTClaim, error) {
	jwtKey := getJWTKey()
	claims := &JWTClaim{}

	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("invalid or malformed JWT")
	}

	if claims.ExpiresAt == nil || claims.ExpiresAt.Before(time.Now()) {
		return nil, errors.New("token has expired")
	}

	return claims, nil
}

// getJWTKey retrieves the JWT secret key from environment variables.
// It panics if the key is not defined, ensuring secure startup.
func getJWTKey() []byte {
	key := os.Getenv("JWT_SECRET")
	if key == "" {
		panic("JWT_SECRET is not set in environment variables")
	}
	return []byte(key)
}
