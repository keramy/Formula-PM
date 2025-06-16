# Formula PM - Enterprise Project Management System

**Live Demo**: [https://keramy.github.io/formula-pm](https://keramy.github.io/formula-pm)

A comprehensive enterprise-level project management solution built with **React 19** and **Material-UI**, featuring advanced workflow management, role-based authentication, and interconnected dependency tracking.

## 🚀 Key Features

### ✅ **User Authentication & Role-Based Access**
- **JWT-style Authentication** with secure demo accounts
- **Multi-Role System**: Admin, Co-founder, Project Manager access levels
- **Project Assignment System**: Role-based project visibility
- **Granular Permissions**: Edit/view/delete based on user roles

### ✅ **Advanced Project Management**
- **Full-Page Project Navigation** with professional layouts
- **Scope Management** with 4 specialized groups: Construction 🏗️, Millwork 🪵, Electric ⚡, MEP 🔧
- **Timeline Integration** with configurable duration tracking
- **Progress Visualization** with interactive sliders and real-time updates

### ✅ **Interconnected Workflow System**
- **Connection Management**: Link scope items to shop drawings and material specifications
- **Workflow Dashboard**: Production readiness overview with dependency analysis
- **Smart Warnings**: Real-time detection of production blockers
- **Recommendations Engine**: AI-like suggestions for workflow optimization

### ✅ **Professional UI/UX**
- **Material-UI Components** with custom Formula International theming
- **Responsive Design** optimized for desktop and mobile
- **Lazy Loading** and code splitting for optimal performance
- **Dark/Light Mode** support (coming soon)

## 🛠 Technology Stack

- **Frontend**: React 19, Material-UI, Context API
- **Backend**: Node.js, Express.js, JSON file-based database
- **Deployment**: GitHub Pages with automated CI/CD
- **Authentication**: JWT-style with localStorage persistence
- **State Management**: React Context with custom hooks

## 🎯 Demo Accounts

Try the system with these pre-configured accounts:

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Admin** | admin | admin123 | Full system access |
| **Co-founder** | sarah.johnson | pass123 | All projects + team management |
| **Project Manager** | mike.chen | pass123 | Assigned projects only |

## 🚀 Quick Start

### Frontend Development
```bash
cd formula-project-app
npm install
npm start
```
Access at: http://localhost:3000

### Backend Development (Optional - API fallback included)
```bash
cd formula-backend
npm install
npm start
```
API runs on: http://localhost:5001

### Production Build
```bash
npm run build
```

## 📊 Project Structure

```
src/
├── app/                 # Main App component with lazy loading
├── components/          # Shared UI components
│   ├── ui/             # Unified components (Headers, Filters, Tables)
│   ├── layout/         # Layout components (Sidebar, Dashboard)
│   ├── views/          # Advanced view components (Board, Calendar)
│   └── common/         # Common utilities
├── features/           # Feature-based organization
│   ├── projects/       # Project management (Scope, Workflow, Connections)
│   ├── tasks/          # Task management
│   ├── team/           # Team management
│   ├── clients/        # Client management
│   └── dashboard/      # Dashboard components
├── services/           # External services
│   ├── api/           # API communication
│   ├── connectionService.js  # Workflow connection management
│   └── export/        # Export utilities
├── context/           # React Context providers (Auth, Navigation)
├── hooks/             # Custom React hooks
└── utils/             # Utility functions
```

## 🏗 Architecture Overview

### Advanced Scope Management
- **4 Scope Groups**: Construction, Millwork, Electric, MEP with specialized categories
- **Progress Tracking**: Interactive sliders with status management
- **Timeline Management**: Duration tracking with dependency analysis
- **Excel Integration**: Template download and bulk import functionality

### Workflow Connection System
- **Scope → Drawings → Materials**: Full linkage tracking
- **Production Readiness**: Automated calculation of workflow status
- **Dependency Engine**: Smart detection of production blockers
- **Warning System**: Real-time alerts for missing requirements

### Authentication & Security
- **Role-Based Access Control**: Admin, Co-founder, Project Manager roles
- **Project Assignment**: PMs only see their assigned projects
- **Permission Management**: Granular controls throughout application
- **Secure Demo Mode**: Pre-configured accounts for testing

## 🌐 Deployment

**Live Application**: The system is automatically deployed to GitHub Pages on every push to the main branch.

**URL**: https://keramy.github.io/formula-pm

**Build Status**: ✅ Successfully building with React 19 compatibility

## 📈 Performance Features

- **Lazy Loading**: All major components load on-demand
- **Code Splitting**: Optimized bundle size with React.lazy()
- **Custom Hooks**: Efficient state management and data fetching
- **Memoization**: Optimized re-renders with React.memo
- **Bundle Optimization**: Tree shaking and dead code elimination

## 🧪 Testing

```bash
npm test        # Run all tests
npm run test:coverage  # Run with coverage report
```

## 📝 Development Notes

- **React 19 Compatibility**: Fully optimized for the latest React features
- **Material-UI v6**: Latest components with enhanced theming
- **ESLint Configuration**: Strict code quality standards
- **GitHub Actions**: Automated testing and deployment pipeline

## 🤝 Contributing

This is a comprehensive enterprise project management system. The codebase follows modern React patterns with feature-based organization for scalability.

---

**Built with ❤️ by Formula International Development Team**