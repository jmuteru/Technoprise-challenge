package main

import (
	"log"
	"net/http"

	"github.com/jmuteru/blog-backend/database"
	"github.com/jmuteru/blog-backend/middleware"
	"github.com/jmuteru/blog-backend/routes"
	"github.com/joho/godotenv"
)

func main() {
	// load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or failed to load .env")
	}

	if err := database.InitDatabase(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	router := routes.SetupRoutes()

	//  middleware
	handler := middleware.LoggingMiddleware(router)
	handler = middleware.SetupCORS()(handler)

	// start server
	serverAddr := ":8080"
	// log server info and endpoints
	log.Printf("server running on http://localhost%s", serverAddr)
	log.Printf("endpoints:")
	log.Printf("  GET  http://localhost%s/api/posts", serverAddr)
	log.Printf("  GET  http://localhost%s/api/posts/{slug}", serverAddr)
	log.Printf("  GET  http://localhost%s/api/health", serverAddr)

	if err := http.ListenAndServe(serverAddr, handler); err != nil {
		log.Fatal("server failed to start:", err)
	}
}
