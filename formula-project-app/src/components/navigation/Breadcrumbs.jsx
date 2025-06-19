import React from 'react';
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  Typography,
  Box,
  IconButton,
  Chip
} from '@mui/material';
import {
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Edit as EditIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
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
      case 'compliance': return '✅';
      default: return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      {/* Back/Next Navigation */}
      {showBackNext && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={onBack}
            disabled={!canGoBack}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
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
              border: '1px solid #e0e0e0',
              borderRadius: 1,
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
        separator={<ChevronRightIcon fontSize="small" />}
        sx={{ flexGrow: 1 }}
      >
        {/* Home Link */}
        <Link
          underline="hover"
          color="inherit"
          onClick={() => onNavigate && onNavigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
          Dashboard
        </Link>

        {/* Dynamic Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          if (isLast) {
            return (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography color="text.primary" fontWeight={600}>
                  {item.label}
                </Typography>
                {currentSection && (
                  <Chip
                    icon={<span style={{ fontSize: '0.8rem' }}>{getSectionIcon(currentSection)}</span>}
                    label={currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
                    size="small"
                    variant="outlined"
                    sx={{ height: 24, fontSize: '0.75rem' }}
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
                '&:hover': {
                  color: item.href ? 'primary.main' : 'inherit'
                }
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
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                width: 32,
                height: 32,
                '&:hover': {
                  backgroundColor: '#f5f5f5'
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
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                width: 32,
                height: 32,
                '&:hover': {
                  backgroundColor: '#f5f5f5'
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
          color={user.role === 'admin' ? 'error' : user.role === 'co_founder' ? 'secondary' : 'primary'}
          sx={{ fontSize: '0.7rem', height: 24 }}
        />
      )}
    </Box>
  );
};

export default Breadcrumbs;