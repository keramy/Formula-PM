#!/bin/bash

echo "==========================================="
echo "  Formula PM - Server Startup Script"
echo "==========================================="
echo

# Check for existing Node.js processes
if pgrep -f "node" > /dev/null; then
    echo "WARNING: Node.js processes are already running!"
    echo "Please run ./stop-servers.sh first to avoid conflicts."
    echo
    ps aux | grep -E "(node|npm)" | grep -v grep
    echo
    read -p "Press Enter to continue..."
    exit 1
fi

echo "Starting Formula PM Backend Server (Port 5001)..."
cd "$(dirname "$0")/formula-backend"
echo "Backend starting on http://localhost:5001"
npm start > /dev/null 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

echo
echo "Waiting 3 seconds for backend to initialize..."
sleep 3

echo "Starting Formula PM Frontend Server (Port 3002)..."
cd "$(dirname "$0")/formula-project-app"
echo "Frontend starting on http://localhost:3002"
npm start > /dev/null 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo
echo "==========================================="
echo "  Servers are running!"
echo "==========================================="
echo "Backend:  http://localhost:5001 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:3002 (PID: $FRONTEND_PID)"
echo
echo "Process IDs have been saved to .server-pids file"
echo "$BACKEND_PID,$FRONTEND_PID" > "$(dirname "$0")/.server-pids"
echo
echo "To stop servers, run: ./stop-servers.sh"
echo "To check server status: ps aux | grep node"
echo

# Wait for user input
read -p "Press Enter to continue (servers will keep running in background)..."