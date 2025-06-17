# WSL2 Port Forwarding Script - Run as Administrator
# This script fixes WSL2 localhost connectivity issues

Write-Host "WSL2 Port Forwarding Setup" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Get WSL2 IP address
Write-Host "Getting WSL2 IP address..." -ForegroundColor Yellow
$wslIP = (wsl hostname -I).Trim().Split()[0]
Write-Host "WSL2 IP: $wslIP" -ForegroundColor Cyan

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "SUCCESS: Running as Administrator" -ForegroundColor Green

# Clean existing port forwarding rules
Write-Host "Cleaning existing port forwarding rules..." -ForegroundColor Yellow
netsh interface portproxy delete v4tov4 listenport=3000 2>$null
netsh interface portproxy delete v4tov4 listenport=3001 2>$null
netsh interface portproxy delete v4tov4 listenport=5001 2>$null

# Add new port forwarding rules
Write-Host "Adding new port forwarding rules..." -ForegroundColor Yellow

# Port 3000 - Frontend primary
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$wslIP
Write-Host "SUCCESS: Port 3000 forwarded (Frontend primary)" -ForegroundColor Green

# Port 3001 - Frontend alternative  
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=$wslIP
Write-Host "SUCCESS: Port 3001 forwarded (Frontend alternative)" -ForegroundColor Green

# Port 5001 - Backend API
netsh interface portproxy add v4tov4 listenport=5001 listenaddress=0.0.0.0 connectport=5001 connectaddress=$wslIP
Write-Host "SUCCESS: Port 5001 forwarded (Backend API)" -ForegroundColor Green

# Configure Windows Firewall rules
Write-Host "Configuring Windows Firewall..." -ForegroundColor Yellow

# Remove existing rules if they exist
Remove-NetFirewallRule -DisplayName "WSL2-Formula-PM-3000" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "WSL2-Formula-PM-3001" -ErrorAction SilentlyContinue  
Remove-NetFirewallRule -DisplayName "WSL2-Formula-PM-5001" -ErrorAction SilentlyContinue

# Add new firewall rules
New-NetFirewallRule -DisplayName "WSL2-Formula-PM-3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow | Out-Null
New-NetFirewallRule -DisplayName "WSL2-Formula-PM-3001" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow | Out-Null
New-NetFirewallRule -DisplayName "WSL2-Formula-PM-5001" -Direction Inbound -LocalPort 5001 -Protocol TCP -Action Allow | Out-Null

Write-Host "SUCCESS: Windows Firewall configured" -ForegroundColor Green

Write-Host ""
Write-Host "Port forwarding setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Available URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:3001" -ForegroundColor White  
Write-Host "  Backend:  http://localhost:5001" -ForegroundColor White
Write-Host ""
Write-Host "Current port forwarding rules:" -ForegroundColor Cyan
netsh interface portproxy show all

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start your WSL2 development servers" -ForegroundColor White
Write-Host "2. Access http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "3. If issues persist, restart WSL2: wsl --shutdown" -ForegroundColor White

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")