# Technical Specifications - Formula Project Management

## Technology Stack

### Frontend
- **Framework**: React 19.1.0
- **UI Library**: Material-UI (MUI) 7.1.1
- **State Management**: React Context API
- **Date Handling**: date-fns 4.1.0
- **Date Pickers**: @mui/x-date-pickers 6.15.0
- **Charts**: Recharts 2.15.3
- **HTTP Client**: Axios 1.9.0
- **Excel Export**: xlsx 0.18.5, file-saver 2.0.5
- **Build Tool**: Create React App 5.0.0

### Backend
- **Runtime**: Node.js 18.x+
- **Framework**: Express.js 4.18.0
- **CORS**: cors 2.8.5
- **Email**: Nodemailer 7.0.3
- **Development**: Nodemon 3.0.0

### Database (Current)
- **Implementation**: JSON-based file system
- **Location**: `/formula-backend/data/` directory
- **Backup**: LocalStorage fallback for offline operation

## Architecture Overview

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
├── context/            # React Context for state
├── theme/              # Modular styling system
│   ├── index.js        # Main theme configuration
│   ├── colors.js       # Centralized color palette
│   ├── typography.js   # Font and text styles
│   └── components.js   # Material-UI overrides
├── styles/             # Global styles and utilities
│   ├── globals.css     # CSS variables and overrides
│   └── README.md       # Styling documentation
├── utils/              # Helper functions
├── services/           # API communication
├── config/             # Configuration files
├── App.css             # Legacy styles (still functional)
└── App.js              # Main application entry
```

### Component Structure
- **App.js**: Main application with routing and state
- **Forms**: ProjectForm, TaskForm, TeamMemberForm, ClientForm
- **Lists**: ProjectsList, TasksList (Enhanced), TeamMembersList (Enhanced), ClientsList (Enhanced)
- **Enhanced Project Views**: ProjectsHeader, ProjectsTableView, ProjectsFilters
- **Project Scope Management**: ProjectScope (Legacy), EnhancedProjectScope, EnhancedScopeItemForm, ScopeImportDialog
- **Unified Components**: UnifiedHeader, UnifiedFilters, UnifiedTableView (Error-protected)
- **Dashboard**: StatsCards, AdvancedDashboard, GanttChart
- **Utilities**: NotificationContainer, FileUpload, excelExport

### Styling System Architecture
- **Theme Provider**: Uses `formulaTheme` from `/src/theme/index.js`
- **Color Management**: Centralized in `/src/theme/colors.js` with utility functions
- **Component Overrides**: Material-UI customization in `/src/theme/components.js`
- **Typography**: Font configuration in `/src/theme/typography.js`
- **Global Styles**: CSS variables and utilities in `/src/styles/globals.css`
- **Legacy Support**: Original `App.css` still functional for backward compatibility

### Backend Architecture
```
formula-backend/
├── server.js           # Express server with integrated endpoints
├── database.js         # JSON-based database operations
├── seedData.js         # Formula International company data
├── data/               # Database files
│   ├── teamMembers.json    # 14 Formula employees
│   ├── projects.json       # Sample projects
│   ├── tasks.json          # Sample tasks
│   ├── clients.json        # Client database
│   └── scopeItems.json     # Project scope items
└── package.json        # Dependencies and scripts
```

## Data Models

### Project Entity
```javascript
{
  id: String,              // Unique identifier (proj_timestamp_random_counter)
  name: String,            // Project name
  type: String,            // general-contractor | fit-out | millwork | electrical | mep | management
  startDate: String,       // ISO date string
  endDate: String,         // ISO date string
  clientId: Number,        // Reference to client ID
  projectManager: Number,  // Reference to team member ID
  description: String,     // Project description (optional)
  budget: String,          // Project budget (optional)
  location: String,        // Project location (optional)
  status: String,          // on-tender | awarded | on-hold | not-awarded | active | completed
  createdAt: String        // ISO timestamp
}
```

### Task Entity
```javascript
{
  id: String,              // Unique identifier (task_timestamp_random_counter)
  projectId: String,       // Reference to project
  name: String,            // Task name
  assignedTo: String,      // Reference to team member ID
  priority: String,        // low | medium | high | urgent
  dueDate: String,         // ISO date string
  description: String,     // Task description (optional)
  status: String,          // pending | in-progress | completed
  progress: Number,        // 0-100 percentage
  files: Array,            // File attachments (future)
  createdAt: String        // ISO timestamp
}
```

### Client Entity
```javascript
{
  id: Number,              // Unique identifier
  companyName: String,     // Company name
  contactPersonName: String, // Primary contact name
  contactPersonTitle: String, // Contact person title
  email: String,           // Contact email
  phone: String,           // Contact phone
  address: String,         // Street address
  city: String,            // City
  state: String,           // State/Province
  country: String,         // Country
  postalCode: String,      // Postal/ZIP code
  website: String,         // Company website
  industry: String,        // Industry type
  companySize: String,     // Company size category
  services: Array,         // Required services
  taxId: String,           // Tax identification
  notes: String,           // Additional notes
  status: String,          // active | inactive | potential
  createdAt: String,       // ISO timestamp
  updatedAt: String        // ISO timestamp
}
```

### Team Member Entity
```javascript
{
  id: Number,              // Unique identifier (1001-1014 for Formula employees)
  firstName: String,       // First name
  lastName: String,        // Last name
  fullName: String,        // Full name
  initials: String,        // Display initials (e.g., "KC")
  email: String,           // Email address (@formulaint.com)
  phone: String,           // Phone number
  username: String,        // System username
  position: String,        // Job position/title
  role: String,            // System role (super_admin, project_manager, etc.)
  level: Number,           // Hierarchy level (1-10)
  department: String,      // management | fit-out | mep
  reportsTo: String,       // Comma-separated manager IDs
  status: String,          // active | inactive
  permissions: Array,      // System permissions
  roleColor: String,       // Color for UI display
  hourlyRate: Number,      // Billing rate
  notes: String            // Additional notes
}
```

### Scope Item Entity (NEW)
```javascript
{
  id: String,              // Unique identifier
  projectId: String,       // Reference to project
  category: String,        // Predefined category (12 options)
  description: String,     // Item description
  unit: String,            // Measurement unit (sqm, lm, pcs, etc.)
  quantity: Number,        // Item quantity
  unitPrice: Number,       // Price per unit
  totalPrice: Number,      // Calculated total (quantity × unitPrice)
  notes: String,           // Additional notes
  createdAt: String        // ISO timestamp
}
```

### Notification Entity
```javascript
{
  id: String,              // Unique identifier (notif_timestamp_random_counter)
  message: String,         // Notification text
  type: String,            // success | error | warning | info
  duration: Number,        // Auto-dismiss time in ms
  timestamp: String        // ISO timestamp
}
```

## API Endpoints

### Current Status: Fully Implemented
All endpoints connected to JSON-based database with CRUD operations.

### Projects API
```
GET    /api/projects           # List all projects
POST   /api/projects           # Create new project
GET    /api/projects/:id       # Get project by ID
PUT    /api/projects/:id       # Update project
DELETE /api/projects/:id       # Delete project
```

### Clients API
```
GET    /api/clients           # List all clients
POST   /api/clients           # Create new client
GET    /api/clients/:id       # Get client by ID
PUT    /api/clients/:id       # Update client
DELETE /api/clients/:id       # Delete client
```

### Scope Items API (Enhanced)
```
GET    /api/projects/:projectId/scope # List project scope items
POST   /api/projects/:projectId/scope # Create new scope item
PUT    /api/scope/:id                 # Update scope item
DELETE /api/scope/:id                 # Delete scope item
GET    /api/scope-items/:projectId    # Enhanced scope items endpoint
POST   /api/scope-items               # Bulk scope item creation
PUT    /api/scope-items/:id           # Enhanced scope item updates
DELETE /api/scope-items/:id           # Enhanced scope item deletion
```

### Tasks API  
```
GET    /api/tasks             # List all tasks
POST   /api/tasks             # Create new task
GET    /api/tasks/:id         # Get task by ID
PUT    /api/tasks/:id         # Update task
DELETE /api/tasks/:id         # Delete task
GET    /api/projects/:id/tasks # Get tasks for project
```

### Team Members API
```
GET    /api/team-members      # List all team members
POST   /api/team-members      # Add new team member
GET    /api/team-members/:id  # Get team member by ID
PUT    /api/team-members/:id  # Update team member
DELETE /api/team-members/:id  # Delete team member
```

### Notifications API
```
POST   /api/send-notification # Send email notification
```

### Utility API
```
GET    /api/health           # Health check endpoint
POST   /api/upload           # File upload (future)
```

## State Management

### React Context Structure
```javascript
// NotificationContext
{
  notifications: Array,      // Active notifications
  showNotification: Function, // Add notification
  removeNotification: Function, // Remove notification
  showSuccess: Function,     // Success shortcut
  showError: Function,       // Error shortcut
  showWarning: Function,     // Warning shortcut
  showInfo: Function         // Info shortcut
}
```

### Database Storage
```javascript
// JSON Files (Primary)
'/data/teamMembers.json'  // 14 Formula International employees
'/data/projects.json'     // Active and completed projects
'/data/tasks.json'        // Task assignments and progress
'/data/clients.json'      // Client database
'/data/scopeItems.json'   // Project scope items (NEW)

