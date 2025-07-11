package middleware

import (
	"net/http"

	"github.com/rs/cors"
)

// cors setup
func SetupCORS() func(http.Handler) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:4200", // for angular server
			"http://localhost:3000",
			"http://127.0.0.1:4200",
			"http://127.0.0.1:3000",
		},
		AllowedMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodDelete,
			http.MethodOptions,
		},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-CSRF-Token",
		},
		AllowCredentials: true,
		Debug:            false,
	})

	return c.Handler
}
