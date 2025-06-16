import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginPage from './LoginPage';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requiredPermission = null, projectId = null }) => {
  const { isAuthenticated, loading, hasPermission, canAccessProject } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Check specific permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
          p: 4
        }}
      >
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          You don't have permission to access this section.
        </Typography>
      </Box>
    );
  }

  // Check project access if projectId is specified
  if (projectId && !canAccessProject(projectId)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
          p: 4
        }}
      >
        <Typography variant="h5" color="error">
          Project Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          You don't have access to this project.
        </Typography>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;