import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Upload as UploadIcon,
  GetApp as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as PendingIcon,
  Assignment as DocumentIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUpload as CloudUploadIcon,
  Folder as FolderIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DocIcon
} from '@mui/icons-material';

const ComplianceDocumentation = ({ 
  project,
  onUpdateCompliance 
}) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Mock compliance data - this will come from API later
  const [complianceData, setComplianceData] = useState({
    permits: [
      {
        id: 'PERMIT001',
        name: 'Building Permit',
        type: 'permit',
        status: 'approved',
        issueDate: '2025-05-15',
        expiryDate: '2026-05-15',
        issuingAuthority: 'City Building Department',
        permitNumber: 'BP-2025-0542',
        fileName: 'building_permit_BP-2025-0542.pdf',
        fileSize: '1.2 MB',
        notes: 'Approved for millwork installation phase'
      },
      {
        id: 'PERMIT002',
        name: 'Fire Safety Compliance',
        type: 'permit',
        status: 'pending',
        submitDate: '2025-06-10',
        expectedDate: '2025-06-25',
        issuingAuthority: 'Fire Department',
        applicationNumber: 'FS-2025-0123',
        fileName: 'fire_safety_application.pdf',
        fileSize: '850 KB',
        notes: 'Pending review for kitchen area modifications'
      }
    ],
    inspections: [
      {
        id: 'INSP001',
        name: 'Framing Inspection',
        type: 'inspection',
        status: 'completed',
        scheduledDate: '2025-05-20',
        completedDate: '2025-05-20',
        inspector: 'John Mitchell',
        result: 'passed',
        fileName: 'framing_inspection_report.pdf',
        fileSize: '654 KB',
        notes: 'All framing meets code requirements'
      },
      {
        id: 'INSP002',
        name: 'Final Inspection',
        type: 'inspection',
        status: 'scheduled',
        scheduledDate: '2025-07-15',
        inspector: 'Sarah Johnson',
        notes: 'Scheduled for millwork completion'
      }
    ],
    certificates: [
      {
        id: 'CERT001',
        name: 'Fire Retardant Certificate',
        type: 'certificate',
        status: 'valid',
        issueDate: '2025-04-10',
        expiryDate: '2026-04-10',
        issuer: 'Material Testing Lab',
        certificateNumber: 'FR-2025-789',
        fileName: 'fire_retardant_cert.pdf',
        fileSize: '425 KB',
        notes: 'Certificate for all wood materials used'
      }
    ],
    followUps: [
      {
        id: 'FU001',
        title: 'Submit updated kitchen layout plans',
        dueDate: '2025-06-20',
        status: 'pending',
        priority: 'high',
        assignedTo: 'Mike Johnson',
        relatedDocument: 'PERMIT002',
        notes: 'Fire department requested updated layout showing emergency exits'
      },
      {
        id: 'FU002',
        title: 'Schedule electrical inspection',
        dueDate: '2025-06-30',
        status: 'pending',
        priority: 'medium',
        assignedTo: 'Lisa Chen',
        notes: 'Coordinate with electrical contractor for inspection'
      }
    ]
  });

  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'permit',
    issuingAuthority: '',
    permitNumber: '',
    notes: ''
  });

  const [newFollowUp, setNewFollowUp] = useState({
    title: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: '',
    notes: ''
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'valid':
      case 'passed':
        return <CheckIcon sx={{ color: '#4CAF50' }} />;
      case 'pending':
      case 'scheduled':
        return <PendingIcon sx={{ color: '#FF9800' }} />;
      case 'rejected':
      case 'failed':
      case 'expired':
        return <WarningIcon sx={{ color: '#F44336' }} />;
      default:
        return <DocumentIcon sx={{ color: '#2196F3' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'valid':
      case 'passed':
        return '#4CAF50';
      case 'pending':
      case 'scheduled':
        return '#FF9800';
      case 'rejected':
      case 'failed':
      case 'expired':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return <PdfIcon sx={{ color: '#d32f2f' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <ImageIcon sx={{ color: '#2196f3' }} />;
      default:
        return <DocIcon sx={{ color: '#4caf50' }} />;
    }
  };

  const handleUploadDocument = () => {
    if (!uploadFile || !newDocument.name) return;

    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      const document = {
        id: `DOC${Date.now()}`,
        ...newDocument,
        fileName: uploadFile.name,
        fileSize: `${(uploadFile.size / 1024).toFixed(0)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      const newData = { ...complianceData };
      if (newDocument.type === 'permit') {
        newData.permits = [document, ...newData.permits];
      } else if (newDocument.type === 'inspection') {
        newData.inspections = [document, ...newData.inspections];
      } else if (newDocument.type === 'certificate') {
        newData.certificates = [document, ...newData.certificates];
      }

      setComplianceData(newData);
      setUploadDialogOpen(false);
      setUploading(false);
      setUploadFile(null);
      setNewDocument({
        name: '', type: 'permit', issuingAuthority: '',
        permitNumber: '', notes: ''
      });
    }, 2000);
  };

  const handleAddFollowUp = () => {
    const followUp = {
      id: `FU${Date.now()}`,
      ...newFollowUp,
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setComplianceData({
      ...complianceData,
      followUps: [followUp, ...complianceData.followUps]
    });
    
    setFollowUpDialogOpen(false);
    setNewFollowUp({
      title: '', dueDate: '', priority: 'medium',
      assignedTo: '', notes: ''
    });
  };

  const renderDocumentSection = (title, documents, type) => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FolderIcon />
          <Typography variant="h6">{title}</Typography>
          <Chip 
            label={documents.length} 
            size="small" 
            color={documents.length > 0 ? 'primary' : 'default'}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {documents.length > 0 ? (
          <List dense>
            {documents.map((doc) => (
              <ListItem key={doc.id} divider>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  {getStatusIcon(doc.status)}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  {getFileIcon(doc.fileName)}
                </Box>
                <ListItemText
                  primary={doc.name}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {doc.issuingAuthority || doc.inspector || doc.issuer}
                        {doc.permitNumber && ` • ${doc.permitNumber}`}
                        {doc.certificateNumber && ` • ${doc.certificateNumber}`}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {doc.issueDate && `Issued: ${doc.issueDate}`}
                        {doc.scheduledDate && `Scheduled: ${doc.scheduledDate}`}
                        {doc.expiryDate && ` • Expires: ${doc.expiryDate}`}
                      </Typography>
                      <Chip 
                        label={doc.status}
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusColor(doc.status),
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20,
                          mt: 0.5
                        }}
                      />
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" size="small">
                    <ViewIcon />
                  </IconButton>
                  <IconButton edge="end" size="small">
                    <DownloadIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary" gutterBottom>
              No {title.toLowerCase()} uploaded
            </Typography>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => {
                setSelectedCategory(type);
                setUploadDialogOpen(true);
              }}
              size="small"
            >
              Upload {title}
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );

  const renderFollowUps = () => (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Follow-up Items</Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setFollowUpDialogOpen(true)}
          >
            Add Follow-up
          </Button>
        </Box>

        {complianceData.followUps.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complianceData.followUps.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography variant="body2">{item.title}</Typography>
                      {item.notes && (
                        <Typography variant="caption" color="text.secondary">
                          {item.notes}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.dueDate}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.priority}
                        size="small"
                        color={item.priority === 'high' ? 'error' : item.priority === 'medium' ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.assignedTo}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status}
                        size="small"
                        sx={{ backgroundColor: getStatusColor(item.status), color: 'white' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">
            No follow-up items. Add tasks to track compliance requirements.
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Compliance Documentation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage permits, inspections, certificates, and follow-up items for {project?.name}
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setUploadDialogOpen(true)}
          sx={{ mr: 2 }}
        >
          Upload Document
        </Button>
        <Button
          variant="outlined"
          onClick={() => setFollowUpDialogOpen(true)}
        >
          Add Follow-up
        </Button>
      </Box>

      {/* Documents Sections */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {renderDocumentSection('Permits', complianceData.permits, 'permit')}
          {renderDocumentSection('Inspections', complianceData.inspections, 'inspection')}
          {renderDocumentSection('Certificates', complianceData.certificates, 'certificate')}
        </Grid>

        <Grid item xs={12} md={4}>
          {renderFollowUps()}

          {/* Compliance Summary */}
          <Card elevation={2} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Compliance Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Permits: {complianceData.permits.filter(p => p.status === 'approved').length} / {complianceData.permits.length} Approved
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(complianceData.permits.filter(p => p.status === 'approved').length / Math.max(complianceData.permits.length, 1)) * 100}
                  sx={{ mb: 1 }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Inspections: {complianceData.inspections.filter(i => i.status === 'completed').length} / {complianceData.inspections.length} Complete
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(complianceData.inspections.filter(i => i.status === 'completed').length / Math.max(complianceData.inspections.length, 1)) * 100}
                  sx={{ mb: 1 }}
                />
              </Box>
              <Typography variant="body2">
                Follow-ups: {complianceData.followUps.filter(f => f.status === 'pending').length} Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Compliance Document</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Document Name"
                value={newDocument.name}
                onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={newDocument.type}
                  onChange={(e) => setNewDocument({...newDocument, type: e.target.value})}
                  label="Document Type"
                >
                  <MenuItem value="permit">Permit</MenuItem>
                  <MenuItem value="inspection">Inspection</MenuItem>
                  <MenuItem value="certificate">Certificate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Issuing Authority"
                value={newDocument.issuingAuthority}
                onChange={(e) => setNewDocument({...newDocument, issuingAuthority: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Permit/Certificate Number"
                value={newDocument.permitNumber}
                onChange={(e) => setNewDocument({...newDocument, permitNumber: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ height: 56 }}
              >
                {uploadFile ? uploadFile.name : 'Select File'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={newDocument.notes}
                onChange={(e) => setNewDocument({...newDocument, notes: e.target.value})}
              />
            </Grid>
          </Grid>
          {uploading && <LinearProgress sx={{ mt: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUploadDocument} 
            variant="contained"
            disabled={!newDocument.name || !uploadFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Follow-up Dialog */}
      <Dialog open={followUpDialogOpen} onClose={() => setFollowUpDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Follow-up Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={newFollowUp.title}
                onChange={(e) => setNewFollowUp({...newFollowUp, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={newFollowUp.dueDate}
                onChange={(e) => setNewFollowUp({...newFollowUp, dueDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newFollowUp.priority}
                  onChange={(e) => setNewFollowUp({...newFollowUp, priority: e.target.value})}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assigned To"
                value={newFollowUp.assignedTo}
                onChange={(e) => setNewFollowUp({...newFollowUp, assignedTo: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={newFollowUp.notes}
                onChange={(e) => setNewFollowUp({...newFollowUp, notes: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFollowUpDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddFollowUp} 
            variant="contained"
            disabled={!newFollowUp.title || !newFollowUp.dueDate}
          >
            Add Follow-up
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComplianceDocumentation;