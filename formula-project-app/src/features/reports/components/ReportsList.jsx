import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Tooltip,
  InputAdornment,
  Stack
} from '@mui/material';
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaEllipsisV,
  FaSearch,
  FaFilter,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  // FaMagic removed
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import reportService from '../services/reportService';
// Removed AutoReportGenerator import as per feedback
import { useAuth } from '../../../context/AuthContext';
import activityService from '../../../services/activityService';

const ReportsList = ({ projectId, onEditReport, onCreateReport }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  // Removed autoGeneratorOpen state as per feedback
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [reportTitle, setReportTitle] = useState('');

  useEffect(() => {
    loadReports();
  }, [projectId]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const projectReports = await reportService.getReportsByProject(projectId);
      setReports(Array.isArray(projectReports) ? projectReports : []);
    } catch (error) {
      console.error('Error loading reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const getProjectData = async (projectId) => {
    try {
      // Fetch real project data from API
      const response = await fetch(`http://localhost:5014/api/projects/${projectId}`);
      if (response.ok) {
        const projectData = await response.json();
        return {
          name: projectData.name || `Project ${projectId}`,
          client: projectData.client,
          location: projectData.location || projectData.address,
          manager: projectData.projectManager || projectData.manager,
          type: projectData.type || projectData.category
        };
      } else {
        console.warn(`Project ${projectId} not found in API, using fallback`);
        return { name: `Project ${projectId}` };
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
      // Fallback for API errors
      return { name: `Project ${projectId}` };
    }
  };

  const handleCreateReport = async () => {
    if (!reportTitle || !selectedTemplate) return;

    try {
      // Get project data for report numbering
      const projectData = await getProjectData(projectId);
      
      const newReport = await reportService.createReport({
        projectId,
        title: reportTitle,
        templateId: selectedTemplate,
        createdBy: user.name
      }, projectData);
      
      // Log activity for report creation
      await activityService.logReportCreated({
        reportId: newReport.id,
        reportTitle: newReport.title,
        reportNumber: newReport.metadata?.reportNumber,
        projectId: projectId,
        projectName: projectData.name,
        userName: user.name
      });
      
      setReports([...reports, newReport]);
      setCreateDialogOpen(false);
      setReportTitle('');
      setSelectedTemplate('');
      
      // Navigate to the editor for the new report
      if (onEditReport) {
        onEditReport(newReport.id);
      }
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const handleDeleteReport = async () => {
    if (!selectedReport) return;

    try {
      await reportService.deleteReport(selectedReport.id);
      setReports(reports.filter(r => r.id !== selectedReport.id));
      setDeleteDialogOpen(false);
      setSelectedReport(null);
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  // Removed handleAutoGenerateReport function as per feedback

  const handleMenuOpen = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusPalette = (status) => {
    switch (status) {
      case 'draft': return 'default';
      case 'submitted': return 'primary';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return <FaClock size={14} />;
      case 'submitted': return <FaFileAlt size={14} />;
      case 'approved': return <FaCheckCircle size={14} />;
      case 'rejected': return <FaExclamationTriangle size={14} />;
      default: return null;
    }
  };

  const filteredReports = useMemo(() => {
    if (!Array.isArray(reports)) return [];
    let filtered = [...reports];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(report => report.type === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          const dateA = new Date(a.createdAt || Date.now());
          const dateB = new Date(b.createdAt || Date.now());
          return dateB - dateA;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [reports, searchTerm, filterType, sortBy]);

  const templates = reportService.getReportTemplates();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Project Reports
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<FaPlus />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ textTransform: 'none' }}
          >
            Create Report
          </Button>
        </Stack>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search reports..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch size={16} />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, maxWidth: 300 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="progress">Progress Report</MenuItem>
              <MenuItem value="quality">Quality Report</MenuItem>
              <MenuItem value="issue">Issue Report</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Reports Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report Number</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">Loading reports...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">No reports found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {report.reportNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{report.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={report.type}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(report.status)}
                      label={report.status}
                      size="small"
                      color={getStatusPalette(report.status)}
                    />
                  </TableCell>
                  <TableCell>{report.createdBy}</TableCell>
                  <TableCell>
                    <Tooltip title={new Date(report.createdAt || Date.now()).toLocaleString()}>
                      <Typography variant="body2" color="textSecondary">
                        {formatDistanceToNow(new Date(report.createdAt || Date.now()), { addSuffix: true })}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="View Report">
                        <IconButton size="small" color="primary">
                          <FaEye />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Report">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => onEditReport && onEditReport(report.id)}
                        >
                          <FaEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download PDF">
                        <IconButton size="small" color="primary">
                          <FaDownload />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, report)}
                      >
                        <FaEllipsisV />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          // Handle duplicate
        }}>
          Duplicate Report
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          setDeleteDialogOpen(true);
        }}>
          Delete Report
        </MenuItem>
      </Menu>

      {/* Create Report Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Report</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Report Title"
              fullWidth
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="e.g., Weekly Progress Report - Week 12"
            />
            
            <FormControl fullWidth>
              <InputLabel>Select Template</InputLabel>
              <Select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                label="Select Template"
              >
                {templates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    <Box>
                      <Typography variant="body2">{template.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {template.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Alert severity="info">
              The report will be created with the selected template structure. You can customize it after creation.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateReport}
            disabled={!reportTitle || !selectedTemplate}
          >
            Create Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Report</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedReport?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteReport}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Auto Report Generator Dialog removed as per feedback */}
    </Box>
  );
};

export default ReportsList;