#!/bin/bash

# Formula PM - Status Check Script
# This script shows the current status of all Formula PM services

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Formula PM System Status${NC}"
echo -e "${BLUE}=========================${NC}"
echo ""

# Function to check if a service is running on a specific port
check_port() {
    local port=$1
    if netstat -tuln 2>/dev/null | grep ":$port " > /dev/null; then
        return 0
    fi
    return 1
}

# Function to check HTTP service
check_http() {
    local url=$1
    if curl -s "$url" > /dev/null 2>&1; then
        return 0
    fi
    return 1
}

# Check Frontend (Port 3003)
echo -e "${BLUE}🖥️  Frontend Status:${NC}"
if check_port 3003; then
    if check_http "http://localhost:3003"; then
        echo -e "   Status: ${GREEN}✅ Running and Responding${NC}"
        echo -e "   URL: ${GREEN}http://localhost:3003${NC}"
    else
        echo -e "   Status: ${YELLOW}⚠️  Port active but not responding${NC}"
    fi
else
    echo -e "   Status: ${RED}❌ Not Running${NC}"
fi

echo ""

# Check Backend API (Port 5014)
echo -e "${BLUE}🚀 Backend API Status:${NC}"
if check_port 5014; then
    if check_http "http://localhost:5014/api/v1/health"; then
        echo -e "   Status: ${GREEN}✅ Running and Healthy${NC}"
        echo -e "   URL: ${GREEN}http://localhost:5014/api/v1${NC}"
        echo -e "   Health: ${GREEN}http://localhost:5014/api/v1/health${NC}"
    else
        echo -e "   Status: ${YELLOW}⚠️  Port active but health check failed${NC}"
    fi
else
    echo -e "   Status: ${RED}❌ Not Running${NC}"
fi

echo ""

# Check Database Browser (Port 5555)
echo -e "${BLUE}🔍 Database Browser (Prisma Studio):${NC}"
if check_port 5555; then
    if check_http "http://localhost:5555"; then
        echo -e "   Status: ${GREEN}✅ Running and Accessible${NC}"
        echo -e "   URL: ${GREEN}http://localhost:5555${NC}"
    else
        echo -e "   Status: ${YELLOW}⚠️  Port active but not responding${NC}"
    fi
else
    echo -e "   Status: ${RED}❌ Not Running${NC}"
fi

echo ""

# Check PostgreSQL
echo -e "${BLUE}🗄️  PostgreSQL Database:${NC}"
if pgrep -x "postgres" > /dev/null; then
    echo -e "   Status: ${GREEN}✅ Running${NC}"
    if command -v psql > /dev/null 2>&1; then
        # Try to connect to the database
        if PGPASSWORD=formula_pm_password psql -h localhost -U formula_pm_user -d formula_pm_dev -c '\q' > /dev/null 2>&1; then
            echo -e "   Connection: ${GREEN}✅ Database accessible${NC}"
        else
            echo -e "   Connection: ${YELLOW}⚠️  Database connection issues${NC}"
        fi
    fi
else
    echo -e "   Status: ${RED}❌ Not Running${NC}"
    echo -e "   ${YELLOW}💡 Start with: sudo service postgresql start${NC}"
fi

echo ""

# Check Redis
echo -e "${BLUE}💾 Redis Cache:${NC}"
if pgrep -x "redis-server" > /dev/null; then
    echo -e "   Status: ${GREEN}✅ Running${NC}"
    if command -v redis-cli > /dev/null 2>&1; then
        # Try to ping Redis
        if redis-cli ping > /dev/null 2>&1; then
            echo -e "   Connection: ${GREEN}✅ Redis responding${NC}"
        else
            echo -e "   Connection: ${YELLOW}⚠️  Redis not responding${NC}"
        fi
    fi
else
    echo -e "   Status: ${RED}❌ Not Running${NC}"
    echo -e "   ${YELLOW}💡 Start with: sudo service redis-server start${NC}"
