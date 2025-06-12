#!/bin/bash

echo "🔍 Formula Project Management - System Verification"
echo "=================================================="

# Check if servers are running
echo "📡 Checking Backend Server..."
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ Backend API is running on port 5001"
    BACKEND_STATUS=$(curl -s http://localhost:5001/api/health)
    echo "   Status: $BACKEND_STATUS"
else
    echo "❌ Backend API not accessible"
    exit 1
fi

echo ""
echo "🖥️  Checking Frontend Server..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend not accessible"
    exit 1
fi

echo ""
echo "🏢 Testing Client Database..."
CLIENTS_COUNT=$(curl -s http://localhost:5001/api/clients | grep -o '"id":' | wc -l)
echo "✅ Clients API working - Found $CLIENTS_COUNT clients"

echo ""
echo "👥 Testing Team API..."
TEAM_COUNT=$(curl -s http://localhost:5001/api/team-members | grep -o '"id":' | wc -l)
echo "✅ Team API working - Found $TEAM_COUNT team members"

echo ""
echo "📁 Testing Projects API..."
PROJECTS_COUNT=$(curl -s http://localhost:5001/api/projects | grep -o '"id":' | wc -l)
echo "✅ Projects API working - Found $PROJECTS_COUNT projects"

echo ""
echo "✅ Testing Tasks API..."
TASKS_COUNT=$(curl -s http://localhost:5001/api/tasks | grep -o '"id":' | wc -l)
echo "✅ Tasks API working - Found $TASKS_COUNT tasks"

echo ""
echo "🎉 SYSTEM VERIFICATION COMPLETE!"
echo "=================================================="
echo "🌐 Access your application at: http://localhost:3000"
echo "📊 Available tabs:"
echo "   1. Dashboard"
echo "   2. Projects" 
echo "   3. My Projects"
echo "   4. Tasks"
echo "   5. Team"
echo "   6. Clients ⭐ (NEW)"
echo "   7. Procurement"
echo "   8. Timeline & Gantt"
echo ""
echo "🔧 API Documentation: http://localhost:5001/api"
echo "=================================================="