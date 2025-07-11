package handlers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"log"

	"github.com/gorilla/mux"
	"github.com/jmuteru/blog-backend/database"
	"github.com/jmuteru/blog-backend/models"
	"go.mongodb.org/mongo-driver/bson"
)

func GetPosts(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cur, err := database.BlogCollection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch posts", http.StatusInternalServerError)
		return
	}
	defer cur.Close(ctx)

	var posts []models.BlogPost
	for cur.Next(ctx) {
		var post models.BlogPost
		if err := cur.Decode(&post); err == nil {
			posts = append(posts, post)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"posts": posts})
}

func GetPostBySlug(w http.ResponseWriter, r *http.Request) {
	slug := mux.Vars(r)["slug"]
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var post models.BlogPost
	err := database.BlogCollection.FindOne(ctx, bson.M{"slug": slug}).Decode(&post)
	if err != nil {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}

func CreatePost(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20)
	title := r.FormValue("title")
	slug := r.FormValue("slug")
	content := r.FormValue("content")
	dateStr := r.FormValue("date")
	var date time.Time
	if dateStr != "" {
		date, _ = time.Parse("2006-01-02", dateStr)
	} else {
		date = time.Now()
	}

	imageFilename := ""
	file, handler, err := r.FormFile("image")
	if err == nil && file != nil {
		defer file.Close()
		imageFilename = time.Now().Format("20060102150405") + "_" + handler.Filename
		out, err := saveImageFile(file, imageFilename)
		if err != nil {
			log.Printf("Failed to save image: %v", err)
			http.Error(w, "Failed to save image", http.StatusInternalServerError)
			return
		}
		defer out.Close()
	}

	post := models.BlogPost{
		Title:   title,
		Slug:    slug,
		Content: content,
		Date:    date,
		Image:   imageFilename,
	}

	log.Printf("Attempting to insert post: %+v", post)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_, err = database.BlogCollection.InsertOne(ctx, post)
	if err != nil {
		log.Printf("Failed to insert post: %v", err)
		http.Error(w, "Failed to create post", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}

func saveImageFile(file io.Reader, filename string) (*os.File, error) {
	path := filepath.Join("./public/images/", filename)
	out, err := os.Create(path)
	if err != nil {
		return nil, err
	}
	_, err = io.Copy(out, file)
	if err != nil {
		out.Close()
		return nil, err
	}
	return out, nil
}
