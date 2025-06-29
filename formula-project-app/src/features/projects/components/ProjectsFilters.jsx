import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Chip,
  Stack,
  Collapse,
  IconButton
} from '@mui/material';
import {
  FaTimes as ClearIcon,
  FaFilter as FilterIcon,
  FaCalendarAlt as TodayIcon,
  FaCalendarWeek as DateRangeIcon,
  FaBuilding as BusinessIcon,
  FaUser as PersonIcon,
  FaTags as CategoryIcon,
  FaFlag as StatusIcon
} from 'react-icons/fa';

const ProjectsFilters = ({
  open,
  filters,
  onFiltersChange,
  onClearFilters,
  clients = [],
  teamMembers = [],
  projects = []
}) => {
  const statusOptions = [
    { value: 'on-tender', label: 'On Tender', color: '#3498db' },
    { value: 'awarded', label: 'Awarded', color: '#27ae60' },
    { value: 'on-hold', label: 'On Hold', color: '#f39c12' },
    { value: 'not-awarded', label: 'Not Awarded', color: '#e74c3c' },
    { value: 'active', label: 'Active', color: '#9b59b6' },
    { value: 'completed', label: 'Completed', color: '#2c3e50' }
  ];

  const typeOptions = [
    { value: 'general-contractor', label: 'General Contractor' },
    { value: 'fit-out', label: 'Fit-out' },
    { value: 'mep', label: 'MEP' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'millwork', label: 'Millwork' },
    { value: 'management', label: 'Management' }
  ];

  const quickFilters = [
    { 
      label: 'Active Projects', 
      filters: { status: 'active' },
      icon: <StatusIcon />,
      color: '#9b59b6'
    },
    { 
      label: 'On Tender', 
      filters: { status: 'on-tender' },
      icon: <StatusIcon />,
      color: '#3498db'
    },
    { 
      label: 'Completed', 
      filters: { status: 'completed' },
      icon: <StatusIcon />,
      color: '#2c3e50'
    },
    { 
      label: 'This Month', 
      filters: { 
        startDateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        startDateTo: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      },
      icon: <TodayIcon />,
      color: '#27ae60'
    },
    { 
      label: 'General Contractor', 
      filters: { type: 'general-contractor' },
      icon: <CategoryIcon />,
      color: '#e67e22'
    }
  ];

  const handleFilterChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };


  const handleQuickFilter = (quickFilter) => {
    onFiltersChange({
      ...filters,
      ...quickFilter.filters
    });
  };

  const handleClearField = (field) => {
    const newFilters = { ...filters };
    delete newFilters[field];
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key] && filters[key] !== ''
  );

  const getFilterCount = () => {
    return Object.keys(filters).filter(key => 
      filters[key] && filters[key] !== ''
    ).length;
  };

  return (
    <Collapse in={open}>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          border: '1px solid #E9ECEF',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            backgroundPalette: '#F8F9FA',
            borderBottom: '1px solid #E9ECEF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon color="action" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
              Project Filters
            </Typography>
            {getFilterCount() > 0 && (
              <Chip
                label={`${getFilterCount()} active`}
                size="small"
                sx={{
                  backgroundPalette: '#E67E22',
                  color: 'white',
                  fontWeight: 500
                }}
              />
            )}
          </Box>
          
          {hasActiveFilters && (
            <Button
              size="small"
              onClick={onClearFilters}
              startIcon={<ClearIcon />}
              sx={{ color: '#E74C3C' }}
            >
              Clear All
            </Button>
          )}
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Quick Filters */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#7F8C8D', fontWeight: 600 }}>
              Quick Filters
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {quickFilters.map((filter, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  startIcon={filter.icon}
                  onClick={() => handleQuickFilter(filter)}
                  sx={{
                    borderPalette: filter.color,
                    color: filter.color,
                    mb: 1,
                    '&:hover': {
                      backgroundPalette: filter.color,
                      color: 'white'
                    }
                  }}
                >
                  {filter.label}
                </Button>
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Detailed Filters */}
          <Typography variant="subtitle2" sx={{ mb: 2, color: '#7F8C8D', fontWeight: 600 }}>
            Advanced Filters
          </Typography>

          <Grid container spacing={3}>
            {/* Status Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Status"
                  startAdornment={<StatusIcon sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="">
                    <em>All Statuses</em>
                  </MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundPalette: option.color
                          }}
                        />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {filters.status && (
                  <IconButton
                    size="small"
                    onClick={() => handleClearField('status')}
                    sx={{ position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)' }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </FormControl>
            </Grid>

            {/* Type Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Project Type</InputLabel>
                <Select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  label="Project Type"
                  startAdornment={<CategoryIcon sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="">
                    <em>All Types</em>
                  </MenuItem>
                  {typeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {filters.type && (
                  <IconButton
                    size="small"
                    onClick={() => handleClearField('type')}
                    sx={{ position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)' }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </FormControl>
            </Grid>

            {/* Client Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Client</InputLabel>
                <Select
                  value={filters.client || ''}
                  onChange={(e) => handleFilterChange('client', e.target.value)}
                  label="Client"
                  startAdornment={<BusinessIcon sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="">
                    <em>All Clients</em>
                  </MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.companyName}
                    </MenuItem>
                  ))}
                </Select>
                {filters.client && (
                  <IconButton
                    size="small"
                    onClick={() => handleClearField('client')}
                    sx={{ position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)' }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </FormControl>
            </Grid>

            {/* Manager Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Project Manager</InputLabel>
                <Select
                  value={filters.manager || ''}
                  onChange={(e) => handleFilterChange('manager', e.target.value)}
                  label="Project Manager"
                  startAdornment={<PersonIcon sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="">
                    <em>All Managers</em>
                  </MenuItem>
                  {teamMembers
                    .filter(member => member.role === 'project_manager' || member.position.includes('Manager'))
                    .map((manager) => (
                      <MenuItem key={manager.id} value={manager.id}>
                        {manager.fullName}
                      </MenuItem>
                    ))}
                </Select>
                {filters.manager && (
                  <IconButton
                    size="small"
                    onClick={() => handleClearField('manager')}
                    sx={{ position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)' }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </FormControl>
            </Grid>

            {/* Date Range Filters */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#7F8C8D', fontWeight: 600 }}>
                Date Range Filters
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Start Date From"
                type="date"
                size="small"
                fullWidth
                value={filters.startDateFrom || ''}
                onChange={(e) => handleFilterChange('startDateFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <DateRangeIcon style={{ marginRight: 8, color: 'rgba(0, 0, 0, 0.54)' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Start Date To"
                type="date"
                size="small"
                fullWidth
                value={filters.startDateTo || ''}
                onChange={(e) => handleFilterChange('startDateTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <DateRangeIcon style={{ marginRight: 8, color: 'rgba(0, 0, 0, 0.54)' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="End Date From"
                type="date"
                size="small"
                fullWidth
                value={filters.endDateFrom || ''}
                onChange={(e) => handleFilterChange('endDateFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <DateRangeIcon style={{ marginRight: 8, color: 'rgba(0, 0, 0, 0.54)' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="End Date To"
                type="date"
                size="small"
                fullWidth
                value={filters.endDateTo || ''}
                onChange={(e) => handleFilterChange('endDateTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <DateRangeIcon style={{ marginRight: 8, color: 'rgba(0, 0, 0, 0.54)' }} />
                }}
              />
            </Grid>

            {/* Budget Range */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#7F8C8D', fontWeight: 600 }}>
                Budget Range
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Budget From"
                type="number"
                value={filters.budgetFrom || ''}
                onChange={(e) => handleFilterChange('budgetFrom', e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: '$'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Budget To"
                type="number"
                value={filters.budgetTo || ''}
                onChange={(e) => handleFilterChange('budgetTo', e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: '$'
                }}
              />
            </Grid>
          </Grid>

          {/* Results Summary */}
          {hasActiveFilters && (
            <Box sx={{ mt: 3, p: 2, backgroundPalette: '#F8F9FA', borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary">
                <strong>{getFilterCount()}</strong> filter(s) applied. 
                Click "Clear All" to reset all filters.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Collapse>
  );
};

export default ProjectsFilters;