fi

echo ""

# Check Node.js processes
echo -e "${BLUE}🔧 Node.js Processes:${NC}"
NODE_PROCESSES=$(pgrep -f "node" | wc -l)
if [ $NODE_PROCESSES -gt 0 ]; then
    echo -e "   Running Node.js processes: ${GREEN}$NODE_PROCESSES${NC}"
    echo -e "   Details:"
    pgrep -af "node" | while read line; do
        echo -e "     ${YELLOW}$line${NC}"
    done
else
    echo -e "   Running Node.js processes: ${RED}0${NC}"
fi

echo ""

# Check environment configuration
echo -e "${BLUE}⚙️  Environment Configuration:${NC}"
FRONTEND_DIR="/mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app"
if [ -f "$FRONTEND_DIR/.env.development" ]; then
    DEMO_MODE=$(grep "VITE_FORCE_DEMO_MODE" "$FRONTEND_DIR/.env.development" | cut -d'=' -f2)
    if [ "$DEMO_MODE" = "true" ]; then
        echo -e "   Mode: ${YELLOW}Demo Mode (using fake data)${NC}"
    else
        echo -e "   Mode: ${GREEN}Backend Mode (using real database)${NC}"
    fi
else
    echo -e "   Config: ${RED}❌ .env.development not found${NC}"
fi

echo ""

# System Resources
echo -e "${BLUE}📈 System Resources:${NC}"
if command -v free > /dev/null 2>&1; then
    MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100.0)}')
    echo -e "   Memory Usage: ${GREEN}$MEMORY_USAGE${NC}"
fi

if command -v df > /dev/null 2>&1; then
    DISK_USAGE=$(df / | tail -1 | awk '{print $5}')
    echo -e "   Disk Usage: ${GREEN}$DISK_USAGE${NC}"
fi

echo ""

# Overall Status Summary
echo -e "${BLUE}📋 Overall Status Summary:${NC}"

SERVICES_RUNNING=0
TOTAL_SERVICES=5

check_port 3003 && ((SERVICES_RUNNING++))
check_port 5014 && ((SERVICES_RUNNING++))
check_port 5555 && ((SERVICES_RUNNING++))
pgrep -x "postgres" > /dev/null && ((SERVICES_RUNNING++))
pgrep -x "redis-server" > /dev/null && ((SERVICES_RUNNING++))

if [ $SERVICES_RUNNING -eq $TOTAL_SERVICES ]; then
    echo -e "   ${GREEN}🎉 All services running perfectly! ($SERVICES_RUNNING/$TOTAL_SERVICES)${NC}"
elif [ $SERVICES_RUNNING -gt 2 ]; then
    echo -e "   ${YELLOW}⚠️  Most services running ($SERVICES_RUNNING/$TOTAL_SERVICES)${NC}"
    echo -e "   ${YELLOW}💡 Run ./start-full-backend.sh to start missing services${NC}"
else
    echo -e "   ${RED}❌ Few services running ($SERVICES_RUNNING/$TOTAL_SERVICES)${NC}"
    echo -e "   ${YELLOW}💡 Run ./start-full-backend.sh to start the system${NC}"
fi

echo ""

# Quick actions
echo -e "${BLUE}🛠️  Quick Actions:${NC}"
if [ $SERVICES_RUNNING -lt $TOTAL_SERVICES ]; then
    echo -e "   ${GREEN}Start system: ./start-full-backend.sh${NC}"
fi
if [ $SERVICES_RUNNING -gt 0 ]; then
    echo -e "   ${RED}Stop system: ./stop-full-backend.sh${NC}"
fi
echo -e "   ${BLUE}View logs: tail -f formula-project-app/backend/backend.log${NC}"
echo -e "   ${BLUE}Database: NEWBIE_GUIDE.md and DATABASE_EXPLORER_GUIDE.md${NC}"