// LocalStorage Keys (Fallback)
'formula_projects'        // Projects array backup
'formula_tasks'          // Tasks array backup
'formula_team_members'   // Team members array backup
'formula_clients'        // Clients array backup
'formula_scope_items'    // Scope items array backup
```

### Database Operations
```javascript
// SimpleDB Class Methods
db.read(table)            // Read all records from table
db.write(table, data)     // Write entire dataset to table
db.insert(table, item)    // Insert new record with auto-ID
db.update(table, id, updates) // Update existing record
db.delete(table, id)      // Delete record by ID
db.findById(table, id)    // Find single record by ID
db.findBy(table, field, value) // Find records by field value
```

## Security Considerations

### Current Implementation
- CORS enabled for frontend communication
- Basic input validation in forms
- No authentication system (open access)

### Future Security Requirements
- JWT-based authentication
- Role-based access control
- Input sanitization and validation
- Rate limiting
- Environment variable management
- HTTPS in production

## Performance Specifications

### Frontend Performance
- Initial load: < 3 seconds
- Component rendering: < 100ms
- Form submissions: < 500ms
- LocalStorage operations: < 50ms

### Backend Performance
- API response time: < 200ms
- Email sending: < 5 seconds
- Server startup: < 2 seconds

### Memory Usage
- Frontend bundle size: ~5.8MB (development)
- Backend memory: ~50MB baseline
- LocalStorage limit: ~5-10MB per domain

## Browser Compatibility

### Minimum Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features
- ES6+ JavaScript support
- CSS Grid and Flexbox
- LocalStorage API
- Fetch API
- WebSockets (future)

## Development Environment

### Node.js Requirements
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### Development Dependencies
```json
{
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.6.3", 
  "@testing-library/user-event": "^13.5.0",
  "nodemon": "^3.0.0"
}
```

## Build and Deployment

### Frontend Build
```bash
npm run build
# Output: build/ folder with optimized static files
# Size: ~2MB compressed
```

### Backend Production
```bash
NODE_ENV=production npm start
# No build step required (interpreted JavaScript)
```

### Environment Variables
```bash
# Backend
NODE_ENV=development|production
PORT=5000
EMAIL_USER=gmail-account
EMAIL_PASS=app-password
DATABASE_URL=connection-string

