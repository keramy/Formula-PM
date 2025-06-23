import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  TextField,
  Chip,
  Alert,
  LinearProgress,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  FaCloudUploadAlt,
  FaTrash,
  FaImage,
  FaCamera,
  FaTimes,
  FaCheck,
  FaEdit,
  FaMapMarkerAlt,
  FaEllipsisV
} from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import PhotoCapture from './PhotoCapture';
import PhotoMetadataEditor from './PhotoMetadataEditor';
import LocationPhotoMap from './LocationPhotoMap';
import photoService from '../services/photoService';

const ImageManager = ({ 
  onUpload, 
  maxImages = 10, 
  existingImages = [],
  projectId,
  projectName,
  projectPhase = 'construction',
  enableAdvancedFeatures = true,
  showLocationMap = true
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [captions, setCaptions] = useState({});
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState([]);
  const [photoCaptureOpen, setPhotoCaptureOpen] = useState(false);
  const [metadataEditorOpen, setMetadataEditorOpen] = useState(false);
  const [selectedPhotosForEdit, setSelectedPhotosForEdit] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [allPhotos, setAllPhotos] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const newErrors = rejectedFiles.map(rejection => ({
        file: rejection.file.name,
        errors: rejection.errors.map(e => e.message).join(', ')
      }));
      setErrors(newErrors);
    }

    // Check max images limit
    const totalImages = existingImages.length + selectedFiles.length + acceptedFiles.length;
    if (totalImages > maxImages) {
      setErrors([{
        file: 'Maximum limit',
        errors: `You can only upload ${maxImages} images total. Currently have ${existingImages.length + selectedFiles.length}.`
      }]);
      return;
    }

    // Process accepted files
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: `temp-${Date.now()}-${Math.random()}`,
      preview: URL.createObjectURL(file)
    }));

    setSelectedFiles([...selectedFiles, ...newFiles]);
    setPreviews([...previews, ...newFiles.map(f => f.preview)]);
    setErrors([]);
  }, [selectedFiles, existingImages.length, maxImages, previews]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (fileId) => {
    const fileToRemove = selectedFiles.find(f => f.id === fileId);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    setSelectedFiles(selectedFiles.filter(f => f.id !== fileId));
    const newCaptions = { ...captions };
    delete newCaptions[fileId];
    setCaptions(newCaptions);
  };

  const updateCaption = (fileId, caption) => {
    setCaptions({ ...captions, [fileId]: caption });
  };

  const handleUpload = () => {
    const files = selectedFiles.map(f => f.file);
    const fileCaptions = selectedFiles.map(f => captions[f.id] || '');
    onUpload(files, fileCaptions);
    
    // Clean up previews
    selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setSelectedFiles([]);
    setCaptions({});
    setPreviews([]);
  };

  const handlePhotoCaptured = (capturedPhotos) => {
    // Convert captured photos to the format expected by the parent component
    const files = capturedPhotos.map(photo => {
      // Create a mock file object from the captured photo data
      return {
        name: photo.originalName,
        size: photo.fileSize,
        type: photo.mimeType,
        url: photo.url
      };
    });
    const captions = capturedPhotos.map(photo => photo.caption || '');
    
    if (onUpload) {
      onUpload(files, captions);
    }
    
    setPhotoCaptureOpen(false);
  };

  const handleEditMetadata = () => {
    if (existingImages.length > 0) {
      // Convert existing images to photo objects for metadata editing
      const photosForEdit = existingImages.map((img, index) => ({
        id: `existing_${index}`,
        url: img.url || img,
        originalName: img.name || `Image ${index + 1}`,
        caption: img.caption || '',
        tags: img.tags || [],
        category: img.category || 'general',
        location: img.location || {},
        project: {
          id: projectId,
          name: projectName,
          phase: projectPhase
        }
      }));
      setSelectedPhotosForEdit(photosForEdit);
      setMetadataEditorOpen(true);
    }
  };

  const loadProjectPhotos = async () => {
    if (projectId && enableAdvancedFeatures) {
      try {
        const photos = await photoService.getPhotosByProject(projectId);
        setAllPhotos(photos);
      } catch (error) {
        console.error('Error loading project photos:', error);
      }
    }
  };

  const clearAll = () => {
    selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setSelectedFiles([]);
    setCaptions({});
    setPreviews([]);
    setErrors([]);
  };

  return (
    <Box>
      {/* Drop Zone */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          mb: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt size={48} color={isDragActive ? '#1976d2' : '#999'} />
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          or click to select files
        </Typography>
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
          Supported formats: JPEG, PNG, GIF, WebP (max 10MB each)
        </Typography>
      </Paper>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrors([])}>
          {errors.map((error, index) => (
            <Typography key={index} variant="body2">
              <strong>{error.file}:</strong> {error.errors}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Enhanced Controls */}
      {enableAdvancedFeatures && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<FaCamera />}
            onClick={() => setPhotoCaptureOpen(true)}
          >
            Capture with Metadata
          </Button>
          {existingImages.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<FaEdit />}
              onClick={handleEditMetadata}
            >
              Edit Metadata
            </Button>
          )}
          <IconButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            size="small"
          >
            <FaEllipsisV />
          </IconButton>
        </Box>
      )}

      {/* Location Map */}
      {showLocationMap && enableAdvancedFeatures && allPhotos.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <LocationPhotoMap
            projectId={projectId}
            photos={allPhotos}
            onPhotoSelect={(photo) => console.log('Photo selected:', photo)}
            onLocationSelect={(location, photos) => console.log('Location selected:', location, photos)}
          />
        </Box>
      )}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Selected Images ({selectedFiles.length})
            </Typography>
            <Box>
              <Button
                variant="outlined"
                size="small"
                onClick={clearAll}
                sx={{ mr: 1 }}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<FaCheck />}
                onClick={handleUpload}
              >
                Add to Report
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {selectedFiles.map((fileObj) => (
              <Grid item xs={12} sm={6} md={4} key={fileObj.id}>
                <Card>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={fileObj.preview}
                      alt="Preview"
                      sx={{ objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeFile(fileObj.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'error.main', color: 'white' }
                      }}
                    >
                      <FaTimes size={16} />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="textSecondary" noWrap>
                      {fileObj.file.name}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add caption (optional)"
                      value={captions[fileObj.id] || ''}
                      onChange={(e) => updateCaption(fileObj.id, e.target.value)}
                      sx={{ mt: 1 }}
                      variant="outlined"
                    />
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      <Chip
                        label={`${(fileObj.file.size / 1024 / 1024).toFixed(2)} MB`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={fileObj.file.type.split('/')[1].toUpperCase()}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Existing Images Count */}
      {existingImages.length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          This line already has {existingImages.length} image{existingImages.length > 1 ? 's' : ''} attached.
          You can add up to {maxImages - existingImages.length} more.
        </Alert>
      )}

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => { loadProjectPhotos(); setMenuAnchor(null); }}>
          <FaImage style={{ marginRight: 8 }} />
          Load Project Photos
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <FaMapMarkerAlt style={{ marginRight: 8 }} />
          View Location Map
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setMenuAnchor(null)}>
          Export Photo Data
        </MenuItem>
      </Menu>

      {/* Photo Capture Dialog */}
      {enableAdvancedFeatures && (
        <PhotoCapture
          open={photoCaptureOpen}
          onClose={() => setPhotoCaptureOpen(false)}
          onPhotoCaptured={handlePhotoCaptured}
          projectId={projectId}
          projectName={projectName}
          projectPhase={projectPhase}
        />
      )}

      {/* Metadata Editor Dialog */}
      {enableAdvancedFeatures && (
        <PhotoMetadataEditor
          open={metadataEditorOpen}
          onClose={() => setMetadataEditorOpen(false)}
          photos={selectedPhotosForEdit}
          onSave={(updatedPhotos) => {
            console.log('Metadata updated:', updatedPhotos);
            setMetadataEditorOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default ImageManager;