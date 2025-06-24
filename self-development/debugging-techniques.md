# Debugging Techniques for Formula PM Development

## 🐛 **Console.log Best Practices**

### **1. Enhanced Console Methods**

```javascript
// Basic console methods ranked by usefulness
console.log('Basic message');              // Standard logging
console.error('Error message');            // Red, for errors
console.warn('Warning message');           // Yellow, for warnings
console.info('Info message');              // Blue, for information
console.debug('Debug message');            // Verbose debugging

// Advanced console methods
console.table(data);                       // Display arrays/objects as table
console.time('operation');                 // Start timer
console.timeEnd('operation');              // End timer and show duration
console.group('Group Name');               // Start collapsible group
console.groupEnd();                        // End group
console.assert(condition, 'Message');      // Log only if condition is false
console.trace();                           // Show stack trace
console.clear();                           // Clear console
```

### **2. Smart Console.log Techniques**

```javascript
// 1. Object Property Shorthand - Shows variable names
const user = { name: 'John', age: 30 };
const project = { title: 'Construction', status: 'active' };

// ❌ Bad - No context
console.log(user);
console.log(project);

// ✅ Good - Shows variable names
console.log({ user, project });
// Output: { user: {...}, project: {...} }

// 2. Styled Console Output
console.log(
  '%c Important Message! ',
  'background: #f44336; color: white; font-size: 16px; padding: 5px;'
);

// Multiple styles
console.log(
  '%cError%c: %cSomething went wrong',
  'background: red; color: white; padding: 2px 5px;',
  '',
  'color: red; font-weight: bold;'
);

// 3. Conditional Logging
const DEBUG = true;
DEBUG && console.log('Debug info:', data);

// Or create a debug function
const debug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG]', ...args);
  }
};

// 4. Console.table for Arrays and Objects
const tasks = [
  { id: 1, title: 'Task 1', status: 'todo' },
  { id: 2, title: 'Task 2', status: 'done' },
  { id: 3, title: 'Task 3', status: 'in-progress' }
];
console.table(tasks);
// Shows a beautiful table in console!

// 5. Timing Operations
console.time('API Call');
await fetch('/api/tasks');
console.timeEnd('API Call');
// Output: API Call: 145.23ms

// 6. Grouping Related Logs
console.group('User Authentication');
console.log('Checking credentials...');
console.log('Token validated');
console.log('User authorized');
console.groupEnd();

// 7. Stack Trace for Debugging
function problematicFunction() {
  console.trace('Trace problematic function');
}

// 8. Memory Usage
console.log('Memory:', performance.memory);
```

### **3. Console.log Alternatives**

```javascript
// Use debugger statement
function complexFunction(data) {
  debugger; // Pauses execution here
  return data.map(item => item.value);
}

// Breakpoint logging without console.log
const logPoint = (label, value) => {
  // This won't appear in production
  if (process.env.NODE_ENV === 'development') {
    const element = document.createElement('div');
    element.textContent = `${label}: ${JSON.stringify(value)}`;
    element.style.cssText = 'position: fixed; top: 0; right: 0; background: yellow; padding: 10px; z-index: 9999;';
    document.body.appendChild(element);
    setTimeout(() => element.remove(), 3000);
  }
  return value;
};

// Use in code:
const result = logPoint('API Response', await fetchData());
```

## 🔧 **VS Code Debugger Configuration**

### **1. Launch Configuration**

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      // Debug React app in Chrome
      "type": "chrome",
      "request": "launch",
      "name": "Debug React in Chrome",
      "url": "http://localhost:3003",
      "webRoot": "${workspaceFolder}/formula-project-app/src",
      "sourceMaps": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      // Debug Node.js backend
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "program": "${workspaceFolder}/formula-backend/src/server.js",
      "envFile": "${workspaceFolder}/formula-backend/.env.development",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      // Attach to running Node process
      "type": "node",
      "request": "attach",
      "name": "Attach to Backend",
      "port": 9229,
      "restart": true,
      "skipFiles": [
        "<node_internals>/**"
      ]
    },
    {
      // Debug specific test file
      "type": "node",
      "request": "launch",
      "name": "Debug Current Test",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": [
        "${fileBasename}",
        "--runInBand",
        "--no-cache",
        "--watchAll=false"
      ],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ],
  "compounds": [
    {
      // Debug both frontend and backend together
      "name": "Full Stack Debug",
      "configurations": ["Debug React in Chrome", "Debug Backend"],
      "stopAll": true
    }
  ]
}
```

### **2. Debugging Node.js Backend**

```javascript
// Start backend in debug mode
// package.json
{
  "scripts": {
    "debug": "node --inspect src/server.js",
    "debug-brk": "node --inspect-brk src/server.js"
  }
}

