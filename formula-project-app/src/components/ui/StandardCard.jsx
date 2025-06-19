import React from 'react';
import { Card, CardContent, CardActions, CardHeader } from '@mui/material';

const StandardCard = ({ 
  variant = 'medium', // 'compact', 'medium', 'full'
  children,
  header,
  actions,
  onClick,
  selected = false,
  hoverable = true,
  sx = {},
  ...props 
}) => {
  // Define size variants
  const variants = {
    compact: {
      minHeight: 'auto',
      padding: 2,
      cardContentPadding: '12px 16px',
      headerPadding: '12px 16px 0'
    },
    medium: {
      minHeight: 200,
      padding: 3,
      cardContentPadding: '16px 24px',
      headerPadding: '16px 24px 0'
    },
    full: {
      minHeight: 300,
      padding: 4,
      cardContentPadding: '24px 32px',
      headerPadding: '24px 32px 0'
    }
  };

  const config = variants[variant] || variants.medium;

  const cardStyles = {
    border: '1px solid #c0c0c0', // Enhanced border contrast
    borderRadius: 3,
    borderLeft: selected ? '4px solid #3498db' : undefined,
    backgroundColor: selected ? '#f8fafe' : 'white',
    minHeight: config.minHeight,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    '&:hover': hoverable ? {
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)', // Enhanced shadow, no transform
      borderColor: '#a0a0a0', // Darker border on hover
    } : {},
    ...sx
  };

  return (
    <Card 
      elevation={0}
      onClick={onClick}
      sx={cardStyles}
      {...props}
    >
      {header && (
        <CardHeader 
          sx={{ 
            pb: 1,
            pt: config.headerPadding.split(' ')[0],
            px: config.headerPadding.split(' ')[1]
          }}
          {...(typeof header === 'object' ? header : { title: header })}
        />
      )}
      
      <CardContent 
        sx={{ 
          p: config.cardContentPadding,
          '&:last-child': {
            pb: actions ? config.cardContentPadding.split(' ')[0] : config.cardContentPadding
          }
        }}
      >
        {children}
      </CardContent>
      
      {actions && (
        <CardActions 
          sx={{ 
            px: config.cardContentPadding.split(' ')[1],
            pb: config.cardContentPadding.split(' ')[0],
            pt: 0
          }}
        >
          {actions}
        </CardActions>
      )}
    </Card>
  );
};

export default StandardCard;