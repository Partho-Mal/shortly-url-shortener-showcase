// Package utils provides utility functions for password hashing and verification.
// It uses bcrypt to securely hash and compare user passwords.
package utils

import "golang.org/x/crypto/bcrypt"

// HashedPassword generates a bycrypt hash from a plain-text password.
// It returns the hashed password as a string, or an error if hashing fails.
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPasswordHash verifies whether the provided password matches the given bcrypt hash.
// It returns true if the password is correct, or false otherwise.
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
