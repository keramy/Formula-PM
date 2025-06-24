# React Development Tips for Formula PM

## ⚛️ **React Component Creation Shortcuts**

### **1. VS Code Snippets for React**

Type these abbreviations and press Tab for instant code generation:

```javascript
// rafce → React Arrow Function Component Export
import React from 'react'

const ComponentName = () => {
  return (
    <div>
      
    </div>
  )
}

export default ComponentName

// rfc → React Functional Component
import React from 'react'

export default function ComponentName() {
  return (
    <div>
      
    </div>
  )
}

// useState → useState Hook
const [state, setState] = useState(initialState)

// useEffect → useEffect Hook
useEffect(() => {
  
}, [])

// useContext → useContext Hook
const context = useContext(ContextName)

// Custom hook snippet
const useCustomHook = () => {
  const [state, setState] = useState()
  
  return { state, setState }
}
```

### **2. Material-UI Specific Snippets**

Create custom snippets for Formula PM's Material-UI components:

```json
// VS Code Snippets (File > Preferences > User Snippets > javascriptreact.json)
{
  "Material UI Box": {
    "prefix": "muibox",
    "body": [
      "<Box sx={{ ${1:sx} }}>",
      "  $0",
      "</Box>"
    ]
  },
  
  "Material UI Card": {
    "prefix": "muicard",
    "body": [
      "<Card sx={{ ${1:p: 2} }}>",
      "  <CardContent>",
      "    <Typography variant=\"h6\" gutterBottom>",
      "      ${2:Title}",
      "    </Typography>",
      "    $0",
      "  </CardContent>",
      "</Card>"
    ]
  },
  
  "Formula Task Item": {
    "prefix": "ftask",
    "body": [
      "<Card sx={{ mb: 2 }}>",
      "  <CardContent>",
      "    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>",
      "      <Typography variant=\"h6\">${1:task.title}</Typography>",
      "      <Chip ",
      "        label={${2:task.status}} ",
      "        color={${3:getStatusColor(task.status)}}",
      "        size=\"small\"",
      "      />",
      "    </Box>",
      "    <Typography variant=\"body2\" color=\"text.secondary\" sx={{ mt: 1 }}>",
      "      ${4:task.description}",
      "    </Typography>",
      "  </CardContent>",
      "</Card>"
    ]
  }
}
```

### **3. Quick Component Templates**

```javascript
// Modal Component Template
const ModalTemplate = ({ open, onClose, title, children }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Form Component Template
const FormTemplate = ({ initialData, onSubmit, fields }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Render fields */}
    </Box>
  );
};

// List Component Template
const ListTemplate = ({ 
  items, 
  renderItem, 
  loading, 
  empty, 
  onLoadMore,
  hasMore 
}) => {
  if (loading && items.length === 0) {
    return <CircularProgress />;
  }

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          {empty || 'No items found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {items.map(renderItem)}
      {hasMore && (
        <Button onClick={onLoadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </Box>
  );
};
```

## 🪝 **React Hooks Best Practices**

### **1. Custom Hooks for Formula PM**

```javascript
// useFormulaAPI - Centralized API calls
const useFormulaAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callAPI = useCallback(async (apiFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { callAPI, loading, error };
};

// Usage
const TaskList = () => {
  const { callAPI, loading, error } = useFormulaAPI();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    const result = await callAPI(apiService.getTasks);
    setTasks(result);
  }, [callAPI]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    // Component JSX
  );
};

// useLocalStorage - Persist state
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// useDebounce - Delay API calls
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage in search
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Make API call
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <TextField
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};

// usePrevious - Compare with previous value
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// useToggle - Boolean state toggle
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, { toggle, setTrue, setFalse }];
};

// useForm - Form state management
const useForm = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const setTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = values[field];
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = `${field} is required`;
      } else if (rule.minLength && value && value.length < rule.minLength) {
        newErrors[field] = `${field} must be at least ${rule.minLength} characters`;
      } else if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[field] = rule.message || `${field} format is invalid`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};
```

### **2. Performance Optimization Hooks**

