#!/bin/bash

# Formula Project Management - Server Stop Script
echo "🛑 Stopping Formula Project Management System..."

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local pids=$(ss -tlnp | grep ":$port " | grep -o 'pid=[0-9]*' | cut -d= -f2)
    
    if [ -n "$pids" ]; then
        echo "🔄 Stopping processes on port $port..."
        for pid in $pids; do
            echo "   Killing PID: $pid"
            kill $pid 2>/dev/null
        done
        
        # Wait a moment and force kill if necessary
        sleep 2
        for pid in $pids; do
            if kill -0 $pid 2>/dev/null; then
                echo "   Force killing PID: $pid"
                kill -9 $pid 2>/dev/null
            fi
        done
        echo "✅ Port $port processes stopped"
    else
        echo "✅ No processes running on port $port"
    fi
}

# Stop frontend (port 3000)
echo "🖥️  Stopping frontend server..."
kill_port 3000

# Stop backend (port 5001)
echo "📡 Stopping backend server..."
kill_port 5001

# Also kill any remaining node processes related to our project
echo "🧹 Cleaning up remaining processes..."
pkill -f "react-scripts/scripts/start.js" 2>/dev/null
pkill -f "formula-backend/server.js" 2>/dev/null

echo ""
echo "✅ All servers stopped successfully!"
echo "🗑️  Log files preserved (backend.log, frontend.log)"