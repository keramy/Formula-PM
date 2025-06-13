import React from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Chip,
  IconButton,
  Avatar,
  InputBase,
  Paper,
  AvatarGroup,
  Tooltip
} from '@mui/material';
import { 
  Search, 
  Add, 
  Share, 
  MoreHoriz,
  Star,
  StarBorder,
  Home,
  Business
} from '@mui/icons-material';

const EnhancedHeader = ({ 
  title, 
  breadcrumbs = [], 
  onSearch, 
  onAdd, 
  isStarred = false,
  onToggleStar,
  teamMembers = [],
  searchValue = '',
  onSearchChange,
  subtitle = '',
  showTeamAvatars = true,
  maxAvatars = 4
}) => {
  const displayMembers = teamMembers.slice(0, maxAvatars);
  const remainingCount = teamMembers.length - maxAvatars;

  const handleStarClick = () => {
    if (onToggleStar) {
      onToggleStar();
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: 'white',
      borderBottom: '1px solid #E9ECEF',
      px: 4,
      py: 3
    }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        sx={{ 
          mb: 2, 
          fontSize: '0.875rem',
          '& .MuiBreadcrumbs-separator': {
            color: '#7F8C8D'
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
            color: '#7F8C8D',
            '&:hover': { color: '#2C3E50' }
          }}
        >
          <Home sx={{ fontSize: 16 }} />
          Formula PM
        </Link>
        
        <Link 
          underline="hover" 
          color="inherit" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: '#7F8C8D',
            '&:hover': { color: '#2C3E50' }
          }}
        >
          <Business sx={{ fontSize: 16 }} />
          Team Space
        </Link>

        {breadcrumbs.map((crumb, index) => (
          <Link
            key={index}
            underline="hover"
            color="inherit"
            href={crumb.href || '#'}
            sx={{ 
              color: '#7F8C8D',
              '&:hover': { color: '#2C3E50' }
            }}
          >
            {crumb.label}
          </Link>
        ))}
        
        <Typography 
          color="text.primary" 
          fontWeight={500}
          sx={{ color: '#2C3E50' }}
        >
          {title}
        </Typography>
      </Breadcrumbs>

      {/* Main Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Title and Star */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#2C3E50',
                fontSize: '1.75rem'
              }}
            >
              {title}
            </Typography>
            
            <Tooltip title={isStarred ? "Remove from favorites" : "Add to favorites"}>
              <IconButton 
                size="small" 
                onClick={handleStarClick}
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
          </Box>

          {/* Subtitle */}
          {subtitle && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#7F8C8D',
                fontSize: '0.9rem',
                ml: 1
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Team Avatars */}
          {showTeamAvatars && teamMembers.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 3 }}>
              <AvatarGroup 
                max={maxAvatars}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    border: '2px solid white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      zIndex: 10
                    }
                  }
                }}
              >
                {displayMembers.map((member) => (
                  <Tooltip key={member.id} title={member.fullName}>
                    <Avatar
                      sx={{
                        bgcolor: member.roleColor || '#3498DB',
                        fontWeight: 600
                      }}
                    >
                      {member.initials}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
              
              {remainingCount > 0 && (
                <Tooltip title={`+${remainingCount} more team members`}>
                  <Chip 
                    label={`+${remainingCount}`}
                    size="small"
                    sx={{ 
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: '#ECF0F1',
                      color: '#2C3E50',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#D5DBDB'
                      }
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          )}
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Search */}
          <Paper
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 240,
              height: 38,
              px: 1.5,
              backgroundColor: '#F8F9FA',
              border: '1px solid #E9ECEF',
              borderRadius: 2,
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#FFFFFF',
                border: '1px solid #D5DBDB'
              },
              '&:focus-within': {
                backgroundColor: '#FFFFFF',
                border: '1px solid #3498DB',
                boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)'
              }
            }}
          >
            <Search sx={{ color: '#7F8C8D', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search in this space..."
              size="small"
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              sx={{ 
                flex: 1, 
                fontSize: '0.875rem',
                '& input::placeholder': {
                  color: '#95A5A6',
                  opacity: 1
                }
              }}
            />
          </Paper>

          {/* Action Buttons */}
          <Tooltip title="Share">
            <IconButton 
              sx={{ 
                backgroundColor: '#F8F9FA',
                border: '1px solid #E9ECEF',
                borderRadius: 2,
                width: 38,
                height: 38,
                '&:hover': { 
                  backgroundColor: '#ECF0F1',
                  border: '1px solid #D5DBDB'
                }
              }}
            >
              <Share sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Add New">
            <IconButton 
              onClick={onAdd}
              sx={{ 
                backgroundColor: '#3498DB', 
                color: 'white',
                borderRadius: 2,
                width: 38,
                height: 38,
                '&:hover': { 
                  backgroundColor: '#2980B9',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)'
                }
              }}
            >
              <Add sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="More options">
            <IconButton 
              sx={{ 
                backgroundColor: '#F8F9FA',
                border: '1px solid #E9ECEF',
                borderRadius: 2,
                width: 38,
                height: 38,
                '&:hover': { 
                  backgroundColor: '#ECF0F1',
                  border: '1px solid #D5DBDB'
                }
              }}
            >
              <MoreHoriz sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default EnhancedHeader;