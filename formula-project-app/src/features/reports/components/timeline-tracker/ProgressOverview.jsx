/**
 * Progress Overview Component - Displays progress metrics and statistics
 * Extracted from TimelineProgressTracker for better modularity
 */

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Box
} from '@mui/material';
import {
  FaImages,
  FaMapMarkerAlt,
  FaChartLine,
  FaCheckCircle
} from 'react-icons/fa';

const ProgressOverview = ({ metrics, photos, getDeltaPalette, formatDelta }) => {
  const progressPercentage = photos.length > 0 ? 
    (metrics.byCategory.progress / photos.length) * 100 : 0;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Progress Overview
        </Typography>
        
        <Grid container spacing={3}>
          {/* Overall Progress */}
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
              <FaImages size={24} color="#2196F3" />
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                {photos.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Photos
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
              <FaMapMarkerAlt size={24} color="#FF9800" />
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                {Object.keys(metrics.byLocation || {}).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Locations
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
              <FaChartLine size={24} color="#4CAF50" />
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                {Math.round(progressPercentage)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progressPercentage} 
                sx={{ mt: 1 }}
                color="success"
              />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
              <FaCheckCircle size={24} color="#9C27B0" />
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                {metrics.byCategory?.milestone || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Milestones
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Category Breakdown */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Photo Categories
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(metrics.byCategory || {}).map(([category, count]) => (
              <Chip
                key={category}
                label={`${category}: ${count}`}
                size="small"
                variant="outlined"
                sx={{ 
                  bgcolor: getDeltaPalette(count, 'category'),
                  color: 'white',
                  '& .MuiChip-label': { color: 'white' }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Location Breakdown */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            By Location
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(metrics.byLocation || {}).slice(0, 8).map(([location, count]) => (
              <Chip
                key={location}
                label={`${location}: ${count}`}
                size="small"
                variant="outlined"
              />
            ))}
            {Object.keys(metrics.byLocation || {}).length > 8 && (
              <Chip
                label={`+${Object.keys(metrics.byLocation).length - 8} more`}
                size="small"
                variant="outlined"
                color="primary"
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressOverview;