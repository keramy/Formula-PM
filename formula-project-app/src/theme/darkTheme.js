import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';
import { components } from './components';

// Formula International Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.dark.primary.main,
      light: colors.dark.primary.light,
      dark: colors.dark.primary.dark,
      contrastText: colors.dark.primary.contrastText
    },
    secondary: {
      main: colors.dark.secondary.main,
      light: colors.dark.secondary.light,
      dark: colors.dark.secondary.dark,
      contrastText: colors.dark.secondary.contrastText
    },
    background: {
      default: colors.dark.background.default,
      paper: colors.dark.background.paper
    },
    text: {
      primary: colors.text.dark.primary,
      secondary: colors.text.dark.secondary,
      disabled: colors.text.dark.disabled
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
    // Dark theme specific overrides
    divider: 'rgba(245, 242, 232, 0.12)',
    action: {
      hover: 'rgba(245, 242, 232, 0.08)',
      selected: 'rgba(245, 242, 232, 0.16)',
      disabled: 'rgba(245, 242, 232, 0.3)',
      disabledBackground: 'rgba(245, 242, 232, 0.12)'
    }
  },
  typography,
  components: {
    ...components,
    // Dark theme specific component overrides
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          border: `1px solid rgba(245, 242, 232, 0.12)`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          border: `1px solid rgba(245, 242, 232, 0.12)`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: 'rgba(245, 242, 232, 0.23)'
            },
            '&:hover fieldset': {
              borderColor: colors.dark.primary.light
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.dark.primary.main,
              borderWidth: '2px'
            }
          }
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          marginBottom: '4px',
          '&:hover': {
            backgroundColor: 'rgba(245, 242, 232, 0.08)'
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(245, 242, 232, 0.05)'
          }
        }
      }
    }
  },
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

export default darkTheme;