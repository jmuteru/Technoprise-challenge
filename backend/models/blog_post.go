package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type BlogPost struct {
	ID      primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title   string             `bson:"title" json:"title"`
	Date    time.Time          `bson:"date" json:"date"`
	Slug    string             `bson:"slug" json:"slug"`
	Content string             `bson:"content" json:"content"`
	Image   string             `bson:"image" json:"image"`
}
