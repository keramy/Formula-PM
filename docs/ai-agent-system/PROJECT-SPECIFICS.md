# Formula PM Project Specifics

## Known Gotchas

### Connection System
- The `connectionService.js` is core business logic - read-only
- Connections between scope items and drawings are managed through this service
- Don't implement direct relationships - always use the connection service

### Production Readiness
- Uses a specific analysis method via `analyzeScopeItemDependencies()`
- Don't assume dependencies between construction/millwork/MEP
- Production readiness rules are defined in the connection service

### Authentication
- Demo mode fallback implemented for development
- Uses JWT with RBAC in production
- Check permissions via `useAuth()` hook

### Icon Migration
- Project migrated from Material-UI icons to iconoir-react
- If you see import errors for icons, they likely need updating
- Use iconoir-react equivalents

## Architecture Decisions

### Service Layer
- All API calls go through `apiService`
- Don't create new service files - extend existing ones if needed
- Services handle error responses consistently

### State Management
- Local component state for UI
- Context for auth and global app state
- No Redux/MobX - keep it simple

### File Organization
- Feature-based structure under `/features`
- Shared components in `/components`
- Page components handle data loading and coordination

## Business Logic Notes

### Project Workflow
- Projects have scope items, shop drawings, and material specs
- These are connected through the connection service
- Workflow status is computed, not stored

### Permissions
- Role-based: admin, manager, user
- Project-specific permissions override roles
- Always check permissions for destructive actions

## Development Tips

1. **Check existing implementations** - Most patterns are already established
2. **Use the CleanPageLayout** for consistency across pages
3. **Handle loading states** - Users should always know what's happening
4. **Test with demo mode** - Faster than full auth flow during development

## Common API Endpoints

```javascript
// Projects
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id

// Scope Items
GET    /api/scope-items?projectId=X
POST   /api/scope-items
PUT    /api/scope-items/:id

// Shop Drawings
GET    /api/shop-drawings?projectId=X
POST   /api/shop-drawings
PUT    /api/shop-drawings/:id

// Connections
POST   /api/connections
DELETE /api/connections/:id
```