// Package models defines input and data structures used across handlers.
// These struct help with JSON binding and request validation.
package models

// RegisterInput represents the expected JSON payload for user registration.
// Fields are validated using Gin's binding tags before processing.
type RegisterInput struct {
	Email string `json:"email" binding:"required, email"`
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginInput represents the expected JSON payload for use login.
// It ensures that valid email and password fields are provided.
type LoginInput struct {
	Email string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

