import { colors } from './colors';

// Material-UI Component Style Overrides
// Customize any MUI component styles here

export const components = {
  // Paper/Card components
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${colors.border.light}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-2px)'
        }
      },
      elevation1: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      },
      elevation2: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
      },
      elevation3: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }
    }
  },
  
  // Button components
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 500,
        padding: '8px 16px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }
      },
      contained: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }
      },
      outlined: {
        borderWidth: '1.5px',
        '&:hover': {
          borderWidth: '1.5px'
        }
      }
    }
  },
  
  // Chip components (for status badges)
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        fontWeight: 500,
        fontSize: '0.75rem',
        height: '24px'
      },
      colorPrimary: {
        backgroundColor: colors.brand.navy,
        color: colors.brand.cream
      },
      colorSecondary: {
        backgroundColor: colors.brand.cream,
        color: colors.brand.navy
      }
    }
  },
  
  // Card components
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${colors.border.light}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
        }
      }
    }
  },
  
  // Tab components
  MuiTabs: {
    styleOverrides: {
      root: {
        minHeight: '48px'
      },
      indicator: {
        backgroundColor: colors.brand.navy,
        height: '3px',
        borderRadius: '3px'
      }
    }
  },
  
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.875rem',
        minHeight: '48px',
        '&.Mui-selected': {
          color: colors.brand.navy,
          fontWeight: 600
        }
      }
    }
  },
  
  // Input components
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          '& fieldset': {
            borderColor: colors.border.medium
          },
          '&:hover fieldset': {
            borderColor: colors.brand.navy
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.brand.navy,
            borderWidth: '2px'
          }
        }
      }
    }
  },
  
  // Select components
  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: '8px'
      }
    }
  },
  
  // Progress components
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        height: '8px',
        borderRadius: '4px',
        backgroundColor: colors.border.light
      },
      bar: {
        borderRadius: '4px'
      }
    }
  },
  
  // List components
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        marginBottom: '4px',
        '&:hover': {
          backgroundColor: `${colors.brand.navy}08`
        }
      }
    }
  },
  
  // Dialog components
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
      }
    }
  },
  
  // Table components
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: `${colors.brand.navy}05`
        }
      }
    }
  },
  
  // Tooltip components
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: colors.text.light.primary,
        fontSize: '0.75rem',
        borderRadius: '6px'
      }
    }
  }
};

export default components;