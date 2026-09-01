package config

import "os"

type Config struct {
	Port             string
	AllowDemoAuth    bool
	DatabaseURL      string
	RedisURL         string
	WorkspaceID      string
	CookieSecure     bool
	StorageEndpoint  string
	StorageAccessKey string
	StorageSecretKey string
	StorageBucket    string
}

func Load() Config {
	return Config{
		Port:             envOr("PORT", "8080"),
		AllowDemoAuth:    os.Getenv("ALLOW_DEMO_AUTH") == "true",
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		RedisURL:         envOr("REDIS_URL", "redis://localhost:6379/0"),
		WorkspaceID:      envOr("DEFAULT_WORKSPACE_ID", "00000000-0000-0000-0000-000000000001"),
		CookieSecure:     os.Getenv("COOKIE_SECURE") == "true",
		StorageEndpoint:  os.Getenv("STORAGE_ENDPOINT"),
		StorageAccessKey: os.Getenv("STORAGE_ACCESS_KEY"),
		StorageSecretKey: os.Getenv("STORAGE_SECRET_KEY"),
		StorageBucket:    envOr("STORAGE_BUCKET", "resumeflow"),
	}
}

func envOr(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
