// Package auth provides HTTP handlers for user authentication operations
// such as registration and login.
package auth

import (
	"database/sql"
	"go_backend/internal/models"
	"go_backend/internal/security"
	"go_backend/internal/storage"
	"go_backend/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Register handles user registration by validating input, hashing password,
// and inserting a new user record into the database.
//
// It expects a JSON body containing email, username, and password fields.
// Example request:
//
//	POST /register
//	{
//	  "email": "parthomal.dev@gmail.com",
//	  "username": "partho_mal",
//	  "password": "securepassword"
//	}
//
// Responses:
//
//	201 Created - user successfully registered
//	400 Bad Request - invalid input
//	409 Conflict - email already exists
//	500 Internal Server Error - hashing or DB failure
func Register(c *gin.Context) {
	var input models.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}

	db := storage.GetPostgres()
	_, err = db.Exec(`
		INSERT INTO users (id, email, password, username)
		VALUES ($1, $2, $3, $4)
	`, uuid.NewString(), input.Email, hashedPassword, input.Username)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "user already exists"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "user registered successfully"})
}

// Login handles user authentication by verifying credentials and issuing a JWT.
//
// It expects a JSON body with email and password fields.
// Example request:
//
//	POST /login
//	{
//	  "email": "user@example.com",
//	  "password": "securepassword"
//	}
//
// Responses:
//
//	200 OK – login successful, token set as cookie
//	400 Bad Request – invalid input
//	401 Unauthorized – invalid credentials
//	500 Internal Server Error – DB or token generation failure
func Login(c *gin.Context) {
	var input models.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	db := storage.GetPostgres()

	var (
		userID         string
		hashedPassword string
	)

	err := db.QueryRow(
		"SELECT id, password FROM users WHERE email = $1",
		input.Email,
	).Scan(&userID, &hashedPassword)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server error"})
		return
	}

	if !utils.CheckPasswordHash(input.Password, hashedPassword) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "incorrect password"})
		return
	}

	token, err := security.GenerateJWT(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	utils.SetAuthCookie(c, token)

	c.JSON(http.StatusOK, gin.H{"message": "logged in successfully"})
}
