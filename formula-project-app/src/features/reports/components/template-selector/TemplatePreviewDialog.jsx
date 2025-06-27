/**
 * Template Preview Dialog Component - Modal for template preview
 * Extracted from SmartTemplateSelector for better modularity
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material';
import {
  FaEdit,
  FaMagic
} from 'react-icons/fa';
import TemplatePreview from './TemplatePreview';

const TemplatePreviewDialog = ({
  open,
  onClose,
  selectedTemplate,
  photos,
  recommendations,
  getSuitabilityScore,
  onEditTemplate,
  onTemplateSelect
}) => {
  if (!selectedTemplate) return null;

  // Find if this template has a recommendation
  const recommendation = recommendations.find(r => r.templateId === selectedTemplate.id);
  const confidence = recommendation ? recommendation.confidence : getSuitabilityScore(selectedTemplate) / 100;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            onClose();
            onEditTemplate(selectedTemplate);
          }}
        >
          Customize
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
        <Button 
          variant="contained"
          startIcon={<FaMagic />}
          onClick={() => {
            onTemplateSelect(selectedTemplate);
            onClose();
          }}
        >
          Use This Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplatePreviewDialog;