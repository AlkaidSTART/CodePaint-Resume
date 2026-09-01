package config

import "os"

type Config struct {
	Port          string
	AllowDemoAuth bool
	DatabaseURL   string
	RedisURL      string
	WorkspaceID   string
}

func Load() Config {
	return Config{
		Port:          envOr("PORT", "8080"),
		AllowDemoAuth: os.Getenv("ALLOW_DEMO_AUTH") == "true",
		DatabaseURL:   os.Getenv("DATABASE_URL"),
		RedisURL:      envOr("REDIS_URL", "redis://localhost:6379/0"),
		WorkspaceID:   envOr("DEFAULT_WORKSPACE_ID", "00000000-0000-0000-0000-000000000001"),
	}
}

func envOr(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
