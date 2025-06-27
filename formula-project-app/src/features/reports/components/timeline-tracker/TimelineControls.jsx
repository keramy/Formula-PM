/**
 * Timeline Controls Component - Playback and filter controls
 * Extracted from TimelineProgressTracker for better modularity
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  ButtonGroup,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Box,
  Divider
} from '@mui/material';
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaFilter,
  FaDownload
} from 'react-icons/fa';

const TimelineControls = ({
  isPlaying,
  setIsPlaying,
  playSpeed,
  setPlaySpeed,
  currentTimeIndex,
  setCurrentTimeIndex,
  timelineData,
  viewMode,
  setViewMode,
  filterLocation,
  setFilterLocation,
  filterCategory,
  setFilterCategory,
  showProgressOnly,
  setShowProgressOnly,
  enableComparison,
  comparisonMode,
  setComparisonMode,
  photos,
  onExportData
}) => {
  const locations = [...new Set(photos.map(p => p.location).filter(Boolean))];
  const categories = [...new Set(photos.map(p => p.category).filter(Boolean))];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentTimeIndex < timelineData.length - 1) {
      setCurrentTimeIndex(currentTimeIndex + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentTimeIndex > 0) {
      setCurrentTimeIndex(currentTimeIndex - 1);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Timeline Controls
        </Typography>

        <Grid container spacing={3}>
          {/* Playback Controls */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Playback Controls
            </Typography>
            
            <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
              <Button
                onClick={handleStepBackward}
                disabled={currentTimeIndex === 0}
                startIcon={<FaStepBackward />}
              >
                Previous
              </Button>
              <Button
                onClick={handlePlayPause}
                startIcon={isPlaying ? <FaPause /> : <FaPlay />}
                color={isPlaying ? "error" : "primary"}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                onClick={handleStepForward}
                disabled={currentTimeIndex === timelineData.length - 1}
                endIcon={<FaStepForward />}
              >
                Next
              </Button>
            </ButtonGroup>

            <Box sx={{ px: 2 }}>
              <Typography variant="caption" gutterBottom display="block">
                Timeline Position: {currentTimeIndex + 1} / {timelineData.length}
              </Typography>
              <Slider
                value={currentTimeIndex}
                min={0}
                max={Math.max(0, timelineData.length - 1)}
                onChange={(_, value) => setCurrentTimeIndex(value)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `Period ${value + 1}`}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" gutterBottom display="block">
                Play Speed: {playSpeed}ms
              </Typography>
              <Slider
                value={playSpeed}
                min={500}
                max={5000}
                step={500}
                onChange={(_, value) => setPlaySpeed(value)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}ms`}
              />
            </Box>
          </Grid>

          {/* View and Filter Controls */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              View & Filters
            </Typography>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>View Mode</InputLabel>
              <Select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
              >
                <MenuItem value="timeline">Timeline View</MenuItem>
                <MenuItem value="grid">Grid View</MenuItem>
                <MenuItem value="chart">Chart View</MenuItem>
                {enableComparison && (
                  <MenuItem value="comparison">Comparison View</MenuItem>
                )}
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <MenuItem value="all">All Locations</MenuItem>
                    {locations.map(location => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showProgressOnly}
                    onChange={(e) => setShowProgressOnly(e.target.checked)}
                  />
                }
                label="Progress Photos Only"
              />
              
              {enableComparison && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={comparisonMode}
                      onChange={(e) => setComparisonMode(e.target.checked)}
                    />
                  }
                  label="Comparison Mode"
                />
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Button
              variant="outlined"
              startIcon={<FaDownload />}
              onClick={onExportData}
              fullWidth
            >
              Export Timeline Data
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TimelineControls;