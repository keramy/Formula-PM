#!/bin/bash

# Formula Project Management - Server Startup Script
echo "🚀 Starting Formula Project Management System..."

# Function to check if port is in use
check_port() {
    if ss -tlnp | grep -q ":$1 "; then
        echo "✅ Port $1 is already in use"
        return 0
    else
        echo "❌ Port $1 is available"
        return 1
    fi
}

# Check and start backend server
echo "📡 Checking backend server (port 5001)..."
if ! check_port 5001; then
    echo "🔄 Starting backend server..."
    cd formula-backend
    npm start > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    cd ..
    
    # Wait for backend to start
    echo "⏳ Waiting for backend to start..."
    for i in {1..10}; do
        if check_port 5001; then
            echo "✅ Backend server started successfully!"
            break
        fi
        sleep 1
    done
else
    echo "✅ Backend server already running"
fi

# Check and start frontend server
echo "🖥️  Checking frontend server (port 3000)..."
if ! check_port 3000; then
    echo "🔄 Starting frontend server..."
    cd formula-project-app
    npm start > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    cd ..
    
    # Wait for frontend to start
    echo "⏳ Waiting for frontend to start..."
    for i in {1..30}; do
        if check_port 3000; then
            echo "✅ Frontend server started successfully!"
            break
        fi
        sleep 1
    done
else
    echo "✅ Frontend server already running"
fi

echo ""
echo "🎉 Formula Project Management System is ready!"
echo "📋 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5001/api"
echo ""
echo "📊 System Status:"
check_port 3000 && echo "   ✅ Frontend: Running"
check_port 5001 && echo "   ✅ Backend: Running"
echo ""
echo "📝 Logs:"
echo "   Backend: backend.log"
echo "   Frontend: frontend.log"
echo ""
echo "🛑 To stop servers: ./stop-servers.sh"