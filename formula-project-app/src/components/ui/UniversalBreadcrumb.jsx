import React from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link, 
  IconButton,
  Paper,
  Chip,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Home,
  Business,
  ArrowBack,
  NavigateNext,
  Edit,
  Delete,
  Share,
  MoreHoriz,
  Star,
  StarBorder
} from '@mui/icons-material';

const UniversalBreadcrumb = ({ 
  // Navigation data
  currentPath = [],
  onNavigate,
  
  // Page info
  title,
  subtitle,
  itemType, // 'project', 'task', 'team', 'client'
  itemId,
  itemData = {},
  
  // Actions
  actions = [],
  onEdit,
  onDelete,
  onShare,
  showMoreActions = false,
  
  // Favorites
  isStarred = false,
  onToggleStar,
  
  // Mobile support
  showBackButton = true,
  
  // Custom styling
  backgroundColor = 'white',
  elevation = 0
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Generate breadcrumb items
  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      {
        label: 'Formula PM',
        icon: <Home sx={{ fontSize: 16 }} />,
        href: '/',
        onClick: () => onNavigate && onNavigate('/')
      },
      {
        label: 'Team Space',
        icon: <Business sx={{ fontSize: 16 }} />,
        href: '/dashboard',
        onClick: () => onNavigate && onNavigate('/dashboard')
      }
    ];

    // Add dynamic path items
    currentPath.forEach((pathItem, index) => {
      breadcrumbs.push({
        label: pathItem.label,
        href: pathItem.href,
        onClick: () => onNavigate && onNavigate(pathItem.href),
        isLast: index === currentPath.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  // Handle back navigation
  const handleBack = () => {
    if (currentPath.length > 0) {
      const previousPath = currentPath[currentPath.length - 1];
      if (onNavigate && previousPath.href) {
        onNavigate(previousPath.href);
      } else {
        window.history.back();
      }
    } else {
      window.history.back();
    }
  };

  // Action button configurations
  const actionButtons = [
    ...(actions || []),
    ...(onEdit ? [{ 
      icon: <Edit />, 
      label: 'Edit', 
      onClick: onEdit,
      color: 'primary'
    }] : []),
    ...(onShare ? [{ 
      icon: <Share />, 
      label: 'Share', 
      onClick: onShare,
      color: 'default'
    }] : []),
    ...(onDelete ? [{ 
      icon: <Delete />, 
      label: 'Delete', 
      onClick: onDelete,
      color: 'error'
    }] : [])
  ];

  return (
    <Paper
      elevation={elevation}
      sx={{
        backgroundColor,
        borderBottom: '1px solid #E9ECEF',
        px: { xs: 2, md: 4 },
        py: 3,
        borderRadius: 0
      }}
    >
      {/* Mobile Back Button */}
      {isMobile && showBackButton && (
        <Box sx={{ mb: 2 }}>
          <IconButton 
            onClick={handleBack}
            size="small"
            sx={{ 
              color: '#7F8C8D',
              '&:hover': { color: '#2C3E50' }
            }}
          >
            <ArrowBack />
          </IconButton>
        </Box>
      )}

      {/* Desktop Breadcrumbs */}
      {!isMobile && (
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />}
          sx={{ 
            mb: 2, 
            fontSize: '0.875rem',
            '& .MuiBreadcrumbs-separator': {
              color: '#7F8C8D'
            }
          }}
        >
          {breadcrumbItems.map((crumb, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            
            if (isLast) {
              return (
                <Typography 
                  key={index}
                  color="text.primary" 
                  fontWeight={500}
                  sx={{ 
                    color: '#2C3E50',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {crumb.icon}
                  {crumb.label}
                </Typography>
              );
            }

            return (
              <Link
                key={index}
                underline="hover"
                color="inherit"
                href={crumb.href || '#'}
                onClick={(e) => {
                  e.preventDefault();
                  if (crumb.onClick) crumb.onClick();
                }}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  color: '#7F8C8D',
                  cursor: 'pointer',
                  '&:hover': { color: '#2C3E50' }
                }}
              >
                {crumb.icon}
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Main Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'center' },
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 0 }
      }}>
        {/* Left Side - Title and Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {/* Title with Star */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#2C3E50',
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}
            >
              {title}
            </Typography>
            
            {onToggleStar && (
              <Tooltip title={isStarred ? "Remove from favorites" : "Add to favorites"}>
                <IconButton 
                  size="small" 
                  onClick={onToggleStar}
                  sx={{ 
                    color: isStarred ? '#F39C12' : '#BDC3C7',
                    '&:hover': {
                      color: isStarred ? '#E67E22' : '#F39C12'
                    }
                  }}
                >
                  {isStarred ? <Star /> : <StarBorder />}
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Subtitle and Metadata */}
          {(subtitle || itemData.status || itemData.type) && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              flexWrap: 'wrap',
              ml: { xs: 0, md: 2 }
            }}>
              {subtitle && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#7F8C8D',
                    fontSize: '0.9rem'
                  }}
                >
                  {subtitle}
                </Typography>
              )}
              
              {itemData.status && (
                <Chip 
                  label={itemData.status}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    backgroundColor: getStatusColor(itemData.status),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              )}
              
              {itemData.type && (
                <Chip 
                  label={itemData.type}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    borderColor: '#D5DBDB',
                    color: '#7F8C8D'
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Right Side - Actions */}
        {actionButtons.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            flexShrink: 0
          }}>
            {actionButtons.slice(0, isMobile ? 2 : 4).map((action, index) => (
              <Tooltip key={index} title={action.label}>
                <IconButton 
                  onClick={action.onClick}
                  size="small"
                  sx={{ 
                    backgroundColor: action.color === 'primary' ? '#3498DB' : '#F8F9FA',
                    color: action.color === 'primary' ? 'white' : 
                           action.color === 'error' ? '#E74C3C' : '#7F8C8D',
                    border: action.color === 'primary' ? 'none' : '1px solid #E9ECEF',
                    borderRadius: 2,
                    width: 36,
                    height: 36,
                    '&:hover': { 
                      backgroundColor: action.color === 'primary' ? '#2980B9' :
                                     action.color === 'error' ? '#fadbd8' : '#ECF0F1',
                      transform: 'translateY(-1px)',
                      boxShadow: action.color === 'primary' ? '0 4px 12px rgba(52, 152, 219, 0.3)' : 'none'
                    }
                  }}
                >
                  {action.icon}
                </IconButton>
              </Tooltip>
            ))}
            
            {(actionButtons.length > (isMobile ? 2 : 4) || showMoreActions) && (
              <Tooltip title="More options">
                <IconButton 
                  size="small"
                  sx={{ 
                    backgroundColor: '#F8F9FA',
                    border: '1px solid #E9ECEF',
                    borderRadius: 2,
                    width: 36,
                    height: 36,
                    '&:hover': { 
                      backgroundColor: '#ECF0F1',
                      border: '1px solid #D5DBDB'
                    }
                  }}
                >
                  <MoreHoriz sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

// Helper function to get status colors
const getStatusColor = (status) => {
  const statusColors = {
    'completed': '#27AE60',
    'active': '#8E44AD',
    'in-progress': '#F39C12',
    'in_progress': '#F39C12',
    'pending': '#3498DB',
    'on-hold': '#E67E22',
    'on_hold': '#E67E22',
    'cancelled': '#E74C3C',
    'awarded': '#27AE60',
    'on-tender': '#3498DB',
    'on_tender': '#3498DB',
    'not-awarded': '#E74C3C',
    'not_awarded': '#E74C3C'
  };
  
  return statusColors[status?.toLowerCase()] || '#95A5A6';
};

export default UniversalBreadcrumb;