// Add breakpoints in code
function calculateProjectProgress(tasks) {
  // Click on line number in VS Code to add breakpoint
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const progress = (completedTasks.length / tasks.length) * 100;
  return Math.round(progress);
}

// Conditional breakpoints (right-click on breakpoint)
// Condition: tasks.length > 10
// Hit count: Break on 5th hit
// Log message: "Tasks count: {tasks.length}"
```

### **3. Debugging React Components**

```javascript
// Using React Developer Tools programmatically
// In component:
useEffect(() => {
  // Expose component to global scope for debugging
  if (process.env.NODE_ENV === 'development') {
    window.__MY_COMPONENT__ = {
      props,
      state: { formData, errors, loading }
    };
  }
}, [props, formData, errors, loading]);

// In browser console:
// > window.__MY_COMPONENT__
// See all props and state!

// Using debugger statement
const handleSubmit = (e) => {
  e.preventDefault();
  debugger; // Execution pauses here
  
  if (!validateForm()) {
    return;
  }
  
  submitForm(formData);
};
```

## 🌐 **Chrome DevTools Tips**

### **1. Essential DevTools Panels**

```javascript
// Elements Panel
// - Right-click element → Break on → Subtree modifications
// - Track DOM changes

// Console Panel Shortcuts
$_                    // Last evaluated expression
$0                    // Currently selected element
$1-$4                 // Previously selected elements
$('selector')         // document.querySelector
$$('selector')        // document.querySelectorAll
copy(object)          // Copy to clipboard
monitor(fn)           // Log function calls
unmonitor(fn)         // Stop logging
getEventListeners($0) // See element's event listeners

// Sources Panel
// - Cmd/Ctrl + P: Quick file open
// - Cmd/Ctrl + Shift + P: Command menu
// - Add folder to workspace for editing

// Network Panel
// - Right-click → Copy → Copy as fetch
// - Throttling to test slow connections
// - Block specific requests

// Performance Panel
// - Record user interactions
// - Analyze render performance
// - Find performance bottlenecks
```

### **2. Advanced Console Commands**

```javascript
// Live expressions (pin to top of console)
// Click "eye" icon → Add expression
performance.memory.usedJSHeapSize / 1048576  // Monitor memory in MB

// Console API extras
console.profile('MyProfile');        // Start CPU profile
// ... code to profile ...
console.profileEnd('MyProfile');     // End profile

// Copying complex objects
copy(JSON.parse(JSON.stringify(complexObject)));

// Quick jQuery-like selection (even without jQuery)
$$('.task-item').map(el => el.textContent);

// Monitor function calls
function addTask(task) {
  // Implementation
}
monitor(addTask);  // Now logs all calls to addTask

// Break on property access
const obj = { name: 'Test' };
Object.defineProperty(obj, 'name', {
  get() {
    debugger;  // Break when accessed
    return this._name;
  },
  set(value) {
    debugger;  // Break when set
    this._name = value;
  }
});
```

### **3. Network Debugging**

```javascript
// Intercept and modify requests
// In Console:
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch called:', args);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('Response:', response);
      return response;
    });
};

// Log all API calls
const trackAPICalls = () => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
        console.log(`API Call: ${entry.name} - Duration: ${entry.duration}ms`);
      }
    }
  });
  observer.observe({ entryTypes: ['resource'] });
};
```

## 🔍 **React Developer Tools Usage**

### **1. Component Inspection**

```javascript
// Accessing React DevTools from code
// Install React DevTools browser extension first

// In your component:
const MyComponent = () => {
  // Access component in React DevTools
  React.useDebugValue('MyComponent Debug Info');
  
  const [state, setState] = useState(initialState);
  
  // Custom hook debugging
  React.useDebugValue(state, state => `State: ${JSON.stringify(state)}`);
  
  return <div>Component</div>;
};

// Custom DevTools hook
function useCustomHook(value) {
  React.useDebugValue(value ? 'Active' : 'Inactive');
  // Hook logic
}
```

### **2. Profiler API**

```javascript
import { Profiler } from 'react';

function onRenderCallback(
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update"
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions // the Set of interactions belonging to this update
) {
  console.log(`Component ${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="TaskList" onRender={onRenderCallback}>
  <TaskList />
</Profiler>
```

### **3. React DevTools Console Commands**

```javascript
// After selecting component in React DevTools:
$r                    // Currently selected component instance
$r.props             // Component props
$r.state             // Component state (class components)
$r.setState({...})   // Modify state (class components)

// Find components
Array.from(document.querySelectorAll('[class*="Task"]'))
  .map(el => el._reactInternalFiber);

// Track re-renders
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    logOwnerReasons: true
  });
}
```

## 🛠️ **Debugging Strategies**

### **1. Binary Search Debugging**

```javascript
// When you don't know where the bug is:
function complexProcess(data) {
  console.log('Step 1: Input', data);
  
  const transformed = transformData(data);
  console.log('Step 2: Transformed', transformed);
  
  const filtered = filterData(transformed);
  console.log('Step 3: Filtered', filtered);
  
  const result = calculateResult(filtered);
  console.log('Step 4: Result', result);
  
  return result;
}

// Comment out half the code to isolate the issue
// Repeat until you find the problematic section
```

### **2. Rubber Duck Debugging**

```javascript
// Explain your code line by line (to a rubber duck or in comments)
function calculateDiscount(price, userType) {
  // First, I check if the price is valid
  if (!price || price < 0) {
    return 0;  // Wait, should this return 0 or throw an error?
  }
  
  // Then I check the user type
  let discount = 0;
  switch(userType) {
    case 'premium':
      discount = 0.2;  // 20% discount
      break;
    case 'regular':
      discount = 0.1;  // 10% discount
      break;
    // Oh! I forgot the default case!
    default:
      discount = 0;
  }
  
  return price * discount;  // Wait, this returns the discount amount, not the final price!
}
```

### **3. State Debugging Pattern**

```javascript
// Create a debug version of setState
const useDebugState = (initialState, name) => {
  const [state, setState] = useState(initialState);
  
  const setDebugState = (newState) => {
    console.group(`State Update: ${name}`);
    console.log('Previous:', state);
    console.log('New:', newState);
    console.log('Stack trace:');
    console.trace();
    console.groupEnd();
    
    setState(newState);
  };
  
  return [state, setDebugState];
};

// Usage:
const [user, setUser] = useDebugState(null, 'user');
```

### **4. Error Boundary Debugging**

```javascript
class DebugErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.group('🔴 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
    
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: '#ffebee' }}>
          <h2>Something went wrong!</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Error Details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 📊 **Performance Debugging**

### **1. React Performance Measurement**

```javascript
// Measure component render time
const measurePerformance = (Component) => {
  return function MeasuredComponent(props) {
    const renderStart = performance.now();
    
    useEffect(() => {
      const renderEnd = performance.now();
      console.log(
        `${Component.name} render time: ${(renderEnd - renderStart).toFixed(2)}ms`
      );
    });
    
    return <Component {...props} />;
  };
};

// Usage:
const MeasuredTaskList = measurePerformance(TaskList);
```

### **2. Memory Leak Detection**

```javascript
// Track component instances
const activeComponents = new Set();

const useMemoryLeakDetection = (componentName) => {
  useEffect(() => {
    const id = `${componentName}-${Date.now()}`;
    activeComponents.add(id);
    console.log(`Component mounted: ${id}, Total: ${activeComponents.size}`);
    
    return () => {
      activeComponents.delete(id);
      console.log(`Component unmounted: ${id}, Total: ${activeComponents.size}`);
    };
  }, [componentName]);
};
```

## 🔧 **Common Debugging Scenarios**

### **1. API Call Debugging**

```javascript
// Intercept and log all API calls
const debugApi = {
  async get(url) {
    console.group(`GET ${url}`);
    console.time('Duration');
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Status:', response.status);
      console.log('Response:', data);
      console.timeEnd('Duration');
      console.groupEnd();
      
      return data;
    } catch (error) {
      console.error('Error:', error);
      console.timeEnd('Duration');
      console.groupEnd();
      throw error;
    }
  }
};
```

### **2. State Update Debugging**

```javascript
// Track why state updates happen
const useWhyDidYouUpdate = (name, props) => {
  const previousProps = useRef();
  
  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps = {};
      
      allKeys.forEach(key => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key]
          };
        }
      });
      
      if (Object.keys(changedProps).length) {
        console.log('[why-did-you-update]', name, changedProps);
      }
    }
    
    previousProps.current = props;
  });
};
```

Remember: The best debugging technique is the one that helps you find and fix the bug quickly. Don't hesitate to use multiple approaches!