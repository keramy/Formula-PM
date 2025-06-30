/**
 * Photo Sequence Viewer - Displays photo progressions and timelines
 * SiteCam-inspired automation for Formula PM
 * Phase 2: Smart Automation Agent
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  Grid,
  Slider,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Paper,
  Divider,
  Avatar,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  MdPlayArrow as FaPlay,
  MdPause as FaPause,
  MdFastForward as FaStepForward,
  MdFastRewind as FaStepBackward,
  MdFullscreen as FaExpand,
  MdSchedule as FaClock,
  MdLocationOn as FaMapMarkerAlt,
  MdImage as FaImages,
  MdKeyboardArrowUp as FaChartLine,
  MdLabel as FaTags,
  MdVisibility as FaEye,
  MdDownload as FaDownload
} from 'react-icons/md';

const PhotoSequenceViewer = ({ 
  sequences = [], 
  onSequenceSelect,
  onPhotoSelect,
  showControls = true,
  autoPlay = false,
  height = 400 
}) => {
  const [selectedSequence, setSelectedSequence] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playSpeed, setPlaySpeed] = useState(2000); // milliseconds
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline', 'grid', 'comparison'
  const [fullScreenPhoto, setFullScreenPhoto] = useState(null);
  const [showMetadata, setShowMetadata] = useState(false);

  // Auto-play functionality
  React.useEffect(() => {
    let interval;
    if (isPlaying && sequences.length > 0) {
      interval = setInterval(() => {
        setCurrentPhotoIndex(prev => {
          const sequence = sequences[selectedSequence];
          if (!sequence) return 0;
          return (prev + 1) % sequence.photos.length;
        });
      }, playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, selectedSequence, sequences]);

  const currentSequence = sequences[selectedSequence] || null;
  const currentPhoto = currentSequence?.photos[currentPhotoIndex] || null;

  const sequenceStats = useMemo(() => {
    if (!sequences.length) return null;
    
    return {
      totalSequences: sequences.length,
      totalPhotos: sequences.reduce((sum, seq) => sum + seq.photos.length, 0),
      locations: [...new Set(sequences.map(seq => seq.location))],
      timeSpan: sequences.reduce((span, seq) => {
        const seqSpan = seq.timeSpan;
        return {
          earliest: !span.earliest || new Date(seqSpan.startDate) < new Date(span.earliest) 
            ? seqSpan.startDate : span.earliest,
          latest: !span.latest || new Date(seqSpan.endDate) > new Date(span.latest) 
            ? seqSpan.endDate : span.latest
        };
      }, {})
    };
  }, [sequences]);

  const handleSequenceChange = (sequenceIndex) => {
    setSelectedSequence(sequenceIndex);
    setCurrentPhotoIndex(0);
    if (onSequenceSelect) {
      onSequenceSelect(sequences[sequenceIndex]);
    }
  };

  const handlePhotoChange = (photoIndex) => {
    setCurrentPhotoIndex(photoIndex);
    if (onPhotoSelect && currentSequence) {
      onPhotoSelect(currentSequence.photos[photoIndex]);
    }
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentSequence) {
      handlePhotoChange((currentPhotoIndex + 1) % currentSequence.photos.length);
    }
  };

  const handleStepBackward = () => {
    if (currentSequence) {
      const newIndex = currentPhotoIndex === 0 
        ? currentSequence.photos.length - 1 
        : currentPhotoIndex - 1;
      handlePhotoChange(newIndex);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSequenceTypePalette = (type) => {
    const colors = {
      'before-after': '#2196F3',
      'progress-sequence': '#4CAF50',
      'quality-sequence': '#FF9800',
      'issue-sequence': '#F44336',
      'time-sequence': '#9C27B0'
    };
    return colors[type] || '#757575';
  };

  const renderSequenceSelector = () => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Photo Sequences ({sequences.length})
      </Typography>
      <Grid container spacing={1}>
        {sequences.map((sequence, index) => (
          <Grid item key={sequence.id}>
            <Card 
              variant={selectedSequence === index ? "outlined" : "elevation"}
              sx={{ 
                cursor: 'pointer',
                bgcolor: selectedSequence === index ? 'primary.light' : 'background.paper',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => handleSequenceChange(index)}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="caption" display="block">
                  {sequence.location}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {sequence.photos.length} photos
                </Typography>
                <Chip 
                  label={sequence.type}
                  size="small"
                  sx={{ 
                    mt: 0.5,
                    bgcolor: getSequenceTypePalette(sequence.type),
                    color: 'white',
                    fontSize: '0.7rem'
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderTimelineView = () => {
    if (!currentSequence) return null;

    return (
      <Box>
        {/* Photo Display */}
        <Paper sx={{ p: 2, mb: 2, textAlign: 'center' }}>
          {currentPhoto ? (
            <Box>
              <img
                src={currentPhoto.thumbnail || currentPhoto.url}
                alt={currentPhoto.caption || 'Sequence photo'}
                style={{
                  maxWidth: '100%',
                  maxHeight: height - 200,
                  objectFit: 'contain',
                  cursor: 'pointer'
                }}
                onClick={() => setFullScreenPhoto(currentPhoto)}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(currentPhoto.capturedAt)}
                </Typography>
                <Typography variant="h6">
                  {currentPhoto.caption || 'Untitled'}
                </Typography>
                {currentPhoto.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {currentPhoto.description}
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Typography>No photo selected</Typography>
          )}
        </Paper>

        {/* Timeline Controls */}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ minWidth: 100 }}>
              Photo {currentPhotoIndex + 1} of {currentSequence.photos.length}
            </Typography>
            <Box sx={{ flex: 1, mx: 2 }}>
              <Slider
                value={currentPhotoIndex}
                min={0}
                max={currentSequence.photos.length - 1}
                onChange={(_, value) => handlePhotoChange(value)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `Photo ${value + 1}`}
              />
            </Box>
            <Tooltip title="Show metadata">
              <IconButton 
                size="small" 
                onClick={() => setShowMetadata(!showMetadata)}
                color={showMetadata ? 'primary' : 'default'}
              >
                <FaEye />
              </IconButton>
            </Tooltip>
          </Box>

          {showControls && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <IconButton onClick={handleStepBackward}>
                <FaStepBackward />
              </IconButton>
              <IconButton onClick={handlePlayToggle}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </IconButton>
              <IconButton onClick={handleStepForward}>
                <FaStepForward />
              </IconButton>
            </Box>
          )}

          {/* Speed Control */}
          {isPlaying && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ mr: 2 }}>
                Speed:
              </Typography>
              <ButtonGroup size="small">
                <Button 
                  variant={playSpeed === 3000 ? 'contained' : 'outlined'}
                  onClick={() => setPlaySpeed(3000)}
                >
                  Slow
                </Button>
                <Button 
                  variant={playSpeed === 2000 ? 'contained' : 'outlined'}
                  onClick={() => setPlaySpeed(2000)}
                >
                  Normal
                </Button>
                <Button 
                  variant={playSpeed === 1000 ? 'contained' : 'outlined'}
                  onClick={() => setPlaySpeed(1000)}
                >
                  Fast
                </Button>
              </ButtonGroup>
            </Box>
          )}
        </Paper>
      </Box>
    );
  };

  const renderGridView = () => {
    if (!currentSequence) return null;

    return (
      <Grid container spacing={2}>
        {currentSequence.photos.map((photo, index) => (
          <Grid item xs={6} sm={4} md={3} key={photo.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: currentPhotoIndex === index ? 2 : 0,
                borderPalette: 'primary.main'
              }}
              onClick={() => handlePhotoChange(index)}
            >
              <Box sx={{ position: 'relative' }}>
                <img
                  src={photo.thumbnail || photo.url}
                  alt={photo.caption}
                  style={{
                    width: '100%',
                    height: 150,
                    objectFit: 'cover'
                  }}
                />
                <Chip
                  label={`#${index + 1}`}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white'
                  }}
                />
              </Box>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" display="block" noWrap>
                  {formatDate(photo.capturedAt)}
                </Typography>
                <Typography variant="body2" noWrap>
                  {photo.caption || 'Untitled'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderComparisonView = () => {
    if (!currentSequence || currentSequence.photos.length < 2) return null;

    const firstPhoto = currentSequence.photos[0];
    const lastPhoto = currentSequence.photos[currentSequence.photos.length - 1];

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Before - {formatDate(firstPhoto.capturedAt)}
            </Typography>
            <img
              src={firstPhoto.thumbnail || firstPhoto.url}
              alt="Before"
              style={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'contain',
                cursor: 'pointer'
              }}
              onClick={() => setFullScreenPhoto(firstPhoto)}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {firstPhoto.description || firstPhoto.caption}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              After - {formatDate(lastPhoto.capturedAt)}
            </Typography>
            <img
              src={lastPhoto.thumbnail || lastPhoto.url}
              alt="After"
              style={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'contain',
                cursor: 'pointer'
              }}
              onClick={() => setFullScreenPhoto(lastPhoto)}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {lastPhoto.description || lastPhoto.caption}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const renderSequenceInfo = () => {
    if (!currentSequence) return null;

    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FaMapMarkerAlt style={{ marginRight: 8 }} />
              <Typography variant="body2">
                {currentSequence.location}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FaImages style={{ marginRight: 8 }} />
              <Typography variant="body2">
                {currentSequence.photos.length} photos
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FaClock style={{ marginRight: 8 }} />
              <Typography variant="body2">
                {currentSequence.timeSpan.description}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'right' }}>
              <Chip 
                label={currentSequence.type}
                sx={{ 
                  bgcolor: getSequenceTypePalette(currentSequence.type),
                  color: 'white',
                  mb: 1
                }}
              />
              <Typography variant="caption" display="block">
                {formatDate(currentSequence.timeSpan.startDate)} - {formatDate(currentSequence.timeSpan.endDate)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const renderMetadataPanel = () => {
    if (!showMetadata || !currentPhoto) return null;

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Photo Metadata
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2"><strong>Filename:</strong> {currentPhoto.originalName}</Typography>
            <Typography variant="body2"><strong>Captured:</strong> {formatDate(currentPhoto.capturedAt)}</Typography>
            <Typography variant="body2"><strong>Category:</strong> {currentPhoto.category}</Typography>
            <Typography variant="body2"><strong>Work Category:</strong> {currentPhoto.project?.workCategory || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2"><strong>Resolution:</strong> {currentPhoto.quality?.resolution?.width}x{currentPhoto.quality?.resolution?.height}</Typography>
            <Typography variant="body2"><strong>File Size:</strong> {currentPhoto.quality?.fileSize} MB</Typography>
            {currentPhoto.tags && currentPhoto.tags.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2"><strong>Tags:</strong></Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {currentPhoto.tags.map(tag => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const renderStats = () => {
    if (!sequenceStats) return null;

    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sequence Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {sequenceStats.totalSequences}
              </Typography>
              <Typography variant="caption">
                Sequences
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {sequenceStats.totalPhotos}
              </Typography>
              <Typography variant="caption">
                Total Photos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {sequenceStats.locations.length}
              </Typography>
              <Typography variant="caption">
                Locations
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {sequenceStats.timeSpan.earliest && sequenceStats.timeSpan.latest
                  ? Math.ceil((new Date(sequenceStats.timeSpan.latest) - new Date(sequenceStats.timeSpan.earliest)) / (1000 * 60 * 60 * 24))
                  : 0}
              </Typography>
              <Typography variant="caption">
                Days Span
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  if (!sequences.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <FaImages size={48} color="#ccc" />
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          No Photo Sequences Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload photos and generate sequences to view timeline progressions
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Stats Overview */}
      {renderStats()}

      {/* Sequence Selector */}
      {renderSequenceSelector()}

      {/* View Mode Selector */}
      <Box sx={{ mb: 2 }}>
        <ButtonGroup variant="outlined" size="small">
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
            variant={viewMode === 'comparison' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('comparison')}
            disabled={!currentSequence || currentSequence.photos.length < 2}
          >
            Comparison
          </Button>
        </ButtonGroup>
      </Box>

      {/* Sequence Info */}
      {renderSequenceInfo()}

      {/* Main Content */}
      {viewMode === 'timeline' && renderTimelineView()}
      {viewMode === 'grid' && renderGridView()}
      {viewMode === 'comparison' && renderComparisonView()}

      {/* Metadata Panel */}
      {renderMetadataPanel()}

      {/* Full Screen Photo Dialog */}
      <Dialog
        open={!!fullScreenPhoto}
        onClose={() => setFullScreenPhoto(null)}
        maxWidth="md"
        fullWidth
      >
        {fullScreenPhoto && (
          <>
            <DialogTitle>
              {fullScreenPhoto.caption || 'Photo'} - {formatDate(fullScreenPhoto.capturedAt)}
            </DialogTitle>
            <DialogContent>
              <img
                src={fullScreenPhoto.url}
                alt={fullScreenPhoto.caption}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
              {fullScreenPhoto.description && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {fullScreenPhoto.description}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setFullScreenPhoto(null)}>
                Close
              </Button>
              <Button startIcon={<FaDownload />}>
                Download
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PhotoSequenceViewer;