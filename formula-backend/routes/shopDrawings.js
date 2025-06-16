const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/shop-drawings');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `drawing-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Initialize shop drawings data
let shopDrawings = [
  {
    id: 'SD001',
    fileName: 'Kitchen_Cabinets_Rev_C.pdf',
    originalFileName: 'Kitchen_Cabinets_Rev_C.pdf',
    projectId: 'P001',
    projectName: 'Downtown Office Renovation',
    drawingType: 'Kitchen Cabinets',
    room: 'Kitchen',
    version: 'Rev C',
    status: 'approved',
    uploadDate: '2025-06-15T10:00:00Z',
    uploadedBy: 'John Smith',
    uploadedById: 'USER001',
    approvedBy: 'Mike Johnson',
    approvedById: 'USER002',
    approvalDate: '2025-06-16T14:30:00Z',
    fileSize: 2457600, // bytes
    filePath: '/uploads/shop-drawings/kitchen-cabinets-rev-c.pdf',
    revisions: [
      { 
        version: 'Rev A', 
        date: '2025-06-10T09:00:00Z', 
        status: 'rejected', 
        notes: 'Dimensions incorrect',
        uploadedBy: 'John Smith',
        reviewedBy: 'Mike Johnson'
      },
      { 
        version: 'Rev B', 
        date: '2025-06-12T11:30:00Z', 
        status: 'pending', 
        notes: 'Under review',
        uploadedBy: 'John Smith'
      },
      { 
        version: 'Rev C', 
        date: '2025-06-15T10:00:00Z', 
        status: 'approved', 
        notes: 'Approved for production',
        uploadedBy: 'John Smith',
        approvedBy: 'Mike Johnson',
        approvalDate: '2025-06-16T14:30:00Z'
      }
    ],
    linkedSpecifications: ['SPEC001', 'SPEC002'],
    linkedTasks: ['TASK001'],
    tags: ['millwork', 'kitchen', 'cabinets'],
    notes: 'Final approved drawings for kitchen millwork installation'
  }
];

// GET /api/shop-drawings - Get all shop drawings
router.get('/', (req, res) => {
  try {
    const { projectId, status, limit, offset } = req.query;
    
    let filteredDrawings = [...shopDrawings];
    
    // Filter by project
    if (projectId) {
      filteredDrawings = filteredDrawings.filter(drawing => drawing.projectId === projectId);
    }
    
    // Filter by status
    if (status) {
      filteredDrawings = filteredDrawings.filter(drawing => drawing.status === status);
    }
    
    // Apply pagination
    const startIndex = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || 50;
    const paginatedDrawings = filteredDrawings.slice(startIndex, startIndex + limitNum);
    
    res.json({
      success: true,
      data: paginatedDrawings,
      pagination: {
        total: filteredDrawings.length,
        offset: startIndex,
        limit: limitNum,
        hasMore: startIndex + limitNum < filteredDrawings.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop drawings',
      error: error.message
    });
  }
});

// GET /api/shop-drawings/:id - Get single shop drawing
router.get('/:id', (req, res) => {
  try {
    const drawing = shopDrawings.find(d => d.id === req.params.id);
    
    if (!drawing) {
      return res.status(404).json({
        success: false,
        message: 'Shop drawing not found'
      });
    }
    
    res.json({
      success: true,
      data: drawing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop drawing',
      error: error.message
    });
  }
});

// POST /api/shop-drawings/upload - Upload new shop drawing
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const { projectId, drawingType, room, notes } = req.body;
    
    if (!projectId || !drawingType) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and drawing type are required'
      });
    }
    
    // Generate new drawing ID
    const newId = `SD${String(shopDrawings.length + 1).padStart(3, '0')}`;
    
    const newDrawing = {
      id: newId,
      fileName: req.file.filename,
      originalFileName: req.file.originalname,
      projectId,
      projectName: getProjectName(projectId), // Helper function to get project name
      drawingType,
      room: room || '',
      version: 'Rev A',
      status: 'pending',
      uploadDate: new Date().toISOString(),
      uploadedBy: 'Current User', // This should come from authentication
      uploadedById: 'USER001', // This should come from authentication
      fileSize: req.file.size,
      filePath: `/uploads/shop-drawings/${req.file.filename}`,
      revisions: [
        {
          version: 'Rev A',
          date: new Date().toISOString(),
          status: 'pending',
          notes: notes || 'Initial submission',
          uploadedBy: 'Current User'
        }
      ],
      linkedSpecifications: [],
      linkedTasks: [],
      tags: [],
      notes: notes || ''
    };
    
    shopDrawings.unshift(newDrawing);
    
    res.status(201).json({
      success: true,
      message: 'Shop drawing uploaded successfully',
      data: newDrawing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload shop drawing',
      error: error.message
    });
  }
});

