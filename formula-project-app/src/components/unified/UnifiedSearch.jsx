import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  CircularProgress,
  Divider,
  Fade,
  ClickAwayListener
} from '@mui/material';
import {
  Search20Regular as SearchIcon,
  Dismiss20Regular as ClearIcon,
  ArrowRight20Regular as ArrowIcon,
  Folder20Regular as FolderIcon,
  Task20Regular as TaskIcon,
  Person20Regular as PersonIcon,
  Building20Regular as BuildingIcon,
  Document20Regular as DocumentIcon,
  Tag20Regular as TagIcon
} from '@fluentui/react-icons';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * UnifiedSearch - Centralized search component with live results and keyboard navigation
 * Features:
 * - 300ms debouncing
 * - Keyboard navigation (arrows, enter, escape)
 * - Accessibility (ARIA labels, screen reader support)
 * - Live search results dropdown
 * - Search history (optional)
 */
const UnifiedSearch = ({
  // Core props
  value = '',
  onChange,
  onSearch,
  onResultSelect,
  placeholder = "Search...",
  
  // Search configuration
  searchDelay = 300,
  minSearchLength = 2,
  maxResults = 8,
  
  // Features
  showHistory = true,
  showCategories = true,
  liveSearch = true,
  
  // Data source
  searchFunction, // Async function that returns search results
  categories = ['all', 'projects', 'tasks', 'team', 'clients', 'documents'],
  
  // Styling
  variant = 'default', // default, compact, minimal
  sx = {},
  
  // Accessibility
  ariaLabel = "Search",
  ariaDescribedBy
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);
  const debouncedSearchTerm = useDebounce(internalValue, searchDelay);

  // Category icons mapping
  const categoryIcons = {
    all: SearchIcon,
    projects: FolderIcon,
    tasks: TaskIcon,
    team: PersonIcon,
    clients: BuildingIcon,
    documents: DocumentIcon,
    default: TagIcon
  };

  // Result type colors
  const typeColors = {
    project: '#2196F3',
    task: '#FF9800',
    team: '#4CAF50',
    client: '#9C27B0',
    document: '#795548',
    default: '#607D8B'
  };

  // Load search history from localStorage
  useEffect(() => {
    if (showHistory) {
      const history = localStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    }
  }, [showHistory]);

  // Update internal value when external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Perform search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= minSearchLength && liveSearch) {
      performSearch(debouncedSearchTerm);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedSearchTerm, selectedCategory, minSearchLength, liveSearch]);

  // Perform search
  const performSearch = useCallback(async (searchTerm) => {
    if (!searchFunction) return;
    
    setIsSearching(true);
    setIsOpen(true);
    
    try {
      const searchResults = await searchFunction(searchTerm, {
        category: selectedCategory,
        maxResults
      });
      
      setResults(searchResults || []);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchFunction, selectedCategory, maxResults]);

  // Handle input change
  const handleInputChange = useCallback((event) => {
    const newValue = event.target.value;
    setInternalValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  // Handle search submit
  const handleSearchSubmit = useCallback((event) => {
    event.preventDefault();
    
    if (internalValue.trim()) {
      // Add to search history
      if (showHistory) {
        const newHistory = [internalValue, ...searchHistory.filter(h => h !== internalValue)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      }
      
      // Trigger search
      if (onSearch) {
        onSearch(internalValue, { category: selectedCategory });
      }
      
      setIsOpen(false);
    }
  }, [internalValue, selectedCategory, searchHistory, showHistory, onSearch]);

  // Handle result selection
  const handleResultSelect = useCallback((result, index) => {
    setSelectedIndex(index);
    setIsOpen(false);
    
    if (onResultSelect) {
      onResultSelect(result);
    }
    
    // Clear search after selection
    setInternalValue('');
    if (onChange) {
      onChange('');
    }
  }, [onResultSelect, onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (!isOpen || results.length === 0) {
      if (event.key === 'Enter') {
        handleSearchSubmit(event);
      }
      return;
    }
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
        
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultSelect(results[selectedIndex], selectedIndex);
        } else {
          handleSearchSubmit(event);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        searchInputRef.current?.blur();
        break;
        
      default:
        break;
    }
  }, [isOpen, results, selectedIndex, handleResultSelect, handleSearchSubmit]);

  // Handle clear search
  const handleClear = useCallback(() => {
    setInternalValue('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (onChange) {
      onChange('');
    }
    
    searchInputRef.current?.focus();
  }, [onChange]);

  // Handle click away
  const handleClickAway = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  // Handle focus
  const handleFocus = useCallback(() => {
    if (internalValue.length >= minSearchLength && results.length > 0) {
      setIsOpen(true);
    }
  }, [internalValue, minSearchLength, results]);

  // Variant styles
  const variantStyles = {
    default: {
      minWidth: 300,
      height: 40
    },
    compact: {
      minWidth: 250,
      height: 36
    },
    minimal: {
      minWidth: 200,
      height: 32
    }
  };

  const getIcon = (type) => {
    const IconComponent = categoryIcons[type] || categoryIcons.default;
    return <IconComponent />;
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', ...sx }}>
        {/* Search Input */}
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: isOpen ? 'primary.main' : 'divider',
            borderRadius: 1,
            boxShadow: isOpen ? 1 : 0,
            transition: 'all 0.2s',
            ...variantStyles[variant],
            '&:hover': {
              borderColor: 'primary.light'
            }
          }}
        >
          <Box sx={{ p: 1, display: 'flex', color: 'text.secondary' }}>
            <SearchIcon />
          </Box>
          
          {showCategories && categories.length > 1 && (
            <>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.875rem',
                  color: 'inherit',
                  cursor: 'pointer',
                  outline: 'none',
                  padding: '4px 8px'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <Divider orientation="vertical" flexItem />
            </>
          )}
          
          <InputBase
            ref={searchInputRef}
            value={internalValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            inputProps={{
              'aria-label': ariaLabel,
              'aria-describedby': ariaDescribedBy,
              'aria-autocomplete': 'list',
              'aria-expanded': isOpen,
              'aria-controls': 'search-results',
              role: 'combobox'
            }}
            sx={{
              ml: 1,
              flex: 1,
              fontSize: variant === 'minimal' ? '0.875rem' : '1rem'
            }}
          />
          
          {isSearching && (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          )}
          
          {internalValue && !isSearching && (
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{ mr: 0.5 }}
              aria-label="Clear search"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>

        {/* Search Results Dropdown */}
        <Fade in={isOpen}>
          <Paper
            id="search-results"
            ref={resultsRef}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 0.5,
              maxHeight: 400,
              overflow: 'auto',
              zIndex: 1300,
              boxShadow: 3,
              borderRadius: 1
            }}
            role="listbox"
            aria-label="Search results"
          >
            {results.length === 0 && !isSearching && internalValue.length >= minSearchLength ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  No results found for "{internalValue}"
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Try different keywords or filters
                </Typography>
              </Box>
            ) : (
              <List dense sx={{ py: 0 }}>
                {/* Search History */}
                {showHistory && searchHistory.length > 0 && !internalValue && (
                  <>
                    <ListItem sx={{ py: 0.5, px: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Recent Searches
                      </Typography>
                    </ListItem>
                    {searchHistory.map((historyItem, index) => (
                      <ListItem
                        key={`history-${index}`}
                        button
                        onClick={() => {
                          setInternalValue(historyItem);
                          if (onChange) onChange(historyItem);
                        }}
                        sx={{
                          py: 1,
                          px: 2,
                          '&:hover': { backgroundColor: 'action.hover' }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <SearchIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={historyItem} />
                      </ListItem>
                    ))}
                    <Divider />
                  </>
                )}
                
                {/* Search Results */}
                {results.map((result, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = categoryIcons[result.type] || categoryIcons.default;
                  const color = typeColors[result.type] || typeColors.default;
                  
                  return (
                    <ListItem
                      key={`${result.type}-${result.id}-${index}`}
                      button
                      selected={isSelected}
                      onClick={() => handleResultSelect(result, index)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': { backgroundColor: 'action.hover' },
                        '&.Mui-selected': {
                          backgroundColor: 'action.selected',
                          '&:hover': { backgroundColor: 'action.selected' }
                        }
                      }}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Icon style={{ color, fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {result.title || result.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip
                              label={result.type}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                backgroundColor: color,
                                color: 'white'
                              }}
                            />
                            {result.subtitle && (
                              <Typography variant="caption" color="textSecondary">
                                {result.subtitle}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ArrowIcon style={{ color: '#BDBDBD', fontSize: 16 }} />
                    </ListItem>
                  );
                })}
                
                {/* View All Results */}
                {results.length >= maxResults && (
                  <>
                    <Divider />
                    <ListItem
                      button
                      onClick={() => {
                        setIsOpen(false);
                        handleSearchSubmit(new Event('submit'));
                      }}
                      sx={{
                        py: 1,
                        px: 2,
                        backgroundColor: 'grey.50',
                        '&:hover': { backgroundColor: 'grey.100' }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: 'primary.main',
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
        </Fade>
      </Box>
    </ClickAwayListener>
  );
};

export default UnifiedSearch;