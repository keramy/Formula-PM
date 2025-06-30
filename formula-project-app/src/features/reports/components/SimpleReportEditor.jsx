import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Alert,
  Stack,
  Divider,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  MdSave as FaSave,
  MdArrowBack as FaArrowLeft,
  MdArrowForward as FaArrowRight,
  MdAdd as FaPlus,
  MdMediaImage as FaImage,
  MdVisibility as FaEye,
  MdFileDownload as FaFileExport,
  MdCancel as FaTimes,
  MdCheck as FaCheck,
  MdCamera as FaCamera
} from 'react-icons/md';
import reportService from '../services/reportService';
import pdfExportService from '../services/pdfExportService';
import ImageManager from './ImageManager';
import ExportOptionsModal from './ExportOptionsModal';
import PublishOptionsModal from './PublishOptionsModal';
// Removed AutoReportGenerator import as per feedback
import { useAuth } from '../../../context/AuthContext';
import activityService from '../../../services/activityService';

const SimpleReportEditor = ({ reportId, projectId, onBack }) => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [allLines, setAllLines] = useState([]);
  const [reportTitle, setReportTitle] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  // Removed autoGeneratorOpen state as per feedback
  
  // Current line data
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    if (reportId) {
      loadReport();
    } else {
      createNewReport();
    }
    
    // Load project data
    if (projectId) {
      loadProjectData();
    }
  }, [reportId, projectId]);

  useEffect(() => {
    // Update current line data when switching lines
    if (allLines[currentLineIndex]) {
      const currentLine = allLines[currentLineIndex];
      setCurrentTitle(currentLine.title || '');
      setCurrentDescription(currentLine.description || '');
      setCurrentImages(currentLine.images || []);
    }
  }, [currentLineIndex, allLines]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const loadedReport = await reportService.getReport(reportId);
      if (loadedReport) {
        setReport(loadedReport);
        setReportTitle(loadedReport.title || '');
        
        // Flatten all lines from all sections
        const lines = [];
        (loadedReport.sections || []).forEach(section => {
          (section.lines || []).forEach(line => {
            lines.push({
              ...line,
              sectionTitle: section.title,
              sectionId: section.id
            });
          });
        });
        setAllLines(lines);
      }
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewReport = async () => {
    setLoading(true);
    try {
      const newReport = await reportService.createReport({
        projectId,
        title: 'New Report',
        createdBy: user.name
      });
      setReport(newReport);
      setReportTitle(newReport.title || '');
      
      // Start with first section and add initial lines
      const lines = [];
      if (newReport.sections && newReport.sections.length > 0) {
        const firstSection = newReport.sections[0];
        if (firstSection.lines && firstSection.lines.length > 0) {
          firstSection.lines.forEach(line => {
            lines.push({
              ...line,
              sectionTitle: firstSection.title,
              sectionId: firstSection.id
            });
          });
        }
      }
      setAllLines(lines);
    } catch (error) {
      console.error('Error creating new report:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectData = async () => {
    try {
      // Load real project data from the API
      const response = await fetch(`http://localhost:5014/api/projects/${projectId}`);
      if (response.ok) {
        const realProjectData = await response.json();
        setProjectData({
          id: realProjectData.id,
          name: realProjectData.name || `Project ${projectId}`,
          client: realProjectData.client || 'Client Name',
          location: realProjectData.location || realProjectData.address || 'Project Location',
          startDate: realProjectData.startDate || realProjectData.createdAt || new Date().toISOString().split('T')[0],
          manager: realProjectData.projectManager || realProjectData.manager || 'Project Manager',
          type: realProjectData.type || realProjectData.category || 'Construction Project',
          description: realProjectData.description,
          status: realProjectData.status,
          budget: realProjectData.budget
        });
      } else {
        // Fallback to basic project data if API fails
        console.warn('Could not load project data from API, using fallback');
        const fallbackProjectData = {
          id: projectId,
          name: `Project ${projectId}`,
          client: 'Client Name',
          location: 'Project Location',
          startDate: new Date().toISOString().split('T')[0],
          manager: 'Project Manager',
          type: 'Construction Project'
        };
        setProjectData(fallbackProjectData);
      }
    } catch (error) {
      console.error('Error loading project data:', error);
      // Fallback project data for error cases
      const fallbackProjectData = {
        id: projectId,
        name: `Project ${projectId}`,
        client: 'Client Name',
        location: 'Project Location',
        startDate: new Date().toISOString().split('T')[0],
        manager: 'Project Manager',
        type: 'Construction Project'
      };
      setProjectData(fallbackProjectData);
    }
  };

  const saveCurrentLine = async () => {
    if (!report || currentLineIndex >= allLines.length) return;
    
    setSaving(true);
    try {
      const currentLine = allLines[currentLineIndex];
      await reportService.updateLine(
        report.id, 
        currentLine.sectionId, 
        currentLine.id, 
        {
          title: currentTitle,
          description: currentDescription,
          images: currentImages
        }
      );
      
      // Update local state
      const updatedLines = [...allLines];
      updatedLines[currentLineIndex] = {
        ...updatedLines[currentLineIndex],
        title: currentTitle,
        description: currentDescription,
        images: currentImages
      };
      setAllLines(updatedLines);
    } catch (error) {
      console.error('Error saving line:', error);
    } finally {
      setSaving(false);
    }
  };

  const addNewLine = async () => {
    if (!report) return;
    
    try {
      // Add to the first section for simplicity
      const firstSection = report.sections[0];
      await reportService.addLine(report.id, firstSection.id, {
        description: ''
      });
      
      // Reload to get updated structure
      const updatedReport = await reportService.getReport(report.id);
      setReport(updatedReport);
      
      // Update lines list
      const lines = [];
      (updatedReport.sections || []).forEach(section => {
        (section.lines || []).forEach(line => {
          lines.push({
            ...line,
            sectionTitle: section.title,
            sectionId: section.id
          });
        });
      });
      setAllLines(lines);
      
      // Move to the new line
      setCurrentLineIndex(lines.length - 1);
    } catch (error) {
      console.error('Error adding new line:', error);
    }
  };

  const goToNextLine = async () => {
    await saveCurrentLine();
    if (currentLineIndex < allLines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    }
  };

  const goToPreviousLine = async () => {
    await saveCurrentLine();
    if (currentLineIndex > 0) {
      setCurrentLineIndex(currentLineIndex - 1);
    }
  };

  const handleSaveAndNextLine = async () => {
    try {
      // Save current line first
      await saveCurrentLine();
      
      // Check if we're at the last line
      if (currentLineIndex === allLines.length - 1) {
        // Add a new line if we're at the end
        await addNewLine();
      } else {
        // Otherwise, go to next existing line
        setCurrentLineIndex(currentLineIndex + 1);
      }
    } catch (error) {
      console.error('Error in save and next line:', error);
    }
  };

  const handleImageUpload = async (imageFiles, captions) => {
    try {
      const uploadedImages = [];
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const caption = captions[i] || '';
        
        // Create image object with simulated upload (no reportService call)
        const uploadedImage = {
          id: `img-${Date.now()}-${Math.random()}`,
          url: URL.createObjectURL(file),
          caption: caption,
          file: file, // Keep file for PDF export
          metadata: {
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          }
        };
        uploadedImages.push(uploadedImage);
      }
      
      const newImages = [...currentImages, ...uploadedImages];
      setCurrentImages(newImages);
      setImageDialogOpen(false);
      
      // Immediately save the line with new images to prevent data loss
      setTimeout(async () => {
        if (!report || currentLineIndex >= allLines.length) return;
        
        try {
          const currentLine = allLines[currentLineIndex];
          await reportService.updateLine(
            report.id, 
            currentLine.sectionId, 
            currentLine.id, 
            {
              title: currentTitle,
              description: currentDescription,
              images: newImages // Use the updated images
            }
          );
          
          // Update local state
          const updatedLines = [...allLines];
          updatedLines[currentLineIndex] = {
            ...updatedLines[currentLineIndex],
            title: currentTitle,
            description: currentDescription,
            images: newImages
          };
          setAllLines(updatedLines);
        } catch (error) {
          console.error('Error auto-saving line after image upload:', error);
        }
      }, 100); // Small delay to ensure state is updated
      
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const removeImage = (imageId) => {
    setCurrentImages(currentImages.filter(img => img.id !== imageId));
  };

  const saveReport = async () => {
    setSaving(true);
    try {
      // Save current line first
      await saveCurrentLine();
      
      // Update report title
      await reportService.updateReport(report.id, {
        title: reportTitle
      });
      
      alert('Report saved successfully!');
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Error saving report');
    } finally {
      setSaving(false);
    }
  };

  const exportToPDF = async (exportOptions) => {
    setExporting(true);
    try {
      let reportForExport;
      
      if (previewMode) {
        // In preview mode: use preview data directly (includes current unsaved changes)
        const previewLines = [...allLines];
        if (currentLineIndex < previewLines.length) {
          previewLines[currentLineIndex] = {
            ...previewLines[currentLineIndex],
            title: currentTitle,
            description: currentDescription,
            images: currentImages
          };
        }
        
        // Create report structure using preview data
        reportForExport = {
          ...report,
          title: reportTitle,
          sections: report.sections.map(section => ({
            ...section,
            lines: previewLines.filter(line => line.sectionId === section.id)
          }))
        };
      } else {
        // In edit mode: save current line first, then get updated report
        await saveCurrentLine();
        const updatedReport = await reportService.getReport(report.id);
        reportForExport = {
          ...updatedReport,
          title: reportTitle
        };
      }
      
      // Configure PDF options based on user selection
      const pdfOptions = {
        projectData: exportOptions.includeProjectInfo ? projectData : null,
        pageSize: exportOptions.pageSize,
        orientation: exportOptions.orientation,
        imageQuality: exportOptions.imageQuality === 'high' ? 0.9 : 
                     exportOptions.imageQuality === 'medium' ? 0.7 : 0.5,
        includeImages: exportOptions.includeImages,
        includeMetadata: exportOptions.includeMetadata,
        maxImageWidth: exportOptions.maxImageWidth,
        margin: exportOptions.margins === 'narrow' ? 10 : 
                exportOptions.margins === 'wide' ? 30 : 20
      };
      
      // Generate PDF with options
      const pdf = await pdfExportService.generateReportPDF(reportForExport, pdfOptions);
      
      // Download the PDF
      const filename = `${exportOptions.filename || 'report'}.pdf`;
      pdfExportService.downloadPDF(pdf, filename);
      
      // Log activity for report export
      await activityService.logReportExported({
        reportId: report.id,
        reportTitle: reportTitle,
        projectId: projectId,
        projectName: projectData?.name,
        userName: user.name,
        exportFormat: 'PDF',
        pageSize: exportOptions.pageSize,
        filename: filename
      });
      
      alert('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF');
    } finally {
      setExporting(false);
    }
  };

  const publishReport = async (publishOptions) => {
    setPublishing(true);
    try {
      // Save current line first
      await saveCurrentLine();
      
      // Update report status to published with options
      await reportService.updateReport(report.id, {
        title: reportTitle,
        status: 'published',
        publishedAt: new Date().toISOString(),
        publishedBy: user.name,
        publishOptions: publishOptions
      });
      
      // Update local state
      setReport(prev => ({
        ...prev,
        status: 'published',
        publishedAt: new Date().toISOString(),
        publishedBy: user.name,
        publishOptions: publishOptions
      }));
      
      // Log activity for report publishing
      await activityService.logReportPublished({
        reportId: report.id,
        reportTitle: reportTitle,
        projectId: projectId,
        projectName: projectData?.name,
        userName: user.name,
        visibility: publishOptions.visibility,
        publishOptions: publishOptions
      });
      
      // Simulate sending notifications
      if (publishOptions.sendNotifications) {
        console.log('Sending notifications to:', publishOptions.recipients);
      }
      
      alert(`Report published successfully with ${publishOptions.visibility} visibility!`);
    } catch (error) {
      console.error('Error publishing report:', error);
      alert('Error publishing report');
    } finally {
      setPublishing(false);
    }
  };

  // Removed handleAutoGenerateReport function as per feedback

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  if (previewMode) {
    // Before showing preview, save current line and update allLines with latest data
    const previewLines = [...allLines];
    if (currentLineIndex < previewLines.length) {
      previewLines[currentLineIndex] = {
        ...previewLines[currentLineIndex],
        title: currentTitle,
        description: currentDescription,
        images: currentImages
      };
    }

    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">{reportTitle}</Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={exporting ? <LinearProgress size={16} /> : <FaFileExport />}
                onClick={() => setExportModalOpen(true)}
                disabled={exporting}
              >
                {exporting ? 'Exporting...' : 'Export PDF'}
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={publishing ? <LinearProgress size={16} /> : <FaCheck />}
                onClick={() => setPublishModalOpen(true)}
                disabled={publishing}
              >
                {publishing ? 'Publishing...' : (report?.status === 'published' ? 'Update Publication' : 'Publish Report')}
              </Button>
              <Button onClick={() => setPreviewMode(false)} startIcon={<FaTimes />}>
                Exit Preview
              </Button>
            </Stack>
          </Box>
          
          {previewLines.map((line, index) => (
            <Box key={line.id} sx={{ mb: 4 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {line.title || `Line ${index + 1}`}
              </Typography>
              <Typography variant="body1" paragraph>
                {line.description || 'No description'}
              </Typography>
              {(line.images || []).length > 0 && (
                <Grid container spacing={2}>
                  {line.images.map((image) => (
                    <Grid item xs={6} sm={4} key={image.id}>
                      <Card>
                        <img
                          src={image.url}
                          alt={image.caption}
                          style={{ width: '100%', height: 150, objectFit: 'cover' }}
                        />
                        {image.caption && (
                          <CardContent sx={{ py: 1 }}>
                            <Typography variant="caption">{image.caption}</Typography>
                          </CardContent>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Paper>
      </Box>
    );
  }

  const currentLine = allLines[currentLineIndex];
  const progress = allLines.length > 0 ? ((currentLineIndex + 1) / allLines.length) * 100 : 0;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={onBack}>
            <FaArrowLeft />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1, mx: 2 }}>
            Report Editor
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<FaEye />}
              onClick={async () => {
                await saveCurrentLine();
                setPreviewMode(true);
              }}
              size="small"
            >
              Preview
            </Button>
            <Button
              variant="outlined"
              startIcon={exporting ? <LinearProgress size={16} /> : <FaFileExport />}
              onClick={() => setExportModalOpen(true)}
              disabled={exporting}
              size="small"
            >
              {exporting ? 'Exporting...' : 'Export PDF'}
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <LinearProgress size={16} /> : <FaSave />}
              onClick={saveReport}
              disabled={saving}
              size="small"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={publishing ? <LinearProgress size={16} /> : <FaCheck />}
              onClick={() => setPublishModalOpen(true)}
              disabled={publishing}
              size="small"
            >
              {publishing ? 'Publishing...' : (report?.status === 'published' ? 'Update' : 'Publish')}
            </Button>
          </Stack>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            placeholder="Report Title"
            variant="outlined"
            size="small"
          />
          {report?.status === 'published' && (
            <Alert severity="success" sx={{ py: 0, px: 2 }}>
              Published
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Progress */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2">
            {currentLine?.title ? `${currentLine.title} (${currentLineIndex + 1}/${allLines.length})` : `Line ${currentLineIndex + 1} of ${allLines.length}`}
          </Typography>
          <Typography variant="body2">
            {Math.round(progress)}% Complete
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} />
      </Paper>

      {/* Current Line Editor */}
      {currentLine ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Line {currentLineIndex + 1}
          </Typography>
          
          {/* Line Title Input */}
          <TextField
            fullWidth
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            placeholder="Enter line title (e.g., Foundation Work, Electrical Installation, etc.)"
            label="Line Title"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          
          {/* Line Description Input */}
          <TextField
            fullWidth
            multiline
            rows={6}
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
            placeholder="Enter detailed description for this line..."
            label="Description"
            variant="outlined"
            sx={{ mb: 3 }}
          />

          {/* Images Section */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Photos ({currentImages.length})
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FaCamera />}
                onClick={() => setImageDialogOpen(true)}
              >
                Add Photos
              </Button>
            </Box>

            {currentImages.length > 0 ? (
              <Grid container spacing={2}>
                {currentImages.map((image) => (
                  <Grid item xs={6} sm={4} md={3} key={image.id}>
                    <Card sx={{ position: 'relative' }}>
                      <img
                        src={image.url}
                        alt={image.caption}
                        style={{ width: '100%', height: 120, objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeImage(image.id)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'background.paper',
                          '&:hover': { bgcolor: 'error.main', color: 'white' }
                        }}
                      >
                        <FaTimes size={12} />
                      </IconButton>
                      {image.caption && (
                        <CardContent sx={{ py: 1 }}>
                          <Typography variant="caption">{image.caption}</Typography>
                        </CardContent>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                No photos added yet. Click "Add Photos" to attach images to this line.
              </Alert>
            )}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<FaArrowLeft />}
              onClick={goToPreviousLine}
              disabled={currentLineIndex === 0}
            >
              Previous Line
            </Button>

            <Button
              variant="contained"
              endIcon={<FaArrowRight />}
              onClick={handleSaveAndNextLine}
              color="primary"
            >
              Save & Next Line
            </Button>
          </Box>
        </Paper>
      ) : (
        <Alert severity="warning">
          No lines found. Click "Add New Line" to start writing your report.
        </Alert>
      )}

      {/* Add Line FAB */}
      <Fab
        color="primary"
        onClick={addNewLine}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <FaPlus />
      </Fab>

      {/* Image Upload Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Add Photos to Line {currentLineIndex + 1}
        </DialogTitle>
        <DialogContent>
          <ImageManager
            onUpload={handleImageUpload}
            maxImages={10}
            existingImages={currentImages}
            projectId={projectId}
            projectName={projectData?.name}
            projectPhase={projectData?.type || 'construction'}
            enableAdvancedFeatures={true}
            showLocationMap={true}
          />
        </DialogContent>
      </Dialog>

      {/* Export Options Modal */}
      <ExportOptionsModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={exportToPDF}
        reportTitle={reportTitle}
      />

      {/* Publish Options Modal */}
      <PublishOptionsModal
        open={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onPublish={publishReport}
        reportTitle={reportTitle}
        currentStatus={report?.status}
      />

      {/* Auto Report Generator Dialog removed as per feedback */}
    </Box>
  );
};

export default SimpleReportEditor;