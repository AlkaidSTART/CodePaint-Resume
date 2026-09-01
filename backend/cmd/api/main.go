package main

import (
	"context"
	"log"

	"github.com/codepaint-studio/resumeflow/backend/internal/config"
	"github.com/codepaint-studio/resumeflow/backend/internal/httpserver"
	"github.com/codepaint-studio/resumeflow/backend/internal/repository"
	"github.com/codepaint-studio/resumeflow/backend/internal/service"
)

func main() {
	cfg := config.Load()
	var recruitmentRepository repository.RecruitmentRepository = repository.NewDemo()
	if cfg.DatabaseURL != "" {
		postgres, err := repository.NewPostgres(context.Background(), cfg.DatabaseURL)
		if err != nil {
			log.Fatal(err)
		}
		defer postgres.Close()
		recruitmentRepository = postgres
	}
	server := httpserver.New(cfg, service.NewRecruitment(recruitmentRepository))
	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}
