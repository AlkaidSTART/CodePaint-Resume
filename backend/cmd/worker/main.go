package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"github.com/codepaint-studio/resumeflow/backend/internal/config"
	"github.com/codepaint-studio/resumeflow/backend/internal/task"
	"github.com/hibiken/asynq"
)

func main() {
	cfg := config.Load()
	redis, err := asynq.ParseRedisURI(cfg.RedisURL)
	if err != nil {
		log.Fatalf("parse redis URL: %v", err)
	}
	server := asynq.NewServer(redis, asynq.Config{
		Concurrency: 10,
		Queues:      map[string]int{"default": 1, "resume": 4, "mailbox": 2},
	})
	mux := asynq.NewServeMux()
	mux.HandleFunc(task.ResumeParse, func(ctx context.Context, item *asynq.Task) error {
		var payload task.ResumeParsePayload
		if err := json.Unmarshal(item.Payload(), &payload); err != nil {
			return fmt.Errorf("decode resume parse task: %w", err)
		}
		if payload.WorkspaceID == "" || payload.ResumeID == "" || payload.ParseRunID == "" {
			return errors.New("resume parse task has incomplete identifiers")
		}
		log.Printf("resume parse task accepted type=%s", task.ResumeParse)
		return nil
	})
	log.Printf("resumeflow worker listening on %s", cfg.RedisURL)
	if err := server.Run(mux); err != nil {
		log.Fatal(err)
	}
}
