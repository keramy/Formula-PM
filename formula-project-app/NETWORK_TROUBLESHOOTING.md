# 🔧 Network Connectivity Troubleshooting Guide

## 🚨 **Issue**: "This site can't be reached" - Connection Refused

### **Root Cause**: WSL2 Network Isolation
WSL2 creates a virtualized network that doesn't always bind properly to Windows network interfaces.

## ⚡ **IMMEDIATE SOLUTIONS**

### **Solution 1: Windows Port Forwarding** (Most Reliable)

**Step 1**: Open **Windows PowerShell as Administrator**

**Step 2**: Run these commands:
```powershell
# Get WSL2 IP address
$wslIP = (wsl hostname -I).Trim().Split()[0]
Write-Host "WSL2 IP: $wslIP"

# Remove existing forwarding (if any)
netsh interface portproxy delete v4tov4 listenport=3000
netsh interface portproxy delete v4tov4 listenport=3001

# Add port forwarding for both ports
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$wslIP
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=$wslIP

# Show current forwarding rules
netsh interface portproxy show all
```

**Step 3**: Access via **`http://localhost:3000`** or **`http://localhost:3001`**

---

### **Solution 2: Docker Development** (Alternative)

**Step 1**: Use Docker for consistent networking
```bash
cd formula-project-app
npm run docker:dev
```

**Step 2**: Access via **`http://localhost:3000`**

---

### **Solution 3: Native Windows Development** (Most Reliable)

**Step 1**: Copy project to Windows filesystem
```powershell
# In Windows PowerShell
Copy-Item "\\wsl$\Ubuntu\mnt\c\Users\Kerem\Desktop\formula-pm" "C:\formula-pm" -Recurse
```

**Step 2**: Install and run from Windows
```powershell
cd C:\formula-pm\formula-backend
npm install
npm start

# New terminal
cd C:\formula-pm\formula-project-app  
npm install
npm start
```

**Step 3**: Access via **`http://localhost:3000`**

---

## 🔍 **Diagnostic Commands**

### **Check WSL2 Network Status**
```bash
# In WSL2
hostname -I                    # Get WSL2 IPs
ip route show                  # Show routing table
ss -tlnp | grep :3001         # Check if port is listening
```

### **Check Windows Network**
```powershell
# In Windows PowerShell as Admin
netsh interface portproxy show all         # Show port forwarding
Test-NetConnection localhost -Port 3000    # Test port connectivity
Get-Process | Where-Object {$_.ProcessName -eq "node"}  # Find Node processes
```

### **Check Windows Firewall**
```powershell
# In Windows PowerShell as Admin
New-NetFirewallRule -DisplayName "WSL2-3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "WSL2-3001" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

---

## 🎯 **Quick Fix Commands**

### **Automated Port Forwarding Script**
Save as `fix-wsl2-ports.ps1` and run as Administrator:
```powershell
# fix-wsl2-ports.ps1
$wslIP = (wsl hostname -I).Trim().Split()[0]
Write-Host "Setting up port forwarding for WSL2 IP: $wslIP"

# Clean existing rules
netsh interface portproxy delete v4tov4 listenport=3000 2>$null
netsh interface portproxy delete v4tov4 listenport=3001 2>$null
netsh interface portproxy delete v4tov4 listenport=5001 2>$null

# Add new rules
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$wslIP
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=$wslIP  
netsh interface portproxy add v4tov4 listenport=5001 listenaddress=0.0.0.0 connectport=5001 connectaddress=$wslIP

Write-Host "Port forwarding configured. Try: http://localhost:3000"
netsh interface portproxy show all
```

### **WSL2 Network Reset**
```bash
# In WSL2 terminal
sudo service networking restart
sudo iptables -F
sudo iptables -X
sudo iptables -t nat -F
sudo iptables -t nat -X
sudo iptables -t mangle -F
sudo iptables -t mangle -X
```

---

## 📱 **Mobile/Remote Access**

If you need to access from other devices:
```bash
# Get your Windows machine IP
ipconfig | findstr IPv4

# Access via: http://YOUR_WINDOWS_IP:3000
```

---

## ✅ **Verification Steps**

1. **Port Forwarding**: Run `netsh interface portproxy show all` (as Admin)
2. **Process Check**: `Get-Process node` in PowerShell
3. **Firewall**: Check Windows Defender Firewall settings
4. **Test Connection**: `Test-NetConnection localhost -Port 3000`

## 🆘 **If All Else Fails**

**Option A**: Use GitHub Codespaces or VS Code Dev Containers
**Option B**: Install Node.js directly on Windows and run natively
**Option C**: Use the live GitHub Pages version: https://keramy.github.io/formula-pm

The WSL2 networking issue is a known limitation. Port forwarding is the most reliable solution for local development.