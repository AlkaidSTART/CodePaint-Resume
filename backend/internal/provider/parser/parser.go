package parser

import (
	"context"
	"errors"
)

var ErrNotConfigured = errors.New("document parser provider is not configured")

type Document struct {
	Text      string
	PageCount int
}

type Extractor interface {
	Extract(context.Context, string, string) (Document, error)
}
type OCR interface {
	Recognize(context.Context, string) (Document, error)
}
type LLM interface {
	Parse(context.Context, string, []byte) (map[string]any, error)
}
