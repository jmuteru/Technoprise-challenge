# Accessibility Blog Platform

A full-stack blog platform built with a Go backend, MongoDB, and Angular for the frontend. 
---

## Project Structure

```
/ (root)
  |-- backend/      # Go backend API (MongoDB Atlas)
  |-- frontend/     # Angular frontend app
```

---

## Features
- Create, view, and list blog posts with images
- Responsive, accessible UI 
- Cloud database (MongoDB Atlas)
- Environment based configuration

---

## Tech Stack
- **Backend:** Go, MongoDB Atlas, Gorilla Mux, godotenv
- **Frontend:** Angular (standalone), Tailwind CSS, ngx-toastr

---

## Prerequisites
- [Go](https://go.dev/) (v1.24.4+ )
- [Node.js & npm](https://nodejs.org/) (v22.17.0 +)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (for cloud DB)

---

## Quick Start (Recommended)

You can start both the backend and frontend together using the script I have provided:

```sh
./start-all.sh
```

- This script will:
  - Check and install Go and npm dependencies for the Angular UI if missing
  - Warn if your MongoDB Atlas URI is not set in `backend/.env`
  - Start the Go backend on http://localhost:8080
  - Start the Angular frontend on http://localhost:4200
  - Stop both servers when you press Ctrl+C

**Note:**
- The script is for Unix/Mac (Bash). On Windows, use Git Bash or run the servers manually as described below.

---

## Backend Setup (Go + MongoDB Atlas)

1. **Install dependencies:**
   ```sh
   cd backend
   go mod tidy
   ```

2. **Configure environment:**
   - Create a `.env` file in `backend/` with:
     ```env
     MONGODB_ATLAS_URI=your_mongodb_atlas_connection_string
     ```
   - Replace `your_mongodb_atlas_connection_string` with your Atlas URI.

3. **Run the backend server:**
   ```sh
   go run main.go
   ```
   - The API will be available at `http://localhost:8080`

4. **API Endpoints:**
   - `GET    /api/posts`         - List all blog posts
   - `GET    /api/posts/{slug}`  - Get a single post by slug
   - `POST   /api/posts`         - Create a new post (multipart/form-data)
   - `GET    /api/health`        - Health check

---

## Frontend Setup (Angular)

1. **Install dependencies:**
   ```sh
   cd frontend/blog-app
   npm install
   ```

2. **Run the Angular app:**
   ```sh
   npm start
   ```
   - The app will be available at `http://localhost:4200`

3. **Configuration:**
   - The frontend expects the backend API at `http://localhost:8080` (see `src/app/services/blog.ts`).
   - If you change the backend port, update the API URL in the frontend service.

---

## Usage
- Open the frontend in your browser (`http://localhost:4200`).
- Create, view, and browse blog posts.
- All data is stored in MongoDB Atlas.

---

## Customization & Notes
- **Image Uploads:** Images are uploaded with posts and served from the backend.
- **Environment Variables:** Backend uses `.env` for sensitive config.
- **Styling:** Tailwind CSS is used for rapid, accessible UI development.
- **Notifications:** Toasts via ngx-toastr for user feedback.

---

## Troubleshooting
- **MongoDB connection errors:**
  - Ensure your Atlas URI is correct and your IP is whitelisted in Atlas.
- **CORS issues:**
  - The backend enables CORS for local development.
- **Port conflicts:**
  - Make sure nothing else is running on ports 8080 (backend) or 4200 (frontend).

---

## Author
- Jeff Muteru