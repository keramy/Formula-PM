/**
 * IconWrapper Component
 * Simple wrapper for React Icons with consistent theming and sizing
 */

import React from 'react';
import { Box, useTheme } from '@mui/material';
import { getIcon } from './ReactIcons';

const IconWrapper = ({
  name,
  size = 20,
  color = 'currentColor',
  hoverColor,
  onClick,
  disabled = false,
  sx = {},
  className,
  title,
  'aria-label': ariaLabel,
  ...props
}) => {
  const theme = useTheme();
  const IconComponent = getIcon(name);

  // Handle missing icons gracefully
  if (!IconComponent) {
    console.warn(`IconWrapper: Icon "${name}" not found`);
    return null;
  }

  // Handle color variants
  const getColor = () => {
    if (disabled) {
      return theme.palette.text.disabled;
    }
    
    if (color === 'primary') return theme.palette.primary.main;
    if (color === 'secondary') return theme.palette.secondary.main;
    if (color === 'error') return theme.palette.error.main;
    if (color === 'warning') return theme.palette.warning.main;
    if (color === 'success') return theme.palette.success.main;
    if (color === 'info') return theme.palette.info.main;
    
    return color;
  };

  const iconColor = getColor();

  // Handle hover effects
  const getHoverStyles = () => {
    if (!onClick && !hoverColor) return {};
    
    return {
      '&:hover': {
        color: hoverColor || (onClick ? theme.palette.primary.main : iconColor),
        cursor: onClick ? 'pointer' : 'inherit',
        transform: onClick ? 'scale(1.05)' : 'none',
        transition: 'all 0.2s ease-in-out'
      }
    };
  };

  return (
    <Box
      onClick={onClick && !disabled ? onClick : undefined}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: iconColor,
        cursor: onClick && !disabled ? 'pointer' : 'inherit',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        transition: 'all 0.2s ease-in-out',
        ...getHoverStyles(),
        ...sx
      }}
      title={title || ariaLabel}
      aria-label={ariaLabel || name}
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick && !disabled ? 0 : -1}
      className={className}
      {...props}
    >
      <IconComponent size={size} />
    </Box>
  );
};

/**
 * Specialized icon components for common use cases
 */

// Navigation icons with consistent sizing
export const NavigationIcon = ({ name, active = false, size = 24, ...props }) => (
  <IconWrapper
    name={name}
    size={size}
    color={active ? 'primary' : 'currentColor'}
    {...props}
  />
);

// Action icons for buttons and controls
export const ActionIcon = ({ name, size = 20, ...props }) => (
  <IconWrapper
    name={name}
    size={size}
    hoverColor="primary.main"
    {...props}
  />
);

// Status icons with predefined colors
export const StatusIcon = ({ type, size = 16, ...props }) => {
  const statusColors = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
    pending: 'text.secondary',
    inProgress: 'warning',
    completed: 'success',
    cancelled: 'error'
  };

  const statusIcons = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
    pending: 'pending',
    inProgress: 'inProgress',
    completed: 'completed',
    cancelled: 'cancelled'
  };

  return (
    <IconWrapper
      name={statusIcons[type] || 'info'}
      size={size}
      color={statusColors[type] || 'currentColor'}
      {...props}
    />
  );
};

// Construction-specific icons
export const ConstructionIcon = ({ type, size = 20, ...props }) => {
  const constructionTypes = {
    tools: 'tools',
    safety: 'hardhat',
    measurement: 'ruler',
    building: 'commercial',
    residential: 'residential',
    industrial: 'industrial'
  };

  return (
    <IconWrapper
      name={constructionTypes[type] || 'tools'}
      size={size}
      color="#f57c00" // Construction orange
      {...props}
    />
  );
};

export default IconWrapper;