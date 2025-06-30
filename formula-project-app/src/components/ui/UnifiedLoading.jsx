import React from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  Container,
  Stack,
  Skeleton,
  Card,
  CardContent,
  Grid,
  Fade,
  useTheme
} from '@mui/material';
import { FormulaLogoAnimated } from '../branding/LogoVariations';
import FormulaLogo from '../branding/FormulaLogo';
import { FaHammer, FaTools } from 'react-icons/fa';

/**
 * Unified Loading Component System
 * Consolidates all loading states into a single flexible component
 */

// Main unified loading component
export const UnifiedLoading = ({
  // Variant types
  variant = 'page', // 'page', 'section', 'inline', 'minimal', 'fullscreen'
  
  // Content props
  message = 'Loading...',
  subtitle,
  
  // Visual props
  darkMode = false,
  showLogo = true,
  showProgress = true,
  progress = null, // 0-100 or null for indeterminate
  
  // Layout props
  minHeight = 200,
  fullHeight = false,
  centered = true,
  
  // Animation props
  fade = true,
  delay = 0,
  
  // Construction context
  constructionContext = false,
  
  // Size variants
  size = 'medium', // 'small', 'medium', 'large', 'xlarge'
  
  // Container props
  ...props
}) => {
  const theme = useTheme();
  
  // Formula International brand colors
  const colors = {
    background: darkMode ? '#0F1729' : '#FDFCFA',
    text: darkMode ? '#F5F2E8' : '#1B2951',
    subtext: darkMode ? '#E8E2D5' : '#566BA3',
    accent: darkMode ? '#F5F2E8' : '#1B2951'
  };

  // Size mappings
  const sizeConfig = {
    small: { spinner: 24, logo: 'small', spacing: 2, text: 'body2' },
    medium: { spinner: 40, logo: 'medium', spacing: 3, text: 'body1' },
    large: { spinner: 48, logo: 'large', spacing: 4, text: 'h6' },
    xlarge: { spinner: 56, logo: 'xlarge', spacing: 5, text: 'h5' }
  };

  const config = sizeConfig[size];

  // Render spinner with optional construction context
  const renderSpinner = () => (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress 
        size={config.spinner} 
        thickness={variant === 'inline' ? 4 : 2}
        aria-label={message || 'Loading content'}
        role="progressbar"
        sx={{ 
          color: colors.accent,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }} 
      />
      
      {constructionContext && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <FaTools 
            style={{ 
              fontSize: config.spinner * 0.4, 
              color: colors.accent,
              opacity: 0.7
            }} 
          />
        </Box>
      )}
    </Box>
  );

  // Render logo with optional animation
  const renderLogo = () => {
    if (!showLogo) return null;
    
    if (variant === 'fullscreen') {
      return (
        <Box sx={{ position: 'relative', mb: 4 }}>
          <FormulaLogoAnimated 
            darkMode={darkMode} 
            size={config.logo}
          />
          
          {constructionContext && (
            <Box
              sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                p: 1,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main + '20',
                '@keyframes rotate': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
                animation: 'rotate 3s linear infinite',
              }}
            >
              <FaHammer 
                style={{ 
                  fontSize: 24, 
                  color: theme.palette.primary.main 
                }} 
              />
            </Box>
          )}
        </Box>
      );
    }
    
    return (
      <FormulaLogo 
        size={config.logo} 
        darkMode={darkMode}
        sx={{ 
          opacity: 0.8,
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.8 },
            '50%': { opacity: 1 },
          },
          animation: variant === 'page' ? 'pulse 2s ease-in-out infinite' : 'none',
          mb: variant === 'minimal' ? 1 : 2
        }}
      />
    );
  };

  // Render progress bar
  const renderProgress = () => {
    if (!showProgress && progress === null) return null;
    
    return (
      <Box sx={{ width: variant === 'fullscreen' ? 300 : 200, mt: 2 }}>
        <LinearProgress
          variant={progress !== null ? "determinate" : "indeterminate"}
          value={progress}
          sx={{
            height: 3,
            borderRadius: 2,
            backgroundColor: darkMode ? 'rgba(245, 242, 232, 0.1)' : 'rgba(27, 41, 81, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: colors.accent,
              borderRadius: 2,
            },
          }}
        />
        
        {progress !== null && (
          <Typography
            variant="caption"
            sx={{
              color: colors.subtext,
              textAlign: 'center',
              display: 'block',
              mt: 1,
            }}
          >
            {Math.round(progress)}%
          </Typography>
        )}
      </Box>
    );
  };

  // Render content based on variant
  const renderContent = () => {
    const content = (
      <Stack 
        spacing={config.spacing} 
        alignItems="center" 
        textAlign="center"
        sx={{ position: 'relative', zIndex: 1 }}
      >
        {renderLogo()}
        {renderSpinner()}
        
        {message && (
          <Typography 
            variant={config.text}
            component="div"
            role="status"
            aria-live="polite"
            sx={{ 
              color: colors.text,
              fontWeight: variant === 'fullscreen' ? 500 : 400,
              maxWidth: 400,
              '@keyframes fadeInOut': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.7 },
              },
              animation: variant === 'fullscreen' ? 'fadeInOut 2s ease-in-out infinite' : 'none',
            }}
          >
            {message}
          </Typography>
        )}
        
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: colors.subtext,
              opacity: 0.8,
            }}
          >
            {subtitle}
          </Typography>
        )}
        
        {renderProgress()}
      </Stack>
    );

    if (fade) {
      return (
        <Fade in timeout={300} style={{ transitionDelay: `${delay}ms` }}>
          <Box>{content}</Box>
        </Fade>
      );
    }
    
    return content;
  };

  // Container styles based on variant
  const getContainerStyles = () => {
    const baseStyles = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: centered ? 'center' : 'flex-start',
      justifyContent: centered ? 'center' : 'flex-start',
      position: 'relative',
    };

    switch (variant) {
      case 'fullscreen':
        return {
          ...baseStyles,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.background,
          zIndex: 9999,
        };
        
      case 'page':
        return {
          ...baseStyles,
          height: fullHeight ? '100vh' : 'auto',
          minHeight: fullHeight ? '100vh' : minHeight,
          backgroundColor: 'transparent',
        };
        
      case 'section':
        return {
          ...baseStyles,
          minHeight,
          py: 4,
        };
        
      case 'inline':
        return {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
        };
        
      case 'minimal':
        return {
          ...baseStyles,
          py: 2,
          minHeight: 'auto',
        };
        
      default:
        return baseStyles;
    }
  };

  // Background effects for fullscreen variant
  const renderBackgroundEffects = () => {
    if (variant !== 'fullscreen') return null;
    
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode 
            ? `linear-gradient(45deg, 
                transparent 30%, 
                rgba(245, 242, 232, 0.03) 50%, 
                transparent 70%)`
            : `linear-gradient(45deg, 
                transparent 30%, 
                rgba(27, 41, 81, 0.03) 50%, 
                transparent 70%)`,
          backgroundSize: '2000px 100%',
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '-1000px 0' },
            '100%': { backgroundPosition: '1000px 0' },
          },
          animation: 'shimmer 3s infinite linear',
        }}
      />
    );
  };

  // Footer for fullscreen variant
  const renderFooter = () => {
    if (variant !== 'fullscreen') return null;
    
    return (
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: colors.subtext,
            opacity: 0.6,
            letterSpacing: '0.1em',
          }}
        >
          FORMULA INTERNATIONAL © 2025
        </Typography>
      </Box>
    );
  };

  // Handle inline variant separately
  if (variant === 'inline') {
    return (
      <Stack direction="row" spacing={1} alignItems="center" {...props}>
        {renderSpinner()}
        {message && (
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {message}
          </Typography>
        )}
      </Stack>
    );
  }

  // Wrap with container for page variant
  if (variant === 'page' && fullHeight) {
    return (
      <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex' }}>
        <Box sx={getContainerStyles()} {...props}>
          {renderContent()}
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={getContainerStyles()} {...props}>
      {renderBackgroundEffects()}
      {renderContent()}
      {renderFooter()}
    </Box>
  );
};

