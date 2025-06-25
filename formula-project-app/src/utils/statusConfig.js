// Icon names for consistent reference
export const TASK_ICONS = {
  PENDING: 'Schedule',
  IN_PROGRESS: 'PlayArrow',
  COMPLETED: 'CheckCircle',
  ON_HOLD: 'Pause',
  CANCELLED: 'Cancel'
};

export const PROJECT_ICONS = {
  ON_TENDER: 'HourglassEmpty',
  AWARDED: 'Gavel',
  ACTIVE: 'Construction',
  ON_HOLD: 'Pause',
  COMPLETED: 'CheckCircle',
  NOT_AWARDED: 'Cancel'
};

export const PRIORITY_ICONS = {
  LOW: 'Flag',
  MEDIUM: 'Flag',
  HIGH: 'Warning',
  URGENT: 'PriorityHigh'
};

export const PROJECT_TYPE_ICONS = {
  GENERAL_CONTRACTOR: 'Business',
  MILLWORK: 'Build',
  ELECTRICAL: 'ElectricalServices',
  MEP: 'Engineering',
  MANAGEMENT: 'AccountTree'
};

// Standardized Task Status Configuration
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold',
  CANCELLED: 'cancelled'
};

export const taskStatusConfig = {
  [TASK_STATUS.PENDING]: {
    label: 'To Do',
    color: 'var(--construction-500)',
    bgColor: 'var(--construction-50)',
    borderColor: 'var(--construction-500)',
    iconName: TASK_ICONS.PENDING,
    textColor: 'var(--construction-600)'
  },
  [TASK_STATUS.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'var(--warning-500)',
    bgColor: 'var(--warning-50)',
    borderColor: 'var(--warning-500)',
    iconName: TASK_ICONS.IN_PROGRESS,
    textColor: 'var(--warning-500)'
  },
  [TASK_STATUS.COMPLETED]: {
    label: 'Completed',
    color: 'var(--success-500)',
    bgColor: 'var(--success-50)',
    borderColor: 'var(--success-500)',
    iconName: TASK_ICONS.COMPLETED,
    textColor: 'var(--success-500)'
  },
  [TASK_STATUS.ON_HOLD]: {
    label: 'On Hold',
    color: 'var(--gray-500)',
    bgColor: 'var(--gray-50)',
    borderColor: 'var(--gray-500)',
    iconName: TASK_ICONS.ON_HOLD,
    textColor: 'var(--gray-600)'
  },
  [TASK_STATUS.CANCELLED]: {
    label: 'Cancelled',
    color: 'var(--error-500)',
    bgColor: 'var(--error-50)',
    borderColor: 'var(--error-500)',
    iconName: TASK_ICONS.CANCELLED,
    textColor: 'var(--error-500)'
  }
};

// Standardized Project Status Configuration
export const PROJECT_STATUS = {
  ON_TENDER: 'on-tender',
  AWARDED: 'awarded',
  ACTIVE: 'active',
  ON_HOLD: 'on-hold',
  COMPLETED: 'completed',
  NOT_AWARDED: 'not-awarded'
};

export const projectStatusConfig = {
  [PROJECT_STATUS.ON_TENDER]: {
    label: 'On Tender',
    color: 'var(--construction-500)',
    bgColor: 'var(--construction-50)',
    borderColor: 'var(--construction-500)',
    iconName: PROJECT_ICONS.ON_TENDER,
    textColor: 'var(--construction-600)'
  },
  [PROJECT_STATUS.AWARDED]: {
    label: 'Awarded',
    color: 'var(--success-500)',
    bgColor: 'var(--success-50)',
    borderColor: 'var(--success-500)',
    iconName: PROJECT_ICONS.AWARDED,
    textColor: 'var(--success-500)'
  },
  [PROJECT_STATUS.ACTIVE]: {
    label: 'Active',
    color: 'var(--warning-500)',
    bgColor: 'var(--warning-50)',
    borderColor: 'var(--warning-500)',
    iconName: PROJECT_ICONS.ACTIVE,
    textColor: 'var(--warning-500)'
  },
  [PROJECT_STATUS.ON_HOLD]: {
    label: 'On Hold',
    color: 'var(--gray-500)',
    bgColor: 'var(--gray-50)',
    borderColor: 'var(--gray-500)',
    iconName: PROJECT_ICONS.ON_HOLD,
    textColor: 'var(--gray-600)'
  },
  [PROJECT_STATUS.COMPLETED]: {
    label: 'Completed',
    color: 'var(--success-500)',
    bgColor: 'var(--success-50)',
    borderColor: 'var(--success-500)',
    iconName: PROJECT_ICONS.COMPLETED,
    textColor: 'var(--success-500)'
  },
  [PROJECT_STATUS.NOT_AWARDED]: {
    label: 'Not Awarded',
    color: 'var(--error-500)',
    bgColor: 'var(--error-50)',
    borderColor: 'var(--error-500)',
    iconName: PROJECT_ICONS.NOT_AWARDED,
    textColor: 'var(--error-500)'
  }
};

