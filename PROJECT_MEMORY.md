---
layout: default
title: Project Memory Documentation
---

# Project Memory Documentation - Formula PM
*Comprehensive knowledge base for future development phases*

## Project Identity & Context

### Business Context
- **Company**: Formula International (Turkish construction/project management company)
- **Owner**: Kerem (GitHub: keramy, Email: keremscolak@gmail.com)
- **Purpose**: Internal project management system for Formula International operations
- **Target Users**: Construction project managers, team leads, administrative staff

### Brand Identity
- **Primary Color**: #37444B (Dark blue-gray)
- **Secondary Color**: #C0B19E (Warm beige)
- **Logo**: ⚡ Formula PM
- **Tagline**: "Professional Project Management System"
- **Design Language**: Professional, clean, Material-UI based with Formula International branding

## Current Architecture (December 2024)

### Tech Stack Summary
```
Frontend: React 19.1.0 + Material-UI 7.1.1 + Context API
Backend: Node.js + Express 4.18.0 + JSON file database
Deployment: GitHub Pages + Local development servers
Data: Demo data fallbacks + LocalStorage persistence
```

### Key File Locations
- **Main App**: `/formula-project-app/src/App.js`
- **API Service**: `/formula-project-app/src/services/apiService.js` (includes demo data)
- **Database**: `/formula-backend/data/` (JSON files)
- **Components**: `/formula-project-app/src/components/`
- **Theme**: `/formula-project-app/src/theme/`
- **GitHub Pages**: Root directory (`index.html`, `app.html`, `static/`)

### Database Schema (Current)
```javascript
// Team Members (teamMembers.json)
{
  id: Number,              // 1001-1014 for Formula employees
  firstName: String,       // "Kubilay"
  lastName: String,        // "Ilgın"
  fullName: String,        // "Kubilay Ilgın"
  initials: String,        // "KI"
  email: String,           // "kubilay.ilgin@formulaint.com"
  department: String,      // "Management" | "Fit-out" | "MEP"
  position: String,        // "Managing Partner"
  role: String            // "admin" | "manager" | "user"
}

// Projects (projects.json)
{
  id: Number,              // 2001+
  name: String,            // "Akbank Head Office Renovation"
  description: String,     // Project description
  status: String,          // "active" | "on-tender" | "completed" | etc.
  type: String,            // "general-contractor" | "fit-out" | "MEP"
  clientId: Number,        // Reference to clients
  startDate: String,       // "2024-01-15"
  endDate: String,         // "2024-12-31"
  budget: Number,          // 5000000
  projectManager: Number   // Reference to team member ID
}

// Tasks (tasks.json)
{
  id: Number,              // 4001+
  title: String,           // "Review architectural plans"
  description: String,     // Task description
  status: String,          // "pending" | "in-progress" | "completed"
  priority: String,        // "low" | "medium" | "high" | "urgent"
  projectId: Number,       // Reference to project
  assignedTo: Number,      // Reference to team member
  dueDate: String,         // "2024-12-20"
  createdAt: String       // Creation timestamp
}

// Clients (clients.json)
{
  id: Number,              // 3001+
  name: String,            // "Akbank"
  industry: String,        // "Banking"
  contactPerson: String,   // "Mehmet Öztürk"
  email: String,           // Contact email
  phone: String,           // Contact phone
  address: String,         // Business address
  status: String          // "active" | "inactive" | "potential"
}

// Scope Items (scopeItems.json)
{
  id: String,              // UUID
  projectId: String,       // Reference to project
  category: String,        // 12 predefined categories
  description: String,     // Item description
  unit: String,            // "sqm" | "lm" | "pcs" | etc.
  quantity: Number,        // Item quantity
  unitPrice: Number,       // Price per unit
  totalPrice: Number      // quantity * unitPrice
}
```

### Component Architecture

#### Universal Components (Reusable)
- **UnifiedHeader**: Search, filters, export, view toggle
- **UnifiedFilters**: Advanced filtering with date ranges, multi-select
- **UnifiedTableView**: Error-protected table with avatars, actions, sorting

#### Feature Components
- **Enhanced Components**: Modern redesigns with professional UI
  - `EnhancedProjectScope.js`: Full-screen scope management
  - `EnhancedScopeItemForm.js`: Advanced form with file upload
  - `ModernDashboardLayout.js`: Professional dashboard wrapper

#### Legacy Components (Still Functional)
- Original forms and lists (kept for backward compatibility)
- Basic dashboard and stats cards

### GitHub Pages Deployment Architecture

#### Dual-Mode Structure
```
Root URL (https://keramy.github.io/formula-pm)
├── index.html          # Professional landing page
├── app.html           # Full React application
├── static/            # Optimized JS/CSS bundles
│   ├── js/main.5cd6338f.js  # 449.28 kB main bundle
│   └── css/main.807fbc6a.css # Styles
├── README.md          # Auto-published documentation
└── *.md files         # All documentation auto-published
```

#### Demo Data Strategy
All API endpoints have comprehensive fallbacks:
```javascript
async getTeamMembers() {
  try {
    return await this.request('/team-members');
  } catch (error) {
    console.warn('Backend unavailable, using demo data');
    return [/* 2 realistic team members */];
  }
}
```

## Development History & Lessons Learned

### Major Milestones
1. **Foundation (Phases 1-2)**: React setup, basic CRUD, Material-UI integration
2. **Enhanced UI (Phase 2)**: Universal components, professional tables, advanced filtering
3. **Database Integration (Phase 3)**: JSON file system, Formula International seeding
4. **GitHub Pages (Phase 3.5)**: Deployment, demo data, standalone operation

### Critical Bug Patterns Solved
1. **React Object Rendering**: Comprehensive object detection and JSX conversion
2. **Material-UI Overrides**: Modular theme system solving CSS specificity
3. **Asset Path Issues**: GitHub Pages relative path requirements
4. **Backend Dependencies**: Demo data fallbacks for standalone deployment

### Performance Optimizations
- **Bundle Size**: 449.28 kB main bundle (reasonable for feature set)
- **Code Splitting**: 453.e6b2b7eb.chunk.js for secondary features
- **Asset Optimization**: GitHub CDN serving, gzipped bundles
- **Loading States**: User feedback during data operations

## Feature Implementation Patterns

### Standard CRUD Pattern
```javascript
// 1. API Service Method
async getItems() {
  try {
    return await this.request('/items');
  } catch (error) {
    return demoData; // Always include demo fallback
  }
}

// 2. Component State Management
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

// 3. Load Data
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await apiService.getItems();
      setItems(data);
    } catch (error) {
      showNotification('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);

// 4. Universal Table Integration
<UnifiedTableView
  data={items}
  columns={columns}
  onEdit={handleEdit}
  onDelete={handleDelete}
  loading={loading}
/>
```

### Theme Customization Pattern
```javascript
// 1. Update colors.js
export const colors = {
  primary: { main: '#37444B' },
  secondary: { main: '#C0B19E' }
};

// 2. Override components.js
MuiButton: {
  styleOverrides: {
    root: { borderRadius: '8px' }
  }
}

// 3. Global CSS variables
:root {
  --formula-primary: #37444B;
  --formula-secondary: #C0B19E;
}
```

## User Experience Patterns

### Navigation Flow
```
Landing Page → Launch Application → Dashboard
├── Dashboard: Overview, stats, quick actions
├── Analytics: Charts, reports, insights
├── Team: Member management, roles, tasks
├── Projects & Tasks: Main work management
└── Timeline: Gantt charts, scheduling
```

### Data Entry Flow
1. **Quick Add**: Floating action buttons on list views
2. **Form Validation**: Real-time feedback with Material-UI
3. **Auto-save**: Draft saving in localStorage
4. **Confirmation**: Delete/edit confirmations with consequences

### Mobile Responsiveness
- **Breakpoints**: Material-UI standard (xs, sm, md, lg, xl)
- **Navigation**: Collapsible sidebar, mobile drawer
- **Tables**: Horizontal scroll, essential columns only
- **Forms**: Single column layout on mobile

## Integration Points & APIs

### Current Integrations
- **Material-UI**: Complete theme integration
- **LocalStorage**: Fallback persistence
- **GitHub Pages**: Static site deployment
- **Excel Export**: xlsx library for data export

### Ready for Integration
- **Email Service**: Backend configured (needs SMTP setup)
- **File Upload**: Component ready (needs storage backend)
- **Real-time**: Socket.io structure prepared
- **Authentication**: JWT token setup ready

### Third-party Service Recommendations
```javascript
// Email: Use with existing backend
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=formula@example.com
SMTP_PASS=app-specific-password

// File Storage: Recommended services
AWS_S3_BUCKET=formula-pm-files
CLOUDINARY_URL=cloudinary://...
GOOGLE_DRIVE_API_KEY=...

// Real-time: Socket.io ready
SOCKET_IO_URL=wss://api.formula-pm.com
REDIS_URL=redis://localhost:6379
```

## Common Development Tasks

### Adding a New Feature
1. **Create Universal Component**: Follow UnifiedTableView pattern
2. **Add API Service**: Include demo data fallback
3. **Database Schema**: Update JSON structure + seeding
4. **Update Navigation**: Add to sidebar and routing
5. **Documentation**: Update TECHNICAL_SPECIFICATIONS.md
6. **Testing**: Component + API integration tests

