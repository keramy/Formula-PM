import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  IconButton, 
  Menu, 
  MenuItem,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
// Iconoir icons - ultra-safe verified icons only
import {
  ViewGrid as ViewKanban,
  TableRows,
  Calendar as CalendarMonth,
  Calendar as Timeline,
  Cell2x2 as ViewModule,
  Menu as MoreHoriz,
  FilterList,
  ViewColumns2 as ViewColumn,
  ArrowUp as Sort,
  ShareAndroid as Share,
  Download as GetApp
} from 'iconoir-react';

const EnhancedTabSystem = ({ 
  currentView = 'table', 
  onViewChange, 
  onFilterToggle, 
  onCustomize,
  onExport,
  onSort,
  hasActiveFilters = false,
  activeFiltersCount = 0,
  title = "Projects"
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const views = [
    { 
      id: 'board', 
      label: 'Board', 
      icon: <ViewKanban />,
      description: 'Kanban-style task board'
    },
    { 
      id: 'table', 
      label: 'Table', 
      icon: <ViewColumn />,
      description: 'Detailed table view'
    },
    { 
      id: 'list', 
      label: 'List', 
      icon: <TableRows />,
      description: 'Compact list view'
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: <CalendarMonth />,
      description: 'Calendar timeline (Coming Soon)',
      disabled: true
    },
    { 
      id: 'gantt', 
      label: 'Gantt', 
      icon: <Timeline />,
      description: 'Project timeline chart'
    }
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewChange = (event, newValue) => {
    const selectedView = views.find(view => view.id === newValue);
    if (selectedView && !selectedView.disabled) {
      onViewChange(newValue);
    }
  };

  return (
    <Box sx={{ 
      borderBottom: 1, 
      borderColor: 'divider',
      backgroundColor: 'white',
      px: 3,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 56
    }}>
      {/* Left Side - View Tabs */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tabs 
          value={currentView} 
          onChange={handleViewChange}
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              color: '#7f8c8d',
              '&.Mui-selected': {
                color: '#2C3E50',
                fontWeight: 600
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#3498db',
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          {views.map((view) => (
            <Tab
              key={view.id}
              value={view.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {view.icon}
                  {view.label}
                  {view.disabled && (
                    <Chip 
                      label="Soon" 
                      size="small" 
                      sx={{ 
                        height: 16, 
                        fontSize: '0.6rem',
                        backgroundColor: '#f39c12',
                        color: 'white'
                      }} 
                    />
                  )}
                </Box>
              }
              disabled={view.disabled}
              sx={{ 
                gap: 1,
                opacity: view.disabled ? 0.5 : 1
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Right Side - Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <Chip
            label={`${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{
              height: 28,
              fontSize: '0.75rem',
              fontWeight: 500
            }}
          />
        )}

        {/* Filter Button */}
        <Tooltip title="Toggle Filters">
          <IconButton 
            onClick={onFilterToggle}
            size="small"
            sx={{ 
              color: hasActiveFilters ? 'primary.main' : 'text.secondary',
              backgroundColor: hasActiveFilters ? 'primary.50' : 'transparent',
              border: '1px solid',
              borderColor: hasActiveFilters ? 'primary.main' : '#E9ECEF',
              '&:hover': {
                backgroundColor: hasActiveFilters ? 'primary.100' : '#F8F9FA'
              }
            }}
          >
            <FilterList fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Sort Button (Table/List views only) */}
        {(currentView === 'table' || currentView === 'list') && (
          <Tooltip title="Sort Options">
            <IconButton 
              onClick={onSort}
              size="small"
              sx={{ 
                color: 'text.secondary',
                border: '1px solid #E9ECEF',
                '&:hover': { backgroundColor: '#F8F9FA' }
              }}
            >
              <Sort fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {/* Export Button */}
        <Tooltip title="Export Data">
          <IconButton 
            onClick={onExport}
            size="small"
            sx={{ 
              color: 'text.secondary',
              border: '1px solid #E9ECEF',
              '&:hover': { backgroundColor: '#F8F9FA' }
            }}
          >
            <GetApp fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Share Button */}
        <Tooltip title="Share View">
          <IconButton 
            size="small"
            sx={{ 
              color: 'text.secondary',
              border: '1px solid #E9ECEF',
              '&:hover': { backgroundColor: '#F8F9FA' }
            }}
          >
            <Share fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* More Options */}
        <Tooltip title="More Options">
          <IconButton 
            onClick={handleMenuOpen}
            size="small"
            sx={{ 
              color: 'text.secondary',
              border: '1px solid #E9ECEF',
              '&:hover': { backgroundColor: '#F8F9FA' }
            }}
          >
            <MoreHoriz fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { minWidth: 180, mt: 1 }
          }}
        >
          <MenuItem onClick={() => { onCustomize?.(); handleMenuClose(); }}>
            <ViewModule sx={{ mr: 2, fontSize: 20 }} />
            Customize View
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); }}>
            <Share sx={{ mr: 2, fontSize: 20 }} />
            Share View
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { onExport?.(); handleMenuClose(); }}>
            <GetApp sx={{ mr: 2, fontSize: 20 }} />
            Export Data
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); }}>
            <Timeline sx={{ mr: 2, fontSize: 20 }} />
            View Settings
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default EnhancedTabSystem;