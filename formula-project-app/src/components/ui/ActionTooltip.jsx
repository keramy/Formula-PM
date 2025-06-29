import React from 'react';
import { Tooltip, IconButton, Button } from '@mui/material';

const ActionTooltip = ({ 
  title, 
  tooltip, // backward compatibility
  children, 
  icon, // backward compatibility
  placement = 'top',
  arrow = true,
  component = 'iconButton', // 'iconButton', 'button', 'custom'
  onClick,
  disabled = false,
  color = 'default',
  size = 'small',
  sx = {},
  ...props 
}) => {
  // Backward compatibility
  const displayTitle = title || tooltip;
  const displayChildren = children || icon;
  const renderActionComponent = () => {
    if (component === 'iconButton') {
      return (
        <IconButton 
          onClick={onClick}
          disabled={disabled}
          size={size}
          sx={{ 
            color: color !== 'default' ? color : undefined,
            '&:hover': {
              backgroundPalette: color !== 'default' ? `${color}15` : undefined
            },
            ...sx 
          }}
          {...props}
        >
          {displayChildren}
        </IconButton>
      );
    }
    
    if (component === 'button') {
      return (
        <Button 
          onClick={onClick}
          disabled={disabled}
          size={size}
          color={color}
          sx={sx}
          {...props}
        >
          {displayChildren}
        </Button>
      );
    }
    
    // Custom component - just wrap with click handler
    return React.cloneElement(displayChildren, {
      onClick,
      disabled,
      ...props
    });
  };

  return (
    <Tooltip 
      title={disabled ? '' : displayTitle}
      placement={placement}
      arrow={arrow}
      enterDelay={500}
      leaveDelay={200}
    >
      <span>
        {renderActionComponent()}
      </span>
    </Tooltip>
  );
};

export default ActionTooltip;