// Standardized Priority Configuration
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const priorityConfig = {
  [PRIORITY.LOW]: {
    label: 'Low',
    color: 'var(--success-500)',
    bgColor: 'var(--success-50)',
    borderColor: 'var(--success-500)',
    iconName: PRIORITY_ICONS.LOW,
    textColor: 'var(--success-500)'
  },
  [PRIORITY.MEDIUM]: {
    label: 'Medium',
    color: 'var(--construction-500)',
    bgColor: 'var(--construction-50)',
    borderColor: 'var(--construction-500)',
    iconName: PRIORITY_ICONS.MEDIUM,
    textColor: 'var(--construction-600)'
  },
  [PRIORITY.HIGH]: {
    label: 'High',
    color: 'var(--warning-500)',
    bgColor: 'var(--warning-50)',
    borderColor: 'var(--warning-500)',
    iconName: PRIORITY_ICONS.HIGH,
    textColor: 'var(--warning-500)'
  },
  [PRIORITY.URGENT]: {
    label: 'Urgent',
    color: 'var(--error-500)',
    bgColor: 'var(--error-50)',
    borderColor: 'var(--error-500)',
    iconName: PRIORITY_ICONS.URGENT,
    textColor: 'var(--error-500)'
  }
};

// Standardized Project Type Configuration
export const PROJECT_TYPE = {
  GENERAL_CONTRACTOR: 'general-contractor',
  MILLWORK: 'millwork',
  ELECTRICAL: 'electrical',
  MEP: 'mep',
  MANAGEMENT: 'management'
};

export const projectTypeConfig = {
  [PROJECT_TYPE.GENERAL_CONTRACTOR]: {
    label: 'General Contractor',
    color: '#3498db',
    bgColor: '#ebf5fb',
    borderColor: '#3498db',
    iconName: PROJECT_TYPE_ICONS.GENERAL_CONTRACTOR,
    textColor: '#3498db'
  },
  [PROJECT_TYPE.MILLWORK]: {
    label: 'Millwork',
    color: '#8e44ad',
    bgColor: '#f4ecf7',
    borderColor: '#8e44ad',
    iconName: PROJECT_TYPE_ICONS.MILLWORK,
    textColor: '#8e44ad'
  },
  [PROJECT_TYPE.ELECTRICAL]: {
    label: 'Electrical',
    color: '#f1c40f',
    bgColor: '#fefbea',
    borderColor: '#f1c40f',
    iconName: PROJECT_TYPE_ICONS.ELECTRICAL,
    textColor: '#f1c40f'
  },
  [PROJECT_TYPE.MEP]: {
    label: 'MEP',
    color: '#e67e22',
    bgColor: '#fef5e7',
    borderColor: '#e67e22',
    iconName: PROJECT_TYPE_ICONS.MEP,
    textColor: '#e67e22'
  },
  [PROJECT_TYPE.MANAGEMENT]: {
    label: 'Management',
    color: '#2c3e50',
    bgColor: '#ecf0f1',
    borderColor: '#2c3e50',
    iconName: PROJECT_TYPE_ICONS.MANAGEMENT,
    textColor: '#2c3e50'
  }
};

// Utility Functions
export const normalizeTaskStatus = (status) => {
  if (!status) return TASK_STATUS.PENDING;
  
  // Handle legacy formats
  const statusMap = {
    'in_progress': TASK_STATUS.IN_PROGRESS,
    'in-progress': TASK_STATUS.IN_PROGRESS,
    'inprogress': TASK_STATUS.IN_PROGRESS,
    'todo': TASK_STATUS.PENDING,
    'to-do': TASK_STATUS.PENDING,
    'done': TASK_STATUS.COMPLETED,
    'complete': TASK_STATUS.COMPLETED
  };
  
  const normalizedStatus = status.toLowerCase().trim();
  return statusMap[normalizedStatus] || normalizedStatus;
};

export const normalizeProjectStatus = (status) => {
  if (!status) return PROJECT_STATUS.ON_TENDER;
  
  const statusMap = {
    'on_tender': PROJECT_STATUS.ON_TENDER,
    'not_awarded': PROJECT_STATUS.NOT_AWARDED,
    'on_hold': PROJECT_STATUS.ON_HOLD
  };
  
  const normalizedStatus = status.toLowerCase().trim();
  return statusMap[normalizedStatus] || normalizedStatus;
};

export const getTaskStatusConfig = (status) => {
  const normalizedStatus = normalizeTaskStatus(status);
  return taskStatusConfig[normalizedStatus] || taskStatusConfig[TASK_STATUS.PENDING];
};

