// go_backend/internal/security/jwt.go
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

type JWTClaim struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

//! Generates the JWT token
func GenerateJWT(userID string) (string, error) {
	expirationTime := time.Now().Add(30 * 24 * time.Hour) // 30 days
	claims := &JWTClaim{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtKey := getJWTKey()
	return token.SignedString(jwtKey)
}

//! Validates JWT from *http.Request (Cookie or Bearer Header)
func ValidateJWT(r *http.Request) (*JWTClaim, error) {
	jwtKey := getJWTKey()
	var tokenStr string

	// 1️⃣ Try cookie
	if cookie, err := r.Cookie("token"); err == nil {
		tokenStr = cookie.Value
	} else {
		// 2️⃣ Fallback to Authorization header
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

	// 3️⃣ Check expiration explicitly (important!)
	if claims.ExpiresAt == nil || claims.ExpiresAt.Before(time.Now()) {
		return nil, errors.New("token has expired")
	}

	return claims, nil
}

//! For Gin context (calls ValidateJWT under the hood)
func ValidateJWTFromCookie(c *gin.Context) (*JWTClaim, error) {
	// fmt.Println("[DEBUG] Cookie from request:", c.Request.Header["Cookie"])
	return ValidateJWT(c.Request)
}

//! Helper to load JWT key safely
func getJWTKey() []byte {
	key := os.Getenv("JWT_SECRET")
	if key == "" {
		panic("JWT_SECRET is not set in environment variables")
	}
	return []byte(key)
}

//! Validates JWT from a raw token string (used when token is not in request)
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
