# Formula PM - Coding Standards

This document outlines the coding standards and best practices for the Formula PM project to ensure maintainable, high-quality code.

## Table of Contents

1. [General Principles](#general-principles)
2. [File Organization](#file-organization)
3. [Component Structure](#component-structure)
4. [Code Quality](#code-quality)
5. [Error Handling](#error-handling)
6. [Logging](#logging)
7. [Testing](#testing)
8. [Performance](#performance)
9. [Git Workflow](#git-workflow)

## General Principles

### 1. Single Responsibility Principle
- Each component should have one clear purpose
- Keep components under 500 lines
- Extract reusable logic into custom hooks
- Split large components into smaller, focused ones

### 2. DRY (Don't Repeat Yourself)
- Extract common functionality into utilities
- Use shared components for repeated UI patterns
- Create reusable hooks for common state logic

### 3. Clear Naming
- Use descriptive, self-documenting names
- Follow consistent naming conventions
- Avoid abbreviations unless commonly understood

## File Organization

### Directory Structure
```
src/
├── components/          # Shared UI components
├── features/           # Feature-specific components
│   └── [feature]/
│       ├── components/ # Feature components
│       ├── hooks/      # Feature hooks
│       └── services/   # Feature services
├── hooks/              # Shared hooks
├── services/           # Shared services
├── utils/              # Utility functions
├── context/            # React contexts
└── styles/             # Global styles
```

### File Naming
- Use PascalCase for React components: `MyComponent.jsx`
- Use camelCase for utilities and services: `apiService.js`
- Use kebab-case for directories: `my-feature`
- Include component type in filename: `UserDialog.jsx`, `useUser.js`

## Component Structure

### Component Template
```jsx
/**
 * Component description
 * @param {Object} props - Component props
 */
import React, { useState, useEffect } from 'react';
import { ComponentDependencies } from '@mui/material';
import logger from '../utils/logger';

const MyComponent = ({ 
  prop1, 
  prop2 = 'defaultValue',
  onAction 
}) => {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleAction = (event) => {
    logger.debug('Action triggered:', event);
    onAction?.(event);
  };
  
  // Early returns
  if (loading) return <LoadingSpinner />;
  
  // Main render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

### Component Guidelines
- Keep components under 100 lines when possible
- Extract complex logic into custom hooks
- Use meaningful prop names with clear types
- Include JSDoc comments for complex components
- Handle loading and error states explicitly

## Code Quality

### ESLint Rules
The project uses ESLint with the following key rules:
- `max-lines-per-function`: 100 lines maximum
- `complexity`: Maximum complexity of 10
- `no-console`: Warn for console.log (use logger instead)
- `prefer-const`: Use const for non-reassigned variables
- `no-unused-vars`: Warn about unused variables

### Code Style
```javascript
// ✅ Good
const userList = users.map((user) => ({
  id: user.id,
  name: user.fullName,
  isActive: user.status === 'active'
}));

// ❌ Bad
var userList = users.map(function(user) {
  return {
    id: user.id,
    name: user.fullName,
    isActive: user.status === 'active'
  }
})
```

### Destructuring
```javascript
// ✅ Good
const { name, email, isActive } = user;
const [first, second] = items;

// ❌ Bad
const name = user.name;
const email = user.email;
const isActive = user.isActive;
```

## Error Handling

### Error Boundaries
- Use Error Boundaries to catch React errors
- Provide meaningful fallback UI
- Log errors for debugging

```jsx
// Error Boundary Example
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Async Error Handling
```javascript
// ✅ Good
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await apiService.getData();
    setData(data);
  } catch (error) {
    logger.error('Failed to fetch data:', error);
    setError('Failed to load data. Please try again.');
  } finally {
    setLoading(false);
  }
};

// ❌ Bad
const fetchData = async () => {
  const data = await apiService.getData(); // No error handling
  setData(data);
};
```

## Logging

### Logger Usage
Use the centralized logger instead of console.log:

```javascript
import logger from '../utils/logger';

// ✅ Good
logger.debug('User action:', action);
logger.info('Data loaded successfully');
logger.warn('Deprecated function used');
logger.error('API call failed:', error);

// ❌ Bad
console.log('User action:', action);
console.log('Data loaded successfully');
```

### Log Levels
- `debug`: Development debugging (not shown in production)
- `info`: General information
- `warn`: Warning conditions
- `error`: Error conditions

## Testing

### Test Structure
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  const defaultProps = {
    prop1: 'value1',
    onAction: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<MyComponent {...defaultProps} />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    render(<MyComponent {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onAction).toHaveBeenCalled();
  });
});
```

### Testing Guidelines
- Write tests for all public component APIs
- Test user interactions, not implementation details
- Use meaningful test descriptions
- Keep tests focused and isolated

## Performance

### Optimization Guidelines
- Use `React.memo` for expensive components
- Implement `useMemo` and `useCallback` for expensive calculations
- Lazy load components when appropriate
- Optimize bundle size by avoiding unnecessary imports

```javascript
// ✅ Good - Memoized component
const ExpensiveComponent = React.memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);

  const handleAction = useCallback((item) => {
    onAction(item);
  }, [onAction]);

  return <div>{/* Component content */}</div>;
});

// ✅ Good - Lazy loading
const LazyComponent = React.lazy(() => import('./LazyComponent'));
```

## Git Workflow

### Commit Messages
Follow conventional commit format:
```
type(scope): description

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `style`: Code style changes
- `test`: Adding or updating tests
- `docs`: Documentation updates

### Pre-commit Checks
The following checks run automatically before each commit:
1. ESLint validation
2. Test execution
3. Build verification

### Branch Naming
- `feature/description`: New features
- `fix/description`: Bug fixes
- `refactor/description`: Code refactoring
- `chore/description`: Maintenance tasks

## Code Review Checklist

### Before Submitting PR
- [ ] All tests pass
- [ ] ESLint shows no errors
- [ ] Components are under 500 lines
- [ ] Functions are under 100 lines
- [ ] Proper error handling implemented
- [ ] Logger used instead of console.log
- [ ] Performance optimizations applied where needed
- [ ] Documentation updated if needed

### During Code Review
- [ ] Code follows established patterns
- [ ] Component responsibilities are clear
- [ ] Error handling is comprehensive
- [ ] Tests cover main functionality
- [ ] Performance implications considered
- [ ] Security implications considered

## Tools and Setup

### Required Tools
- ESLint with project configuration
- Vitest for testing
- Husky for git hooks
- Prettier for code formatting (recommended)

### IDE Setup
Recommended VS Code extensions:
- ESLint
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

### Package Scripts
```json
{
  "scripts": {
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Conclusion

These coding standards help maintain consistency, quality, and maintainability across the Formula PM codebase. When in doubt, prioritize:

1. **Readability** - Code should be easy to understand
2. **Maintainability** - Code should be easy to modify
3. **Performance** - Code should be efficient
4. **Security** - Code should be secure

For questions or suggestions about these standards, please create an issue or discuss in team meetings.