import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Alert,
  Tooltip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';
import {
  FaSave,
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaEllipsisV,
  FaChevronDown,
  FaCloudSun,
  FaClock,
  FaHardHat,
  FaFileExport,
  FaEye,
  FaImage,
  FaPencilAlt,
  FaGripVertical
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import reportService from '../services/reportService';
import LineEditor from './LineEditor';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '../../../context/NavigationContext';

const ReportEditor = ({ reportId, projectId, onBack }) => {
  const { user } = useAuth();
  const { navigateToProject } = useNavigation();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [errors, setErrors] = useState({});

  // Construction metadata
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState('');
  const [workingHours, setWorkingHours] = useState({ start: '', end: '' });
  const [projectPhase, setProjectPhase] = useState('');

  useEffect(() => {
    if (reportId) {
      loadReport();
    } else {
      createNewReport();
    }
  }, [reportId]);

  const loadReport = () => {
    setLoading(true);
    try {
      const loadedReport = reportService.getReportById(reportId);
      if (loadedReport) {
        setReport(loadedReport);
        setWeather(loadedReport.metadata?.weather || '');
        setTemperature(loadedReport.metadata?.temperature || '');
        setWorkingHours(loadedReport.metadata?.workingHours || { start: '', end: '' });
        setProjectPhase(loadedReport.metadata?.projectPhase || '');
        
        // Expand all sections by default
        const expanded = {};
        loadedReport.sections.forEach(section => {
          expanded[section.id] = true;
        });
        setExpandedSections(expanded);
      }
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewReport = () => {
    const newReport = reportService.createReport({
      projectId,
      title: 'New Report',
      createdBy: user.name
    });
    setReport(newReport);
    setExpandedSections({ [newReport.sections[0].id]: true });
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update metadata
      const updatedReport = {
        ...report,
        metadata: {
          ...report.metadata,
          weather,
          temperature,
          workingHours,
          projectPhase
        }
      };
      
      reportService.updateReport(report.id, updatedReport);
      setReport(updatedReport);
      
      // Show success message
      setTimeout(() => setSaving(false), 1000);
    } catch (error) {
      console.error('Error saving report:', error);
      setSaving(false);
    }
  };

  const handleAddSection = () => {
    const newSection = reportService.addSection(report.id, {
      title: 'New Section'
    });
    
    const updatedReport = reportService.getReportById(report.id);
    setReport(updatedReport);
    setExpandedSections({ ...expandedSections, [newSection.id]: true });
  };

  const handleDeleteSection = (sectionId) => {
    reportService.deleteSection(report.id, sectionId);
    const updatedReport = reportService.getReportById(report.id);
    setReport(updatedReport);
    
    const newExpanded = { ...expandedSections };
    delete newExpanded[sectionId];
    setExpandedSections(newExpanded);
  };

  const handleSectionTitleChange = (sectionId, newTitle) => {
    reportService.updateSection(report.id, sectionId, { title: newTitle });
    const updatedReport = reportService.getReportById(report.id);
    setReport(updatedReport);
  };

  const handleAddLine = (sectionId) => {
    reportService.addLine(report.id, sectionId, {
      description: ''
    });
    const updatedReport = reportService.getReportById(report.id);
    setReport(updatedReport);
  };

  const handleUpdateLine = (sectionId, lineId, lineData) => {
    reportService.updateLine(report.id, sectionId, lineId, lineData);
    const updatedReport = reportService.getReportById(report.id);
    setReport(updatedReport);
  };

  const handleDeleteLine = (sectionId, lineId) => {
    reportService.deleteLine(report.id, sectionId, lineId);
    const updatedReport = reportService.getReportById(report.id);
    setReport(updatedReport);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // Reorder sections
    if (result.type === 'section') {
      const newSections = Array.from(report.sections);
      const [reorderedItem] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, reorderedItem);
      
      setReport({ ...report, sections: newSections });
    }
  };

  const handleMenuOpen = (event, section) => {
    setAnchorEl(event.currentTarget);
    setSelectedSection(section);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSection(null);
  };

  const toggleSectionExpanded = (sectionId) => {
    setExpandedSections({
      ...expandedSections,
      [sectionId]: !expandedSections[sectionId]
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={onBack}>
              <FaArrowLeft />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {report?.reportNumber}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Created by {report?.createdBy} on {new Date(report?.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<FaEye />}
              sx={{ textTransform: 'none' }}
            >
              Preview
            </Button>
            <Button
              variant="outlined"
              startIcon={<FaFileExport />}
              sx={{ textTransform: 'none' }}
            >
              Export PDF
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <FaSave />}
              onClick={handleSave}
              disabled={saving}
              sx={{ textTransform: 'none' }}
            >
              {saving ? 'Saving...' : 'Save Report'}
            </Button>
          </Stack>
        </Box>

        {/* Report Title */}
        <TextField
          fullWidth
          label="Report Title"
          value={report?.title || ''}
          onChange={(e) => setReport({ ...report, title: e.target.value })}
          variant="outlined"
          sx={{ mb: 3 }}
        />

        {/* Construction Metadata */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Weather</InputLabel>
              <Select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                label="Weather"
              >
                <MenuItem value="sunny">☀️ Sunny</MenuItem>
                <MenuItem value="cloudy">☁️ Cloudy</MenuItem>
                <MenuItem value="rainy">🌧️ Rainy</MenuItem>
                <MenuItem value="stormy">⛈️ Stormy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Temperature"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="e.g., 25°C"
              InputProps={{
                startAdornment: <FaCloudSun style={{ marginRight: 8 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Working Hours"
              value={`${workingHours.start} - ${workingHours.end}`}
              onChange={(e) => {
                const [start, end] = e.target.value.split(' - ');
                setWorkingHours({ start: start || '', end: end || '' });
              }}
              placeholder="8:00 AM - 5:00 PM"
              InputProps={{
                startAdornment: <FaClock style={{ marginRight: 8 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Project Phase</InputLabel>
              <Select
                value={projectPhase}
                onChange={(e) => setProjectPhase(e.target.value)}
                label="Project Phase"
              >
                <MenuItem value="foundation">Foundation</MenuItem>
                <MenuItem value="structure">Structure</MenuItem>
                <MenuItem value="mep">MEP Installation</MenuItem>
                <MenuItem value="finishing">Finishing</MenuItem>
                <MenuItem value="handover">Handover</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Report Period */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Reporting Period
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={report?.period?.startDate || ''}
              onChange={(e) => setReport({
                ...report,
                period: { ...report.period, startDate: e.target.value }
              })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={report?.period?.endDate || ''}
              onChange={(e) => setReport({
                ...report,
                period: { ...report.period, endDate: e.target.value }
              })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Sections */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections" type="section">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {report?.sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <Accordion
                        expanded={expandedSections[section.id] || false}
                        onChange={() => toggleSectionExpanded(section.id)}
                        sx={{
                          mb: 2,
                          boxShadow: snapshot.isDragging ? 3 : 1,
                          bgcolor: snapshot.isDragging ? 'grey.50' : 'background.paper'
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<FaChevronDown />}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Box {...provided.dragHandleProps} sx={{ mr: 2 }}>
                              <FaGripVertical color="#999" />
                            </Box>
                            <TextField
                              value={section.title}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSectionTitleChange(section.id, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              variant="standard"
                              sx={{ flexGrow: 1, mr: 2 }}
                            />
                            <Chip
                              label={`${section.lines.length} items`}
                              size="small"
                              sx={{ mr: 2 }}
                            />
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuOpen(e, section);
                              }}
                            >
                              <FaEllipsisV />
                            </IconButton>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box>
                            {section.lines.map((line, lineIndex) => (
                              <LineEditor
                                key={line.id}
                                line={line}
                                lineNumber={lineIndex + 1}
                                reportId={report.id}
                                sectionId={section.id}
                                onUpdate={(lineData) => handleUpdateLine(section.id, line.id, lineData)}
                                onDelete={() => handleDeleteLine(section.id, line.id)}
                              />
                            ))}
                            <Button
                              startIcon={<FaPlus />}
                              onClick={() => handleAddLine(section.id)}
                              sx={{ mt: 2, textTransform: 'none' }}
                            >
                              Add Line
                            </Button>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Section Button */}
      <Button
        variant="outlined"
        startIcon={<FaPlus />}
        onClick={handleAddSection}
        fullWidth
        sx={{ mt: 2, py: 2, textTransform: 'none' }}
      >
        Add New Section
      </Button>

      {/* Section Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          // Handle duplicate section
        }}>
          Duplicate Section
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          if (selectedSection) {
            handleDeleteSection(selectedSection.id);
          }
        }}>
          Delete Section
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ReportEditor;