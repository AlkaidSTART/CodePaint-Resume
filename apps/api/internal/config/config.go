package config

import "os"

type Config struct {
	Port          string
	AllowDemoAuth bool
}

func Load() Config {
	return Config{
		Port:          envOr("PORT", "8080"),
		AllowDemoAuth: os.Getenv("ALLOW_DEMO_AUTH") == "true",
	}
}

func envOr(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