```javascript
// useMemo examples for Formula PM
const TaskStats = ({ tasks }) => {
  // Expensive calculation - only recalculate when tasks change
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const overdue = tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length;
    
    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [tasks]);

  return (
    <Box>
      <Typography>Total: {taskStats.total}</Typography>
      <Typography>Completed: {taskStats.completed}</Typography>
      <Typography>In Progress: {taskStats.inProgress}</Typography>
      <Typography>Overdue: {taskStats.overdue}</Typography>
      <Typography>Completion Rate: {taskStats.completionRate}%</Typography>
    </Box>
  );
};

// useCallback for event handlers
const TaskList = ({ onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);

  // Memoize callback to prevent child re-renders
  const handleTaskStatusChange = useCallback((taskId, newStatus) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    onTaskUpdate?.(taskId, newStatus);
  }, [onTaskUpdate]);

  const handleTaskDelete = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  return (
    <Box>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={handleTaskStatusChange}
          onDelete={handleTaskDelete}
        />
      ))}
    </Box>
  );
};

// React.memo for expensive components
const ExpensiveTaskCard = React.memo(({ task, onUpdate }) => {
  console.log('Rendering TaskCard for:', task.id);
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2">{task.description}</Typography>
        {/* Complex rendering logic */}
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.updatedAt === nextProps.task.updatedAt
  );
});
```

### **3. Error Handling Patterns**

```javascript
// useErrorHandler - Centralized error handling
const useErrorHandler = () => {
  const showError = useCallback((error, context = '') => {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    
    // Show user-friendly message
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // You could integrate with a toast notification system here
    alert(`Error: ${message}`);
  }, []);

  return { showError };
};

// useAsyncOperation - Handle loading and errors
const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useErrorHandler();

  const execute = useCallback(async (asyncFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction(...args);
      return result;
    } catch (err) {
      setError(err);
      showError(err, 'Async Operation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  return { loading, error, execute };
};

// Usage
const ProjectForm = () => {
  const { loading, error, execute } = useAsyncOperation();
  
  const handleSubmit = async (formData) => {
    await execute(apiService.createProject, formData);
    // Success handling
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button 
        type="submit" 
        disabled={loading}
        startIcon={loading && <CircularProgress size={16} />}
      >
        {loading ? 'Creating...' : 'Create Project'}
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error.message}
        </Alert>
      )}
    </form>
  );
};
```

## 🎨 **Component Patterns**

### **1. Compound Components Pattern**

```javascript
// Modal compound component
const Modal = ({ open, onClose, children }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {children}
    </Dialog>
  );
};

Modal.Header = ({ children }) => (
  <DialogTitle>{children}</DialogTitle>
);

Modal.Body = ({ children }) => (
  <DialogContent>{children}</DialogContent>
);

Modal.Footer = ({ children }) => (
  <DialogActions>{children}</DialogActions>
);

// Usage
const TaskModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Modal.Header>Create New Task</Modal.Header>
      <Modal.Body>
        <TaskForm />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="contained">Save</Button>
      </Modal.Footer>
    </Modal>
  );
};
```

### **2. Render Props Pattern**

```javascript
// Data fetcher with render props
const DataFetcher = ({ url, children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return children({ data, loading, error });
};

// Usage
const TaskList = () => (
  <DataFetcher url="/api/tasks">
    {({ data: tasks, loading, error }) => {
      if (loading) return <CircularProgress />;
      if (error) return <Alert severity="error">{error.message}</Alert>;
      
      return (
        <Box>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </Box>
      );
    }}
  </DataFetcher>
);
```

### **3. Higher-Order Components (HOCs)**

```javascript
// withLoading HOC
const withLoading = (Component) => {
  return function WithLoadingComponent({ loading, ...props }) {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    return <Component {...props} />;
  };
};

// withErrorBoundary HOC
const withErrorBoundary = (Component) => {
  return function WithErrorBoundaryComponent(props) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Usage
const TaskList = withErrorBoundary(withLoading(({ tasks }) => (
  <Box>
    {tasks.map(task => (
      <TaskCard key={task.id} task={task} />
    ))}
  </Box>
)));

// Enhanced usage
const EnhancedTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <TaskList 
      tasks={tasks} 
      loading={loading} 
    />
  );
};
```

