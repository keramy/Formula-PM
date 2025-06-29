/**
 * Feature-Specific Error Boundary
 * Provides tailored error handling for specific business features
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Stack,
  Chip,
  Skeleton
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  Building as BuildIcon,
  Check as TaskIcon,
  Group as TeamIcon,
  Building as ClientIcon,
  Page as ReportIcon
} from 'iconoir-react';
import UnifiedErrorBoundary from './UnifiedErrorBoundary';
import { safeGet } from '../../utils/safety';

// Feature-specific error boundaries with tailored recovery strategies
const FEATURE_CONFIGS = {
  projects: {
    icon: BuildIcon,
    title: 'Project Management',
    fallbackData: [],
    fallbackComponent: 'ProjectsFallback',
    criticalOperations: ['create', 'update', 'delete'],
    recoveryStrategies: [
      { type: 'cache', label: 'Use Cached Projects' },
      { type: 'demo', label: 'Load Demo Data' },
      { type: 'offline', label: 'Work Offline' }
    ]
  },
  tasks: {
    icon: TaskIcon,
    title: 'Task Management',
    fallbackData: [],
    fallbackComponent: 'TasksFallback',
    criticalOperations: ['create', 'update', 'complete'],
    recoveryStrategies: [
      { type: 'cache', label: 'Use Cached Tasks' },
      { type: 'readonly', label: 'View Only Mode' }
    ]
  },
  team: {
    icon: TeamIcon,
    title: 'Team Management',
    fallbackData: [],
    fallbackComponent: 'TeamFallback',
    criticalOperations: ['add', 'update', 'remove'],
    recoveryStrategies: [
      { type: 'cache', label: 'Use Cached Team Data' },
      { type: 'basic', label: 'Basic Team View' }
    ]
  },
  clients: {
    icon: ClientIcon,
    title: 'Client Management',
    fallbackData: [],
    fallbackComponent: 'ClientsFallback',
    criticalOperations: ['create', 'update', 'delete'],
    recoveryStrategies: [
      { type: 'cache', label: 'Use Cached Clients' },
      { type: 'readonly', label: 'View Only Mode' }
    ]
  },
  reports: {
    icon: ReportIcon,
    title: 'Reports & Analytics',
    fallbackData: null,
    fallbackComponent: 'ReportsFallback',
    criticalOperations: ['generate', 'export', 'schedule'],
    recoveryStrategies: [
      { type: 'basic', label: 'Basic Report View' },
      { type: 'cache', label: 'Use Cached Reports' }
    ]
  },
  dashboard: {
    icon: DashboardIcon,
    title: 'Dashboard',
    fallbackData: {},
    fallbackComponent: 'DashboardFallback',
    criticalOperations: ['load', 'refresh'],
    recoveryStrategies: [
      { type: 'minimal', label: 'Minimal Dashboard' },
      { type: 'cache', label: 'Use Cached Data' }
    ]
  }
};

// Fallback components for each feature
const FallbackComponents = {
  ProjectsFallback: ({ onRetry, onGoHome }) => (
    <Card sx={{ m: 2, textAlign: 'center' }}>
      <CardContent>
        <BuildIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Project data is temporarily unavailable
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          You can still view cached projects or work with demo data while we resolve the issue.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={onRetry} startIcon={<RefreshIcon />}>
            Retry
          </Button>
          <Button variant="contained" onClick={onGoHome} startIcon={<DashboardIcon />}>
            Dashboard
          </Button>
        </Stack>
      </CardContent>
    </Card>
  ),

  TasksFallback: ({ onRetry, onGoHome }) => (
    <Card sx={{ m: 2, textAlign: 'center' }}>
      <CardContent>
        <TaskIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Task management is temporarily unavailable
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Your tasks are safe. You can view cached tasks or switch to a different section.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={onRetry} startIcon={<RefreshIcon />}>
            Retry
          </Button>
          <Button variant="contained" onClick={onGoHome} startIcon={<DashboardIcon />}>
            Dashboard
          </Button>
        </Stack>
      </CardContent>
    </Card>
  ),

  TeamFallback: ({ onRetry, onGoHome }) => (
    <Card sx={{ m: 2, textAlign: 'center' }}>
      <CardContent>
        <TeamIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Team section is temporarily unavailable
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Team information will be restored shortly. You can access other features normally.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={onRetry} startIcon={<RefreshIcon />}>
            Retry
          </Button>
          <Button variant="contained" onClick={onGoHome} startIcon={<DashboardIcon />}>
            Dashboard
          </Button>
        </Stack>
      </CardContent>
    </Card>
  ),

  ClientsFallback: ({ onRetry, onGoHome }) => (
    <Card sx={{ m: 2, textAlign: 'center' }}>
      <CardContent>
        <ClientIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Client management is temporarily unavailable
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Client data is secure and will be restored shortly.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={onRetry} startIcon={<RefreshIcon />}>
            Retry
          </Button>
          <Button variant="contained" onClick={onGoHome} startIcon={<DashboardIcon />}>
            Dashboard
          </Button>
        </Stack>
      </CardContent>
    </Card>
  ),

  ReportsFallback: ({ onRetry, onGoHome }) => (
    <Card sx={{ m: 2, textAlign: 'center' }}>
      <CardContent>
        <ReportIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Reports section is temporarily unavailable
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Report generation services are being restored. Existing reports are safe.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={onRetry} startIcon={<RefreshIcon />}>
            Retry
          </Button>
          <Button variant="contained" onClick={onGoHome} startIcon={<DashboardIcon />}>
            Dashboard
          </Button>
        </Stack>
      </CardContent>
    </Card>
  ),

  DashboardFallback: ({ onRetry, onGoHome }) => (
    <Box sx={{ p: 3 }}>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <AlertTitle>Dashboard Partially Available</AlertTitle>
        Some dashboard components are temporarily unavailable. Core functionality remains accessible.
      </Alert>
      
      {/* Skeleton loading for dashboard */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 1 }} />
        <Stack direction="row" spacing={2}>
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} variant="rectangular" height={100} sx={{ flex: 1, borderRadius: 1 }} />
          ))}
        </Stack>
      </Box>
      
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="outlined" onClick={onRetry} startIcon={<RefreshIcon />}>
          Retry Loading
        </Button>
      </Stack>
    </Box>
  )
};

