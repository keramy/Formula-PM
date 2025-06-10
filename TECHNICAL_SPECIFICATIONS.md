# Technical Specifications - Formula Project Management

## Technology Stack

### Frontend
- **Framework**: React 19.1.0
- **UI Library**: Material-UI (MUI) 7.1.1
- **State Management**: React Context API
- **Date Handling**: date-fns 4.1.0
- **Charts**: Recharts 2.15.3
- **HTTP Client**: Axios 1.9.0
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
├── utils/              # Helper functions
├── services/           # API communication
├── config/             # Configuration files
└── App.js              # Main application entry
```

### Component Structure
- **App.js**: Main application with routing and state
- **Forms**: ProjectForm, TaskForm, TeamMemberForm
- **Lists**: ProjectsList, TasksList, TeamMembersList  
- **Dashboard**: StatsCards, AdvancedDashboard, GanttChart
- **Utilities**: NotificationContainer, FileUpload

### Backend Architecture
```
formula-backend/
├── server.js           # Express server with integrated endpoints
├── database.js         # JSON-based database operations
├── seedData.js         # Formula International company data
├── data/               # Database files
│   ├── teamMembers.json    # 14 Formula employees
│   ├── projects.json       # Sample projects
│   └── tasks.json          # Sample tasks
└── package.json        # Dependencies and scripts
```

## Data Models

### Project Entity
```javascript
{
  id: String,              // Unique identifier (proj_timestamp_random_counter)
  name: String,            // Project name
  type: String,            // fit-out | millwork | electrical | mep | management
  startDate: String,       // ISO date string
  endDate: String,         // ISO date string
  client: String,          // Client name (optional)
  description: String,     // Project description (optional)
  status: String,          // active | completed | paused
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

// LocalStorage Keys (Fallback)
'formula_projects'        // Projects array backup
'formula_tasks'          // Tasks array backup
'formula_team_members'   // Team members array backup
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