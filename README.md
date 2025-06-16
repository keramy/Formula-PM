# Formula PM - Enterprise Project Management System

**Live Demo**: [https://keramy.github.io/formula-pm](https://keramy.github.io/formula-pm)

A comprehensive **enterprise-level** project management application built with React 19 and Node.js, featuring advanced workflow management, role-based authentication, interconnected dependency tracking, and professional interface design.

## ✨ **ENTERPRISE FEATURES COMPLETED** ✅

🎉 **Complete enterprise implementation with advanced project management capabilities:**

### **Phase 1: User Authentication & Role-Based Access ✅**
- **JWT-style Authentication** with secure demo accounts
- **Multi-Role System**: Admin, Co-founder, Project Manager access levels
- **Project Assignment System**: Role-based project visibility
- **Granular Permissions**: Edit/view/delete based on user roles

### **Phase 2: Enhanced Project Navigation ✅**
- **Full-Page Project Views** replacing modal popups
- **Breadcrumb Navigation** with professional back/forward functionality
- **Project Section Tabs**: Overview, Scope, Shop Drawings, Material Specifications, Compliance
- **Navigation Context** with seamless project section switching

### **Phase 3: Advanced Scope Management ✅**
- **4 Scope Groups**: Construction 🏗️, Millwork 🪵, Electric ⚡, MEP 🔧
- **Timeline Management** with configurable duration tracking
- **Progress Visualization** with interactive sliders and real-time updates
- **Group Dependencies** with smart dependency management

### **Phase 4: Interconnected Workflow System ✅**
- **Connection Management**: Link scope items to shop drawings and material specifications
- **Workflow Dashboard**: Production readiness overview with dependency analysis
- **Smart Warnings**: Real-time detection of production blockers
- **Recommendations Engine**: AI-like suggestions for workflow optimization

## 🚀 Quick Start

### Option 1: Frontend Only (GitHub Pages Compatible)
```bash
cd formula-project-app
npm install
npm start
```
Access at: http://localhost:3000

### Option 2: Full Stack Development
```bash
# Terminal 1 - Backend Server
cd formula-backend
npm install
npm start

# Terminal 2 - Frontend Server  
cd formula-project-app
npm install
npm start
```

### Option 3: Using Startup Scripts
```bash
# Start both servers
./start-servers.sh

# Stop both servers
./stop-servers.sh
```

## 📱 Access the Application

- **Production**: https://keramy.github.io/formula-pm
- **Frontend Development**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **API Health Check**: http://localhost:5001/api/health

## 🎯 Demo Accounts

Try the enterprise system with these pre-configured accounts:

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Admin** | admin | admin123 | Full system access |
| **Co-founder** | sarah.johnson | pass123 | All projects + team management |
| **Project Manager** | mike.chen | pass123 | Assigned projects only |

## 🏗️ Enterprise Architecture

### Backend (Port 5001)
- **Framework**: Node.js with Express
- **Database**: File-based JSON storage with custom SimpleDB
- **API**: RESTful endpoints for all CRUD operations
- **Email**: Nodemailer integration for notifications

### Frontend - **ENTERPRISE-LEVEL IMPLEMENTATION**
- **Framework**: React 19 with Material-UI v6
- **Authentication**: JWT-style with role-based access control
- **Architecture**: Feature-based folder structure with lazy loading
- **Performance**: Code splitting + memoization for optimized performance
- **State Management**: React Context API + custom hooks with persistent state
- **Navigation**: Professional breadcrumb system with project context
- **Workflow**: Advanced dependency tracking and production readiness

## 🎯 Enterprise Features

### 🔐 Authentication & Security
- **Role-Based Access Control**: Admin, Co-founder, Project Manager roles
- **Project Assignment**: PMs only see their assigned projects
- **Permission Management**: Granular controls throughout application
- **Secure Demo Mode**: Pre-configured accounts for testing

### 📊 Advanced Project Management
- **Full-Page Project Navigation** with professional layouts
- **Scope Management** with 4 specialized groups
- **Timeline Integration** with configurable duration tracking
- **Progress Visualization** with interactive sliders and real-time updates
- **Excel Integration**: Template download and bulk import functionality

### 🔗 Interconnected Workflow System
- **Connection Management**: Link scope items to shop drawings and material specifications
- **Workflow Dashboard**: Production readiness overview with dependency analysis
- **Dependency Engine**: Smart detection of production blockers
- **Warning System**: Real-time alerts for missing requirements
- **Recommendations**: AI-like suggestions for workflow optimization

### 👥 Team Management ⭐ **Enhanced** 
- **Professional Interface** with clean 3-dot option menus
- **Persistent View Modes** that remember user preferences
- **Team Member Detail Pages** with comprehensive profiles and task analytics
- **Advanced Filtering** by role, department, status, and experience level
- **Real-time Statistics** including completion rates and workload metrics
- **Role Hierarchy** with visual role levels and color-coded badges

### 🏢 Client Database
- **Company Information**: Name, industry, size, website
- **Contact Details**: Primary contact, email, phone
- **Address Management**: Full address with city/country
- **Service Tracking**: Multi-select services required
- **Status Management**: Active, inactive, potential clients
- **Project Integration**: Select clients during project creation

### ✅ Task Management
- **Unified Interface** with professional table and card views
- **Advanced Filtering** by status, priority, project, assignee, and due dates
- **Quick Filters** for overdue tasks, due today/this week, urgent tasks
- **Real-time Search** across task names and descriptions
- **Progress Tracking** with visual progress bars and completion status
- **Excel Export** with professional task reports

## 🗂️ Navigation Structure

1. **Dashboard** - Overview and analytics with KPIs
2. **Projects** - Advanced project management with scope, workflow, and connections
3. **My Projects** - Role-based personal project view
4. **Tasks** - Comprehensive task management and tracking
5. **Team** - Enhanced team member management with analytics
6. **Clients** - Complete client database management
7. **Procurement** - Procurement workflows
8. **Timeline & Gantt** - Project visualization and planning

## 🔧 Enterprise API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout

### Scope Management
- `GET /api/projects/:projectId/scope` - List project scope items
- `POST /api/projects/:projectId/scope` - Create new scope item
- `PUT /api/scope/:id` - Update scope item
- `DELETE /api/scope/:id` - Delete scope item

### Workflow Management
- `GET /api/projects/:projectId/workflow` - Get workflow status
- `POST /api/connections` - Create scope-drawing-material connections
- `GET /api/dependencies/:projectId` - Analyze project dependencies

### Team & Projects
- `/api/team-members` - Team management with role-based access
- `/api/projects` - Project operations with scope integration
- `/api/tasks` - Task management with team assignment
- `/api/clients` - Client database operations

## 🛠️ Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
# Install backend dependencies
cd formula-backend
npm install

# Install frontend dependencies
cd ../formula-project-app
npm install

# Install enterprise features dependencies
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material @mui/x-date-pickers
```

### Environment Variables
Create `.env` file in `formula-backend/`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5001
NODE_ENV=development
JWT_SECRET=your-jwt-secret
```

## 📊 Project Structure (Enterprise-Level)

```
src/
├── app/                 # Main App component with authentication
├── components/          # Shared UI components
│   ├── ui/             # Unified components (Headers, Filters, Tables)
│   ├── layout/         # Layout components (Sidebar, Dashboard)
│   ├── views/          # Advanced view components (Board, Calendar)
│   ├── navigation/     # Navigation components (Breadcrumbs)
│   └── common/         # Common utilities
├── features/           # Feature-based organization
│   ├── projects/       # Project management (Scope, Workflow, Connections)
│   │   ├── components/ # ProjectPage, EnhancedProjectScope, WorkflowDashboard
│   │   └── services/   # Project-specific services
│   ├── tasks/          # Task management
│   ├── team/           # Team management with role-based access
│   ├── clients/        # Client management
│   └── dashboard/      # Dashboard components
├── services/           # External services
│   ├── api/           # API communication layer
│   ├── connectionService.js  # Workflow connection management
│   └── export/        # Export utilities (Excel, PDF)
├── context/           # React Context providers
│   ├── AuthContext.js     # Authentication and role management
│   ├── NavigationContext.js # Project navigation state
│   └── DataContext.js     # Global data management
├── hooks/             # Custom React hooks for enterprise features
├── utils/             # Utility functions
└── theme/             # Material-UI theme customization
```

## 🌐 Deployment & Production

### GitHub Pages (Current)
**Live URL**: https://keramy.github.io/formula-pm
- Automatic deployment on every push to main branch
- React 19 compatibility with optimized build
- All enterprise features work perfectly on static hosting

### Production Build
```bash
npm run build
```

### Docker Deployment (Full Stack)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📈 Performance Features

- **Lazy Loading**: All major components load on-demand
- **Code Splitting**: Optimized bundle size with React.lazy()
- **Custom Hooks**: Efficient state management and data fetching
- **Memoization**: Optimized re-renders with React.memo
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Route-based Splitting**: Separate chunks for different features

## 🧪 Testing & Quality

```bash
npm test                    # Run all tests
npm run test:coverage      # Run with coverage report
npm run lint               # ESLint code quality check
npm run lint:fix           # Auto-fix linting issues
```

## 🚨 Troubleshooting

### Authentication Issues
```bash
# Clear authentication state
localStorage.clear()

# Check user role and permissions
console.log(JSON.parse(localStorage.getItem('formulaUser')))
```

### Workflow Dashboard Not Loading
1. Check if scope items exist for the project
2. Verify shop drawings and material specs are loaded
3. Check browser console for dependency analysis errors

### Project Navigation Issues
1. Ensure user has project access permissions
2. Check if project ID exists in user's assigned projects
3. Verify navigation context is properly initialized

## 🏢 About Formula International

This enterprise project management system is built for Formula International's operations, featuring:
- **Turkish Team Integration**: Localized team member data
- **Formula Branding**: Custom theme and colors
- **Industry-Specific Workflows**: Construction and millwork focus
- **Enterprise Security**: Role-based access control
- **Professional Interface**: Modern, clean, and efficient design

## 📄 License

Internal use only - Formula International

---

**Built with ❤️ by Formula International Development Team**