// Generic fallback for unknown features
const GenericFallback = ({ feature, onRetry, onGoHome }) => (
  <Card sx={{ m: 2, textAlign: 'center' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {feature} is temporarily unavailable
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        We're working to restore this feature. Please try again in a moment.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="outlined" onClick={onRetry} startIcon={<RefreshIcon />}>
          Retry
        </Button>
        <Button variant="contained" onClick={onGoHome} startIcon={<DashboardIcon />}>
          Dashboard
        </Button>
      </Stack>
    </CardContent>
  </Card>
);

/**
 * Feature Error Boundary Component
 * Provides feature-specific error handling and fallback UI
 */
class FeatureErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      showFallback: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`FeatureErrorBoundary [${this.props.feature}] caught error:`, error, errorInfo);
    
    this.setState({ error, hasError: true });
    
    // Determine if we should show fallback UI
    const feature = this.props.feature;
    const config = FEATURE_CONFIGS[feature];
    
    if (config && this.props.enableFallback !== false) {
      this.setState({ showFallback: true });
    }

    // Report error with feature context
    if (this.props.onError) {
      this.props.onError({
        error,
        errorInfo,
        feature,
        context: 'feature_boundary',
        retryCount: this.state.retryCount
      });
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      showFallback: false,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      const feature = this.props.feature;
      const config = FEATURE_CONFIGS[feature];
      
      // If fallback is enabled and available, show feature-specific fallback
      if (this.state.showFallback && config) {
        const FallbackComponent = FallbackComponents[config.fallbackComponent] || GenericFallback;
        
        return (
          <Box>
            {/* Feature status indicator */}
            <Alert severity="warning" sx={{ m: 2, mb: 0 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <config.icon fontSize="small" />
                <Typography variant="body2">
                  {config.title} is experiencing issues
                </Typography>
                <Chip 
                  label={`Attempt ${this.state.retryCount + 1}`} 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
            </Alert>
            
            <FallbackComponent
              feature={feature}
              onRetry={this.handleRetry}
              onGoHome={this.handleGoHome}
            />
          </Box>
        );
      }
      
      // Otherwise, delegate to UnifiedErrorBoundary for full error handling
      throw this.state.error;
    }

    return this.props.children;
  }
}

// Higher-order component for easy feature wrapping
export const withFeatureErrorBoundary = (Component, feature, options = {}) => {
  return function WithFeatureErrorBoundaryComponent(props) {
    return (
      <FeatureErrorBoundary feature={feature} {...options}>
        <Component {...props} />
      </FeatureErrorBoundary>
    );
  };
};

// Hook for feature-specific error recovery
export const useFeatureRecovery = (feature) => {
  const [isRecovering, setIsRecovering] = React.useState(false);
  const [lastError, setLastError] = React.useState(null);
  
  const config = FEATURE_CONFIGS[feature];
  
  const recoverFromCache = React.useCallback(() => {
    try {
      const cached = localStorage.getItem(`${feature}_cache`);
      return cached ? JSON.parse(cached) : config?.fallbackData;
    } catch (error) {
      console.warn(`Failed to recover from cache for ${feature}:`, error);
      return config?.fallbackData;
    }
  }, [feature, config]);
  
  const triggerRecovery = React.useCallback(async (recoveryType = 'retry') => {
    setIsRecovering(true);
    
    try {
      switch (recoveryType) {
        case 'cache':
          return recoverFromCache();
        case 'demo':
          // Load demo data specific to feature
          return config?.fallbackData;
        case 'minimal':
          // Return minimal viable data
          return {};
        default:
          // Default retry
          return null;
      }
    } catch (error) {
      setLastError(error);
      return null;
    } finally {
      setIsRecovering(false);
    }
  }, [recoverFromCache, config]);
  
  return {
    isRecovering,
    lastError,
    triggerRecovery,
    availableStrategies: config?.recoveryStrategies || []
  };
};

export default FeatureErrorBoundary;