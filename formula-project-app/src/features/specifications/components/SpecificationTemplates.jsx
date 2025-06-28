import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from '@mui/material';
import {
  Plus as AddIcon,
  Edit as EditIcon,
  Trash as DeleteIcon,
  Copy as CopyIcon,
  Download as DownloadIcon,
  CloudUpload as UploadIcon,
  MoreVert as MoreVertIcon,
  Page as TemplateIcon,
  TagOutline as CategoryIcon,
  Settings as StandardIcon,
  ArrowDown as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Check as RuleIcon,
  Color as CustomizeIcon
} from 'iconoir-react';

const SpecificationTemplates = ({ 
  onCreateFromTemplate,
  onUpdateStandards,
  categories = []
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [standards, setStandards] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [standardDialogOpen, setStandardDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: '',
    fields: [],
    isStandard: false,
    tags: []
  });

  const [newStandard, setNewStandard] = useState({
    name: '',
    description: '',
    category: '',
    rules: [],
    applicableCategories: [],
    isActive: true
  });

  // Mock template data
  useEffect(() => {
    setTemplates([
      {
        id: 'template-1',
        name: 'Standard Kitchen Cabinet',
        description: 'Template for kitchen cabinet specifications',
        category: 'Kitchen Cabinets',
        isStandard: true,
        usageCount: 45,
        lastUsed: '2024-03-15',
        tags: ['kitchen', 'cabinet', 'millwork'],
        fields: [
          { name: 'dimensions', type: 'text', required: true, defaultValue: '', placeholder: 'W x D x H' },
          { name: 'material', type: 'select', required: true, options: ['Maple', 'Oak', 'Cherry', 'MDF'], defaultValue: 'Maple' },
          { name: 'finish', type: 'select', required: true, options: ['Natural', 'Stained', 'Painted'], defaultValue: 'Natural' },
          { name: 'hardware', type: 'text', required: false, defaultValue: 'Soft-close hinges', placeholder: 'Hardware details' },
          { name: 'quantity', type: 'number', required: true, defaultValue: '1', placeholder: '1' },
          { name: 'unitCost', type: 'currency', required: true, defaultValue: '', placeholder: '$0.00' }
        ]
      },
      {
        id: 'template-2',
        name: 'Reception Desk Template',
        description: 'Standard template for reception desk specifications',
        category: 'Reception Furniture',
        isStandard: false,
        usageCount: 12,
        lastUsed: '2024-03-10',
        tags: ['reception', 'desk', 'custom'],
        fields: [
          { name: 'dimensions', type: 'text', required: true, defaultValue: '', placeholder: 'W x D x H' },
          { name: 'material', type: 'select', required: true, options: ['White Oak', 'Walnut', 'Laminate'], defaultValue: 'White Oak' },
          { name: 'finish', type: 'select', required: true, options: ['Clear Lacquer', 'Stain', 'Veneer'], defaultValue: 'Clear Lacquer' },
          { name: 'features', type: 'multiselect', required: false, options: ['Wire Management', 'LED Lighting', 'Storage', 'Transaction Counter'], defaultValue: [] },
          { name: 'quantity', type: 'number', required: true, defaultValue: '1', placeholder: '1' },
          { name: 'unitCost', type: 'currency', required: true, defaultValue: '', placeholder: '$0.00' }
        ]
      },
      {
        id: 'template-3',
        name: 'Hardware Standard',
        description: 'Standard hardware specification template',
        category: 'Hardware',
        isStandard: true,
        usageCount: 78,
        lastUsed: '2024-03-18',
        tags: ['hardware', 'hinges', 'slides'],
        fields: [
          { name: 'hardwareType', type: 'select', required: true, options: ['Hinges', 'Drawer Slides', 'Pulls', 'Knobs'], defaultValue: 'Hinges' },
          { name: 'material', type: 'select', required: true, options: ['Stainless Steel', 'Brass', 'Chrome', 'Nickel'], defaultValue: 'Stainless Steel' },
          { name: 'finish', type: 'select', required: true, options: ['Brushed', 'Polished', 'Matte'], defaultValue: 'Brushed' },
          { name: 'specifications', type: 'text', required: true, defaultValue: '', placeholder: 'Technical specifications' },
          { name: 'quantity', type: 'number', required: true, defaultValue: '1', placeholder: '1' },
          { name: 'unitCost', type: 'currency', required: true, defaultValue: '', placeholder: '$0.00' }
        ]
      }
    ]);

    setStandards([
      {
        id: 'standard-1',
        name: 'Fire Safety Standard',
        description: 'Fire resistance and safety requirements for all materials',
        category: 'Safety',
        rules: [
          { field: 'fireRating', operator: 'required', value: true, message: 'Fire rating is mandatory' },
          { field: 'fireRating', operator: 'min_value', value: 'Class B', message: 'Minimum Class B fire rating required' },
          { field: 'smokeRating', operator: 'max_value', value: 450, message: 'Smoke rating must be ≤450' }
        ],
        applicableCategories: ['Kitchen Cabinets', 'Reception Furniture', 'Wall Panels'],
        isActive: true
      },
      {
        id: 'standard-2',
        name: 'Environmental Standard',
        description: 'Environmental and sustainability requirements',
        category: 'Environmental',
        rules: [
          { field: 'vocEmissions', operator: 'max_value', value: 0.5, message: 'VOC emissions must be ≤0.5 mg/m³' },
          { field: 'formaldehydeCompliance', operator: 'required', value: true, message: 'Formaldehyde compliance required' },
          { field: 'sustainabilityCert', operator: 'one_of', value: ['FSC', 'SFI', 'PEFC'], message: 'Sustainability certification required' }
        ],
        applicableCategories: ['Kitchen Cabinets', 'Reception Furniture'],
        isActive: true
      },
      {
        id: 'standard-3',
        name: 'Quality Standard',
        description: 'Quality and durability requirements',
        category: 'Quality',
        rules: [
          { field: 'warranty', operator: 'min_value', value: 12, message: 'Minimum 12-month warranty required' },
          { field: 'qualityGrade', operator: 'one_of', value: ['Premium', 'Commercial', 'Industrial'], message: 'Quality grade must be specified' },
          { field: 'testCertification', operator: 'required', value: true, message: 'Third-party testing certification required' }
        ],
        applicableCategories: ['All'],
        isActive: true
      }
    ]);
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMenuOpen = (event, template) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplate(template);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTemplate(null);
  };

  const handleCreateTemplate = () => {
    const template = {
      ...newTemplate,
      id: `template-${Date.now()}`,
      usageCount: 0,
      lastUsed: null
    };
    
    setTemplates([...templates, template]);
    setTemplateDialogOpen(false);
    setNewTemplate({
      name: '', description: '', category: '', fields: [], isStandard: false, tags: []
    });
  };

  const handleCreateStandard = () => {
    const standard = {
      ...newStandard,
      id: `standard-${Date.now()}`
    };
    
    setStandards([...standards, standard]);
    setStandardDialogOpen(false);
    setNewStandard({
      name: '', description: '', category: '', rules: [], applicableCategories: [], isActive: true
    });
  };

  const handleUseTemplate = (template) => {
    if (onCreateFromTemplate) {
      onCreateFromTemplate(template);
    }
    handleMenuClose();
  };

  const renderTemplateCard = (template) => (
    <Card key={template.id} variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6">{template.name}</Typography>
              {template.isStandard && (
                <Chip label="Standard" size="small" color="primary" />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {template.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Category: {template.category} • Used {template.usageCount} times
              {template.lastUsed && ` • Last used: ${template.lastUsed}`}
            </Typography>
          </Box>
          <IconButton size="small" onClick={(e) => handleMenuOpen(e, template)}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
          {template.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Template Fields ({template.fields.length}):
        </Typography>
        <List dense>
          {template.fields.slice(0, 3).map((field) => (
            <ListItem key={field.name} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                {field.required && <CheckIcon color="primary" fontSize="small" />}
              </ListItemIcon>
              <ListItemText
                primary={field.name}
                secondary={`${field.type}${field.required ? ' (required)' : ''}`}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          ))}
          {template.fields.length > 3 && (
            <ListItem sx={{ py: 0.5 }}>
              <ListItemText
                primary={`+${template.fields.length - 3} more fields`}
                primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleUseTemplate(template)}
          >
            Use Template
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<CopyIcon />}
            onClick={() => {
              const copy = { ...template, id: `template-${Date.now()}`, name: `${template.name} (Copy)` };
              setTemplates([...templates, copy]);
            }}
          >
            Duplicate
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderStandardCard = (standard) => (
    <Accordion key={standard.id}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <RuleIcon color="primary" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1">{standard.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {standard.description}
            </Typography>
          </Box>
          <Chip
            label={standard.isActive ? 'Active' : 'Inactive'}
            size="small"
            color={standard.isActive ? 'success' : 'default'}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Applicable Categories:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
              {standard.applicableCategories.map((category) => (
                <Chip key={category} label={category} size="small" variant="outlined" />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Rules:
            </Typography>
            <List dense>
              {standard.rules.map((rule, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <RuleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${rule.field} ${rule.operator} ${rule.value}`}
                    secondary={rule.message}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Specification Templates & Standards</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<StandardIcon />}
            onClick={() => setStandardDialogOpen(true)}
          >
            Add Standard
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setTemplateDialogOpen(true)}
          >
            Create Template
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Templates" icon={<TemplateIcon />} />
        <Tab label="Standards & Rules" icon={<StandardIcon />} />
      </Tabs>

      {/* Template Tab */}
      {activeTab === 0 && (
        <Box>
          {/* Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 300 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Filter by Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Kitchen Cabinets">Kitchen Cabinets</MenuItem>
                <MenuItem value="Reception Furniture">Reception Furniture</MenuItem>
                <MenuItem value="Hardware">Hardware</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Template Cards */}
          <Grid container spacing={3}>
            {filteredTemplates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template.id}>
                {renderTemplateCard(template)}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Standards Tab */}
      {activeTab === 1 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            Standards define quality, safety, and compliance rules that are automatically applied to specifications.
          </Alert>
          {standards.map((standard) => renderStandardCard(standard))}
        </Box>
      )}

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleUseTemplate(selectedTemplate)}>
          <AddIcon sx={{ mr: 1 }} /> Use Template
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1 }} /> Edit Template
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <CopyIcon sx={{ mr: 1 }} /> Duplicate
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1 }} /> Export
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Create Template Dialog */}
      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Template</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Template Name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                  label="Category"
                >
                  <MenuItem value="Kitchen Cabinets">Kitchen Cabinets</MenuItem>
                  <MenuItem value="Reception Furniture">Reception Furniture</MenuItem>
                  <MenuItem value="Hardware">Hardware</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={newTemplate.tags.join(', ')}
                onChange={(e) => setNewTemplate({
                  ...newTemplate, 
                  tags: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
                placeholder="e.g., kitchen, cabinet, millwork"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateTemplate} 
            variant="contained"
            disabled={!newTemplate.name || !newTemplate.category}
          >
            Create Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Standard Dialog */}
      <Dialog open={standardDialogOpen} onClose={() => setStandardDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Standard</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Standard Name"
                value={newStandard.name}
                onChange={(e) => setNewStandard({...newStandard, name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newStandard.category}
                  onChange={(e) => setNewStandard({...newStandard, category: e.target.value})}
                  label="Category"
                >
                  <MenuItem value="Safety">Safety</MenuItem>
                  <MenuItem value="Environmental">Environmental</MenuItem>
                  <MenuItem value="Quality">Quality</MenuItem>
                  <MenuItem value="Compliance">Compliance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newStandard.description}
                onChange={(e) => setNewStandard({...newStandard, description: e.target.value})}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStandardDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateStandard} 
            variant="contained"
            disabled={!newStandard.name || !newStandard.category}
          >
            Create Standard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpecificationTemplates;