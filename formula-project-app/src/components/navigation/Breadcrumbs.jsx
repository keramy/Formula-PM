import React from 'react';
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  Typography,
  Box,
  IconButton,
  Chip
} from '@mui/material';
// Iconoir icons - safe navigation icons
import {
  MdHome as HomeIcon,
  MdArrowForward as ChevronRightIcon,
  MdArrowBack as ArrowBackIcon,
  MdArrowForward as ArrowForwardIcon,
  MdEdit as EditIcon,
  MdSettings as SettingsIcon
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const Breadcrumbs = ({ 
  items = [], 
  onNavigate,
  showBackNext = false,
  onBack,
  onNext,
  canGoBack = false,
  canGoNext = false,
  currentSection = null,
  showProjectActions = false,
  onEditProject = null,
  onProjectSettings = null
}) => {
  const { user } = useAuth();
  
  // Formula PM theme colors
  const colors = {
    textPrimary: '#0F1939', // Cosmic Odyssey
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    caramelEssence: '#E3AF64',
    sapphireDust: '#516AC8',
    raptureLight: '#F6F3E7',
    border: '#E5E7EB'
  };

  const handleBreadcrumbClick = (item, index) => {
    if (item.href && onNavigate) {
      onNavigate(item.href, item);
    }
  };

  const getSectionIcon = (section) => {
    switch (section) {
      case 'overview': return '📊';
      case 'scope': return '📋';
      case 'drawings': return '🏗️';
      case 'specifications': return '📄';
      default: return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0 }}>
      {/* Back/Next Navigation */}
      {showBackNext && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={onBack}
            disabled={!canGoBack}
            sx={{
              border: `1px solid ${colors.border}`,
              borderRadius: 1.5,
              width: 32,
              height: 32,
              color: colors.textSecondary,
              '&:hover': {
                backgroundColor: colors.raptureLight,
                borderPalette: colors.caramelEssence,
                color: colors.textPrimary
              },
              '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed'
              }
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onNext}
            disabled={!canGoNext}
            sx={{
              border: `1px solid ${colors.border}`,
              borderRadius: 1.5,
              width: 32,
              height: 32,
              color: colors.textSecondary,
              '&:hover': {
                backgroundColor: colors.raptureLight,
                borderPalette: colors.caramelEssence,
                color: colors.textPrimary
              },
              '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed'
              }
            }}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Breadcrumb Navigation */}
      <MUIBreadcrumbs
        separator={<ChevronRightIcon fontSize="small" sx={{ color: colors.textMuted }} />}
        sx={{ flexGrow: 1 }}
      >
        {/* Home Link */}
        <Link
          underline="hover"
          color="inherit"
          onClick={() => onNavigate && onNavigate('/dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            color: colors.textSecondary,
            fontWeight: 500,
            '&:hover': {
              color: colors.caramelEssence
            },
            transition: 'color 0.2s ease'
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: '16px' }} />
          Formula PM
        </Link>

        {/* Dynamic Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          if (isLast) {
            return (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  sx={{ 
                    color: colors.textPrimary, 
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                >
                  {item.label}
                </Typography>
                {currentSection && (
                  <Chip
                    icon={<span style={{ fontSize: '0.8rem' }}>{getSectionIcon(currentSection)}</span>}
                    label={currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      height: 24, 
                      fontSize: '0.75rem',
                      borderPalette: colors.caramelEssence,
                      color: colors.caramelEssence,
                      backgroundColor: `${colors.caramelEssence}10`
                    }}
                  />
                )}
              </Box>
            );
          }

          return (
            <Link
              key={index}
              underline="hover"
              color="inherit"
              onClick={() => handleBreadcrumbClick(item, index)}
              sx={{
                cursor: item.href ? 'pointer' : 'default',
                fontSize: '14px',
                color: colors.textSecondary,
                fontWeight: 500,
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

      {/* Project Action Buttons */}
      {showProjectActions && (
        <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
          {onEditProject && (
            <IconButton
              size="small"
              onClick={onEditProject}
              sx={{
                border: `1px solid ${colors.border}`,
                borderRadius: 1.5,
                width: 32,
                height: 32,
                color: colors.textSecondary,
                '&:hover': {
                  backgroundColor: colors.raptureLight,
                  borderPalette: colors.caramelEssence,
                  color: colors.textPrimary
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onProjectSettings && (
            <IconButton
              size="small"
              onClick={onProjectSettings}
              sx={{
                border: `1px solid ${colors.border}`,
                borderRadius: 1.5,
                width: 32,
                height: 32,
                color: colors.textSecondary,
                '&:hover': {
                  backgroundColor: colors.raptureLight,
                  borderPalette: colors.caramelEssence,
                  color: colors.textPrimary
                }
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}

      {/* User Context Indicator */}
      {user && (
        <Chip
          label={user.role === 'admin' ? 'Admin View' : user.role === 'co_founder' ? 'Executive View' : 'PM View'}
          size="small"
          sx={{ 
            fontSize: '0.7rem', 
            height: 24,
            backgroundColor: user.role === 'admin' 
              ? '#fee2e2' 
              : user.role === 'co_founder' 
                ? colors.sapphireDust + '20'
                : colors.caramelEssence + '20',
            color: user.role === 'admin' 
              ? '#dc2626' 
              : user.role === 'co_founder' 
                ? colors.sapphireDust
                : colors.caramelEssence,
            border: `1px solid ${user.role === 'admin' 
              ? '#dc2626' 
              : user.role === 'co_founder' 
                ? colors.sapphireDust
                : colors.caramelEssence}`,
            fontWeight: 600
          }}
        />
      )}
    </Box>
  );
};

export default Breadcrumbs;