import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';
import { components } from './components';

// Create theme function that supports both light and dark modes
export const createFormulaTheme = (mode = 'light') => {
  const themeColors = mode === 'dark' ? colors.dark : colors.light;
  const textColors = mode === 'dark' ? colors.text.dark : colors.text.light;
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: themeColors.primary.main,
        light: themeColors.primary.light,
        dark: themeColors.primary.dark,
        contrastText: themeColors.primary.contrastText
      },
      secondary: {
        main: themeColors.secondary.main,
        light: themeColors.secondary.light,
        dark: themeColors.secondary.dark,
        contrastText: themeColors.secondary.contrastText
      },
      background: {
        default: themeColors.background.default,
        paper: themeColors.background.paper
      },
      text: {
        primary: textColors.primary,
        secondary: textColors.secondary,
        disabled: textColors.disabled
      },
      success: {
        main: colors.status.success,
        light: colors.status.successLight,
        dark: colors.status.successDark
      },
      warning: {
        main: colors.status.warning,
        light: colors.status.warningLight,
        dark: colors.status.warningDark
      },
      error: {
        main: colors.status.error,
        light: colors.status.errorLight,
        dark: colors.status.errorDark
      },
      info: {
        main: colors.status.info,
        light: colors.status.infoLight,
        dark: colors.status.infoDark
      },
      // Custom Formula colors
      formulaBrand: {
        navy: colors.brand.navy,
        cream: colors.brand.cream,
        lightBackground: colors.brand.lightBackground,
        darkBackground: colors.brand.darkBackground,
        lightCream: colors.brand.lightCream
      }
    },
    typography,
    components,
    shape: {
      borderRadius: 12
    },
    spacing: 8,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920
      }
    }
  });
};

// Default light theme for backward compatibility
export const formulaTheme = createFormulaTheme('light');

// Export both themes
export const formulaLightTheme = createFormulaTheme('light');
export const formulaDarkTheme = createFormulaTheme('dark');

// Export individual themes (backward compatibility)
export { default as lightTheme } from './theme';
export { default as darkTheme } from './darkTheme';

// Export theme utilities
export { colors, typography, components };

// Theme utility functions
export const getTheme = (mode = 'light') => {
  return createFormulaTheme(mode);
};

export const toggleTheme = (currentMode) => {
  return currentMode === 'light' ? 'dark' : 'light';
};

// Export color utilities
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

export default formulaTheme;