/**
 * Template Editor Dialog Component - Modal for editing/customizing templates
 * Extracted from SmartTemplateSelector for better modularity
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Paper
} from '@mui/material';
import {
  FaPlus,
  FaSave,
  FaUndo
} from 'react-icons/fa';

const TemplateEditorDialog = ({
  open,
  onClose,
  editingTemplate,
  onTemplateChange,
  onSaveTemplate,
  onResetTemplate,
  templates,
  customTemplates
}) => {
  if (!editingTemplate) return null;

  const handleSectionChange = (index, field, value) => {
    const updated = [...editingTemplate.sections];
    updated[index][field] = value;
    onTemplateChange({ ...editingTemplate, sections: updated });
  };

  const handleAddSection = () => {
    const updated = [...(editingTemplate.sections || [])];
    updated.push({
      title: 'New Section',
      type: 'general',
      required: false
    });
    onTemplateChange({ ...editingTemplate, sections: updated });
  };

  const handleRemoveSection = (index) => {
    const updated = editingTemplate.sections.filter((_, i) => i !== index);
    onTemplateChange({ ...editingTemplate, sections: updated });
  };

  const handleReset = () => {
    // Reset to original
    const original = editingTemplate.isBuiltIn 
      ? templates.find(t => t.id === editingTemplate.id)
      : customTemplates.find(t => t.id === editingTemplate.id);
    if (original) {
      onTemplateChange({ ...original });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
              onChange={(e) => onTemplateChange({ 
                ...editingTemplate, 
                name: e.target.value 
              })}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={editingTemplate.description || ''}
              onChange={(e) => onTemplateChange({ 
                ...editingTemplate, 
                description: e.target.value 
              })}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Template Type</InputLabel>
              <Select
                value={editingTemplate.type || 'progress'}
                onChange={(e) => onTemplateChange({ 
                  ...editingTemplate, 
                  type: e.target.value 
                })}
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
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Section Title"
                      value={section.title}
                      onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={section.type}
                        onChange={(e) => handleSectionChange(index, 'type', e.target.value)}
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
                          onChange={(e) => handleSectionChange(index, 'required', e.target.checked)}
                          size="small"
                        />
                      }
                      label="Required"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveSection(index)}
                      disabled={editingTemplate.sections.length <= 1}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Button
              startIcon={<FaPlus />}
              onClick={handleAddSection}
              variant="outlined"
              size="small"
            >
              Add Section
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant="outlined"
          startIcon={<FaUndo />}
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button 
          variant="contained"
          startIcon={<FaSave />}
          onClick={onSaveTemplate}
        >
          Save Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateEditorDialog;