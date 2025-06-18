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

// Import database
const SimpleDB = require('../database');
const db = new SimpleDB('./data');

// Get shop drawings from database
function getShopDrawings() {
  return db.read('shopDrawings');
}

// Update shop drawings in database
function updateShopDrawings(drawings) {
  return db.write('shopDrawings', drawings);
}

// Data will be loaded inside each route handler to avoid startup issues

// GET /api/shop-drawings - Get all shop drawings
router.get('/', (req, res) => {
  try {
    const { projectId, status, limit, offset } = req.query;
    
    let filteredDrawings = getShopDrawings();
    
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
    const drawings = getShopDrawings();
    const drawing = drawings.find(d => d.id === req.params.id);
    
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
    const drawings = getShopDrawings();
    const newId = `SD${String(drawings.length + 1).padStart(3, '0')}`;
    
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
    
    drawings.unshift(newDrawing);
    updateShopDrawings(drawings);
    
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
    const drawings = getShopDrawings();
    const drawingIndex = drawings.findIndex(d => d.id === req.params.id);
    
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
    
    drawings[drawingIndex] = {
      ...drawings[drawingIndex],
      ...updates,
      updatedDate: new Date().toISOString(),
      updatedBy: 'Current User' // This should come from authentication
    };
    
    updateShopDrawings(drawings);
    
    res.json({
      success: true,
      message: 'Shop drawing updated successfully',
      data: drawings[drawingIndex]
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
    const drawings = getShopDrawings();
    const drawingIndex = drawings.findIndex(d => d.id === req.params.id);
    
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
    
    const drawing = drawings[drawingIndex];
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
    
    updateShopDrawings(drawings);
    
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
    const drawings = getShopDrawings();
    const drawingIndex = drawings.findIndex(d => d.id === req.params.id);
    
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
    const drawing = drawings[drawingIndex];
    
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
    
    updateShopDrawings(drawings);
    
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
    const drawings = getShopDrawings();
    const drawingIndex = drawings.findIndex(d => d.id === req.params.id);
    
    if (drawingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Shop drawing not found'
      });
    }
    
    const drawing = drawings[drawingIndex];
    
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
    
    drawings.splice(drawingIndex, 1);
    updateShopDrawings(drawings);
    
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
    const drawings = getShopDrawings();
    const drawing = drawings.find(d => d.id === req.params.id);
    
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


module.exports = router;