// PUT /api/shop-drawings/:id - Update shop drawing
router.put('/:id', (req, res) => {
  try {
    const drawingIndex = shopDrawings.findIndex(d => d.id === req.params.id);
    
    if (drawingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Shop drawing not found'
      });
    }
    
    const allowedUpdates = ['drawingType', 'room', 'notes', 'tags', 'linkedSpecifications', 'linkedTasks'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    shopDrawings[drawingIndex] = {
      ...shopDrawings[drawingIndex],
      ...updates,
      updatedDate: new Date().toISOString(),
      updatedBy: 'Current User' // This should come from authentication
    };
    
    res.json({
      success: true,
      message: 'Shop drawing updated successfully',
      data: shopDrawings[drawingIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update shop drawing',
      error: error.message
    });
  }
});

// PATCH /api/shop-drawings/:id/status - Update drawing status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, notes } = req.body;
    const drawingIndex = shopDrawings.findIndex(d => d.id === req.params.id);
    
    if (drawingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Shop drawing not found'
      });
    }
    
    const allowedStatuses = ['pending', 'approved', 'revision_required', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const drawing = shopDrawings[drawingIndex];
    const currentRevision = drawing.revisions[drawing.revisions.length - 1];
    
    // Update current revision status
    currentRevision.status = status;
    currentRevision.reviewDate = new Date().toISOString();
    currentRevision.reviewedBy = 'Current User'; // This should come from authentication
    if (notes) currentRevision.notes = notes;
    
    // Update drawing status
    drawing.status = status;
    
    if (status === 'approved') {
      drawing.approvedBy = 'Current User';
      drawing.approvedById = 'USER001';
      drawing.approvalDate = new Date().toISOString();
    }
    
    res.json({
      success: true,
      message: 'Drawing status updated successfully',
      data: drawing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update drawing status',
      error: error.message
    });
  }
});

// POST /api/shop-drawings/:id/revisions - Add new revision
router.post('/:id/revisions', upload.single('file'), (req, res) => {
  try {
    const drawingIndex = shopDrawings.findIndex(d => d.id === req.params.id);
    
    if (drawingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Shop drawing not found'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded for revision'
      });
    }
    
    const { notes } = req.body;
    const drawing = shopDrawings[drawingIndex];
    
    // Generate next version
    const lastVersion = drawing.revisions[drawing.revisions.length - 1].version;
    const nextLetter = String.fromCharCode(lastVersion.charCodeAt(lastVersion.length - 1) + 1);
    const nextVersion = `Rev ${nextLetter}`;
    
    const newRevision = {
      version: nextVersion,
      date: new Date().toISOString(),
      status: 'pending',
      notes: notes || `Revision ${nextLetter}`,
      uploadedBy: 'Current User',
      filePath: `/uploads/shop-drawings/${req.file.filename}`
    };
    
    drawing.revisions.push(newRevision);
    drawing.version = nextVersion;
    drawing.status = 'pending';
    drawing.fileName = req.file.filename;
    drawing.fileSize = req.file.size;
    drawing.filePath = `/uploads/shop-drawings/${req.file.filename}`;
    
    res.status(201).json({
      success: true,
      message: 'Revision added successfully',
      data: drawing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add revision',
      error: error.message
    });
  }
});

