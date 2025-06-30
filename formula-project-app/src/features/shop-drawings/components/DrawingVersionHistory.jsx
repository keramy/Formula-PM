import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Stack
} from '@mui/material';
import {
  MdCheckCircle as ApprovedIcon,
  MdSchedule as PendingIcon,
  MdClose as RejectedIcon,
  MdEdit as RevisionIcon,
  MdVisibility as ViewIcon,
  MdDownload as DownloadIcon,
  MdAdd as AddIcon,
  MdCloudUpload as UploadIcon
} from 'react-icons/md';

const DrawingVersionHistory = ({ 
  drawing,
  onAddRevision,
  onUpdateStatus,
  teamMembers = [] 
}) => {
  const [addRevisionOpen, setAddRevisionOpen] = useState(false);
  const [newRevision, setNewRevision] = useState({
    file: null,
    notes: '',
    reviewers: []
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <ApprovedIcon sx={{ color: '#4CAF50' }} />;
      case 'pending':
        return <PendingIcon sx={{ color: '#FF9800' }} />;
      case 'revision_required':
        return <RevisionIcon sx={{ color: '#F44336' }} />;
      case 'rejected':
        return <RejectedIcon sx={{ color: '#9E9E9E' }} />;
      default:
        return <PendingIcon sx={{ color: '#2196F3' }} />;
    }
  };

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

  const generateNextVersion = () => {
    if (!drawing?.revisions) return 'Rev A';
    
    const versions = drawing.revisions.map(r => r.version);
    const letters = versions
      .filter(v => v.startsWith('Rev '))
      .map(v => v.replace('Rev ', ''))
      .sort();
    
    if (letters.length === 0) return 'Rev A';
    
    const lastLetter = letters[letters.length - 1];
    const nextLetter = String.fromCharCode(lastLetter.charCodeAt(0) + 1);
    return `Rev ${nextLetter}`;
  };

  const handleAddRevision = () => {
    const revision = {
      version: generateNextVersion(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: newRevision.notes,
      uploadedBy: 'Current User', // Replace with actual user
      file: newRevision.file
    };

    if (onAddRevision) {
      onAddRevision(revision);
    }

    setAddRevisionOpen(false);
    setNewRevision({ file: null, notes: '', reviewers: [] });
  };

  if (!drawing?.revisions) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Version History
        </Typography>
        <Typography color="text.secondary">
          No version history available for this drawing.
        </Typography>
      </Paper>
    );
  }

  const sortedRevisions = [...drawing.revisions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Version History - {drawing.fileName}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddRevisionOpen(true)}
          sx={{ backgroundColor: '#37444B' }}
        >
          New Revision
        </Button>
      </Box>

      <Stack spacing={2}>
        {sortedRevisions.map((revision, index) => (
          <Box key={revision.version} sx={{ display: 'flex', gap: 2 }}>
            {/* Status Icon */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minWidth: '40px'
            }}>
              <Box sx={{ 
                backgroundColor: getStatusPalette(revision.status), 
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                {getStatusIcon(revision.status)}
              </Box>
              {index < sortedRevisions.length - 1 && (
                <Box sx={{ 
                  width: '2px', 
                  height: '30px', 
                  backgroundColor: '#E0E0E0', 
                  mt: 1 
                }} />
              )}
            </Box>
            
            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Card elevation={1} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {revision.version}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {revision.date} • by {revision.uploadedBy}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={getStatusLabel(revision.status)}
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusPalette(revision.status),
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                      <Tooltip title="View PDF">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton size="small">
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {revision.notes && (
                    <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "{revision.notes}"
                    </Typography>
                  )}

                  {revision.approvedBy && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {revision.approvedBy[0]}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        Approved by {revision.approvedBy} on {revision.approvalDate || revision.date}
                      </Typography>
                    </Box>
                  )}

                  {revision.status === 'pending' && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        startIcon={<ApprovedIcon />}
                        onClick={() => onUpdateStatus && onUpdateStatus(revision.version, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<RevisionIcon />}
                        onClick={() => onUpdateStatus && onUpdateStatus(revision.version, 'revision_required')}
                      >
                        Request Revision
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<RejectedIcon />}
                        onClick={() => onUpdateStatus && onUpdateStatus(revision.version, 'rejected')}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        ))}
      </Stack>

      {/* Add Revision Dialog */}
      <Dialog open={addRevisionOpen} onClose={() => setAddRevisionOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Revision</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Next Version: {generateNextVersion()}
            </Typography>
            
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<UploadIcon />}
              sx={{ mb: 3, height: 56 }}
            >
              {newRevision.file ? newRevision.file.name : 'Select PDF File'}
              <input
                type="file"
                hidden
                accept=".pdf"
                onChange={(e) => setNewRevision({...newRevision, file: e.target.files[0]})}
              />
            </Button>

            <TextField
              fullWidth
              label="Revision Notes"
              multiline
              rows={4}
              value={newRevision.notes}
              onChange={(e) => setNewRevision({...newRevision, notes: e.target.value})}
              placeholder="Describe the changes made in this revision..."
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth>
              <InputLabel>Assign Reviewers</InputLabel>
              <Select
                multiple
                value={newRevision.reviewers}
                onChange={(e) => setNewRevision({...newRevision, reviewers: e.target.value})}
                label="Assign Reviewers"
              >
                {teamMembers.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddRevisionOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddRevision} 
            variant="contained"
            disabled={!newRevision.file}
            sx={{ backgroundColor: '#37444B' }}
          >
            Upload Revision
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DrawingVersionHistory;