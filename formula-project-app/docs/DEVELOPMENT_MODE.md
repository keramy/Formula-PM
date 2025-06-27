# Development Mode Guide

## Demo Mode Configuration

The app now supports a **Demo Mode** that allows you to work with sample data when the backend is unavailable or having issues.

### Automatic Demo Mode

Demo mode is **automatically enabled** in development when:
- Backend server returns 500 errors
- Network connection fails
- API endpoints are unreachable

### Manual Demo Mode

You can force demo mode in several ways:

#### 1. Environment Variable (Recommended)
Create or edit `.env.development`:
```bash
VITE_FORCE_DEMO_MODE=true
```

#### 2. Browser Developer Tools
Open browser console and run:
```javascript
localStorage.setItem('vite_force_demo_mode', 'true');
location.reload();
```

#### 3. Error Boundary Button
When data loading fails, you'll see an "Enable Demo Mode" button in the error message.

### Demo Data Includes

- **5 Projects**: Construction and millwork projects with realistic data
- **10 Tasks**: Linked to projects with various statuses
- **5 Team Members**: Complete with roles and contact information  
- **5 Clients**: Different project types (commercial, residential, etc.)
- **3 Shop Drawings**: Linked to projects
- **3 Material Specifications**: With costs and supplier information

### Disabling Demo Mode

To return to normal API mode:

```javascript
localStorage.removeItem('vite_force_demo_mode');
location.reload();
```

Or edit `.env.development`:
```bash
VITE_FORCE_DEMO_MODE=false
```

### Development Workflow

1. **Start Development**: Demo mode is enabled by default
2. **Backend Available**: Disable demo mode to use real data
3. **Backend Issues**: Demo mode automatically kicks in
4. **Error Recovery**: Use error boundary buttons for quick fixes

### Troubleshooting

- **App not loading**: Check console for errors, enable demo mode
- **No data showing**: Verify demo mode is enabled in console
- **500 errors**: Backend issues - demo mode will activate automatically
- **Network issues**: Demo mode provides offline-like experience

### Console Messages

Look for these messages to understand the current mode:
- `🎭 Demo mode enabled - using demo [data_type]`
- `Backend unavailable (network or server error), using demo data`

This ensures the app remains functional during development regardless of backend status.