# Phase 2: Data Management & Caching - Migration Guide

## Overview

Phase 2 introduces React Query for advanced caching, enhanced search with debouncing, and comprehensive data validation. This guide explains how to migrate existing components to use the new system.

## What's New

### ✅ React Query Integration
- **Smart Caching**: 5-minute stale time, 10-minute cache time
- **Automatic Retries**: Failed requests retry 3 times with exponential backoff
- **Background Updates**: Data refreshes on window focus and reconnect
- **Optimistic Updates**: UI updates immediately, reverts on error

### ✅ Enhanced Search & Filtering
- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Multi-source Search**: Search across projects, tasks, team members, and clients
- **Smart Suggestions**: Auto-complete based on existing data
- **Search History**: Remembers last 10 searches
- **Saved Searches**: Save and reuse complex filter combinations

### ✅ Data Validation
- **Yup Schemas**: Comprehensive validation for all data types
- **Real-time Validation**: Validate fields as user types
- **Custom Rules**: Unique emails, no cyclic dependencies, etc.
- **File Upload Validation**: Size and type checking

## Migration Steps

### Step 1: Replace `useFormulaData` Hook

**Before (Old System):**
```javascript
import { useFormulaData } from '../hooks/useFormula';

const MyComponent = () => {
  const {
    projects,
    tasks,
    teamMembers,
    clients,
    loading,
    error,
    setProjects,
    setTasks
  } = useFormulaData();
  
  // Component logic...
};
```

**After (New System):**
```javascript
import { useQueryMigration } from '../hooks/useQueryMigration';
// OR use individual hooks for better performance
import { useProjects, useTasks } from '../hooks/useFormulaQuery';

const MyComponent = () => {
  const {
    projects,
    tasks,
    teamMembers,
    clients,
    loading,
    error,
    search, // New enhanced search
    refetch // New: manual refetch capabilities
  } = useQueryMigration();
  
  // Component logic...
};
```

### Step 2: Update Data Mutations

**Before (Old System):**
```javascript
const addProject = async (project) => {
  try {
    const newProject = await apiService.createProject(project);
    setProjects([...projects, newProject]);
  } catch (error) {
    setError('Failed to create project');
  }
};
```

**After (New System):**
```javascript
import { useCreateProject } from '../hooks/useFormulaQuery';

const MyComponent = () => {
  const createProjectMutation = useCreateProject({
    onSuccess: (newProject) => {
      console.log('Project created:', newProject);
      // No need to manually update state - React Query handles it
    },
    onError: (error) => {
      console.error('Failed to create project:', error);
      // Error handling is automatic, but you can add custom logic
    }
  });
  
  const addProject = async (project) => {
    createProjectMutation.mutate(project);
  };
  
  // Access mutation state
  const { isLoading, error } = createProjectMutation;
};
```

### Step 3: Implement Enhanced Search

**Before (Old System):**
```javascript
const [searchTerm, setSearchTerm] = useState('');
const [filteredProjects, setFilteredProjects] = useState([]);

useEffect(() => {
  const filtered = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredProjects(filtered);
}, [projects, searchTerm]);
```

**After (New System):**
```javascript
import { useProjectSearch } from '../hooks/useEnhancedSearch';

const MyComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    client: ''
  });
  
  // Automatic debouncing and smart filtering
  const filteredProjects = useProjectSearch(projects, searchTerm, filters);
  
  // Or use the comprehensive search hook
  const {
    searchTerm: globalSearchTerm,
    setSearchTerm: setGlobalSearchTerm,
    searchResults,
    suggestions,
    quickFilters
  } = useEnhancedSearch(projects, tasks, teamMembers, clients);
};
```

### Step 4: Add Form Validation

**Before (Old System):**
```javascript
const ProjectForm = ({ onSubmit }) => {
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (data) => {
    const newErrors = {};
    if (!data.name) newErrors.name = 'Name is required';
    if (!data.clientId) newErrors.clientId = 'Client is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(data);
  };
};
```

**After (New System):**
```javascript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createProjectSchema } from '../services/validation/schemas';

const ProjectForm = ({ onSubmit, projects, clients }) => {
  const schema = createProjectSchema(projects, clients);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange' // Validate as user types
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Project Name"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />
      {/* Other fields... */}
    </form>
  );
};
```

## Performance Improvements

### Automatic Caching
```javascript
// Data is automatically cached and shared across components
const ProjectDetails = ({ projectId }) => {
  const { data: project } = useProject(projectId); // Cached
  // Component renders immediately if data is in cache
};

const ProjectList = () => {
  const { data: projects } = useProjects(); // Same cache
  // No duplicate API calls
};
```

### Background Updates
```javascript
// Data automatically updates when user returns to tab
const Dashboard = () => {
  const { data: stats } = useStats();
  // Data refreshes when window regains focus
  // User always sees fresh data without manual refresh
};
```

