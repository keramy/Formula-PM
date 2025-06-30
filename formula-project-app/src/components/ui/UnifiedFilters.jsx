import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  Grid,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput
} from '@mui/material';
import {
  DatePicker
} from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const UnifiedFilters = ({
  show,
  filters,
  onFilterChange,
  onClearFilters,
  onApplyQuickFilter,
  filterConfig,
  quickFilters = []
}) => {
  const handleFilterChange = (key, value) => {
    onFilterChange(key, value);
  };

  const handleClearFilter = (key) => {
    onFilterChange(key, '');
  };

  const renderFilterField = (config) => {
    const { key, label, type, options, placeholder } = config;
    const value = filters[key] || '';

    switch (type) {
      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              input={<OutlinedInput label={label} />}
            >
              <MenuItem value="">All {label}</MenuItem>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multiselect':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{label}</InputLabel>
            <Select
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              input={<OutlinedInput label={label} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((val) => {
                    const option = options.find(opt => opt.value === val);
                    return (
                      <Chip 
                        key={val} 
                        label={option ? option.label : val} 
                        size="small" 
                      />
                    );
                  })}
                </Box>
              )}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={label}
              value={value || null}
              onChange={(newValue) => handleFilterChange(key, newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true
                }
              }}
            />
          </LocalizationProvider>
        );

      case 'number':
        return (
          <TextField
            fullWidth
            size="small"
            label={label}
            type="number"
            value={value}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            placeholder={placeholder}
          />
        );

      case 'text':
      default:
        return (
          <TextField
            fullWidth
            size="small"
            label={label}
            value={value}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            placeholder={placeholder}
          />
        );
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (value instanceof Date) return true;
      return value !== '' && value !== null && value !== undefined;
    }).length;
  };

  return (
    <Collapse in={show}>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          backgroundColor: 'grey.50',
          border: 1,
          borderPalette: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3">
            Filters ({getActiveFiltersCount()} active)
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={onClearFilters}
            disabled={getActiveFiltersCount() === 0}
          >
            Clear All
          </Button>
        </Box>

        {/* Quick Filters */}
        {quickFilters.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Quick Filters
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {quickFilters.map((quickFilter) => (
                <Chip
                  key={quickFilter.key}
                  label={quickFilter.label}
                  onClick={() => onApplyQuickFilter(quickFilter)}
                  variant="outlined"
                  size="small"
                  sx={{ '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
                />
              ))}
            </Box>
            <Divider sx={{ mb: 2 }} />
          </>
        )}

        {/* Filter Fields */}
        <Grid container spacing={2}>
          {filterConfig.map((config) => (
            <Grid item xs={12} sm={6} md={4} key={config.key}>
              {renderFilterField(config)}
            </Grid>
          ))}
        </Grid>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Active Filters
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(filters).map(([key, value]) => {
                if (Array.isArray(value) && value.length === 0) return null;
                if (!value || value === '') return null;
                
                const config = filterConfig.find(c => c.key === key);
                if (!config) return null;

                let displayValue = value;
                if (Array.isArray(value)) {
                  displayValue = value.map(v => {
                    const option = config.options?.find(opt => opt.value === v);
                    return option ? option.label : v;
                  }).join(', ');
                } else if (config.options) {
                  const option = config.options.find(opt => opt.value === value);
                  displayValue = option ? option.label : value;
                } else if (value instanceof Date) {
                  displayValue = value.toLocaleDateString();
                }

                return (
                  <Chip
                    key={key}
                    label={`${config.label}: ${displayValue}`}
                    onDelete={() => handleClearFilter(key)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                );
              }).filter(Boolean)}
            </Box>
          </>
        )}
      </Paper>
    </Collapse>
  );
};

export default UnifiedFilters;