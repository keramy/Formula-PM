import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Grid,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  LinearProgress
} from '@mui/material';
import {
  FaTrash,
  FaImage,
  FaPlus,
  FaTimes,
  FaExpand,
  FaCamera,
  FaUpload,
  FaGripVertical
} from 'react-icons/fa';
import ImageManager from './ImageManager';
import reportService from '../services/reportService';

const LineEditor = ({ line, lineNumber, reportId, sectionId, onUpdate, onDelete }) => {
  const [description, setDescription] = useState(line.description || '');
  const [images, setImages] = useState(line.images || []);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleDescriptionChange = (value) => {
    setDescription(value);
    onUpdate({ ...line, description: value });
  };

  const handleImageUpload = async (imageFiles, captions) => {
    setUploading(true);
    try {
      const uploadedImages = [];
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const caption = captions[i] || '';
        
        // Simulate upload - in real implementation, this would upload to server
        const uploadedImage = await reportService.uploadImage(
          reportId,
          sectionId,
          line.id,
          file,
          caption
        );
        
        uploadedImages.push(uploadedImage);
      }
      
      const newImages = [...images, ...uploadedImages];
      setImages(newImages);
      onUpdate({ ...line, images: newImages });
      setImageDialogOpen(false);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (imageId) => {
    const newImages = images.filter(img => img.id !== imageId);
    setImages(newImages);
    onUpdate({ ...line, images: newImages });
  };

  const handleUpdateImageCaption = (imageId, newCaption) => {
    const newImages = images.map(img =>
      img.id === imageId ? { ...img, caption: newCaption } : img
    );
    setImages(newImages);
    onUpdate({ ...line, images: newImages });
  };

  const openFullscreen = (image) => {
    setFullscreenImage(image);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          border: '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: 1,
            borderColor: 'primary.main'
          }
        }}
      >
        <Grid container spacing={2}>
          {/* Line Number and Controls */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FaGripVertical color="#999" style={{ marginRight: 8 }} />
              <Typography variant="subtitle2" color="textSecondary" sx={{ mr: 2 }}>
                Line {lineNumber}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Tooltip title="Add Images">
                <IconButton
                  size="small"
                  onClick={() => setImageDialogOpen(true)}
                  color="primary"
                >
                  <FaImage />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Line">
                <IconButton
                  size="small"
                  onClick={onDelete}
                  color="error"
                >
                  <FaTrash />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          {/* Description Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Enter description for this line..."
              variant="outlined"
              size="small"
            />
          </Grid>

          {/* Image Gallery */}
          {images.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="textSecondary" gutterBottom>
                  Attached Images ({images.length})
                </Typography>
                <Grid container spacing={1} sx={{ mt: 0.5 }}>
                  {images.map((image) => (
                    <Grid item xs={6} sm={4} md={3} key={image.id}>
                      <Card sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="120"
                          image={image.url}
                          alt={image.caption || 'Report image'}
                          sx={{ cursor: 'pointer' }}
                          onClick={() => openFullscreen(image)}
                        />
                        <CardActions sx={{ p: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Caption..."
                            value={image.caption || ''}
                            onChange={(e) => handleUpdateImageCaption(image.id, e.target.value)}
                            variant="standard"
                            sx={{ fontSize: '0.75rem' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(image.id)}
                            sx={{ ml: 1 }}
                          >
                            <FaTimes size={14} />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Image Upload Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Add Images to Line {lineNumber}</Typography>
            <IconButton onClick={() => setImageDialogOpen(false)}>
              <FaTimes />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <ImageManager
            onUpload={handleImageUpload}
            maxImages={10}
            existingImages={images}
          />
        </DialogContent>
        {uploading && <LinearProgress />}
      </Dialog>

      {/* Fullscreen Image Dialog */}
      <Dialog
        open={!!fullscreenImage}
        onClose={closeFullscreen}
        maxWidth="lg"
        fullWidth
      >
        {fullscreenImage && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{fullscreenImage.caption || 'Image'}</Typography>
                <IconButton onClick={closeFullscreen}>
                  <FaTimes />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', p: 0 }}>
              <img
                src={fullscreenImage.url}
                alt={fullscreenImage.caption || 'Report image'}
                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
              />
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default LineEditor;