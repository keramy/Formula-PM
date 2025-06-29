/**
 * IconoirIcon - Universal Icon Wrapper Component
 * 
 * This component provides a smooth migration path from Material-UI and React Icons
 * to Iconoir icons. It accepts the old icon name and renders the Iconoir equivalent.
 */

import React from 'react';
import { getIconoirIcon } from '../../services/iconMapping';

const IconoirIcon = ({ 
  name, 
  size = '1.2em', 
  color = 'currentPalette',
  strokeWidth = 1.5,
  className,
  style,
  ...props 
}) => {
  // Get the Iconoir component for the given name
  const IconComponent = getIconoirIcon(name);
  
  // Combine default styles with custom styles
  const iconStyle = {
    width: size,
    height: size,
    color: color,
    strokeWidth: strokeWidth,
    ...style
  };
  
  return (
    <IconComponent 
      className={className}
      style={iconStyle}
      {...props}
    />
  );
};

/**
 * Pre-configured icon variants for common use cases
 */

// Small icon for inline text
export const SmallIcon = ({ name, ...props }) => (
  <IconoirIcon name={name} size="1em" strokeWidth={1.5} {...props} />
);

// Medium icon for buttons and navigation
export const MediumIcon = ({ name, ...props }) => (
  <IconoirIcon name={name} size="1.2em" strokeWidth={1.5} {...props} />
);

// Large icon for headers and features
export const LargeIcon = ({ name, ...props }) => (
  <IconoirIcon name={name} size="1.5em" strokeWidth={1.5} {...props} />
);

// Extra large icon for heroes and showcases
export const XLargeIcon = ({ name, ...props }) => (
  <IconoirIcon name={name} size="2em" strokeWidth={1.2} {...props} />
);

/**
 * Specialized icon variants for Formula PM
 */

// Navigation icons with consistent styling
export const NavIcon = ({ name, ...props }) => (
  <IconoirIcon 
    name={name} 
    size="1.1em" 
    strokeWidth={1.5}
    color="currentPalette"
    {...props} 
  />
);

// Action button icons
export const ActionIcon = ({ name, ...props }) => (
  <IconoirIcon 
    name={name} 
    size="1em" 
    strokeWidth={1.8}
    color="currentPalette"
    {...props} 
  />
);

// Status icons with emphasis
export const StatusIcon = ({ name, status = 'default', ...props }) => {
  const statusPalettes = {
    success: '#10B981',
    warning: '#F59E0B', 
    error: '#EF4444',
    info: '#3B82F6',
    default: 'currentPalette'
  };
  
  return (
    <IconoirIcon 
      name={name} 
      size="1.1em" 
      strokeWidth={1.6}
      color={statusPalettes[status]}
      {...props} 
    />
  );
};

// Construction/Business icons
export const BusinessIcon = ({ name, ...props }) => (
  <IconoirIcon 
    name={name} 
    size="1.3em" 
    strokeWidth={1.4}
    color="currentPalette"
    {...props} 
  />
);

export default IconoirIcon;