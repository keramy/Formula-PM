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
    color: '#d68910', // Enhanced contrast
    bgColor: '#fef9e7',
    borderColor: '#d68910',
    iconName: TASK_ICONS.PENDING,
    textColor: '#d68910'
  },
  [TASK_STATUS.IN_PROGRESS]: {
    label: 'In Progress',
    color: '#2874a6', // Enhanced contrast
    bgColor: '#ebf5fb',
    borderColor: '#2874a6',
    iconName: TASK_ICONS.IN_PROGRESS,
    textColor: '#2874a6'
  },
  [TASK_STATUS.COMPLETED]: {
    label: 'Completed',
    color: '#1e8449', // Enhanced contrast
    bgColor: '#eafaf1',
    borderColor: '#1e8449',
    iconName: TASK_ICONS.COMPLETED,
    textColor: '#1e8449'
  },
  [TASK_STATUS.ON_HOLD]: {
    label: 'On Hold',
    color: '#6c757d', // Enhanced contrast
    bgColor: '#f8f9fa',
    borderColor: '#6c757d',
    iconName: TASK_ICONS.ON_HOLD,
    textColor: '#6c757d'
  },
  [TASK_STATUS.CANCELLED]: {
    label: 'Cancelled',
    color: '#c0392b', // Enhanced contrast
    bgColor: '#fdf2f2',
    borderColor: '#c0392b',
    iconName: TASK_ICONS.CANCELLED,
    textColor: '#c0392b'
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
    color: '#d68910', // Enhanced contrast
    bgColor: '#fef9e7',
    borderColor: '#d68910',
    iconName: PROJECT_ICONS.ON_TENDER,
    textColor: '#d68910'
  },
  [PROJECT_STATUS.AWARDED]: {
    label: 'Awarded',
    color: '#1e8449', // Enhanced contrast
    bgColor: '#eafaf1',
    borderColor: '#1e8449',
    iconName: PROJECT_ICONS.AWARDED,
    textColor: '#1e8449'
  },
  [PROJECT_STATUS.ACTIVE]: {
    label: 'Active',
    color: '#2874a6', // Enhanced contrast
    bgColor: '#ebf5fb',
    borderColor: '#2874a6',
    iconName: PROJECT_ICONS.ACTIVE,
    textColor: '#2874a6'
  },
  [PROJECT_STATUS.ON_HOLD]: {
    label: 'On Hold',
    color: '#6c757d', // Enhanced contrast
    bgColor: '#f8f9fa',
    borderColor: '#6c757d',
    iconName: PROJECT_ICONS.ON_HOLD,
    textColor: '#6c757d'
  },
  [PROJECT_STATUS.COMPLETED]: {
    label: 'Completed',
    color: '#1e8449', // Enhanced contrast
    bgColor: '#eafaf1',
    borderColor: '#1e8449',
    iconName: PROJECT_ICONS.COMPLETED,
    textColor: '#1e8449'
  },
  [PROJECT_STATUS.NOT_AWARDED]: {
    label: 'Not Awarded',
    color: '#c0392b', // Enhanced contrast
    bgColor: '#fdf2f2',
    borderColor: '#c0392b',
    iconName: PROJECT_ICONS.NOT_AWARDED,
    textColor: '#c0392b'
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
    color: '#1e8449', // Enhanced contrast
    bgColor: '#eafaf1',
    borderColor: '#1e8449',
    iconName: PRIORITY_ICONS.LOW,
    textColor: '#1e8449'
  },
  [PRIORITY.MEDIUM]: {
    label: 'Medium',
    color: '#d68910', // Enhanced contrast
    bgColor: '#fef9e7',
    borderColor: '#d68910',
    iconName: PRIORITY_ICONS.MEDIUM,
    textColor: '#d68910'
  },
  [PRIORITY.HIGH]: {
    label: 'High',
    color: '#ca6f1e', // Enhanced contrast
    bgColor: '#fef5e7',
    borderColor: '#ca6f1e',
    iconName: PRIORITY_ICONS.HIGH,
    textColor: '#ca6f1e'
  },
  [PRIORITY.URGENT]: {
    label: 'Urgent',
    color: '#c0392b', // Enhanced contrast
    bgColor: '#fdf2f2',
    borderColor: '#c0392b',
    iconName: PRIORITY_ICONS.URGENT,
    textColor: '#c0392b'
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