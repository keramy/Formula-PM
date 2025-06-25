import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const EnhancedProgressBar = ({ 
  value = 0, 
  color = 'var(--caramel-essence)', 
  showPercentage = true,
  height = 8,
  animated = true,
  variant = 'default', // 'default', 'striped', 'gradient'
  label = '',
  sx = {}
}) => {
  // Color mapping for different progress ranges
  const getProgressColor = () => {
    if (color !== 'auto') return color;
    
    if (value >= 80) return 'var(--success, #10B981)';
    if (value >= 60) return 'var(--sapphire-dust, #516AC8)';
    if (value >= 40) return 'var(--caramel-essence, #E3AF64)';
    if (value >= 20) return 'var(--warning, #F59E0B)';
    return 'var(--error, #EF4444)';
  };

  const progressColor = getProgressColor();

  // Gradient backgrounds for different variants
  const variantStyles = {
    default: {
      backgroundColor: progressColor,
    },
    striped: {
      backgroundImage: `repeating-linear-gradient(
        45deg,
        ${progressColor},
        ${progressColor} 10px,
        ${progressColor}dd 10px,
        ${progressColor}dd 20px
      )`,
      backgroundSize: '40px 40px',
      animation: animated ? 'progress-bar-stripes 1s linear infinite' : 'none',
    },
    gradient: {
      background: `linear-gradient(90deg, ${progressColor}cc 0%, ${progressColor} 50%, ${progressColor}ee 100%)`,
    }
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {label && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'var(--text-secondary, #6B7280)' }}>
            {label}
          </Typography>
          {showPercentage && (
            <Typography variant="caption" sx={{ color: progressColor, fontWeight: 600 }}>
              {value}%
            </Typography>
          )}
        </Box>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ 
          flex: 1, 
          height: height, 
          backgroundColor: 'var(--border-light, #E5E7EB)', 
          borderRadius: height / 2,
          overflow: 'hidden',
          position: 'relative'
        }}>
          <Box
            sx={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, value))}%`,
              borderRadius: height / 2,
              transition: animated ? 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              position: 'relative',
              overflow: 'hidden',
              ...variantStyles[variant]
            }}
          >
            {/* Shimmer effect for active progress */}
            {animated && value > 0 && value < 100 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'shimmer 2s infinite',
                }}
              />
            )}
          </Box>
        </Box>
        
        {showPercentage && !label && (
          <Typography 
            variant="caption" 
            sx={{ 
              minWidth: 35, 
              textAlign: 'right',
              color: progressColor,
              fontWeight: 600
            }}
          >
            {value}%
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default EnhancedProgressBar;