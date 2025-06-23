/**
 * Timeline Progress Tracker - Visual timeline interface for photo progress tracking
 * SiteCam-inspired automation for Formula PM
 * Phase 2: Smart Automation Agent
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  Grid,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  LinearProgress,
  Avatar,
  Tooltip,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaExpand,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaImages,
  FaChartLine,
  FaFilter,
  FaDownload,
  FaEye,
  FaLayerGroup,
  FaProjectDiagram,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';

const TimelineProgressTracker = ({ 
  photos = [], 
  previousPhotos = [], // For comparison with previous reports
  onPhotoSelect,
  onTimeRangeChange,
  showControls = true,
  autoProgress = false,
  groupBy = 'day', // 'hour', 'day', 'week', 'month'
  enableComparison = false
}) => {
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoProgress);
  const [playSpeed, setPlaySpeed] = useState(2000);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline', 'grid', 'chart', 'comparison'
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showProgressOnly, setShowProgressOnly] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedPeriods, setSelectedPeriods] = useState([]);

  // Process photos into timeline groups
  const timelineData = useMemo(() => {
    let filteredPhotos = [...photos];

    // Apply filters
    if (filterLocation !== 'all') {
      filteredPhotos = filteredPhotos.filter(photo => 
        formatLocation(photo.location).includes(filterLocation)
      );
    }

    if (filterCategory !== 'all') {
      filteredPhotos = filteredPhotos.filter(photo => photo.category === filterCategory);
    }

    if (showProgressOnly) {
      filteredPhotos = filteredPhotos.filter(photo => 
        photo.category === 'progress' || photo.category === 'milestone'
      );
    }

    // Group photos by time period
    const groups = groupPhotosByTime(filteredPhotos, groupBy);
    
    // Calculate progress metrics for each group
    return groups.map((group, index) => ({
      ...group,
      index,
      progressMetrics: calculateProgressMetrics(group.photos),
      completionStatus: getCompletionStatus(group.photos)
    }));
  }, [photos, groupBy, filterLocation, filterCategory, showProgressOnly]);

  const progressOverview = useMemo(() => {
    if (!timelineData.length) return null;

    const totalPhotos = timelineData.reduce((sum, group) => sum + group.photos.length, 0);
    const progressPhotos = timelineData.reduce((sum, group) => 
      sum + group.photos.filter(p => p.category === 'progress' || p.category === 'milestone').length, 0
    );
    const issuePhotos = timelineData.reduce((sum, group) => 
      sum + group.photos.filter(p => p.category === 'issue').length, 0
    );
    const qualityPhotos = timelineData.reduce((sum, group) => 
      sum + group.photos.filter(p => p.category === 'quality').length, 0
    );

    const timeSpan = {
      start: timelineData[0]?.startDate,
      end: timelineData[timelineData.length - 1]?.endDate,
      totalDays: timelineData.length > 1 
        ? Math.ceil((new Date(timelineData[timelineData.length - 1].endDate) - new Date(timelineData[0].startDate)) / (1000 * 60 * 60 * 24))
        : 1
    };

    return {
      totalPhotos,
      progressPhotos,
      issuePhotos,
      qualityPhotos,
      timeSpan,
      locations: [...new Set(photos.map(p => formatLocation(p.location)))].length,
      progressRate: totalPhotos > 0 ? (progressPhotos / totalPhotos * 100) : 0
    };
  }, [timelineData, photos]);

  // Comparison data processing
  const comparisonData = useMemo(() => {
    if (!enableComparison || !previousPhotos.length) return null;

    const previousTimelineData = groupPhotosByTime(previousPhotos, groupBy).map((group, index) => ({
      ...group,
      index,
      progressMetrics: calculateProgressMetrics(group.photos),
      completionStatus: getCompletionStatus(group.photos)
    }));

    // Calculate deltas between current and previous data
    const deltas = timelineData.map(currentGroup => {
      const previousGroup = previousTimelineData.find(pg => pg.period === currentGroup.period);
      
      if (!previousGroup) {
        return {
          ...currentGroup,
          delta: {
            photos: currentGroup.photos.length,
            progress: currentGroup.progressMetrics.progressRate,
            quality: currentGroup.progressMetrics.qualityScore,
            issues: currentGroup.photos.filter(p => p.category === 'issue').length,
            type: 'new'
          }
        };
      }

      const photoDelta = currentGroup.photos.length - previousGroup.photos.length;
      const progressDelta = currentGroup.progressMetrics.progressRate - previousGroup.progressMetrics.progressRate;
      const qualityDelta = currentGroup.progressMetrics.qualityScore - previousGroup.progressMetrics.qualityScore;
      const currentIssues = currentGroup.photos.filter(p => p.category === 'issue').length;
      const previousIssues = previousGroup.photos.filter(p => p.category === 'issue').length;
      const issuesDelta = currentIssues - previousIssues;

      return {
        ...currentGroup,
        previous: previousGroup,
        delta: {
          photos: photoDelta,
          progress: progressDelta,
          quality: qualityDelta,
          issues: issuesDelta,
          type: photoDelta > 0 ? 'increased' : photoDelta < 0 ? 'decreased' : 'unchanged'
        }
      };
    });

    return {
      current: timelineData,
      previous: previousTimelineData,
      deltas,
      summary: {
        totalPhotoDelta: deltas.reduce((sum, d) => sum + d.delta.photos, 0),
        averageProgressDelta: deltas.reduce((sum, d) => sum + d.delta.progress, 0) / deltas.length,
        totalIssuesDelta: deltas.reduce((sum, d) => sum + d.delta.issues, 0)
      }
    };
  }, [timelineData, previousPhotos, enableComparison, groupBy]);

  // Auto-progress functionality
  useEffect(() => {
    let interval;
    if (isPlaying && timelineData.length > 0) {
      interval = setInterval(() => {
        setCurrentTimeIndex(prev => (prev + 1) % timelineData.length);
      }, playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, timelineData.length]);

  const groupPhotosByTime = (photos, grouping) => {
    if (!photos.length) return [];

    const groups = {};
    
    photos.forEach(photo => {
      const date = new Date(photo.capturedAt);
      let key;
      
      switch (grouping) {
        case 'hour':
          key = `${date.toISOString().split('T')[0]} ${String(date.getHours()).padStart(2, '0')}:00`;
          break;
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = `Week of ${weekStart.toISOString().split('T')[0]}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }
      
      if (!groups[key]) {
        groups[key] = {
          period: key,
          startDate: photo.capturedAt,
          endDate: photo.capturedAt,
          photos: []
        };
      }
      
      groups[key].photos.push(photo);
      
      // Update date range
      if (photo.capturedAt < groups[key].startDate) {
        groups[key].startDate = photo.capturedAt;
      }
      if (photo.capturedAt > groups[key].endDate) {
        groups[key].endDate = photo.capturedAt;
      }
    });
    
    return Object.values(groups).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  };

  const calculateProgressMetrics = (photos) => {
    const metrics = {
      totalPhotos: photos.length,
      byCategory: {},
      byLocation: {},
      progressIndicators: {
        completed: 0,
        inProgress: 0,
        issues: 0
      }
    };

    photos.forEach(photo => {
      // Count by category
      metrics.byCategory[photo.category] = (metrics.byCategory[photo.category] || 0) + 1;
      
      // Count by location
      const location = formatLocation(photo.location);
      metrics.byLocation[location] = (metrics.byLocation[location] || 0) + 1;
      
      // Progress indicators
      if (photo.category === 'progress' || photo.category === 'milestone') {
        if (photo.tags?.includes('completed')) {
          metrics.progressIndicators.completed++;
        } else {
          metrics.progressIndicators.inProgress++;
        }
      } else if (photo.category === 'issue') {
        metrics.progressIndicators.issues++;
      }
    });

    return metrics;
  };

  const getCompletionStatus = (photos) => {
    const progressPhotos = photos.filter(p => 
      p.category === 'progress' || p.category === 'milestone'
    );
    const completedPhotos = photos.filter(p => 
      p.tags?.includes('completed') || p.tags?.includes('finished')
    );
    const issuePhotos = photos.filter(p => p.category === 'issue');

    if (issuePhotos.length > progressPhotos.length) return 'issues';
    if (completedPhotos.length > progressPhotos.length * 0.7) return 'completed';
    if (progressPhotos.length > 0) return 'in-progress';
    return 'planning';
  };

  const formatLocation = (location) => {
    if (!location) return 'Unknown Location';
    const parts = [];
    if (location.building) parts.push(location.building);
    if (location.floor) parts.push(location.floor);
    if (location.room) parts.push(location.room);
    if (location.area) parts.push(location.area);
    return parts.length > 0 ? parts.join(' - ') : 'Unknown Location';
  };

  const formatTimeRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (groupBy === 'hour') {
      return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (groupBy === 'day') {
      return start.toLocaleDateString();
    } else if (groupBy === 'week') {
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    } else {
      return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  const getDeltaColor = (deltaValue, type = 'default') => {
    if (deltaValue === 0) return '#9E9E9E'; // Grey for no change
    
    switch (type) {
      case 'progress':
      case 'quality':
        return deltaValue > 0 ? '#4CAF50' : '#f44336'; // Green for improvement, red for decline
      case 'issues':
        return deltaValue > 0 ? '#f44336' : '#4CAF50'; // Red for more issues, green for fewer
      default:
        return deltaValue > 0 ? '#4CAF50' : '#f44336';
    }
  };

  const formatDelta = (deltaValue, type = 'number') => {
    if (deltaValue === 0) return '0';
    
    const sign = deltaValue > 0 ? '+' : '';
    
    switch (type) {
      case 'percentage':
        return `${sign}${deltaValue.toFixed(1)}%`;
      case 'number':
        return `${sign}${deltaValue}`;
      default:
        return `${sign}${deltaValue}`;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': '#4CAF50',
      'in-progress': '#2196F3',
      'issues': '#F44336',
      'planning': '#9E9E9E'
    };
    return colors[status] || '#9E9E9E';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'completed': FaCheckCircle,
      'in-progress': FaClock,
      'issues': FaExclamationTriangle,
      'planning': FaInfoCircle
    };
    return icons[status] || FaInfoCircle;
  };

  const handleTimelineClick = (index) => {
    setCurrentTimeIndex(index);
    if (onTimeRangeChange) {
      const group = timelineData[index];
      onTimeRangeChange(group.startDate, group.endDate);
    }
  };

  const renderProgressOverview = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Progress Overview
        </Typography>
        {enableComparison && comparisonData && (
          <Chip
            label={`Compared to Previous Report`}
            color="secondary"
            size="small"
            variant="outlined"
          />
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {progressOverview?.totalPhotos || 0}
            </Typography>
            <Typography variant="caption">Total Photos</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {progressOverview?.progressPhotos || 0}
            </Typography>
            <Typography variant="caption">Progress Photos</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {progressOverview?.issuePhotos || 0}
            </Typography>
            <Typography variant="caption">Issues</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              {progressOverview?.locations || 0}
            </Typography>
            <Typography variant="caption">Locations</Typography>
          </Box>
        </Grid>
      </Grid>

      {progressOverview && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Progress Rate: {Math.round(progressOverview.progressRate)}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progressOverview.progressRate} 
            sx={{ height: 8, borderRadius: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {progressOverview.timeSpan.totalDays} days of documentation
          </Typography>
        </Box>
      )}
    </Paper>
  );

  const renderControls = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" gutterBottom>
            View Controls
          </Typography>
          <ButtonGroup size="small" fullWidth>
            <Button 
              variant={viewMode === 'timeline' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button 
              variant={viewMode === 'chart' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('chart')}
            >
              Chart
            </Button>
            {enableComparison && comparisonData && (
              <Button 
                variant={viewMode === 'comparison' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('comparison')}
                color="secondary"
              >
                Compare
              </Button>
            )}
          </ButtonGroup>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" gutterBottom>
            Time Grouping
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={groupBy}
              onChange={(e) => setCurrentTimeIndex(0) || setGroupBy && setGroupBy(e.target.value)}
            >
              <MenuItem value="hour">By Hour</MenuItem>
              <MenuItem value="day">By Day</MenuItem>
              <MenuItem value="week">By Week</MenuItem>
              <MenuItem value="month">By Month</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" gutterBottom>
            Playback Controls
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              size="small"
              onClick={() => setCurrentTimeIndex(Math.max(0, currentTimeIndex - 1))}
              disabled={currentTimeIndex === 0}
            >
              <FaStepBackward />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => setCurrentTimeIndex(Math.min(timelineData.length - 1, currentTimeIndex + 1))}
              disabled={currentTimeIndex === timelineData.length - 1}
            >
              <FaStepForward />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Timeline Slider */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" gutterBottom>
          Timeline Position: {currentTimeIndex + 1} of {timelineData.length}
        </Typography>
        <Slider
          value={currentTimeIndex}
          min={0}
          max={Math.max(0, timelineData.length - 1)}
          onChange={(_, value) => setCurrentTimeIndex(value)}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => 
            timelineData[value] ? formatTimeRange(timelineData[value].startDate, timelineData[value].endDate) : ''
          }
          sx={{ mt: 1 }}
        />
      </Box>
    </Paper>
  );

  const renderTimelineView = () => (
    <Timeline position="alternate">
      {timelineData.map((group, index) => {
        const StatusIcon = getStatusIcon(group.completionStatus);
        const isActive = index === currentTimeIndex;
        
        return (
          <TimelineItem key={group.period}>
            <TimelineOppositeContent sx={{ m: 'auto 0' }} align="right" variant="body2" color="text.secondary">
              {formatTimeRange(group.startDate, group.endDate)}
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot 
                sx={{ 
                  bgcolor: getStatusColor(group.completionStatus),
                  cursor: 'pointer',
                  border: isActive ? 3 : 0,
                  borderColor: 'primary.main'
                }}
                onClick={() => handleTimelineClick(index)}
              >
                <StatusIcon size={16} color="white" />
              </TimelineDot>
              {index < timelineData.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: isActive ? 2 : 0,
                  borderColor: 'primary.main'
                }}
                onClick={() => handleTimelineClick(index)}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="h6" component="h3">
                    {group.period}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {group.photos.length} photos • {Object.keys(group.progressMetrics.byLocation).length} locations
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                    {Object.entries(group.progressMetrics.byCategory).map(([category, count]) => (
                      <Chip 
                        key={category}
                        label={`${category}: ${count}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption">
                      Status: {group.completionStatus}
                    </Typography>
                    <Button 
                      size="small" 
                      startIcon={<FaEye />}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (group.photos.length > 0) {
                          setSelectedPhoto(group.photos[0]);
                        }
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );

  const renderGridView = () => (
    <Grid container spacing={2}>
      {timelineData.map((group, index) => {
        const isActive = index === currentTimeIndex;
        const StatusIcon = getStatusIcon(group.completionStatus);
        
        return (
          <Grid item xs={12} sm={6} md={4} key={group.period}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: isActive ? 2 : 0,
                borderColor: 'primary.main',
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => handleTimelineClick(index)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StatusIcon 
                    size={20} 
                    color={getStatusColor(group.completionStatus)}
                    style={{ marginRight: 8 }}
                  />
                  <Typography variant="h6">
                    {group.period}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formatTimeRange(group.startDate, group.endDate)}
                </Typography>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" color="primary">
                        {group.photos.length}
                      </Typography>
                      <Typography variant="caption">Photos</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" color="secondary">
                        {Object.keys(group.progressMetrics.byLocation).length}
                      </Typography>
                      <Typography variant="caption">Locations</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {Object.entries(group.progressMetrics.byCategory).slice(0, 3).map(([category, count]) => (
                    <Chip 
                      key={category}
                      label={`${category}: ${count}`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  const renderComparisonView = () => {
    if (!comparisonData || !enableComparison) return null;

    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Progress Comparison Analysis
        </Typography>
        
        {/* Comparison Summary */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Summary of Changes
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ color: getDeltaColor(comparisonData.summary.totalPhotoDelta) }}
                >
                  {formatDelta(comparisonData.summary.totalPhotoDelta)}
                </Typography>
                <Typography variant="caption">Total Photos</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ color: getDeltaColor(comparisonData.summary.averageProgressDelta, 'progress') }}
                >
                  {formatDelta(comparisonData.summary.averageProgressDelta, 'percentage')}
                </Typography>
                <Typography variant="caption">Avg Progress</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ color: getDeltaColor(comparisonData.summary.totalIssuesDelta, 'issues') }}
                >
                  {formatDelta(comparisonData.summary.totalIssuesDelta)}
                </Typography>
                <Typography variant="caption">Issues</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Period-by-Period Comparison */}
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Changes by Time Period
        </Typography>
        {comparisonData.deltas.map((period, index) => (
          <Card key={period.period} sx={{ mb: 2, border: period.delta.type === 'new' ? 2 : 0, borderColor: 'success.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{period.period}</Typography>
                {period.delta.type === 'new' && (
                  <Chip label="New Period" color="success" size="small" />
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h5" 
                      sx={{ color: getDeltaColor(period.delta.photos) }}
                    >
                      {formatDelta(period.delta.photos)}
                    </Typography>
                    <Typography variant="caption">Photos</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {period.photos.length} total
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h5" 
                      sx={{ color: getDeltaColor(period.delta.progress, 'progress') }}
                    >
                      {formatDelta(period.delta.progress, 'percentage')}
                    </Typography>
                    <Typography variant="caption">Progress</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(period.progressMetrics.progressRate || 0)}% current
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h5" 
                      sx={{ color: getDeltaColor(period.delta.quality, 'quality') }}
                    >
                      {formatDelta(period.delta.quality, 'percentage')}
                    </Typography>
                    <Typography variant="caption">Quality</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(period.progressMetrics.qualityScore || 0)}% current
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h5" 
                      sx={{ color: getDeltaColor(period.delta.issues, 'issues') }}
                    >
                      {formatDelta(period.delta.issues)}
                    </Typography>
                    <Typography variant="caption">Issues</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {period.photos.filter(p => p.category === 'issue').length} current
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Paper>
    );
  };

  const renderChartView = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Progress Chart View
      </Typography>
      <Alert severity="info">
        Chart visualization would be implemented here using a charting library like Chart.js or Recharts.
        This would show progress trends, photo counts over time, and completion metrics.
      </Alert>
    </Paper>
  );

  if (!timelineData.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <FaClock size={48} color="#ccc" />
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          No Timeline Data Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload photos to start tracking progress over time
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Progress Overview */}
      {progressOverview && renderProgressOverview()}

      {/* Controls */}
      {showControls && renderControls()}

      {/* Current Period Highlight */}
      {timelineData[currentTimeIndex] && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">
            Current Period: {timelineData[currentTimeIndex].period}
          </Typography>
          <Typography variant="body2">
            {timelineData[currentTimeIndex].photos.length} photos • 
            Status: {timelineData[currentTimeIndex].completionStatus} • 
            {Object.keys(timelineData[currentTimeIndex].progressMetrics.byLocation).length} locations
          </Typography>
        </Alert>
      )}

      {/* Main Content */}
      {viewMode === 'timeline' && renderTimelineView()}
      {viewMode === 'grid' && renderGridView()}
      {viewMode === 'chart' && renderChartView()}
      {viewMode === 'comparison' && renderComparisonView()}

      {/* Photo Detail Dialog */}
      <Dialog
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedPhoto && (
          <>
            <DialogTitle>
              Photo Details - {new Date(selectedPhoto.capturedAt).toLocaleString()}
            </DialogTitle>
            <DialogContent>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {selectedPhoto.caption || 'Untitled'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedPhoto.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip label={selectedPhoto.category} sx={{ mr: 1 }} />
                <Chip label={formatLocation(selectedPhoto.location)} variant="outlined" />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedPhoto(null)}>
                Close
              </Button>
              <Button 
                startIcon={<FaDownload />}
                onClick={() => {
                  // Download functionality would be implemented here
                }}
              >
                Download
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TimelineProgressTracker;