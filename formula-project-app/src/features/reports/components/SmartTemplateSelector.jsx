/**
 * Smart Template Selector - Refactored modular template selection interface
 * SiteCam-inspired automation for Formula PM
 * Phase 2: Smart Automation Agent - Modularized for better maintainability
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Alert,
  Chip
} from '@mui/material';
import { FaPlus } from 'react-icons/fa';

import smartTemplateService from '../services/smartTemplateService';
import TemplateCard from './template-selector/TemplateCard';
import TemplatePreviewDialog from './template-selector/TemplatePreviewDialog';
import TemplateEditorDialog from './template-selector/TemplateEditorDialog';

// Modular components have been extracted to separate files for better maintainability

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

  // Template card rendering now handled by modular TemplateCard component

  // Template preview now handled by modular TemplatePreviewDialog component

  // Template editor now handled by modular TemplateEditorDialog component

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
        {allTemplates.map(template => {
          const suitabilityScore = getSuitabilityScore(template);
          const recommendation = recommendations.find(r => r.templateId === template.id);
          const isSelected = selectedTemplate?.id === template.id;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <TemplateCard
                template={template}
                isSelected={isSelected}
                recommendation={recommendation}
                suitabilityScore={suitabilityScore}
                analysisResult={analysisResult}
                showCustomization={showCustomization}
                onTemplateSelect={handleTemplateSelect}
                onPreviewTemplate={handlePreviewTemplate}
                onEditTemplate={handleEditTemplate}
                onDeleteTemplate={handleDeleteCustomTemplate}
              />
            </Grid>
          );
        })}

        {/* Add Custom Template Card */}
        {showCustomization && (
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                border: '2px dashed',
                borderPalette: 'primary.main',
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
      <TemplatePreviewDialog
        open={previewMode}
        onClose={() => setPreviewMode(false)}
        selectedTemplate={selectedTemplate}
        photos={photos}
        recommendations={recommendations}
        getSuitabilityScore={getSuitabilityScore}
        onEditTemplate={handleEditTemplate}
        onTemplateSelect={handleTemplateSelect}
      />

      {/* Template Editor Dialog */}
      <TemplateEditorDialog
        open={editMode}
        onClose={() => setEditMode(false)}
        editingTemplate={editingTemplate}
        onTemplateChange={setEditingTemplate}
        onSaveTemplate={handleSaveCustomTemplate}
        onResetTemplate={() => {
          const original = editingTemplate?.isBuiltIn 
            ? templates.find(t => t.id === editingTemplate.id)
            : customTemplates.find(t => t.id === editingTemplate.id);
          if (original) {
            setEditingTemplate({ ...original });
          }
        }}
        templates={templates}
        customTemplates={customTemplates}
      />
    </Box>
  );
};

export default SmartTemplateSelector;