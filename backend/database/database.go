package database

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var BlogCollection *mongo.Collection

func InitDatabase() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	//env variable for
	uri := os.Getenv("MONGODB_ATLAS_URI")
	if uri == "" {
		// fallback to local instance of mongodb if we cant find atlas uri from .env
		uri = "mongodb://localhost:27017"
	}
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return err
	}
	BlogCollection = client.Database("blogdb").Collection("blog_posts")
	log.Println("Connected to MongoDB at", uri)
	return nil
}
