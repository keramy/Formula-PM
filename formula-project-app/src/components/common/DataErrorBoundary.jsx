import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Stack,
  Chip
} from '@mui/material';
import { FaRedo as Refresh, FaDatabase as Database, FaPlay as Demo } from 'react-icons/fa';

class DataErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Data Error Boundary caught error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log API/data related errors with more context
    if (import.meta.env.MODE === 'development') {
      console.group('🔌 Data Loading Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Props:', this.props);
      console.groupEnd();
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleRefresh = () => {
    window.location.reload();
  };

  handleEnableDemoMode = () => {
    // Set demo mode in localStorage for immediate effect
    localStorage.setItem('vite_force_demo_mode', 'true');
    
    // Also set as environment variable for current session (if possible)
    try {
      window.VITE_FORCE_DEMO_MODE = 'true';
    } catch (e) {
      // Environment is read-only in some cases
    }
    
    // Show user feedback
    alert('🎭 Demo mode enabled! The app will now use sample data. Refresh the page to see the changes.');
    
    // Auto-refresh after user acknowledgment
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  isDataLoadingError = () => {
    const errorMessage = this.state.error?.message || '';
    const isApiError = errorMessage.includes('API') || 
                      errorMessage.includes('fetch') || 
                      errorMessage.includes('Network') ||
                      errorMessage.includes('500') ||
                      errorMessage.includes('404');
    return isApiError;
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.MODE === 'development';
      const isDataError = this.isDataLoadingError();
      const isDemoModeAvailable = !import.meta.env.VITE_FORCE_DEMO_MODE;
      
      return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 2 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #ffcdd2', backgroundColor: '#fef7f7' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>
                {isDataError ? 'Data Loading Failed' : 'Component Error'}
              </AlertTitle>
              {this.props.fallbackMessage || 
               (isDataError ? 
                'Unable to load data from the server. This might be due to network issues or server unavailability.' :
                'An unexpected error occurred while rendering this component.'
               )}
            </Alert>

            {isDataError && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  <Database style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Common causes: Server offline, network issues, or API errors
                </Typography>
                
                {isDemoModeAvailable && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      💡 You can enable demo mode to continue working with sample data while the server is unavailable.
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}

            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 1, mb: 2 }}>
              <Button 
                variant="outlined" 
                onClick={this.handleRetry}
                color="primary"
                size="small"
              >
                Try Again
              </Button>
              
              {this.state.retryCount < 3 && (
                <Button 
                  variant="contained" 
                  startIcon={<Refresh />}
                  onClick={this.handleRefresh}
                  color="primary"
                  size="small"
                >
                  Refresh Page
                </Button>
              )}

              {isDataError && isDemoModeAvailable && (
                <Button 
                  variant="contained" 
                  startIcon={<Demo />}
                  onClick={this.handleEnableDemoMode}
                  color="success"
                  size="small"
                >
                  Enable Demo Mode
                </Button>
              )}
            </Stack>

            {this.state.retryCount > 0 && (
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={`Retry attempts: ${this.state.retryCount}`} 
                  size="small" 
                  color="warning" 
                  variant="outlined" 
                />
              </Box>
            )}

            {isDevelopment && this.state.error && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  🐛 Development Error Details
                </Typography>
                <Paper 
                  sx={{ 
                    p: 2, 
                    backgroundColor: '#f5f5f5', 
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    maxHeight: '200px'
                  }}
                >
                  <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: 'inherit' }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for data components
export const withDataErrorBoundary = (Component, fallbackMessage) => {
  return function WithDataErrorBoundaryComponent(props) {
    return (
      <DataErrorBoundary fallbackMessage={fallbackMessage}>
        <Component {...props} />
      </DataErrorBoundary>
    );
  };
};

export default DataErrorBoundary;