## 🚀 **Performance Optimization**

### **1. Component Splitting**

```javascript
// Code splitting with React.lazy
const ProjectDetails = React.lazy(() => import('./ProjectDetails'));
const TaskBoard = React.lazy(() => import('./TaskBoard'));
const ReportsPage = React.lazy(() => import('./ReportsPage'));

// Usage with Suspense
const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/tasks" element={<TaskBoard />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

// Preload components
const preloadComponent = (componentImport) => {
  componentImport();
};

// Preload on hover
const NavLink = ({ to, children, preload }) => {
  return (
    <Link 
      to={to}
      onMouseEnter={() => preload && preloadComponent(preload)}
    >
      {children}
    </Link>
  );
};

// Usage
<NavLink 
  to="/reports" 
  preload={() => import('./ReportsPage')}
>
  Reports
</NavLink>
```

### **2. List Virtualization**

```javascript
// Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualTaskList = ({ tasks }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <TaskCard task={tasks[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={tasks.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### **3. Memoization Strategies**

```javascript
// Memoize expensive calculations
const ProjectDashboard = ({ projects }) => {
  const dashboardData = useMemo(() => {
    // Expensive calculation
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const completedProjects = projects.filter(p => p.status === 'completed');
    const avgCompletion = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;
    
    return {
      totalBudget,
      completedProjects: completedProjects.length,
      avgCompletion: Math.round(avgCompletion)
    };
  }, [projects]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <StatCard title="Total Budget" value={`$${dashboardData.totalBudget.toLocaleString()}`} />
      </Grid>
      <Grid item xs={4}>
        <StatCard title="Completed" value={dashboardData.completedProjects} />
      </Grid>
      <Grid item xs={4}>
        <StatCard title="Avg Completion" value={`${dashboardData.avgCompletion}%`} />
      </Grid>
    </Grid>
  );
};
```

## 🔧 **Common Patterns & Solutions**

### **1. Conditional Rendering**

```javascript
// Different ways to conditionally render
const TaskStatus = ({ task }) => {
  // 1. Ternary operator
  return (
    <Chip 
      label={task.status} 
      color={task.status === 'completed' ? 'success' : 'default'}
    />
  );
  
  // 2. Logical AND
  return (
    <Box>
      {task.dueDate && <Typography>Due: {task.dueDate}</Typography>}
      {task.isOverdue && <Alert severity="warning">Overdue!</Alert>}
    </Box>
  );
  
  // 3. Switch statement in function
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in_progress':
        return <ProgressIcon color="primary" />;
      case 'todo':
        return <RadioButtonUncheckedIcon color="disabled" />;
      default:
        return null;
    }
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {getStatusIcon()}
      <Typography sx={{ ml: 1 }}>{task.title}</Typography>
    </Box>
  );
};
```

### **2. Event Handling**

```javascript
// Event handling best practices
const TaskForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({});

  // Prevent default and handle submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(formData);
  }, [formData, onSubmit]);

  // Generic change handler
  const handleChange = useCallback((field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Handle file uploads
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, attachment: file }));
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title"
        value={formData.title || ''}
        onChange={handleChange('title')}
      />
      <TextField
        label="Description"
        multiline
        rows={4}
        value={formData.description || ''}
        onChange={handleChange('description')}
      />
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

### **3. State Management Patterns**

```javascript
// Reducer pattern for complex state
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        loading: false
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        )
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload.id)
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    default:
      return state;
  }
};

// Usage
const TaskManager = () => {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    loading: false,
    error: null
  });

  const addTask = useCallback((task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  }, []);

  const updateTask = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  }, []);

  return (
    // Component JSX using state and dispatch functions
  );
};
```

Remember: These patterns are tools to help you write better React code. Choose the ones that fit your specific use case and team preferences!