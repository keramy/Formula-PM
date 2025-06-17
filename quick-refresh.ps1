# Formula PM - Quick Refresh (PowerShell)
# Minimal script for fast server refresh

Write-Host "🔄 Formula PM Quick Refresh" -ForegroundColor Cyan

# Stop processes on ports 5001 and 3002
Write-Host "Stopping servers..." -ForegroundColor Yellow
$processes = netstat -ano | findstr ":5001\|:3002" | findstr "LISTENING"
if ($processes) {
    $processes | ForEach-Object {
        $pid = ($_ -split '\s+')[-1]
        if ($pid -match '^\d+$') {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
}

# Kill any remaining node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

# Get script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start servers
Write-Host "Starting backend..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "cd /d `"$scriptPath\formula-backend`" && npm start" -WindowStyle Minimized

Start-Sleep -Seconds 3

Write-Host "Starting frontend..." -ForegroundColor Green  
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "cd /d `"$scriptPath\formula-project-app`" && npm start" -WindowStyle Normal

Write-Host "✅ Servers refreshed!" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5001" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:3002" -ForegroundColor Gray