# 🚀 **START DEVELOPMENT SERVERS**

## **STEP 1: Start Backend**
Open **WSL2 Terminal #1** and run:
```bash
cd /mnt/c/Users/Kerem/Desktop/formula-pm/formula-backend
PORT=5002 npm start
```
**Wait for**: "Formula Project Management API running on port 5002"

## **STEP 2: Start Frontend** 
Open **WSL2 Terminal #2** and run:
```bash
cd /mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app
npm start
```
**Wait for**: "ready in XXXms" and note the port (usually 3000 or 3002)

## **STEP 3: Setup Port Forwarding**
Open **Windows PowerShell as Administrator** and run:
```powershell
# Get WSL2 IP (you already know it's 192.168.1.56)
$wslIP = "192.168.1.56"

# Add port forwarding for your frontend port (replace XXXX with actual port)
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$wslIP
netsh interface portproxy add v4tov4 listenport=3002 listenaddress=0.0.0.0 connectport=3002 connectaddress=$wslIP
netsh interface portproxy add v4tov4 listenport=5002 listenaddress=0.0.0.0 connectport=5002 connectaddress=$wslIP

# Show rules
netsh interface portproxy show all
```

## **STEP 4: Access Application**
Try these URLs in order:
1. **http://localhost:3000** (if frontend started on 3000)
2. **http://localhost:3002** (if frontend started on 3002) 
3. **http://192.168.1.56:3000** (direct WSL2 access)
4. **http://192.168.1.56:3002** (direct WSL2 access)

## **SUCCESS INDICATORS:**
✅ Backend shows: "Formula Project Management API running on port 5002"  
✅ Frontend shows: "ready in XXXms" with URL list  
✅ PowerShell shows port forwarding rules  
✅ Browser loads the Formula PM application  

## **IF PORTS ARE IN USE:**
Backend: Try `PORT=5003 npm start`  
Frontend: Vite will auto-increment (3000 → 3001 → 3002, etc.)  
Update port forwarding accordingly.

---

**Note**: You need 2 WSL2 terminals + 1 Windows PowerShell (as Admin) = 3 total terminals