import React from 'react';
import { Chip, Tooltip } from '@mui/material';
// Iconoir icons - safe construction and status icons
import {
  MdSchedule as Calendar,
  MdPlayArrow as Play,
  MdCheck as CheckCircle,
  MdPause as Pause,
  MdClose as XmarkCircle,
  MdSchedule as HourglassEmpty,
  MdBusiness as Gavel,
  MdBusiness as Construction,
  MdFlag as Flag,
  MdWarning as Warning,
  MdWarning as PriorityHigh,
  MdBusiness as Business,
  MdSettings as Build,
  MdElectricBolt as ElectricalServices,
  MdBusiness as Engineering,
  MdGroup as AccountTree,
  MdDesignServices as DesignServices,
  MdQrCodeScanner as DocumentScanner,
  MdBusiness as Foundation,
  MdSettings as HomeRepairService,
  MdPalette as FormatPaint,
  MdKey as Key,
  MdShield as Shield,
  MdClose as Xmark
} from 'react-icons/md';
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
  Calendar: Calendar,
  PlayArrow: Play,
  CheckCircle: CheckCircle,
  Pause: Pause,
  Cancel: Xmark,
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
  Key: Key,
  Shield: Shield
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
    className: `clean-chip ${actualType === 'task' ? `status-${actualStatus}` : actualType === 'project' ? `status-${actualStatus}` : actualType === 'priority' ? `priority-${actualStatus}` : ''}`,
    sx: {
      backgroundColor: variant === 'filled' ? config.bgPalette : 'transparent',
      color: config.textPalette,
      border: variant === 'outlined' ? `1px solid ${config.borderPalette}` : `1px solid ${config.borderPalette}`,
      fontWeight: 500,
      fontSize: 'var(--text-xs)',
      height: '22px',
      borderRadius: '6px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease',
      '& .MuiChip-icon': {
        fontSize: '14px',
        color: config.textPalette
      },
      '&:hover': onClick ? {
        backgroundColor: config.color,
        color: 'white',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      } : {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      },
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