#!/bin/bash

# Formula PM Docker Development Environment Startup Script
# This script starts the optimized Docker development environment

echo "🚀 Starting Formula PM Development Environment with Docker..."
echo "This will provide much better performance than native WSL2 with Windows filesystem"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Change to the docker directory
cd "$(dirname "$0")"

echo "📦 Building and starting containers..."

# Build and start services
docker-compose -f docker-compose.dev.yml up --build -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🔍 Checking service status..."

# Check backend
if curl -f http://localhost:5001 > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:5001"
else
    echo "⚠️  Backend is starting... (may take a moment)"
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "⚠️  Frontend is starting... (may take a moment)"
fi

echo ""
echo "🎉 Development environment started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5001"
echo ""
echo "📋 Useful commands:"
echo "  View logs:     docker-compose -f docker-compose.dev.yml logs -f"
echo "  Stop services: docker-compose -f docker-compose.dev.yml down"
echo "  Restart:       docker-compose -f docker-compose.dev.yml restart"
echo ""
echo "🔄 Hot reloading is enabled - your changes will be reflected automatically!"