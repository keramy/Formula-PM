import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Stack,
  Chip,
  Container,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Home as HomeIcon,
  ArrowLeft as BackIcon,
  HelpCircle as HelpIcon,
  WarningTriangle as WarningIcon
} from 'iconoir-react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Route-specific error boundary with intelligent fallback behaviors
 * Provides context-aware error messages and recovery options
 */
class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0,
      lastErrorTime: null
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      lastErrorTime: Date.now()
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route Error Boundary caught error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Enhanced error tracking
    this.trackError(error, errorInfo);
  }

  // Track errors for analytics and debugging
  trackError = (error, errorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      route: this.props.route || window.location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      retryCount: this.state.retryCount
    };

    // Log to console in development
    if (import.meta.env.MODE === 'development') {
      console.group('🔥 Route Error Boundary - Error Details');
      console.error('Route:', errorData.route);
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Retry Count:', this.state.retryCount);
      console.groupEnd();
    }

    // Send to error tracking service (implement based on your service)
    this.reportError(errorData);
  };

  // Report error to external service
  reportError = (errorData) => {
    // Implement error reporting to your preferred service
    // Examples: Sentry, LogRocket, Bugsnag, etc.
    
    try {
      // For now, store in localStorage for debugging
      const errors = JSON.parse(localStorage.getItem('route_errors') || '[]');
      errors.push(errorData);
      // Keep only last 10 errors
      if (errors.length > 10) {
        errors.splice(0, errors.length - 10);
      }
      localStorage.setItem('route_errors', JSON.stringify(errors));
    } catch (e) {
      console.warn('Failed to store error data:', e);
    }
  };

  // Determine error severity and type
  getErrorContext = () => {
    const error = this.state.error;
    const route = this.props.route || window.location.pathname;
    
    // Categorize by route
    const isCriticalRoute = ['/dashboard', '/projects', '/tasks'].includes(route);
    const isDataRoute = route.includes('material-specs') || route.includes('shop-drawings');
    const isFormRoute = route.includes('form') || route.includes('edit');
    
    // Categorize by error type
    const isDataError = error?.message?.includes('fetch') || 
                       error?.message?.includes('API') ||
                       error?.message?.includes('load');
    
    const isPermissionError = error?.message?.includes('permission') ||
                             error?.message?.includes('403') ||
                             error?.message?.includes('unauthorized');

    const isNetworkError = error?.message?.includes('network') ||
                          error?.message?.includes('offline') ||
                          error?.message?.includes('connection');

    return {
      isCriticalRoute,
      isDataRoute,
      isFormRoute,
      isDataError,
      isPermissionError,
      isNetworkError,
      route
    };
  };

  // Get contextual error message
  getContextualMessage = () => {
    const context = this.getErrorContext();
    const { error } = this.state;
    
    if (context.isPermissionError) {
      return {
        title: 'Access Denied',
        message: 'You do not have permission to access this page or the required data.',
        severity: 'warning',
        suggestions: ['Contact your administrator for access', 'Try logging out and back in']
      };
    }
    
    if (context.isNetworkError) {
      return {
        title: 'Connection Problem',
        message: 'Unable to connect to the server. Please check your internet connection.',
        severity: 'error',
        suggestions: ['Check your internet connection', 'Try refreshing the page', 'Contact support if the problem persists']
      };
    }
    
    if (context.isDataError && context.isDataRoute) {
      return {
        title: 'Data Loading Failed',
        message: 'Failed to load the required data for this page. This might be temporary.',
        severity: 'error',
        suggestions: ['Try refreshing the page', 'Check if the server is available', 'Contact support for assistance']
      };
    }
    
    if (context.isFormRoute) {
      return {
        title: 'Form Error',
        message: 'An error occurred while processing the form. Your data may not have been saved.',
        severity: 'warning',
        suggestions: ['Try submitting again', 'Save a backup of your data', 'Return to the previous page']
      };
    }
    
    if (context.isCriticalRoute) {
      return {
        title: 'Page Unavailable',
        message: 'This critical page encountered an error and cannot be displayed properly.',
        severity: 'error',
        suggestions: ['Try refreshing the page', 'Return to dashboard', 'Contact support immediately']
      };
    }
    
    // Default error message
    return {
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred while loading this page.',
      severity: 'error',
      suggestions: ['Try refreshing the page', 'Return to the previous page', 'Contact support if needed']
    };
  };

  handleRefresh = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
    window.location.reload();
  };

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoBack = () => {
    window.history.back();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      const context = this.getErrorContext();
      const errorMessage = this.getContextualMessage();
      const isDevelopment = import.meta.env.MODE === 'development';
      const canRetry = this.state.retryCount < 2;
      
      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Card elevation={0} sx={{ border: '1px solid #ffcdd2', backgroundPalette: '#fef7f7' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <WarningIcon 
                  style={{ 
                    fontSize: '3rem', 
                    color: errorMessage.severity === 'warning' ? '#f57c00' : '#d32f2f',
                    marginBottom: '1rem'
                  }} 
                />
                
                <Alert severity={errorMessage.severity} sx={{ mb: 3 }}>
                  <AlertTitle>{errorMessage.title}</AlertTitle>
                  {errorMessage.message}
                </Alert>
              </Box>

              {/* Error Context Info */}
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                  <Chip 
                    label={`Route: ${context.route}`} 
                    size="small" 
                    variant="outlined" 
                  />
                  {this.state.retryCount > 0 && (
                    <Chip 
                      label={`Attempts: ${this.state.retryCount + 1}`} 
                      size="small" 
                      color="warning" 
                      variant="outlined" 
                    />
                  )}
                  {context.isCriticalRoute && (
                    <Chip 
                      label="Critical Page" 
                      size="small" 
                      color="error" 
                      variant="outlined" 
                    />
                  )}
                </Stack>
              </Box>

              {/* Suggestions */}
              {errorMessage.suggestions.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <HelpIcon style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    Troubleshooting suggestions:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                    {errorMessage.suggestions.map((suggestion, index) => (
                      <Typography 
                        key={index} 
                        component="li" 
                        variant="body2" 
                        color="textSecondary"
                      >
                        {suggestion}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Action Buttons */}
              <Stack 
                direction="row" 
                spacing={2} 
                justifyContent="center" 
                flexWrap="wrap"
                sx={{ gap: 1 }}
              >
                {canRetry && (
                  <Button 
                    variant="outlined" 
                    onClick={this.handleRetry}
                    size="small"
                  >
                    Try Again
                  </Button>
                )}
                
                <Button 
                  variant="contained" 
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRefresh}
                  color="primary"
                  size="small"
                >
                  Refresh Page
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<BackIcon />}
                  onClick={this.handleGoBack}
                  size="small"
                >
                  Go Back
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<HomeIcon />}
                  onClick={this.handleGoHome}
                  size="small"
                >
                  Dashboard
                </Button>
              </Stack>

              {/* Development Error Details */}
              {isDevelopment && this.state.error && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom color="textSecondary">
                    🐛 Development Error Details
                  </Typography>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      backgroundPalette: '#f5f5f5', 
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      overflow: 'auto',
                      maxHeight: '300px'
                    }}
                  >
                    <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: 'inherit' }}>
                      <strong>Error:</strong> {this.state.error.toString()}
                      {'\n\n'}
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo?.componentStack}
                      {'\n\n'}
                      <strong>Stack Trace:</strong>
                      {this.state.error.stack}
                    </Typography>
                  </Paper>
                  
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    💡 This detailed error information is only shown in development mode.
                  </Typography>
                </Box>
              )}

              {/* Support Info */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  If this problem persists, please contact support with the error details above.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy usage
export const withRouteErrorBoundary = (Component, route) => {
  return function WithRouteErrorBoundaryComponent(props) {
    const location = useLocation();
    const currentRoute = route || location.pathname;
    
    return (
      <RouteErrorBoundary route={currentRoute}>
        <Component {...props} />
      </RouteErrorBoundary>
    );
  };
};

// Hook for programmatic error handling
export const useRouteErrorHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleError = React.useCallback((error, fallbackRoute = '/dashboard') => {
    console.error('Route error handled:', error);
    
    // Attempt to recover gracefully
    try {
      if (fallbackRoute && fallbackRoute !== location.pathname) {
        navigate(fallbackRoute, { replace: true });
      } else {
        window.location.reload();
      }
    } catch (e) {
      // Last resort - go to dashboard
      window.location.href = '/dashboard';
    }
  }, [navigate, location.pathname]);

  return { handleError };
};

export default RouteErrorBoundary;