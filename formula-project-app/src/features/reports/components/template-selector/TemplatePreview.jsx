/**
 * Template Preview Component - Displays preview of selected template
 * Extracted from SmartTemplateSelector for better modularity
 */

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';

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

export default TemplatePreview;