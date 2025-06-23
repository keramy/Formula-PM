/**
 * Auto Report Generator - User interface for wizard-style report creation
 * SiteCam-inspired automation for Formula PM
 * Phase 2: Smart Automation Agent
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
  Chip,
  Paper,
  Alert,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  FaRocket,
  FaImages,
  FaFilter,
  FaEye,
  FaDownload,
  FaMagic,
  FaCog,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaExpandMore,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTags,
  FaChartLine
} from 'react-icons/fa';

import autoReportService from '../services/autoReportService';
import photoService from '../services/photoService';
import PhotoSequenceViewer from './PhotoSequenceViewer';

const AutoReportGenerator = ({ 
  projectId, 
  onReportGenerated,
  onClose,
  preSelectedPhotos = [],
  initialFilters = {}
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allPhotos, setAllPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState(preSelectedPhotos);
  const [filters, setFilters] = useState(initialFilters);
  const [generationOptions, setGenerationOptions] = useState({
    templateType: 'auto',
    includeSequences: true,
    includeMetadata: true,
    exportFormat: 'pdf'
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [error, setError] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const steps = [
    'Select Photos',
    'Apply Filters',
    'Configure Report',
    'Preview & Generate'
  ];

  // Load photos on component mount
  useEffect(() => {
    loadProjectPhotos();
  }, [projectId]);

  // Update filtered photos when filters change
  useEffect(() => {
    applyFilters();
  }, [allPhotos, filters]);

  const loadProjectPhotos = async () => {
    try {
      setLoading(true);
      const photos = await photoService.getPhotosByProject(projectId);
      setAllPhotos(photos);
      if (preSelectedPhotos.length === 0) {
        setSelectedPhotos(photos); // Select all by default
      }
      setError(null);
    } catch (err) {
      setError('Failed to load project photos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!allPhotos.length) return;

    let filtered = [...allPhotos];

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(p => p.capturedAt >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(p => p.capturedAt <= filters.dateTo);
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }

    // Location filter
    if (filters.locations && filters.locations.length > 0) {
      filtered = filtered.filter(p => {
        const location = formatLocation(p.location);
        return filters.locations.some(loc => location.toLowerCase().includes(loc.toLowerCase()));
      });
    }

    // Work category filter
    if (filters.workCategories && filters.workCategories.length > 0) {
      filtered = filtered.filter(p => 
        filters.workCategories.includes(p.project?.workCategory)
      );
    }

    // Tag filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(p => 
        filters.tags.some(tag => p.tags?.includes(tag))
      );
    }

    setFilteredPhotos(filtered);
    
    // Update selected photos if they're no longer in filtered set
    if (selectedPhotos.length > 0) {
      const filteredIds = new Set(filtered.map(p => p.id));
      const stillSelected = selectedPhotos.filter(p => filteredIds.has(p.id));
      setSelectedPhotos(stillSelected);
    }
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await autoReportService.generateFromPhotos(
        projectId,
        selectedPhotos,
        {
          templateType: generationOptions.templateType,
          filters: filters,
          includeSequences: generationOptions.includeSequences,
          includeMetadata: generationOptions.includeMetadata
        }
      );

      if (result.success) {
        setGeneratedReport(result.report);
        setAnalysisResult(result.generationInfo.analysisResult);
        
        if (onReportGenerated) {
          onReportGenerated(result.report);
        }
        
        handleNext(); // Move to final step
      }
    } catch (err) {
      setError('Failed to generate report: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatLocation = (location) => {
    if (!location) return 'Unknown Location';
    const parts = [];
    if (location.building) parts.push(location.building);
    if (location.floor) parts.push(location.floor);
    if (location.room) parts.push(location.room);
    if (location.area) parts.push(location.area);
    return parts.length > 0 ? parts.join(' - ') : 'Unknown Location';
  };

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const categories = [...new Set(allPhotos.map(p => p.category))];
    const locations = [...new Set(allPhotos.map(p => formatLocation(p.location)))];
    const workCategories = [...new Set(allPhotos.map(p => p.project?.workCategory).filter(Boolean))];
    const tags = [...new Set(allPhotos.flatMap(p => p.tags || []))];

    return { categories, locations, workCategories, tags };
  }, [allPhotos]);

  const renderPhotoSelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Photos for Report Generation
      </Typography>
      
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading project photos...
          </Typography>
        </Box>
      ) : (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>{allPhotos.length}</strong> photos available in this project. 
            Select photos or apply filters to narrow down the selection.
          </Alert>

          <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => setSelectedPhotos([...allPhotos])}
              size="small"
            >
              Select All ({allPhotos.length})
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSelectedPhotos([])}
              size="small"
            >
              Clear Selection
            </Button>
            <Typography variant="body2" color="text.secondary">
              {selectedPhotos.length} photos selected
            </Typography>
          </Box>

          {/* Photo Grid */}
          <Grid container spacing={2} sx={{ maxHeight: 400, overflow: 'auto' }}>
            {allPhotos.map(photo => (
              <Grid item xs={6} sm={4} md={3} key={photo.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: selectedPhotos.find(p => p.id === photo.id) ? 2 : 0,
                    borderColor: 'primary.main'
                  }}
                  onClick={() => {
                    const isSelected = selectedPhotos.find(p => p.id === photo.id);
                    if (isSelected) {
                      setSelectedPhotos(prev => prev.filter(p => p.id !== photo.id));
                    } else {
                      setSelectedPhotos(prev => [...prev, photo]);
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={photo.thumbnail || photo.url}
                      alt={photo.caption}
                      style={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover'
                      }}
                    />
                    {selectedPhotos.find(p => p.id === photo.id) && (
                      <Chip
                        label={<FaCheckCircle />}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'primary.main',
                          color: 'white'
                        }}
                      />
                    )}
                  </Box>
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="caption" display="block" noWrap>
                      {new Date(photo.capturedAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {photo.caption || 'Untitled'}
                    </Typography>
                    <Chip 
                      label={photo.category} 
                      size="small" 
                      sx={{ mt: 0.5 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );

  const renderFilters = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Apply Filters to Refine Photo Selection
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Filters help you focus on specific aspects of your project. 
        Filtered photos: <strong>{filteredPhotos.length}</strong> of {allPhotos.length}
      </Alert>

      <Grid container spacing={3}>
        {/* Date Range */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<FaExpandMore />}>
              <FaCalendarAlt style={{ marginRight: 8 }} />
              <Typography>Date Range</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="From Date"
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="To Date"
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Categories */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<FaExpandMore />}>
              <FaTags style={{ marginRight: 8 }} />
              <Typography>Photo Categories</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth size="small">
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={filters.categories || []}
                  onChange={(e) => setFilters(prev => ({ ...prev, categories: e.target.value }))}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {filterOptions.categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Locations */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<FaExpandMore />}>
              <FaMapMarkerAlt style={{ marginRight: 8 }} />
              <Typography>Locations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth size="small">
                <InputLabel>Locations</InputLabel>
                <Select
                  multiple
                  value={filters.locations || []}
                  onChange={(e) => setFilters(prev => ({ ...prev, locations: e.target.value }))}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {filterOptions.locations.map(location => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Work Categories */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<FaExpandMore />}>
              <FaChartLine style={{ marginRight: 8 }} />
              <Typography>Work Categories</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth size="small">
                <InputLabel>Work Categories</InputLabel>
                <Select
                  multiple
                  value={filters.workCategories || []}
                  onChange={(e) => setFilters(prev => ({ ...prev, workCategories: e.target.value }))}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {filterOptions.workCategories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setFilters({});
            setSelectedPhotos([...filteredPhotos]);
          }}
        >
          Clear Filters
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => setSelectedPhotos([...filteredPhotos])}
          disabled={filteredPhotos.length === 0}
        >
          Select Filtered Photos ({filteredPhotos.length})
        </Button>
      </Box>
    </Box>
  );

  const renderConfiguration = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configure Report Generation Options
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        These settings control how your report will be generated and what content will be included.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Template Type</InputLabel>
            <Select
              value={generationOptions.templateType}
              onChange={(e) => setGenerationOptions(prev => ({ 
                ...prev, 
                templateType: e.target.value 
              }))}
            >
              <MenuItem value="auto">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FaMagic style={{ marginRight: 8 }} />
                  Auto-Select (Recommended)
                </Box>
              </MenuItem>
              <MenuItem value="smart-progress">Progress Report</MenuItem>
              <MenuItem value="smart-quality">Quality Control Report</MenuItem>
              <MenuItem value="smart-issue">Issue Report</MenuItem>
              <MenuItem value="smart-safety">Safety Report</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Export Format</InputLabel>
            <Select
              value={generationOptions.exportFormat}
              onChange={(e) => setGenerationOptions(prev => ({ 
                ...prev, 
                exportFormat: e.target.value 
              }))}
            >
              <MenuItem value="pdf">PDF Document</MenuItem>
              <MenuItem value="html">HTML Report</MenuItem>
              <MenuItem value="docx">Word Document</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Content Options
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={generationOptions.includeSequences}
                onChange={(e) => setGenerationOptions(prev => ({ 
                  ...prev, 
                  includeSequences: e.target.checked 
                }))}
              />
            }
            label="Include Photo Sequences (Before/After progressions)"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={generationOptions.includeMetadata}
                onChange={(e) => setGenerationOptions(prev => ({ 
                  ...prev, 
                  includeMetadata: e.target.checked 
                }))}
              />
            }
            label="Include Photo Metadata (GPS, timestamps, etc.)"
          />
        </Grid>
      </Grid>

      {/* Preview Selection Summary */}
      <Paper sx={{ p: 2, mt: 3, bgcolor: 'background.default' }}>
        <Typography variant="subtitle2" gutterBottom>
          Selection Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {selectedPhotos.length}
              </Typography>
              <Typography variant="caption">Photos Selected</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {[...new Set(selectedPhotos.map(p => formatLocation(p.location)))].length}
              </Typography>
              <Typography variant="caption">Locations</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {[...new Set(selectedPhotos.map(p => p.category))].length}
              </Typography>
              <Typography variant="caption">Categories</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {selectedPhotos.length > 0 ? 
                  Math.ceil((new Date(Math.max(...selectedPhotos.map(p => new Date(p.capturedAt)))) - 
                           new Date(Math.min(...selectedPhotos.map(p => new Date(p.capturedAt))))) / 
                           (1000 * 60 * 60 * 24)) : 0}
              </Typography>
              <Typography variant="caption">Days Span</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  const renderPreviewAndGenerate = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Preview & Generate Report
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Generating Your Report...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analyzing photos and creating intelligent report structure
          </Typography>
          <LinearProgress sx={{ mt: 2, maxWidth: 300, mx: 'auto' }} />
        </Box>
      ) : generatedReport ? (
        <Box>
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="h6">
              Report Generated Successfully!
            </Typography>
            <Typography variant="body2">
              Your report "{generatedReport.title}" has been created with {generatedReport.sections?.length || 0} sections.
            </Typography>
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Report Details
                </Typography>
                <Typography><strong>Title:</strong> {generatedReport.title}</Typography>
                <Typography><strong>Type:</strong> {generatedReport.type}</Typography>
                <Typography><strong>Sections:</strong> {generatedReport.sections?.length || 0}</Typography>
                <Typography><strong>Report Number:</strong> {generatedReport.metadata?.reportNumber}</Typography>
                <Typography><strong>Generated:</strong> {new Date(generatedReport.createdAt).toLocaleString()}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Analysis Results
                </Typography>
                {analysisResult && (
                  <>
                    <Typography><strong>Confidence:</strong> {Math.round(analysisResult.confidence * 100)}%</Typography>
                    <Typography><strong>Photos Analyzed:</strong> {analysisResult.totalPhotos}</Typography>
                    <Typography><strong>Time Span:</strong> {analysisResult.timeSpan?.description}</Typography>
                    <Typography><strong>Locations:</strong> {Object.keys(analysisResult.locations || {}).length}</Typography>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<FaEye />}
              onClick={() => setPreviewMode(true)}
            >
              Preview Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<FaDownload />}
            >
              Download {generationOptions.exportFormat.toUpperCase()}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                if (onClose) onClose();
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
            <FaRocket size={48} color="#1976d2" />
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Ready to Generate Your Report
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Based on your selection of {selectedPhotos.length} photos, 
              we'll create an intelligent report with automated content generation.
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<FaMagic />}
              onClick={handleGenerateReport}
              disabled={selectedPhotos.length === 0}
              sx={{ px: 4, py: 1.5 }}
            >
              Generate Report
            </Button>
          </Paper>

          {selectedPhotos.length === 0 && (
            <Alert severity="warning">
              Please select at least one photo to generate a report.
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Auto Report Generator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create intelligent reports automatically from your project photos
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stepper */}
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>Select Photos</StepLabel>
          <StepContent>
            {renderPhotoSelection()}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={selectedPhotos.length === 0 || loading}
              >
                Continue ({selectedPhotos.length} photos selected)
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Apply Filters</StepLabel>
          <StepContent>
            {renderFilters()}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Continue
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Configure Report</StepLabel>
          <StepContent>
            {renderConfiguration()}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Continue
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Preview & Generate</StepLabel>
          <StepContent>
            {renderPreviewAndGenerate()}
            {!generatedReport && !loading && (
              <Box sx={{ mt: 2 }}>
                <Button onClick={handleBack}>
                  Back
                </Button>
              </Box>
            )}
          </StepContent>
        </Step>
      </Stepper>

      {/* Preview Dialog */}
      <Dialog
        open={previewMode}
        onClose={() => setPreviewMode(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Report Preview - {generatedReport?.title}
        </DialogTitle>
        <DialogContent>
          {generatedReport && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Report Sections
              </Typography>
              {generatedReport.sections?.map((section, index) => (
                <Accordion key={section.id}>
                  <AccordionSummary expandIcon={<FaExpandMore />}>
                    <Typography>{section.title} ({section.lines?.length || 0} items)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {section.lines?.map(line => (
                      <Box key={line.id} sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          {line.description}
                        </Typography>
                        {line.images?.length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            {line.images.length} image(s) attached
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewMode(false)}>
            Close Preview
          </Button>
          <Button variant="contained" startIcon={<FaDownload />}>
            Download Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AutoReportGenerator;