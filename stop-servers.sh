#!/bin/bash

echo "==========================================="
echo "  Formula PM - Server Stop Script"
echo "==========================================="
echo

# Check for saved PIDs
PID_FILE="$(dirname "$0")/.server-pids"
if [ -f "$PID_FILE" ]; then
    echo "Found saved process IDs, attempting to stop specific processes..."
    PIDS=$(cat "$PID_FILE")
    IFS=',' read -ra PID_ARRAY <<< "$PIDS"
    
    for pid in "${PID_ARRAY[@]}"; do
        if ps -p "$pid" > /dev/null 2>&1; then
            echo "Stopping process PID: $pid"
            kill "$pid" 2>/dev/null
        else
            echo "Process PID: $pid already stopped"
        fi
    done
    
    # Remove the PID file
    rm -f "$PID_FILE"
    echo
fi

# Stop processes on specific ports
echo "Checking for processes on ports 5001 and 3002..."

# Stop backend (port 5001)
BACKEND_PID=$(lsof -ti:5001 2>/dev/null)
if [ ! -z "$BACKEND_PID" ]; then
    echo "Stopping backend process on port 5001 (PID: $BACKEND_PID)"
    kill $BACKEND_PID 2>/dev/null
else
    echo "No process found on port 5001"
fi

# Stop frontend (port 3002)
FRONTEND_PID=$(lsof -ti:3002 2>/dev/null)
if [ ! -z "$FRONTEND_PID" ]; then
    echo "Stopping frontend process on port 3002 (PID: $FRONTEND_PID)"
    kill $FRONTEND_PID 2>/dev/null
else
    echo "No process found on port 3002"
fi

# Stop any remaining Node.js processes related to the project
echo "Stopping any remaining Formula PM related processes..."
pkill -f "formula-backend" 2>/dev/null
pkill -f "formula-project-app" 2>/dev/null

echo
echo "Waiting 2 seconds for cleanup..."
sleep 2

# Verify processes are stopped
echo
echo "Verifying processes are stopped..."
if lsof -ti:5001 > /dev/null 2>&1; then
    echo "WARNING: Process still running on port 5001"
else
    echo "✓ Port 5001 is free"
fi

if lsof -ti:3002 > /dev/null 2>&1; then
    echo "WARNING: Process still running on port 3002" 
else
    echo "✓ Port 3002 is free"
fi

echo
echo "==========================================="
echo "  All Formula PM servers stopped!"
echo "==========================================="
echo
echo "You can now safely restart servers with: ./start-servers.sh"
echo

read -p "Press Enter to continue..."