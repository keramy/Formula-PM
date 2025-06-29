/**
 * Global Error Boundary - Consolidated Error Handling System
 * Combines the best features from all existing error boundaries
 * Provides intelligent error classification, recovery strategies, and reporting
 */

import React, { Component } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  Chip,
  Divider,
  Stack,
  Tooltip,
  CircularProgress,
  Snackbar,
  Container,
  Paper
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ArrowDown as ExpandMoreIcon,
  ArrowUp as ExpandLessIcon,
  WarningTriangle as WarningIcon,
  Home as HomeIcon,
  InfoCircle as InfoIcon,
  Database as DatabaseIcon,
  Building as BuildingIcon,
  Dashboard as DashboardIcon,
  User as UserIcon,
  Bug as BugIcon,
  Xmark as CloseIcon
} from 'iconoir-react';

// Feature configurations for intelligent error handling
const FEATURE_CONFIGS = {
  projects: {
    icon: BuildingIcon,
    title: 'Project Management',
    criticalOperations: ['create', 'update', 'delete'],
    fallbackStrategies: ['cache', 'demo', 'readonly'],
    homeRoute: '/dashboard'
  },
  tasks: {
    icon: DatabaseIcon,
    title: 'Task Management',
    criticalOperations: ['create', 'update', 'complete'],
    fallbackStrategies: ['cache', 'readonly'],
    homeRoute: '/dashboard'
  },
  dashboard: {
    icon: DashboardIcon,
    title: 'Dashboard',
    criticalOperations: ['load', 'refresh'],
    fallbackStrategies: ['minimal', 'cache'],
    homeRoute: '/'
  },
  users: {
    icon: UserIcon,
    title: 'User Management',
    criticalOperations: ['create', 'update', 'authenticate'],
    fallbackStrategies: ['cache', 'basic'],
    homeRoute: '/dashboard'
  }
};

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false,
      retryCount: 0,
      errorReported: false,
      isRecovering: false,
      showRecoveryNotification: false,
      lastErrorTime: null,
      recoveryStrategies: [],
      errorContext: null
    };
    
    this.retryTimeouts = new Set();
    this.maxRetries = this.props.maxRetries || 3;
    this.autoRetryDelay = this.props.autoRetryDelay || 2000;
    this.enableAutoRetry = this.props.enableAutoRetry !== false;
    this.feature = this.props.feature || 'unknown';
    this.context = this.props.context || 'application';
  }

  static getDerivedStateFromError(error) {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true,
      errorId,
      lastErrorTime: Date.now()
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GlobalErrorBoundary caught an error:', error, errorInfo);
    
    const errorContext = this.analyzeError(error, errorInfo);
    const recoveryStrategies = this.identifyRecoveryStrategies(error, errorContext);
    
    this.setState({
      error,
      errorInfo,
      errorContext,
      recoveryStrategies,
      hasError: true
    });

    // Report error with comprehensive context
    this.reportError(error, errorInfo, errorContext);
    
    // Auto-retry logic for recoverable errors
    if (this.shouldAutoRetry(error, errorContext)) {
      this.scheduleAutoRetry();
    }
  }

  componentWillUnmount() {
    // Clean up any pending timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();
  }

  analyzeError = (error, errorInfo) => {
    const errorMessage = error?.message?.toLowerCase() || '';
    const errorName = error?.name?.toLowerCase() || '';
    const stack = error?.stack || '';
    const componentStack = errorInfo?.componentStack || '';
    
    // Network-related errors
    if (errorName === 'typeerror' && (errorMessage.includes('fetch') || errorMessage.includes('network'))) {
      return {
        type: 'network',
        severity: 'medium',
        isRecoverable: true,
        category: 'connectivity',
        isTemporary: true,
        userMessage: 'Unable to connect to the server. Please check your internet connection.'
      };
    }

    // API/Data errors
    if (errorMessage.includes('api') || errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
      return {
        type: 'api',
        severity: 'high',
        isRecoverable: true,
        category: 'data',
        isTemporary: true,
        userMessage: 'Server is experiencing issues. This is usually temporary.'
      };
    }

    // Authentication errors
    if (errorMessage.includes('unauthorized') || errorMessage.includes('401') || errorMessage.includes('forbidden') || errorMessage.includes('403')) {
      return {
        type: 'auth',
        severity: 'high',
        isRecoverable: false,
        category: 'security',
        isTemporary: false,
        userMessage: 'Authentication required. Please log in to continue.'
      };
    }

    // Timeout errors
    if (errorName === 'aborterror' || errorMessage.includes('timeout')) {
      return {
        type: 'timeout',
        severity: 'low',
        isRecoverable: true,
        category: 'performance',
        isTemporary: true,
        userMessage: 'Request timed out. The server may be busy.'
      };
    }

    // Chunk loading errors (code splitting)
    if (errorName === 'chunkloaderror' || errorMessage.includes('loading chunk')) {
      return {
        type: 'chunk',
        severity: 'medium',
        isRecoverable: true,
        category: 'loading',
        isTemporary: true,
        userMessage: 'Failed to load application resources. A refresh should fix this.'
      };
    }

    // Data parsing errors
    if (errorMessage.includes('json') || errorMessage.includes('parse') || errorMessage.includes('unexpected token')) {
      return {
        type: 'data',
        severity: 'medium',
        isRecoverable: true,
        category: 'data',
        isTemporary: true,
        userMessage: 'Data format error. Please try again.'
      };
    }

    // React component errors
    if (componentStack.length > 0 || errorMessage.includes('react') || errorMessage.includes('component')) {
      return {
        type: 'component',
        severity: 'high',
        isRecoverable: true,
        category: 'ui',
        isTemporary: false,
        userMessage: 'User interface error. Please try refreshing the page.'
      };
    }

    // Default to application error
    return {
      type: 'application',
      severity: 'high',
      isRecoverable: false,
      category: 'unknown',
      isTemporary: false,
      userMessage: 'An unexpected error occurred. Our team has been notified.'
    };
  };

  identifyRecoveryStrategies = (error, context) => {
    const strategies = [];
    const feature = FEATURE_CONFIGS[this.feature];
    
    switch (context.type) {
      case 'network':
      case 'api':
        strategies.push(
          { type: 'retry', label: 'Retry Connection', automated: true, icon: RefreshIcon },
          { type: 'cache', label: 'Use Cached Data', automated: false, icon: DatabaseIcon },
          { type: 'demo', label: 'Demo Mode', automated: false, icon: BuildingIcon }
        );
        break;
        
      case 'timeout':
        strategies.push(
          { type: 'retry', label: 'Retry with Longer Timeout', automated: true, icon: RefreshIcon },
          { type: 'simplify', label: 'Load Basic Version', automated: false, icon: DashboardIcon }
        );
        break;
        
      case 'chunk':
        strategies.push(
          { type: 'refresh', label: 'Refresh for Updated Code', automated: true, icon: RefreshIcon },
          { type: 'clear-cache', label: 'Clear Browser Cache', automated: false, icon: DatabaseIcon }
        );
        break;
        
      case 'data':
        strategies.push(
          { type: 'retry', label: 'Retry Data Loading', automated: true, icon: RefreshIcon },
          { type: 'fallback', label: 'Use Fallback Data', automated: false, icon: DatabaseIcon }
        );
        break;
        
      case 'auth':
        strategies.push(
          { type: 'login', label: 'Re-authenticate', automated: false, icon: UserIcon },
          { type: 'home', label: 'Return Home', automated: false, icon: HomeIcon }
        );
        break;
        
      default:
        strategies.push(
          { type: 'retry', label: 'Try Again', automated: false, icon: RefreshIcon },
          { type: 'refresh', label: 'Refresh Page', automated: false, icon: RefreshIcon },
          { type: 'home', label: 'Return to Dashboard', automated: false, icon: HomeIcon }
        );
    }
    
    return strategies;
  };

  shouldAutoRetry = (error, context) => {
    if (!this.enableAutoRetry || this.state.retryCount >= this.maxRetries) {
      return false;
    }
    
    return context.isRecoverable && context.isTemporary && 
           ['network', 'timeout', 'chunk', 'data', 'api'].includes(context.type);
  };

  scheduleAutoRetry = () => {
    const delay = this.autoRetryDelay * Math.pow(2, this.state.retryCount); // Exponential backoff
    
    const timeout = setTimeout(() => {
      this.handleRetry();
      this.retryTimeouts.delete(timeout);
    }, delay);
    
    this.retryTimeouts.add(timeout);
  };

  reportError = async (error, errorInfo, context) => {
    if (this.state.errorReported) return;

    const errorReport = {
      errorId: this.state.errorId,
      message: error?.message || 'Unknown error',
      stack: error?.stack || '',
      componentStack: errorInfo?.componentStack || '',
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      context: this.context,
      feature: this.feature,
      severity: context.severity,
      type: context.type,
      category: context.category,
      isRecoverable: context.isRecoverable,
      retryCount: this.state.retryCount,
      userId: this.props.userId,
      sessionId: this.props.sessionId,
      environment: import.meta.env.MODE
    };

    try {
      // Report to error tracking service
      if (this.props.onError) {
        await this.props.onError(errorReport);
      }

      // Store locally for debugging
      const errors = JSON.parse(localStorage.getItem('global_errors') || '[]');
      errors.push(errorReport);
      if (errors.length > 50) errors.splice(0, errors.length - 50);
      localStorage.setItem('global_errors', JSON.stringify(errors));

      this.setState({ errorReported: true });
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: prevState.retryCount + 1,
      errorReported: false,
      isRecovering: true,
      errorContext: null
    }));

    // Show recovery notification
    setTimeout(() => {
      this.setState({ 
        isRecovering: false, 
        showRecoveryNotification: true 
      });
    }, 1000);
  };

  handleRefresh = () => {
    if (this.props.onBeforeRefresh) {
      this.props.onBeforeRefresh();
    }
    window.location.reload();
  };

  handleGoHome = () => {
    const feature = FEATURE_CONFIGS[this.feature];
    const homeRoute = feature?.homeRoute || this.props.homeUrl || '/dashboard';
    window.location.href = homeRoute;
  };

  handleClearCache = () => {
    // Clear service worker cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Clear localStorage except essential data
    const preserve = ['auth_token', 'user_data', 'theme_preference'];
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (!preserve.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    this.handleRefresh();
  };

  handleEnableDemoMode = () => {
    localStorage.setItem('vite_force_demo_mode', 'true');
    window.VITE_FORCE_DEMO_MODE = 'true';
    this.handleRefresh();
  };

  handleContactSupport = () => {
    const supportUrl = this.props.supportUrl || 'mailto:support@formulapm.com';
    const errorDetails = encodeURIComponent(
      `Error ID: ${this.state.errorId}\n` +
      `Feature: ${this.feature}\n` +
      `Context: ${this.context}\n` +
      `Type: ${this.state.errorContext?.type || 'unknown'}\n` +
      `Timestamp: ${new Date().toISOString()}\n` +
      `Error: ${this.state.error?.message || 'Unknown error'}`
    );
    
    if (supportUrl.startsWith('mailto:')) {
      window.location.href = `${supportUrl}?subject=Formula PM Error Report&body=${errorDetails}`;
    } else {
      window.open(supportUrl, '_blank');
    }
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorContext } = this.state;
      const isDevelopment = import.meta.env.MODE === 'development';
      const canRetry = this.state.retryCount < this.maxRetries;
      const feature = FEATURE_CONFIGS[this.feature];
      
      return (
        <>
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Card elevation={0} sx={{ border: `2px solid ${errorContext?.severity === 'high' ? '#f44336' : '#ff9800'}` }}>
              <CardContent sx={{ p: 4 }}>
                {/* Header */}
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <WarningIcon 
                    color={errorContext?.severity === 'high' ? 'error' : 'warning'} 
                    style={{ fontSize: '2.5rem' }}
                  />
                  <Box flex={1}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {feature?.title || 'Application'} Error
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label={`ID: ${this.state.errorId}`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={errorContext?.type || 'unknown'}
                        size="small"
                        color={errorContext?.severity === 'high' ? 'error' : 'warning'}
                        variant="outlined"
                      />
                      {this.state.retryCount > 0 && (
                        <Chip
                          label={`Attempts: ${this.state.retryCount + 1}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </Box>
                </Box>

                {/* Main Error Message */}
                <Alert 
                  severity={errorContext?.severity === 'high' ? 'error' : 'warning'} 
                  sx={{ mb: 3 }}
                >
                  <AlertTitle>
                    {errorContext?.isTemporary ? 'Temporary Issue' : 'System Error'}
                  </AlertTitle>
                  {errorContext?.userMessage || 'An unexpected error occurred.'}
                </Alert>

                {/* Recovery Strategies */}
                {errorContext?.isRecoverable && this.state.recoveryStrategies.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <InfoIcon style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      Recovery options:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {this.state.recoveryStrategies.map((strategy, index) => (
                        <Chip
                          key={index}
                          icon={<strategy.icon style={{ fontSize: 16 }} />}
                          label={strategy.label}
                          size="small"
                          variant={strategy.automated ? 'filled' : 'outlined'}
                          color={strategy.automated ? 'primary' : 'default'}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Retry Information */}
                {this.state.retryCount >= this.maxRetries && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    Maximum retry attempts reached. Please try refreshing the page or contact support.
                  </Alert>
                )}

                {/* Development Details */}
                {isDevelopment && (
                  <Box>
                    <Button
                      startIcon={this.state.showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      onClick={this.toggleDetails}
                      size="small"
                      sx={{ mb: 2 }}
                    >
                      Development Details
                    </Button>

                    <Collapse in={this.state.showDetails}>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Error Information:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontFamily="monospace"
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            maxHeight: 300,
                            overflow: 'auto',
                            fontSize: '0.75rem',
                            bgcolor: 'grey.100',
                            p: 1,
                            borderRadius: 1
                          }}
                        >
                          {`Type: ${errorContext?.type}\n`}
                          {`Category: ${errorContext?.category}\n`}
                          {`Severity: ${errorContext?.severity}\n`}
                          {`Recoverable: ${errorContext?.isRecoverable}\n`}
                          {`Feature: ${this.feature}\n`}
                          {`Context: ${this.context}\n\n`}
                          {`Error: ${error?.message}\n\n`}
                          {`Stack: ${error?.stack}\n\n`}
                          {`Component Stack: ${this.state.errorInfo?.componentStack}`}
                        </Typography>
                      </Paper>
                    </Collapse>
                  </Box>
                )}

                <Typography variant="body2" color="textSecondary">
                  Error occurred at: {new Date(this.state.lastErrorTime).toLocaleString()}
                </Typography>
              </CardContent>

              <Divider />

              <CardActions sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ width: '100%', gap: 1 }}>
                  {/* Primary Actions */}
                  {canRetry && errorContext?.isRecoverable && (
                    <Tooltip title="Attempt to recover from the error">
                      <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={this.handleRetry}
                        color="primary"
                      >
                        Try Again
                      </Button>
                    </Tooltip>
                  )}
                  
                  <Tooltip title="Refresh the entire page">
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={this.handleRefresh}
                    >
                      Refresh Page
                    </Button>
                  </Tooltip>
                  
                  <Tooltip title="Return to the main area">
                    <Button
                      variant="outlined"
                      startIcon={<HomeIcon />}
                      onClick={this.handleGoHome}
                    >
                      {feature?.title ? `${feature.title} Home` : 'Dashboard'}
                    </Button>
                  </Tooltip>

                  {/* Conditional Actions */}
                  {errorContext?.type === 'chunk' && (
                    <Tooltip title="Clear browser cache and refresh">
                      <Button
                        variant="outlined"
                        startIcon={<DatabaseIcon />}
                        onClick={this.handleClearCache}
                      >
                        Clear Cache
                      </Button>
                    </Tooltip>
                  )}

                  {errorContext?.type === 'api' && !import.meta.env.VITE_FORCE_DEMO_MODE && (
                    <Tooltip title="Enable demo mode with sample data">
                      <Button
                        variant="outlined"
                        startIcon={<BuildingIcon />}
                        onClick={this.handleEnableDemoMode}
                        color="success"
                      >
                        Demo Mode
                      </Button>
                    </Tooltip>
                  )}

                  <Tooltip title="Contact support with error details">
                    <Button
                      variant="outlined"
                      startIcon={<BugIcon />}
                      onClick={this.handleContactSupport}
                      size="small"
                    >
                      Support
                    </Button>
                  </Tooltip>
                </Stack>
              </CardActions>
            </Card>
          </Container>

          {/* Recovery Notification */}
          <Snackbar
            open={this.state.showRecoveryNotification}
            autoHideDuration={4000}
            onClose={() => this.setState({ showRecoveryNotification: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              onClose={() => this.setState({ showRecoveryNotification: false })}
              severity="success"
              sx={{ width: '100%' }}
            >
              Recovery attempt successful! The application should work normally now.
            </Alert>
          </Snackbar>

          {/* Loading Overlay */}
          {this.state.isRecovering && (
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgcolor="rgba(255, 255, 255, 0.9)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={9999}
            >
              <Box textAlign="center">
                <CircularProgress size={48} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Attempting Recovery...
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Please wait while we restore functionality
                </Typography>
              </Box>
            </Box>
          )}
        </>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy usage
export const withGlobalErrorBoundary = (Component, options = {}) => {
  return function WithGlobalErrorBoundaryComponent(props) {
    return (
      <GlobalErrorBoundary {...options}>
        <Component {...props} />
      </GlobalErrorBoundary>
    );
  };
};

// Hook for programmatic error handling
export const useErrorRecovery = () => {
  const [recoveryState, setRecoveryState] = React.useState({
    isRecovering: false,
    lastRecoveryTime: null,
    recoveryCount: 0
  });

  const triggerRecovery = React.useCallback(async (recoveryFn) => {
    setRecoveryState(prev => ({ 
      ...prev, 
      isRecovering: true 
    }));

    try {
      if (typeof recoveryFn === 'function') {
        await recoveryFn();
      }
      
      setRecoveryState(prev => ({
        isRecovering: false,
        lastRecoveryTime: Date.now(),
        recoveryCount: prev.recoveryCount + 1
      }));
      
      return { success: true };
    } catch (error) {
      setRecoveryState(prev => ({
        ...prev,
        isRecovering: false
      }));
      return { success: false, error };
    }
  }, []);

  return {
    ...recoveryState,
    triggerRecovery
  };
};

export default GlobalErrorBoundary;