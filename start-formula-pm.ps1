# Formula PM - PowerShell Startup Script
# Simple version to start Formula PM on Windows

$ErrorActionPreference = "Continue"

$PROJECT_ROOT = "C:\Users\Kerem\Desktop\formula-pm"
$FRONTEND_DIR = "$PROJECT_ROOT\formula-project-app"
$BACKEND_DIR = "$PROJECT_ROOT\formula-project-app\backend"

Write-Host "Formula PM Startup Script" -ForegroundColor Blue
Write-Host "=========================" -ForegroundColor Blue
Write-Host ""

# Check if paths exist
if (!(Test-Path $PROJECT_ROOT)) {
    Write-Host "Error: Project directory not found at $PROJECT_ROOT" -ForegroundColor Red
    exit 1
}

# Navigate to frontend directory
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location $FRONTEND_DIR

# Create .env.development file with proper settings
$envContent = "VITE_FORCE_DEMO_MODE=true`nVITE_API_BASE_URL=http://localhost:5014"
Set-Content -Path ".env.development" -Value $envContent
Write-Host "Environment configured with demo mode fallback" -ForegroundColor Green

# Install frontend dependencies if needed
if (!(Test-Path "node_modules")) {
    npm install
}

# Navigate to backend directory  
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location $BACKEND_DIR

# Install backend dependencies if needed
if (!(Test-Path "node_modules")) {
    npm install
}

# Setup database
Write-Host "Setting up database..." -ForegroundColor Yellow
try {
    npx prisma generate
    npx prisma db push
    npx prisma db seed
    Write-Host "Database setup complete" -ForegroundColor Green
} catch {
    Write-Host "Database setup had some issues but continuing..." -ForegroundColor Yellow
}

# Start backend (simple server)
Write-Host "Starting backend server..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    node simple-server.js
} -ArgumentList $BACKEND_DIR

Write-Host "Backend started (Job ID: $($backendJob.Id))" -ForegroundColor Green

# Wait a bit for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start frontend
Write-Host "Starting frontend..." -ForegroundColor Yellow
Set-Location $FRONTEND_DIR

$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    $env:VITE_FORCE_DEMO_MODE = "true"
    npm run dev
} -ArgumentList $FRONTEND_DIR

Write-Host "Frontend started (Job ID: $($frontendJob.Id))" -ForegroundColor Green

# Start Prisma Studio
Write-Host "Starting database browser..." -ForegroundColor Yellow
Set-Location $BACKEND_DIR

$prismaJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npx prisma studio
} -ArgumentList $BACKEND_DIR

Write-Host "Database browser started (Job ID: $($prismaJob.Id))" -ForegroundColor Green

# Save job IDs
$jobs = @{
    Backend = $backendJob.Id
    Frontend = $frontendJob.Id
    Prisma = $prismaJob.Id
} | ConvertTo-Json

Set-Content -Path "$PROJECT_ROOT\running-jobs.json" -Value $jobs

Write-Host ""
Write-Host "Formula PM is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Blue
Write-Host "  Frontend: http://localhost:3003" -ForegroundColor Cyan
Write-Host "  Backend API: http://localhost:5014" -ForegroundColor Cyan  
Write-Host "  Database Browser: http://localhost:5555" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login with:" -ForegroundColor Blue
Write-Host "  Email: admin@formulapm.com" -ForegroundColor Cyan
Write-Host "  Password: admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop services, run: .\stop-formula-pm.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Note: It may take 1-2 minutes for all services to be fully ready." -ForegroundColor Yellow