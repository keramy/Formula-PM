#!/bin/bash

# Formula PM - Stop Full Backend Script
# This script safely stops all Formula PM services

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Stopping Formula PM Services${NC}"
echo -e "${BLUE}===============================${NC}"
echo ""

# Project paths
PROJECT_ROOT="/mnt/c/Users/Kerem/Desktop/formula-pm"
FRONTEND_DIR="$PROJECT_ROOT/formula-project-app"
BACKEND_DIR="$PROJECT_ROOT/formula-project-app/backend"

# Function to kill process by PID file
kill_by_pidfile() {
    local pidfile=$1
    local service_name=$2
    
    if [ -f "$pidfile" ]; then
        local pid=$(cat "$pidfile")
        if kill "$pid" 2>/dev/null; then
            echo -e "${GREEN}✅ $service_name stopped (PID: $pid)${NC}"
        else
            echo -e "${YELLOW}⚠️  $service_name process not found or already stopped${NC}"
        fi
        rm -f "$pidfile"
    else
        echo -e "${YELLOW}⚠️  $service_name PID file not found${NC}"
    fi
}

# Stop Frontend
echo -e "${YELLOW}🖥️  Stopping frontend...${NC}"
cd "$FRONTEND_DIR"
kill_by_pidfile "frontend.pid" "Frontend"

# Also kill any remaining Vite processes
pkill -f "vite" && echo -e "${GREEN}✅ Additional Vite processes stopped${NC}" || true

# Stop Backend
echo -e "${YELLOW}🚀 Stopping backend API...${NC}"
cd "$BACKEND_DIR"
kill_by_pidfile "backend.pid" "Backend API"

# Also kill any remaining Node.js server processes
pkill -f "node.*server.js" && echo -e "${GREEN}✅ Additional backend processes stopped${NC}" || true

# Stop Prisma Studio
echo -e "${YELLOW}🔍 Stopping database browser...${NC}"
kill_by_pidfile "prisma-studio.pid" "Database Browser (Prisma Studio)"

# Kill any remaining Prisma Studio processes
pkill -f "prisma studio" && echo -e "${GREEN}✅ Additional Prisma Studio processes stopped${NC}" || true

# Stop PostgreSQL and Redis (optional - they can keep running)
echo ""
echo -e "${BLUE}🗄️  Database Services:${NC}"
read -p "Do you want to stop PostgreSQL and Redis? (they can stay running) [y/N]: " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🗄️  Stopping PostgreSQL...${NC}"
    sudo service postgresql stop && echo -e "${GREEN}✅ PostgreSQL stopped${NC}" || echo -e "${RED}❌ Failed to stop PostgreSQL${NC}"
    
    echo -e "${YELLOW}💾 Stopping Redis...${NC}"
    sudo service redis-server stop && echo -e "${GREEN}✅ Redis stopped${NC}" || echo -e "${RED}❌ Failed to stop Redis${NC}"
else
    echo -e "${BLUE}ℹ️  PostgreSQL and Redis left running${NC}"
fi

# Clean up log files (optional)
echo ""
read -p "Do you want to clear log files? [y/N]: " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f "$FRONTEND_DIR/frontend.log"
    rm -f "$BACKEND_DIR/backend.log"
    rm -f "$BACKEND_DIR/prisma-studio.log"
    echo -e "${GREEN}✅ Log files cleared${NC}"
fi

# Restore demo mode (optional)
echo ""
read -p "Do you want to restore demo mode? (for frontend-only usage) [y/N]: " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$FRONTEND_DIR"
    if [ -f ".env.development.backup" ]; then
        cp .env.development.backup .env.development
        echo -e "${GREEN}✅ Demo mode restored${NC}"
    else
        sed -i 's/VITE_FORCE_DEMO_MODE=false/VITE_FORCE_DEMO_MODE=true/' .env.development
        echo -e "${GREEN}✅ Demo mode enabled${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 All Formula PM services stopped successfully!${NC}"
echo ""
echo -e "${BLUE}📝 Quick Status:${NC}"
echo -e "   🖥️  Frontend: ${RED}Stopped${NC}"
echo -e "   🚀 Backend: ${RED}Stopped${NC}"
echo -e "   🔍 Database Browser: ${RED}Stopped${NC}"

# Check if PostgreSQL and Redis are running
if pgrep -x "postgres" > /dev/null; then
    echo -e "   🗄️  PostgreSQL: ${GREEN}Running${NC}"
else
    echo -e "   🗄️  PostgreSQL: ${RED}Stopped${NC}"
fi

if pgrep -x "redis-server" > /dev/null; then
    echo -e "   💾 Redis: ${GREEN}Running${NC}"
else
    echo -e "   💾 Redis: ${RED}Stopped${NC}"
fi

echo ""
echo -e "${YELLOW}💡 To start again: ./start-full-backend.sh${NC}"