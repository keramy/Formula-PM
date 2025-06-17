// Formula International Color Palette
// Easy to modify - all colors defined in one place!

export const colors = {
  // Primary Brand Colors
  primary: {
    main: '#37444B',        // Formula International Dark Gray
    light: '#5a6b73',       // Lighter shade
    dark: '#1f2e35',        // Darker shade
    contrastText: '#ffffff'
  },
  
  // Secondary Brand Colors  
  secondary: {
    main: '#C0B19E',        // Formula International Beige
    light: '#d4c7b5',       // Lighter beige
    dark: '#a5967e',        // Darker beige
    contrastText: '#37444B'
  },
  
  // Background Colors
  background: {
    default: '#f8fafc',     // Light gray background
    paper: '#ffffff',       // White paper/card background
    dark: '#1a1a1a',        // Dark mode background
    sidebar: '#fafbfc'      // Sidebar background
  },
  
  // Status Colors
  status: {
    success: '#27ae60',     // Green for completed/success
    successLight: '#2ecc71',
    successDark: '#229954',
    
    warning: '#f39c12',     // Orange for warnings/in-progress
    warningLight: '#f1c40f',
    warningDark: '#e67e22',
    
    error: '#e74c3c',       // Red for errors/urgent
    errorLight: '#ec7063',
    errorDark: '#c0392b',
    
    info: '#3498db',        // Blue for info
    infoLight: '#5dade2',
    infoDark: '#2980b9'
  },
  
  // Priority Colors
  priority: {
    low: '#27ae60',         // Green
    medium: '#f39c12',      // Orange  
    high: '#e67e22',        // Dark orange
    urgent: '#e74c3c'       // Red
  },
  
  // Project Type Colors
  projectTypes: {
    fitout: '#e67e22',      // Orange
    millwork: '#8e44ad',    // Purple
    electrical: '#f1c40f',  // Yellow
    mep: '#1abc9c',         // Teal
    management: '#37444B'   // Dark gray
  },
  
  // Text Colors
  text: {
    primary: '#2c3e50',     // Dark blue-gray
    secondary: '#7f8c8d',   // Medium gray
    disabled: '#bdc3c7',    // Light gray
    inverse: '#ffffff'      // White text
  },
  
  // Border Colors
  border: {
    light: '#e2e8f0',       // Light border
    medium: '#cbd5e0',      // Medium border
    dark: '#a0aec0'         // Dark border
  },
  
  // Construction-specific colors
  construction: {
    steel: '#708090',       // Steel gray
    wood: '#8B4513',        // Saddle brown
    glass: '#87CEEB',       // Sky blue
    concrete: '#696969'     // Dim gray
  }
};

// Color utility functions
export const getStatusColor = (status) => {
  const statusColors = {
    'pending': colors.text.secondary,
    'in_progress': colors.status.warning,
    'review': colors.status.info,
    'completed': colors.status.success,
    'cancelled': colors.status.error,
    'on_hold': colors.text.disabled
  };
  return statusColors[status] || colors.text.secondary;
};

export const getPriorityColor = (priority) => {
  return colors.priority[priority] || colors.priority.medium;
};

export const getProjectTypeColor = (type) => {
  return colors.projectTypes[type] || colors.primary.main;
};

export default colors;