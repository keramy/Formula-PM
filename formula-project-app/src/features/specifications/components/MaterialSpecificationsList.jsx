import React, { useState, useCallback } from 'react';
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

const MaterialSpecificationsList = ({ 
  projects = [],
  teamMembers = [],
  shopDrawings = []
}) => {
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

  // Mock specifications data - this will come from API later
  const [specifications, setSpecifications] = useState([
    {
      id: 'SPEC001',
      itemId: 'SPEC001',
      description: 'Upper Cabinet - 30" Wide',
      category: 'Kitchen Cabinets',
      material: 'Maple Hardwood',
      finish: 'Natural Stain',
      hardware: 'Soft-close hinges, adjustable shelves',
      dimensions: '30" x 12" x 36"',
      quantity: '4',
      unit: 'EA',
      unitCost: '$450.00',
      totalCost: '$1,800.00',
      supplier: 'Cabinet Works Inc',
      partNumber: 'UC-30-NAT',
      leadTime: '14',
      notes: 'Pre-finished, ready to install',
      drawingReference: 'Kitchen_Cabinets_Rev_C.pdf',
      roomLocation: 'Kitchen',
      installationPhase: 'Phase 2',
      projectId: 'P001',
      projectName: 'Downtown Office Renovation',
      linkedDrawings: ['SD001'],
      status: 'approved'
    },
    {
      id: 'SPEC002',
      itemId: 'SPEC002', 
      description: 'Base Cabinet with Drawers',
      category: 'Kitchen Cabinets',
      material: 'Maple Hardwood',
      finish: 'Natural Stain',
      hardware: 'Soft-close drawers, full extension slides',
      dimensions: '24" x 24" x 34.5"',
      quantity: '6',
      unit: 'EA',
      unitCost: '$650.00',
      totalCost: '$3,900.00',
      supplier: 'Cabinet Works Inc',
      partNumber: 'BC-24-3DR',
      leadTime: '14',
      notes: 'Includes toe kick and crown molding',
      drawingReference: 'Kitchen_Cabinets_Rev_C.pdf',
      roomLocation: 'Kitchen',
      installationPhase: 'Phase 2',
      projectId: 'P001',
      projectName: 'Downtown Office Renovation',
      linkedDrawings: ['SD001'],
      status: 'approved'
    },
    {
      id: 'SPEC003',
      itemId: 'SPEC003',
      description: 'Reception Desk - Custom',
      category: 'Reception Furniture',
      material: 'White Oak Veneer',
      finish: 'Clear Lacquer',
      hardware: 'Wire management, LED strip lighting',
      dimensions: '96" x 30" x 42"',
      quantity: '1',
      unit: 'EA',
      unitCost: '$2,800.00',
      totalCost: '$2,800.00',
      supplier: 'Custom Millwork Co',
      partNumber: 'RD-96-WO',
      leadTime: '21',
      notes: 'Curved front edge, integrated cable management',
      drawingReference: 'Reception_Desk_Rev_B.pdf',
      roomLocation: 'Reception',
      installationPhase: 'Phase 1',
      projectId: 'P002',
      projectName: 'Medical Office Fit-out',
      linkedDrawings: ['SD003'],
      status: 'pending'
    }
  ]);

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
    return sum + parseFloat(spec.totalCost.replace(/[$,]/g, '') || 0);
  }, 0);

  const handleMenuOpen = (event, spec) => {
    setAnchorEl(event.currentTarget);
    setSelectedSpec(spec);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSpec(null);
  };

  const handleAddSpec = () => {
    const spec = {
      ...newSpec,
      id: `SPEC${String(specifications.length + 1).padStart(3, '0')}`,
      totalCost: `$${(parseFloat(newSpec.unitCost.replace(/[$,]/g, '') || 0) * parseFloat(newSpec.quantity || 0)).toFixed(2)}`,
      projectName: projects.find(p => p.id === newSpec.projectId)?.name || '',
      linkedDrawings: [],
      status: 'pending'
    };

    setSpecifications([spec, ...specifications]);
    setAddSpecDialogOpen(false);
    setNewSpec({
      itemId: '', description: '', category: '', material: '', finish: '',
      hardware: '', dimensions: '', quantity: '', unit: 'EA', unitCost: '',
      supplier: '', partNumber: '', leadTime: '', notes: '', roomLocation: '',
      installationPhase: '', projectId: ''
    });
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
          const categoryTotal = specs.reduce((sum, spec) => 
            sum + parseFloat(spec.totalCost.replace(/[$,]/g, '') || 0), 0
          );

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
        {viewMode === 'list' ? renderListView() : renderCategoryView()}
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1 }} /> Edit Specification
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <LinkIcon sx={{ mr: 1 }} /> Link to Drawing
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <InventoryIcon sx={{ mr: 1 }} /> Check Inventory
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
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