import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Card,
  CardContent,
  Stack
} from '@mui/material';

// General loading fallback for lazy components
export const LoadingFallback = ({ message = "Loading..." }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      p: 4,
      minHeight: '200px'
    }}
  >
    <CircularProgress size={40} sx={{ mb: 2 }} />
    <Typography variant="body2" color="textSecondary">
      {message}
    </Typography>
  </Box>
);

// Skeleton loader for project cards
export const ProjectCardSkeleton = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent sx={{ p: 3 }}>
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={8} sx={{ mb: 2 }} />
      <Stack direction="row" spacing={1}>
        <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
      </Stack>
    </CardContent>
  </Card>
);

// Skeleton loader for task rows
export const TaskRowSkeleton = () => (
  <Box sx={{ p: 2, borderBottom: '1px solid #E9ECEF' }}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Skeleton variant="text" width="30%" height={24} />
      <Skeleton variant="rectangular" width={80} height={20} sx={{ borderRadius: 1 }} />
      <Skeleton variant="text" width="20%" height={20} />
      <Skeleton variant="text" width="15%" height={20} />
    </Stack>
  </Box>
);

// Skeleton loader for team member cards
export const TeamMemberSkeleton = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={28} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

// Skeleton loader for table rows
export const TableRowSkeleton = ({ columns = 5 }) => (
  <Box sx={{ p: 2, borderBottom: '1px solid #E9ECEF' }}>
    <Stack direction="row" spacing={2} alignItems="center">
      {Array.from(new Array(columns)).map((_, index) => (
        <Skeleton 
          key={index} 
          variant="text" 
          width={index === 0 ? "25%" : "15%"} 
          height={20} 
        />
      ))}
    </Stack>
  </Box>
);

// List skeleton for showing multiple skeleton items
export const ListSkeleton = ({ 
  SkeletonComponent = ProjectCardSkeleton, 
  count = 6 
}) => (
  <Box>
    {Array.from(new Array(count)).map((_, index) => (
      <SkeletonComponent key={index} />
    ))}
  </Box>
);

// Form loading skeleton
export const FormSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
    <Stack spacing={3}>
      {Array.from(new Array(5)).map((_, index) => (
        <Box key={index}>
          <Skeleton variant="text" width="20%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
        </Box>
      ))}
    </Stack>
  </Box>
);

export default LoadingFallback;