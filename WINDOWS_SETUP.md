# 🚀 **Windows Native Development Setup**

## **STEP 1: Copy Project to Windows**

**In Windows PowerShell:**
```powershell
# Copy the entire project to Windows
Copy-Item "\\wsl$\Ubuntu\mnt\c\Users\Kerem\Desktop\formula-pm" "C:\formula-pm" -Recurse -Force

# Navigate to the project
cd C:\formula-pm
```

## **STEP 2: Install Node.js Dependencies**

**Backend setup:**
```powershell
cd C:\formula-pm\formula-backend
npm install
```

**Frontend setup:**
```powershell
cd C:\formula-pm\formula-project-app
npm install
```

## **STEP 3: Start Backend Server**

**Open PowerShell Terminal #1:**
```powershell
cd C:\formula-pm\formula-backend
npm start
```

**Wait for:** "Formula Project Management API running on port 5001"

## **STEP 4: Start Frontend Server**

**Open PowerShell Terminal #2:**
```powershell
cd C:\formula-pm\formula-project-app
npm start
```

**Wait for:** Vite server ready message with localhost URLs

## **STEP 5: Access Application**

**Open browser and go to:** `http://localhost:3000`

---

## **Why This Works Better:**

✅ **No WSL2 network issues**  
✅ **No port forwarding needed**  
✅ **Direct localhost access**  
✅ **Better performance**  
✅ **Easier debugging**  

## **If You Get Port Conflicts:**

- Backend: Edit `formula-backend/.env` and set `PORT=5005`
- Frontend: Vite will auto-increment ports (3000 → 3001 → 3002)

## **Email Configuration:**

Update `C:\formula-pm\formula-backend\.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5001
```

---

This approach eliminates all WSL2 networking complexity and should work immediately!