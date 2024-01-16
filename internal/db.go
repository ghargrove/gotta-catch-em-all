package internal

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"log"
	"os"
)

/**
 * Get a database connection
 */
func CreateDB() *sqlx.DB {
	// psql -U [username] -d [database] -W
	connString := fmt.Sprintf(
		"postgres://%s:%s@127.0.0.1:5432/%s?sslmode=disable",
		os.Getenv("DB_USERNAME"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_DATABASE"),
	)

	db, err := sqlx.Open("postgres", connString)
	if err != nil {
		log.Fatal(err)
	}

	return db
}
