import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  useTheme
} from '@mui/material';
import { FormulaLogoAnimated } from '../branding/LogoVariations';

/**
 * LoadingScreen component for full-page loading
 * Used during app initialization or major transitions
 * Updated with Formula International branding
 */
export const LoadingScreen = ({ 
  message = "Loading Formula Project Management...", 
  subtitle = "Initializing your workspace",
  progress = null,
  darkMode = false 
}) => {
  const theme = useTheme();
  
  // Formula International brand colors
  const colors = {
    background: darkMode ? '#0F1729' : '#FDFCFA',
    text: darkMode ? '#F5F2E8' : '#1B2951',
    subtext: darkMode ? '#E8E2D5' : '#566BA3',
    accent: darkMode ? '#F5F2E8' : '#1B2951'
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: colors.background,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.02,
          background: darkMode 
            ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            : 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%231B2951" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      {/* Logo */}
      <Box sx={{ mb: 4 }}>
        <FormulaLogoAnimated darkMode={darkMode} size="large" />
      </Box>

      {/* Loading indicator */}
      <Box sx={{ mb: 3 }}>
        <CircularProgress 
          size={48} 
          thickness={2}
          sx={{ 
            color: colors.accent,
            mb: 2 
          }} 
        />
      </Box>
      
      {/* Loading message */}
      <Typography 
        variant="h6" 
        sx={{ 
          color: colors.text,
          fontWeight: 500,
          mb: 1,
          '@keyframes fadeInOut': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.7 },
          },
          animation: 'fadeInOut 2s ease-in-out infinite',
        }}
      >
        {message}
      </Typography>
      
      {/* Optional subtitle */}
      {subtitle && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: colors.subtext,
            opacity: 0.8,
            mb: 3
          }}
        >
          {subtitle}
        </Typography>
      )}

      {/* Progress bar */}
      <Box sx={{ width: 280, mt: 2 }}>
        <LinearProgress 
          variant={progress !== null ? "determinate" : "indeterminate"}
          value={progress}
          sx={{ 
            height: 3, 
            borderRadius: 2,
            backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.1)' : 'rgba(27, 41, 81, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: colors.accent,
              borderRadius: 2,
            },
          }} 
        />
        
        {progress !== null && (
          <Typography
            variant="caption"
            sx={{
              color: colors.subtext,
              textAlign: 'center',
              display: 'block',
              mt: 1,
            }}
          >
            {Math.round(progress)}%
          </Typography>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: colors.subtext,
            opacity: 0.5,
            letterSpacing: '0.1em',
          }}
        >
          FORMULA INTERNATIONAL © 2025
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;