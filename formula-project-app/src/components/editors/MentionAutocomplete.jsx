/**
 * MentionAutocomplete Component - Dropdown for entity suggestions
 * Provides autocomplete functionality for @ mentions in text editors
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  zIndex: 1300,
  maxHeight: 300,
  width: 300,
  overflow: 'hidden',
  boxShadow: theme.shadows[8],
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2
}));

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  cursor: 'pointer',
  padding: theme.spacing(1, 2),
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const CategoryHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.grey[50],
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: 'sticky',
  top: 0,
  zIndex: 1
}));

const MentionAutocomplete = ({
  entities = [],
  isLoading = false,
  selectedIndex = 0,
  onSelect,
  onClose,
  position = { top: 0, left: 0 },
  query = ''
}) => {
  const listRef = useRef(null);
  const selectedItemRef = useRef(null);

  // Group entities by category
  const groupedEntities = entities.reduce((groups, entity) => {
    const category = entity.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(entity);
    return groups;
  }, {});

  // Flatten entities with category headers for keyboard navigation
  const flatEntities = [];
  Object.entries(groupedEntities).forEach(([category, categoryEntities]) => {
    categoryEntities.forEach(entity => {
      flatEntities.push({ ...entity, category });
    });
  });

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedIndex]);

  const handleItemClick = (entity) => {
    onSelect(entity);
  };

  const getEntityIcon = (type) => {
    const iconMap = {
      scope: '🔧',
      drawing: '📋',
      project: '🏢',
      report: '📄',
      task: '✅',
      member: '👤',
      spec: '📋'
    };
    return iconMap[type] || '📌';
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <strong key={index} style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
          {part}
        </strong>
      ) : part
    );
  };

  if (isLoading) {
    return (
      <StyledPaper style={{ top: position.top, left: position.left }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2">Searching entities...</Typography>
        </Box>
      </StyledPaper>
    );
  }

  if (entities.length === 0) {
    return (
      <StyledPaper style={{ top: position.top, left: position.left }}>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            {query ? `No results found for "${query}"` : 'Start typing to search entities...'}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            Try: @scope:, @drawing:, @project:, @report:, @task:, @member:, @spec:
          </Typography>
        </Box>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper style={{ top: position.top, left: position.left }}>
      <List ref={listRef} dense sx={{ maxHeight: 300, overflow: 'auto', py: 0 }}>
        {Object.entries(groupedEntities).map(([category, categoryEntities], categoryIndex) => (
          <React.Fragment key={category}>
            {Object.keys(groupedEntities).length > 1 && (
              <CategoryHeader>
                <Typography variant="caption" fontWeight="bold" color="textSecondary">
                  {category}
                </Typography>
              </CategoryHeader>
            )}
            
            {categoryEntities.map((entity, entityIndex) => {
              const globalIndex = flatEntities.findIndex(e => e.id === entity.id && e.type === entity.type);
              const isSelected = globalIndex === selectedIndex;
              
              return (
                <StyledListItem
                  key={`${entity.type}-${entity.id}`}
                  ref={isSelected ? selectedItemRef : null}
                  selected={isSelected}
                  onClick={() => handleItemClick(entity)}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Typography variant="h6" sx={{ fontSize: '16px' }}>
                      {getEntityIcon(entity.type)}
                    </Typography>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {highlightMatch(entity.name, query)}
                        </Typography>
                        <Chip
                          label={entity.type}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontSize: '10px',
                            height: '18px',
                            '& .MuiChip-label': { px: 0.5 }
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      entity.description && (
                        <Typography variant="caption" color="textSecondary" noWrap>
                          {highlightMatch(entity.description, query)}
                        </Typography>
                      )
                    }
                  />
                </StyledListItem>
              );
            })}
            
            {categoryIndex < Object.keys(groupedEntities).length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      
      {/* Footer with keyboard hints */}
      <Box sx={{ p: 1, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="textSecondary">
          ↑↓ Navigate • Enter Select • Esc Close
        </Typography>
      </Box>
    </StyledPaper>
  );
};

export default MentionAutocomplete;