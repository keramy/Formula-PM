/**
 * Unified Error Boundary - Enhanced Runtime Stability
 * Combines best practices from all error boundaries with advanced recovery mechanisms
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
  Collapse,
  IconButton,
  Chip,
  Divider,
  Stack,
  Tooltip,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ArrowDown as ExpandMoreIcon,
  ArrowUp as ExpandLessIcon,
  WarningTriangle as BugIcon,
  Home as HomeIcon,
  WarningTriangle as WarningIcon,
  InfoCircle as InfoIcon,
  Xmark as CloseIcon,
  Refresh as RetryIcon
} from 'iconoir-react';
import { safeGet, safeExecute, isNullOrUndefined } from '../../utils/safety';

class UnifiedErrorBoundary extends Component {
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
      recoveryStrategies: []
    };
    
    this.retryTimeouts = new Set();
    this.maxRetries = safeGet(props, 'maxRetries', 3);
    this.autoRetryDelay = safeGet(props, 'autoRetryDelay', 2000);
    this.enableAutoRetry = safeGet(props, 'enableAutoRetry', true);
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastErrorTime: Date.now()
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UnifiedErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      hasError: true
    });

    // Enhanced error analysis and reporting
    this.analyzeAndReportError(error, errorInfo);
    
    // Auto-retry logic for recoverable errors
    if (this.shouldAutoRetry(error)) {
      this.scheduleAutoRetry();
    }
  }

  componentWillUnmount() {
    // Cleanup any pending timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();
  }

  analyzeAndReportError = (error, errorInfo) => {
    const errorContext = this.getErrorContext(error);
    const recoveryStrategies = this.identifyRecoveryStrategies(error, errorContext);
    
    this.setState({ recoveryStrategies });

    const errorReport = {
      message: safeGet(error, 'message', 'Unknown error'),
      stack: safeGet(error, 'stack', ''),
      componentStack: safeGet(errorInfo, 'componentStack', ''),
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      context: this.props.context || 'unknown',
      feature: this.props.feature || 'generic',
      severity: errorContext.severity,
      isRecoverable: errorContext.isRecoverable,
      retryCount: this.state.retryCount,
      userId: safeGet(this.props, 'userId'),
      sessionId: safeGet(this.props, 'sessionId')
    };

    this.reportError(errorReport);
  };

  getErrorContext = (error) => {
    const errorMessage = safeGet(error, 'message', '').toLowerCase();
    const errorName = safeGet(error, 'name', '').toLowerCase();
    
    // Network-related errors
    if (errorName === 'typeerror' && errorMessage.includes('fetch')) {
      return {
        type: 'network',
        severity: 'medium',
        isRecoverable: true,
        category: 'connectivity'
      };
    }

    // Timeout errors
    if (errorName === 'aborterror' || errorMessage.includes('timeout')) {
      return {
        type: 'timeout',
        severity: 'low',
        isRecoverable: true,
        category: 'performance'
      };
    }

    // Permission errors
    if (errorMessage.includes('unauthorized') || errorMessage.includes('403')) {
      return {
        type: 'permission',
        severity: 'high',
        isRecoverable: false,
        category: 'security'
      };
    }

    // Data parsing errors
    if (errorMessage.includes('json') || errorMessage.includes('parse')) {
      return {
        type: 'data',
        severity: 'medium',
        isRecoverable: true,
        category: 'data'
      };
    }

    // Chunk loading errors (code splitting)
    if (errorName === 'chunkloaderror' || errorMessage.includes('loading chunk')) {
      return {
        type: 'chunk',
        severity: 'medium',
        isRecoverable: true,
        category: 'loading'
      };
    }

    // React component errors
    if (errorMessage.includes('react') || errorMessage.includes('component')) {
      return {
        type: 'component',
        severity: 'high',
        isRecoverable: true,
        category: 'ui'
      };
    }

    // Default to application error
    return {
      type: 'application',
      severity: 'high',
      isRecoverable: false,
      category: 'unknown'
    };
  };

  identifyRecoveryStrategies = (error, context) => {
    const strategies = [];
    
    switch (context.type) {
      case 'network':
        strategies.push(
          { type: 'retry', label: 'Retry Connection', automated: true },
          { type: 'offline', label: 'Work Offline', automated: false },
          { type: 'refresh', label: 'Refresh Page', automated: false }
        );
        break;
        
      case 'timeout':
        strategies.push(
          { type: 'retry', label: 'Retry with Longer Timeout', automated: true },
          { type: 'simplify', label: 'Load Basic Version', automated: false }
        );
        break;
        
      case 'chunk':
        strategies.push(
          { type: 'refresh', label: 'Refresh for Updated Code', automated: true },
          { type: 'clear-cache', label: 'Clear Browser Cache', automated: false }
        );
        break;
        
      case 'data':
        strategies.push(
          { type: 'retry', label: 'Retry Data Loading', automated: true },
          { type: 'fallback', label: 'Use Cached Data', automated: false }
        );
        break;
        
      case 'permission':
        strategies.push(
          { type: 'login', label: 'Re-authenticate', automated: false },
          { type: 'contact', label: 'Contact Administrator', automated: false }
        );
        break;
        
      default:
        strategies.push(
          { type: 'retry', label: 'Try Again', automated: false },
          { type: 'refresh', label: 'Refresh Page', automated: false },
          { type: 'home', label: 'Return to Dashboard', automated: false }
        );
    }
    
    return strategies;
  };

  shouldAutoRetry = (error) => {
    if (!this.enableAutoRetry || this.state.retryCount >= this.maxRetries) {
      return false;
    }
    
    const context = this.getErrorContext(error);
    return context.isRecoverable && ['network', 'timeout', 'chunk', 'data'].includes(context.type);
  };

  scheduleAutoRetry = () => {
    const delay = this.autoRetryDelay * Math.pow(2, this.state.retryCount); // Exponential backoff
    
    const timeout = setTimeout(() => {
      this.handleRetry();
      this.retryTimeouts.delete(timeout);
    }, delay);
    
    this.retryTimeouts.add(timeout);
  };

  reportError = async (errorReport) => {
    if (this.state.errorReported) return;

    try {
      // Report to error tracking service
      if (this.props.onError) {
        await safeExecute(this.props.onError, null, errorReport);
      }

      // Store locally for debugging
      const errors = JSON.parse(localStorage.getItem('unified_errors') || '[]');
      errors.push(errorReport);
      if (errors.length > 20) errors.splice(0, errors.length - 20);
      localStorage.setItem('unified_errors', JSON.stringify(errors));

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
      isRecovering: true
    }));

    // Show recovery notification
    setTimeout(() => {
      this.setState({ 
        isRecovering: false, 
        showRecoveryNotification: true 
      });
    }, 500);
  };

  handleRefresh = () => {
    // Clear any cached data before refresh
    if (this.props.onBeforeRefresh) {
      safeExecute(this.props.onBeforeRefresh);
    }
    
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = this.props.homeUrl || '/dashboard';
  };

  handleClearCache = () => {
    // Clear various caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Clear localStorage except for essential data
    const preserve = ['auth_token', 'user_data', 'theme_preference'];
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (!preserve.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    this.handleRefresh();
  };

  handleContactSupport = () => {
    const supportUrl = this.props.supportUrl || 'mailto:support@formulapm.com';
    const errorDetails = encodeURIComponent(
      `Error ID: ${this.state.errorId}\n` +
      `Context: ${this.props.context || 'Unknown'}\n` +
      `Feature: ${this.props.feature || 'Unknown'}\n` +
      `Timestamp: ${new Date().toISOString()}\n` +
      `Error: ${safeGet(this.state.error, 'message', 'Unknown error')}`
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

  getUserFriendlyMessage = () => {
    if (!this.state.error) return 'An unexpected error occurred.';
    
    const context = this.getErrorContext(this.state.error);
    const feature = this.props.feature || 'this feature';
    
    switch (context.type) {
      case 'network':
        return `Unable to connect to the server. Please check your internet connection and try again.`;
      case 'timeout':
        return `${feature} is taking longer than expected to load. This might be due to heavy server load.`;
      case 'permission':
        return `You don't have permission to access ${feature}. Please contact your administrator.`;
      case 'chunk':
        return `There was an issue loading the latest version of ${feature}. A page refresh should fix this.`;
      case 'data':
        return `There was an issue processing the data for ${feature}. Please try again.`;
      default:
        return `${feature} encountered an unexpected error. Our team has been notified.`;
    }
  };

  render() {
    if (this.state.hasError) {
      const context = this.getErrorContext(this.state.error);
      const userMessage = this.getUserFriendlyMessage();
      const isDevelopment = import.meta.env.MODE === 'development';
      const canRetry = this.state.retryCount < this.maxRetries;

      return (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
            p={3}
          >
            <Card sx={{ maxWidth: 600, width: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <WarningIcon 
                    color={context.severity === 'high' ? 'error' : 'warning'} 
                    sx={{ fontSize: 40 }} 
                  />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      Oops! Something went wrong
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip
                        label={`Error ID: ${this.state.errorId}`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={context.type}
                        size="small"
                        color={context.severity === 'high' ? 'error' : 'warning'}
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                </Box>

                <Alert 
                  severity={context.severity === 'high' ? 'error' : 'warning'} 
                  sx={{ mb: 2 }}
                >
                  {userMessage}
                </Alert>

                {this.state.retryCount > 0 && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Retry attempt: {this.state.retryCount + 1}
                    {this.state.retryCount >= this.maxRetries && ' (Maximum retries reached)'}
                  </Alert>
                )}

                {context.isRecoverable && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <InfoIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 16 }} />
                      This appears to be a temporary issue. Try these solutions:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {this.state.recoveryStrategies.map((strategy, index) => (
                        <Chip
                          key={index}
                          label={strategy.label}
                          size="small"
                          variant="outlined"
                          color={strategy.automated ? 'primary' : 'default'}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Typography variant="body2" color="textSecondary" paragraph>
                  Error occurred at: {new Date().toLocaleString()}
                </Typography>

                {isDevelopment && (
                  <Box>
                    <Button
                      startIcon={this.state.showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      onClick={this.toggleDetails}
                      size="small"
                      sx={{ mb: 1 }}
                    >
                      Technical Details
                    </Button>

                    <Collapse in={this.state.showDetails}>
                      <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Error Details:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontFamily="monospace"
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            maxHeight: 200,
                            overflow: 'auto',
                            fontSize: '0.75rem',
                            bgcolor: 'grey.100',
                            p: 1,
                            borderRadius: 1
                          }}
                        >
                          {`Error: ${safeGet(this.state.error, 'message', 'Unknown')}\n\n`}
                          {`Stack: ${safeGet(this.state.error, 'stack', 'Not available')}\n\n`}
                          {`Component Stack: ${safeGet(this.state.errorInfo, 'componentStack', 'Not available')}`}
                        </Typography>
                      </Box>
                    </Collapse>
                  </Box>
                )}
              </CardContent>

              <Divider />

              <CardActions>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ width: '100%', gap: 1 }}>
                  {canRetry && context.isRecoverable && (
                    <Tooltip title="Try to recover from the error">
                      <Button
                        variant="contained"
                        startIcon={<RetryIcon />}
                        onClick={this.handleRetry}
                        size="small"
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
                      size="small"
                    >
                      Refresh
                    </Button>
                  </Tooltip>
                  
                  <Tooltip title="Return to the main dashboard">
                    <Button
                      variant="outlined"
                      startIcon={<HomeIcon />}
                      onClick={this.handleGoHome}
                      size="small"
                    >
                      Dashboard
                    </Button>
                  </Tooltip>

                  {context.type === 'chunk' && (
                    <Tooltip title="Clear browser cache and refresh">
                      <Button
                        variant="outlined"
                        onClick={this.handleClearCache}
                        size="small"
                      >
                        Clear Cache
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
                      Contact Support
                    </Button>
                  </Tooltip>
                </Stack>
              </CardActions>
            </Card>
          </Box>

          {/* Recovery notification */}
          <Snackbar
            open={this.state.showRecoveryNotification}
            autoHideDuration={3000}
            onClose={() => this.setState({ showRecoveryNotification: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              onClose={() => this.setState({ showRecoveryNotification: false })}
              severity="success"
              sx={{ width: '100%' }}
            >
              Error recovery attempt successful!
            </Alert>
          </Snackbar>

          {/* Loading overlay during recovery */}
          {this.state.isRecovering && (
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgcolor="rgba(255, 255, 255, 0.8)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={9999}
            >
              <Box textAlign="center">
                <CircularProgress size={40} />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Attempting to recover...
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
export const withUnifiedErrorBoundary = (Component, options = {}) => {
  return function WithUnifiedErrorBoundaryComponent(props) {
    return (
      <UnifiedErrorBoundary {...options}>
        <Component {...props} />
      </UnifiedErrorBoundary>
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
      await safeExecute(recoveryFn);
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

export default UnifiedErrorBoundary;