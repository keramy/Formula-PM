# Formula PM - Stop All Services Script (PowerShell)
# This script stops all Formula PM services

$PROJECT_ROOT = "C:\Users\Kerem\Desktop\formula-pm"

Write-Host "🛑 Stopping Formula PM Services" -ForegroundColor Blue
Write-Host "===============================" -ForegroundColor Blue
Write-Host ""

# Read process information
$processFile = "$PROJECT_ROOT\formula-pm-processes.json"
if (Test-Path $processFile) {
    try {
        $processInfo = Get-Content $processFile | ConvertFrom-Json
        
        # Stop frontend
        Write-Host "🖥️  Stopping frontend..." -ForegroundColor Yellow
        if ($processInfo.FrontendJobId) {
            Stop-Job -Id $processInfo.FrontendJobId -ErrorAction SilentlyContinue
            Remove-Job -Id $processInfo.FrontendJobId -ErrorAction SilentlyContinue
            Write-Host "✅ Frontend stopped" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Frontend job ID not found" -ForegroundColor Yellow
        }
        
        # Stop backend API
        Write-Host "🚀 Stopping backend API..." -ForegroundColor Yellow
        if ($processInfo.BackendJobId) {
            Stop-Job -Id $processInfo.BackendJobId -ErrorAction SilentlyContinue
            Remove-Job -Id $processInfo.BackendJobId -ErrorAction SilentlyContinue
            Write-Host "✅ Backend API stopped" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Backend API job ID not found" -ForegroundColor Yellow
        }
        
        # Stop database browser
        Write-Host "🔍 Stopping database browser..." -ForegroundColor Yellow
        if ($processInfo.PrismaJobId) {
            Stop-Job -Id $processInfo.PrismaJobId -ErrorAction SilentlyContinue
            Remove-Job -Id $processInfo.PrismaJobId -ErrorAction SilentlyContinue
            Write-Host "✅ Database browser stopped" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Database browser job ID not found" -ForegroundColor Yellow
        }
        
        # Remove process file
        Remove-Item $processFile -ErrorAction SilentlyContinue
        
    } catch {
        Write-Host "⚠️  Could not read process file" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Process file not found, attempting to stop processes manually..." -ForegroundColor Yellow
}

# Manual cleanup - stop any remaining Node.js processes
Write-Host "🧹 Cleaning up remaining processes..." -ForegroundColor Yellow

# Stop any Node.js processes that might be running Formula PM
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
foreach ($process in $nodeProcesses) {
    try {
        $cmdLine = (Get-WmiObject Win32_Process -Filter "ProcessId = $($process.Id)").CommandLine
        if ($cmdLine -like "*server.js*" -or $cmdLine -like "*vite*" -or $cmdLine -like "*prisma*") {
            Stop-Process -Id $process.Id -Force
            Write-Host "✅ Stopped Node.js process: $($process.Id)" -ForegroundColor Green
        }
    } catch {
        # Process might have already stopped
    }
}

Write-Host ""
Write-Host "🗄️  Database Services:" -ForegroundColor Blue
Write-Host ""

# Option to stop database services
$response = Read-Host "Do you want to stop PostgreSQL and Redis services? (y/N)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "🛑 Stopping database services..." -ForegroundColor Yellow
    
    # Stop PostgreSQL
    try {
        $pgServices = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
        if ($pgServices) {
            Stop-Service -Name $pgServices[0].Name -Force
            Write-Host "✅ PostgreSQL service stopped" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Could not stop PostgreSQL service" -ForegroundColor Yellow
    }
    
    # Stop Redis
    try {
        Stop-Service -Name "Redis" -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Redis service stopped" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not stop Redis service" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  PostgreSQL and Redis left running" -ForegroundColor Cyan
}

# Option to clear logs
Write-Host ""
$clearLogs = Read-Host "Do you want to clear application logs? (y/N)"
if ($clearLogs -eq "y" -or $clearLogs -eq "Y") {
    Write-Host "🗑️  Clearing logs..." -ForegroundColor Yellow
    Remove-Item "$PROJECT_ROOT\formula-project-app\backend\backend.log" -ErrorAction SilentlyContinue
    Remove-Item "$PROJECT_ROOT\formula-project-app\backend\*.log" -ErrorAction SilentlyContinue
    Write-Host "✅ Logs cleared" -ForegroundColor Green
}

Write-Host ""
Write-Host ""
Write-Host ""
Write-Host "🎉 All Formula PM services stopped successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Quick Status:" -ForegroundColor Blue
Write-Host "   🖥️  Frontend: Stopped" -ForegroundColor Red
Write-Host "   🚀 Backend: Stopped" -ForegroundColor Red
Write-Host "   🔍 Database Browser: Stopped" -ForegroundColor Red

# Check database service status
try {
    $pgServices = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if ($pgServices -and $pgServices[0].Status -eq "Running") {
        Write-Host "   🗄️  PostgreSQL: Running" -ForegroundColor Green
    } else {
        Write-Host "   🗄️  PostgreSQL: Stopped" -ForegroundColor Red
    }
} catch {
    Write-Host "   🗄️  PostgreSQL: Unknown" -ForegroundColor Yellow
}

try {
    $redisService = Get-Service -Name "Redis" -ErrorAction SilentlyContinue
    if ($redisService -and $redisService.Status -eq "Running") {
        Write-Host "   💾 Redis: Running" -ForegroundColor Green
    } else {
        Write-Host "   💾 Redis: Stopped" -ForegroundColor Red
    }
} catch {
    Write-Host "   💾 Redis: Unknown" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 To start again: .\start-full-backend.ps1" -ForegroundColor Yellow