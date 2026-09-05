package storage

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/url"
	"path/filepath"
	"strings"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var ErrInvalidFile = errors.New("invalid upload file")

type Object struct {
	Key      string
	MimeType string
	Size     int64
}
type Store interface {
	Put(context.Context, Object, io.Reader) error
	PresignedGet(context.Context, string, time.Duration) (*url.URL, error)
}
type S3Store struct {
	client *minio.Client
	bucket string
}

func NewMinio(endpoint, accessKey, secretKey, bucket string, useTLS bool) (*S3Store, error) {
	client, err := minio.New(endpoint, &minio.Options{Creds: credentials.NewStaticV4(accessKey, secretKey, ""), Secure: useTLS})
	if err != nil {
		return nil, fmt.Errorf("create object storage client: %w", err)
	}
	return &S3Store{client: client, bucket: bucket}, nil
}
func (s *S3Store) Put(ctx context.Context, object Object, body io.Reader) error {
	if err := Validate(object); err != nil {
		return err
	}
	_, err := s.client.PutObject(ctx, s.bucket, object.Key, body, object.Size, minio.PutObjectOptions{ContentType: object.MimeType})
	return err
}
func (s *S3Store) PresignedGet(ctx context.Context, key string, lifetime time.Duration) (*url.URL, error) {
	if strings.TrimSpace(key) == "" || filepath.IsAbs(key) {
		return nil, ErrInvalidFile
	}
	return s.client.PresignedGetObject(ctx, s.bucket, key, lifetime, nil)
}
func Validate(object Object) error {
	if strings.TrimSpace(object.Key) == "" || filepath.IsAbs(object.Key) || object.Size <= 0 || object.Size > 20*1024*1024 {
		return ErrInvalidFile
	}
	switch object.MimeType {
	case "application/pdf", "image/jpeg", "image/png":
		return nil
	default:
		return ErrInvalidFile
	}
}
