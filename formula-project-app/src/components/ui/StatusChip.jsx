import React from 'react';
import { Chip, Tooltip } from '@mui/material';
// Iconoir icons - safe construction and status icons
import {
  Clock as Schedule,
  Play as PlayArrow,
  Check as CheckCircle,
  Pause,
  Xmark as Cancel,
  Clock as HourglassEmpty,
  Building as Gavel,
  Building as Construction,
  TriangleFlag as Flag,
  WarningTriangle as Warning,
  WarningCircle as PriorityHigh,
  Building as Business,
  Settings as Build,
  Flash as ElectricalServices,
  Building as Engineering,
  Group as AccountTree,
  DesignPencil as DesignServices,
  QrCode as DocumentScanner,
  Building as Foundation,
  Settings as HomeRepairService,
  Palette as FormatPaint,
  Key as VpnKey,
  Shield as Security
} from 'iconoir-react';
import { 
  getTaskStatusConfig, 
  getProjectStatusConfig, 
  getPriorityConfig,
  getProjectTypeConfig,
  getConstructionPhaseConfig,
  getQualityStatusConfig,
  getSafetyLevelConfig
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
  AccountTree: AccountTree,
  // Construction phase icons
  DesignIdeas: DesignServices,
  DocumentApprove: DocumentScanner,
  Hammer: Build,
  Foundation: Foundation,
  PaintBrush: FormatPaint,
  Key: VpnKey,
  Shield: Security
};

const StatusChip = ({ 
  type = 'task', // 'task', 'project', 'priority', 'projectType', 'phase', 'quality', 'safety'
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
      case 'phase':
      case 'constructionPhase':
        return getConstructionPhaseConfig(actualStatus);
      case 'quality':
      case 'qualityStatus':
        return getQualityStatusConfig(actualStatus);
      case 'safety':
      case 'safetyLevel':
        return getSafetyLevelConfig(actualStatus);
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

// Backward compatibility exports
export const PriorityChip = (props) => <StatusChip type="priority" {...props} />;
export const TaskStatusChip = (props) => <StatusChip type="task" {...props} />;
export const ProjectStatusChip = (props) => <StatusChip type="project" {...props} />;
export const ProjectTypeChip = (props) => <StatusChip type="projectType" {...props} />;

// Construction-specific chip exports
export const ConstructionPhaseChip = (props) => <StatusChip type="phase" {...props} />;
export const QualityStatusChip = (props) => <StatusChip type="quality" {...props} />;
export const SafetyLevelChip = (props) => <StatusChip type="safety" {...props} />;

export default StatusChip;