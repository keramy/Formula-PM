import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Filter as FilterIcon,
  Download as DownloadIcon,
  Plus as AddIcon,
  List as TableViewIcon,
  ViewGrid as CardViewIcon,
  Xmark as ClearIcon
} from 'iconoir-react';

const ProjectsHeader = ({
  searchTerm,
  onSearchChange,
  onToggleFilters,
  onExportProjects,
  onCreateProject,
  viewMode,
  onViewModeChange,
  activeFilters = [],
  onClearFilter,
  projectsCount,
  filteredCount
}) => {
  const handleExport = () => {
    onExportProjects();
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600, 
            color: '#2C3E50',
            mb: 1
          }}
        >
          Projects Management
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#7F8C8D',
            mb: 2,
            maxWidth: '600px'
          }}
        >
          Manage and track all Formula International construction projects. 
          Monitor progress, assign teams, track budgets, and maintain client relationships 
          across all project phases from tender to completion.
        </Typography>
        
        {/* Project Stats */}
        <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#2C3E50', fontWeight: 600 }}>
              {filteredCount}
            </Typography>
            <Typography variant="caption" sx={{ color: '#7F8C8D' }}>
              Showing Projects
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: '#2C3E50', fontWeight: 600 }}>
              {projectsCount}
            </Typography>
            <Typography variant="caption" sx={{ color: '#7F8C8D' }}>
              Total Projects
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Controls Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        mb: 2
      }}>
        {/* Left Side - Search and Filters */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flex: 1,
          alignItems: 'center'
        }}>
          {/* Search Bar */}
          <TextField
            placeholder="Search projects..."
            value={searchTerm}
            onChange={onSearchChange}
            size="small"
            sx={{ 
              minWidth: { xs: '100%', sm: '300px' },
              '& .MuiOutlinedInput-root': {
                backgroundPalette: 'white'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={() => onSearchChange({ target: { value: '' } })}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Filter Button */}
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={onToggleFilters}
            sx={{ 
              minWidth: 'auto',
              px: 2
            }}
          >
            Filters
          </Button>
        </Box>

        {/* Right Side - Actions */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          alignItems: 'center'
        }}>
          {/* View Toggle */}
          <Box sx={{ 
            display: 'flex',
            border: '1px solid #E0E0E0',
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            <IconButton
              size="small"
              onClick={() => onViewModeChange('table')}
              sx={{
                backgroundPalette: viewMode === 'table' ? '#E67E22' : 'transparent',
                color: viewMode === 'table' ? 'white' : '#666',
                borderRadius: 0,
                '&:hover': {
                  backgroundPalette: viewMode === 'table' ? '#D35400' : '#f5f5f5'
                }
              }}
            >
              <TableViewIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onViewModeChange('cards')}
              sx={{
                backgroundPalette: viewMode === 'cards' ? '#E67E22' : 'transparent',
                color: viewMode === 'cards' ? 'white' : '#666',
                borderRadius: 0,
                '&:hover': {
                  backgroundPalette: viewMode === 'cards' ? '#D35400' : '#f5f5f5'
                }
              }}
            >
              <CardViewIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Export Button */}
          <Tooltip title="Export to Excel">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{ 
                color: '#27AE60',
                borderPalette: '#27AE60',
                '&:hover': {
                  backgroundPalette: '#27AE60',
                  color: 'white'
                }
              }}
            >
              Export
            </Button>
          </Tooltip>

          {/* Create Project Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateProject}
            sx={{
              backgroundPalette: '#E67E22',
              '&:hover': {
                backgroundPalette: '#D35400'
              },
              borderRadius: 2,
              px: 3
            }}
          >
            New Project
          </Button>
        </Box>
      </Box>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#7F8C8D', mb: 1 }}>
            Active Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={`${filter.label}: ${filter.value}`}
                onDelete={() => onClearFilter(filter.key)}
                size="small"
                sx={{
                  backgroundPalette: '#EBF3FD',
                  color: '#3498DB',
                  '& .MuiChip-deleteIcon': {
                    color: '#3498DB'
                  }
                }}
              />
            ))}
            {activeFilters.length > 1 && (
              <Button
                size="small"
                onClick={() => onClearFilter('all')}
                sx={{ 
                  color: '#E74C3C',
                  textTransform: 'none',
                  fontSize: '0.75rem'
                }}
              >
                Clear All
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ProjectsHeader;