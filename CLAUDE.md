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
- Data files: `teamMembers.json`, `projects.json`, `tasks.json`, `clients.json`
- Email service configured with Nodemailer (Gmail SMTP)
- Auto-seeding with 14 Formula International team members on startup
- Complete CRUD API for client database management
- Enhanced project API with filtering support

**Frontend Architecture**
- Material-UI theming with Formula International branding
- `AdvancedDashboard.js` - Analytics with Recharts visualizations
- `GanttChart.js` - Project timeline visualization
- `ProjectsTableView.js` - Professional sortable table with context menus
- `ProjectsFilters.js` - Advanced filtering system with date ranges and quick filters
- `ProjectsHeader.js` - Search, export, and view controls
- `ClientForm.js` & `ClientsList.js` - Client database management
- `excelExport.js` - Professional Excel export with multiple sheets
- `NotificationContext` - Global toast notifications via Context API
- `apiService.js` - Centralized HTTP client with error handling

**Enhanced Project Management Features (NEW)**
- `ProjectsHeader.js` - Professional header with search, filters, export, view toggle
- `ProjectsTableView.js` - Advanced sortable table with context menus and progress bars
- `ProjectsFilters.js` - Comprehensive filtering system with date ranges and quick presets
- `ProjectsList.js` - Legacy card view with client integration
- `ClientForm.js` / `ClientsList.js` - Full client database management
- `excelExport.js` - Professional Excel export with multiple sheets and formatting

### Data Relationships
- Tasks link to Projects via `projectId`
- Tasks assign to Team Members via `assignedTo` 
- Projects link to Clients via `clientId`
- Projects assign to Project Managers via `projectManager`
- Cascading deletes (project deletion removes related tasks)

### API Endpoints
```
/api/team-members    # CRUD operations
/api/projects        # CRUD operations  
/api/tasks          # CRUD operations
/api/clients        # CRUD operations
/api/projects/:projectId/scope  # Scope items CRUD (NEW)
/api/scope/:id      # Individual scope item operations (NEW)
/api/send-notification  # Email notifications
/api/health         # Server status
```

### Environment Configuration
- Backend: `PORT` (default 5001), email credentials for notifications
- Frontend: `REACT_APP_API_URL` (default http://localhost:5001/api)

## Development Notes

### Enhanced Project Management Features ⭐ **COMPLETED**
All major enhancement phases have been successfully implemented:

**Universal UI Components Enhancement** 🆕
- UnifiedHeader component for consistent navigation across all tabs
- UnifiedFilters component with advanced filtering capabilities
- UnifiedTableView component with comprehensive error protection
- Professional table/card view switching for Tasks, Team, and Clients tabs
- Real-time search functionality across all data types
- Excel export functionality for all major data tables

**Enhanced Task Management** 🆕
- Professional task table with avatar-based assignee display
- Advanced filtering by status, priority, project, assignee, due dates
- Quick filters (Overdue, Due Today, This Week, Urgent, Completed)
- Color-coded priority levels with visual indicators
- Progress tracking with visual progress bars
- Overdue detection with day counters

**Enhanced Team Management** 🆕
- Professional team table with role hierarchy visualization
- Task completion statistics for each team member
- Department-based organization and filtering
- Contact management with click-to-action email/phone
- Role-based color coding and status management
- Excel export with comprehensive team statistics

**Enhanced Client Management** 🆕
- Comprehensive client database with company profiles
- Industry and company size categorization
- Multi-select services tracking and management
- Professional client cards with uniform design
- Full address management system
- Status management (Active, Inactive, Potential)

**Critical Bug Fixes & Error Protection** 🆕
- React object rendering error completely resolved
- Multi-layer protection in UnifiedTableView component
- Status format compatibility (in-progress vs in_progress)
- Comprehensive null safety protection
- Graceful error handling with user-friendly messages

Phases 1-4 of the original project enhancement plan:

**Phase 1: Enhanced Projects List View**
- Professional table view with sortable columns
- Card view toggle for different display preferences
- Context menus with View, Edit, Manage Scope, Delete actions
- Progress bars and status indicators
- Client and manager name resolution

**Phase 2: Advanced Filtering & Search System**
- Real-time search across project names and descriptions
- Multi-criteria filtering: status, type, client, manager, date ranges, budget ranges
- Quick filter presets for common searches (Active Projects, On Tender, This Month, etc.)
- Active filter display with individual clear options
- Collapsible filter panel with filter count indicators

**Phase 3: Excel Export Functionality**
- Professional Excel export with formatted columns
- Multiple sheets: Projects data + Summary analytics
- Status and type breakdowns in summary sheet
- Client and manager name resolution in export
- Timestamp-based filename generation

**Phase 4: Project Scope Management** 🆕
- Complete scope items management with CRUD operations
- 12 predefined categories: General Construction, MEP Systems, Electrical, HVAC, Plumbing, Finishes, Millwork, Furniture, Technology, Landscaping, Permits & Fees, Other
- 10 standard units: sqm, lm, pcs, ls, kg, ton, hour, day, month, lot
- Automatic budget calculations: Total Price = Quantity × Unit Price
- Real-time summary analytics with category breakdowns
- Professional full-screen scope management interface
- Summary cards showing total items, quantity, and value
- Context menus for scope item management
- Integrated with Projects table "Manage Scope" action

### Database System
The application uses a custom file-based database unsuitable for production. The `SimpleDB` class in `database.js` provides:
- Automatic ID generation with timestamp-based unique IDs
- CRUD operations with error handling
- Data persistence to JSON files
- In-memory caching for performance
- Client database integration with full CRUD support

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
System seeds with 14 Formula International team members including management hierarchy from Managing Partners to technical staff, plus sample Akbank and Garanti BBVA projects. Client database starts empty and is populated through the UI.

### Project Status & Types
**Project Statuses:**
- On Tender (blue) - Projects in bidding phase
- Awarded (green) - Won projects ready to start
- On Hold (orange) - Temporarily paused projects
- Not Awarded (red) - Lost bids
- Active (purple) - Currently in progress
- Completed (dark) - Finished projects

**Project Types:**
- General Contractor - Main construction projects
- Fit-out - Interior finishing projects
- MEP - Mechanical, Electrical, Plumbing
- Electrical - Electrical systems only
- Millwork - Custom woodwork and furniture
- Management - Project management services

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
```

- to memorize