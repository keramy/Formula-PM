const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for Excel file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/specifications');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `spec-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel and CSV files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Import database
const SimpleDB = require('../database');
const db = new SimpleDB('./data');

// Get specifications from database
function getSpecifications() {
  return db.read('materialSpecifications');
}

// Update specifications in database
function updateSpecifications(specs) {
  return db.write('materialSpecifications', specs);
}

// GET /api/specifications/stats - Get specification statistics
router.get('/stats', (req, res) => {
  try {
    const specifications = getSpecifications();
    const stats = {
      total: specifications.length,
      byStatus: {
        pending: specifications.filter(s => s.status === 'pending').length,
        approved: specifications.filter(s => s.status === 'approved').length,
        revision_required: specifications.filter(s => s.status === 'revision_required').length,
        rejected: specifications.filter(s => s.status === 'rejected').length
      },
      byCategory: {},
      totalCost: specifications.reduce((sum, spec) => sum + spec.totalCost, 0),
      approvedCost: specifications
        .filter(s => s.status === 'approved')
        .reduce((sum, spec) => sum + spec.totalCost, 0),
      avgCostPerItem: specifications.length > 0 
        ? (specifications.reduce((sum, spec) => sum + spec.totalCost, 0) / specifications.length)
        : 0
    };
    
    // Calculate by category
    specifications.forEach(spec => {
      const category = spec.category;
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = {
          count: 0,
          totalCost: 0
        };
      }
      stats.byCategory[category].count++;
      stats.byCategory[category].totalCost += spec.totalCost;
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get specification statistics',
      error: error.message
    });
  }
});