// Legacy component aliases for backward compatibility
export const LoadingScreen = (props) => (
  <UnifiedLoading variant="fullscreen" {...props} />
);

export const FormulaLoadingScreen = (props) => (
  <UnifiedLoading variant="fullscreen" {...props} />
);

export const LoadingFallback = (props) => (
  <UnifiedLoading 
    variant={props.minimal ? "minimal" : "section"} 
    size="small"
    {...props} 
  />
);

export const PageLoading = (props) => (
  <UnifiedLoading variant="page" fullHeight={true} {...props} />
);

export const SectionLoading = (props) => (
  <UnifiedLoading variant="section" size="small" {...props} />
);

export const InlineLoading = (props) => (
  <UnifiedLoading variant="inline" size="small" {...props} />
);

// Skeleton components (keep existing implementations from LoadingStates)
export const LoadingWrapper = ({ 
  children, 
  delay = 0, 
  fade = true,
  minHeight,
  fullHeight = false,
  centered = false,
  ...props 
}) => {
  const wrapperStyles = {
    minHeight: fullHeight ? '100vh' : minHeight,
    display: centered ? 'flex' : 'block',
    alignItems: centered ? 'center' : 'flex-start',
    justifyContent: centered ? 'center' : 'flex-start',
    position: 'relative',
    ...props.sx
  };

  const content = fade ? (
    <Fade in timeout={300} style={{ transitionDelay: `${delay}ms` }}>
      <Box>{children}</Box>
    </Fade>
  ) : children;

  return (
    <Box sx={wrapperStyles} {...props}>
      {content}
    </Box>
  );
};