# Frontend (Create React App)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

## Testing Strategy

### Current Status
- Basic React testing setup included
- No tests implemented yet

### Planned Testing
- Unit tests for utility functions
- Integration tests for API endpoints  
- Component testing with React Testing Library
- End-to-end testing with Cypress

## Error Handling

### Frontend Error Boundaries
```javascript
// Planned implementation
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Backend Error Middleware
```javascript
// Current implementation
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
```

## Monitoring and Logging

### Current Logging
- Console.log statements
- Browser DevTools
- Server console output

### Production Requirements
- Structured logging (Winston)
- Error tracking (Sentry)
- Performance monitoring
- API metrics

## Scalability Considerations

### Current Limitations
- File-based database (not suitable for high concurrency)
- No real-time updates between users
- No database indexing for large datasets
- Single server instance (no clustering)

### Scalability Plan
- Database migration
- Multi-user authentication
- Real-time WebSocket updates
- Horizontal scaling with load balancers
- CDN for static assets
- Caching strategies (Redis)

## Third-party Dependencies

### Critical Dependencies
```json
{
  "react": "^19.1.0",
  "@mui/material": "^7.1.1", 
  "express": "^4.18.0",
  "nodemailer": "^7.0.3"
}
```

### Development Dependencies
```json
{
  "react-scripts": "^5.0.0",
  "nodemon": "^3.0.0"
}
```

All dependencies are actively maintained with regular security updates.