package urls

import (
	"go_backend/internal/storage"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// DeleteShortlink handles deletion of a user's shortlink and its associated resources.
//
// It performs the following steps:
//   1. Validates the request body for a required `id` field.
//   2. Fetches the corresponding slug from the PostgreSQL database.
//   3. Deletes the shortlink from the database.
//   4. Deletes any associated QR code data:
//      - Redis cache
//      - Database entry
//      - Image file in public storage
//   5. Deletes the slug from Redis cache.
//
// Returns appropriate HTTP status codes and JSON messages depending on success or failure.
// Error messages returned to clients start with lowercase letters as per Go style.
func DeleteShortlink(c *gin.Context) {
	// Parse and validate request body
	var req struct {
		ID string `json:"id"` // shortlink unique identifier
	}
	if err := c.ShouldBindJSON(&req); err != nil || req.ID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id is required"})
		return
	}

	db := storage.GetPostgres()

	// Step 1: Fetch slug from database for Redis cleanup
	var slug string
	err := db.QueryRow(`SELECT slug FROM urls WHERE id = $1`, req.ID).Scan(&slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "shortlink not found"})
		return
	}

	// Step 2: Delete shortlink from database
	_, err = db.Exec(`DELETE FROM urls WHERE id = $1`, req.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete shortlink"})
		return
	}

	// Step 3: Delete associated QR code resources
	// 3a. Delete QR code database entry
	_, err = db.Exec(`DELETE FROM qr_codes WHERE id = $1`, req.ID)
	if err != nil {
		log.Printf("failed to delete QR code entry for ID %s: %v", req.ID, err)
	} else {
		// 3b. Delete QR code Redis cache
		if err := storage.RedisClient.Del(storage.Ctx, "qr:"+req.ID).Err(); err != nil {
			log.Printf("failed to delete QR Redis cache for ID %s: %v", req.ID, err)
		}

		// 3c. Delete QR code image file if exists
		path := "public/qrcodes/" + req.ID + ".png"
		if err := os.Remove(path); err != nil && !os.IsNotExist(err) {
			log.Printf("failed to delete QR code image file for ID %s: %v", req.ID, err)
		}
	}

	// Step 4: Delete slug from Redis cache
	if err := storage.RedisClient.Del(storage.Ctx, "slug:"+slug).Err(); err != nil {
		// Return OK because the main deletion succeeded; include Redis error info
		c.JSON(http.StatusOK, gin.H{
			"message":     "shortlink deleted, but redis cleanup failed",
			"redis_error": err.Error(),
		})
		return
	}

	// Success response
	c.JSON(http.StatusOK, gin.H{"message": "shortlink deleted successfully"})
}
