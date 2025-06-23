import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  TextField,
  Typography,
  Box,
  Grid,
  Paper,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import {
  FaFileExport,
  FaTimes,
  FaFilePdf,
  FaImage,
  FaCog
} from 'react-icons/fa';

const ExportOptionsModal = ({ open, onClose, onExport, reportTitle }) => {
  const [options, setOptions] = useState({
    // PDF Settings
    pageSize: 'A4',
    orientation: 'portrait',
    imageQuality: 'high',
    margins: 'normal',
    
    // Content Options
    includeProjectInfo: true,
    includeMetadata: true,
    includeImages: true,
    includeEmptyLines: false,
    
    // Image Options
    maxImageWidth: 100,
    imageFormat: 'JPEG',
    compressImages: true,
    
    // File Options
    filename: '',
    openAfterExport: true
  });

  React.useEffect(() => {
    if (reportTitle && !options.filename) {
      const safeFilename = reportTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const timestamp = new Date().toISOString().split('T')[0];
      setOptions(prev => ({
        ...prev,
        filename: `${safeFilename}-${timestamp}`
      }));
    }
  }, [reportTitle, options.filename]);

  const handleChange = (field, value) => {
    setOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = () => {
    onExport(options);
    onClose();
  };

  const getEstimatedFileSize = () => {
    let baseSize = 50; // Base PDF size in KB
    if (options.includeImages) {
      baseSize += options.imageQuality === 'high' ? 500 : 200; // Estimate per image
    }
    return `~${baseSize}KB`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FaFileExport color="#1976d2" />
            <Typography variant="h6">Export Report as PDF</Typography>
          </Box>
          <Button onClick={onClose} color="inherit">
            <FaTimes />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* PDF Settings */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaFilePdf color="#d32f2f" />
                PDF Settings
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Page Size</InputLabel>
                    <Select
                      value={options.pageSize}
                      onChange={(e) => handleChange('pageSize', e.target.value)}
                      label="Page Size"
                    >
                      <MenuItem value="A3">A3 (297 × 420 mm)</MenuItem>
                      <MenuItem value="A4">A4 (210 × 297 mm)</MenuItem>
                      <MenuItem value="Letter">Letter (8.5 × 11 in)</MenuItem>
                      <MenuItem value="Legal">Legal (8.5 × 14 in)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Orientation</InputLabel>
                    <Select
                      value={options.orientation}
                      onChange={(e) => handleChange('orientation', e.target.value)}
                      label="Orientation"
                    >
                      <MenuItem value="portrait">Portrait</MenuItem>
                      <MenuItem value="landscape">Landscape</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Margins</InputLabel>
                    <Select
                      value={options.margins}
                      onChange={(e) => handleChange('margins', e.target.value)}
                      label="Margins"
                    >
                      <MenuItem value="narrow">Narrow (10mm)</MenuItem>
                      <MenuItem value="normal">Normal (20mm)</MenuItem>
                      <MenuItem value="wide">Wide (30mm)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Content Options */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaCog color="#1976d2" />
                Content Options
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={options.includeProjectInfo}
                      onChange={(e) => handleChange('includeProjectInfo', e.target.checked)}
                    />
                  }
                  label="Include Project Information"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={options.includeMetadata}
                      onChange={(e) => handleChange('includeMetadata', e.target.checked)}
                    />
                  }
                  label="Include Report Metadata"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={options.includeImages}
                      onChange={(e) => handleChange('includeImages', e.target.checked)}
                    />
                  }
                  label="Include Images"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={options.includeEmptyLines}
                      onChange={(e) => handleChange('includeEmptyLines', e.target.checked)}
                    />
                  }
                  label="Include Empty Lines"
                />
              </Box>
            </Paper>
          </Grid>

          {/* Image Options */}
          {options.includeImages && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaImage color="#4caf50" />
                  Image Options
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Image Quality</InputLabel>
                      <Select
                        value={options.imageQuality}
                        onChange={(e) => handleChange('imageQuality', e.target.value)}
                        label="Image Quality"
                      >
                        <MenuItem value="low">Low (Faster)</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High (Best Quality)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Max Image Width (mm)"
                      type="number"
                      value={options.maxImageWidth}
                      onChange={(e) => handleChange('maxImageWidth', parseInt(e.target.value))}
                      inputProps={{ min: 50, max: 200 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.compressImages}
                          onChange={(e) => handleChange('compressImages', e.target.checked)}
                        />
                      }
                      label="Compress Images"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* File Options */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                File Options
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Filename"
                    value={options.filename}
                    onChange={(e) => handleChange('filename', e.target.value)}
                    helperText="Extension .pdf will be added automatically"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={options.openAfterExport}
                        onChange={(e) => handleChange('openAfterExport', e.target.checked)}
                      />
                    }
                    label="Open after export"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Export Preview */}
          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Export Preview:</strong><br />
                Format: PDF ({options.pageSize}, {options.orientation})<br />
                Estimated Size: {getEstimatedFileSize()}<br />
                Content: {[
                  options.includeProjectInfo && 'Project Info',
                  options.includeMetadata && 'Metadata',
                  options.includeImages && 'Images',
                  'Report Lines'
                ].filter(Boolean).join(', ')}
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleExport}
          startIcon={<FaFileExport />}
          disabled={!options.filename.trim()}
        >
          Export PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportOptionsModal;