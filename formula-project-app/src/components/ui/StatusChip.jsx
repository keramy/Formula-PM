import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import {
  Schedule,
  PlayArrow,
  CheckCircle,
  Pause,
  Cancel,
  HourglassEmpty,
  Gavel,
  Construction,
  Flag,
  Warning,
  PriorityHigh,
  Business,
  Build,
  ElectricalServices,
  Engineering,
  AccountTree
} from '@mui/icons-material';
import { 
  getTaskStatusConfig, 
  getProjectStatusConfig, 
  getPriorityConfig,
  getProjectTypeConfig 
} from '../../utils/statusConfig';

// Icon mapping
const ICON_MAP = {
  Schedule: Schedule,
  PlayArrow: PlayArrow,
  CheckCircle: CheckCircle,
  Pause: Pause,
  Cancel: Cancel,
  HourglassEmpty: HourglassEmpty,
  Gavel: Gavel,
  Construction: Construction,
  Flag: Flag,
  Warning: Warning,
  PriorityHigh: PriorityHigh,
  Business: Business,
  Build: Build,
  ElectricalServices: ElectricalServices,
  Engineering: Engineering,
  AccountTree: AccountTree
};

const StatusChip = ({ 
  type = 'task', // 'task', 'project', 'priority', 'projectType'
  status, 
  priority, // backward compatibility for PriorityChip
  size = 'small',
  variant = 'filled',
  showIcon = true,
  showTooltip = true,
  onClick,
  sx = {},
  ...props 
}) => {
  // Backward compatibility - determine type and status from component usage
  let actualType = type;
  let actualStatus = status || priority;
  
  // Handle backward compatibility based on how it's imported
  if (priority && !status) {
    actualType = 'priority';
    actualStatus = priority;
  }
  // Get the appropriate config based on type
  const getConfig = () => {
    switch (actualType) {
      case 'task':
        return getTaskStatusConfig(actualStatus);
      case 'project':
        return getProjectStatusConfig(actualStatus);
      case 'priority':
        return getPriorityConfig(actualStatus);
      case 'projectType':
        return getProjectTypeConfig(actualStatus);
      default:
        return getTaskStatusConfig(actualStatus);
    }
  };

  const config = getConfig();
  
  // Get the icon component from the icon name
  const IconComponent = config.iconName ? ICON_MAP[config.iconName] : null;
  const icon = showIcon && IconComponent ? React.createElement(IconComponent) : undefined;

  const chipProps = {
    label: config.label,
    size,
    variant,
    icon,
    onClick,
    sx: {
      backgroundColor: variant === 'filled' ? config.bgColor : 'transparent',
      color: config.textColor,
      border: variant === 'outlined' ? `1px solid ${config.borderColor}` : 'none',
      fontWeight: 600,
      '&:hover': onClick ? {
        backgroundColor: config.color,
        color: 'white',
        cursor: 'pointer'
      } : {},
      ...sx
    },
    ...props
  };

  const chip = <Chip {...chipProps} />;

  if (showTooltip) {
    return (
      <Tooltip 
        title={`${actualType === 'priority' ? 'Priority' : 'Status'}: ${config.label}`}
        arrow
        placement="top"
      >
        {chip}
      </Tooltip>
    );
  }

  return chip;
};

export default StatusChip;