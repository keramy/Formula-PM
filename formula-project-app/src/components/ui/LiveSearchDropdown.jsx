import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  InputBase,
  ClickAwayListener,
  Popper
} from '@mui/material';
import {
  MdSearch as SearchIcon,
  MdFolder as ProjectIcon,
  MdCheck as TaskIcon,
  MdPerson as PersonIcon,
  MdBusiness as ClientIcon,
  MdDesignServices as DrawingIcon,
  MdArchive as SpecIcon,
  MdDescription as ComplianceIcon,
  MdKeyboardArrowRight as ArrowIcon
} from 'react-icons/md';
import { useEnhancedSearch } from '../../hooks/useEnhancedSearch';
import { useAuthenticatedData } from '../../hooks/useAuthenticatedData';

const RESULT_ICONS = {
  project: ProjectIcon,
  task: TaskIcon,
  'team-member': PersonIcon,
  client: ClientIcon,
  'shop-drawing': DrawingIcon,
  specification: SpecIcon,
  compliance: ComplianceIcon
};

const RESULT_COLORS = {
  project: '#2196F3',
  task: '#FF9800',
  'team-member': '#4CAF50',
  client: '#9C27B0',
  'shop-drawing': '#FF5722',
  specification: '#607D8B',
  compliance: '#795548'
};

const MAX_RESULTS = 8;

