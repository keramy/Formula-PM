import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  MdCheckCircle as CheckCircleIcon,
  MdWarning as WarningIcon,
  MdClose as ErrorIcon,
  MdCalendarToday as CalendarIcon,
  MdCheck as CheckIcon,
  MdCloudUpload as UploadIcon,
  MdDescription as FileIcon,
  MdMoreVert as MoreVertIcon,
  MdKeyboardArrowDown as ExpandMoreIcon,
  MdSecurity as ComplianceIcon,
  MdSecurity as CertificationIcon,
  MdEco as SustainabilityIcon
} from 'react-icons/md';

const ComplianceTracking = ({ 
  specifications = [],
  onUpdateCompliance,
  onGenerateReport
}) => {
  const [complianceData, setComplianceData] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock compliance data
  useEffect(() => {
    const mockCompliance = specifications.map(spec => ({
      specId: spec.id,
      itemId: spec.itemId,
      description: spec.description,
      category: spec.category,
      complianceStatus: Math.random() > 0.3 ? 'compliant' : Math.random() > 0.5 ? 'pending' : 'non_compliant',
      certifications: [
        { type: 'Fire Safety', status: 'approved', date: '2024-02-15', expiryDate: '2025-02-15' },
        { type: 'Environmental', status: 'pending', date: null, expiryDate: null },
        { type: 'Quality Standard', status: 'approved', date: '2024-01-20', expiryDate: '2024-12-31' }
      ],
      requirements: [
        { name: 'Fire Resistance Rating', required: true, status: 'met', value: 'Class A', standard: 'ASTM E84' },
        { name: 'VOC Emissions', required: true, status: 'pending', value: null, standard: 'GREENGUARD Gold' },
        { name: 'Formaldehyde Compliance', required: true, status: 'met', value: 'CARB Phase 2', standard: 'CARB' },
        { name: 'Sustainability Rating', required: false, status: 'not_required', value: 'FSC Certified', standard: 'FSC' }
      ],
      documents: [
        { name: 'Fire Test Report', type: 'certification', uploadDate: '2024-02-15', status: 'approved' },
        { name: 'Material Safety Data Sheet', type: 'safety', uploadDate: '2024-01-10', status: 'approved' },
        { name: 'Environmental Impact Assessment', type: 'environmental', uploadDate: null, status: 'missing' }
      ],
      approvals: [
        { stage: 'Technical Review', status: 'approved', date: '2024-03-01', reviewer: 'John Smith' },
        { stage: 'Compliance Review', status: 'pending', date: null, reviewer: 'Sarah Wilson' },
        { stage: 'Final Approval', status: 'pending', date: null, reviewer: 'Mike Johnson' }
      ],
      riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      lastUpdated: '2024-03-15'
    }));
    setComplianceData(mockCompliance);
  }, [specifications]);

  const getStatusPalette = (status) => {
    switch (status) {
      case 'compliant':
      case 'approved':
      case 'met':
        return 'success';
      case 'pending':
        return 'warning';
      case 'non_compliant':
      case 'rejected':
      case 'missing':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
      case 'approved':
      case 'met':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <CalendarIcon color="warning" />;
      case 'non_compliant':
      case 'rejected':
      case 'missing':
        return <ErrorIcon color="error" />;
      default:
        return <WarningIcon />;
    }
  };

  const getRiskPalette = (risk) => {
    switch (risk) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const filteredCompliance = complianceData.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.complianceStatus === filterStatus;
    const matchesType = filterType === 'all' || item.category === filterType;
    return matchesStatus && matchesType;
  });

  const getComplianceStats = () => {
    const total = complianceData.length;
    const compliant = complianceData.filter(item => item.complianceStatus === 'compliant').length;
    const pending = complianceData.filter(item => item.complianceStatus === 'pending').length;
    const nonCompliant = complianceData.filter(item => item.complianceStatus === 'non_compliant').length;
    
    return { total, compliant, pending, nonCompliant };
  };

  const stats = getComplianceStats();

  const handleViewDetails = (item) => {
    setSelectedSpec(item);
    setDetailDialogOpen(true);
  };

  const handleUploadCertification = (specId, certificationType) => {
    // Mock file upload
    console.log('Upload certification for:', specId, certificationType);
  };

  const getApprovalProgress = (approvals) => {
    const completed = approvals.filter(a => a.status === 'approved').length;
    return (completed / approvals.length) * 100;
  };

  return (
    <Box>
      {/* Header Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight={600}>
                {stats.compliant}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compliant
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight={600}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main" fontWeight={600}>
                {stats.nonCompliant}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Non-Compliant
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" fontWeight={600}>
                {Math.round((stats.compliant / stats.total) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compliance Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="compliant">Compliant</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="non_compliant">Non-Compliant</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Filter by Category"
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="Kitchen Cabinets">Kitchen Cabinets</MenuItem>
            <MenuItem value="Hardware">Hardware</MenuItem>
            <MenuItem value="Metal">Metal</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<CheckIcon />}
          onClick={() => onGenerateReport && onGenerateReport('compliance')}
        >
          Generate Report
        </Button>
      </Box>

      {/* Compliance Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell><strong>Item ID</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Risk Level</strong></TableCell>
              <TableCell><strong>Certifications</strong></TableCell>
              <TableCell><strong>Approval Progress</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCompliance.map((item) => (
              <TableRow key={item.specId} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {item.itemId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{item.description}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.category}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(item.complianceStatus)}
                    <Chip
                      label={item.complianceStatus.replace('_', ' ')}
                      size="small"
                      color={getStatusPalette(item.complianceStatus)}
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.riskLevel}
                    size="small"
                    color={getRiskPalette(item.riskLevel)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {item.certifications.slice(0, 2).map((cert, index) => (
                      <Chip
                        key={index}
                        label={cert.type}
                        size="small"
                        color={getStatusPalette(cert.status)}
                        variant="outlined"
                      />
                    ))}
                    {item.certifications.length > 2 && (
                      <Chip
                        label={`+${item.certifications.length - 2}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ width: '100%', maxWidth: 120 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getApprovalProgress(item.approvals)}
                      color={getApprovalProgress(item.approvals) === 100 ? 'success' : 'primary'}
                      sx={{ mb: 0.5 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(getApprovalProgress(item.approvals))}% Complete
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleViewDetails(item)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Compliance Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Compliance Details - {selectedSpec?.itemId}
            </Typography>
            <Chip
              label={selectedSpec?.complianceStatus?.replace('_', ' ')}
              color={getStatusPalette(selectedSpec?.complianceStatus)}
              variant="outlined"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedSpec && (
            <Box>
              {/* Requirements Section */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ComplianceIcon />
                    <Typography variant="h6">Compliance Requirements</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedSpec.requirements.map((req, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getStatusIcon(req.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={req.name}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Standard: {req.standard}
                              </Typography>
                              {req.value && (
                                <Typography variant="body2">
                                  Value: {req.value}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Chip
                          label={req.status.replace('_', ' ')}
                          size="small"
                          color={getStatusPalette(req.status)}
                          variant="outlined"
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              {/* Certifications Section */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CertificationIcon />
                    <Typography variant="h6">Certifications</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {selectedSpec.certifications.map((cert, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="subtitle1">
                                {cert.type}
                              </Typography>
                              <Chip
                                label={cert.status}
                                size="small"
                                color={getStatusPalette(cert.status)}
                              />
                            </Box>
                            {cert.date && (
                              <Typography variant="body2" color="text.secondary">
                                Approved: {cert.date}
                              </Typography>
                            )}
                            {cert.expiryDate && (
                              <Typography variant="body2" color="text.secondary">
                                Expires: {cert.expiryDate}
                              </Typography>
                            )}
                            <Button
                              size="small"
                              startIcon={<UploadIcon />}
                              sx={{ mt: 1 }}
                              onClick={() => handleUploadCertification(selectedSpec.specId, cert.type)}
                            >
                              Upload Certificate
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Approval Workflow */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon />
                    <Typography variant="h6">Approval Workflow</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Stepper orientation="vertical">
                    {selectedSpec.approvals.map((approval, index) => (
                      <Step key={index} active={approval.status === 'pending'} completed={approval.status === 'approved'}>
                        <StepLabel
                          error={approval.status === 'rejected'}
                          icon={getStatusIcon(approval.status)}
                        >
                          <Typography variant="subtitle1">
                            {approval.stage}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Reviewer: {approval.reviewer}
                          </Typography>
                        </StepLabel>
                        <StepContent>
                          {approval.date && (
                            <Typography variant="body2" color="text.secondary">
                              {approval.status === 'approved' ? 'Approved' : 'Updated'} on: {approval.date}
                            </Typography>
                          )}
                          {approval.status === 'pending' && (
                            <Button size="small" variant="outlined" sx={{ mt: 1 }}>
                              Request Update
                            </Button>
                          )}
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => console.log('Update compliance')}>
            Update Compliance
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComplianceTracking;