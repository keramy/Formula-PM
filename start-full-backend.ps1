# Formula PM - Full Backend Startup Script (PowerShell)
# This script sets up and starts the complete Formula PM system with real backend
# Designed for Windows PowerShell

# Set error action preference
$ErrorActionPreference = "Stop"

# Project paths
$PROJECT_ROOT = "C:\Users\Kerem\Desktop\formula-pm"
$FRONTEND_DIR = "$PROJECT_ROOT\formula-project-app"
$BACKEND_DIR = "$PROJECT_ROOT\formula-project-app\backend"

Write-Host "🚀 Formula PM Full Backend Startup" -ForegroundColor Blue
Write-Host "====================================" -ForegroundColor Blue
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if a service is running
function Test-Service {
    param($ServiceName)
    try {
        $service = Get-Service -Name $ServiceName -ErrorAction Stop
        return $service.Status -eq "Running"
    }
    catch {
        return $false
    }
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "npm found: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "npm not found. Please install npm" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
if (Test-Command "psql") {
    Write-Host "✅ PostgreSQL found" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL not found. Please install PostgreSQL" -ForegroundColor Red
    exit 1
}

# Check Redis (optional check - may not be installed as service on Windows)
if (Test-Command "redis-server") {
    Write-Host "✅ Redis found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Redis not found as command, checking for service..." -ForegroundColor Yellow
    if (Test-Service "Redis") {
        Write-Host "✅ Redis service found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Redis not found. You may need to install Redis for Windows" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🔧 Setting up Formula PM..." -ForegroundColor Yellow

# Navigate to project directory
Set-Location $PROJECT_ROOT

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location $FRONTEND_DIR
if (!(Test-Path "node_modules")) {
    npm install
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
}

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location $BACKEND_DIR
if (!(Test-Path "node_modules")) {
    npm install
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Backend dependencies already installed" -ForegroundColor Green
}

# Configure environment for backend mode
Write-Host "⚙️  Configuring environment for backend testing..." -ForegroundColor Yellow
Set-Location $FRONTEND_DIR

$envContent = @"
# Formula PM Development Environment
VITE_FORCE_DEMO_MODE=false
VITE_API_BASE_URL=http://localhost:5014/api/v1
VITE_SOCKET_URL=http://localhost:5015
VITE_APP_NAME=Formula PM
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG_LOGS=true
VITE_SHOW_PERFORMANCE_METRICS=true
"@

Set-Content -Path ".env.development" -Value $envContent
Write-Host "✅ Demo mode disabled - will use real backend" -ForegroundColor Green

# Start PostgreSQL service
Write-Host "🗄️  Starting PostgreSQL..." -ForegroundColor Yellow
try {
    if (Test-Service "postgresql*") {
        Write-Host "✅ PostgreSQL service already running" -ForegroundColor Green
    } else {
        # Try to start PostgreSQL service (name may vary on Windows)
        $pgServices = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
        if ($pgServices) {
            Start-Service -Name $pgServices[0].Name
            Write-Host "✅ PostgreSQL service started" -ForegroundColor Green
        } else {
            Write-Host "⚠️  PostgreSQL service not found. Please start PostgreSQL manually" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠️  Could not start PostgreSQL service. Please start PostgreSQL manually" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# Start Redis service
Write-Host "💾 Starting Redis..." -ForegroundColor Yellow
try {
    if (Test-Service "Redis") {
        Write-Host "✅ Redis service already running" -ForegroundColor Green
    } else {
        # Try to start Redis service
        Start-Service -Name "Redis" -ErrorAction SilentlyContinue
        Write-Host "✅ Redis service started" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Redis service not found. Please start Redis manually or install Redis for Windows" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# Setup database
Write-Host "🏗️  Setting up database..." -ForegroundColor Yellow
Set-Location $BACKEND_DIR

# Create database user and database if not exists
Write-Host "📝 Configuring database user and permissions..." -ForegroundColor Cyan

$sqlCommands = @"
CREATE USER formula_pm_user WITH PASSWORD 'formula_pm_password';
ALTER USER formula_pm_user CREATEDB;
CREATE DATABASE formula_pm_dev OWNER formula_pm_user;
GRANT ALL PRIVILEGES ON DATABASE formula_pm_dev TO formula_pm_user;
"@

# Run SQL commands (suppress errors for existing objects)
try {
    $sqlCommands | psql -U postgres -h localhost 2>$null
} catch {
    # Ignore errors for existing users/databases
}

Write-Host "✅ Database user and permissions configured" -ForegroundColor Green

# Generate Prisma client and push schema
Write-Host "📊 Setting up database schema..." -ForegroundColor Yellow
npx prisma generate
npx prisma db push

# Seed database with initial data
Write-Host "🌱 Seeding database with initial data..." -ForegroundColor Yellow
npx prisma db seed

Write-Host "✅ Database setup complete" -ForegroundColor Green

# Start backend services
Write-Host "🚀 Starting backend services..." -ForegroundColor Yellow
Set-Location $BACKEND_DIR

# Kill any existing processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowTitle -like "*server.js*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Start backend in background
$backendJob = Start-Job -ScriptBlock {
    param($BackendDir)
    Set-Location $BackendDir
    npm run dev
} -ArgumentList $BACKEND_DIR

$backendPID = $backendJob.Id
Write-Host "✅ Backend API started (Job ID: $backendPID)" -ForegroundColor Green

# Wait for backend to be ready
Write-Host "⏳ Waiting for backend to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

do {
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5014/health" -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend is ready!" -ForegroundColor Green
            break
        }
    } catch {
        # Backend not ready yet
    }
    
    if ($attempt -eq $maxAttempts) {
        Write-Host "❌ Backend failed to start. Check backend logs for errors." -ForegroundColor Red
        Write-Host "📋 Check backend logs: Get-Job $backendPID | Receive-Job" -ForegroundColor Yellow
        exit 1
    }
    
    Start-Sleep -Seconds 2
} while ($attempt -lt $maxAttempts)

# Start frontend
Write-Host "🖥️  Starting frontend..." -ForegroundColor Yellow
Set-Location $FRONTEND_DIR

# Kill any existing frontend processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowTitle -like "*vite*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Start frontend in background
$env:VITE_FORCE_DEMO_MODE = "false"
$frontendJob = Start-Job -ScriptBlock {
    param($FrontendDir)
    Set-Location $FrontendDir
    $env:VITE_FORCE_DEMO_MODE = "false"
    npm run dev
} -ArgumentList $FRONTEND_DIR

$frontendPID = $frontendJob.Id
Write-Host "✅ Frontend started (Job ID: $frontendPID)" -ForegroundColor Green

# Start database browser
Write-Host "🔍 Starting database browser..." -ForegroundColor Yellow
Set-Location $BACKEND_DIR

$prismaJob = Start-Job -ScriptBlock {
    param($BackendDir)
    Set-Location $BackendDir
    npx prisma studio
} -ArgumentList $BACKEND_DIR

$prismaPID = $prismaJob.Id
Write-Host "✅ Database browser started (Job ID: $prismaPID)" -ForegroundColor Green

# Save process IDs for stop script
$processInfo = @{
    BackendJobId = $backendPID
    FrontendJobId = $frontendPID
    PrismaJobId = $prismaPID
}
$processInfo | ConvertTo-Json | Set-Content -Path "$PROJECT_ROOT\formula-pm-processes.json"

Write-Host ""
Write-Host "🎉 Formula PM is now running!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Access your application:" -ForegroundColor Blue
Write-Host "   🖥️  Frontend: http://localhost:3003" -ForegroundColor Cyan
Write-Host "   🚀 Backend API: http://localhost:5014" -ForegroundColor Cyan
Write-Host "   🔍 Database Browser: http://localhost:5555" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔑 Login credentials:" -ForegroundColor Blue
Write-Host "   📧 Email: admin@formulapm.com" -ForegroundColor Cyan
Write-Host "   🔒 Password: admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "🛑 To stop all services: .\stop-full-backend.ps1" -ForegroundColor Yellow
Write-Host "📊 To check status: .\check-status.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 For usage guide: See NEWBIE_GUIDE.md" -ForegroundColor Blue
Write-Host "🗄️  Database guide: See DATABASE_EXPLORER_GUIDE.md" -ForegroundColor Blue