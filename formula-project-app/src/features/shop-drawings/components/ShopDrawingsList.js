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
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  PictureAsPdf as PdfIcon,
  Upload as UploadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  GetApp as DownloadIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  History as HistoryIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import EnhancedHeader from '../../../components/ui/UnifiedHeader';
import EnhancedTabSystem from '../../../components/layout/EnhancedTabSystem';
import { useShopDrawings } from '../hooks/useShopDrawings';

const ShopDrawingsList = ({ 
  projects = [],
  teamMembers = []
}) => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedProject, setSelectedProject] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Use the shop drawings hook
  const {
    drawings: shopDrawings,
    loading,
    error,
    uploadDrawing,
    updateDrawing,
    deleteDrawing: removeDrawing
  } = useShopDrawings();


  const [uploadForm, setUploadForm] = useState({
    projectId: '',
    drawingType: '',
    room: '',
    file: null,
    notes: ''
  });

  const getStatusColor = (status) => {
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

  const handleUploadSubmit = async () => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('projectId', uploadForm.projectId);
      formData.append('drawingType', uploadForm.drawingType);
      formData.append('room', uploadForm.room);
      formData.append('notes', uploadForm.notes || 'Initial submission');
      
      // Use the hook to upload the drawing
      await uploadDrawing(formData);
      
      setUploadDialogOpen(false);
      setUploadForm({ projectId: '', drawingType: '', room: '', file: null, notes: '' });
    } catch (error) {
      console.error('Failed to upload drawing:', error);
      // Handle error - could show a notification here
    }
  };

  const filteredDrawings = shopDrawings.filter(drawing => {
    const matchesSearch = drawing.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drawing.drawingType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drawing.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'all' || drawing.projectId === selectedProject;
    return matchesSearch && matchesProject;
  });

  const renderListView = () => (
    <TableContainer component={Paper} elevation={1}>
      <Table>
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
            <TableRow key={drawing.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PdfIcon sx={{ color: '#d32f2f', mr: 1 }} />
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
                    backgroundColor: getStatusColor(drawing.status),
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
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCardView = () => (
    <Grid container spacing={3}>
      {filteredDrawings.map((drawing) => (
        <Grid item xs={12} sm={6} md={4} key={drawing.id}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PdfIcon sx={{ color: '#d32f2f', mr: 1, fontSize: 32 }} />
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
                  <MoreVertIcon />
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
                    backgroundColor: getStatusColor(drawing.status),
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
  );

  return (
    <Box>
      {/* Header */}
      <EnhancedHeader
        title="Shop Drawings"
        breadcrumbs={[
          { label: 'Shop Drawings', href: '/shop-drawings' }
        ]}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={() => setUploadDialogOpen(true)}
        addButtonText="Upload Drawing"
        addButtonIcon={<UploadIcon />}
        teamMembers={teamMembers.slice(0, 5)}
        subtitle={`${filteredDrawings.length} drawings`}
      />

      {/* Project Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Project</InputLabel>
          <Select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            label="Filter by Project"
          >
            <MenuItem value="all">All Projects</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Enhanced Tab System */}
      <EnhancedTabSystem
        currentView={viewMode}
        onViewChange={setViewMode}
        title="Shop Drawings"
        views={[
          { id: 'list', label: 'List View', icon: 'list' },
          { id: 'cards', label: 'Card View', icon: 'grid' }
        ]}
      />

      {/* Content */}
      <Box sx={{ mt: 3 }}>
        {loading ? (
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
        <MenuItem onClick={handleMenuClose}>
          <ViewIcon sx={{ mr: 1 }} /> View PDF
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1 }} /> Download
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <HistoryIcon sx={{ mr: 1 }} /> Version History
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1 }} /> Edit Details
        </MenuItem>
        {selectedDrawing?.status === 'pending' && (
          <>
            <MenuItem onClick={handleMenuClose}>
              <ApproveIcon sx={{ mr: 1 }} /> Approve
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <RejectIcon sx={{ mr: 1 }} /> Request Revision
            </MenuItem>
          </>
        )}
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Shop Drawing</DialogTitle>
        <DialogContent>
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
                startIcon={<UploadIcon />}
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
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUploadSubmit} 
            variant="contained"
            disabled={!uploadForm.projectId || !uploadForm.drawingType || !uploadForm.file}
          >
            Upload Drawing
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShopDrawingsList;