# 🚀 Formula PM - Server Startup Guide

## **CRITICAL RULE: NEVER CHANGE WORKING PORTS**

⚠️ **IMPORTANT**: When you see "port already in use" - that means our app is ALREADY WORKING on that port!
- **DO NOT** kill processes or change ports
- **DO NOT** try different ports
- **ALWAYS** use the existing working configuration

---

## **Current Working Configuration ✅**

### **Backend Server**
- **Port**: `5014`
- **Health Check**: `http://localhost:5014/api/health`
- **Configuration File**: `formula-backend/.env` → `PORT=5014`

### **Frontend Server**
- **Port**: `3002` 
- **Proxy Target**: `http://localhost:5014`
- **Configuration Files**:
  - `formula-project-app/vite.config.js` → `target: 'http://localhost:5014'`
  - `formula-project-app/src/services/api/apiService.js` → `'http://localhost:5014/api'`
  - `formula-project-app/.env` → `REACT_APP_API_URL=http://localhost:5014/api`

---

## **Startup Commands**

### **Backend Startup**
```bash
cd formula-backend
npm start
```
**Expected Success Message:**
```
🚀 Formula Project Management API running on port 5014
🌐 Server accessible at http://localhost:5014
📧 Email service configured: Yes
🔗 WebSocket server ready for real-time connections
🗄️  Initializing database...
📋 Found 14 existing team members
📋 Found 7 existing projects
📋 Found 36 existing tasks
```

### **Frontend Startup**
```bash
cd formula-project-app
npm start
```

### **Full Application Startup Sequence**
1. **Terminal 1**: `cd formula-backend && npm start`
2. **Terminal 2**: `cd formula-project-app && npm start`
3. **Access**: http://localhost:3002

---

## **Connectivity Verification**

### **Quick Test Script**
```bash
cd /mnt/c/Users/Kerem/Desktop/formula-pm
node test-connectivity.js
```

**Expected Output:**
```
🔍 Testing Backend-Frontend Connectivity...

✅ Health Check: 1 items
✅ Team Members: 14 items
✅ Projects: 7 items
✅ Tasks: 36 items
✅ Clients: 6 items
✅ Material Specifications: 12 items

📊 Results: 6/6 tests passed
🎉 All connectivity tests passed! Backend-frontend connection is restored.
```

### **Manual Health Check**
```bash
curl http://localhost:5014/api/health
```
**Expected Response:**
```json
{"status":"OK","message":"Formula Project Management API is running"}
```

---

## **Demo Data Available**
- ✅ **14 Team Members** (Formula International staff)
- ✅ **7 Projects** (Akbank, Yapı Kredi, Garanti BBVA, etc.)
- ✅ **36 Tasks** (interconnected with projects)
- ✅ **6 Clients** (major Turkish companies)
- ✅ **12 Material Specifications** (linked to projects)

---

## **Troubleshooting**

### **If Backend Shows "Port Already in Use"**
✅ **CORRECT ACTION**: This means backend is already running - connect to it!
❌ **WRONG ACTION**: Don't kill processes or change ports

### **If Frontend Gets 500 Errors**
1. Check if backend is running: `curl http://localhost:5014/api/health`
2. If backend responds, frontend will connect automatically
3. Check browser console for successful API logs

### **Signs of Success**
- ✅ No "Backend unavailable, using demo data" warnings
- ✅ Real project data loads (7 projects vs 2 demo projects)
- ✅ Material specifications show 12 items vs demo fallback
- ✅ Browser console shows successful API calls (200 status)

---

## **Key Learning**
**"Port already in use" = Success, not failure!**
- It means our services are running
- Don't fight the system - work with it
- Test connectivity before assuming problems

---

*This guide ensures consistent server startup without breaking working configurations.*