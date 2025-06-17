import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';
import { components } from './components';

// Formula International Light Theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.light.primary.main,
      light: colors.light.primary.light,
      dark: colors.light.primary.dark,
      contrastText: colors.light.primary.contrastText
    },
    secondary: {
      main: colors.light.secondary.main,
      light: colors.light.secondary.light,
      dark: colors.light.secondary.dark,
      contrastText: colors.light.secondary.contrastText
    },
    background: {
      default: colors.light.background.default,
      paper: colors.light.background.paper
    },
    text: {
      primary: colors.text.light.primary,
      secondary: colors.text.light.secondary,
      disabled: colors.text.light.disabled
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

export default lightTheme;