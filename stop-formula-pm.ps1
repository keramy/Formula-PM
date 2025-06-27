# Formula PM - PowerShell Stop Script

$PROJECT_ROOT = "C:\Users\Kerem\Desktop\formula-pm"

Write-Host "Stopping Formula PM Services" -ForegroundColor Blue
Write-Host "=============================" -ForegroundColor Blue
Write-Host ""

# Try to read job IDs
$jobFile = "$PROJECT_ROOT\running-jobs.json"
if (Test-Path $jobFile) {
    try {
        $jobs = Get-Content $jobFile | ConvertFrom-Json
        
        Write-Host "Stopping backend..." -ForegroundColor Yellow
        Stop-Job -Id $jobs.Backend -ErrorAction SilentlyContinue
        Remove-Job -Id $jobs.Backend -ErrorAction SilentlyContinue
        
        Write-Host "Stopping frontend..." -ForegroundColor Yellow
        Stop-Job -Id $jobs.Frontend -ErrorAction SilentlyContinue
        Remove-Job -Id $jobs.Frontend -ErrorAction SilentlyContinue
        
        Write-Host "Stopping database browser..." -ForegroundColor Yellow
        Stop-Job -Id $jobs.Prisma -ErrorAction SilentlyContinue
        Remove-Job -Id $jobs.Prisma -ErrorAction SilentlyContinue
        
        Remove-Item $jobFile -ErrorAction SilentlyContinue
        
    } catch {
        Write-Host "Could not read job file, stopping manually..." -ForegroundColor Yellow
    }
}

# Stop any remaining Node processes
Write-Host "Cleaning up Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
foreach ($process in $nodeProcesses) {
    try {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    } catch {
        # Process already stopped
    }
}

# Stop all PowerShell background jobs
Get-Job | Stop-Job -ErrorAction SilentlyContinue
Get-Job | Remove-Job -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "All Formula PM services stopped!" -ForegroundColor Green