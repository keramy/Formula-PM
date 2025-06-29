import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const CleanPageLayout = ({ 
  title, 
  subtitle, 
  headerActions, 
  tabs,
  children,
  showProjectHeader = false,
  projectInfo = null
}) => {
  // Helper function to capitalize status
  const capitalizeStatus = (status) => {
    if (!status) return 'Active';
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };
  // Your color palette
  const colors = {
    background: '#FBFAF8',
    cardBackground: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    caramelEssence: '#E3AF64',
    sapphireDust: '#516AC8',
    cosmicOdyssey: '#0F1939',
    raptureLight: '#F6F3E7'
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundPalette: colors.background,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Page Header */}
      <Box sx={{ 
        backgroundPalette: colors.cardBackground,
        borderBottom: `1px solid ${colors.border}`,
        px: 3,
        py: 1.5
      }}>


        {/* Page Title and Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: tabs ? 2 : 0
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: subtitle ? 0.5 : 0 }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: '24px',
                  fontWeight: 600,
                  color: colors.cosmicOdyssey,
                  lineHeight: 1.2
                }}
              >
                {title}
              </Typography>
              {showProjectHeader && projectInfo && (
                <Chip
                  label={capitalizeStatus(projectInfo.status)}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '12px',
                    backgroundPalette: `${colors.caramelEssence}20`,
                    color: colors.caramelEssence,
                    border: 'none',
                    fontWeight: 600
                  }}
                />
              )}
            </Box>
            {subtitle && (
              <Typography sx={{ 
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: 1.4
              }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          
          {headerActions && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {headerActions}
            </Box>
          )}
        </Box>

        {/* Tabs */}
        {tabs && (
          <Box sx={{ 
            display: 'flex',
            gap: 0,
            borderBottom: `1px solid ${colors.border}`,
            overflow: 'auto'
          }}>
            {tabs}
          </Box>
        )}
      </Box>

      {/* Page Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

// Tab Component for consistent styling
export const CleanTab = ({ 
  label, 
  isActive = false, 
  onClick, 
  icon,
  badge
}) => {
  const colors = {
    textSecondary: '#6B7280',
    cosmicOdyssey: '#0F1939',
    caramelEssence: '#E3AF64',
    border: '#E5E7EB'
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1.5,
        cursor: 'pointer',
        borderBottom: isActive ? `2px solid ${colors.caramelEssence}` : '2px solid transparent',
        color: isActive ? colors.cosmicOdyssey : colors.textSecondary,
        fontSize: '14px',
        fontWeight: isActive ? 600 : 500,
        transition: 'all 0.2s ease',
        '&:hover': {
          color: colors.cosmicOdyssey,
          backgroundPalette: 'rgba(246, 243, 231, 0.5)'
        }
      }}
    >
      {icon}
      {label}
      {badge && (
        <Chip
          label={badge}
          size="small"
          sx={{
            height: 16,
            fontSize: '10px',
            backgroundPalette: colors.caramelEssence,
            color: 'white',
            '& .MuiChip-label': { px: 1 }
          }}
        />
      )}
    </Box>
  );
};

export default CleanPageLayout;