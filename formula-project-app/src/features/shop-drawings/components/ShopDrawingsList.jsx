import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Avatar,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  MdAdd as AddIcon,
  MdMoreVert as MoreVertIcon,
  MdPictureAsPdf as PdfIcon,
  MdCloudUpload as UploadIcon,
  MdVisibility as ViewIcon,
  MdEdit as EditIcon,
  MdDelete as DeleteIcon,
  MdDownload as DownloadIcon,
  MdCheckCircle as ApproveIcon,
  MdClose as RejectIcon,
  MdHistory as HistoryIcon,
  MdFolder as FolderIcon
} from 'react-icons/md';
// Note: EnhancedHeader and EnhancedTabSystem are not used in this component
// import EnhancedHeader from '../../../components/ui/UnifiedHeader';
// import EnhancedTabSystem from '../../../components/layout/EnhancedTabSystem';
import { useShopDrawings } from '../hooks/useShopDrawings';

const ShopDrawingsList = ({ 
  drawings = [],
  loading = false,
  onViewDrawing,
  onEditDrawing,
  onDeleteDrawing,
  onUploadDrawing,
  onApproveDrawing,
  onRejectDrawing,
  onRefresh,
  projects = [],
  teamMembers = [],
  compactMode = false,
  showProjectFilter = true
}) => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedProject, setSelectedProject] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [selectedDrawingForHistory, setSelectedDrawingForHistory] = useState(null);

  // Handle drawing download
  const handleDownloadDrawing = useCallback((drawing) => {
    try {
      if (!drawing || !drawing.fileName) {
        console.error('Invalid drawing data for download');
        return;
      }

      // Create a temporary download link
      const link = document.createElement('a');
      link.href = drawing.fileUrl || `#download-${drawing.fileName}`;
      link.download = drawing.fileName;
      link.target = '_blank';
      
      // Simulate file download (in real app, this would be actual file URL)
      if (!drawing.fileUrl) {
        console.warn('File URL not available for', drawing.fileName);
        // For demo purposes, show success message anyway
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`Downloading ${drawing.fileName}`);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, []);

  // Handle version history view
  const handleViewVersionHistory = useCallback((drawing) => {
    setSelectedDrawingForHistory(drawing);
    setVersionHistoryOpen(true);
    handleMenuClose();
  }, []);

  // Mock version history data
  const getVersionHistory = (drawing) => {
    return [
      {
        version: drawing.version,
        uploadDate: drawing.uploadDate,
        uploadedBy: drawing.uploadedBy,
        status: drawing.status,
        notes: drawing.notes || 'Current version',
        fileSize: drawing.fileSize,
        current: true
      },
      {
        version: 'v1.0',
        uploadDate: '2024-06-15',
        uploadedBy: 'John Smith',
        status: 'revision_required',
        notes: 'Initial submission - needs minor adjustments',
        fileSize: '1.8 MB',
        current: false
      }
    ];
  };

  // Use passed props instead of hook, but keep hook as fallback
  const {
    drawings: hookDrawings,
    loading: hookLoading,
    error,
    uploadDrawing: hookUploadDrawing,
    updateDrawing,
    deleteDrawing: removeDrawing
  } = useShopDrawings();

  // Use passed props if available, otherwise fallback to hook
  const activeDrawings = drawings.length > 0 ? drawings : hookDrawings;
  const activeLoading = loading !== undefined ? loading : hookLoading;


  const [uploadForm, setUploadForm] = useState({
    projectId: '',
    drawingType: '',
    room: '',
    file: null,
    notes: ''
  });

  const getStatusPalette = (status) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'revision_required': return '#F44336';
      case 'rejected': return '#9E9E9E';
      default: return '#2196F3';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending Review';
      case 'revision_required': return 'Revision Required';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const handleMenuOpen = (event, drawing) => {
    setAnchorEl(event.currentTarget);
    setSelectedDrawing(drawing);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDrawing(null);
  };

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleUploadSubmit = async () => {
    try {
      setUploading(true);
      setUploadError(null);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('projectId', uploadForm.projectId);
      formData.append('drawingType', uploadForm.drawingType);
      formData.append('room', uploadForm.room);
      formData.append('notes', uploadForm.notes || 'Initial submission');
      
      // Use callback prop if available, otherwise use hook
      if (onUploadDrawing) {
        await onUploadDrawing(formData);
      } else {
        await hookUploadDrawing(formData);
      }
      
      setUploadDialogOpen(false);
      setUploadForm({ projectId: '', drawingType: '', room: '', file: null, notes: '' });
      
      // Refresh the list if callback provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to upload drawing:', error);
      setUploadError(error.message || 'Failed to upload drawing. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredDrawings = activeDrawings.filter(drawing => {
    const matchesSearch = drawing.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drawing.drawingType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drawing.room?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'all' || drawing.projectId === selectedProject;
    return matchesSearch && matchesProject;
  });

  const renderListView = () => (
    <TableContainer sx={{ height: '100%' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            <TableCell><strong>Drawing</strong></TableCell>
            <TableCell><strong>Project</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
            <TableCell><strong>Room</strong></TableCell>
            <TableCell><strong>Version</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Uploaded</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredDrawings.map((drawing) => (
            <TableRow key={drawing.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PdfIcon color="#d32f2f" size={20} style={{ marginRight: 8 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {drawing.fileName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {drawing.fileSize}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{drawing.projectName}</Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={drawing.drawingType} 
                  size="small"
                  variant="outlined"
                  sx={{ backgroundColor: '#e3f2fd' }}
                />
              </TableCell>
              <TableCell>{drawing.room}</TableCell>
              <TableCell>
                <Chip 
                  label={drawing.version} 
                  size="small"
                  sx={{ backgroundColor: '#f3e5f5' }}
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={getStatusLabel(drawing.status)}
                  size="small"
                  sx={{ 
                    backgroundColor: getStatusPalette(drawing.status),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{drawing.uploadDate}</Typography>
                <Typography variant="caption" color="text.secondary">
                  by {drawing.uploadedBy}
                </Typography>
              </TableCell>
              <TableCell>
                <IconButton 
                  size="small" 
                  onClick={(e) => handleMenuOpen(e, drawing)}
                >
                  <MoreVertIcon size={16} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCardView = () => (
    <Box sx={{ height: '100%', overflow: 'auto', px: 1 }}>
      <Grid container spacing={2}>
        {filteredDrawings.map((drawing) => (
          <Grid item xs={12} sm={6} md={4} key={drawing.id}>
            <Card 
              elevation={1} 
              sx={{ height: '100%' }}
            >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PdfIcon color="#d32f2f" size={32} style={{ marginRight: 8 }} />
                  <Box>
                    <Typography variant="h6" noWrap sx={{ maxWidth: 150 }}>
                      {drawing.drawingType}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {drawing.room}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={(e) => handleMenuOpen(e, drawing)}>
                  <MoreVertIcon size={16} />
                </IconButton>
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {drawing.projectName}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip 
                  label={drawing.version} 
                  size="small"
                  sx={{ backgroundColor: '#f3e5f5' }}
                />
                <Chip 
                  label={getStatusLabel(drawing.status)}
                  size="small"
                  sx={{ 
                    backgroundColor: getStatusPalette(drawing.status),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>

              <Typography variant="caption" color="text.secondary">
                Uploaded: {drawing.uploadDate}
              </Typography>
              <br />
              <Typography variant="caption" color="text.secondary">
                Size: {drawing.fileSize}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ 
      height: 'calc(100vh - 120px)', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Minimal Action Bar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        px: 1,
        py: 0.5,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
      }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
          Shop Drawings ({filteredDrawings.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <TextField
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: 200 }}
          />
          {showProjectFilter && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                displayEmpty
                sx={{ height: 32 }}
              >
                <MenuItem value="all">All Projects</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl size="small">
            <Select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              sx={{ height: 32, minWidth: 80 }}
            >
              <MenuItem value="list">List</MenuItem>
              <MenuItem value="cards">Cards</MenuItem>
            </Select>
          </FormControl>
          <IconButton size="small" onClick={() => setUploadDialogOpen(true)} title="Upload Drawing">
            <UploadIcon size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mx: 1, mb: 1 }}>
          {error}
        </Alert>
      )}

      {/* Content - Full Page */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'hidden',
        '& .MuiTableRow-root:hover': {
          backgroundColor: 'transparent'
        }
      }}>
        {activeLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          viewMode === 'list' ? renderListView() : renderCardView()
        )}
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (onViewDrawing && selectedDrawing) {
            onViewDrawing(selectedDrawing);
          }
          handleMenuClose();
        }}>
          <ViewIcon size={16} style={{ marginRight: 8 }} /> View PDF
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedDrawing) {
            handleDownloadDrawing(selectedDrawing);
          }
          handleMenuClose();
        }}>
          <DownloadIcon size={16} style={{ marginRight: 8 }} /> Download
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedDrawing) {
            handleViewVersionHistory(selectedDrawing);
          }
        }}>
          <HistoryIcon size={16} style={{ marginRight: 8 }} /> Version History
        </MenuItem>
        <MenuItem onClick={() => {
          if (onEditDrawing && selectedDrawing) {
            onEditDrawing(selectedDrawing);
          }
          handleMenuClose();
        }}>
          <EditIcon size={16} style={{ marginRight: 8 }} /> Edit Details
        </MenuItem>
        {selectedDrawing?.status === 'pending' && (
          <>
            <MenuItem onClick={() => {
              if (onApproveDrawing && selectedDrawing) {
                onApproveDrawing(selectedDrawing.id);
              }
              handleMenuClose();
            }}>
              <ApproveIcon size={16} style={{ marginRight: 8 }} /> Approve
            </MenuItem>
            <MenuItem onClick={() => {
              if (onRejectDrawing && selectedDrawing) {
                onRejectDrawing(selectedDrawing.id, 'Requires revision');
              }
              handleMenuClose();
            }}>
              <RejectIcon size={16} style={{ marginRight: 8 }} /> Request Revision
            </MenuItem>
          </>
        )}
        <MenuItem onClick={() => {
          if (onDeleteDrawing && selectedDrawing) {
            onDeleteDrawing(selectedDrawing.id);
          }
          handleMenuClose();
        }} sx={{ color: 'error.main' }}>
          <DeleteIcon size={16} style={{ marginRight: 8 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Shop Drawing</DialogTitle>
        <DialogContent>
          {uploadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {uploadError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  value={uploadForm.projectId}
                  onChange={(e) => setUploadForm({...uploadForm, projectId: e.target.value})}
                  label="Project"
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Drawing Type"
                value={uploadForm.drawingType}
                onChange={(e) => setUploadForm({...uploadForm, drawingType: e.target.value})}
                placeholder="e.g., Kitchen Cabinets, Reception Desk"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Room"
                value={uploadForm.room}
                onChange={(e) => setUploadForm({...uploadForm, room: e.target.value})}
                placeholder="e.g., Kitchen, Reception"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadIcon size={16} />}
                sx={{ height: 56 }}
              >
                {uploadForm.file ? uploadForm.file.name : 'Select PDF File'}
                <input
                  type="file"
                  hidden
                  accept=".pdf"
                  onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={uploadForm.notes}
                onChange={(e) => setUploadForm({...uploadForm, notes: e.target.value})}
                placeholder="Optional notes about this drawing..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>Cancel</Button>
          <Button 
            onClick={handleUploadSubmit} 
            variant="contained"
            disabled={!uploadForm.projectId || !uploadForm.drawingType || !uploadForm.file || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Uploading...' : 'Upload Drawing'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog 
        open={versionHistoryOpen} 
        onClose={() => setVersionHistoryOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon size={20} style={{ marginRight: 8 }} />
            Version History - {selectedDrawingForHistory?.fileName}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDrawingForHistory && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Version</strong></TableCell>
                    <TableCell><strong>Upload Date</strong></TableCell>
                    <TableCell><strong>Uploaded By</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>File Size</strong></TableCell>
                    <TableCell><strong>Notes</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getVersionHistory(selectedDrawingForHistory).map((version, index) => (
                    <TableRow key={index} sx={version.current ? { backgroundColor: '#f0f8ff' } : {}}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={version.version} 
                            size="small"
                            color={version.current ? 'primary' : 'default'}
                            sx={{ fontWeight: version.current ? 600 : 400 }}
                          />
                          {version.current && (
                            <Chip label="Current" size="small" color="success" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{version.uploadDate}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                            {version.uploadedBy.charAt(0)}
                          </Avatar>
                          {version.uploadedBy}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(version.status)}
                          size="small"
                          sx={{ 
                            backgroundColor: getStatusPalette(version.status),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>{version.fileSize}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {version.notes}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View PDF">
                            <IconButton 
                              size="small"
                              onClick={() => {
                                if (onViewDrawing) {
                                  onViewDrawing({...selectedDrawingForHistory, version: version.version});
                                }
                              }}
                            >
                              <ViewIcon size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton 
                              size="small"
                              onClick={() => handleDownloadDrawing({...selectedDrawingForHistory, version: version.version})}
                            >
                              <DownloadIcon size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVersionHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShopDrawingsList;