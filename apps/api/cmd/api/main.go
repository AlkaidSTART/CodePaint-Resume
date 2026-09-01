package main

import (
	"log"

	"github.com/codepaint-studio/resumeflow/apps/api/internal/config"
	"github.com/codepaint-studio/resumeflow/apps/api/internal/httpserver"
	"github.com/codepaint-studio/resumeflow/apps/api/internal/repository"
	"github.com/codepaint-studio/resumeflow/apps/api/internal/service"
)

func main() {
	cfg := config.Load()
	repository := repository.NewDemo()
	server := httpserver.New(cfg, service.NewRecruitment(repository))
	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}
