import React from 'react';
import { Typography, Link, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useNavigation } from '../../context/NavigationContext';
import mentionService from '../../services/mentionService';

// Enhanced activity description component with clickable elements
const EnhancedActivityDescription = ({ 
  activity, 
  onProjectClick, 
  onTaskClick, 
  onScopeClick, 
  onDrawingClick, 
  onSpecClick,
  onReportClick
}) => {
  const theme = useTheme();
  const { navigateTo } = useNavigation();
  
  if (!activity || !activity.description) {
    return (
      <Typography variant="body2">
        No description available
      </Typography>
    );
  }

  // Parse activity description to identify clickable elements
  const parseDescription = (description, metadata = {}) => {
    const parts = [];
    let lastIndex = 0;

    // Patterns to match quoted strings and specific keywords
    const patterns = [
      {
        regex: /"([^"]+)"/g,
        type: 'quoted',
        getClickHandler: (match, metadata) => {
          // Determine what type of element this is based on activity type and metadata
          if (activity.type === 'project' && metadata.projectName === match) {
            return () => onProjectClick && onProjectClick(metadata.projectId, metadata.projectName);
          }
          if (activity.type === 'task' && metadata.taskName === match) {
            return () => onTaskClick && onTaskClick(metadata.projectId, metadata.taskId, metadata.taskName);
          }
          if (activity.type === 'scope' && metadata.scopeItemName === match) {
            return () => onScopeClick && onScopeClick(metadata.projectId, metadata.scopeItemId, metadata.scopeItemName);
          }
          if (activity.type === 'shop_drawing' && metadata.drawingName && metadata.drawingName.includes(match.replace('.pdf', ''))) {
            return () => onDrawingClick && onDrawingClick(metadata.projectId, metadata.drawingId, metadata.drawingName);
          }
          if (activity.type === 'material_spec' && metadata.specName === match) {
            return () => onSpecClick && onSpecClick(metadata.projectId, metadata.specId, metadata.specName);
          }
          if (activity.type === 'report' && (metadata.reportTitle === match || metadata.reportNumber === match)) {
            return () => {
              if (onReportClick) {
                onReportClick(metadata.projectId, metadata.reportId, metadata.reportTitle);
              } else {
                // Default navigation for reports
                navigateTo({
                  title: metadata.reportTitle || 'Report',
                  path: `/projects/${metadata.projectId}/reports/${metadata.reportId}`,
                  type: 'report',
                  data: { reportId: metadata.reportId, reportTitle: metadata.reportTitle }
                });
              }
            };
          }
          return null;
        }
      }
    ];

    // Process each pattern
    patterns.forEach(pattern => {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      let match;
      
      while ((match = regex.exec(description)) !== null) {
        const matchStart = match.index;
        const matchEnd = match.index + match[0].length;
        const matchText = match[1]; // The content inside quotes
        
        // Add text before the match
        if (matchStart > lastIndex) {
          parts.push({
            type: 'text',
            content: description.slice(lastIndex, matchStart),
            key: `text-${parts.length}`
          });
        }
        
        // Add the clickable match
        const clickHandler = pattern.getClickHandler(matchText, metadata);
        parts.push({
          type: 'clickable',
          content: `"${matchText}"`,
          originalContent: matchText,
          clickHandler,
          key: `clickable-${parts.length}`
        });
        
        lastIndex = matchEnd;
      }
    });
    
    // Add remaining text
    if (lastIndex < description.length) {
      parts.push({
        type: 'text',
        content: description.slice(lastIndex),
        key: `text-${parts.length}`
      });
    }
    
    // If no patterns matched, return the whole description as text
    if (parts.length === 0) {
      parts.push({
        type: 'text',
        content: description,
        key: 'text-0'
      });
    }
    
    return parts;
  };

  const descriptionParts = parseDescription(activity.description, activity.metadata || {});

  return (
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      {descriptionParts.map((part) => {
        if (part.type === 'clickable' && part.clickHandler) {
          return (
            <Link
              key={part.key}
              component="button"
              variant="body2"
              onClick={(e) => {
                e.stopPropagation(); // Prevent activity item click
                console.log('🔗 Clickable element clicked:', part.originalContent, part.clickHandler ? 'Handler exists' : 'No handler');
                if (part.clickHandler) {
                  part.clickHandler();
                } else {
                  console.warn('❌ No click handler for:', part.originalContent);
                }
              }}
              sx={{
                color: '#1976d2', // Always blue for visibility
                textDecoration: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline',
                padding: '1px 2px',
                border: 'none',
                background: 'none',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                borderRadius: '3px',
                '&:hover': {
                  textDecoration: 'underline',
                  backgroundPalette: 'rgba(25, 118, 210, 0.08)',
                  color: '#1565c0'
                },
                '&:focus': {
                  outline: `2px solid #1976d2`,
                  outlineOffset: '1px',
                  borderRadius: '3px',
                  backgroundPalette: 'rgba(25, 118, 210, 0.08)'
                }
              }}
            >
              {part.content}
            </Link>
          );
        } else {
          return (
            <span key={part.key}>
              {part.content}
            </span>
          );
        }
      })}
    </Typography>
  );
};

export default EnhancedActivityDescription;