import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import {
  FormulaLogo,
  FormulaLogoCompact,
  FormulaLogoBranded,
  FormulaLogoAnimated,
  FormulaLogoWithTagline,
  FormulaLogoMinimal,
  FormulaLogoLoading
} from './index';

/**
 * Logo Examples Component
 * Demonstrates all available logo variants for development and testing
 * This component can be used for:
 * - Testing logo components
 * - Style guide documentation
 * - Visual regression testing
 * - Brand consistency validation
 */
const LogoExamples = ({ darkMode = false }) => {
  const handleLogoClick = (logoType) => {
    console.log(`Clicked ${logoType} logo`);
  };

  const exampleBoxStyle = {
    p: 3,
    borderRadius: 2,
    backgroundColor: darkMode ? '#1a2332' : '#ffffff',
    border: `1px solid ${darkMode ? '#566BA3' : '#D1D8E6'}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    minHeight: 120,
    justifyContent: 'center',
  };

  const titleStyle = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: darkMode ? '#F5F2E8' : '#1B2951',
    textAlign: 'center',
    mb: 2,
  };

  return (
    <Box sx={{ p: 4, backgroundColor: darkMode ? '#0F1729' : '#FDFCFA', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, color: darkMode ? '#F5F2E8' : '#1B2951', textAlign: 'center' }}>
        Formula International Logo System
      </Typography>
      
      <Grid container spacing={3}>
        {/* Main Logo - Horizontal */}
        <Grid item xs={12} md={6}>
          <Paper sx={exampleBoxStyle}>
            <Typography sx={titleStyle}>Main Logo - Horizontal</Typography>
            <FormulaLogo 
              variant="horizontal" 
              size="medium" 
              darkMode={darkMode}
              onClick={() => handleLogoClick('horizontal')}
            />
          </Paper>
        </Grid>

        {/* Main Logo - Vertical */}
        <Grid item xs={12} md={6}>
          <Paper sx={exampleBoxStyle}>
            <Typography sx={titleStyle}>Main Logo - Vertical</Typography>
            <FormulaLogo 
              variant="vertical" 
              size="medium" 
              darkMode={darkMode}
              onClick={() => handleLogoClick('vertical')}
            />
          </Paper>
        </Grid>

        {/* Compact Logo */}
        <Grid item xs={12} md={6}>
          <Paper sx={exampleBoxStyle}>
            <Typography sx={titleStyle}>Compact Logo (Sidebar)</Typography>
            <FormulaLogoCompact 
              darkMode={darkMode}
              onClick={() => handleLogoClick('compact')}
            />
          </Paper>
        </Grid>

        {/* Minimal Logo */}
        <Grid item xs={12} md={6}>
          <Paper sx={exampleBoxStyle}>
            <Typography sx={titleStyle}>Minimal Logo</Typography>
            <FormulaLogoMinimal 
              size="medium"
              darkMode={darkMode}
              onClick={() => handleLogoClick('minimal')}
            />
          </Paper>
        </Grid>

        {/* Branded Logos */}
        <Grid item xs={12} md={6}>
          <Paper sx={exampleBoxStyle}>
            <Typography sx={titleStyle}>Branded Logo - Navy</Typography>
            <FormulaLogoBranded 
              variant="navy"
              size="small"
              onClick={() => handleLogoClick('branded-navy')}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={exampleBoxStyle}>
            <Typography sx={titleStyle}>Branded Logo - Cream</Typography>
            <FormulaLogoBranded 
              variant="cream"
              size="small"
              onClick={() => handleLogoClick('branded-cream')}
            />
          </Paper>
        </Grid>

        {/* Animated Logo */}
        <Grid item xs={12} md={6}>
          <Paper sx={exampleBoxStyle}>
            <Typography sx={titleStyle}>Animated Logo</Typography>
            <FormulaLogoAnimated 
              size="medium"
              darkMode={darkMode}
              showPulse={true}
            />
          </Paper>
        </Grid>

        {/* Logo with Tagline */}
        <Grid item xs={12} md={6}>
          <Paper sx={exampleBoxStyle}>
            <Typography sx={titleStyle}>Logo with Tagline</Typography>
            <FormulaLogoWithTagline 
              size="small"
              darkMode={darkMode}
              tagline="Enterprise Project Management"
              onClick={() => handleLogoClick('with-tagline')}
            />
          </Paper>
        </Grid>

        {/* Loading Logo */}
        <Grid item xs={12}>
          <Paper sx={exampleBoxStyle}>
            <Typography sx={titleStyle}>Loading Logo</Typography>
            <FormulaLogoLoading 
              size="medium"
              darkMode={darkMode}
              loadingText="Initializing Application..."
            />
          </Paper>
        </Grid>

        {/* Size Variations */}
        <Grid item xs={12}>
          <Paper sx={{ ...exampleBoxStyle, minHeight: 200 }}>
            <Typography sx={titleStyle}>Size Variations</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: darkMode ? '#E8E2D5' : '#566BA3', mb: 1, display: 'block' }}>
                  Small
                </Typography>
                <FormulaLogo size="small" darkMode={darkMode} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: darkMode ? '#E8E2D5' : '#566BA3', mb: 1, display: 'block' }}>
                  Medium
                </Typography>
                <FormulaLogo size="medium" darkMode={darkMode} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: darkMode ? '#E8E2D5' : '#566BA3', mb: 1, display: 'block' }}>
                  Large
                </Typography>
                <FormulaLogo size="large" darkMode={darkMode} />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Usage Instructions */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: darkMode ? '#1a2332' : '#ffffff', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ color: darkMode ? '#F5F2E8' : '#1B2951', mb: 2 }}>
          Usage Instructions
        </Typography>
        <Typography variant="body2" sx={{ color: darkMode ? '#E8E2D5' : '#566BA3', mb: 1 }}>
          Import logo components: <code>import {'{ FormulaLogo }'} from '../components/branding';</code>
        </Typography>
        <Typography variant="body2" sx={{ color: darkMode ? '#E8E2D5' : '#566BA3', mb: 1 }}>
          Basic usage: <code>&lt;FormulaLogo size="medium" darkMode={'{false}'} /&gt;</code>
        </Typography>
        <Typography variant="body2" sx={{ color: darkMode ? '#E8E2D5' : '#566BA3' }}>
          All components support theme integration and customization via sx props.
        </Typography>
      </Box>
    </Box>
  );
};

export default LogoExamples;