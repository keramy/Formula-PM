import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  NavArrowLeft as BackIcon,
  Eye as ViewIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Trash as DeleteIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  HistoryCircle as HistoryIcon,
  Share as ShareIcon
} from 'iconoir-react';
import PDFViewer from './PDFViewer';
import DrawingVersionHistory from './DrawingVersionHistory';
import UnifiedHeader from '../../../components/ui/UnifiedHeader';

const ShopDrawingDetailPage = ({ 
  drawing, 
  onBack, 
  onUpdate, 
  onDelete,
  teamMembers = []
}) => {
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!drawing) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Drawing not found
        </Typography>
        <Button onClick={onBack} startIcon={<BackIcon />} sx={{ mt: 2 }}>
          Back to Shop Drawings
        </Button>
      </Box>
    );
  }

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

  const handleStatusChange = (newStatus) => {
    const updatedDrawing = {
      ...drawing,
      status: newStatus,
      approvedBy: newStatus === 'approved' ? 'Current User' : null,
      approvalDate: newStatus === 'approved' ? new Date().toISOString().split('T')[0] : null
    };
    
    if (onUpdate) {
      onUpdate(drawing.id, updatedDrawing);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(drawing.id);
    }
    setDeleteDialogOpen(false);
    if (onBack) {
      onBack();
    }
  };

  return (
    <Box>
      {/* Header */}
      <UnifiedHeader
        title={drawing.fileName}
        breadcrumbs={[
          { label: 'Shop Drawings', href: '/shop-drawings' },
          { label: drawing.drawingType }
        ]}
        onBack={onBack}
        teamMembers={teamMembers.slice(0, 3)}
        subtitle={`${drawing.projectName} • ${drawing.room}`}
      />

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* PDF Viewer Card */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Drawing Preview
                </Typography>
                <Box>
                  <Tooltip title="View Full Screen">
                    <IconButton onClick={() => setShowPDFViewer(true)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download PDF">
                    <IconButton>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              {/* Embedded PDF Preview */}
              <Box sx={{ height: 400, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <PDFViewer 
                  pdfUrl={drawing.pdfUrl} 
                  fileName={drawing.fileName}
                  height="400px"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Version History */}
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Version History
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowVersionHistory(true)}
                  startIcon={<HistoryIcon />}
                >
                  View Full History
                </Button>
              </Box>
              
              <DrawingVersionHistory 
                drawing={drawing}
                onAddRevision={(revision) => {
                  // Handle adding new revision
                  const updatedDrawing = {
                    ...drawing,
                    version: revision.version,
                    revisions: [...(drawing.revisions || []), revision]
                  };
                  if (onUpdate) {
                    onUpdate(drawing.id, updatedDrawing);
                  }
                }}
                onUpdateStatus={(version, status) => {
                  // Handle status update for specific version
                  const updatedRevisions = drawing.revisions?.map(rev => 
                    rev.version === version 
                      ? { ...rev, status, approvalDate: new Date().toISOString().split('T')[0] }
                      : rev
                  ) || [];
                  
                  const updatedDrawing = {
                    ...drawing,
                    revisions: updatedRevisions,
                    // Update main drawing status if it's the current version
                    ...(drawing.version === version ? { status } : {})
                  };
                  
                  if (onUpdate) {
                    onUpdate(drawing.id, updatedDrawing);
                  }
                }}
                teamMembers={teamMembers}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Drawing Info */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Drawing Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={getStatusLabel(drawing.status)}
                  sx={{ 
                    backgroundColor: getStatusColor(drawing.status),
                    color: 'white',
                    fontWeight: 600,
                    mt: 0.5
                  }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Project
                </Typography>
                <Typography variant="body1">
                  {drawing.projectName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Drawing Type
                </Typography>
                <Typography variant="body1">
                  {drawing.drawingType}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Room/Location
                </Typography>
                <Typography variant="body1">
                  {drawing.room}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Current Version
                </Typography>
                <Typography variant="body1">
                  {drawing.version}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  File Size
                </Typography>
                <Typography variant="body1">
                  {drawing.fileSize}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Uploaded By
                </Typography>
                <Typography variant="body1">
                  {drawing.uploadedBy}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Upload Date
                </Typography>
                <Typography variant="body1">
                  {drawing.uploadDate}
                </Typography>
              </Box>

              {drawing.approvedBy && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Approved By
                  </Typography>
                  <Typography variant="body1">
                    {drawing.approvedBy}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    on {drawing.approvalDate}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              
              {drawing.status === 'pending' && (
                <Box sx={{ mb: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<ApproveIcon />}
                    onClick={() => handleStatusChange('approved')}
                    sx={{ mb: 1 }}
                  >
                    Approve Drawing
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="warning"
                    startIcon={<RejectIcon />}
                    onClick={() => handleStatusChange('revision_required')}
                  >
                    Request Revision
                  </Button>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ mb: 1 }}
              >
                Edit Details
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<ShareIcon />}
                sx={{ mb: 1 }}
              >
                Share Drawing
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Drawing
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Full Screen PDF Viewer */}
      <Dialog 
        open={showPDFViewer} 
        onClose={() => setShowPDFViewer(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: { width: '95vw', height: '95vh' }
        }}
      >
        <PDFViewer 
          pdfUrl={drawing.pdfUrl}
          fileName={drawing.fileName}
          onClose={() => setShowPDFViewer(false)}
          width="100%"
          height="100%"
        />
      </Dialog>

      {/* Version History Dialog */}
      <Dialog 
        open={showVersionHistory} 
        onClose={() => setShowVersionHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Complete Version History</DialogTitle>
        <DialogContent>
          <DrawingVersionHistory 
            drawing={drawing}
            onAddRevision={(revision) => {
              // Handle adding new revision
              const updatedDrawing = {
                ...drawing,
                version: revision.version,
                revisions: [...(drawing.revisions || []), revision]
              };
              if (onUpdate) {
                onUpdate(drawing.id, updatedDrawing);
              }
            }}
            onUpdateStatus={(version, status) => {
              // Handle status update for specific version
              const updatedRevisions = drawing.revisions?.map(rev => 
                rev.version === version 
                  ? { ...rev, status, approvalDate: new Date().toISOString().split('T')[0] }
                  : rev
              ) || [];
              
              const updatedDrawing = {
                ...drawing,
                revisions: updatedRevisions,
                // Update main drawing status if it's the current version
                ...(drawing.version === version ? { status } : {})
              };
              
              if (onUpdate) {
                onUpdate(drawing.id, updatedDrawing);
              }
            }}
            teamMembers={teamMembers}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVersionHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Drawing</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{drawing.fileName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShopDrawingDetailPage;