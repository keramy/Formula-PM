import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress
} from '@mui/material';

/**
 * LoadingScreen component for full-page loading
 * Used during app initialization or major transitions
 */
export const LoadingScreen = ({ message = "Loading Formula Project Management...", subtitle }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'background.default',
        textAlign: 'center'
      }}
    >
      {/* Logo or brand area */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          Formula PM
        </Typography>
        <LinearProgress sx={{ width: 200, height: 3, borderRadius: 2 }} />
      </Box>

      {/* Loading spinner */}
      <CircularProgress size={48} sx={{ mb: 2 }} />
      
      {/* Loading message */}
      <Typography variant="h6" color="textPrimary" sx={{ mb: 1 }}>
        {message}
      </Typography>
      
      {/* Optional subtitle */}
      {subtitle && (
        <Typography variant="body2" color="textSecondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingScreen;