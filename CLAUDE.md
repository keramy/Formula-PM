# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (formula-backend)
```bash
cd formula-backend
npm install          # Install dependencies
npm start           # Start production server (port 5001)
npm run dev         # Start development server with nodemon
```

### Frontend (formula-project-app)
```bash
cd formula-project-app
npm install         # Install dependencies
npm start          # Start development server (port 3000)
npm run build      # Create production build
npm test           # Run React tests
```

### Full Application Startup
1. **Terminal 1**: `cd formula-backend && npm start`
2. **Terminal 2**: `cd formula-project-app && npm start`
3. **Access**: http://localhost:3000

## Architecture Overview

### Full-Stack Structure
- **Backend**: Node.js/Express API server with file-based JSON database
- **Frontend**: React 19 with Material-UI components and Context API state management
- **Data Storage**: Custom SimpleDB class managing JSON files in `formula-backend/data/`
- **Communication**: RESTful API with Axios client and localStorage fallback

### Key Technical Components

**Backend (Port 5001)**
- Custom `SimpleDB` class in `database.js` provides ORM-like functionality for JSON files
- Data files: `teamMembers.json`, `projects.json`, `tasks.json`
- Email service configured with Nodemailer (Gmail SMTP)
- Auto-seeding with 14 Formula International team members on startup

**Frontend Architecture**
- Material-UI theming with Formula International branding
- `AdvancedDashboard.js` - Analytics with Recharts visualizations
- `GanttChart.js` - Project timeline visualization
- `NotificationContext` - Global toast notifications via Context API
- `apiService.js` - Centralized HTTP client with error handling

### Data Relationships
- Tasks link to Projects via `projectId`
- Tasks assign to Team Members via `assignedTo` 
- Cascading deletes (project deletion removes related tasks)

### API Endpoints
```
/api/team-members    # CRUD operations
/api/projects        # CRUD operations  
/api/tasks          # CRUD operations
/api/send-notification  # Email notifications
/api/health         # Server status
```

### Environment Configuration
- Backend: `PORT` (default 5001), email credentials for notifications
- Frontend: `REACT_APP_API_URL` (default http://localhost:5001/api)

## Development Notes

### Database System
The application uses a custom file-based database unsuitable for production. The `SimpleDB` class in `database.js` provides:
- Automatic ID generation with timestamp-based unique IDs
- CRUD operations with error handling
- Data persistence to JSON files
- In-memory caching for performance

### State Management Pattern
- Local component state with React hooks
- Global notifications via Context API
- API calls update both backend and local state
- Fallback to localStorage when backend unavailable

### Testing Setup
- React Testing Library configured
- Jest transforms configured for date-fns and MUI date pickers
- No backend tests currently implemented

### Pre-loaded Data
System seeds with 14 Formula International team members including management hierarchy from Managing Partners to technical staff, plus sample Akbank and Garanti BBVA projects.

## UI Styling System

### Modular Theme Structure
The application uses a **modular styling system** that solves Material-UI override issues:

```
src/
├── theme/
│   ├── index.js        # Main theme configuration
│   ├── colors.js       # All colors centralized 🎨
│   ├── typography.js   # Font styles and sizes
│   └── components.js   # Material-UI component overrides
├── styles/
│   ├── globals.css     # Global styles with CSS variables
│   └── README.md       # Complete styling guide
└── App.css            # Legacy styles (still functional)
```

### Easy UI Customization

**Change Colors** (Most common task):
```javascript
// Edit src/theme/colors.js
export const colors = {
  primary: { main: '#37444B' },     // ← Main brand color
  secondary: { main: '#C0B19E' }    // ← Accent color
}
```

**Override Components**:
```javascript
// Edit src/theme/components.js
MuiButton: {
  styleOverrides: {
    root: { borderRadius: '20px' }  // ← Rounded buttons
  }
}
```

**Quick CSS Fixes**:
```css
/* Edit src/styles/globals.css */
.MuiPaper-root {
  background: blue !important;     /* ← Override anything */
}
```

### Theme Benefits
- ✅ **No more CSS specificity issues** with Material-UI
- ✅ **Centralized color management** in one file
- ✅ **Consistent styling** across all components
- ✅ **Easy maintenance** with modular structure
- ✅ **Hot reload** for immediate changes