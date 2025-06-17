# Formula PM Startup Script
# Run this from the formula-pm directory

Write-Host "🚀 Starting Formula PM Application..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "formula-backend") -or -not (Test-Path "formula-project-app")) {
    Write-Host "❌ Error: Please run this script from the formula-pm directory" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "Expected to find: formula-backend and formula-project-app folders" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "📁 Found project directories ✓" -ForegroundColor Green

# Start Backend in new window
Write-Host "🔧 Starting Backend Server (Port 5006)..." -ForegroundColor Cyan
$backendPath = Join-Path (Get-Location) "formula-backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Cyan; npm start"

# Wait a moment for backend to start
Write-Host "⏳ Waiting 5 seconds for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend in new window  
Write-Host "🌐 Starting Frontend Server (Port 3002)..." -ForegroundColor Cyan
$frontendPath = Join-Path (Get-Location) "formula-project-app"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🌐 Frontend Server Starting...' -ForegroundColor Cyan; npm start"

Write-Host ""
Write-Host "✅ Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Expected Results:" -ForegroundColor White
Write-Host "   Backend:  🚀 Formula Project Management API running on port 5006" -ForegroundColor Gray
Write-Host "   Frontend: ➜ Local: http://localhost:3002/" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Once both servers are ready, open: http://localhost:3002" -ForegroundColor Yellow
Write-Host ""
Write-Host "🛑 To stop servers: Close the PowerShell windows or press Ctrl+C in each" -ForegroundColor Red
Write-Host ""

pause