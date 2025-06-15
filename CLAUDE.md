# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 **Current Status: UI Enhancement & GitHub Pages Deployment COMPLETED ✅**

**Last Updated**: June 15, 2025  
**UI Enhancement Phase** - **SUCCESSFULLY IMPLEMENTED**

### ✅ **Major Achievements:**
- **10 UI Feedback Items**: All user-requested improvements implemented
- **Enhanced Task Views**: List/Board/Calendar tabs with professional layouts
- **Team Management**: Clean card views with details-only contact info
- **Search Enhancement**: Debounced search with 300ms delay
- **Excel Integration**: Template download for scope management
- **GitHub Pages Ready**: Static deployment configured and tested
- **React 19 Compatibility**: All dependency conflicts resolved
- **Performance**: Optimized bundle size and loading times

### 🚀 **Completed UI Enhancements:**
1. ✅ **Clean Team Cards** - Email/phone only in details modal
2. ✅ **Enhanced Task Views** - List, Board, Calendar tabs with card layouts
3. ✅ **Debounced Search** - 300ms delay, professional search experience
4. ✅ **Excel Template Download** - For scope management workflows
5. ✅ **Context-aware Buttons** - "Save Changes" vs "Add Task" logic
6. ✅ **Collapsible Sidebar** - With toggle functionality
7. ✅ **Static Board View** - Removed drag-and-drop for React 19 compatibility
8. ✅ **GitHub Pages Deployment** - Automated CI/CD with error handling
9. ✅ **Build Optimization** - ESLint warnings handled, sourcemaps disabled
10. ✅ **Mobile Responsive** - All new components work on mobile devices

### 🌐 **GitHub Pages Deployment:**
- **Live URL**: https://keramy.github.io/formula-pm
- **Auto-deployment**: Triggered on every main branch push
- **Build Status**: ✅ Successfully building with React 19
- **Static Features**: All UI improvements work perfectly on GitHub Pages

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

**Frontend Architecture - Feature-Based Organization** 🆕
- **React 19** with Material-UI theming and Formula International branding
- **Feature-based folder structure** for improved maintainability and performance
- **Lazy loading** implemented for all major components to reduce initial bundle size
- **Custom hooks** (`useFormulaData`, `useFilteredData`, `useActiveFilters`) for optimized state management
- **Code splitting** with React.lazy() and Suspense for better performance
- **Unified UI Components** for consistent user experience across all features

**Enhanced Folder Structure with ClickUp Components:**
```
src/
├── app/                 # Main App component with lazy loading
├── components/          # Shared UI components
│   ├── ui/             # Unified components (Header, Filters, TableView)
│   │   ├── UnifiedHeader.js        # Consistent headers across tabs
│   │   ├── UnifiedFilters.js       # Advanced filtering system
│   │   ├── UnifiedTableView.js     # Professional table component
│   │   ├── GlobalSearchResults.js  # Global search interface
│   │   └── OptionsMenu.js          # Professional 3-dot menus
│   ├── layout/         # Layout components (Sidebar, Dashboard)
│   │   ├── ModernSidebar.js        # Grouped navigation sidebar
│   │   ├── ModernDashboardLayout.js # Main layout wrapper
│   │   ├── EnhancedHeader.js       # ClickUp-style header with breadcrumbs
│   │   └── EnhancedTabSystem.js    # Professional tab navigation
│   ├── views/          # Advanced view components
│   │   └── BoardView.js            # Kanban board with drag & drop
│   ├── charts/         # Chart components (Gantt, Stats, Analytics)
│   └── common/         # Common utilities (FileUpload)
├── features/           # Feature-based organization
│   ├── projects/       # Project management components
│   ├── tasks/          # Task management components
│   ├── team/           # Team management components
│   ├── clients/        # Client management components
│   └── dashboard/      # Dashboard-specific components
├── services/           # External services
│   ├── api/           # API communication (apiService.js)
│   ├── export/        # Export utilities (excelExport.js)
│   └── email/         # Email service
├── hooks/             # Custom React hooks for performance
├── utils/             # Utility functions
│   └── generators/    # ID generators
├── context/           # React Context providers
├── theme/             # Modular theme system
└── styles/            # Global CSS styles with ClickUp animations
```

[... rest of the existing file content remains unchanged ...]

- to memorize where we left off
```