# Formula PM - Server Refresh Script (PowerShell)
# This script stops and restarts both backend and frontend servers

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Formula PM - Server Refresh Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a process is running on a specific port
function Test-Port {
    param([int]$Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $connection.Count -gt 0
    }
    catch {
        return $false
    }
}

# Function to kill processes on a specific port
function Stop-ProcessOnPort {
    param([int]$Port, [string]$ServiceName)
    
    if (Test-Port -Port $Port) {
        Write-Host "Stopping $ServiceName on port $Port..." -ForegroundColor Yellow
        
        # Get process ID using netstat
        $processInfo = netstat -ano | findstr ":$Port" | findstr "LISTENING"
        if ($processInfo) {
            $pid = ($processInfo -split '\s+')[-1]
            if ($pid -and $pid -match '^\d+$') {
                try {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Write-Host "✓ Stopped $ServiceName (PID: $pid)" -ForegroundColor Green
                }
                catch {
                    Write-Host "⚠ Could not stop process $pid" -ForegroundColor Red
                }
            }
        }
    }
    else {
        Write-Host "✓ No process running on port $Port" -ForegroundColor Green
    }
}

# Step 1: Stop existing servers
Write-Host "STEP 1: Stopping existing servers..." -ForegroundColor Magenta
Write-Host ""

Stop-ProcessOnPort -Port 5001 -ServiceName "Backend"
Stop-ProcessOnPort -Port 3002 -ServiceName "Frontend"

# Also kill any remaining node.exe processes
Write-Host "Stopping any remaining Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Waiting 3 seconds for cleanup..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Step 2: Verify ports are free
Write-Host "STEP 2: Verifying ports are free..." -ForegroundColor Magenta
Write-Host ""

$backend_free = -not (Test-Port -Port 5001)
$frontend_free = -not (Test-Port -Port 3002)

if ($backend_free) {
    Write-Host "✓ Port 5001 is free" -ForegroundColor Green
} else {
    Write-Host "⚠ Port 5001 still in use" -ForegroundColor Red
}

if ($frontend_free) {
    Write-Host "✓ Port 3002 is free" -ForegroundColor Green
} else {
    Write-Host "⚠ Port 3002 still in use" -ForegroundColor Red
}

Write-Host ""

# Step 3: Start servers
Write-Host "STEP 3: Starting servers..." -ForegroundColor Magenta
Write-Host ""

# Get script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Write-Host "Starting Formula PM Backend (Port 5001)..." -ForegroundColor Cyan
$backendPath = Join-Path $scriptPath "formula-backend"
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "cd /d `"$backendPath`" && echo Backend starting on http://localhost:5001 && npm start" -WindowStyle Normal

Write-Host "Backend starting in new window..." -ForegroundColor Green
Write-Host ""

# Wait for backend to initialize
Write-Host "Waiting 5 seconds for backend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Formula PM Frontend (Port 3002)..." -ForegroundColor Cyan
$frontendPath = Join-Path $scriptPath "formula-project-app"
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "cd /d `"$frontendPath`" && echo Frontend starting on http://localhost:3002 && npm start" -WindowStyle Normal

Write-Host "Frontend starting in new window..." -ForegroundColor Green
Write-Host ""

# Final status
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Server Refresh Complete!" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Backend:  http://localhost:5001" -ForegroundColor Yellow
Write-Host "🎨 Frontend: http://localhost:3002" -ForegroundColor Yellow
Write-Host ""
Write-Host "Both servers are starting in separate windows." -ForegroundColor White
Write-Host "Wait for 'compiled successfully' message in frontend window." -ForegroundColor White
Write-Host ""
Write-Host "📊 New demo data includes:" -ForegroundColor Magenta
Write-Host "  • 20 Scope Items (4 groups)" -ForegroundColor Gray
Write-Host "  • 6 Shop Drawings" -ForegroundColor Gray
Write-Host "  • 8 Material Specifications" -ForegroundColor Gray
Write-Host "  • 23 Tasks" -ForegroundColor Gray
Write-Host "  • 6 Client Companies" -ForegroundColor Gray
Write-Host ""

# Keep window open
Write-Host "Press any key to close this window..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")