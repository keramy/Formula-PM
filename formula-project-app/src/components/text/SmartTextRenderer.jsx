/**
 * SmartTextRenderer Component - Renders text with clickable @ mentions
 * Converts mention strings into interactive elements that navigate to entities
 */

import React from 'react';
import { Typography, Link, Box, Chip, Tooltip } from '@mui/material';
import { useNavigation } from '../../context/NavigationContext';
import mentionService from '../../services/mentionService';

const SmartTextRenderer = ({
  text = '',
  variant = 'body2',
  projectId = null,
  mentionMetadata = [],
  sx = {},
  color = 'inherit',
  component = 'div',
  onClick
}) => {
  const { navigateTo } = useNavigation();

  // Parse text and extract mentions
  const parsedContent = React.useMemo(() => {
    if (!text) return [{ type: 'text', content: '', key: 'empty' }];

    const mentionRegex = /@(\w+):([^@\s]+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const [fullMatch, type, name] = match;
      const startIndex = match.index;
      const endIndex = match.index + fullMatch.length;

      // Add text before mention
      if (startIndex > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, startIndex),
          key: `text-${parts.length}`
        });
      }

      // Add mention
      parts.push({
        type: 'mention',
        mentionType: type,
        entityName: name,
        fullMatch,
        content: fullMatch,
        key: `mention-${parts.length}`
      });

      lastIndex = endIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
        key: `text-${parts.length}`
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text, key: 'default' }];
  }, [text]);

  // Handle mention click
  const handleMentionClick = (mention) => {
    if (onClick) {
      onClick(mention);
      return;
    }

    // Find entity metadata
    const metadata = mentionMetadata.find(m => m.mention === mention.fullMatch);
    
    if (metadata && metadata.navigationInfo) {
      // Use stored navigation info
      navigateTo({
        title: metadata.entity.name,
        path: metadata.navigationInfo.path,
        type: metadata.navigationInfo.type,
        data: metadata.entity
      });
    } else {
      // Generate navigation info from mention
      const navigationInfo = mentionService.getNavigationInfo(
        mention.mentionType,
        mention.entityName,
        projectId
      );
      
      navigateTo({
        title: mention.entityName,
        path: navigationInfo.path,
        type: navigationInfo.type,
        data: {
          id: mention.entityName,
          name: mention.entityName,
          type: mention.mentionType
        }
      });
    }
  };

  // Get mention styling based on type
  const getMentionStyle = (mentionType) => {
    const styleMap = {
      scope: { color: '#1976d2', bgcolor: 'rgba(25, 118, 210, 0.08)' },
      drawing: { color: '#7b1fa2', bgcolor: 'rgba(123, 31, 162, 0.08)' },
      project: { color: '#388e3c', bgcolor: 'rgba(56, 142, 60, 0.08)' },
      report: { color: '#f57c00', bgcolor: 'rgba(245, 124, 0, 0.08)' },
      task: { color: '#d32f2f', bgcolor: 'rgba(211, 47, 47, 0.08)' },
      member: { color: '#5d4037', bgcolor: 'rgba(93, 64, 55, 0.08)' },
      spec: { color: '#00796b', bgcolor: 'rgba(0, 121, 107, 0.08)' }
    };

    return styleMap[mentionType] || { color: '#1976d2', bgcolor: 'rgba(25, 118, 210, 0.08)' };
  };

  // Get mention icon
  const getMentionIcon = (mentionType) => {
    const iconMap = {
      scope: '🔧',
      drawing: '📋',
      project: '🏢',
      report: '📄',
      task: '✅',
      member: '👤',
      spec: '📋'
    };
    return iconMap[mentionType] || '📌';
  };

  // Get mention tooltip
  const getMentionTooltip = (mention) => {
    const metadata = mentionMetadata.find(m => m.mention === mention.fullMatch);
    
    if (metadata && metadata.entity) {
      return `${metadata.entity.category || mention.mentionType}: ${metadata.entity.name}${
        metadata.entity.description ? ` - ${metadata.entity.description}` : ''
      }`;
    }
    
    return `Click to navigate to ${mention.mentionType}: ${mention.entityName}`;
  };

  return (
    <Typography
      variant={variant}
      component={component}
      color={color}
      sx={{
        ...sx,
        '& .mention-link': {
          textDecoration: 'none',
          borderRadius: '4px',
          padding: '2px 4px',
          margin: '0 1px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          fontWeight: 600,
          fontSize: 'inherit',
          lineHeight: 'inherit',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            filter: 'brightness(0.95)'
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }
        }
      }}
    >
      {parsedContent.map((part) => {
        if (part.type === 'mention') {
          const style = getMentionStyle(part.mentionType);
          const icon = getMentionIcon(part.mentionType);
          const tooltip = getMentionTooltip(part);

          return (
            <Tooltip key={part.key} title={tooltip} arrow placement="top">
              <Link
                component="span"
                className="mention-link"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMentionClick(part);
                }}
                sx={{
                  color: style.color,
                  backgroundColor: style.bgcolor,
                  border: `1px solid ${style.color}40`,
                  ...sx.mentionStyle
                }}
              >
                <span style={{ fontSize: '0.9em' }}>{icon}</span>
                <span>{part.entityName}</span>
              </Link>
            </Tooltip>
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

export default SmartTextRenderer;