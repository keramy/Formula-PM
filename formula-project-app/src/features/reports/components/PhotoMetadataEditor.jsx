/**
 * PhotoMetadataEditor - Edit metadata for existing photos
 * Allows bulk editing and individual photo metadata management
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaMapMarkerAlt,
  FaTags,
  FaInfo,
  FaCopy,
  FaTrash
} from 'react-icons/fa';
import photoService from '../services/photoService';
import metadataService from '../services/metadataService';

const PhotoMetadataEditor = ({ 
  photos = [], 
  open = false, 
  onClose, 
  onSave,
  allowBulkEdit = true 
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [editingPhotos, setEditingPhotos] = useState([]);
  const [bulkMetadata, setBulkMetadata] = useState({});
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (open && photos.length > 0) {
      initializeEditingPhotos();
      loadSuggestions();
    }
  }, [open, photos]);

  const initializeEditingPhotos = () => {
    const editablePhotos = photos.map(photo => ({
      ...photo,
      originalMetadata: { ...photo } // Keep original for comparison
    }));
    setEditingPhotos(editablePhotos);
  };

  const loadSuggestions = async () => {
    try {
      // Extract unique values from existing photos for suggestions
      const uniqueTags = [...new Set(photos.flatMap(photo => photo.tags || []))];
      const uniqueLocations = [...new Set(photos.map(photo => 
        `${photo.location?.floor || ''} - ${photo.location?.room || ''}`
      ).filter(Boolean))];
      
      setTagSuggestions(uniqueTags);
      
      // Also load project-specific suggestions if available
      if (photos.length > 0 && photos[0].project?.id) {
        const projectLocations = await metadataService.getProjectLocations(photos[0].project.id);
        setLocationSuggestions(projectLocations);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handlePhotoMetadataChange = (photoId, field, value) => {
    setEditingPhotos(prev => prev.map(photo => {
      if (photo.id === photoId) {
        if (field.includes('.')) {
          // Handle nested fields like 'location.room'
          const [parent, child] = field.split('.');
          return {
            ...photo,
            [parent]: {
              ...photo[parent],
              [child]: value
            }
          };
        } else {
          return {
            ...photo,
            [field]: value
          };
        }
      }
      return photo;
    }));
  };

  const handleBulkMetadataChange = (field, value) => {
    setBulkMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyBulkMetadata = () => {
    if (selectedPhotos.length === 0) {
      alert('Please select photos to apply bulk changes');
      return;
    }

    setEditingPhotos(prev => prev.map(photo => {
      if (selectedPhotos.includes(photo.id)) {
        const updatedPhoto = { ...photo };
        
        // Apply bulk metadata
        Object.keys(bulkMetadata).forEach(field => {
          if (bulkMetadata[field] !== undefined && bulkMetadata[field] !== '') {
            if (field.includes('.')) {
              const [parent, child] = field.split('.');
              updatedPhoto[parent] = {
                ...updatedPhoto[parent],
                [child]: bulkMetadata[field]
              };
            } else if (field === 'tags') {
              // For tags, merge with existing tags
              updatedPhoto.tags = [...new Set([...updatedPhoto.tags, ...bulkMetadata.tags])];
            } else {
              updatedPhoto[field] = bulkMetadata[field];
            }
          }
        });
        
        return updatedPhoto;
      }
      return photo;
    }));

    // Clear bulk metadata
    setBulkMetadata({});
    setSelectedPhotos([]);
  };

  const handlePhotoSelection = (photoId, selected) => {
    setSelectedPhotos(prev => 
      selected 
        ? [...prev, photoId]
        : prev.filter(id => id !== photoId)
    );
  };

  const selectAllPhotos = () => {
    setSelectedPhotos(editingPhotos.map(photo => photo.id));
  };

  const clearSelection = () => {
    setSelectedPhotos([]);
  };

  const validatePhoto = (photo) => {
    const validation = metadataService.validateMetadata(photo, photo.category);
    return validation;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validate all photos
      const errors = {};
      editingPhotos.forEach(photo => {
        const validation = validatePhoto(photo);
        if (!validation.isValid) {
          errors[photo.id] = validation.errors;
        }
      });

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setLoading(false);
        return;
      }

      // Save changes
      const updatePromises = editingPhotos
        .filter(photo => JSON.stringify(photo) !== JSON.stringify(photo.originalMetadata))
        .map(photo => photoService.updatePhoto(photo.id, photo));

      await Promise.all(updatePromises);

      if (onSave) {
        onSave(editingPhotos);
      }

      onClose();
    } catch (error) {
      console.error('Error saving photo metadata:', error);
      alert('Error saving changes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyMetadataFrom = (sourcePhotoId, targetPhotoId) => {
    const sourcePhoto = editingPhotos.find(p => p.id === sourcePhotoId);
    if (sourcePhoto) {
      setEditingPhotos(prev => prev.map(photo => {
        if (photo.id === targetPhotoId) {
          return {
            ...photo,
            caption: sourcePhoto.caption,
            description: sourcePhoto.description,
            tags: [...sourcePhoto.tags],
            category: sourcePhoto.category,
            location: { ...sourcePhoto.location },
            construction: { ...sourcePhoto.construction }
          };
        }
        return photo;
      }));
    }
  };

  const renderIndividualEditor = () => (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Individual Photo Editing ({editingPhotos.length} photos)
        </Typography>
        <Box>
          <Button size="small" onClick={selectAllPhotos} sx={{ mr: 1 }}>
            Select All
          </Button>
          <Button size="small" onClick={clearSelection}>
            Clear Selection
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {editingPhotos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.id}>
            <Card 
              sx={{ 
                border: selectedPhotos.includes(photo.id) ? 2 : 1,
                borderColor: selectedPhotos.includes(photo.id) ? 'primary.main' : 'divider',
                cursor: 'pointer'
              }}
              onClick={() => handlePhotoSelection(photo.id, !selectedPhotos.includes(photo.id))}
            >
              <CardMedia
                component="img"
                height="200"
                image={photo.url || photo.thumbnail}
                alt={photo.caption || photo.originalName}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Caption"
                  value={photo.caption || ''}
                  onChange={(e) => handlePhotoMetadataChange(photo.id, 'caption', e.target.value)}
                  sx={{ mb: 1 }}
                  onClick={(e) => e.stopPropagation()}
                />

                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="Description"
                  value={photo.description || ''}
                  onChange={(e) => handlePhotoMetadataChange(photo.id, 'description', e.target.value)}
                  sx={{ mb: 1 }}
                  onClick={(e) => e.stopPropagation()}
                />

                <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={photo.category || 'general'}
                    onChange={(e) => handlePhotoMetadataChange(photo.id, 'category', e.target.value)}
                    label="Category"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {photoService.getPhotoCategories().map(cat => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    label="Room"
                    value={photo.location?.room || ''}
                    onChange={(e) => handlePhotoMetadataChange(photo.id, 'location.room', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    size="small"
                    label="Area"
                    value={photo.location?.area || ''}
                    onChange={(e) => handlePhotoMetadataChange(photo.id, 'location.area', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ flex: 1 }}
                  />
                </Box>

                <Autocomplete
                  multiple
                  freeSolo
                  size="small"
                  options={tagSuggestions}
                  value={photo.tags || []}
                  onChange={(e, newValue) => handlePhotoMetadataChange(photo.id, 'tags', newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={index}
                        size="small"
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
                  onClick={(e) => e.stopPropagation()}
                />

                {validationErrors[photo.id] && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {validationErrors[photo.id].map((error, index) => (
                      <Typography key={index} variant="body2">
                        {error}
                      </Typography>
                    ))}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderBulkEditor = () => (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Select photos from the Individual tab, then use these fields to apply changes to all selected photos.
        Selected: {selectedPhotos.length} photos
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>

            <TextField
              fullWidth
              label="Caption (append to existing)"
              value={bulkMetadata.caption || ''}
              onChange={(e) => handleBulkMetadataChange('caption', e.target.value)}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={bulkMetadata.category || ''}
                onChange={(e) => handleBulkMetadataChange('category', e.target.value)}
                label="Category"
              >
                <MenuItem value="">Keep existing</MenuItem>
                {photoService.getPhotoCategories().map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              multiple
              freeSolo
              options={tagSuggestions}
              value={bulkMetadata.tags || []}
              onChange={(e, newValue) => handleBulkMetadataChange('tags', newValue)}
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
                  label="Tags (add to existing)"
                  placeholder="Add tags to all selected photos..."
                />
              )}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Location Information
            </Typography>

            <TextField
              fullWidth
              label="Building"
              value={bulkMetadata['location.building'] || ''}
              onChange={(e) => handleBulkMetadataChange('location.building', e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Floor"
              value={bulkMetadata['location.floor'] || ''}
              onChange={(e) => handleBulkMetadataChange('location.floor', e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Room"
              value={bulkMetadata['location.room'] || ''}
              onChange={(e) => handleBulkMetadataChange('location.room', e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Area"
              value={bulkMetadata['location.area'] || ''}
              onChange={(e) => handleBulkMetadataChange('location.area', e.target.value)}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={applyBulkMetadata}
              disabled={selectedPhotos.length === 0}
              startIcon={<FaCopy />}
            >
              Apply to {selectedPhotos.length} Selected Photos
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaEdit />
          <Typography variant="h6">Edit Photo Metadata</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label="Individual Photos" />
            {allowBulkEdit && <Tab label="Bulk Edit" />}
          </Tabs>
        </Box>

        {selectedTab === 0 && renderIndividualEditor()}
        {selectedTab === 1 && allowBulkEdit && renderBulkEditor()}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Typography variant="body2" color="textSecondary" sx={{ flex: 1 }}>
          {selectedPhotos.length > 0 && `${selectedPhotos.length} photos selected`}
        </Typography>
        <Button
          onClick={onClose}
          disabled={loading}
          startIcon={<FaTimes />}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          startIcon={<FaSave />}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhotoMetadataEditor;