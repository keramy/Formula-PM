#!/bin/bash

# Formula PM - Full Backend Startup Script
# This script sets up and starts the complete Formula PM system with real backend
# Designed for Ubuntu/WSL2

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project paths
PROJECT_ROOT="/mnt/c/Users/Kerem/Desktop/formula-pm"
FRONTEND_DIR="$PROJECT_ROOT/formula-project-app"
BACKEND_DIR="$PROJECT_ROOT/formula-project-app/backend"

echo -e "${BLUE}🚀 Formula PM Full Backend Startup${NC}"
echo -e "${BLUE}====================================${NC}"
echo ""

# Function to check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        return 1
    fi
    return 0
}

# Function to check if a service is running
check_service() {
    if pgrep -f "$1" > /dev/null; then
        return 0
    fi
    return 1
}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check Node.js
if check_command node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    echo -e "${YELLOW}Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}✅ Node.js installed${NC}"
fi

# Check npm
if check_command npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm found: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found (should come with Node.js)${NC}"
    exit 1
fi

# Check PostgreSQL
if check_command psql; then
    echo -e "${GREEN}✅ PostgreSQL found${NC}"
else
    echo -e "${YELLOW}📦 Installing PostgreSQL...${NC}"
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    echo -e "${GREEN}✅ PostgreSQL installed and started${NC}"
fi

# Check Redis
if check_command redis-server; then
    echo -e "${GREEN}✅ Redis found${NC}"
else
    echo -e "${YELLOW}📦 Installing Redis...${NC}"
    sudo apt update
    sudo apt install -y redis-server
    sudo systemctl start redis-server
    sudo systemctl enable redis-server
    echo -e "${GREEN}✅ Redis installed and started${NC}"
fi

echo ""
echo -e "${YELLOW}🔧 Setting up Formula PM...${NC}"

# Navigate to project directory
cd "$PROJECT_ROOT"

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Frontend dependencies already installed${NC}"
fi

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Backend dependencies already installed${NC}"
fi

# Configure environment for backend mode
echo -e "${YELLOW}⚙️  Configuring environment for backend testing...${NC}"
cd "$FRONTEND_DIR"
if [ -f ".env.development" ]; then
    # Backup original
    cp .env.development .env.development.backup
    # Set to backend mode
    sed -i 's/VITE_FORCE_DEMO_MODE=true/VITE_FORCE_DEMO_MODE=false/' .env.development
    echo -e "${GREEN}✅ Demo mode disabled - will use real backend${NC}"
else
    echo -e "${YELLOW}⚠️  .env.development not found, creating one...${NC}"
    cat > .env.development << EOL
# Development Environment Configuration
VITE_FORCE_DEMO_MODE=false
VITE_API_URL=
VITE_APP_NAME=Formula PM
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG_LOGS=true
VITE_SHOW_PERFORMANCE_METRICS=true
EOL
    echo -e "${GREEN}✅ Environment configuration created${NC}"
fi

# Start PostgreSQL service
echo -e "${YELLOW}🗄️  Starting PostgreSQL...${NC}"
sudo service postgresql start
sleep 2

# Start Redis service
echo -e "${YELLOW}💾 Starting Redis...${NC}"
sudo service redis-server start
sleep 2

# Setup database
echo -e "${YELLOW}🏗️  Setting up database...${NC}"
cd "$BACKEND_DIR"

# Create database user and database if not exists (suppress "already exists" errors)
echo -e "${BLUE}📝 Configuring database user and permissions...${NC}"
sudo -u postgres psql 2>/dev/null << EOL || true
CREATE USER formula_pm_user WITH PASSWORD 'formula_pm_password';
EOL

sudo -u postgres psql 2>/dev/null << EOL || true
ALTER USER formula_pm_user CREATEDB;
EOL

sudo -u postgres psql 2>/dev/null << EOL || true
CREATE DATABASE formula_pm_dev OWNER formula_pm_user;
EOL

sudo -u postgres psql 2>/dev/null << EOL || true
GRANT ALL PRIVILEGES ON DATABASE formula_pm_dev TO formula_pm_user;
EOL

echo -e "${GREEN}✅ Database user and permissions configured${NC}"

# Generate Prisma client and push schema
echo -e "${YELLOW}📊 Setting up database schema...${NC}"
npx prisma generate
npx prisma db push

# Seed database with initial data
echo -e "${YELLOW}🌱 Seeding database with initial data...${NC}"
npx prisma db seed

echo -e "${GREEN}✅ Database setup complete${NC}"

# Start backend services
echo -e "${YELLOW}🚀 Starting backend services...${NC}"
cd "$BACKEND_DIR"

# Kill any existing processes
pkill -f "node.*server.js" || true
pkill -f "npm.*dev" || true

# Start backend in background
nohup npm run dev > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

echo -e "${GREEN}✅ Backend API started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:5014/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend failed to start. Check backend.log for errors.${NC}"
        echo -e "${YELLOW}📋 Check backend logs:${NC} cat formula-project-app/backend/backend.log"
        exit 1
    fi
    sleep 2
done

# Start frontend
echo -e "${YELLOW}🖥️  Starting frontend...${NC}"
cd "$FRONTEND_DIR"

# Kill any existing frontend processes
pkill -f "vite" || true

# Start frontend in background
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid

echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

# Wait for frontend to be ready
echo -e "${YELLOW}⏳ Waiting for frontend to be ready...${NC}"
for i in {1..20}; do
    if curl -s http://localhost:3003 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is ready!${NC}"
        break
    fi
    sleep 3
done

# Start Prisma Studio for database exploration
echo -e "${YELLOW}🔍 Starting database browser...${NC}"
cd "$BACKEND_DIR"
nohup npx prisma studio > prisma-studio.log 2>&1 &
PRISMA_PID=$!
echo $PRISMA_PID > prisma-studio.pid

# Wait for Prisma Studio
sleep 5

echo ""
echo -e "${GREEN}🎉 Formula PM is now running with full backend!${NC}"
echo -e "${GREEN}=============================================${NC}"
echo ""
echo -e "${BLUE}📱 Access Points:${NC}"
echo -e "   🌐 Main Application:    ${GREEN}http://localhost:3003${NC}"
echo -e "   🔧 Backend API:         ${GREEN}http://localhost:5014/api/v1${NC}"
echo -e "   🗄️  Database Browser:    ${GREEN}http://localhost:5555${NC}"
echo -e "   📊 API Health Check:    ${GREEN}http://localhost:5014/api/v1/health${NC}"
echo ""
echo -e "${BLUE}📚 Guides:${NC}"
echo -e "   📖 Read: ${YELLOW}NEWBIE_GUIDE.md${NC} - Complete usage guide"
echo -e "   🗄️  Read: ${YELLOW}DATABASE_EXPLORER_GUIDE.md${NC} - Database exploration"
echo ""
echo -e "${BLUE}🛠️  Management:${NC}"
echo -e "   ⏹️  Stop everything:      ${YELLOW}./stop-full-backend.sh${NC}"
echo -e "   📊 Check status:         ${YELLOW}./check-status.sh${NC}"
echo ""
echo -e "${BLUE}🔍 Logs:${NC}"
echo -e "   Backend: ${YELLOW}tail -f $BACKEND_DIR/backend.log${NC}"
echo -e "   Frontend: ${YELLOW}tail -f $FRONTEND_DIR/frontend.log${NC}"
echo ""

# Try to open browser (if in WSL with Windows)
if command -v cmd.exe &> /dev/null; then
    echo -e "${YELLOW}🌐 Opening browser...${NC}"
    cmd.exe /c start http://localhost:3003
fi

echo -e "${GREEN}✨ Enjoy exploring Formula PM with real backend data!${NC}"
echo -e "${YELLOW}💡 Tip: Check the guides for detailed instructions on how to use everything${NC}"