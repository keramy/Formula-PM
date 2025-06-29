/**
 * Enhanced Error Boundary
 * Handles errors with real-time reporting and recovery options
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
  Divider
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ArrowDown as ExpandMoreIcon,
  ArrowUp as ExpandLessIcon,
  WarningTriangle as BugIcon,
  Home as HomeIcon,
  WarningTriangle as WarningIcon
} from 'iconoir-react';

class EnhancedErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false,
      retryCount: 0,
      errorReported: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      hasError: true
    });

    // Report error to backend
    this.reportError(error, errorInfo);
  }

  reportError = async (error, errorInfo) => {
    if (this.state.errorReported) return;

    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        errorId: this.state.errorId,
        userId: this.props.userId,
        sessionId: this.props.sessionId
      };

      // Try to report to backend
      await fetch('/api/v1/system/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(errorReport)
      });

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
      errorReported: false
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  getErrorType = (error) => {
    if (error.name === 'ChunkLoadError') return 'network';
    if (error.message.includes('Loading chunk')) return 'network';
    if (error.message.includes('network')) return 'network';
    if (error.message.includes('unauthorized') || error.message.includes('401')) return 'auth';
    if (error.message.includes('permission') || error.message.includes('403')) return 'permission';
    return 'application';
  };

  getErrorSeverity = (error) => {
    const errorType = this.getErrorType(error);
    
    switch (errorType) {
      case 'network':
        return 'warning';
      case 'auth':
      case 'permission':
        return 'error';
      default:
        return 'error';
    }
  };

  getRecoveryActions = (error) => {
    const errorType = this.getErrorType(error);
    
    switch (errorType) {
      case 'network':
        return [
          { label: 'Retry', action: this.handleRetry, icon: RefreshIcon, color: 'primary' },
          { label: 'Go Home', action: this.handleGoHome, icon: HomeIcon, color: 'default' }
        ];
      case 'auth':
        return [
          { label: 'Login Again', action: () => window.location.href = '/login', icon: HomeIcon, color: 'primary' }
        ];
      case 'permission':
        return [
          { label: 'Go Home', action: this.handleGoHome, icon: HomeIcon, color: 'primary' }
        ];
      default:
        return [
          { label: 'Retry', action: this.handleRetry, icon: RefreshIcon, color: 'primary' },
          { label: 'Go Home', action: this.handleGoHome, icon: HomeIcon, color: 'default' }
        ];
    }
  };

  getUserFriendlyMessage = (error) => {
    const errorType = this.getErrorType(error);
    
    switch (errorType) {
      case 'network':
        return 'Connection issue detected. Please check your internet connection and try again.';
      case 'auth':
        return 'Your session has expired. Please log in again to continue.';
      case 'permission':
        return 'You don\'t have permission to access this resource.';
      default:
        return 'Something went wrong. Our team has been notified and is working on a fix.';
    }
  };

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      const severity = this.getErrorSeverity(error);
      const userMessage = this.getUserFriendlyMessage(error);
      const recoveryActions = this.getRecoveryActions(error);

      return (
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
                <WarningIcon color={severity} sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Oops! Something went wrong
                  </Typography>
                  <Chip
                    label={`Error ID: ${this.state.errorId}`}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              <Alert severity={severity} sx={{ mb: 2 }}>
                {userMessage}
              </Alert>

              {this.state.retryCount > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Retry attempt: {this.state.retryCount}
                </Alert>
              )}

              <Typography variant="body2" color="textSecondary" paragraph>
                Error occurred at: {new Date().toLocaleString()}
              </Typography>

              {this.props.showTechnicalDetails !== false && (
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
                        Error Message:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        fontFamily="monospace"
                        sx={{ wordBreak: 'break-word', mb: 2 }}
                      >
                        {error?.message}
                      </Typography>

                      {error?.stack && (
                        <>
                          <Typography variant="subtitle2" gutterBottom>
                            Stack Trace:
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
                            {error.stack}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Collapse>
                </Box>
              )}
            </CardContent>

            <Divider />

            <CardActions>
              <Box display="flex" gap={1} flexWrap="wrap">
                {recoveryActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={index}
                      variant={index === 0 ? 'contained' : 'outlined'}
                      color={action.color}
                      startIcon={<IconComponent />}
                      onClick={action.action}
                    >
                      {action.label}
                    </Button>
                  );
                })}
              </Box>
            </CardActions>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;