export const CardSkeleton = ({ 
  variant = 'project',
  constructionContext = false,
  showActions = true
}) => {
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {constructionContext && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            bgcolor: theme.palette.primary.main,
            '@keyframes shimmer': {
              '0%': { opacity: 0.4 },
              '50%': { opacity: 0.8 },
              '100%': { opacity: 0.4 },
            },
            animation: 'shimmer 2s ease-in-out infinite',
          }}
        />
      )}

      <CardContent sx={{ pt: constructionContext ? 3 : 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Skeleton 
              variant="circular" 
              width={40} 
              height={40}
              sx={{ flexShrink: 0 }}
            />
            <Box flex={1}>
              <Skeleton variant="text" width="70%" height={28} />
              <Skeleton variant="text" width="50%" height={20} sx={{ mt: 0.5 }} />
            </Box>
            {showActions && (
              <Skeleton variant="circular" width={24} height={24} />
            )}
          </Stack>

          <Stack direction="row" spacing={1}>
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
            {constructionContext && (
              <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 1 }} />
            )}
          </Stack>

          {variant === 'project' && (
            <Box>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Skeleton variant="text" width={100} height={16} />
                <Skeleton variant="text" width={30} height={16} />
              </Stack>
              <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 1 }} />
            </Box>
          )}

          <Stack direction="row" spacing={2}>
            <Skeleton variant="text" width={80} height={16} />
            <Skeleton variant="text" width={100} height={16} />
          </Stack>

          {constructionContext && (
            <Stack direction="row" spacing={2}>
              <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={80} height={20} sx={{ borderRadius: 1 }} />
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const ListLoading = ({ 
  count = 6,
  SkeletonComponent = CardSkeleton,
  spacing = 2,
  constructionContext = false,
  ...skeletonProps
}) => {
  return (
    <LoadingWrapper>
      <Stack spacing={spacing}>
        {Array.from(new Array(count)).map((_, index) => (
          <Fade 
            key={index} 
            in 
            timeout={300} 
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <Box>
              <SkeletonComponent 
                constructionContext={constructionContext}
                {...skeletonProps} 
              />
            </Box>
          </Fade>
        ))}
      </Stack>
    </LoadingWrapper>
  );
};

export const FormSkeleton = ({ 
  fields = 5,
  showTitle = true,
  constructionContext = false
}) => {
  const theme = useTheme();

  return (
    <LoadingWrapper>
      <Box sx={{ p: 3 }}>
        {showTitle && (
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="40%" height={32} />
            {constructionContext && (
              <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1, opacity: 0.7 }} />
            )}
          </Box>
        )}

        <Stack spacing={3}>
          {Array.from(new Array(fields)).map((_, index) => (
            <Fade 
              key={index} 
              in 
              timeout={300} 
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Box>
                <Skeleton variant="text" width="20%" height={20} sx={{ mb: 1 }} />
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={56} 
                  sx={{ 
                    borderRadius: 1,
                    bgcolor: constructionContext 
                      ? theme.palette.primary.main + '05' 
                      : undefined
                  }} 
                />
              </Box>
            </Fade>
          ))}
        </Stack>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    </LoadingWrapper>
  );
};

export default UnifiedLoading;