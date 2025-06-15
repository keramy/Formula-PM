import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';
import { components } from './components';

// Main Formula International Theme Configuration
export const formulaTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.primary.contrastText
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: colors.secondary.contrastText
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper
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

export default formulaTheme;