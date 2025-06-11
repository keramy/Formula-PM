# Formula Project Management - Setup Guide

## Quick Start

### 1. Start Backend Server
```bash
cd /mnt/c/Users/Kerem/Desktop/formula-pm/formula-backend
npm start
```
**Result:** Server runs on http://localhost:5001 with database auto-seeding

### 2. Start Frontend Application
```bash
cd /mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app
REACT_APP_API_URL=http://localhost:5001/api npm start
```
**Result:** App runs on http://localhost:3000 with REACT_APP_API_URL=http://localhost:5001/api

## Database Status Check

### Check Team Members Loaded
```bash
curl http://localhost:5001/api/team-members | grep -o '"firstName"' | wc -l
# Should return: 14
```

### Check Sample Projects
```bash
curl http://localhost:5001/api/projects
# Should return Akbank and Garanti BBVA projects
```

## Pre-loaded Data

### 14 Formula International Team Members
- **Management:** Kubilay Ilgın, Ömer Onan (Managing Partners)
- **Leadership:** Taylan Kaygusuz (General Manager)
- **Deputies:** Cevahir Sevimli, Yusuf Sağlam
- **Directors:** İpek Gönenç (Fit-out), Berk Ulukan (MEP)
- **Project Managers:** Kerem Salih Colak, Hakan Ayseli, Hande Selen Karaman
- **Technical Staff:** Murat Gökdemir, Serra Uluveren, Ebru Alkın, Uğur Karabayır

### Sample Projects
1. **Akbank Head Office Renovation** (Fit-out, ₺2.5M budget)
2. **Garanti BBVA Tech Center MEP** (MEP, ₺1.8M budget)

### Sample Tasks
- Design Review and Approval (Completed)
- Material Procurement (In Progress)
- HVAC System Design (Completed)
- Electrical Infrastructure Installation (In Progress)

## Features Available

### ✅ Functional Features
- Create/edit/delete projects and tasks
- Assign tasks to team members
- Track project progress with Gantt charts
- View analytics and statistics
- Manage team member information
- File upload components
- Email notification system (backend ready)

### ✅ Technical Features
- Persistent database storage
- RESTful API endpoints
- Real-time notifications
- Error handling with fallback
- Loading states
- Responsive Material-UI design

## File Locations

### Database Files
```
/mnt/c/Users/Kerem/Desktop/formula-pm/formula-backend/data/
├── teamMembers.json    # 14 Formula employees
├── projects.json       # Sample projects
└── tasks.json          # Sample tasks
```

### Key Components
```
Frontend: /mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app/src/
Backend:  /mnt/c/Users/Kerem/Desktop/formula-pm/formula-backend/
Docs:     /mnt/c/Users/Kerem/Desktop/formula-pm/*.md
```

### Styling Files (NEW!)
```
/mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app/src/
├── theme/
│   ├── colors.js       # 🎨 Change colors here!
│   ├── components.js   # Material-UI overrides
│   ├── typography.js   # Font styles
│   └── index.js        # Main theme
├── styles/
│   ├── globals.css     # Global styles & CSS variables
│   └── README.md       # Complete styling guide
└── App.css            # Legacy styles (still works)
```

## Troubleshooting

### Backend Not Starting
```bash
cd /mnt/c/Users/Kerem/Desktop/formula-pm/formula-backend
npm install  # If dependencies missing
npm start
```

### Frontend Build Issues
```bash
cd /mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app
npm install  # If dependencies missing
HOST=0.0.0.0 npm start
```

### Database Reset
```bash
# Remove database files to reset to initial state
rm /mnt/c/Users/Kerem/Desktop/formula-pm/formula-backend/data/*.json
# Restart backend server to re-seed
```

### Port Conflicts
```bash
# Check what's running on ports
lsof -i :5001  # Backend
lsof -i :3000  # Frontend

# Kill processes if needed
kill -9 <PID>
```

## Next Development Steps

1. **Authentication System** - Login with existing team member accounts
2. **Email Integration** - Configure SMTP for real notifications
3. **File Upload** - Implement actual file storage
4. **Real-time Updates** - WebSocket integration
5. **Advanced Analytics** - Enhanced reporting features

## Quick UI Customization

### Change App Colors
```javascript
// Edit src/theme/colors.js
export const colors = {
  primary: { main: '#ff6b35' },    // Orange theme
  secondary: { main: '#2ecc71' }   // Green accent
}
```

### Customize Buttons
```javascript
// Edit src/theme/components.js
MuiButton: {
  styleOverrides: {
    root: { borderRadius: '20px' }  // Rounded buttons
  }
}
```

### Quick CSS Override
```css
/* Edit src/styles/globals.css */
:root {
  --formula-primary: #your-color;
}
```

📖 **Complete Guide**: See `src/styles/README.md` for detailed styling instructions

## Development Commands

### Backend
```bash
# Start server
node server.js

# Development with auto-restart
npm run dev  # (if nodemon is configured)
```

### Frontend
```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test
```

## API Endpoints Summary

### Team Members
- `GET /api/team-members` - List all (returns 14 Formula employees)
- `POST /api/team-members` - Create new member
- `PUT /api/team-members/:id` - Update member
- `DELETE /api/team-members/:id` - Delete member

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Health Check
- `GET /api/health` - Server status check

## Environment Requirements

- **Node.js:** 18.x or higher
- **NPM:** 8.x or higher
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+
- **Memory:** ~100MB for both frontend and backend
- **Storage:** ~50MB for application files

## Success Indicators

✅ Backend server starts and shows "🗄️ Initializing database..."
✅ "✅ Seeded 14 team members" message appears
✅ Frontend loads without errors
✅ Team members section shows Formula International employees
✅ Projects and tasks can be created and saved
✅ Data persists after browser refresh

## Contact & Support

For technical questions about this setup, refer to:
- `TECHNICAL_SPECIFICATIONS.md` - Detailed technical information
- `DEVELOPMENT_ROADMAP.md` - Future development plans
- `BUG_FIXES_LOG.md` - Known issues and fixes
- `PROJECT_SUMMARY.md` - Overall project status