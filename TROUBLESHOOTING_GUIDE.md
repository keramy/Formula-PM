# 🔍 Formula PM - Troubleshooting Guide

## **Common Issues and Solutions**

### 🚫 **Blank Page Issues**

#### **Symptom**: App loads but shows blank page
**Check #1**: Browser Console for JavaScript errors
```javascript
// Common error: "process is not defined"
// Fix: Update environment variable usage
import.meta.env.VITE_API_URL  // ✅ Correct
process.env.REACT_APP_API_URL  // ❌ Wrong for Vite
```

**Check #2**: Network tab for API calls
- Status should be 200/304, not "canceled"
- If canceled, check useAuthenticatedData hook

**Check #3**: React DevTools
- Verify components are rendering
- Check if data props are being passed

---

### 🔌 **API Connection Issues**

#### **Symptom**: "Backend unavailable, using demo data"
**Solution #1**: Verify backend is running
```bash
curl http://localhost:5006/api/health
# Should return: {"status":"OK","message":"Formula Project Management API is running"}
```

**Solution #2**: Check proxy configuration in vite.config.js
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5006',
    changeOrigin: true,
    secure: false,
  }
}
```

**Solution #3**: Verify .env file
```env
VITE_API_URL=/api  # Must use proxy path, not full URL
```

---

### 🔄 **Hot Reload Not Working**

#### **Symptom**: Changes don't appear without manual refresh
**Solution #1**: Check Vite HMR configuration
```javascript
// vite.config.js
server: {
  port: 3002,
  hmr: {
    port: 3002  // Must match server port
  },
  watch: {
    usePolling: true  // Required for WSL2
  }
}
```

**Solution #2**: Clear Vite cache
```bash
rm -rf node_modules/.vite
npm start
```

---

### 🚪 **Port Conflicts**

#### **Symptom**: "Port already in use" errors
**Solution**: Find and kill processes
```powershell
# Windows PowerShell
netstat -ano | findstr :5006
taskkill /PID <PID> /F

netstat -ano | findstr :3002
taskkill /PID <PID> /F
```

---

### 📦 **Import/Export Errors**

#### **Symptom**: "Module not found" or "Export not provided"
**Common Issues**:
1. Wrong file extension in import
2. Missing named export
3. Incorrect MUI import

```javascript
// ❌ Wrong
import Calendar from '@mui/material';  // Calendar doesn't exist

// ✅ Correct
import { CalendarToday } from '@mui/icons-material';
```

---

### 🎯 **Component Not Rendering**

#### **Symptom**: Component exists but doesn't show
**Debug Steps**:
1. Add console.log in component
2. Check parent component's render logic
3. Verify CSS isn't hiding content
4. Check ErrorBoundary logs

```javascript
// Add debug logging
console.log('🎯 Component rendering:', { props, state });
```

---

### 🔐 **Authentication Issues**

#### **Symptom**: Stuck at login or access denied
**Solution**: Check localStorage
```javascript
// Browser console
localStorage.getItem('currentUser')
localStorage.getItem('formulapm_token')

// Clear if needed
localStorage.clear()
```

---

## **Quick Fixes Command Reference**

```bash
# Restart everything
cd formula-backend && npm start
cd formula-project-app && npm start

# Clear all caches
rm -rf node_modules/.vite
rm -rf .parcel-cache
npm cache clean --force

# Check what's running
lsof -i :3002
lsof -i :5006

# Force rebuild
cd formula-project-app
rm -rf node_modules
npm install
npm start
```

---

## **Debug Checklist**

Before reporting issues, check:
- [ ] Browser console for errors
- [ ] Network tab for failed requests  
- [ ] Both servers are running (backend + frontend)
- [ ] Correct URLs (localhost:3002 for app, :5006/api for backend)
- [ ] No browser extensions blocking requests
- [ ] Not using outdated cached version (hard refresh: Ctrl+Shift+R)

---

## **Getting Help**

Include this info when asking for help:
1. Browser console errors (full text)
2. Network tab screenshot
3. Which tab/action causes the issue
4. Output of: `npm list react react-dom vite`
5. Any recent changes made

---

**Remember**: Most issues are caused by:
- Port conflicts
- Cache problems  
- Import errors
- Environment variable mismatches