#!/bin/bash

echo "🚀 Starting Formula Project Management App..."

# Start backend
echo "📡 Starting backend server..."
cd formula-backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "⚛️  Starting frontend server..."
cd ../formula-project-app
npm start &
FRONTEND_PID=$!

echo "🎯 App starting!"
echo "📡 Backend: http://localhost:5001"
echo "⚛️  Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $FRONTEND_PID
kill $BACKEND_PID 2>/dev/null