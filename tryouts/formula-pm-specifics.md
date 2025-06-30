# Formula PM Project Specifics

This document contains Formula PM specific constants, patterns, and critical information for AI agents working on the codebase.

## Project Structure

```
formula-pm/
├── formula-project-app/         # Main application
│   ├── src/                    # Frontend React app
│   │   ├── pages/             # Page components (use CleanPageLayout)
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API and business logic
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # React contexts (Auth, Theme, etc.)
│   │   └── styles/            # Global styles and themes
│   └── backend/               # Express.js backend
│       ├── routes/            # API endpoints
│       ├── services/          # Business logic services
│       ├── middleware/        # Auth, error handling, etc.
│       └── prisma/            # Database schema
├── docs/                      # Documentation
└── CLAUDE.md                  # AI assistant guidelines
```

## Critical Constants

### Ports
- Frontend: `http://localhost:3003`
- Backend: `http://localhost:5014` (simple server)
- Full Backend: `http://localhost:5001` (when debugging)
- Prisma Studio: `http://localhost:5555`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### Environment Variables
```bash
# Frontend (.env.local)
VITE_API_URL=http://localhost:5014
VITE_FORCE_DEMO_MODE=true  # For development without backend

# Backend (.env)
DATABASE_URL=postgresql://...
JWT_SECRET=...
REDIS_URL=redis://localhost:6379
DEMO_MODE=true  # Enable demo endpoints
```

## Icon System Rules

### ✅ ALWAYS USE
```javascript
import { Home, User, Settings, Plus, Edit2, Trash } from 'iconoir-react';
```

### ❌ NEVER USE
```javascript
import HomeIcon from '@mui/icons-material/Home';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
```

### Common Icon Mappings
- `ExpandMore` → `NavArrowDown`
- `ExpandLess` → `NavArrowUp`
- `Add` → `Plus`
- `Delete` → `Trash`
- `Edit` → `Edit2`
- `Person` → `User`
- `ArrowBack` → `ArrowLeft`

## Page Layout Pattern

### All Pages MUST Use
```javascript
import CleanPageLayout from '../components/layout/CleanPageLayout';

const MyPage = () => (
  <CleanPageLayout 
    title="Page Title"
    actions={[/* optional action buttons */]}
  >
    {/* Page content */}
  </CleanPageLayout>
);
```

## API Service Patterns

### Frontend API Calls
```javascript
// Option 1: Direct API service
import apiService from '../services/api/apiService';
const data = await apiService.get('/projects');

// Option 2: With demo fallback (PREFERRED)
import { useAuthenticatedData } from '../hooks/useAuthenticatedData';
const { data, loading, error } = useAuthenticatedData('/api/projects', {
  fallbackToDemo: true
});
```

### Backend Route Pattern
```javascript
// ALWAYS use app.locals.prisma
router.get('/items', async (req, res) => {
  const prisma = req.app.locals.prisma;
  
  // Demo mode check
  if (process.env.DEMO_MODE === 'true' || !prisma) {
    return res.json(getDemoItems());
  }
  
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Sophisticated Page Examples

These pages demonstrate best practices and should be studied:

1. **InboxPage.jsx** - Multi-tab messaging system
   - 4 tabs: Messages, Notifications, Team Chat, Announcements
   - Real-time updates with Socket.IO
   - Smart filtering and search

2. **UpdatesPage.jsx** - Update management
   - Priority-based filtering
   - Timeline view
   - Bulk actions

3. **TimelinePage.jsx** - Gantt chart implementation
   - 4 view modes
   - Drag-and-drop functionality
   - Resource allocation

4. **ProcurementPage.jsx** - Complex workflow
   - 5-tab system
   - Approval chains
   - Vendor management

5. **MyWorkPage.jsx** - Personal dashboard
   - Task management
   - Analytics widgets
   - Calendar integration

## Common Hooks

### Authentication & Data
- `useAuth()` - User authentication context
- `useAuthenticatedData()` - API calls with demo fallback
- `useSocket()` - Socket.IO connection
- `useDebounce()` - Debounced values

### UI & Interactions
- `useDialogManager()` - Dialog state management
- `useGlobalSearch()` - Global search functionality
- `useMentionAutocomplete()` - @mention support

## Error Handling Patterns

### Frontend Error Boundaries
```javascript
import { DataErrorBoundary } from '../components/common/DataErrorBoundary';

<DataErrorBoundary>
  <YourComponent />
</DataErrorBoundary>
```

### Backend Error Handling
```javascript
// Use existing middleware
import { errorHandler } from '../middleware/errorHandler';

// In routes
try {
  // Your code
} catch (error) {
  console.error('Route error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}
```

## Real-time Features

### Socket.IO Events
```javascript
// Frontend
import { useSocket } from '../hooks/useSocket';
const socket = useSocket();
socket.on('project:update', handleUpdate);

// Backend
const io = req.app.locals.io;
io.to(`project:${projectId}`).emit('project:update', data);
```

## Testing Commands

```bash
# Frontend
cd formula-project-app
npm run lint          # ESLint check
npm run typecheck     # TypeScript validation
npm run test         # Run tests

# Backend
cd formula-project-app/backend
npm run lint         # ESLint check
npm test            # Run backend tests
```

## Common Pitfalls to Avoid

1. **Creating new Prisma instances** - Always use `app.locals.prisma`
2. **Using Material-UI icons** - Only iconoir-react allowed
3. **Skipping demo mode** - All features must work offline
4. **Ignoring CleanPageLayout** - All pages must use it
5. **Direct fetch() calls** - Use apiService or useAuthenticatedData
6. **Hardcoding URLs** - Use environment variables
7. **Missing error boundaries** - Wrap components appropriately
8. **Forgetting loading states** - Always show loading indicators
9. **Not checking existing code** - Study sophisticated pages first
10. **Creating duplicate functionality** - Search for existing implementations

## Demo Data Locations

- Frontend: `/src/services/demoDataService.js`
- Backend routes include demo responses
- Sophisticated pages have built-in demo data

## Quick Checks Before Completion

- [ ] Passes `npm run lint`
- [ ] Passes `npm run typecheck`
- [ ] Uses CleanPageLayout (for pages)
- [ ] Uses iconoir-react icons only
- [ ] Implements demo mode
- [ ] Handles loading states
- [ ] Has error boundaries
- [ ] Follows existing patterns
- [ ] Works with backend offline
- [ ] No console errors

Remember: When in doubt, check how it's done in InboxPage, UpdatesPage, or other sophisticated implementations!