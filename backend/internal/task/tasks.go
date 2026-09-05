package task

import (
	"encoding/json"
	"github.com/hibiken/asynq"
)

const ResumeParse = "resume.parse"

type ResumeParsePayload struct {
	WorkspaceID string `json:"workspace_id"`
	ResumeID    string `json:"resume_id"`
	ParseRunID  string `json:"parse_run_id"`
}

func NewResumeParse(payload ResumeParsePayload) (*asynq.Task, error) {
	body, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(ResumeParse, body, asynq.MaxRetry(5), asynq.Timeout(10*60)), nil
}
