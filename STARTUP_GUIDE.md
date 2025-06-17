# 🚀 Formula PM - Startup Guide

## **SOLUTION SUMMARY - What We Fixed:**

### **The Problem:**
- Hot reload issues and blank page on localhost
- "process is not defined" error in browser
- Port mismatches between Vite server and HMR
- WebSocket connection errors

### **The Root Cause:**
1. **Environment Variables**: Using Node.js `process.env` in browser (Vite needs `import.meta.env`)
2. **Port Configuration**: Vite server (3000) vs actual frontend port (3002) vs HMR port mismatch
3. **Backend API**: Running on port 5006 instead of default 5001

### **The Fix:**
1. ✅ **Fixed apiService.js**: `process.env.REACT_APP_API_URL` → `import.meta.env.VITE_API_URL`
2. ✅ **Synchronized Ports**: Set both Vite server and HMR to port 3002
3. ✅ **Updated .env**: Configured VITE_DEV_PORT=3002
4. ✅ **Backend Binding**: Server listening on 0.0.0.0:5006 for Windows access

---

## **Manual Startup Script**

### **Windows PowerShell Startup:**

**Option 1: Single Command Script**
```powershell
# Save this as start-formula-pm.ps1
cd "C:\Users\Kerem\Desktop\formula-pm\formula-backend"
Start-Process powershell -ArgumentList "-Command", "cd 'C:\Users\Kerem\Desktop\formula-pm\formula-backend'; npm start; pause"
Start-Sleep -Seconds 3
cd "..\formula-project-app"
npm start
```

**Option 2: Manual Steps (Recommended)**
```powershell
# Terminal 1 - Backend
cd C:\Users\Kerem\Desktop\formula-pm\formula-backend
npm start
# Wait for: "Formula Project Management API running on port 5006"

# Terminal 2 - Frontend  
cd C:\Users\Kerem\Desktop\formula-pm\formula-project-app
npm start
# Wait for: "Local: http://localhost:3002/"
```

### **Expected Output:**
- **Backend**: `🚀 Formula Project Management API running on port 5006`
- **Frontend**: `➜ Local: http://localhost:3002/`
- **Access**: Open browser to `http://localhost:3002`

---

## **Port Configuration Summary:**
- **Backend API**: Port 5006 (configured in backend/.env)
- **Frontend Dev Server**: Port 3002 (configured in vite.config.js)
- **HMR WebSocket**: Port 3002 (synchronized with dev server)
- **API Proxy**: `/api` requests → `http://localhost:5006`

---

## **Key Learnings:**

### **Vite vs Create React App Environment Variables:**
- ❌ **Wrong**: `process.env.REACT_APP_API_URL` (Node.js only)
- ✅ **Correct**: `import.meta.env.VITE_API_URL` (Vite browser)

### **Port Synchronization:**
- Vite server port MUST match HMR port for proper hot reload
- Backend must bind to `0.0.0.0` for Windows localhost access from WSL2

### **Network Access Pattern:**
- Windows → localhost:3002 (frontend)
- Frontend → localhost:5006/api (backend via proxy)
- Backend binds to 0.0.0.0:5006 (accessible from Windows)

---

## **Troubleshooting:**

### **If "Upgrade Required" appears:**
- Check vite.config.js server.port matches the URL port
- Restart frontend server after port changes

### **If "process is not defined":**
- Check all uses of `process.env` in frontend code
- Replace with `import.meta.env` for Vite

### **If backend connection fails:**
- Verify backend is running on correct port
- Check .env files have matching port numbers
- Ensure backend binds to 0.0.0.0, not just localhost

---

## **Verification Steps:**

After startup, verify everything is working:
1. **Dashboard Tab**: Shows stats cards and project overview
2. **Projects Tab**: Displays project list with filters
3. **Tasks Tab**: Shows task management interface
4. **Team Tab**: Lists all team members
5. **Clients Tab**: Shows client information

## **Success Indicators:**
- ✅ API loading real data (not "using demo data" warnings)
- ✅ All tabs clickable and showing content
- ✅ Notifications icon working
- ✅ User menu dropdown functional
- ✅ Hot reload working (changes appear without refresh)