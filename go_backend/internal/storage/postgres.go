// Package storage provides database utilities for managing PostgreSQL connections
// and user-related operations such as username updates.
package storage

import (
	"database/sql"
	"log"
	"os"
	"sync"
	_ "github.com/lib/pq"
)

// db id the singleton instance of the database connection pool.
var (
	db     *sql.DB
	dbOnce sync.Once
)

// GetPostgres initializes (once) and returns a shared PostgreSQL database connection.
//
// Itn reads the connections string from the environment variable POSTGRES_URL.
// The function uses sync. Once to ensure a single instance is created,
// following the singleton pattern for efficient connection pooling.
//
// Example:
//
//	conn := storage.GetPostgres()
//
// defer conn.Close()
func GetPostgres() *sql.DB {
	dbOnce.Do(func() {
		connStr := os.Getenv("POSTGRES_URL")
		if connStr == "" {
			log.Fatalf("environment variable POSTGRES_URL is not set")
		}

		var err error
		db, err = sql.Open("postgres", connStr)
		if err != nil {
			log.Fatalf("failed to connect to PostgreSQL: %v", err)
		}

		// Verify that connection is alive
		if err := db.Ping(); err != nil {
			log.Fatalf("unable to ping PostgreSQL: %v", err)
		}

		log.Println("postgresql connection established successfully")
	})
	return db
}
