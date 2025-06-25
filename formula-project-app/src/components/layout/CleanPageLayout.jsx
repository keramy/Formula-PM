import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Chip } from '@mui/material';
import { Home, ArrowRight as ChevronRight } from 'iconoir-react';

const CleanPageLayout = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
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
      backgroundColor: colors.background,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Page Header */}
      <Box sx={{ 
        backgroundColor: colors.cardBackground,
        borderBottom: `1px solid ${colors.border}`,
        px: 3,
        py: 2
      }}>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumbs 
            separator={<ChevronRight sx={{ fontSize: 14 }} />}
            sx={{ 
              mb: 1,
              '& .MuiBreadcrumbs-separator': {
                color: colors.textMuted
              }
            }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '13px',
                color: colors.textSecondary,
                '&:hover': { color: colors.caramelEssence }
              }}
            >
              <Home sx={{ fontSize: 14 }} />
              Formula PM
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <Link
                key={index}
                underline="hover"
                color="inherit"
                href={crumb.href || '#'}
                sx={{
                  fontSize: '13px',
                  color: colors.textSecondary,
                  '&:hover': { color: colors.caramelEssence }
                }}
              >
                {crumb.label}
              </Link>
            ))}
          </Breadcrumbs>
        )}

        {/* Project Header (if applicable) */}
        {showProjectHeader && projectInfo && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 1,
            p: 2,
            backgroundColor: colors.raptureLight,
            borderRadius: 2,
            border: `1px solid ${colors.border}`
          }}>
            <Box sx={{
              width: 16,
              height: 16,
              borderRadius: 1,
              backgroundColor: colors.caramelEssence
            }} />
            <Typography sx={{ 
              fontSize: '14px', 
              fontWeight: 600,
              color: colors.cosmicOdyssey
            }}>
              {projectInfo.name}
            </Typography>
            <Chip
              label={capitalizeStatus(projectInfo.status)}
              size="small"
              sx={{
                height: 20,
                fontSize: '11px',
                backgroundColor: `${colors.caramelEssence}20`,
                color: colors.caramelEssence,
                border: 'none'
              }}
            />
          </Box>
        )}

        {/* Page Title and Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: tabs ? 2 : 0
        }}>
          <Box>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: '24px',
                fontWeight: 600,
                color: colors.cosmicOdyssey,
                mb: subtitle ? 0.5 : 0,
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>
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
          backgroundColor: 'rgba(246, 243, 231, 0.5)'
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
            backgroundColor: colors.caramelEssence,
            color: 'white',
            '& .MuiChip-label': { px: 1 }
          }}
        />
      )}
    </Box>
  );
};

export default CleanPageLayout;