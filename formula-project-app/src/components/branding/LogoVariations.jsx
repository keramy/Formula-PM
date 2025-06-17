import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import FormulaLogo from './FormulaLogo';

// Compact logo for sidebar/mobile
export const FormulaLogoCompact = ({ darkMode, onClick }) => (
  <Tooltip title="Formula International">
    <IconButton onClick={onClick} sx={{ p: 1 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          background: darkMode 
            ? 'linear-gradient(135deg, #F5F2E8 0%, #E8E2D5 100%)'
            : 'linear-gradient(135deg, #1B2951 0%, #566BA3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: darkMode ? '#1B2951' : '#F5F2E8',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          letterSpacing: '0.1em',
        }}
      >
        F
      </Box>
    </IconButton>
  </Tooltip>
);

// Logo with background for branded sections
export const FormulaLogoBranded = ({ 
  darkMode, 
  variant = 'light',
  size = 'medium',
  onClick 
}) => {
  const backgroundStyles = {
    light: {
      background: 'linear-gradient(135deg, #F5F2E8 0%, #FDFCFA 100%)',
      border: '1px solid #D1D8E6',
    },
    dark: {
      background: 'linear-gradient(135deg, #1B2951 0%, #0F1729 100%)',
      border: '1px solid #566BA3',
    },
    navy: {
      background: 'linear-gradient(135deg, #1B2951 0%, #566BA3 100%)',
      border: 'none',
    },
    cream: {
      background: 'linear-gradient(135deg, #E8E2D5 0%, #F5F2E8 100%)',
      border: 'none',
    },
  };

  return (
    <Box
      sx={{
        ...backgroundStyles[variant],
        borderRadius: 2,
        padding: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: darkMode 
            ? '0 8px 25px rgba(0, 0, 0, 0.3)'
            : '0 8px 25px rgba(27, 41, 81, 0.1)',
        } : {},
      }}
      onClick={onClick}
    >
      <FormulaLogo 
        size={size}
        darkMode={variant === 'navy' ? false : variant === 'dark' ? true : darkMode}
      />
    </Box>
  );
};

// Animated logo for loading screens
export const FormulaLogoAnimated = ({ darkMode, size = 'large' }) => {
  return (
    <Box
      sx={{
        '@keyframes fadeInUp': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        '@keyframes pulse': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.7,
          },
        },
        animation: 'fadeInUp 0.8s ease-out, pulse 2s ease-in-out infinite',
      }}
    >
      <FormulaLogo size={size} darkMode={darkMode} />
    </Box>
  );
};

// Logo with tagline for marketing pages
export const FormulaLogoWithTagline = ({ 
  darkMode, 
  tagline = "Professional Project Management",
  size = 'large'
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: 2,
    }}>
      <FormulaLogo size={size} darkMode={darkMode} />
      <Box
        sx={{
          fontSize: '0.9rem',
          color: darkMode ? '#E8E2D5' : '#566BA3',
          fontWeight: 400,
          letterSpacing: '0.05em',
          textAlign: 'center',
          opacity: 0.8,
        }}
      >
        {tagline}
      </Box>
    </Box>
  );
};