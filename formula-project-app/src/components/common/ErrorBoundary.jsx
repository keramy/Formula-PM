import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Stack
} from '@mui/material';
import { FaRedo as Refresh, FaBug as BugReport } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Enhanced error logging for development
    if (import.meta.env.MODE === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // Here you could send error details to your error reporting service
    // Example: errorReportingService.log(error, errorInfo);
  }

  handleRefresh = () => {
    // Reset error state and refresh
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleRetry = () => {
    // Just reset the error state to retry rendering
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.MODE === 'development';
      
      return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #ffcdd2', backgroundPalette: '#fef7f7' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Something went wrong</AlertTitle>
              {this.props.fallbackMessage || 'An unexpected error occurred while loading this section.'}
            </Alert>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Button 
                variant="contained" 
                startIcon={<Refresh />}
                onClick={this.handleRefresh}
                color="primary"
              >
                Refresh Page
              </Button>
              <Button 
                variant="outlined" 
                onClick={this.handleRetry}
                color="primary"
              >
                Try Again
              </Button>
            </Stack>

            {isDevelopment && this.state.error && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BugReport fontSize="small" />
                  Development Error Details
                </Typography>
                <Paper 
                  sx={{ 
                    p: 2, 
                    backgroundPalette: '#f5f5f5', 
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    overflow: 'auto',
                    maxHeight: '300px'
                  }}
                >
                  <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: 'inherit' }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </Typography>
                </Paper>
                
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  💡 This detailed error information is only shown in development mode.
                </Typography>
              </Box>
            )}

            <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
              If this problem persists, please contact support or try refreshing the page.
            </Typography>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export const withErrorBoundary = (Component, fallbackMessage) => {
  return function WithErrorBoundaryComponent(props) {
    return (
      <ErrorBoundary fallbackMessage={fallbackMessage}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Hook version for functional components (experimental)
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = () => setError(null);

  const handleError = React.useCallback((error) => {
    console.error('Error handled by hook:', error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
};

export default ErrorBoundary;