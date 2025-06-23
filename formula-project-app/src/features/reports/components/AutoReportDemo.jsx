/**
 * Auto Report Demo - Integration demonstration for Phase 2 Smart Automation
 * Shows how all the new components work together with existing systems
 * SiteCam-inspired automation for Formula PM
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  FaRocket,
  FaImages,
  FaChartLine,
  FaEye,
  FaCog,
  FaDownload,
  FaCheckCircle,
  FaPlay
} from 'react-icons/fa';

// Import the new automation components
import AutoReportGenerator from './AutoReportGenerator';
import PhotoSequenceViewer from './PhotoSequenceViewer';
import SmartTemplateSelector from './SmartTemplateSelector';
import TimelineProgressTracker from './TimelineProgressTracker';

// Import existing services
import autoReportService from '../services/autoReportService';
import smartTemplateService from '../services/smartTemplateService';
import photoService from '../services/photoService';
import reportService from '../services/reportService';

const AutoReportDemo = ({ projectId = '2001', onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [demoPhotos, setDemoPhotos] = useState([]);
  const [demoSequences, setDemoSequences] = useState([]);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
    try {
      setLoading(true);

      // Generate some demo photos for demonstration
      const photos = await generateDemoPhotos();
      setDemoPhotos(photos);

      // Generate demo sequences
      const sequences = await generateDemoSequences(photos);
      setDemoSequences(sequences);

      // Generate analysis result
      const analysis = await smartTemplateService.generateSmartReport(projectId, photos, 'auto');
      setAnalysisResult(analysis.analysisResult);

    } catch (error) {
      console.error('Error loading demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDemoPhotos = async () => {
    // Create realistic demo photos with metadata
    const basePhotos = [
      {
        id: 'demo-1',
        originalName: 'kitchen_progress_001.jpg',
        caption: 'Executive Kitchen Upper Cabinets Installation',
        description: 'Installation of upper cabinets with LED lighting system in executive kitchen area.',
        capturedAt: '2025-01-20T09:30:00Z',
        category: 'progress',
        location: {
          building: 'Main Building',
          floor: 'Ground Floor',
          room: 'Executive Kitchen',
          area: 'Upper Cabinets'
        },
        project: {
          id: projectId,
          workCategory: 'Millwork'
        },
        tags: ['installation', 'millwork', 'progress'],
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDI5NkYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5LaXRjaGVuIFByb2dyZXNzPC90ZXh0Pjwvc3ZnPg==',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDI5NkYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5LaXRjaGVuIFByb2dyZXNzPC90ZXh0Pjwvc3ZnPg=='
      },
      {
        id: 'demo-2',
        originalName: 'quality_check_002.jpg',
        caption: 'Marble Countertop Quality Inspection',
        description: 'Quality control inspection of marble countertop installation showing excellent fit and finish.',
        capturedAt: '2025-01-20T14:15:00Z',
        category: 'quality',
        location: {
          building: 'Main Building',
          floor: 'Ground Floor',
          room: 'Executive Kitchen',
          area: 'Countertops'
        },
        project: {
          id: projectId,
          workCategory: 'Construction'
        },
        tags: ['quality', 'inspection', 'countertops'],
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNENBRjUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RdWFsaXR5IENoZWNrPC90ZXh0Pjwvc3ZnPg==',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNENBRjUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RdWFsaXR5IENoZWNrPC90ZXh0Pjwvc3ZnPg=='
      },
      {
        id: 'demo-3',
        originalName: 'electrical_issue_003.jpg',
        caption: 'Electrical Connection Issue Identified',
        description: 'Issue with electrical connection requiring attention from electrical contractor.',
        capturedAt: '2025-01-21T10:45:00Z',
        category: 'issue',
        location: {
          building: 'Main Building',
          floor: 'Ground Floor',
          room: 'Executive Kitchen',
          area: 'Electrical Panel'
        },
        project: {
          id: projectId,
          workCategory: 'Electric'
        },
        tags: ['issue', 'electrical', 'action-required'],
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY5ODAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FbGVjdHJpY2FsIElzc3VlPC90ZXh0Pjwvc3ZnPg==',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY5ODAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FbGVjdHJpY2FsIElzc3VlPC90ZXh0Pjwvc3ZnPg=='
      },
      {
        id: 'demo-4',
        originalName: 'conference_room_004.jpg',
        caption: 'Conference Room A Painting Complete',
        description: 'Completion of painting work in Conference Room A with final touch-ups.',
        capturedAt: '2025-01-21T16:30:00Z',
        category: 'milestone',
        location: {
          building: 'Main Building',
          floor: 'Ground Floor',
          room: 'Conference Room A',
          area: 'Walls'
        },
        project: {
          id: projectId,
          workCategory: 'Construction'
        },
        tags: ['completed', 'painting', 'milestone'],
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOUMyN0IwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db21wbGV0ZWQgV29yazwvdGV4dD48L3N2Zz4=',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOUMyN0IwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db21wbGV0ZWQgV29yazwvdGV4dD48L3N2Zz4='
      },
      {
        id: 'demo-5',
        originalName: 'safety_check_005.jpg',
        caption: 'Safety Equipment Check',
        description: 'Daily safety equipment inspection and compliance verification.',
        capturedAt: '2025-01-22T08:00:00Z',
        category: 'safety',
        location: {
          building: 'Main Building',
          floor: 'Ground Floor',
          room: 'Main Lobby',
          area: 'Safety Station'
        },
        project: {
          id: projectId,
          workCategory: 'General'
        },
        tags: ['safety', 'compliance', 'daily-check'],
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjQ0MzM2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TYWZldHkgQ2hlY2s8L3RleHQ+PC9zdmc+',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjQ0MzM2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TYWZldHkgQ2hlY2s8L3RleHQ+PC9zdmc+'
      }
    ];

    return basePhotos;
  };

  const generateDemoSequences = async (photos) => {
    // Create demo photo sequences
    const kitchenPhotos = photos.filter(p => p.location.room === 'Executive Kitchen');
    
    if (kitchenPhotos.length >= 2) {
      return [{
        id: 'seq-1',
        location: 'Executive Kitchen',
        type: 'progress-sequence',
        photos: kitchenPhotos,
        timeSpan: {
          startDate: kitchenPhotos[0].capturedAt,
          endDate: kitchenPhotos[kitchenPhotos.length - 1].capturedAt,
          description: '2 days'
        }
      }];
    }

    return [];
  };

  const handleGenerateAutoReport = async () => {
    try {
      setLoading(true);
      
      const result = await autoReportService.generateFromPhotos(
        projectId,
        demoPhotos,
        {
          templateType: 'auto',
          includeSequences: true,
          includeMetadata: true
        }
      );

      if (result.success) {
        setGeneratedReport(result.report);
        setActiveTab(4); // Switch to results tab
      }
    } catch (error) {
      console.error('Error generating auto report:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDemoHeader = () => (
    <Paper sx={{ p: 3, mb: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
      <Typography variant="h4" gutterBottom>
        SiteCam-Inspired Smart Reports Demo
      </Typography>
      <Typography variant="h6" gutterBottom>
        Phase 2: Automated Report Generation
      </Typography>
      <Typography variant="body1">
        Explore how AI transforms photo collections into professional construction reports automatically
      </Typography>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Chip 
          label="70% Faster Report Creation" 
          sx={{ bgcolor: 'success.main', color: 'white' }}
        />
        <Chip 
          label="Automatic Photo Organization" 
          sx={{ bgcolor: 'info.main', color: 'white' }}
        />
        <Chip 
          label="Smart Content Generation" 
          sx={{ bgcolor: 'warning.main', color: 'white' }}
        />
      </Box>
    </Paper>
  );

  const renderOverview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Demo Project Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Formula International Office Renovation
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {demoPhotos.length}
                  </Typography>
                  <Typography variant="caption">Demo Photos</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary">
                    {[...new Set(demoPhotos.map(p => p.location.room))].length}
                  </Typography>
                  <Typography variant="caption">Locations</Typography>
                </Box>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              fullWidth
              startIcon={<FaRocket />}
              onClick={handleGenerateAutoReport}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Generate Auto Report Now
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Smart Features Demo
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaCheckCircle color="#4CAF50" style={{ marginRight: 8 }} />
                <Typography variant="body2">Auto template selection</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaCheckCircle color="#4CAF50" style={{ marginRight: 8 }} />
                <Typography variant="body2">Timeline-based photo sequencing</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaCheckCircle color="#4CAF50" style={{ marginRight: 8 }} />
                <Typography variant="body2">Location-based organization</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaCheckCircle color="#4CAF50" style={{ marginRight: 8 }} />
                <Typography variant="body2">Progress tracking & analysis</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaCheckCircle color="#4CAF50" style={{ marginRight: 8 }} />
                <Typography variant="body2">Smart content generation</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            How It Works:
          </Typography>
          <Typography variant="body2">
            1. <strong>Photo Analysis:</strong> AI analyzes your photos for content, location, and timeline patterns
            <br />
            2. <strong>Template Selection:</strong> Smart algorithm chooses the most suitable report template
            <br />
            3. <strong>Content Generation:</strong> Automatic section creation with intelligent descriptions
            <br />
            4. <strong>Professional Output:</strong> Ready-to-use reports with images and comprehensive documentation
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );

  const renderPhotoSequences = () => (
    <Box>
      {demoSequences.length > 0 ? (
        <PhotoSequenceViewer 
          sequences={demoSequences}
          showControls={true}
          autoPlay={false}
        />
      ) : (
        <Alert severity="info">
          <Typography variant="subtitle2" gutterBottom>
            Photo Sequence Demo
          </Typography>
          <Typography variant="body2">
            This component automatically detects before/during/after photo sequences and displays them 
            as interactive timelines. Upload more photos to see sequence detection in action.
          </Typography>
        </Alert>
      )}
    </Box>
  );

  const renderTemplateSelector = () => (
    <SmartTemplateSelector
      onTemplateSelect={(template) => console.log('Selected template:', template)}
      photos={demoPhotos}
      analysisResult={analysisResult}
      showCustomization={true}
    />
  );

  const renderTimelineTracker = () => (
    <TimelineProgressTracker
      photos={demoPhotos}
      onPhotoSelect={(photo) => console.log('Selected photo:', photo)}
      showControls={true}
      groupBy="day"
    />
  );

  const renderAutoGenerator = () => (
    <AutoReportGenerator
      projectId={projectId}
      preSelectedPhotos={demoPhotos}
      onReportGenerated={(report) => {
        setGeneratedReport(report);
        setActiveTab(5); // Switch to results
      }}
    />
  );

  const renderResults = () => (
    <Box>
      {generatedReport ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="success">
              <Typography variant="h6" gutterBottom>
                Report Generated Successfully!
              </Typography>
              <Typography variant="body2">
                Your intelligent report "{generatedReport.title}" has been created automatically.
              </Typography>
            </Alert>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Report Details
                </Typography>
                <Typography><strong>Title:</strong> {generatedReport.title}</Typography>
                <Typography><strong>Type:</strong> {generatedReport.type}</Typography>
                <Typography><strong>Sections:</strong> {generatedReport.sections?.length || 0}</Typography>
                <Typography><strong>Auto-Generated:</strong> {generatedReport.metadata?.autoGenerated ? 'Yes' : 'No'}</Typography>
                <Typography><strong>Created:</strong> {new Date(generatedReport.createdAt).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Generation Metrics
                </Typography>
                {analysisResult && (
                  <>
                    <Typography><strong>Confidence Score:</strong> {Math.round(analysisResult.confidence * 100)}%</Typography>
                    <Typography><strong>Photos Analyzed:</strong> {analysisResult.totalPhotos}</Typography>
                    <Typography><strong>Locations:</strong> {Object.keys(analysisResult.locations || {}).length}</Typography>
                    <Typography><strong>Time Span:</strong> {analysisResult.timeSpan?.description}</Typography>
                    <Typography><strong>Generation Time:</strong> < 30 seconds</Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Generated Sections Preview
                </Typography>
                {generatedReport.sections?.map((section, index) => (
                  <Box key={section.id} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {index + 1}. {section.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {section.lines?.length || 0} items • Type: {section.type}
                    </Typography>
                    {section.lines?.slice(0, 1).map(line => (
                      <Typography key={line.id} variant="body2" sx={{ ml: 2, mt: 1 }}>
                        {line.description.substring(0, 150)}...
                      </Typography>
                    ))}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" startIcon={<FaEye />}>
                Preview Full Report
              </Button>
              <Button variant="outlined" startIcon={<FaDownload />}>
                Download PDF
              </Button>
              <Button variant="outlined" startIcon={<FaCog />}>
                Edit Report
              </Button>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <FaChartLine size={48} color="#ccc" />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Generate a Report First
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the Auto Generator tab to create an intelligent report from your photos
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => setActiveTab(4)}
          >
            Go to Auto Generator
          </Button>
        </Paper>
      )}
    </Box>
  );

  const tabContent = [
    { label: 'Overview', icon: FaEye, component: renderOverview },
    { label: 'Photo Sequences', icon: FaImages, component: renderPhotoSequences },
    { label: 'Template Selector', icon: FaCog, component: renderTemplateSelector },
    { label: 'Timeline Tracker', icon: FaChartLine, component: renderTimelineTracker },
    { label: 'Auto Generator', icon: FaRocket, component: renderAutoGenerator },
    { label: 'Results', icon: FaCheckCircle, component: renderResults }
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 2 }}>
      {renderDemoHeader()}

      {loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Processing demo data...
          </Typography>
        </Box>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabContent.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={<tab.icon />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ minHeight: 400 }}>
        {tabContent[activeTab]?.component()}
      </Box>

      {/* Close Button */}
      {onClose && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button variant="outlined" onClick={onClose}>
            Close Demo
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AutoReportDemo;