### Debugging GitHub Pages
```bash
# Local testing
npm run build
npx serve -s build

# Check asset paths
grep -r "/formula-pm/" build/  # Should find nothing

# Deploy troubleshooting
git status  # Ensure all committed
git push    # Deploy to GitHub
```

### Database Modifications
```javascript
// 1. Update seedData.js
const newData = [/* new structure */];

// 2. Update database.js if needed
async createNewEntity(data) {
  return this.create('newEntities', data);
}

// 3. Update apiService.js
async getNewEntities() {
  try {
    return await this.request('/new-entities');
  } catch (error) {
    return [/* demo data */];
  }
}

// 4. Restart backend to reseed
npm run dev  # In formula-backend/
```

## Security & Best Practices

### Current Security Measures
- **Input Validation**: Client-side with Material-UI
- **CORS**: Configured for localhost development
- **Data Sanitization**: Basic string escaping
- **Error Handling**: No sensitive data in error messages

### Security Todos for Next Phase
- **Authentication**: JWT implementation ready
- **Authorization**: Role-based access control designed
- **Input Validation**: Server-side validation needed
- **Rate Limiting**: Express rate limiter setup
- **Environment Variables**: .env file configuration

### Code Quality Standards
- **ESLint**: Configured with React rules
- **Prettier**: Code formatting ready
- **Component Structure**: Consistent patterns established
- **Error Boundaries**: Planned for next phase
- **TypeScript**: Migration path prepared

## Troubleshooting Guide

### Common Issues & Solutions

#### React App Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

#### GitHub Pages Blank Page
1. Check `app.html` asset paths (should be relative)
2. Verify demo data in `apiService.js`
3. Check browser console for errors
4. Ensure build files are committed

#### Backend Connection Issues
```bash
# Check if backend is running
curl http://localhost:5001/api/health

# Restart backend
cd formula-backend
npm run dev
```

#### Material-UI Theme Issues
1. Check `/src/theme/index.js` exports
2. Verify `ThemeProvider` wraps App component
3. Clear browser cache for CSS changes
4. Check console for theme warnings

### Performance Issues
- **Large Bundle**: Use React.lazy() for code splitting
- **Slow Rendering**: Add React.memo() to expensive components
- **Memory Leaks**: Check useEffect cleanup functions
- **Network Issues**: Verify API call patterns

## Future Phase Preparation

### Immediate Next Steps (Phase 4)
1. **Authentication System**: Use existing team member data as user base
2. **Real Email Service**: Configure SMTP with backend emailService
3. **File Upload**: Implement cloud storage integration
4. **Enhanced Dashboard**: More analytics and reporting

### Technical Debt Priorities
1. **TypeScript Migration**: Start with new components
2. **Unit Testing**: Jest + React Testing Library setup
3. **End-to-End Testing**: Cypress implementation
4. **Performance Monitoring**: Add React DevTools profiling

### Scalability Considerations
- **Database Migration**: Plan PostgreSQL/MongoDB migration
- **Microservices**: API separation strategy
- **CDN**: Asset delivery optimization
- **Caching**: Redis integration for sessions
- **Monitoring**: Error tracking and performance metrics

## Contact & Handoff Information

### Repository Details
- **GitHub**: https://github.com/keramy/formula-pm
- **Live Demo**: https://keramy.github.io/formula-pm
- **Owner**: Kerem (keremscolak@gmail.com)
- **Branch Strategy**: Main branch for production, feature branches for development

### Development Environment Setup
```bash
# Clone and setup
git clone https://github.com/keramy/formula-pm.git
cd formula-pm

# Backend setup
cd formula-backend
npm install
npm run dev  # Port 5001

# Frontend setup (new terminal)
cd formula-project-app
npm install
npm start   # Port 3000

# Access application
# Local: http://localhost:3000
# GitHub Pages: https://keramy.github.io/formula-pm
```

### Key Knowledge Transfer Points
1. **Formula International Context**: Turkish construction company with specific workflow needs
2. **Dual Deployment**: Local development + GitHub Pages demo
3. **Demo Data Strategy**: Every API call has realistic fallback data
4. **Component Patterns**: Universal components for consistency
5. **Theme System**: Easy customization via modular structure
6. **Error Protection**: Multi-layer safety for React object rendering

---

*This document serves as the complete knowledge base for Formula PM development. Update this file with each major release or architectural change.*

**Last Updated**: December 2024  
**Version**: 2.0.0 (GitHub Pages Release)  
**Status**: Production Ready with Demo Data