### Optimistic Updates
```javascript
const TaskCard = ({ task }) => {
  const updateTaskMutation = useOptimisticTaskUpdate();
  
  const handleStatusChange = (newStatus) => {
    // UI updates immediately
    updateTaskMutation.mutate({
      id: task.id,
      status: newStatus
    });
    // If API call fails, UI automatically reverts
  };
};
```

## Error Handling

### Automatic Error Recovery
```javascript
// React Query automatically retries failed requests
const { data, error, isLoading, refetch } = useProjects();

if (error) {
  return (
    <Alert severity="error">
      Failed to load projects. 
      <Button onClick={() => refetch()}>Try Again</Button>
    </Alert>
  );
}
```

### Global Error Handling
```javascript
// Configured in queryClient.js
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        if (error.status === 401) {
          // Redirect to login
        } else if (error.status >= 500) {
          // Show server error message
        }
      }
    }
  }
});
```

## Development Tools

### React Query DevTools
- Automatically enabled in development mode
- Inspect cache contents and query states
- Debug performance issues
- Monitor network requests

### Enhanced Console Logging
```javascript
// Development mode shows detailed query information
console.log('Query projects completed successfully', {
  dataSize: JSON.stringify(data).length,
  cacheHit: query.state.dataUpdatedAt > 0,
});
```

## Best Practices

### 1. Use Specific Hooks When Possible
```javascript
// Good: Only fetch what you need
const { data: projects } = useProjects();
const { data: tasks } = useTasksByProject(projectId);

// Avoid: Fetching everything when you only need projects
const { projects, tasks, teamMembers, clients } = useQueryMigration();
```

### 2. Leverage Optimistic Updates for Better UX
```javascript
const TaskStatus = ({ task }) => {
  const updateTaskMutation = useOptimisticTaskUpdate();
  
  const handleStatusChange = (status) => {
    // UI updates immediately, providing instant feedback
    updateTaskMutation.mutate({ id: task.id, status });
  };
};
```

### 3. Use Prefetching for Anticipated Data
```javascript
import { prefetchQueries } from '../services/queryClient';

const ProjectCard = ({ project }) => {
  const handleMouseEnter = () => {
    // Prefetch project details when user hovers
    prefetchQueries.project(project.id);
  };
  
  return <Card onMouseEnter={handleMouseEnter}>...</Card>;
};
```

### 4. Implement Smart Search UX
```javascript
const SearchBar = () => {
  const {
    searchTerm,
    setSearchTerm,
    suggestions,
    quickFilters,
    isSearching
  } = useEnhancedSearch();
  
  return (
    <Autocomplete
      options={suggestions}
      loading={isSearching}
      renderInput={(params) => (
        <TextField
          {...params}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search projects, tasks, team members..."
        />
      )}
    />
  );
};
```

## Migration Checklist

### For Each Component:
- [ ] Replace `useFormulaData` with `useQueryMigration` or specific hooks
- [ ] Update data mutations to use React Query mutations
- [ ] Remove manual state management for server data
- [ ] Add loading and error states
- [ ] Implement enhanced search if applicable
- [ ] Add form validation if forms are present
- [ ] Test optimistic updates work correctly
- [ ] Verify error handling works as expected

### For the Application:
- [ ] Wrap App in QueryClientProvider
- [ ] Configure error boundaries for query errors
- [ ] Set up global error handling
- [ ] Enable React Query DevTools in development
- [ ] Test offline/online behavior
- [ ] Verify cache invalidation works correctly
- [ ] Performance test with React DevTools Profiler

## Expected Results

After migration, you should see:

### Performance Improvements
- **40-60% reduction in API calls** due to intelligent caching
- **Faster perceived performance** with optimistic updates
- **Better offline experience** with cached data
- **Reduced loading states** for previously loaded data

### User Experience Improvements
- **Instant search results** with debouncing
- **Smart search suggestions** based on existing data
- **Better error recovery** with automatic retries
- **Real-time form validation** with helpful error messages

### Developer Experience Improvements
- **Simpler state management** - React Query handles server state
- **Better debugging** with React Query DevTools
- **Type safety** with comprehensive validation schemas
- **Easier testing** with predictable query states

## Troubleshooting

### Common Issues

1. **"Query data is undefined"**
   ```javascript
   // Use default values and loading states
   const { data: projects = [], isLoading } = useProjects();
   
   if (isLoading) return <LoadingSkeleton />;
   ```

2. **"Cache not updating after mutation"**
   ```javascript
   // Ensure you're using the correct mutation hooks
   const createProjectMutation = useCreateProject({
     onSuccess: () => {
       // Cache is automatically updated
       queryClient.invalidateQueries(['projects']);
     }
   });
   ```

3. **"Search is too slow"**
   ```javascript
   // Use debounced search
   const debouncedSearchTerm = useDebounce(searchTerm, 300);
   const results = useProjectSearch(projects, debouncedSearchTerm, filters);
   ```

The new system provides a solid foundation for scaling the application while significantly improving performance and user experience.