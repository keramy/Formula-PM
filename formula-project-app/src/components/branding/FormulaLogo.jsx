import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

/**
 * Formula International Logo Component
 * 
 * @param {string} variant - Layout variant: 'horizontal' or 'vertical'
 * @param {string} size - Size variant: 'small', 'medium', 'large', 'xlarge'
 * @param {boolean} darkMode - Dark mode styling
 * @param {boolean} showSubtext - Show "INTERNATIONAL" subtext
 * @param {function} onClick - Click handler for interactive logos
 * @param {object} sx - Additional Material-UI sx styles
 */
const FormulaLogo = ({ 
  variant = 'horizontal', 
  size = 'medium', 
  darkMode = false,
  showSubtext = true,
  onClick,
  sx = {} 
}) => {
  const theme = useTheme();
  
  // Size configurations optimized for different use cases
  const sizeConfig = {
    small: {
      fontSize: '1.2rem',
      subtextSize: '0.6rem',
      spacing: '0.08em',
      subtextSpacing: '0.15em',
      height: 32,
    },
    medium: {
      fontSize: '1.8rem',
      subtextSize: '0.75rem',
      spacing: '0.1em',
      subtextSpacing: '0.2em',
      height: 48,
    },
    large: {
      fontSize: '2.5rem',
      subtextSize: '1rem',
      spacing: '0.1em',
      subtextSpacing: '0.2em',
      height: 64,
    },
    xlarge: {
      fontSize: '3.5rem',
      subtextSize: '1.25rem',
      spacing: '0.1em',
      subtextSpacing: '0.2em',
      height: 88,
    },
  };

  const config = sizeConfig[size];
  
  // Formula International brand colors
  const colors = darkMode ? {
    primary: '#F5F2E8',    // Light cream text on dark backgrounds
    secondary: '#E8E2D5',  // Slightly darker cream for subtext
    background: '#1B2951', // Navy background
  } : {
    primary: '#1B2951',    // Navy text on light backgrounds
    secondary: '#566BA3',  // Medium navy for subtext
    background: '#F5F2E8', // Light cream background
  };

  const logoStyles = {
    display: 'flex',
    flexDirection: variant === 'vertical' ? 'column' : 'row',
    alignItems: variant === 'vertical' ? 'center' : 'baseline',
    gap: variant === 'vertical' ? 0 : 2,
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
    transition: 'all 0.2s ease-in-out',
    height: config.height,
    '&:hover': onClick ? {
      transform: 'scale(1.02)',
      opacity: 0.9,
    } : {},
    ...sx,
  };

  const mainTextStyles = {
    fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: 300,
    fontSize: config.fontSize,
    letterSpacing: config.spacing,
    color: colors.primary,
    lineHeight: 1,
    textTransform: 'uppercase',
  };

  const subtextStyles = {
    fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: 400,
    fontSize: config.subtextSize,
    letterSpacing: config.subtextSpacing,
    color: colors.secondary,
    lineHeight: 1,
    textTransform: 'uppercase',
    opacity: 0.8,
  };

  if (variant === 'vertical') {
    return (
      <Box sx={logoStyles} onClick={onClick}>
        <Typography sx={mainTextStyles}>
          FORMULA
        </Typography>
        {showSubtext && (
          <Typography sx={subtextStyles}>
            INTERNATIONAL
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={logoStyles} onClick={onClick}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={mainTextStyles}>
          FORMULA
        </Typography>
        {showSubtext && (
          <Typography sx={subtextStyles}>
            INTERNATIONAL
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// Compact logo for sidebar/mobile
export const FormulaLogoCompact = ({ darkMode = false, onClick, sx = {} }) => {
  return (
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
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
          opacity: 0.9,
        } : {},
        ...sx,
      }}
      onClick={onClick}
    >
      F
    </Box>
  );
};

export default FormulaLogo;