# Hook Extraction Migration Guide

This guide explains the custom hooks that were extracted from App.js to improve maintainability and performance.

## Overview

The refactoring extracted state management and business logic from App.js into four modular hooks:

1. **useAppState** - All state management logic
2. **useDialogManager** - Dialog state and operations
3. **useAppHandlers** - Event handlers and business logic
4. **useAppInitialization** - App initialization logic

## Hook Details

### 1. useAppState.js
**Purpose**: Centralizes all application state management

**What it contains**:
- Dialog state management
- Navigation state (currentPage, currentFormData)
- View mode states (projectsViewMode, tasksViewMode, etc.)
- Filter states and search terms
- Integration with useAuthenticatedData and useEnhancedSearch

**Key exports**:
```javascript
{
  // Core data
  projects, tasks, teamMembers, clients,
  loading, error, stats,
  
  // Dialog state
  dialogState, updateDialogState,
  
  // Navigation
  currentPage, setCurrentPage, navigateToMain,
  
  // View modes
  projectsViewMode, setProjectsViewMode,
  
  // Filters
  projectsFilters, setProjectsFilters,
  filteredProjects, activeFilters
}
```

### 2. useDialogManager.js
**Purpose**: Manages all dialog operations

**What it contains**:
- Consolidated dialog state
- Helper functions for opening/closing dialogs
- Dialog-specific actions for each entity type

**Key exports**:
```javascript
{
  dialogState,
  updateDialogState,
  
  // Project dialogs
  openEditProjectDialog,
  closeEditProjectDialog,
  
  // Task dialogs
  openViewTaskDialog,
  closeViewTaskDialog,
  
  // And more...
}
```

### 3. useAppHandlers.js
**Purpose**: Contains all event handlers and business logic

**What it contains**:
- CRUD operations for all entities
- Navigation handlers
- Search and filter handlers
- View mode change handlers
- Export functionality

**Key exports**:
```javascript
{
  // Project handlers
  handleAddProject,
  handleUpdateProject,
  handleDeleteProject,
  
  // Task handlers
  handleAddTask,
  updateTaskStatus,
  
  // Navigation
  handleNavigateToProject,
  
  // And more...
}
```

### 4. useAppInitialization.js
**Purpose**: Handles app initialization

**What it contains**:
- Performance monitoring setup
- Notification service initialization
- Browser notification permission requests
- Performance warning in development

**Key exports**:
```javascript
{
  isInitialized,
  performanceMonitor,
  notificationService
}
```

## Migration Steps

1. **Replace the existing App.js** with App.refactored.js:
   ```bash
   mv src/app/App.js src/app/App.original.js
   mv src/app/App.refactored.js src/app/App.js
   ```

2. **Update imports** in any components that directly imported from App.js

3. **Test thoroughly** - The refactored version maintains the same functionality

## Benefits

1. **Better Performance**: Reduced re-renders through proper hook separation
2. **Improved Maintainability**: Logic is organized by concern
3. **Easier Testing**: Each hook can be tested independently
4. **Better Code Reuse**: Hooks can be used in other components
5. **Cleaner App.js**: From 1390 lines to ~600 lines

## Breaking Changes

None - The refactoring maintains full backward compatibility. All functionality remains the same.

## Future Improvements

1. Consider splitting useAppHandlers into smaller, feature-specific hooks
2. Add TypeScript definitions for better type safety
3. Implement custom hook testing
4. Consider using useReducer for complex state management in useAppState