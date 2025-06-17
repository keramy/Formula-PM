import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { FormulaLogoAnimated } from '../branding/LogoVariations';

const FormulaLoadingScreen = ({ 
  message = "Loading Formula Project Management...",
  subtitle = "Initializing your workspace",
  darkMode = false,
  progress = null // 0-100 or null for indeterminate
}) => {
  const backgroundColor = darkMode ? '#0F1729' : '#FDFCFA';
  const textColor = darkMode ? '#F5F2E8' : '#1B2951';
  const subtextColor = darkMode ? '#E8E2D5' : '#566BA3';

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        '@keyframes shimmer': {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
      }}
    >
      {/* Animated Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode 
            ? `linear-gradient(45deg, 
                transparent 30%, 
                rgba(245, 242, 232, 0.03) 50%, 
                transparent 70%)`
            : `linear-gradient(45deg, 
                transparent 30%, 
                rgba(27, 41, 81, 0.03) 50%, 
                transparent 70%)`,
          backgroundSize: '2000px 100%',
          animation: 'shimmer 3s infinite linear',
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Animated Logo */}
        <FormulaLogoAnimated 
          darkMode={darkMode} 
          size="xlarge"
        />

        {/* Loading Text */}
        <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
          <Typography
            variant="h6"
            sx={{
              color: textColor,
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
          
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: subtextColor,
                opacity: 0.8,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Progress Bar */}
        <Box sx={{ width: 300, mt: 2 }}>
          <LinearProgress
            variant={progress !== null ? "determinate" : "indeterminate"}
            value={progress}
            sx={{
              height: 3,
              borderRadius: 2,
              backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.1)' : 'rgba(27, 41, 81, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: darkMode ? '#F5F2E8' : '#1B2951',
                borderRadius: 2,
              },
            }}
          />
          
          {progress !== null && (
            <Typography
              variant="caption"
              sx={{
                color: subtextColor,
                textAlign: 'center',
                display: 'block',
                mt: 1,
              }}
            >
              {Math.round(progress)}%
            </Typography>
          )}
        </Box>
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
            color: subtextColor,
            opacity: 0.6,
            letterSpacing: '0.1em',
          }}
        >
          FORMULA INTERNATIONAL © 2025
        </Typography>
      </Box>
    </Box>
  );
};

export default FormulaLoadingScreen;