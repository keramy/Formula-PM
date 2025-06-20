// Formula International Color Palette
// Official Brand Colors - Light and Dark Mode Support

export const colors = {
  // Formula International Brand Colors
  brand: {
    navy: '#1B2951',        // Formula International Navy
    cream: '#E8E2D5',       // Formula International Cream
    lightBackground: '#FDFCFA', // Light mode background
    darkBackground: '#0F1729',  // Dark mode background
    lightCream: '#F5F2E8'   // Light cream for dark mode
  },
  
  // Light Mode Colors
  light: {
    primary: {
      main: '#1B2951',        // Navy
      light: '#3a4f7a',       // Lighter navy
      dark: '#0f1a2e',        // Darker navy
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#E8E2D5',        // Cream
      light: '#f0ebe0',       // Lighter cream
      dark: '#d4c9b5',        // Darker cream
      contrastText: '#1B2951'
    },
    background: {
      default: '#FDFCFA',     // Light background
      paper: '#ffffff',       // White paper
      sidebar: '#f8f6f3'      // Sidebar background
    }
  },
  
  // Dark Mode Colors
  dark: {
    primary: {
      main: '#F5F2E8',        // Light cream
      light: '#ffffff',       // White
      dark: '#e8e2d5',        // Cream
      contrastText: '#1B2951'
    },
    secondary: {
      main: '#1B2951',        // Navy
      light: '#3a4f7a',       // Lighter navy
      dark: '#0f1a2e',        // Darker navy
      contrastText: '#F5F2E8'
    },
    background: {
      default: '#0F1729',     // Dark background
      paper: '#1a2332',       // Dark paper
      sidebar: '#141e2e'      // Dark sidebar
    }
  },
  
  // Status Colors - Enhanced contrast
  status: {
    success: '#1e8449',     // Darker green for better contrast (was #27ae60)
    successLight: '#27ae60',
    successDark: '#186a3b',
    
    warning: '#d68910',     // Darker orange for better contrast (was #f39c12)
    warningLight: '#f39c12',
    warningDark: '#b7950b',
    
    error: '#c0392b',       // Darker red for better contrast (was #e74c3c)
    errorLight: '#e74c3c',
    errorDark: '#a93226',
    
    info: '#2874a6',        // Darker blue for better contrast (was #3498db)
    infoLight: '#3498db',
    infoDark: '#1f618d'
  },
  
  // Priority Colors - Enhanced contrast
  priority: {
    low: '#1e8449',         // Darker green for better contrast
    medium: '#d68910',      // Darker orange for better contrast
    high: '#ca6f1e',        // Darker orange for better contrast
    urgent: '#c0392b'       // Darker red for better contrast
  },
  
  // Project Type Colors
  projectTypes: {
    fitout: '#e67e22',      // Orange
    millwork: '#8e44ad',    // Purple
    electrical: '#f1c40f',  // Yellow
    mep: '#1abc9c',         // Teal
    management: '#37444B'   // Dark gray
  },
  
  // Text Colors (Light Mode)
  text: {
    light: {
      primary: '#1B2951',     // Navy text
      secondary: '#4a5568',   // Medium gray
      disabled: '#a0aec0',    // Light gray
      inverse: '#ffffff'      // White text
    },
    dark: {
      primary: '#F5F2E8',     // Light cream text
      secondary: '#a0aec0',   // Medium gray
      disabled: '#4a5568',    // Dark gray
      inverse: '#1B2951'      // Navy text
    }
  },
  
  // Border Colors - Enhanced contrast for better visual definition
  border: {
    light: '#c0c0c0',       // Stronger light border for better definition
    medium: '#a0a0a0',      // Stronger medium border 
    dark: '#808080',        // Stronger dark border
    divider: '#e0e0e0',     // Standard divider border
    focus: '#3498db',       // Focus state border
    hover: '#b0b0b0'        // Hover state border
  },
  
  // Construction-specific colors
  construction: {
    steel: '#708090',       // Steel gray
    wood: '#8B4513',        // Saddle brown
    glass: '#87CEEB',       // Sky blue
    concrete: '#696969',    // Dim gray
    
    // Construction phases
    planning: '#1976D2',    // Blue
    permitting: '#F57C00',  // Orange
    demolition: '#D32F2F',  // Red
    foundation: '#5D4037',  // Brown
    framing: '#8BC34A',     // Light green
    mep: '#FF9800',         // Orange
    finishing: '#9C27B0',   // Purple
    handover: '#4CAF50',    // Green
    
    // Safety levels
    safetyExcellent: '#1e8449',
    safetyGood: '#2874a6',
    safetyFair: '#d68910',
    safetyPoor: '#ca6f1e',
    safetyCritical: '#c0392b',
    
    // Quality status
    qualityApproved: '#4CAF50',
    qualityPending: '#FF9800',
    qualityRejected: '#F44336',
    qualityConditional: '#FF5722'
  }
};

// Color utility functions
export const getStatusColor = (status) => {
  const statusColors = {
    'pending': colors.text.light.secondary,
    'in_progress': colors.status.warning,
    'review': colors.status.info,
    'completed': colors.status.success,
    'cancelled': colors.status.error,
    'on_hold': colors.text.light.disabled
  };
  return statusColors[status] || colors.text.light.secondary;
};

export const getPriorityColor = (priority) => {
  return colors.priority[priority] || colors.priority.medium;
};

export const getProjectTypeColor = (type) => {
  return colors.projectTypes[type] || colors.brand.navy;
};

export default colors;