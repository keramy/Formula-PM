import { colors } from './colors';

// Material-UI Component Style Overrides
// Customize any MUI component styles here

export const components = {
  // Paper/Card components - Enhanced contrast, no movement animations
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
        border: '1px solid #c0c0c0', // Much stronger border
        transition: 'box-shadow 0.2s ease-in-out',
        backgroundColor: '#ffffff',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.16)', // No transform, just shadow
        }
      },
      elevation1: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12)',
        border: '1px solid #d0d0d0'
      },
      elevation2: {
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.14)',
        border: '1px solid #c0c0c0'
      },
      elevation3: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.16)',
        border: '1px solid #b0b0b0'
      }
    }
  },
  
  // Button components - No hover movement animations
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 500,
        padding: '8px 16px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // No transform
        }
      },
      contained: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }
      },
      outlined: {
        borderWidth: '2px', // Enhanced border for better contrast
        '&:hover': {
          borderWidth: '2px'
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
  
  // Card components - Enhanced contrast, no movement
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
        border: '1px solid #c0c0c0',
        backgroundColor: '#ffffff',
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.16)' // No transform
        }
      }
    }
  },

  // Typography - Enhanced contrast
  MuiTypography: {
    styleOverrides: {
      h1: {
        color: '#1a1a1a',
        fontWeight: 700
      },
      h2: {
        color: '#1a1a1a',
        fontWeight: 600
      },
      h3: {
        color: '#1a1a1a',
        fontWeight: 600
      },
      h4: {
        color: '#1a1a1a',
        fontWeight: 600
      },
      h5: {
        color: '#1a1a1a',
        fontWeight: 600
      },
      h6: {
        color: '#1a1a1a',
        fontWeight: 600
      },
      body1: {
        color: '#333333',
        lineHeight: 1.6
      },
      body2: {
        color: '#4a4a4a',
        lineHeight: 1.5
      },
      caption: {
        color: '#666666'
      },
      subtitle1: {
        color: '#1a1a1a',
        fontWeight: 500
      },
      subtitle2: {
        color: '#333333',
        fontWeight: 500
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
  
  // List components - Enhanced contrast
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        marginBottom: '4px',
        border: '1px solid transparent',
        '&:hover': {
          backgroundColor: `${colors.brand.navy}08`,
          border: `1px solid ${colors.brand.navy}20` // Enhanced border on hover
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
  
  // Table components - Enhanced contrast
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: `${colors.brand.navy}08`, // Darker hover background
          borderLeft: `3px solid ${colors.brand.navy}` // Enhanced border on hover
        }
      }
    }
  },
  
  // Table Header with better contrast
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-head': {
          backgroundColor: '#f8f9fa',
          borderBottom: '2px solid #e9ecef', // Thicker border
          fontWeight: 600,
          color: '#2c3e50'
        }
      }
    }
  },
  
  // Table Cell with enhanced borders
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: '1px solid #e9ecef' // Enhanced border
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