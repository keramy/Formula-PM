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