package main

import (
	"context"
	"log"
	"os"
	"path/filepath"

	"github.com/codepaint-studio/resumeflow/backend/internal/config"
	"github.com/codepaint-studio/resumeflow/backend/internal/migrations"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	cfg := config.Load()
	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}
	db, err := pgxpool.New(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	directory := os.Getenv("MIGRATIONS_DIR")
	if directory == "" {
		workingDir, err := os.Getwd()
		if err != nil {
			log.Fatal(err)
		}
		directory = filepath.Join(workingDir, "migrations")
		if _, err := os.Stat(directory); os.IsNotExist(err) {
			directory = filepath.Join(workingDir, "..", "migrations")
		}
	}
	if err := migrations.Apply(context.Background(), db, directory); err != nil {
		log.Fatal(err)
	}
	log.Println("database migrations applied")
}
