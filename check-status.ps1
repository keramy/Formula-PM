# Formula PM - Status Check Script (PowerShell)
# This script checks the status of all Formula PM services

$PROJECT_ROOT = "C:\Users\Kerem\Desktop\formula-pm"

Write-Host "📊 Formula PM Service Status" -ForegroundColor Blue
Write-Host "=============================" -ForegroundColor Blue
Write-Host ""

# Function to test if a port is listening
function Test-Port {
    param($Port)
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
        return $connection
    } catch {
        return $false
    }
}

# Function to test HTTP endpoint
function Test-HttpEndpoint {
    param($Url)
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

# Check Application Services
Write-Host "🚀 Application Services:" -ForegroundColor Blue
Write-Host ""

# Check Frontend (port 3003)
if (Test-Port 3003) {
    Write-Host "   🖥️  Frontend (port 3003): Running" -ForegroundColor Green
    if (Test-HttpEndpoint "http://localhost:3003") {
        Write-Host "      ✅ HTTP response: OK" -ForegroundColor Green
    } else {
        Write-Host "      ⚠️  HTTP response: Not responding" -ForegroundColor Yellow
    }
} else {
    Write-Host "   🖥️  Frontend (port 3003): Not running" -ForegroundColor Red
}

# Check Backend API (port 5014)
if (Test-Port 5014) {
    Write-Host "   🚀 Backend API (port 5014): Running" -ForegroundColor Green
    if (Test-HttpEndpoint "http://localhost:5014/health") {
        Write-Host "      ✅ Health check: OK" -ForegroundColor Green
    } else {
        Write-Host "      ⚠️  Health check: Failed" -ForegroundColor Yellow
    }
} else {
    Write-Host "   🚀 Backend API (port 5014): Not running" -ForegroundColor Red
}

# Check Prisma Studio (port 5555)
if (Test-Port 5555) {
    Write-Host "   🔍 Database Browser (port 5555): Running" -ForegroundColor Green
    if (Test-HttpEndpoint "http://localhost:5555") {
        Write-Host "      ✅ Web interface: Accessible" -ForegroundColor Green
    } else {
        Write-Host "      ⚠️  Web interface: Not responding" -ForegroundColor Yellow
    }
} else {
    Write-Host "   🔍 Database Browser (port 5555): Not running" -ForegroundColor Red
}

Write-Host ""
Write-Host "🗄️  Database Services:" -ForegroundColor Blue
Write-Host ""

# Check PostgreSQL service
try {
    $pgServices = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if ($pgServices) {
        $pgService = $pgServices[0]
        if ($pgService.Status -eq "Running") {
            Write-Host "   🗄️  PostgreSQL Service: Running" -ForegroundColor Green
            
            # Test PostgreSQL connection
            if (Test-Port 5432) {
                Write-Host "      ✅ Port 5432: Listening" -ForegroundColor Green
                
                # Test database connection
                try {
                    $testResult = psql -U postgres -h localhost -c "SELECT 1;" -t 2>$null
                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "      ✅ Database connection: OK" -ForegroundColor Green
                    } else {
                        Write-Host "      ⚠️  Database connection: Failed" -ForegroundColor Yellow
                    }
                } catch {
                    Write-Host "      ⚠️  Database connection: Could not test" -ForegroundColor Yellow
                }
            } else {
                Write-Host "      ❌ Port 5432: Not listening" -ForegroundColor Red
            }
        } else {
            Write-Host "   🗄️  PostgreSQL Service: $($pgService.Status)" -ForegroundColor Red
        }
    } else {
        Write-Host "   🗄️  PostgreSQL Service: Not found" -ForegroundColor Red
    }
} catch {
    Write-Host "   🗄️  PostgreSQL Service: Error checking status" -ForegroundColor Red
}

# Check Redis service
try {
    $redisService = Get-Service -Name "Redis" -ErrorAction SilentlyContinue
    if ($redisService) {
        if ($redisService.Status -eq "Running") {
            Write-Host "   💾 Redis Service: Running" -ForegroundColor Green
            
            # Test Redis connection
            if (Test-Port 6379) {
                Write-Host "      ✅ Port 6379: Listening" -ForegroundColor Green
            } else {
                Write-Host "      ❌ Port 6379: Not listening" -ForegroundColor Red
            }
        } else {
            Write-Host "   💾 Redis Service: $($redisService.Status)" -ForegroundColor Red
        }
    } else {
        Write-Host "   💾 Redis Service: Not found" -ForegroundColor Red
    }
} catch {
    Write-Host "   💾 Redis Service: Error checking status" -ForegroundColor Red
}

Write-Host ""
Write-Host "💻 System Information:" -ForegroundColor Blue
Write-Host ""

# Node.js processes
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   🟢 Active Node.js processes: $($nodeProcesses.Count)" -ForegroundColor Green
    foreach ($process in $nodeProcesses) {
        try {
            $cmdLine = (Get-WmiObject Win32_Process -Filter "ProcessId = $($process.Id)").CommandLine
            if ($cmdLine -like "*server.js*") {
                Write-Host "      • Backend server (PID: $($process.Id))" -ForegroundColor Cyan
            } elseif ($cmdLine -like "*vite*") {
                Write-Host "      • Frontend dev server (PID: $($process.Id))" -ForegroundColor Cyan
            } elseif ($cmdLine -like "*prisma*") {
                Write-Host "      • Prisma Studio (PID: $($process.Id))" -ForegroundColor Cyan
            }
        } catch {
            Write-Host "      • Node.js process (PID: $($process.Id))" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "   ⚫ Active Node.js processes: 0" -ForegroundColor Red
}

# PowerShell background jobs
$jobs = Get-Job -State Running -ErrorAction SilentlyContinue
if ($jobs) {
    Write-Host "   🔄 Active PowerShell jobs: $($jobs.Count)" -ForegroundColor Green
    foreach ($job in $jobs) {
        Write-Host "      • Job $($job.Id): $($job.Command)" -ForegroundColor Cyan
    }
} else {
    Write-Host "   🔄 Active PowerShell jobs: 0" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Quick Actions:" -ForegroundColor Blue
Write-Host "   🚀 Start services: .\start-full-backend.ps1" -ForegroundColor Cyan
Write-Host "   🛑 Stop services: .\stop-full-backend.ps1" -ForegroundColor Cyan
Write-Host "   📊 Check status: .\check-status.ps1" -ForegroundColor Cyan
Write-Host ""

# Overall health summary
$frontendOk = Test-Port 3003
$backendOk = Test-Port 5014
$dbBrowserOk = Test-Port 5555

if ($frontendOk -and $backendOk -and $dbBrowserOk) {
    Write-Host "🎉 Overall Status: All services running!" -ForegroundColor Green
} elseif ($backendOk) {
    Write-Host "⚠️  Overall Status: Backend running, some services may be starting..." -ForegroundColor Yellow
} else {
    Write-Host "❌ Overall Status: Services not running" -ForegroundColor Red
    Write-Host "   💡 Try running: .\start-full-backend.ps1" -ForegroundColor Yellow
}