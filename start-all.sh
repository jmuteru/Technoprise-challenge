#!/bin/bash

# Check Go dependencies
cd backend
if [ ! -d "$(go env GOMODCACHE 2>/dev/null)" ] || [ ! -f "go.sum" ]; then
  echo "Go dependencies not found. Installing with 'go mod tidy'..."
  go mod tidy
else
  echo "Go dependencies found."
fi

# Check for MongoDB URI in .env
if ! grep -q "MONGODB_ATLAS_URI" .env 2>/dev/null; then
  echo "Warning: MONGODB_ATLAS_URI not set in backend/.env. Backend may not connect to MongoDB Atlas."
fi

echo "Starting Go backend on http://localhost:8080 ..."
go run main.go &
BACKEND_PID=$!
cd ..

# Check npm dependencies
cd frontend/blog-app
if [ ! -d "node_modules" ] || [ ! -f "package-lock.json" ]; then
  echo "npm dependencies not found. Installing with 'npm install'..."
  npm install
else
  echo "npm dependencies found."
fi

echo "Starting Angular frontend on http://localhost:4200 ..."
npm start &
FRONTEND_PID=$!
cd ../..

# Wait for both processes
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

# Print info
cat <<EOF

Both servers are running:
- Backend:  http://localhost:8080
- Frontend: http://localhost:4200

Press Ctrl+C to stop both.
EOF

wait 