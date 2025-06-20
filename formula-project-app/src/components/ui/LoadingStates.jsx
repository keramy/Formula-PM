import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  CircularProgress,
  LinearProgress,
  Typography,
  Container,
  Grid,
  Fade,
  useTheme
} from '@mui/material';
// React Icons system
import { FaHammer, FaTools } from 'react-icons/fa';
import FormulaLogo from '../branding/FormulaLogo';

// Base loading wrapper with smooth transitions
export const LoadingWrapper = ({ 
  children, 
  delay = 0, 
  fade = true,
  minHeight,
  fullHeight = false,
  centered = false,
  ...props 
}) => {
  const theme = useTheme();
  
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

// Professional page loading with Formula branding
export const PageLoading = ({ 
  message = "Loading page...",
  darkMode = false,
  showLogo = true,
  constructionContext = false
}) => {
  const theme = useTheme();
  
  // Formula International brand colors
  const colors = {
    text: darkMode ? '#F5F2E8' : '#1B2951',
    subtext: darkMode ? '#E8E2D5' : '#566BA3',
    accent: darkMode ? '#F5F2E8' : '#1B2951',
    background: darkMode ? '#1B2951' : 'transparent'
  };

  return (
    <LoadingWrapper fullHeight centered fade>
      <Container maxWidth="sm">
        <Stack spacing={4} alignItems="center" textAlign="center">
          {/* Logo with construction context */}
          {showLogo && (
            <Box sx={{ position: 'relative' }}>
              <FormulaLogo 
                size="medium" 
                darkMode={darkMode}
                sx={{ 
                  opacity: 0.8,
                  '@keyframes constructionPulse': {
                    '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.05)' },
                  },
                  animation: constructionContext ? 'constructionPulse 2s ease-in-out infinite' : 'none',
                }}
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
          )}

          {/* Loading indicator */}
          <Box sx={{ position: 'relative' }}>
            <CircularProgress 
              size={48} 
              thickness={3}
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
                    fontSize: 20, 
                    color: colors.accent,
                    opacity: 0.7
                  }} 
                />
              </Box>
            )}
          </Box>
          
          {/* Loading message */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: colors.subtext,
              fontWeight: 500,
              letterSpacing: 0.25
            }}
          >
            {message}
          </Typography>

          {/* Construction context indicator */}
          {constructionContext && (
            <Box sx={{ opacity: 0.6 }}>
              <LinearProgress 
                sx={{
                  width: 200,
                  height: 3,
                  borderRadius: 2,
                  bgcolor: colors.accent + '20',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: colors.accent,
                    borderRadius: 2,
                  }
                }}
              />
            </Box>
          )}
        </Stack>
      </Container>
    </LoadingWrapper>
  );
};

// Section loading for smaller components
export const SectionLoading = ({ 
  message,
  minHeight = 200,
  showSpinner = true,
  constructionIcon = null
}) => {
  const theme = useTheme();

  return (
    <LoadingWrapper minHeight={minHeight} centered>
      <Stack spacing={2} alignItems="center">
        {showSpinner && (
          <Box sx={{ position: 'relative' }}>
            <CircularProgress 
              size={32} 
              thickness={4}
              sx={{ color: theme.palette.primary.main }} 
            />
            {constructionIcon && (
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
                    fontSize: 16, 
                    color: theme.palette.primary.main,
                    opacity: 0.7
                  }}
                />
              </Box>
            )}
          </Box>
        )}
        
        {message && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {message}
          </Typography>
        )}
      </Stack>
    </LoadingWrapper>
  );
};

// Card skeleton with construction context
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
      {/* Construction phase indicator */}
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
          {/* Header with icon */}
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

          {/* Status chips */}
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
            {constructionContext && (
              <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 1 }} />
            )}
          </Stack>

          {/* Progress bar */}
          {variant === 'project' && (
            <Box>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Skeleton variant="text" width={100} height={16} />
                <Skeleton variant="text" width={30} height={16} />
              </Stack>
              <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 1 }} />
            </Box>
          )}

          {/* Metrics */}
          <Stack direction="row" spacing={2}>
            <Skeleton variant="text" width={80} height={16} />
            <Skeleton variant="text" width={100} height={16} />
          </Stack>

          {/* Construction-specific elements */}
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