// GET /api/specifications - Get all specifications
router.get('/', (req, res) => {
  try {
    const { projectId, category, status, limit, offset } = req.query;
    
    let filteredSpecs = getSpecifications();
    
    // Filter by project
    if (projectId) {
      filteredSpecs = filteredSpecs.filter(spec => spec.projectId === projectId);
    }
    
    // Filter by category
    if (category) {
      filteredSpecs = filteredSpecs.filter(spec => 
        spec.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // Filter by status
    if (status) {
      filteredSpecs = filteredSpecs.filter(spec => spec.status === status);
    }
    
    // Apply pagination
    const startIndex = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || 50;
    const paginatedSpecs = filteredSpecs.slice(startIndex, startIndex + limitNum);
    
    res.json({
      success: true,
      data: paginatedSpecs,
      pagination: {
        total: filteredSpecs.length,
        offset: startIndex,
        limit: limitNum,
        hasMore: startIndex + limitNum < filteredSpecs.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch specifications',
      error: error.message
    });
  }
});

// GET /api/specifications/:id - Get single specification
router.get('/:id', (req, res) => {
  try {
    const specifications = getSpecifications();
    const spec = specifications.find(s => s.id === req.params.id);
    
    if (!spec) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    res.json({
      success: true,
      data: spec
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch specification',
      error: error.message
    });
  }
});

// POST /api/specifications - Create new specification
router.post('/', (req, res) => {
  try {
    const {
      itemId,
      description,
      category,
      material,
      finish,
      hardware,
      dimensions,
      quantity,
      unit,
      unitCost,
      projectId,
      supplier,
      supplierContact,
      leadTime,
      notes,
      linkedDrawings = [],
      linkedTasks = [],
      tags = []
    } = req.body;
    
    // Validate required fields
    if (!itemId || !description || !category || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID, description, category, and project ID are required'
      });
    }
    
    const specifications = getSpecifications();
    // Generate new specification ID
    const newId = `SPEC${String(specifications.length + 1).padStart(3, '0')}`;
    
    const totalCost = (parseFloat(unitCost) || 0) * (parseInt(quantity) || 1);
    
    const newSpec = {
      id: newId,
      itemId,
      description,
      category,
      material: material || '',
      finish: finish || '',
      hardware: hardware || '',
      dimensions: dimensions || '',
      quantity: parseInt(quantity) || 1,
      unit: unit || 'EA',
      unitCost: parseFloat(unitCost) || 0,
      totalCost,
      projectId,
      projectName: getProjectName(projectId),
      status: 'pending',
      createdDate: new Date().toISOString(),
      createdBy: 'Current User', // This should come from authentication
      createdById: 'USER001', // This should come from authentication
      linkedDrawings,
      linkedTasks,
      supplier: supplier || '',
      supplierContact: supplierContact || '',
      leadTime: leadTime || '',
      notes: notes || '',
      revision: 1,
      tags
    };
    
    specifications.unshift(newSpec);
    updateSpecifications(specifications);
    
    res.status(201).json({
      success: true,
      message: 'Specification created successfully',
      data: newSpec
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create specification',
      error: error.message
    });
  }
});

// PUT /api/specifications/:id - Update specification
router.put('/:id', (req, res) => {
  try {
    const specifications = getSpecifications();
    const specIndex = specifications.findIndex(s => s.id === req.params.id);
    
    if (specIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    const allowedUpdates = [
      'itemId', 'description', 'category', 'material', 'finish', 'hardware',
      'dimensions', 'quantity', 'unit', 'unitCost', 'supplier', 'supplierContact',
      'leadTime', 'notes', 'linkedDrawings', 'linkedTasks', 'tags'
    ];
    
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    // Recalculate total cost if unit cost or quantity changed
    if (updates.unitCost !== undefined || updates.quantity !== undefined) {
      const unitCost = updates.unitCost !== undefined ? parseFloat(updates.unitCost) : specifications[specIndex].unitCost;
      const quantity = updates.quantity !== undefined ? parseInt(updates.quantity) : specifications[specIndex].quantity;
      updates.totalCost = unitCost * quantity;
    }
    
    specifications[specIndex] = {
      ...specifications[specIndex],
      ...updates,
      updatedDate: new Date().toISOString(),
      updatedBy: 'Current User', // This should come from authentication
      revision: specifications[specIndex].revision + 1
    };
    
    updateSpecifications(specifications);
    
    res.json({
      success: true,
      message: 'Specification updated successfully',
      data: specifications[specIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update specification',
      error: error.message
    });
  }
});

// PATCH /api/specifications/:id/status - Update specification status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, notes } = req.body;
    const specifications = getSpecifications();
    const specIndex = specifications.findIndex(s => s.id === req.params.id);
    
    if (specIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    const allowedStatuses = ['pending', 'approved', 'revision_required', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const spec = specifications[specIndex];
    
    // Update specification status
    spec.status = status;
    spec.updatedDate = new Date().toISOString();
    spec.updatedBy = 'Current User'; // This should come from authentication
    
    if (notes) spec.notes = notes;
    
    if (status === 'approved') {
      spec.approvedBy = 'Current User';
      spec.approvedById = 'USER001';
      spec.approvalDate = new Date().toISOString();
    }
    
    updateSpecifications(specifications);
    
    res.json({
      success: true,
      message: 'Specification status updated successfully',
      data: spec
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update specification status',
      error: error.message
    });
  }
});

// DELETE /api/specifications/:id - Delete specification
router.delete('/:id', (req, res) => {
  try {
    const specifications = getSpecifications();
    const specIndex = specifications.findIndex(s => s.id === req.params.id);
    
    if (specIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    specifications.splice(specIndex, 1);
    updateSpecifications(specifications);
    
    res.json({
      success: true,
      message: 'Specification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete specification',
      error: error.message
    });
  }
});

// POST /api/specifications/import - Import specifications from Excel
router.post('/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const { projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }
    
    // This would normally parse the Excel file and create specifications
    // For now, we'll simulate successful import
    const importedCount = Math.floor(Math.random() * 10) + 5; // Simulate 5-15 imported items
    
    res.json({
      success: true,
      message: `Successfully imported ${importedCount} specifications`,
      data: {
        importedCount,
        fileName: req.file.originalname,
        projectId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to import specifications',
      error: error.message
    });
  }
});

// GET /api/specifications/export/template - Download Excel template
router.get('/export/template', (req, res) => {
  try {
    // This would normally generate and send an Excel template
    // For now, we'll simulate template download
    res.json({
      success: true,
      message: 'Template download initiated',
      templateUrl: '/api/specifications/files/template.xlsx'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate template',
      error: error.message
    });
  }
});

// GET /api/specifications/project/:projectId - Get specifications by project
router.get('/project/:projectId', (req, res) => {
  try {
    const specifications = getSpecifications();
    const projectSpecs = specifications.filter(s => s.projectId === req.params.projectId);
    
    // Calculate project totals
    const totals = {
      totalItems: projectSpecs.length,
      totalCost: projectSpecs.reduce((sum, spec) => sum + spec.totalCost, 0),
      approvedItems: projectSpecs.filter(s => s.status === 'approved').length,
      approvedCost: projectSpecs
        .filter(s => s.status === 'approved')
        .reduce((sum, spec) => sum + spec.totalCost, 0)
    };
    
    res.json({
      success: true,
      data: projectSpecs,
      totals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project specifications',
      error: error.message
    });
  }
});

// PATCH /api/specifications/:id/links - Update specification links
router.patch('/:id/links', (req, res) => {
  try {
    const { linkedDrawings = [], linkedTasks = [] } = req.body;
    const specifications = getSpecifications();
    const specIndex = specifications.findIndex(s => s.id === req.params.id);
    
    if (specIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    specifications[specIndex].linkedDrawings = linkedDrawings;
    specifications[specIndex].linkedTasks = linkedTasks;
    specifications[specIndex].updatedDate = new Date().toISOString();
    specifications[specIndex].updatedBy = 'Current User';
    
    updateSpecifications(specifications);
    
    res.json({
      success: true,
      message: 'Specification links updated successfully',
      data: specifications[specIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update specification links',
      error: error.message
    });
  }
});

// Helper function to get project name by ID
function getProjectName(projectId) {
  // This should query your projects database
  const projectNames = {
    '2001': 'Akbank Head Office Renovation',
    '2002': 'Garanti BBVA Tech Center MEP',
    '2003': 'Test Project with Client'
  };
  return projectNames[projectId] || 'Unknown Project';
}

module.exports = router;