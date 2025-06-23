/**
 * Smart Template Selector - Template customization and preview
 * SiteCam-inspired automation for Formula PM
 * Phase 2: Smart Automation Agent
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge
} from '@mui/material';
import {
  FaEye,
  FaCog,
  FaClone,
  FaEdit,
  FaTrash,
  FaPlus,
  FaMagic,
  FaChartLine,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaShieldAlt,
  FaTags,
  FaImage,
  FaFileAlt,
  FaDownload,
  FaSave,
  FaUndo
} from 'react-icons/fa';
import { MdExpandMore } from 'react-icons/md';

import smartTemplateService from '../services/smartTemplateService';

// Template Preview Component
const TemplatePreview = ({ template, photos, confidence }) => {
  const getSampleSections = () => {
    if (!template) return [];
    
    // Generate sample sections based on template type
    const sampleSections = template.sections.map((section, index) => ({
      ...section,
      sampleContent: generateSampleContent(section, photos)
    }));
    
    return sampleSections;
  };

  const generateSampleContent = (section, photos) => {
    const photoCount = photos?.length || 0;
    
    switch (section.type) {
      case 'summary':
        return `This ${template.name} covers ${photoCount} documented items across multiple locations. Key highlights include progress tracking, quality assessments, and action items.`;
      
      case 'location-based':
        return `Analysis of ${Math.min(3, photoCount)} key locations showing work progress and current status. Each location includes detailed photo documentation and observations.`;
      
      case 'timeline':
        return `Timeline analysis showing project progression over the documented period. ${photoCount > 10 ? 'Significant progress' : 'Initial progress'} has been recorded.`;
      
      case 'quality':
        return `Quality control assessment based on ${photoCount} inspection photos. Areas reviewed include workmanship, compliance, and material specifications.`;
      
      case 'issues':
        return `${Math.floor(photoCount * 0.2)} potential issues identified requiring attention. Each issue includes photo documentation and recommended actions.`;
      
      default:
        return `Section containing relevant ${section.title.toLowerCase()} information based on ${photoCount} photos.`;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{template.name} Preview</Typography>
        {confidence && (
          <Chip 
            label={`${Math.round(confidence * 100)}% confidence`}
            color={confidence > 0.8 ? 'success' : confidence > 0.6 ? 'warning' : 'default'}
            size="small"
          />
        )}
      </Box>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Template Description
        </Typography>
        <Typography variant="body2">
          {template.description}
        </Typography>
      </Paper>

      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        Report Structure Preview:
      </Typography>
      
      <List dense>
        {getSampleSections().map((section, index) => (
          <Box key={section.id} sx={{ mb: 2 }}>
            <ListItem sx={{ pl: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Chip label={index + 1} size="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={600}>
                    {section.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {section.sampleContent}
                    </Typography>
                    {section.requiredPhotos && (
                      <Chip 
                        label={`Requires ${section.requiredPhotos} photos`}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < getSampleSections().length - 1 && <Divider />}
          </Box>
        ))}
      </List>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant="body2" color="info.dark">
          <strong>Auto-Generation Features:</strong>
          <br />• Intelligent photo grouping by {template.groupingStrategy}
          <br />• Automatic {template.contentGeneration} generation
          <br />• Smart {template.analysisType} analysis
          {template.includeCharts && <br />}
          {template.includeCharts && '• Visual charts and progress indicators'}
        </Typography>
      </Box>
    </Box>
  );
};

const SmartTemplateSelector = ({ 
  onTemplateSelect,
  onTemplateCustomize,
  selectedTemplateId = null,
  showCustomization = true,
  photos = [],
  analysisResult = null
}) => {
  const [templates, setTemplates] = useState([]);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
    if (analysisResult) {
      generateRecommendations();
    }
  }, [analysisResult]);

  // Select initial template
  useEffect(() => {
    if (selectedTemplateId && templates.length > 0) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        setSelectedTemplate(template);
      }
    }
  }, [selectedTemplateId, templates]);

  const loadTemplates = () => {
    // Get built-in smart templates
    const builtInTemplates = [
      {
        id: 'smart-progress',
        name: 'Smart Progress Report',
        type: 'progress',
        description: 'AI-generated progress report with timeline and location analysis',
        icon: FaChartLine,
        color: '#2196F3',
        isBuiltIn: true,
        sections: [
          { title: 'Executive Summary', type: 'summary', required: true },
          { title: 'Progress by Location', type: 'locations', required: true },
          { title: 'Work Completed', type: 'progress', required: true },
          { title: 'Timeline Overview', type: 'timeline', required: false },
          { title: 'Issues & Concerns', type: 'issues', required: false }
        ],
        features: ['Timeline Analysis', 'Location Grouping', 'Progress Tracking', 'Photo Sequences'],
        estimatedTime: '2-3 minutes'
      },
      {
        id: 'smart-quality',
        name: 'Smart Quality Report',
        type: 'quality',
        description: 'AI-generated quality control report with inspection analysis',
        icon: FaClipboardCheck,
        color: '#4CAF50',
        isBuiltIn: true,
        sections: [
          { title: 'Quality Overview', type: 'summary', required: true },
          { title: 'Quality Inspections', type: 'quality', required: true },
          { title: 'Issues Identified', type: 'issues', required: true },
          { title: 'Location Analysis', type: 'locations', required: false },
          { title: 'Compliance Status', type: 'quality', required: false }
        ],
        features: ['Quality Analysis', 'Issue Detection', 'Compliance Tracking', 'Visual Evidence'],
        estimatedTime: '2-4 minutes'
      },
      {
        id: 'smart-issue',
        name: 'Smart Issue Report',
        type: 'issue',
        description: 'AI-generated issue tracking report with priority analysis',
        icon: FaExclamationTriangle,
        color: '#FF9800',
        isBuiltIn: true,
        sections: [
          { title: 'Issue Summary', type: 'summary', required: true },
          { title: 'Critical Issues', type: 'issues', required: true },
          { title: 'Issues by Location', type: 'locations', required: true },
          { title: 'Resolution Timeline', type: 'timeline', required: false },
          { title: 'Impact Analysis', type: 'issues', required: false }
        ],
        features: ['Issue Prioritization', 'Location Mapping', 'Timeline Tracking', 'Impact Assessment'],
        estimatedTime: '1-2 minutes'
      },
      {
        id: 'smart-safety',
        name: 'Smart Safety Report',
        type: 'safety',
        description: 'AI-generated safety compliance report with hazard analysis',
        icon: FaShieldAlt,
        color: '#F44336',
        isBuiltIn: true,
        sections: [
          { title: 'Safety Overview', type: 'summary', required: true },
          { title: 'Safety Documentation', type: 'safety', required: true },
          { title: 'Compliance Items', type: 'safety', required: true },
          { title: 'Hazard Analysis', type: 'safety', required: false },
          { title: 'Location Safety', type: 'locations', required: false }
        ],
        features: ['Hazard Detection', 'Compliance Tracking', 'Safety Protocols', 'Risk Assessment'],
        estimatedTime: '1-3 minutes'
      }
    ];

    setTemplates(builtInTemplates);
    
    // Load custom templates from localStorage
    const saved = localStorage.getItem('formula-pm-custom-templates');
    if (saved) {
      try {
        setCustomTemplates(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading custom templates:', error);
      }
    }
  };

  const generateRecommendations = () => {
    if (!analysisResult) return;

    const recs = [];
    const { photoCategories, patterns, confidence } = analysisResult;

    // Template recommendations based on photo content
    if (photoCategories.progress > photoCategories.quality && photoCategories.progress > photoCategories.issue) {
      recs.push({
        templateId: 'smart-progress',
        reason: 'Most photos are progress-related',
        confidence: 0.9
      });
    }

    if (photoCategories.quality > 0 && photoCategories.issue > 0) {
      recs.push({
        templateId: 'smart-quality',
        reason: 'Quality and issue photos detected',
        confidence: 0.8
      });
    }

    if (photoCategories.issue > photoCategories.progress) {
      recs.push({
        templateId: 'smart-issue',
        reason: 'High number of issue photos',
        confidence: 0.85
      });
    }

    if (photoCategories.safety > 0) {
      recs.push({
        templateId: 'smart-safety',
        reason: 'Safety photos detected',
        confidence: 0.7
      });
    }

    // Pattern-based recommendations
    if (patterns.progressSequence) {
      recs.push({
        templateId: 'smart-progress',
        reason: 'Progress sequences detected',
        confidence: 0.85
      });
    }

    setRecommendations(recs.sort((a, b) => b.confidence - a.confidence));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  const handlePreviewTemplate = (template) => {
    setSelectedTemplate(template);
    setPreviewMode(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate({ ...template });
    setEditMode(true);
  };

  const handleSaveCustomTemplate = () => {
    if (!editingTemplate) return;

    const newTemplate = {
      ...editingTemplate,
      id: editingTemplate.id || `custom-${Date.now()}`,
      isBuiltIn: false,
      createdAt: new Date().toISOString()
    };

    let updatedCustom = [...customTemplates];
    const existingIndex = updatedCustom.findIndex(t => t.id === newTemplate.id);
    
    if (existingIndex >= 0) {
      updatedCustom[existingIndex] = newTemplate;
    } else {
      updatedCustom.push(newTemplate);
    }

    setCustomTemplates(updatedCustom);
    localStorage.setItem('formula-pm-custom-templates', JSON.stringify(updatedCustom));
    setEditMode(false);
    setEditingTemplate(null);
  };

  const handleDeleteCustomTemplate = (templateId) => {
    const updated = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updated);
    localStorage.setItem('formula-pm-custom-templates', JSON.stringify(updated));
  };

  const getSuitabilityScore = (template) => {
    if (!analysisResult || !template) return 0;

    let score = 50; // Base score
    const { photoCategories, patterns } = analysisResult;

    // Template-specific scoring
    switch (template.type) {
      case 'progress':
        score += (photoCategories.progress || 0) * 10;
        score += (photoCategories.milestone || 0) * 8;
        if (patterns.progressSequence) score += 15;
        break;
      case 'quality':
        score += (photoCategories.quality || 0) * 12;
        score += (photoCategories.issue || 0) * 8;
        break;
      case 'issue':
        score += (photoCategories.issue || 0) * 15;
        score += (photoCategories.quality || 0) * 5;
        break;
      case 'safety':
        score += (photoCategories.safety || 0) * 20;
        break;
    }

    return Math.min(score, 100);
  };

  const renderTemplateCard = (template) => {
    const IconComponent = template.icon;
    const suitabilityScore = getSuitabilityScore(template);
    const recommendation = recommendations.find(r => r.templateId === template.id);
    const isRecommended = !!recommendation;
    const isSelected = selectedTemplate?.id === template.id;

    return (
      <Card 
        key={template.id}
        sx={{ 
          height: '100%',
          cursor: 'pointer',
          border: isSelected ? 2 : 1,
          borderColor: isSelected ? 'primary.main' : 'divider',
          '&:hover': { 
            boxShadow: 3,
            borderColor: 'primary.light'
          },
          position: 'relative'
        }}
        onClick={() => handleTemplateSelect(template)}
      >
        {/* Recommendation Badge */}
        {isRecommended && (
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
            <Chip
              icon={<FaMagic />}
              label={`${Math.round(recommendation.confidence * 100)}% Match`}
              size="small"
              sx={{
                bgcolor: recommendation.confidence > 0.8 ? 'success.main' : 'warning.main',
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                textAlign: 'right', 
                mt: 0.5,
                px: 1,
                color: 'text.secondary',
                fontSize: '0.7rem'
              }}
            >
              {recommendation.reason}
            </Typography>
          </Box>
        )}

        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconComponent 
              size={24} 
              color={template.color}
              style={{ marginRight: 12 }}
            />
            <Typography variant="h6" component="h3">
              {template.name}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {template.description}
          </Typography>

          {/* Suitability Score */}
          {analysisResult && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" gutterBottom>
                Suitability Score: {suitabilityScore}%
              </Typography>
              <Box sx={{ 
                width: '100%', 
                height: 4, 
                bgcolor: 'grey.300', 
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  width: `${suitabilityScore}%`, 
                  height: '100%', 
                  bgcolor: suitabilityScore > 70 ? 'success.main' : suitabilityScore > 40 ? 'warning.main' : 'error.main',
                  transition: 'width 0.3s ease'
                }} />
              </Box>
            </Box>
          )}

          {/* Features */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" gutterBottom>
              Features:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {template.features?.slice(0, 3).map(feature => (
                <Chip 
                  key={feature} 
                  label={feature} 
                  size="small" 
                  variant="outlined"
                />
              ))}
              {template.features?.length > 3 && (
                <Chip 
                  label={`+${template.features.length - 3} more`} 
                  size="small" 
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          {/* Sections Count */}
          <Typography variant="caption" color="text.secondary">
            {template.sections?.length || 0} sections • Est. {template.estimatedTime || '2-3 minutes'}
          </Typography>
        </CardContent>

        <CardActions>
          <Button 
            size="small" 
            startIcon={<FaEye />}
            onClick={(e) => {
              e.stopPropagation();
              handlePreviewTemplate(template);
            }}
          >
            Preview
          </Button>
          
          {showCustomization && (
            <Button 
              size="small" 
              startIcon={template.isBuiltIn ? <FaClone /> : <FaEdit />}
              onClick={(e) => {
                e.stopPropagation();
                handleEditTemplate(template);
              }}
            >
              {template.isBuiltIn ? 'Customize' : 'Edit'}
            </Button>
          )}

          {!template.isBuiltIn && (
            <IconButton 
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCustomTemplate(template.id);
              }}
            >
              <FaTrash />
            </IconButton>
          )}
        </CardActions>
      </Card>
    );
  };

  const renderTemplatePreview = () => {
    if (!selectedTemplate) return null;

    // Find if this template has a recommendation
    const recommendation = recommendations.find(r => r.templateId === selectedTemplate.id);
    const confidence = recommendation ? recommendation.confidence : getSuitabilityScore(selectedTemplate) / 100;

    return (
      <Dialog
        open={previewMode}
        onClose={() => setPreviewMode(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <selectedTemplate.icon 
              size={24} 
              color={selectedTemplate.color}
            />
            Template Preview: {selectedTemplate.name}
          </Box>
        </DialogTitle>

        <DialogContent>
          <TemplatePreview 
            template={selectedTemplate}
            photos={photos}
            confidence={confidence}
          />
          
          {recommendation && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="subtitle2">
                Recommended: {recommendation.reason}
              </Typography>
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button 
            startIcon={<FaEdit />}
            onClick={() => {
              setPreviewMode(false);
              handleEditTemplate(selectedTemplate);
            }}
          >
            Customize
          </Button>
          <Button onClick={() => setPreviewMode(false)}>
            Close
          </Button>
          <Button 
            variant="contained"
            startIcon={<FaMagic />}
            onClick={() => {
              handleTemplateSelect(selectedTemplate);
              setPreviewMode(false);
            }}
          >
            Use This Template
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderTemplateEditor = () => {
    if (!editingTemplate) return null;

    return (
      <Dialog
        open={editMode}
        onClose={() => setEditMode(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editingTemplate.isBuiltIn ? 'Customize Template' : 'Edit Template'}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Template Name"
                value={editingTemplate.name || ''}
                onChange={(e) => setEditingTemplate(prev => ({ 
                  ...prev, 
                  name: e.target.value 
                }))}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={editingTemplate.description || ''}
                onChange={(e) => setEditingTemplate(prev => ({ 
                  ...prev, 
                  description: e.target.value 
                }))}
                margin="normal"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Template Type</InputLabel>
                <Select
                  value={editingTemplate.type || 'progress'}
                  onChange={(e) => setEditingTemplate(prev => ({ 
                    ...prev, 
                    type: e.target.value 
                  }))}
                >
                  <MenuItem value="progress">Progress Report</MenuItem>
                  <MenuItem value="quality">Quality Control</MenuItem>
                  <MenuItem value="issue">Issue Report</MenuItem>
                  <MenuItem value="safety">Safety Report</MenuItem>
                  <MenuItem value="custom">Custom Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Template Sections
              </Typography>

              {editingTemplate.sections?.map((section, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Section Title"
                        value={section.title}
                        onChange={(e) => {
                          const updated = [...editingTemplate.sections];
                          updated[index].title = e.target.value;
                          setEditingTemplate(prev => ({ 
                            ...prev, 
                            sections: updated 
                          }));
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={section.type}
                          onChange={(e) => {
                            const updated = [...editingTemplate.sections];
                            updated[index].type = e.target.value;
                            setEditingTemplate(prev => ({ 
                              ...prev, 
                              sections: updated 
                            }));
                          }}
                        >
                          <MenuItem value="summary">Summary</MenuItem>
                          <MenuItem value="progress">Progress</MenuItem>
                          <MenuItem value="quality">Quality</MenuItem>
                          <MenuItem value="issues">Issues</MenuItem>
                          <MenuItem value="safety">Safety</MenuItem>
                          <MenuItem value="locations">Locations</MenuItem>
                          <MenuItem value="timeline">Timeline</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={section.required || false}
                            onChange={(e) => {
                              const updated = [...editingTemplate.sections];
                              updated[index].required = e.target.checked;
                              setEditingTemplate(prev => ({ 
                                ...prev, 
                                sections: updated 
                              }));
                            }}
                            size="small"
                          />
                        }
                        label="Required"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Button
                startIcon={<FaPlus />}
                onClick={() => {
                  const updated = [...(editingTemplate.sections || [])];
                  updated.push({
                    title: 'New Section',
                    type: 'general',
                    required: false
                  });
                  setEditingTemplate(prev => ({ 
                    ...prev, 
                    sections: updated 
                  }));
                }}
                variant="outlined"
                size="small"
              >
                Add Section
              </Button>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditMode(false)}>
            Cancel
          </Button>
          <Button 
            variant="outlined"
            startIcon={<FaUndo />}
            onClick={() => {
              // Reset to original
              const original = editingTemplate.isBuiltIn 
                ? templates.find(t => t.id === editingTemplate.id)
                : customTemplates.find(t => t.id === editingTemplate.id);
              if (original) {
                setEditingTemplate({ ...original });
              }
            }}
          >
            Reset
          </Button>
          <Button 
            variant="contained"
            startIcon={<FaSave />}
            onClick={handleSaveCustomTemplate}
          >
            Save Template
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const allTemplates = [...templates, ...customTemplates];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Smart Template Selector
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose a template that best fits your reporting needs. Templates are automatically optimized based on your photo analysis.
        </Typography>
      </Box>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Recommended Templates Based on Your Photos:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            {recommendations.slice(0, 2).map(rec => {
              const template = allTemplates.find(t => t.id === rec.templateId);
              return template ? (
                <Chip
                  key={rec.templateId}
                  label={`${template.name} (${Math.round(rec.confidence * 100)}%)`}
                  color="primary"
                  variant="outlined"
                  onClick={() => handleTemplateSelect(template)}
                  clickable
                />
              ) : null;
            })}
          </Box>
        </Alert>
      )}

      {/* Template Grid */}
      <Grid container spacing={3}>
        {allTemplates.map(template => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            {renderTemplateCard(template)}
          </Grid>
        ))}

        {/* Add Custom Template Card */}
        {showCustomization && (
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                border: '2px dashed',
                borderColor: 'primary.main',
                '&:hover': { 
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => {
                setEditingTemplate({
                  name: 'Custom Template',
                  description: 'Create your own custom report template',
                  type: 'custom',
                  sections: [],
                  features: [],
                  isBuiltIn: false
                });
                setEditMode(true);
              }}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                minHeight: 200
              }}>
                <FaPlus size={32} color="#1976d2" />
                <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                  Create Custom Template
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Build your own template from scratch
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <Paper sx={{ p: 3, mt: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="h6" gutterBottom>
            Selected Template: {selectedTemplate.name}
          </Typography>
          <Typography variant="body2">
            {selectedTemplate.description}
          </Typography>
          {analysisResult && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Suitability Score: {getSuitabilityScore(selectedTemplate)}%
            </Typography>
          )}
        </Paper>
      )}

      {/* Preview Dialog */}
      {renderTemplatePreview()}

      {/* Template Editor Dialog */}
      {renderTemplateEditor()}
    </Box>
  );
};

export default SmartTemplateSelector;