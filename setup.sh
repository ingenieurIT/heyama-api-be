#!/bin/bash

echo "Starting Heyama API Backend Setup..."

# Start Docker containers
echo "Starting MongoDB and MinIO..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 5

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

echo ""
echo "Setup complete!"
echo ""
echo "Services running:"
echo "  - MongoDB: mongodb://localhost:27017"
echo "  - MinIO Console: http://localhost:9001"
echo "  - MinIO API: http://localhost:9000"
echo ""
echo "To start the API server, run:"
echo "  npm run start:dev"
echo ""