// List loading with multiple skeletons
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

// Table loading skeleton
export const TableLoading = ({ 
  rows = 8,
  columns = 5,
  showHeader = true,
  constructionContext = false
}) => {
  const theme = useTheme();

  return (
    <LoadingWrapper>
      <Box sx={{ width: '100%' }}>
        {/* Header */}
        {showHeader && (
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Stack direction="row" spacing={2}>
              {Array.from(new Array(columns)).map((_, index) => (
                <Skeleton 
                  key={index}
                  variant="text" 
                  width={index === 0 ? "25%" : "15%"} 
                  height={20}
                  sx={{ 
                    bgcolor: constructionContext 
                      ? theme.palette.primary.main + '10' 
                      : undefined
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Rows */}
        {Array.from(new Array(rows)).map((_, rowIndex) => (
          <Fade 
            key={rowIndex} 
            in 
            timeout={300} 
            style={{ transitionDelay: `${rowIndex * 30}ms` }}
          >
            <Box sx={{ 
              p: 2, 
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}>
              <Stack direction="row" spacing={2} alignItems="center">
                {Array.from(new Array(columns)).map((_, colIndex) => (
                  <Skeleton 
                    key={colIndex}
                    variant="text" 
                    width={colIndex === 0 ? "25%" : "15%"} 
                    height={20} 
                  />
                ))}
              </Stack>
            </Box>
          </Fade>
        ))}
      </Box>
    </LoadingWrapper>
  );
};

// Form loading skeleton
export const FormLoading = ({ 
  fields = 5,
  showTitle = true,
  constructionContext = false
}) => {
  const theme = useTheme();

  return (
    <LoadingWrapper>
      <Box sx={{ p: 3 }}>
        {/* Form title */}
        {showTitle && (
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="40%" height={32} />
            {constructionContext && (
              <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1, opacity: 0.7 }} />
            )}
          </Box>
        )}

        {/* Form fields */}
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

        {/* Action buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    </LoadingWrapper>
  );
};

// Dashboard loading with grid layout
export const DashboardLoading = ({ constructionContext = false }) => {
  const theme = useTheme();

  return (
    <LoadingWrapper>
      <Container maxWidth={false} sx={{ py: 3 }}>
        <Stack spacing={4}>
          {/* Page header */}
          <Box>
            <Skeleton variant="text" width="30%" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={24} />
          </Box>

          {/* Stats cards */}
          <Grid container spacing={3}>
            {Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Skeleton variant="text" width="60%" height={20} />
                          <Skeleton variant="circular" width={24} height={24} />
                        </Stack>
                        <Skeleton variant="text" width="40%" height={32} />
                        <Skeleton variant="text" width="80%" height={16} sx={{ opacity: 0.7 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {/* Main content areas */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="25%" height={28} sx={{ mb: 3 }} />
                  <ListLoading 
                    count={4} 
                    constructionContext={constructionContext}
                    spacing={2}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="30%" height={28} sx={{ mb: 3 }} />
                  <Stack spacing={2}>
                    {Array.from(new Array(3)).map((_, index) => (
                      <Box key={index} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Skeleton variant="circular" width={32} height={32} />
                          <Box flex={1}>
                            <Skeleton variant="text" width="70%" height={20} />
                            <Skeleton variant="text" width="50%" height={16} />
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </LoadingWrapper>
  );
};

// Inline loading for smaller elements
export const InlineLoading = ({ 
  size = 16,
  message,
  constructionIcon = null
}) => {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ position: 'relative' }}>
        <CircularProgress 
          size={size} 
          thickness={4}
          sx={{ color: theme.palette.primary.main }} 
        />
        {constructionIcon && (
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
                fontSize: size * 0.6, 
                color: theme.palette.primary.main,
                opacity: 0.7
              }}
            />
          </Box>
        )}
      </Box>
      
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
};

// Export all loading components as default
export default {
  PageLoading,
  SectionLoading,
  CardSkeleton,
  ListLoading,
  TableLoading,
  FormLoading,
  DashboardLoading,
  InlineLoading,
  LoadingWrapper
};