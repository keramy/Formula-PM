// Typography Configuration
// Easy to modify fonts, sizes, and text styles

export const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'Helvetica',
    'Arial',
    'sans-serif'
  ].join(','),
  
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  
  // Heading styles - Enhanced with colors
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    color: '#0F1939' // Cosmic Odyssey
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    color: '#0F1939' // Cosmic Odyssey
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    color: '#0F1939' // Cosmic Odyssey
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
    color: '#0F1939' // Cosmic Odyssey
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.5,
    color: '#1A1A1A' // Primary text
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    color: '#1A1A1A' // Primary text
  },
  
  // Body text styles - Enhanced with colors
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
    color: '#1A1A1A' // Primary text
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: '#6B7280' // Secondary text
  },
  
  // UI text styles
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.4
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  },
  
  // Button text
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    letterSpacing: '0.02em'
  }
};

export default typography;