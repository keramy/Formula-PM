/**
 * PhotoCapture - Enhanced photo capture component with rich metadata
 * SiteCam-inspired photo capture with GPS, location, and construction metadata
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  FaCamera,
  FaMapMarkerAlt,
  FaTags,
  FaCog,
  FaCheck,
  FaTimes,
  FaInfo,
  FaExclamationTriangle
} from 'react-icons/fa';
import photoService from '../services/photoService';
import metadataService from '../services/metadataService';

const PhotoCapture = ({ 
  onPhotoCaptured, 
  projectId, 
  projectName, 
  projectPhase = 'construction',
  defaultLocation = {},
  open = false,
  onClose 
}) => {
  const [photoMetadata, setPhotoMetadata] = useState({
    caption: '',
    description: '',
    tags: [],
    category: 'progress',
    priority: 'normal',
    location: {
      gps: null,
      floor: defaultLocation.floor || '',
      room: defaultLocation.room || '',
      area: defaultLocation.area || '',
      building: defaultLocation.building || ''
    },
    project: {
      id: projectId,
      name: projectName,
      phase: projectPhase,
      workCategory: 'General'
    },
    construction: {
      trade: '',
      workType: '',
      inspectionType: '',
      status: 'active'
    }
  });

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('disabled');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      loadMetadataSuggestions();
      if (projectId) {
        loadProjectLocations();
      }
    }
  }, [open, projectId]);

  useEffect(() => {
    if (gpsEnabled) {
      getCurrentLocation();
    }
  }, [gpsEnabled]);

  const loadMetadataSuggestions = async () => {
    try {
      const suggestions = await metadataService.getMetadataSuggestions({
        projectId,
        projectPhase,
        workCategory: photoMetadata.project.workCategory
      });
      setTagSuggestions(suggestions.tags);
    } catch (error) {
      console.error('Error loading metadata suggestions:', error);
    }
  };

  const loadProjectLocations = async () => {
    try {
      const locations = await metadataService.getProjectLocations(projectId);
      setLocationSuggestions(locations);
    } catch (error) {
      console.error('Error loading project locations:', error);
    }
  };

  const getCurrentLocation = async () => {
    setGpsStatus('acquiring');
    try {
      const location = await metadataService.getCurrentLocation();
      setPhotoMetadata(prev => ({
        ...prev,
        location: {
          ...prev.location,
          gps: {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy
          }
        }
      }));
      setGpsStatus('acquired');
    } catch (error) {
      console.error('GPS error:', error);
      setGpsStatus('error');
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      
      // Create preview URLs
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleMetadataChange = (field, value) => {
    setPhotoMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (field, value) => {
    setPhotoMetadata(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleConstructionChange = (field, value) => {
    setPhotoMetadata(prev => ({
      ...prev,
      construction: {
        ...prev.construction,
        [field]: value
      }
    }));
  };

  const handleTagsChange = (event, newValue) => {
    setPhotoMetadata(prev => ({
      ...prev,
      tags: newValue
    }));
  };

  const validateMetadata = () => {
    const validation = metadataService.validateMetadata(photoMetadata, photoMetadata.category);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  const handleCapture = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one photo');
      return;
    }

    if (!validateMetadata()) {
      return;
    }

    setLoading(true);
    try {
      const uploadPromises = selectedFiles.map(file => 
        photoService.uploadPhoto(file, photoMetadata)
      );

      const uploadedPhotos = await Promise.all(uploadPromises);
      
      // Call the callback with the uploaded photos
      if (onPhotoCaptured) {
        onPhotoCaptured(uploadedPhotos);
      }

      // Clean up
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setPreviewUrls([]);
      setPhotoMetadata(prev => ({
        ...prev,
        caption: '',
        description: '',
        tags: []
      }));

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error capturing photos:', error);
      alert('Error uploading photos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Clean up preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setValidationErrors([]);
    
    if (onClose) {
      onClose();
    }
  };

  const getGpsStatusColor = () => {
    switch (gpsStatus) {
      case 'acquired': return 'success';
      case 'acquiring': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getGpsStatusText = () => {
    switch (gpsStatus) {
      case 'acquired': return 'GPS Location Acquired';
      case 'acquiring': return 'Acquiring GPS...';
      case 'error': return 'GPS Error';
      default: return 'GPS Disabled';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaCamera />
          <Typography variant="h6">Capture Photos with Metadata</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Photo Selection */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Select Photos
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                startIcon={<FaCamera />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ mb: 2 }}
              >
                Select Photos
              </Button>

              {selectedFiles.length > 0 && (
                <Grid container spacing={2}>
                  {selectedFiles.map((file, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Card>
                        <Box
                          component="img"
                          src={previewUrls[index]}
                          alt={`Preview ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: 150,
                            objectFit: 'cover'
                          }}
                        />
                        <CardContent sx={{ p: 1 }}>
                          <Typography variant="caption" noWrap>
                            {file.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Basic Metadata */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Photo Information
              </Typography>
              
              <TextField
                fullWidth
                label="Caption"
                value={photoMetadata.caption}
                onChange={(e) => handleMetadataChange('caption', e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={photoMetadata.description}
                onChange={(e) => handleMetadataChange('description', e.target.value)}
                sx={{ mb: 2 }}
              />

              <Autocomplete
                multiple
                freeSolo
                options={tagSuggestions}
                value={photoMetadata.tags}
                onChange={handleTagsChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add tags..."
                  />
                )}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={photoMetadata.category}
                  onChange={(e) => handleMetadataChange('category', e.target.value)}
                  label="Category"
                >
                  {photoService.getPhotoCategories().map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={photoMetadata.priority}
                  onChange={(e) => handleMetadataChange('priority', e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* Location Metadata */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FaMapMarkerAlt />
                <Typography variant="h6">Location Information</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={gpsEnabled}
                    onChange={(e) => setGpsEnabled(e.target.checked)}
                  />
                }
                label="Enable GPS"
                sx={{ mb: 1 }}
              />

              {gpsEnabled && (
                <Chip
                  label={getGpsStatusText()}
                  color={getGpsStatusColor()}
                  size="small"
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                fullWidth
                label="Building"
                value={photoMetadata.location.building}
                onChange={(e) => handleLocationChange('building', e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Floor"
                value={photoMetadata.location.floor}
                onChange={(e) => handleLocationChange('floor', e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Room"
                value={photoMetadata.location.room}
                onChange={(e) => handleLocationChange('room', e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Area"
                value={photoMetadata.location.area}
                onChange={(e) => handleLocationChange('area', e.target.value)}
              />
            </Paper>
          </Grid>

          {/* Construction Metadata */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Construction Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Work Category</InputLabel>
                    <Select
                      value={photoMetadata.project.workCategory}
                      onChange={(e) => handleMetadataChange('project', {
                        ...photoMetadata.project,
                        workCategory: e.target.value
                      })}
                      label="Work Category"
                    >
                      {photoService.getWorkCategories().map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Trade"
                    value={photoMetadata.construction.trade}
                    onChange={(e) => handleConstructionChange('trade', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Work Type"
                    value={photoMetadata.construction.workType}
                    onChange={(e) => handleConstructionChange('workType', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={photoMetadata.construction.status}
                      onChange={(e) => handleConstructionChange('status', e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="on-hold">On Hold</MenuItem>
                      <MenuItem value="requires-attention">Requires Attention</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Grid item xs={12}>
              <Alert severity="error">
                <Typography variant="body2" gutterBottom>
                  Please fix the following issues:
                </Typography>
                {validationErrors.map((error, index) => (
                  <Typography key={index} variant="body2">
                    • {error}
                  </Typography>
                ))}
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleCancel}
          disabled={loading}
          startIcon={<FaTimes />}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCapture}
          variant="contained"
          disabled={loading || selectedFiles.length === 0}
          startIcon={<FaCheck />}
        >
          {loading ? 'Uploading...' : `Capture ${selectedFiles.length} Photo${selectedFiles.length !== 1 ? 's' : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhotoCapture;