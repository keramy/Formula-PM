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
    border: '1px solid var(--border-light, #E5E7EB)',
    borderRadius: 'var(--border-radius-lg, 12px)',
    borderLeft: selected ? '4px solid var(--sapphire-dust, #516AC8)' : undefined,
    backgroundColor: selected ? 'var(--rapture-light, #F6F3E7)' : 'white',
    background: selected 
      ? 'linear-gradient(135deg, rgba(81, 106, 200, 0.05) 0%, rgba(246, 243, 231, 1) 100%)'
      : 'linear-gradient(135deg, rgba(227, 175, 100, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
    minHeight: config.minHeight,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1))',
    '&:hover': hoverable ? {
      boxShadow: 'var(--shadow-hover, 0 4px 20px rgba(0, 0, 0, 0.15))',
      borderColor: 'var(--caramel-essence, #E3AF64)',
      transform: 'translateY(-2px)',
    } : {},
    ...sx
  };

  return (
    <Card 
      elevation={0}
      onClick={onClick}
      sx={cardStyles}
      className="card-entrance"
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