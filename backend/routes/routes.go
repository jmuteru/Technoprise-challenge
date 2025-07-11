package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmuteru/blog-backend/handlers"
)

// setup and configure all app routes
func SetupRoutes() *mux.Router {
	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api").Subrouter()

	// blog routes
	api.HandleFunc("/posts", handlers.GetPosts).Methods("GET")
	api.HandleFunc("/posts", handlers.CreatePost).Methods("POST")
	api.HandleFunc("/posts/{slug}", handlers.GetPostBySlug).Methods("GET")

	// health check: checks if endpoints are ok
	api.HandleFunc("/health", handlers.HealthCheck).Methods("GET")

	// legacy routes for backward compatibility
	r.HandleFunc("/posts", handlers.GetPosts).Methods("GET")
	r.HandleFunc("/posts/{slug}", handlers.GetPostBySlug).Methods("GET")

	// Serve static images
	r.PathPrefix("/images/").Handler(
		http.StripPrefix("/images/", http.FileServer(http.Dir("./public/images/"))),
	)

	return r
}
