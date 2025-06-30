import React, { useState, useCallback } from 'react';
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
  OutlinedInput,
  Slider,
  Switch,
  FormControlLabel,
  Autocomplete,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// Replace FluentUI imports with React Icons
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaSave, FaHistory, FaThumbtack } from 'react-icons/fa';
// Now using React Icons system
import { getConstructionIcon } from '../icons';

/**
 * UniversalFilters - Configurable filter system with multiple layouts
 * Layouts: dropdown, chips, sidebar
 * Integrates with construction industry context
 */
const UniversalFilters = ({
  // Core props
  filters = {},
  onFilterChange,
  onClearFilters,
  filterConfig = [],
  
  // Layout options
  layout = 'dropdown', // dropdown, chips, sidebar
  position = 'top', // top, right, left (for sidebar)
  
  // Features
  showQuickFilters = true,
  showActiveCount = true,
  showClearAll = true,
  showSaveFilters = true,
  collapsible = true,
  persistent = false, // Remember filter state
  
  // Quick filters
  quickFilters = [],
  onApplyQuickFilter,
  
  // Saved filters
  savedFilters = [],
  onSaveFilter,
  onLoadFilter,
  
  // Construction context
  useConstructionIcons = true,
  
  // Styling
  sx = {},
  
  // Callbacks
  onOpen,
  onClose
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [filterName, setFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Get active filters count
  const getActiveFiltersCount = useCallback(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (value instanceof Date) return true;
      if (typeof value === 'object' && value !== null) {
        return value.min !== undefined || value.max !== undefined;
      }
      return value !== '' && value !== null && value !== undefined;
    }).length;
  }, [filters]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    if (persistent) {
      localStorage.setItem(`filter_${key}`, JSON.stringify(value));
    }
    onFilterChange(key, value);
  }, [onFilterChange, persistent]);

  // Handle clear filter
  const handleClearFilter = useCallback((key) => {
    handleFilterChange(key, '');
  }, [handleFilterChange]);

  // Handle clear all filters
  const handleClearAllFilters = useCallback(() => {
    if (persistent) {
      filterConfig.forEach(config => {
        localStorage.removeItem(`filter_${config.key}`);
      });
    }
    onClearFilters();
  }, [onClearFilters, filterConfig, persistent]);

  // Toggle section expansion
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Handle save filter
  const handleSaveFilter = useCallback(() => {
    if (filterName && onSaveFilter) {
      onSaveFilter({
        name: filterName,
        filters: { ...filters },
        timestamp: new Date().toISOString()
      });
      setFilterName('');
      setShowSaveDialog(false);
    }
  }, [filterName, filters, onSaveFilter]);

  // Handle load filter
  const handleLoadFilter = useCallback((savedFilter) => {
    if (onLoadFilter) {
      onLoadFilter(savedFilter);
    }
  }, [onLoadFilter]);

  // Toggle filter panel
  const toggleFilterPanel = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (newState && onOpen) {
      onOpen();
    } else if (!newState && onClose) {
      onClose();
    }
  }, [isOpen, onOpen, onClose]);

  // Render filter field based on type
  const renderFilterField = useCallback((config) => {
    const { key, label, type, options, placeholder, min, max, step, multiple, groupBy } = config;
    const value = filters[key] || (type === 'multiselect' ? [] : '');
    
    // Get construction icon if enabled
    const icon = useConstructionIcons && config.icon 
      ? getConstructionIcon(config.icon, config.iconCategory || 'general')
      : null;

    const fieldProps = {
      size: 'small',
      fullWidth: true,
      value,
      onChange: (e) => handleFilterChange(key, e.target.value),
      ...(config.fieldProps || {})
    };

    switch (type) {
      case 'select':
        return (
          <FormControl {...fieldProps}>
            <InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {icon && <icon.icon style={{ fontSize: 16 }} />}
                {label}
              </Box>
            </InputLabel>
            <Select
              input={<OutlinedInput label={label} />}
              renderValue={(selected) => {
                const option = options.find(opt => opt.value === selected);
                return option ? option.label : selected;
              }}
            >
              <MenuItem value="">
                <em>All {label}</em>
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.icon && (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      {option.icon}
                    </Box>
                  )}
                  {option.label}
                  {option.count !== undefined && (
                    <Chip
                      label={option.count}
                      size="small"
                      sx={{ ml: 'auto', height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multiselect':
        return (
          <Autocomplete
            multiple
            options={options}
            getOptionLabel={(option) => option.label}
            value={options.filter(opt => value.includes(opt.value))}
            onChange={(e, newValue) => {
              handleFilterChange(key, newValue.map(v => v.value));
            }}
            groupBy={groupBy}
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {icon && <icon.icon style={{ fontSize: 16 }} />}
                    {label}
                  </Box>
                }
                placeholder={placeholder}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.icon && (
                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                    {option.icon}
                  </Box>
                )}
                {option.label}
              </Box>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.label}
                  size="small"
                  {...getTagProps({ index })}
                  icon={option.icon}
                />
              ))
            }
            {...fieldProps}
          />
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={label}
              value={value || null}
              onChange={(newValue) => handleFilterChange(key, newValue)}
              slotProps={{
                textField: fieldProps
              }}
            />
          </LocalizationProvider>
        );

      case 'daterange':
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={`${label} From`}
                value={value?.from || null}
                onChange={(newValue) => handleFilterChange(key, { ...value, from: newValue })}
                slotProps={{
                  textField: { ...fieldProps, sx: { flex: 1 } }
                }}
              />
              <DatePicker
                label={`${label} To`}
                value={value?.to || null}
                onChange={(newValue) => handleFilterChange(key, { ...value, to: newValue })}
                slotProps={{
                  textField: { ...fieldProps, sx: { flex: 1 } }
                }}
              />
            </LocalizationProvider>
          </Box>
        );

      case 'range':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {label}: {value?.min || min} - {value?.max || max}
            </Typography>
            <Slider
              value={[value?.min || min, value?.max || max]}
              onChange={(e, newValue) => {
                handleFilterChange(key, { min: newValue[0], max: newValue[1] });
              }}
              valueLabelDisplay="auto"
              min={min}
              max={max}
              step={step || 1}
              marks={config.marks}
            />
          </Box>
        );

      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(value)}
                onChange={(e) => handleFilterChange(key, e.target.checked)}
              />
            }
            label={label}
          />
        );

      case 'text':
      default:
        return (
          <TextField
            {...fieldProps}
            label={label}
            placeholder={placeholder}
            InputProps={{
              startAdornment: icon && (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  <icon.icon style={{ fontSize: 20, color: icon.color }} />
                </Box>
              )
            }}
          />
        );
    }
  }, [filters, handleFilterChange, useConstructionIcons]);

  // Render active filters as chips
  const renderActiveFilters = () => {
    const activeFilters = Object.entries(filters).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return value.min !== undefined || value.max !== undefined || value.from || value.to;
      }
      return value !== '' && value !== null && value !== undefined && value !== false;
    });

    if (activeFilters.length === 0) return null;

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {activeFilters.map(([key, value]) => {
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
          } else if (typeof value === 'object' && value !== null) {
            if (value.from || value.to) {
              displayValue = `${value.from ? new Date(value.from).toLocaleDateString() : '...'} - ${value.to ? new Date(value.to).toLocaleDateString() : '...'}`;
            } else if (value.min !== undefined || value.max !== undefined) {
              displayValue = `${value.min || config.min} - ${value.max || config.max}`;
            }
          } else if (typeof value === 'boolean') {
            displayValue = value ? 'Yes' : 'No';
          }

          return (
            <Chip
              key={key}
              label={`${config.label}: ${displayValue}`}
              onDelete={() => handleClearFilter(key)}
              color="primary"
              variant="outlined"
              size="small"
              icon={config.chipIcon}
            />
          );
        })}
        
        {showClearAll && activeFilters.length > 1 && (
          <Button
            size="small"
            onClick={handleClearAllFilters}
            startIcon={<FaTimes />}
            sx={{ textTransform: 'none' }}
          >
            Clear All
          </Button>
        )}
      </Box>
    );
  };

  // Render filter content
  const renderFilterContent = () => (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaFilter />
          Filters
          {showActiveCount && getActiveFiltersCount() > 0 && (
            <Chip label={getActiveFiltersCount()} size="small" color="primary" />
          )}
        </Typography>
        
        {layout === 'sidebar' && (
          <IconButton size="small" onClick={toggleFilterPanel}>
            <FaTimes />
          </IconButton>
        )}
      </Box>

      {/* Quick Filters */}
      {showQuickFilters && quickFilters.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Quick Filters
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {quickFilters.map((quickFilter) => (
              <Chip
                key={quickFilter.key}
                label={quickFilter.label}
                onClick={() => onApplyQuickFilter && onApplyQuickFilter(quickFilter)}
                variant="outlined"
                size="small"
                icon={quickFilter.icon}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  }
                }}
              />
            ))}
          </Box>
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}

      {/* Saved Filters */}
      {showSaveFilters && savedFilters.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Saved Filters
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {savedFilters.map((savedFilter) => (
              <Chip
                key={savedFilter.name}
                label={savedFilter.name}
                onClick={() => handleLoadFilter(savedFilter)}
                onDelete={() => onSaveFilter && onSaveFilter(null, savedFilter.name)}
                variant="filled"
                size="small"
                icon={<FaThumbtack />}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}

      {/* Active Filters */}
      {renderActiveFilters()}

      {/* Filter Fields */}
      <Grid container spacing={2}>
        {filterConfig.map((config) => {
          if (config.section && collapsible) {
            const isExpanded = expandedSections[config.section] !== false;
            
            return (
              <Grid item xs={12} key={config.section}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    py: 1
                  }}
                  onClick={() => toggleSection(config.section)}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {config.section}
                  </Typography>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </Box>
                <Collapse in={isExpanded}>
                  <Grid container spacing={2}>
                    {config.fields.map((field) => (
                      <Grid item xs={12} sm={6} md={layout === 'sidebar' ? 12 : 4} key={field.key}>
                        {renderFilterField(field)}
                      </Grid>
                    ))}
                  </Grid>
                </Collapse>
                <Divider sx={{ mt: 2 }} />
              </Grid>
            );
          }
          
          return (
            <Grid item xs={12} sm={6} md={layout === 'sidebar' ? 12 : 4} key={config.key}>
              {renderFilterField(config)}
            </Grid>
          );
        })}
      </Grid>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
        {showSaveFilters && (
          <Button
            startIcon={<FaSave />}
            onClick={() => setShowSaveDialog(true)}
            size="small"
            variant="outlined"
          >
            Save Filter
          </Button>
        )}
        {showClearAll && (
          <Button
            startIcon={<FaTimes />}
            onClick={handleClearAllFilters}
            size="small"
            variant="outlined"
            disabled={getActiveFiltersCount() === 0}
          >
            Clear All
          </Button>
        )}
      </Box>
    </Box>
  );

  // Render based on layout
  switch (layout) {
    case 'dropdown':
      return (
        <Collapse in={isOpen}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: 'grey.50',
              border: 1,
              borderColor: 'divider',
              ...sx
            }}
          >
            {renderFilterContent()}
          </Paper>
        </Collapse>
      );

    case 'chips':
      return (
        <Box sx={{ mb: 2, ...sx }}>
          {renderActiveFilters()}
          {!isOpen && getActiveFiltersCount() === 0 && (
            <Button
              startIcon={<FaFilter />
              onClick={toggleFilterPanel}
              size="small"
              variant="outlined"
            >
              Add Filters
            </Button>
          )}
        </Box>
      );

    case 'sidebar':
      return (
        <Drawer
          anchor={position}
          open={isOpen}
          onClose={toggleFilterPanel}
          PaperProps={{
            sx: {
              width: isMobile ? '100%' : 360,
              p: 3,
              ...sx
            }
          }}
        >
          {renderFilterContent()}
        </Drawer>
      );

    default:
      return null;
  }
};

export default UniversalFilters;