import React from 'react';
import { Box, Typography, Chip, Breadcrumbs as MUIBreadcrumbs, Link } from '@mui/material';
import { MdHome as HomeIcon, MdArrowForward as ChevronRightIcon } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const CleanPageLayout = ({ 
  title, 
  subtitle, 
  headerActions, 
  tabs,
  children,
  showProjectHeader = false,
  projectInfo = null,
  breadcrumbs = [],
  description = null
}) => {
  const navigate = useNavigate();
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
        py: 1.5
      }}>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <MUIBreadcrumbs
              separator={<ChevronRightIcon fontSize="small" sx={{ color: colors.textMuted }} />}
              sx={{ 
                '& .MuiBreadcrumbs-ol': {
                  alignItems: 'center'
                }
              }}
            >
              {/* Home Link */}
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate('/dashboard')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: colors.textSecondary,
                  fontWeight: 600,
                  '&:hover': {
                    color: colors.caramelEssence
                  },
                  transition: 'color 0.2s ease'
                }}
              >
                <HomeIcon sx={{ mr: 0.5, fontSize: '18px' }} />
                Formula PM
              </Link>

              {/* Dynamic Breadcrumb Items */}
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                
                if (isLast) {
                  return (
                    <Typography 
                      key={index}
                      sx={{ 
                        color: colors.cosmicOdyssey, 
                        fontWeight: 700,
                        fontSize: '16px'
                      }}
                    >
                      {item.label}
                    </Typography>
                  );
                }

                return (
                  <Link
                    key={index}
                    underline="hover"
                    color="inherit"
                    onClick={() => item.href && navigate(item.href)}
                    sx={{
                      cursor: item.href ? 'pointer' : 'default',
                      fontSize: '16px',
                      color: colors.textSecondary,
                      fontWeight: 600,
                      '&:hover': {
                        color: item.href ? colors.caramelEssence : 'inherit'
                      },
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </MUIBreadcrumbs>
          </Box>
        )}

        {/* Page Title and Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: breadcrumbs.length > 0 ? 'flex-start' : 'center',
          mb: tabs ? 2 : 0
        }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: breadcrumbs.length > 0 ? 'flex-start' : 'center', 
              gap: breadcrumbs.length > 0 ? 3 : 2, 
              mb: subtitle ? 0.5 : 0,
              flexDirection: breadcrumbs.length > 0 ? 'row' : 'row'
            }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontSize: breadcrumbs.length > 0 ? '28px' : '24px',
                      fontWeight: 700,
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
                        backgroundColor: `${colors.caramelEssence}20`,
                        color: colors.caramelEssence,
                        border: 'none',
                        fontWeight: 600
                      }}
                    />
                  )}
                </Box>
                {subtitle && (
                  <Typography sx={{ 
                    fontSize: '15px',
                    color: colors.textSecondary,
                    lineHeight: 1.4,
                    fontWeight: 500
                  }}>
                    {subtitle}
                  </Typography>
                )}
              </Box>
              
              {/* Project Description beside breadcrumb area */}
              {description && breadcrumbs.length > 0 && (
                <Box sx={{ 
                  px: 3, 
                  py: 2, 
                  backgroundColor: colors.raptureLight,
                  borderRadius: 2,
                  border: `1px solid ${colors.border}`,
                  maxWidth: '400px',
                  ml: 2
                }}>
                  <Typography sx={{ 
                    fontSize: '14px',
                    color: colors.textPrimary,
                    lineHeight: 1.5,
                    fontWeight: 500
                  }}>
                    {description}
                  </Typography>
                </Box>
              )}
            </Box>
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