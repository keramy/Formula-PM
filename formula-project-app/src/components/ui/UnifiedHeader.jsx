import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Chip,
  Typography,
  Tooltip,
  Badge
} from '@mui/material';
// Iconoir icons - safe header icons
import {
  MdSearch as SearchIcon,
  MdClose as ClearIcon,
  MdFilterList as FilterIcon,
  MdList as TableViewIcon,
  MdViewModule as CardViewIcon,
  MdDownload as ExportIcon,
  MdAdd as AddIcon
} from 'react-icons/md';

const UnifiedHeader = ({
  title,
  searchValue,
  onSearchChange,
  showFilters,
  onToggleFilters,
  activeFiltersCount,
  viewMode,
  onViewModeChange,
  onExport,
  onAdd,
  addButtonText = "Add New",
  exportButtonText = "Export",
  showAdd = true,
  showExport = true,
  showViewToggle = true,
  activeFilters = [],
  onClearFilter
}) => {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Title and Controls Row */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {showViewToggle && (
            <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Tooltip title="Card View">
                <IconButton
                  size="small"
                  onClick={() => onViewModeChange('card')}
                  sx={{
                    color: viewMode === 'card' ? 'primary.main' : 'text.secondary',
                    backgroundColor: viewMode === 'card' ? 'action.selected' : 'transparent',
                    borderRadius: '4px 0 0 4px'
                  }}
                >
                  <CardViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Table View">
                <IconButton
                  size="small"
                  onClick={() => onViewModeChange('table')}
                  sx={{
                    color: viewMode === 'table' ? 'primary.main' : 'text.secondary',
                    backgroundColor: viewMode === 'table' ? 'action.selected' : 'transparent',
                    borderRadius: '0 4px 4px 0'
                  }}
                >
                  <TableViewIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          
          {showExport && (
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={onExport}
              size="small"
            >
              {exportButtonText}
            </Button>
          )}
          
          {showAdd && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              size="small"
            >
              {addButtonText}
            </Button>
          )}
        </Box>
      </Box>

      {/* Search and Filter Controls Row */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap'
        }}
      >
        {/* Search Field */}
        <TextField
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          className="clean-input"
          sx={{ 
            minWidth: 300,
            flexGrow: 1,
            maxWidth: 400
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'var(--gray-400)', fontSize: 'var(--text-base)' }} />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* Filter Toggle Button */}
        <Badge badgeContent={activeFiltersCount} color="primary">
          <Button
            variant={showFilters ? "contained" : "outlined"}
            startIcon={<FilterIcon />}
            onClick={onToggleFilters}
            size="small"
          >
            Filters
          </Button>
        </Badge>
      </Box>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1, alignSelf: 'center' }}>
            Active filters:
          </Typography>
          {activeFilters.map((filter, index) => (
            <Chip
              key={index}
              label={`${filter.label}: ${filter.value}`}
              size="small"
              onDelete={() => onClearFilter && onClearFilter(filter.key)}
              color="primary"
              variant="outlined"
            />
          ))}
          {activeFilters.length > 1 && (
            <Button
              size="small"
              onClick={() => onClearFilter && onClearFilter('all')}
              sx={{ 
                color: 'error.main',
                textTransform: 'none',
                fontSize: '0.75rem',
                minWidth: 'auto',
                px: 1
              }}
            >
              Clear All
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UnifiedHeader;