// DELETE /api/shop-drawings/:id - Delete shop drawing
router.delete('/:id', (req, res) => {
  try {
    const drawingIndex = shopDrawings.findIndex(d => d.id === req.params.id);
    
    if (drawingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Shop drawing not found'
      });
    }
    
    const drawing = shopDrawings[drawingIndex];
    
    // Delete file from filesystem
    if (drawing.filePath && fs.existsSync(path.join(__dirname, '..', drawing.filePath))) {
      fs.unlinkSync(path.join(__dirname, '..', drawing.filePath));
    }
    
    // Delete all revision files
    drawing.revisions.forEach(revision => {
      if (revision.filePath && fs.existsSync(path.join(__dirname, '..', revision.filePath))) {
        fs.unlinkSync(path.join(__dirname, '..', revision.filePath));
      }
    });
    
    shopDrawings.splice(drawingIndex, 1);
    
    res.json({
      success: true,
      message: 'Shop drawing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete shop drawing',
      error: error.message
    });
  }
});

// GET /api/shop-drawings/:id/file/:version? - Serve drawing file
router.get('/:id/file/:version?', (req, res) => {
  try {
    const drawing = shopDrawings.find(d => d.id === req.params.id);
    
    if (!drawing) {
      return res.status(404).json({
        success: false,
        message: 'Shop drawing not found'
      });
    }
    
    let filePath;
    if (req.params.version && req.params.version !== 'latest') {
      const revision = drawing.revisions.find(r => r.version === req.params.version);
      if (!revision || !revision.filePath) {
        return res.status(404).json({
          success: false,
          message: 'Revision file not found'
        });
      }
      filePath = revision.filePath;
    } else {
      filePath = drawing.filePath;
    }
    
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }
    
    res.sendFile(fullPath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to serve file',
      error: error.message
    });
  }
});

// Helper function to get project name by ID
function getProjectName(projectId) {
  // This should query your projects database
  const projectNames = {
    'P001': 'Downtown Office Renovation',
    'P002': 'Medical Office Fit-out',
    'P003': 'Retail Store Build-out'
  };
  return projectNames[projectId] || 'Unknown Project';
}

// GET /api/shop-drawings/project/:projectId - Get drawings by project
router.get('/project/:projectId', (req, res) => {
  try {
    const projectDrawings = shopDrawings.filter(d => d.projectId === req.params.projectId);
    
    res.json({
      success: true,
      data: projectDrawings,
      count: projectDrawings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project drawings',
      error: error.message
    });
  }
});

// GET /api/shop-drawings/stats - Get drawing statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      total: shopDrawings.length,
      byStatus: {
        pending: shopDrawings.filter(d => d.status === 'pending').length,
        approved: shopDrawings.filter(d => d.status === 'approved').length,
        revision_required: shopDrawings.filter(d => d.status === 'revision_required').length,
        rejected: shopDrawings.filter(d => d.status === 'rejected').length
      },
      byProject: {},
      totalRevisions: shopDrawings.reduce((sum, drawing) => sum + drawing.revisions.length, 0),
      averageRevisionsPerDrawing: shopDrawings.length > 0 
        ? (shopDrawings.reduce((sum, drawing) => sum + drawing.revisions.length, 0) / shopDrawings.length).toFixed(1)
        : 0
    };
    
    // Calculate by project
    shopDrawings.forEach(drawing => {
      const projectName = drawing.projectName;
      if (!stats.byProject[projectName]) {
        stats.byProject[projectName] = 0;
      }
      stats.byProject[projectName]++;
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get drawing statistics',
      error: error.message
    });
  }
});

module.exports = router;