/**
 * Enhanced Global Search Component
 * Integrates with backend search API and provides real-time search
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Fade,
  Popper,
  ClickAwayListener,
  useTheme
} from '@mui/material';
import {
  MdSearch as SearchIcon,
  MdClose as CloseIcon,
  MdCheck as TaskIcon,
  MdBusiness as ProjectIcon,
  MdPerson as PersonIcon,
  MdDescription as FileIcon,
  MdChat as CommentIcon
} from 'react-icons/md';
import { useDebounce } from '../../hooks/useDebounce';
import apiService from '../../services/api/apiService';

const EnhancedGlobalSearch = ({ 
  onResultClick, 
  placeholder = "Search projects, tasks, people...",
  width = 300,
  maxResults = 8
}) => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Perform search when debounced value changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchValue.trim() || debouncedSearchValue.length < 2) {
        setResults([]);
        setOpen(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchResults = await apiService.globalSearch(debouncedSearchValue, {
          limit: maxResults,
          types: ['projects', 'tasks', 'users', 'files', 'comments']
        });

        setResults(searchResults.results || []);
        setOpen(true);
      } catch (err) {
        console.error('Search error:', err);
        setError('Search failed. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchValue, maxResults]);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleResultClick = (result) => {
    setSearchValue('');
    setOpen(false);
    if (onResultClick) {
      onResultClick(result);
    } else {
      // Default navigation behavior
      navigateToResult(result);
    }
  };

  const navigateToResult = (result) => {
    switch (result.type) {
      case 'project':
        window.location.href = `/projects/${result.id}`;
        break;
      case 'task':
        window.location.href = `/projects/${result.projectId}?task=${result.id}`;
        break;
      case 'user':
        window.location.href = `/team/${result.id}`;
        break;
      case 'file':
        window.location.href = `/projects/${result.projectId}/files/${result.id}`;
        break;
      case 'comment':
        window.location.href = `/projects/${result.projectId}?comment=${result.id}`;
        break;
      default:
        console.warn('Unknown result type:', result.type);
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'project':
        return <ProjectIcon color="primary" />;
      case 'task':
        return <TaskIcon color="secondary" />;
      case 'user':
        return <PersonIcon color="info" />;
      case 'file':
        return <FileIcon color="warning" />;
      case 'comment':
        return <CommentIcon color="success" />;
      default:
        return <SearchIcon />;
    }
  };

  const getResultTypeLabel = (type) => {
    switch (type) {
      case 'project': return 'Project';
      case 'task': return 'Task';
      case 'user': return 'Person';
      case 'file': return 'File';
      case 'comment': return 'Comment';
      default: return 'Result';
    }
  };

  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <Box 
          key={index} 
          component="span" 
          sx={{ 
            backgroundColor: 'primary.light',
            color: 'primary.contrastText',
            px: 0.5,
            borderRadius: 0.5,
            fontWeight: 600
          }}
        >
          {part}
        </Box>
      ) : part
    );
  };

  const clearSearch = () => {
    setSearchValue('');
    setResults([]);
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative' }}>
        <Paper
          ref={searchRef}
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: width,
            height: 40,
            px: 1.5,
            backgroundColor: theme.palette.action.hover,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: theme.palette.action.selected,
              border: `1px solid ${theme.palette.primary.light}`
            },
            '&:focus-within': {
              backgroundColor: theme.palette.action.selected,
              border: `1px solid ${theme.palette.primary.main}`,
              boxShadow: `0 0 0 3px ${theme.palette.action.focus}`
            }
          }}
        >
          <SearchIcon sx={{ 
            color: theme.palette.text.secondary, 
            mr: 1, 
            fontSize: 20 
          }} />
          
          <InputBase
            placeholder={placeholder}
            size="small"
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => {
              if (results.length > 0) {
                setOpen(true);
              }
            }}
            sx={{ 
              flex: 1, 
              fontSize: '0.875rem',
              color: theme.palette.text.primary,
              '& input::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 0.7
              }
            }}
          />

          {loading && (
            <CircularProgress size={16} sx={{ mr: 1 }} />
          )}

          {searchValue && !loading && (
            <IconButton
              size="small"
              onClick={clearSearch}
              sx={{ 
                p: 0.5,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>

        <Popper
          open={open && (results.length > 0 || error)}
          anchorEl={searchRef.current}
          placement="bottom-start"
          style={{ width: width, zIndex: 1300 }}
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
          ]}
        >
          <Fade in={open}>
            <Paper
              elevation={8}
              sx={{
                maxHeight: 400,
                overflowY: 'auto',
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                '&::-webkit-scrollbar': {
                  width: '6px'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: '3px'
                }
              }}
            >
              {error ? (
                <Box p={2} textAlign="center">
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {results.map((result, index) => (
                    <Box key={`${result.type}-${result.id}`}>
                      <ListItem
                        button
                        onClick={() => handleResultClick(result)}
                        sx={{
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              backgroundColor: 'transparent'
                            }}
                          >
                            {getResultIcon(result.type)}
                          </Avatar>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography 
                                variant="body2" 
                                fontWeight={500}
                                sx={{ flex: 1 }}
                              >
                                {highlightMatch(result.title || result.name, searchValue)}
                              </Typography>
                              <Chip
                                label={getResultTypeLabel(result.type)}
                                size="small"
                                variant="outlined"
                                color={result.type === 'project' ? 'primary' : 'default'}
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.7rem',
                                  fontWeight: 500
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              {result.description && (
                                <Typography 
                                  variant="body2" 
                                  color="textSecondary"
                                  sx={{ 
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {highlightMatch(result.description, searchValue)}
                                </Typography>
                              )}
                              {result.context && (
                                <Typography variant="caption" color="textSecondary">
                                  in {result.context}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      
                      {index < results.length - 1 && <Divider variant="inset" />}
                    </Box>
                  ))}
                  
                  {results.length === maxResults && (
                    <Box>
                      <Divider />
                      <Box p={1} textAlign="center">
                        <Typography variant="caption" color="textSecondary">
                          Showing first {maxResults} results
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </List>
              )}
            </Paper>
          </Fade>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default EnhancedGlobalSearch;