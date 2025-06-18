import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Alert,
  LinearProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Upload as UploadIcon,
  GetApp as DownloadIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Assessment as ReportIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUpload as CloudUploadIcon,
  TableChart as ExcelIcon
} from '@mui/icons-material';
import EnhancedHeader from '../../../components/ui/UnifiedHeader';
import EnhancedTabSystem from '../../../components/layout/EnhancedTabSystem';
import excelSpecificationService from '../services/excelSpecificationService';
import apiService from '../../../services/api/apiService';

const MaterialSpecificationsList = ({ 
  projects = [],
  teamMembers = [],
  shopDrawings = []
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState(null);
  
  // Dialog states
  const [addSpecDialogOpen, setAddSpecDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [linkDrawingDialogOpen, setLinkDrawingDialogOpen] = useState(false);
  
  // Import states
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const [specifications, setSpecifications] = useState([]);

  // Load specifications on component mount
  useEffect(() => {
    loadSpecifications();
  }, [selectedProject]);

  const loadSpecifications = async () => {
    try {
      setLoading(true);
      const params = selectedProject !== 'all' ? { projectId: selectedProject } : {};
      const data = await apiService.getMaterialSpecifications(params);
      
      // Format the data to match component expectations
      const formattedSpecs = data.map(spec => ({
        ...spec,
        unitCost: typeof spec.unitCost === 'number' ? `$${spec.unitCost.toFixed(2)}` : spec.unitCost,
        totalCost: typeof spec.totalCost === 'number' ? `$${spec.totalCost.toFixed(2)}` : spec.totalCost,
        quantity: spec.quantity?.toString() || '1',
        leadTime: spec.leadTime?.toString() || '',
        projectName: spec.projectName || projects.find(p => p.id === spec.projectId)?.name || ''
      }));
      
      setSpecifications(formattedSpecs);
      setError(null);
    } catch (err) {
      console.error('Error loading specifications:', err);
      setError('Failed to load specifications');
      setSpecifications([]);
    } finally {
      setLoading(false);
    }
  };

  const [newSpec, setNewSpec] = useState({
    itemId: '',
    description: '',
    category: '',
    material: '',
    finish: '',
    hardware: '',
    dimensions: '',
    quantity: '',
    unit: 'EA',
    unitCost: '',
    supplier: '',
    partNumber: '',
    leadTime: '',
    notes: '',
    roomLocation: '',
    installationPhase: '',
    projectId: ''
  });

  // Get unique categories
  const categories = ['all', ...new Set(specifications.map(spec => spec.category))];

  // Filter specifications
  const filteredSpecs = specifications.filter(spec => {
    const matchesSearch = spec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spec.itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spec.material.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'all' || spec.projectId === selectedProject;
    const matchesCategory = selectedCategory === 'all' || spec.category === selectedCategory;
    return matchesSearch && matchesProject && matchesCategory;
  });

  // Calculate totals
  const totalCost = filteredSpecs.reduce((sum, spec) => {
    const costStr = typeof spec.totalCost === 'string' ? spec.totalCost : String(spec.totalCost || '0');
    return sum + parseFloat(costStr.replace(/[$,]/g, '') || 0);
  }, 0);

  const handleMenuOpen = (event, spec) => {
    setAnchorEl(event.currentTarget);
    setSelectedSpec(spec);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSpec(null);
  };

  const handleAddSpec = async () => {
    try {
      const specData = {
        ...newSpec,
        quantity: parseInt(newSpec.quantity) || 1,
        unitCost: parseFloat(newSpec.unitCost.replace(/[$,]/g, '') || 0),
        projectId: newSpec.projectId || (selectedProject !== 'all' ? selectedProject : null),
        linkedDrawings: [],
        status: 'pending'
      };

      const createdSpec = await apiService.createMaterialSpecification(specData);
      
      // Format the response to match component expectations
      const formattedSpec = {
        ...createdSpec,
        unitCost: `$${createdSpec.unitCost.toFixed(2)}`,
        totalCost: `$${createdSpec.totalCost.toFixed(2)}`,
        quantity: createdSpec.quantity.toString(),
        leadTime: createdSpec.leadTime?.toString() || '',
        projectName: createdSpec.projectName || projects.find(p => p.id === createdSpec.projectId)?.name || ''
      };

      setSpecifications([formattedSpec, ...specifications]);
      setAddSpecDialogOpen(false);
      setNewSpec({
        itemId: '', description: '', category: '', material: '', finish: '',
        hardware: '', dimensions: '', quantity: '', unit: 'EA', unitCost: '',
        supplier: '', partNumber: '', leadTime: '', notes: '', roomLocation: '',
        installationPhase: '', projectId: ''
      });
    } catch (error) {
      console.error('Error creating specification:', error);
      alert('Failed to create specification. Please try again.');
    }
  };

  const handleExportTemplate = () => {
    const projectName = selectedProject !== 'all' 
      ? projects.find(p => p.id === selectedProject)?.name || 'Project'
      : 'All_Projects';
    excelSpecificationService.exportTemplate(projectName);
  };

  const handleImportFile = async () => {
    if (!importFile) return;

    setImporting(true);
    try {
      const results = await excelSpecificationService.parseSpecificationsFile(importFile);
      setImportResults(results);
      
      // Add imported specifications
      const newSpecs = results.specifications.map(spec => ({
        ...spec,
        projectId: selectedProject !== 'all' ? selectedProject : 'P001',
        projectName: projects.find(p => p.id === (selectedProject !== 'all' ? selectedProject : 'P001'))?.name || '',
        linkedDrawings: [],
        status: 'imported'
      }));
      
      setSpecifications([...newSpecs, ...specifications]);
      setImportDialogOpen(false);
      setImportFile(null);
    } catch (error) {
      console.error('Import failed:', error);
      setImportResults({ error: error.message });
    } finally {
      setImporting(false);
    }
  };

  const handleExportSpecs = () => {
    const specsToExport = selectedProject !== 'all' 
      ? specifications.filter(spec => spec.projectId === selectedProject)
      : specifications;
    
    const projectName = selectedProject !== 'all'
      ? projects.find(p => p.id === selectedProject)?.name || 'Project'
      : 'All_Projects';
      
    excelSpecificationService.exportSpecifications(specsToExport, projectName);
  };

  const handleGenerateCostReport = () => {
    const specsToReport = selectedProject !== 'all'
      ? specifications.filter(spec => spec.projectId === selectedProject)
      : specifications;
      
    const projectName = selectedProject !== 'all'
      ? projects.find(p => p.id === selectedProject)?.name || 'Project'
      : 'All_Projects';
      
    excelSpecificationService.generateCostSummary(specsToReport, projectName);
  };

  const renderListView = () => (
    <TableContainer component={Paper} elevation={1}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            <TableCell><strong>Item ID</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell><strong>Material</strong></TableCell>
            <TableCell><strong>Qty</strong></TableCell>
            <TableCell><strong>Unit Cost</strong></TableCell>
            <TableCell><strong>Total Cost</strong></TableCell>
            <TableCell><strong>Supplier</strong></TableCell>
            <TableCell><strong>Links</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSpecs.map((spec) => (
            <TableRow key={spec.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {spec.itemId}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{spec.description}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {spec.roomLocation}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={spec.category}
                  size="small"
                  variant="outlined"
                  sx={{ backgroundColor: '#e3f2fd' }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{spec.material}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {spec.finish}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {spec.quantity} {spec.unit}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{spec.unitCost}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {spec.totalCost}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{spec.supplier}</Typography>
              </TableCell>
              <TableCell>
                {spec.linkedDrawings && spec.linkedDrawings.length > 0 ? (
                  <Tooltip title={`${spec.linkedDrawings.length} linked drawing(s)`}>
                    <Chip 
                      icon={<LinkIcon />}
                      label={spec.linkedDrawings.length}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Tooltip>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No links
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <IconButton 
                  size="small" 
                  onClick={(e) => handleMenuOpen(e, spec)}
                >
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCategoryView = () => {
    const specsByCategory = {};
    filteredSpecs.forEach(spec => {
      const category = spec.category || 'Uncategorized';
      if (!specsByCategory[category]) {
        specsByCategory[category] = [];
      }
      specsByCategory[category].push(spec);
    });

    return (
      <Box>
        {Object.entries(specsByCategory).map(([category, specs]) => {
          const categoryTotal = specs.reduce((sum, spec) => {
            const costStr = typeof spec.totalCost === 'string' ? spec.totalCost : String(spec.totalCost || '0');
            return sum + parseFloat(costStr.replace(/[$,]/g, '') || 0);
          }, 0);

          return (
            <Accordion key={category} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mr: 2 }}>
                  <Typography variant="h6">{category}</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip label={`${specs.length} items`} size="small" />
                    <Chip 
                      label={`$${categoryTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      size="small"
                      color="primary"
                    />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {specs.map((spec) => (
                    <Grid item xs={12} md={6} lg={4} key={spec.id}>
                      <Card elevation={1}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h6" noWrap>
                              {spec.itemId}
                            </Typography>
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, spec)}>
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                          <Typography variant="body2" gutterBottom>
                            {spec.description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {spec.material} • {spec.finish}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="body2">
                              {spec.quantity} {spec.unit} × {spec.unitCost}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {spec.totalCost}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    );
  };

  return (
    <Box>
      {/* Header */}
      <EnhancedHeader
        title="Material Specifications"
        breadcrumbs={[
          { label: 'Material Specifications', href: '/specifications' }
        ]}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={() => setAddSpecDialogOpen(true)}
        addButtonText="Add Specification"
        addButtonIcon={<AddIcon />}
        teamMembers={teamMembers.slice(0, 5)}
        subtitle={`${filteredSpecs.length} items • Total: $${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
      />

      {/* Action Bar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Project</InputLabel>
          <Select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            label="Filter by Project"
          >
            <MenuItem value="all">All Projects</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Filter by Category"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          onClick={() => setImportDialogOpen(true)}
        >
          Import Excel
        </Button>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExportTemplate}
        >
          Download Template
        </Button>

        <Button
          variant="outlined"
          startIcon={<ExcelIcon />}
          onClick={handleExportSpecs}
        >
          Export Excel
        </Button>

        <Button
          variant="outlined"
          startIcon={<ReportIcon />}
          onClick={handleGenerateCostReport}
        >
          Cost Report
        </Button>
      </Box>

      {/* Enhanced Tab System */}
      <EnhancedTabSystem
        currentView={viewMode}
        onViewChange={setViewMode}
        title="Material Specifications"
        views={[
          { id: 'list', label: 'List View', icon: 'list' },
          { id: 'categories', label: 'By Category', icon: 'category' }
        ]}
      />

      {/* Content */}
      <Box sx={{ mt: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <LinearProgress sx={{ width: '50%' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button size="small" onClick={loadSpecifications} sx={{ ml: 2 }}>
              Retry
            </Button>
          </Alert>
        ) : filteredSpecs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No material specifications found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || selectedCategory !== 'all' || selectedProject !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Get started by adding your first specification'}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setAddSpecDialogOpen(true)}
            >
              Add Material Specification
            </Button>
          </Box>
        ) : (
          viewMode === 'list' ? renderListView() : renderCategoryView()
        )}
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          // TODO: Implement edit functionality
          handleMenuClose();
          alert('Edit functionality coming soon!');
        }}>
          <EditIcon sx={{ mr: 1 }} /> Edit Specification
        </MenuItem>
        <MenuItem onClick={() => {
          setLinkDrawingDialogOpen(true);
          handleMenuClose();
        }}>
          <LinkIcon sx={{ mr: 1 }} /> Link to Drawing
        </MenuItem>
        <MenuItem onClick={() => {
          // TODO: Implement inventory check
          handleMenuClose();
          alert('Inventory check functionality coming soon!');
        }}>
          <InventoryIcon sx={{ mr: 1 }} /> Check Inventory
        </MenuItem>
        <MenuItem onClick={async () => {
          if (selectedSpec && window.confirm(`Are you sure you want to delete ${selectedSpec.itemId}?`)) {
            try {
              await apiService.deleteMaterialSpecification(selectedSpec.id);
              setSpecifications(specifications.filter(spec => spec.id !== selectedSpec.id));
            } catch (error) {
              console.error('Error deleting specification:', error);
              alert('Failed to delete specification');
            }
          }
          handleMenuClose();
        }} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Add Specification Dialog */}
      <Dialog open={addSpecDialogOpen} onClose={() => setAddSpecDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Material Specification</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Item ID"
                value={newSpec.itemId}
                onChange={(e) => setNewSpec({...newSpec, itemId: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  value={newSpec.projectId}
                  onChange={(e) => setNewSpec({...newSpec, projectId: e.target.value})}
                  label="Project"
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newSpec.description}
                onChange={(e) => setNewSpec({...newSpec, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Category"
                value={newSpec.category}
                onChange={(e) => setNewSpec({...newSpec, category: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Material"
                value={newSpec.material}
                onChange={(e) => setNewSpec({...newSpec, material: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Finish"
                value={newSpec.finish}
                onChange={(e) => setNewSpec({...newSpec, finish: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Dimensions"
                value={newSpec.dimensions}
                onChange={(e) => setNewSpec({...newSpec, dimensions: e.target.value})}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={newSpec.quantity}
                onChange={(e) => setNewSpec({...newSpec, quantity: e.target.value})}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={newSpec.unit}
                  onChange={(e) => setNewSpec({...newSpec, unit: e.target.value})}
                  label="Unit"
                >
                  <MenuItem value="EA">Each</MenuItem>
                  <MenuItem value="LF">Linear Foot</MenuItem>
                  <MenuItem value="SF">Square Foot</MenuItem>
                  <MenuItem value="CF">Cubic Foot</MenuItem>
                  <MenuItem value="LB">Pound</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Unit Cost"
                value={newSpec.unitCost}
                onChange={(e) => setNewSpec({...newSpec, unitCost: e.target.value})}
                placeholder="$0.00"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hardware & Details"
                multiline
                rows={2}
                value={newSpec.hardware}
                onChange={(e) => setNewSpec({...newSpec, hardware: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddSpecDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddSpec} 
            variant="contained"
            disabled={!newSpec.itemId || !newSpec.description || !newSpec.category}
          >
            Add Specification
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Material Specifications</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Upload an Excel file with material specifications. Use our template for best results.
            </Alert>
            
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2, height: 56 }}
            >
              {importFile ? importFile.name : 'Select Excel File (.xlsx)'}
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={(e) => setImportFile(e.target.files[0])}
              />
            </Button>

            {importing && <LinearProgress sx={{ mb: 2 }} />}
            
            {importResults?.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {importResults.error}
              </Alert>
            )}
            
            {importResults && !importResults.error && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Successfully imported {importResults.specifications.length} specifications
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleImportFile} 
            variant="contained"
            disabled={!importFile || importing}
          >
            {importing ? 'Importing...' : 'Import'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaterialSpecificationsList;