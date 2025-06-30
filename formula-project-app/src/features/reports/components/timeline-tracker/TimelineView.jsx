/**
 * Timeline View Component - Main timeline visualization
 * Extracted from TimelineProgressTracker for better modularity
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  ArrowUp as Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Avatar,
  Chip,
  Box,
  Tooltip
} from '@mui/material';
import {
  FaImages,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';

const TimelineView = ({
  timelineData,
  currentTimeIndex,
  onTimelineClick,
  formatTimeRange,
  getStatusPalette,
  getStatusIcon,
  formatLocation
}) => {
  if (!timelineData || timelineData.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No timeline data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Progress Timeline
        </Typography>
        
        <Timeline>
          {timelineData.map((period, index) => {
            const isActive = index === currentTimeIndex;
            const isPast = index < currentTimeIndex;
            const isFuture = index > currentTimeIndex;
            
            return (
              <TimelineItem key={period.period}>
                <TimelineOppositeContent sx={{ m: 'auto 0' }} align="right" variant="body2" color="text.secondary">
                  <Typography variant="caption" display="block">
                    {formatTimeRange(period.startDate, period.endDate)}
                  </Typography>
                  <Chip 
                    label={`${period.photos.length} photos`}
                    size="small"
                    color={isActive ? "primary" : "default"}
                  />
                </TimelineOppositeContent>
                
                <TimelineSeparator>
                  <TimelineDot 
                    color={isActive ? "primary" : isPast ? "success" : "grey"}
                    variant={isActive ? "filled" : "outlined"}
                    onClick={() => onTimelineClick(index)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { transform: 'scale(1.1)' }
                    }}
                  >
                    {isPast ? (
                      <FaCheckCircle />
                    ) : isActive ? (
                      <FaImages />
                    ) : (
                      <FaCalendarAlt />
                    )}
                  </TimelineDot>
                  {index < timelineData.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography 
                    variant="h6" 
                    component="span"
                    color={isActive ? "primary" : "textPrimary"}
                  >
                    {period.period}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {period.photos.length} photos captured
                  </Typography>

                  {/* Photo Grid */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {period.photos.slice(0, 6).map((photo, photoIndex) => (
                      <Tooltip key={photoIndex} title={`${photo.category} - ${formatLocation(photo.location)}`}>
                        <Avatar
                          src={photo.thumbnail || photo.url}
                          sx={{
                            width: 40,
                            height: 40,
                            cursor: 'pointer',
                            border: isActive ? 2 : 1,
                            borderColor: isActive ? 'primary.main' : 'divider',
                            '&:hover': { 
                              transform: 'scale(1.1)',
                              zIndex: 1
                            }
                          }}
                          onClick={() => onTimelineClick(index)}
                        />
                      </Tooltip>
                    ))}
                    {period.photos.length > 6 && (
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: 'grey.300',
                          fontSize: '0.75rem'
                        }}
                      >
                        +{period.photos.length - 6}
                      </Avatar>
                    )}
                  </Box>

                  {/* Location and Category Summary */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {/* Top locations */}
                    {Object.entries(
                      period.photos.reduce((acc, photo) => {
                        const location = formatLocation(photo.location);
                        acc[location] = (acc[location] || 0) + 1;
                        return acc;
                      }, {})
                    ).slice(0, 3).map(([location, count]) => (
                      <Chip
                        key={location}
                        icon={<FaMapMarkerAlt />}
                        label={`${location} (${count})`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>

                  {/* Status indicators */}
                  <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                    {period.photos.some(p => p.category === 'issue') && (
                      <Tooltip title="Issues detected">
                        <FaExclamationTriangle color={getStatusPalette('warning')} size={16} />
                      </Tooltip>
                    )}
                    {period.photos.some(p => p.category === 'milestone') && (
                      <Tooltip title="Milestone achieved">
                        <FaCheckCircle color={getStatusPalette('success')} size={16} />
                      </Tooltip>
                    )}
                    {period.photos.some(p => p.category === 'progress') && (
                      <Tooltip title="Progress documented">
                        <FaInfoCircle color={getStatusPalette('info')} size={16} />
                      </Tooltip>
                    )}
                  </Box>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default TimelineView;