export const getProjectStatusConfig = (status) => {
  const normalizedStatus = normalizeProjectStatus(status);
  return projectStatusConfig[normalizedStatus] || projectStatusConfig[PROJECT_STATUS.ON_TENDER];
};

export const getPriorityConfig = (priority) => {
  if (!priority) return priorityConfig[PRIORITY.MEDIUM];
  const normalizedPriority = priority.toLowerCase().trim();
  return priorityConfig[normalizedPriority] || priorityConfig[PRIORITY.MEDIUM];
};

export const getProjectTypeConfig = (type) => {
  if (!type) return projectTypeConfig[PROJECT_TYPE.GENERAL_CONTRACTOR];
  const normalizedType = type.toLowerCase().trim();
  return projectTypeConfig[normalizedType] || projectTypeConfig[PROJECT_TYPE.GENERAL_CONTRACTOR];
};

// Status checking utilities
export const isTaskCompleted = (status) => {
  return normalizeTaskStatus(status) === TASK_STATUS.COMPLETED;
};

export const isTaskInProgress = (status) => {
  return normalizeTaskStatus(status) === TASK_STATUS.IN_PROGRESS;
};

export const isTaskPending = (status) => {
  return normalizeTaskStatus(status) === TASK_STATUS.PENDING;
};

export const isProjectActive = (status) => {
  return normalizeProjectStatus(status) === PROJECT_STATUS.ACTIVE;
};

export const isProjectCompleted = (status) => {
  return normalizeProjectStatus(status) === PROJECT_STATUS.COMPLETED;
};

// Construction-specific status configurations
export const CONSTRUCTION_PHASE = {
  PLANNING: 'planning',
  PERMITTING: 'permitting', 
  DEMOLITION: 'demolition',
  FOUNDATION: 'foundation',
  FRAMING: 'framing',
  MEP_ROUGH: 'mep-rough',
  FINISHING: 'finishing',
  HANDOVER: 'handover'
};

export const constructionPhaseConfig = {
  [CONSTRUCTION_PHASE.PLANNING]: {
    label: 'Planning & Design',
    color: '#1976D2',
    bgColor: '#E3F2FD',
    borderColor: '#1976D2',
    iconName: 'DesignIdeas',
    textColor: '#1976D2'
  },
  [CONSTRUCTION_PHASE.PERMITTING]: {
    label: 'Permitting',
    color: '#F57C00',
    bgColor: '#FFF3E0',
    borderColor: '#F57C00',
    iconName: 'DocumentApprove',
    textColor: '#F57C00'
  },
  [CONSTRUCTION_PHASE.DEMOLITION]: {
    label: 'Demolition',
    color: '#D32F2F',
    bgColor: '#FFEBEE',
    borderColor: '#D32F2F',
    iconName: 'Hammer',
    textColor: '#D32F2F'
  },
  [CONSTRUCTION_PHASE.FOUNDATION]: {
    label: 'Foundation',
    color: '#5D4037',
    bgColor: '#EFEBE9',
    borderColor: '#5D4037',
    iconName: 'Construction',
    textColor: '#5D4037'
  },
  [CONSTRUCTION_PHASE.FRAMING]: {
    label: 'Framing',
    color: '#8BC34A',
    bgColor: '#F1F8E9',
    borderColor: '#8BC34A',
    iconName: 'Build',
    textColor: '#8BC34A'
  },
  [CONSTRUCTION_PHASE.MEP_ROUGH]: {
    label: 'MEP Systems',
    color: '#FF9800',
    bgColor: '#FFF3E0',
    borderColor: '#FF9800',
    iconName: 'Engineering',
    textColor: '#FF9800'
  },
  [CONSTRUCTION_PHASE.FINISHING]: {
    label: 'Finishing',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    borderColor: '#9C27B0',
    iconName: 'PaintBrush',
    textColor: '#9C27B0'
  },
  [CONSTRUCTION_PHASE.HANDOVER]: {
    label: 'Handover',
    color: '#4CAF50',
    bgColor: '#E8F5E9',
    borderColor: '#4CAF50',
    iconName: 'Key',
    textColor: '#4CAF50'
  }
};

// Quality status configuration
export const QUALITY_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CONDITIONAL: 'conditional'
};

export const qualityStatusConfig = {
  [QUALITY_STATUS.PENDING]: {
    label: 'Pending Inspection',
    color: '#FF9800',
    bgColor: '#FFF3E0',
    borderColor: '#FF9800',
    iconName: 'Schedule',
    textColor: '#FF9800'
  },
  [QUALITY_STATUS.APPROVED]: {
    label: 'Approved',
    color: '#4CAF50',
    bgColor: '#E8F5E9',
    borderColor: '#4CAF50',
    iconName: 'CheckCircle',
    textColor: '#4CAF50'
  },
  [QUALITY_STATUS.REJECTED]: {
    label: 'Rejected',
    color: '#F44336',
    bgColor: '#FFEBEE',
    borderColor: '#F44336',
    iconName: 'Cancel',
    textColor: '#F44336'
  },
  [QUALITY_STATUS.CONDITIONAL]: {
    label: 'Conditional',
    color: '#FF5722',
    bgColor: '#FBE9E7',
    borderColor: '#FF5722',
    iconName: 'Warning',
    textColor: '#FF5722'
  }
};

// Safety level configuration
export const SAFETY_LEVEL = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
  CRITICAL: 'critical'
};

export const safetyLevelConfig = {
  [SAFETY_LEVEL.EXCELLENT]: {
    label: 'Excellent Safety',
    color: '#1e8449',
    bgColor: '#eafaf1',
    borderColor: '#1e8449',
    iconName: 'Shield',
    textColor: '#1e8449'
  },
  [SAFETY_LEVEL.GOOD]: {
    label: 'Good Safety',
    color: '#2874a6',
    bgColor: '#ebf5fb',
    borderColor: '#2874a6',
    iconName: 'Shield',
    textColor: '#2874a6'
  },
  [SAFETY_LEVEL.FAIR]: {
    label: 'Fair Safety',
    color: '#d68910',
    bgColor: '#fef9e7',
    borderColor: '#d68910',
    iconName: 'Warning',
    textColor: '#d68910'
  },
  [SAFETY_LEVEL.POOR]: {
    label: 'Poor Safety',
    color: '#ca6f1e',
    bgColor: '#fef5e7',
    borderColor: '#ca6f1e',
    iconName: 'Warning',
    textColor: '#ca6f1e'
  },
  [SAFETY_LEVEL.CRITICAL]: {
    label: 'Critical Safety',
    color: '#c0392b',
    bgColor: '#fdf2f2',
    borderColor: '#c0392b',
    iconName: 'PriorityHigh',
    textColor: '#c0392b'
  }
};

// Helper functions for construction-specific statuses
export const getConstructionPhaseConfig = (phase) => {
  if (!phase) return constructionPhaseConfig[CONSTRUCTION_PHASE.PLANNING];
  const normalizedPhase = phase.toLowerCase().trim().replace(/ /g, '-');
  return constructionPhaseConfig[normalizedPhase] || constructionPhaseConfig[CONSTRUCTION_PHASE.PLANNING];
};

export const getQualityStatusConfig = (status) => {
  if (!status) return qualityStatusConfig[QUALITY_STATUS.PENDING];
  const normalizedStatus = status.toLowerCase().trim();
  return qualityStatusConfig[normalizedStatus] || qualityStatusConfig[QUALITY_STATUS.PENDING];
};

export const getSafetyLevelConfig = (level) => {
  if (!level) return safetyLevelConfig[SAFETY_LEVEL.GOOD];
  const normalizedLevel = level.toLowerCase().trim();
  return safetyLevelConfig[normalizedLevel] || safetyLevelConfig[SAFETY_LEVEL.GOOD];
};

// Get all available options for dropdowns
export const getTaskStatusOptions = () => {
  return Object.values(TASK_STATUS).map(status => ({
    value: status,
    label: taskStatusConfig[status].label,
    color: taskStatusConfig[status].color
  }));
};

export const getProjectStatusOptions = () => {
  return Object.values(PROJECT_STATUS).map(status => ({
    value: status,
    label: projectStatusConfig[status].label,
    color: projectStatusConfig[status].color
  }));
};

export const getPriorityOptions = () => {
  return Object.values(PRIORITY).map(priority => ({
    value: priority,
    label: priorityConfig[priority].label,
    color: priorityConfig[priority].color
  }));
};

export const getProjectTypeOptions = () => {
  return Object.values(PROJECT_TYPE).map(type => ({
    value: type,
    label: projectTypeConfig[type].label,
    color: projectTypeConfig[type].color
  }));
};

export const getConstructionPhaseOptions = () => {
  return Object.values(CONSTRUCTION_PHASE).map(phase => ({
    value: phase,
    label: constructionPhaseConfig[phase].label,
    color: constructionPhaseConfig[phase].color
  }));
};

export const getQualityStatusOptions = () => {
  return Object.values(QUALITY_STATUS).map(status => ({
    value: status,
    label: qualityStatusConfig[status].label,
    color: qualityStatusConfig[status].color
  }));
};

export const getSafetyLevelOptions = () => {
  return Object.values(SAFETY_LEVEL).map(level => ({
    value: level,
    label: safetyLevelConfig[level].label,
    color: safetyLevelConfig[level].color
  }));
};