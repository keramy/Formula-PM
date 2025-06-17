import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Divider,
  Collapse,
  Badge,
  Avatar,
  Tooltip,
  Button
} from '@mui/material';
import {
  FolderOpen as ProjectIcon,
  Architecture as DrawingIcon,
  Inventory as SpecIcon,
  Assignment as TaskIcon,
  Person as PersonIcon,
  Business as ClientIcon,
  Description as DocumentIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as ViewIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import useGlobalSearch from '../../hooks/useGlobalSearch';

const EnhancedGlobalSearchResults = ({ 
  searchTerm, 
  onResultSelect,
  onClose,
  maxHeight = 500 
}) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const { 
    groupedResults, 
    searchStats, 
    loading, 
    navigateToResult,
    getResultIcon 
  } = useGlobalSearch(searchTerm);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getIcon = (iconName) => {
    const iconProps = { fontSize: 'small' };
    switch (iconName) {
      case 'FolderOpen': return <ProjectIcon {...iconProps} />;
      case 'Architecture': return <DrawingIcon {...iconProps} />;
      case 'Inventory': return <SpecIcon {...iconProps} />;
      case 'Assignment': return <TaskIcon {...iconProps} />;
      case 'Person': return <PersonIcon {...iconProps} />;
      case 'Business': return <ClientIcon {...iconProps} />;
      case 'Description': return <DocumentIcon {...iconProps} />;
      default: return <SearchIcon {...iconProps} />;
    }
  };

  const getStatusColor = (result) => {
    if (!result.status) return '#2196F3';
    
    switch (result.status) {
      case 'approved':
      case 'completed':
      case 'active':
        return '#4CAF50';
      case 'pending':
      case 'in-progress':
        return '#FF9800';
      case 'revision_required':
      case 'on-hold':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const handleResultClick = (result) => {
    const path = navigateToResult(result);
    if (onResultSelect) {
      onResultSelect(result, path);
    }
    if (onClose) {
      onClose();
    }
  };

  if (loading) {
    return (
      <Card elevation={8} sx={{ maxHeight, overflow: 'auto' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Searching across all modules...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!searchTerm || searchTerm.length < 2) {
    return (
      <Card elevation={8} sx={{ maxHeight, overflow: 'auto' }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Type at least 2 characters to search across projects, drawings, specifications, and more...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!searchStats.hasResults) {
    return (
      <Card elevation={8} sx={{ maxHeight, overflow: 'auto' }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No matches for "{searchTerm}" across any modules
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={8} sx={{ maxHeight, overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Search Results
          </Typography>
          <Chip 
            label={`${searchStats.totalResults} results`}
            size="small"
            color="primary"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          "{searchTerm}" across all modules
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(searchStats.byCategory).map(([category, count]) => 
            count > 0 && (
              <Chip
                key={category}
                label={`${category}: ${count}`}
                size="small"
                variant="outlined"
              />
            )
          )}
        </Box>
      </Box>

      {/* Results by Category */}
      <Box sx={{ maxHeight: maxHeight - 160, overflow: 'auto' }}>
        {groupedResults.map((group, groupIndex) => (
          <Box key={group.category}>
            {/* Category Header */}
            <ListItem 
              button 
              onClick={() => toggleCategory(group.category)}
              sx={{ backgroundColor: '#f8f9fa' }}
            >
              <ListItemIcon>
                <Avatar sx={{ bgcolor: group.color, width: 32, height: 32 }}>
                  {getIcon(group.icon)}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {group.category}
                    </Typography>
                    <Badge badgeContent={group.items.length} color="primary" />
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton 
                  size="small"
                  onClick={() => toggleCategory(group.category)}
                >
                  {expandedCategories[group.category] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>

            {/* Category Items */}
            <Collapse in={expandedCategories[group.category] !== false} timeout="auto">
              <List dense>
                {group.items.slice(0, 5).map((result, index) => (
                  <ListItem
                    key={result.id}
                    button
                    onClick={() => handleResultClick(result)}
                    sx={{ 
                      pl: 4,
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'transparent', border: `2px solid ${group.color}`, width: 28, height: 28 }}>
                        <Box sx={{ color: group.color }}>
                          {getIcon(getResultIcon(result))}
                        </Box>
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={500}>
                          {result.primaryText}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {result.secondaryText}
                          </Typography>
                          {result.metadata && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {result.metadata}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    {result.status && (
                      <ListItemSecondaryAction>
                        <Chip
                          label={result.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(result),
                            color: 'white',
                            fontSize: '0.65rem',
                            height: 18
                          }}
                        />
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
                
                {group.items.length > 5 && (
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemText>
                      <Button 
                        size="small" 
                        variant="text"
                        onClick={() => {
                          // Navigate to the specific module page with search applied
                          console.log(`View all ${group.category} results`);
                        }}
                      >
                        View all {group.items.length} {group.category.toLowerCase()}
                      </Button>
                    </ListItemText>
                  </ListItem>
                )}
              </List>
            </Collapse>

            {groupIndex < groupedResults.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      {searchStats.totalResults > 20 && (
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Showing top results. Use specific module pages for complete results.
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default EnhancedGlobalSearchResults;