const LiveSearchDropdown = ({ 
  value, 
  onChange, 
  onResultSelect, 
  onNavigate,
  sx = {},
  placeholder = "Search projects, tasks, team...",
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Get data from authenticated data hook
  const { projects, tasks, teamMembers, clients } = useAuthenticatedData();

  // Use the enhanced search hook
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching
  } = useEnhancedSearch(projects, tasks, teamMembers, clients);

  // Sync value with search term
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value, setSearchTerm]);

  // Simple navigation function
  const navigateToResult = useCallback((result) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
  }, [onResultSelect]);

  // Handle dropdown visibility
  useEffect(() => {
    if (value && value.trim().length > 0 && searchResults && Object.values(searchResults).some(arr => arr && arr.length > 0)) {
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setIsOpen(false);
    }
  }, [value, searchResults]);

  // Prepare limited results for dropdown
  const dropdownResults = useMemo(() => {
    if (!searchResults) return [];
    
    // Flatten all results from different categories
    const allResults = [];
    
    // Add projects
    if (searchResults.projects) {
      searchResults.projects.slice(0, 3).forEach(project => {
        allResults.push({
          ...project,
          type: 'project',
          icon: ProjectIcon,
          subtitle: `${project.type || 'Project'} • ${project.status || 'Active'}`,
          color: RESULT_COLORS.project
        });
      });
    }
    
    // Add tasks
    if (searchResults.tasks) {
      searchResults.tasks.slice(0, 2).forEach(task => {
        allResults.push({
          ...task,
          type: 'task',
          icon: TaskIcon,
          subtitle: `${task.priority || 'Normal'} • ${task.status || 'Open'}`,
          color: RESULT_COLORS.task
        });
      });
    }
    
    // Add team members
    if (searchResults.teamMembers) {
      searchResults.teamMembers.slice(0, 2).forEach(member => {
        allResults.push({
          ...member,
          type: 'team-member',
          icon: PersonIcon,
          title: member.fullName || member.name,
          subtitle: `${member.role || 'Team Member'} • ${member.department || 'General'}`,
          color: RESULT_COLORS['team-member']
        });
      });
    }
    
    // Add clients
    if (searchResults.clients) {
      searchResults.clients.slice(0, 1).forEach(client => {
        allResults.push({
          ...client,
          type: 'client',
          icon: ClientIcon,
          title: client.companyName || client.name,
          subtitle: `${client.industry || 'Business'} • ${client.status || 'Active'}`,
          color: RESULT_COLORS.client
        });
      });
    }
    
    return allResults.slice(0, MAX_RESULTS);
  }, [searchResults]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (!isOpen || dropdownResults.length === 0) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < dropdownResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : dropdownResults.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < dropdownResults.length) {
          handleResultClick(dropdownResults[selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        if (searchInputRef.current) {
          searchInputRef.current.blur();
        }
        break;
      default:
        break;
    }
  }, [isOpen, dropdownResults, selectedIndex]);

  // Handle result selection
  const handleResultClick = useCallback((result) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    
    // Call the navigation function
    if (navigateToResult) {
      navigateToResult(result);
    }
    
    // Call custom result select handler if provided
    if (onResultSelect) {
      onResultSelect(result);
    }
    
    // Clear search after selection
    if (onChange) {
      onChange('');
    }
  }, [navigateToResult, onResultSelect, onChange]);

  // Handle click away
  const handleClickAway = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  // Handle input focus
  const handleFocus = useCallback(() => {
    if (value && value.trim().length > 0 && dropdownResults.length > 0) {
      setIsOpen(true);
    }
  }, [value, dropdownResults.length]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', ...sx }}>
        {/* Search Input */}
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < dropdownResults.length) {
              handleResultClick(dropdownResults[selectedIndex]);
            }
          }}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 300,
            backgroundColor: '#F8F9FA',
            border: '1px solid #E9ECEF',
            borderRadius: 2,
            boxShadow: 'none',
            position: 'relative',
            ...(isOpen && {
              borderPalette: '#2196F3',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            })
          }}
        >
          <SearchIcon sx={{ p: '10px', color: '#7F8C8D' }} />
          <InputBase
            ref={searchInputRef}
            sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }}
            placeholder={placeholder}
            inputProps={{ 'aria-label': 'search' }}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            {...props}
          />
          {isSearching && (
            <CircularProgress size={20} sx={{ mr: 1, color: '#7F8C8D' }} />
          )}
        </Paper>

        {/* Dropdown Results */}
        {isOpen && (
          <Paper
            ref={dropdownRef}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1300,
              maxHeight: 400,
              overflow: 'auto',
              border: '1px solid #E9ECEF',
              borderTop: 'none',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {dropdownResults.length === 0 && !isSearching ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  No results found
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Try adjusting your search terms
                </Typography>
              </Box>
            ) : (
              <List dense sx={{ py: 0 }}>
                {dropdownResults.map((result, index) => {
                  const IconComponent = result.icon;
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <ListItem
                      key={`${result.type}-${result.id}-${index}`}
                      button
                      onClick={() => handleResultClick(result)}
                      selected={isSelected}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          backgroundColor: '#F5F5F5'
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#E3F2FD',
                          '&:hover': {
                            backgroundColor: '#BBDEFB'
                          }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <IconComponent 
                          sx={{ 
                            fontSize: 20, 
                            color: result.color 
                          }} 
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {result.title || result.name || result.description}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip
                              label={result.type.replace('-', ' ')}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                backgroundColor: result.color,
                                color: 'white',
                                textTransform: 'capitalize'
                              }}
                            />
                            <Typography variant="caption" color="textSecondary">
                              {result.subtitle}
                            </Typography>
                          </Box>
                        }
                      />
                      <ArrowIcon sx={{ color: '#BDBDBD', fontSize: 16 }} />
                    </ListItem>
                  );
                })}
                
                {/* Show "View all results" if there are more results */}
                {dropdownResults.length >= MAX_RESULTS && (
                  <>
                    <Divider />
                    <ListItem
                      button
                      onClick={() => {
                        setIsOpen(false);
                        // Trigger full search results dialog
                        if (onNavigate) {
                          onNavigate('full-search');
                        }
                      }}
                      sx={{
                        py: 1,
                        px: 2,
                        backgroundColor: '#FAFAFA',
                        '&:hover': {
                          backgroundColor: '#F5F5F5'
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500, 
                              color: '#2196F3',
                              textAlign: 'center'
                            }}
                          >
                            View all results
                          </Typography>
                        }
                      />
                    </ListItem>
                  </>
                )}
              </List>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default LiveSearchDropdown;