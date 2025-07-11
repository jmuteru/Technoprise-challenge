package config

import (
	"os"
)

// app config
type Config struct {
	DBPath   string
	Port     string
	LogLevel string
}

// load env variables
func LoadConfig() *Config {
	return &Config{
		DBPath:   getEnv("DB_PATH", "blog.db"),
		Port:     getEnv("PORT", "8080"),
		LogLevel: getEnv("LOG_LEVEL", "info"),
	}
}

// get env variable or default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
