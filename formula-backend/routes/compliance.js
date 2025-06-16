const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for compliance document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/compliance');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `compliance-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed. Please upload PDF, images, or documents.'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Initialize compliance documents data
let complianceDocuments = [
  {
    id: 'COMP001',
    name: 'Building Permit',
    type: 'permit',
    category: 'Building Permits',
    status: 'approved',
    priority: 'high',
    projectId: 'P001',
    projectName: 'Downtown Office Renovation',
    issuingAuthority: 'City Building Department',
    permitNumber: 'BP-2025-0542',
    applicationDate: '2025-05-01T09:00:00Z',
    issueDate: '2025-05-15T14:30:00Z',
    expiryDate: '2026-05-15T23:59:59Z',
    description: 'General building permit for office renovation',
    requirements: [
      'Structural drawings approved by engineer',
      'Fire safety plan submitted',
      'Electrical plans reviewed'
    ],
    documents: [
      {
        id: 'DOC001',
        name: 'Building_Permit_BP-2025-0542.pdf',
        type: 'permit_document',
        uploadDate: '2025-05-15T14:30:00Z',
        filePath: '/uploads/compliance/building-permit-001.pdf'
      }
    ],
    inspections: [
      {
        id: 'INS001',
        type: 'foundation',
        status: 'completed',
        inspector: 'John Mitchell',
        scheduledDate: '2025-05-20T10:00:00Z',
        completedDate: '2025-05-20T11:30:00Z',
        result: 'passed',
        notes: 'Foundation meets code requirements'
      }
    ],
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sarah.johnson@citybuilding.gov',
    contactPhone: '(555) 123-4567',
    notes: 'Permit approved for 12-month construction period',
    createdDate: '2025-05-01T09:00:00Z',
    createdBy: 'Mike Johnson',
    updatedDate: '2025-05-15T14:30:00Z',
    tags: ['permit', 'building', 'renovation']
  },
  {
    id: 'COMP002',
    name: 'Fire Safety Compliance',
    type: 'permit',
    category: 'Fire Safety',
    status: 'pending',
    priority: 'high',
    projectId: 'P001',
    projectName: 'Downtown Office Renovation',
    issuingAuthority: 'Fire Department',
    applicationNumber: 'FS-2025-0123',
    applicationDate: '2025-06-01T09:00:00Z',
    submitDate: '2025-06-10T16:00:00Z',
    description: 'Fire safety compliance for office space renovation',
    requirements: [
      'Fire escape plan submitted',
      'Sprinkler system design approved',
      'Fire-rated materials specification',
      'Emergency lighting plan'
    ],
    documents: [
      {
        id: 'DOC002',
        name: 'Fire_Safety_Application_FS-2025-0123.pdf',
        type: 'application',
        uploadDate: '2025-06-10T16:00:00Z',
        filePath: '/uploads/compliance/fire-safety-app-002.pdf'
      },
      {
        id: 'DOC003',
        name: 'Emergency_Exit_Plan.pdf',
        type: 'plan',
        uploadDate: '2025-06-10T16:15:00Z',
        filePath: '/uploads/compliance/emergency-exit-plan-003.pdf'
      }
    ],
    inspections: [],
    contactPerson: 'Captain Robert Davis',
    contactEmail: 'r.davis@cityfire.gov',
    contactPhone: '(555) 789-0123',
    notes: 'Application submitted, waiting for review',
    createdDate: '2025-06-01T09:00:00Z',
    createdBy: 'Mike Johnson',
    updatedDate: '2025-06-10T16:00:00Z',
    tags: ['permit', 'fire', 'safety']
  },
  {
    id: 'COMP003',
    name: 'Framing Inspection',
    type: 'inspection',
    category: 'Building Inspections',
    status: 'completed',
    priority: 'medium',
    projectId: 'P001',
    projectName: 'Downtown Office Renovation',
    inspector: 'John Mitchell',
    inspectionDate: '2025-05-20T10:00:00Z',
    completedDate: '2025-05-20T11:30:00Z',
    result: 'passed',
    description: 'Structural framing inspection for renovation work',
    requirements: [
      'All framing members properly sized',
      'Connections meet code requirements',
      'Load-bearing modifications approved'
    ],
    documents: [
      {
        id: 'DOC004',
        name: 'Framing_Inspection_Report.pdf',
        type: 'inspection_report',
        uploadDate: '2025-05-20T12:00:00Z',
        filePath: '/uploads/compliance/framing-inspection-004.pdf'
      }
    ],
    findings: [
      {
        item: 'Beam connections',
        status: 'approved',
        notes: 'All connections properly bolted and welded'
      },
      {
        item: 'Wall framing',
        status: 'approved', 
        notes: 'Spacing and sizing meet code'
      }
    ],
    contactPerson: 'John Mitchell',
    contactEmail: 'j.mitchell@cityinspections.gov',
    contactPhone: '(555) 456-7890',
    notes: 'Inspection passed without issues',
    createdDate: '2025-05-18T09:00:00Z',
    createdBy: 'Mike Johnson',
    updatedDate: '2025-05-20T12:00:00Z',
    tags: ['inspection', 'framing', 'structural']
  },
  {
    id: 'COMP004',
    name: 'Electrical Permit',
    type: 'permit',
    category: 'Electrical',
    status: 'in_review',
    priority: 'medium',
    projectId: 'P002',
    projectName: 'Medical Office Fit-out',
    issuingAuthority: 'Electrical Safety Authority',
    applicationNumber: 'EP-2025-0089',
    applicationDate: '2025-06-05T09:00:00Z',
    submitDate: '2025-06-12T14:00:00Z',
    description: 'Electrical permit for medical office renovation',
    requirements: [
      'Electrical load calculations',
      'Panel schedule and layout',
      'Emergency power systems',
      'Medical equipment power requirements'
    ],
    documents: [
      {
        id: 'DOC005',
        name: 'Electrical_Plans_EP-2025-0089.pdf',
        type: 'plans',
        uploadDate: '2025-06-12T14:00:00Z',
        filePath: '/uploads/compliance/electrical-plans-005.pdf'
      }
    ],
    inspections: [],
    contactPerson: 'Maria Rodriguez',
    contactEmail: 'm.rodriguez@electricalsafety.gov',
    contactPhone: '(555) 234-5678',
    notes: 'Plans under review, expect response in 5-7 business days',
    createdDate: '2025-06-05T09:00:00Z',
    createdBy: 'Sarah Wilson',
    updatedDate: '2025-06-12T14:00:00Z',
    tags: ['permit', 'electrical', 'medical']
  }
];

// GET /api/compliance/stats - Get compliance statistics  
router.get('/stats', (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    const stats = {
      total: complianceDocuments.length,
      byStatus: {
        pending: complianceDocuments.filter(d => d.status === 'pending').length,
        in_review: complianceDocuments.filter(d => d.status === 'in_review').length,
        approved: complianceDocuments.filter(d => d.status === 'approved').length,
        completed: complianceDocuments.filter(d => d.status === 'completed').length,
        rejected: complianceDocuments.filter(d => d.status === 'rejected').length,
        expired: complianceDocuments.filter(d => d.status === 'expired').length
      },
      byType: {
        permit: complianceDocuments.filter(d => d.type === 'permit').length,
        inspection: complianceDocuments.filter(d => d.type === 'inspection').length,
        certificate: complianceDocuments.filter(d => d.type === 'certificate').length
      },
      byPriority: {
        high: complianceDocuments.filter(d => d.priority === 'high').length,
        medium: complianceDocuments.filter(d => d.priority === 'medium').length,
        low: complianceDocuments.filter(d => d.priority === 'low').length
      },
      expiringSoon: complianceDocuments.filter(d => 
        d.expiryDate && new Date(d.expiryDate) <= thirtyDaysFromNow && new Date(d.expiryDate) > now
      ).length,
      totalInspections: complianceDocuments.reduce((sum, doc) => sum + doc.inspections.length, 0),
      upcomingInspections: complianceDocuments.reduce((count, doc) => 
        count + doc.inspections.filter(i => i.status === 'scheduled').length, 0
      )
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get compliance statistics',
      error: error.message
    });
  }
});

// GET /api/compliance - Get all compliance documents
router.get('/', (req, res) => {
  try {
    const { projectId, type, status, category, limit, offset } = req.query;
    
    let filteredDocs = [...complianceDocuments];
    
    // Filter by project
    if (projectId) {
      filteredDocs = filteredDocs.filter(doc => doc.projectId === projectId);
    }
    
    // Filter by type
    if (type) {
      filteredDocs = filteredDocs.filter(doc => doc.type === type);
    }
    
    // Filter by status
    if (status) {
      filteredDocs = filteredDocs.filter(doc => doc.status === status);
    }
    
    // Filter by category
    if (category) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // Apply pagination
    const startIndex = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || 50;
    const paginatedDocs = filteredDocs.slice(startIndex, startIndex + limitNum);
    
    res.json({
      success: true,
      data: paginatedDocs,
      pagination: {
        total: filteredDocs.length,
        offset: startIndex,
        limit: limitNum,
        hasMore: startIndex + limitNum < filteredDocs.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance documents',
      error: error.message
    });
  }
});

// GET /api/compliance/:id - Get single compliance document
router.get('/:id', (req, res) => {
  try {
    const doc = complianceDocuments.find(d => d.id === req.params.id);
    
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Compliance document not found'
      });
    }
    
    res.json({
      success: true,
      data: doc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance document',
      error: error.message
    });
  }
});

// POST /api/compliance - Create new compliance document
router.post('/', (req, res) => {
  try {
    const {
      name,
      type,
      category,
      projectId,
      issuingAuthority,
      permitNumber,
      applicationNumber,
      description,
      requirements = [],
      priority = 'medium',
      contactPerson,
      contactEmail,
      contactPhone,
      notes,
      tags = []
    } = req.body;
    
    // Validate required fields
    if (!name || !type || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Name, type, and project ID are required'
      });
    }
    
    // Generate new compliance document ID
    const newId = `COMP${String(complianceDocuments.length + 1).padStart(3, '0')}`;
    
    const newDoc = {
      id: newId,
      name,
      type,
      category: category || 'General',
      status: 'pending',
      priority,
      projectId,
      projectName: getProjectName(projectId),
      issuingAuthority: issuingAuthority || '',
      permitNumber: permitNumber || '',
      applicationNumber: applicationNumber || '',
      applicationDate: new Date().toISOString(),
      description: description || '',
      requirements,
      documents: [],
      inspections: [],
      contactPerson: contactPerson || '',
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      notes: notes || '',
      createdDate: new Date().toISOString(),
      createdBy: 'Current User', // This should come from authentication
      updatedDate: new Date().toISOString(),
      tags
    };
    
    complianceDocuments.unshift(newDoc);
    
    res.status(201).json({
      success: true,
      message: 'Compliance document created successfully',
      data: newDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create compliance document',
      error: error.message
    });
  }
});

// PUT /api/compliance/:id - Update compliance document
router.put('/:id', (req, res) => {
  try {
    const docIndex = complianceDocuments.findIndex(d => d.id === req.params.id);
    
    if (docIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Compliance document not found'
      });
    }
    
    const allowedUpdates = [
      'name', 'category', 'issuingAuthority', 'permitNumber', 'applicationNumber',
      'description', 'requirements', 'priority', 'contactPerson', 'contactEmail',
      'contactPhone', 'notes', 'tags'
    ];
    
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    complianceDocuments[docIndex] = {
      ...complianceDocuments[docIndex],
      ...updates,
      updatedDate: new Date().toISOString(),
      updatedBy: 'Current User' // This should come from authentication
    };
    
    res.json({
      success: true,
      message: 'Compliance document updated successfully',
      data: complianceDocuments[docIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update compliance document',
      error: error.message
    });
  }
});

// PATCH /api/compliance/:id/status - Update compliance status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, notes } = req.body;
    const docIndex = complianceDocuments.findIndex(d => d.id === req.params.id);
    
    if (docIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Compliance document not found'
      });
    }
    
    const allowedStatuses = ['pending', 'in_review', 'approved', 'rejected', 'expired', 'completed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const doc = complianceDocuments[docIndex];
    
    // Update status
    doc.status = status;
    doc.updatedDate = new Date().toISOString();
    doc.updatedBy = 'Current User'; // This should come from authentication
    
    if (notes) doc.notes = notes;
    
    // Set appropriate dates based on status
    if (status === 'approved' && doc.type === 'permit') {
      doc.issueDate = new Date().toISOString();
      // Set expiry date to 1 year from now for permits
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      doc.expiryDate = expiryDate.toISOString();
    }
    
    if (status === 'completed' && doc.type === 'inspection') {
      doc.completedDate = new Date().toISOString();
      doc.result = 'passed'; // Default to passed, can be updated separately
    }
    
    res.json({
      success: true,
      message: 'Compliance status updated successfully',
      data: doc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update compliance status',
      error: error.message
    });
  }
});

// POST /api/compliance/:id/documents - Upload document
router.post('/:id/documents', upload.single('file'), (req, res) => {
  try {
    const docIndex = complianceDocuments.findIndex(d => d.id === req.params.id);
    
    if (docIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Compliance document not found'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const { documentType, description } = req.body;
    
    const newDocument = {
      id: `DOC${Date.now()}`,
      name: req.file.originalname,
      type: documentType || 'document',
      description: description || '',
      uploadDate: new Date().toISOString(),
      filePath: `/uploads/compliance/${req.file.filename}`,
      fileSize: req.file.size,
      uploadedBy: 'Current User' // This should come from authentication
    };
    
    complianceDocuments[docIndex].documents.push(newDocument);
    complianceDocuments[docIndex].updatedDate = new Date().toISOString();
    
    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: newDocument
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message
    });
  }
});

// POST /api/compliance/:id/inspections - Add inspection
router.post('/:id/inspections', (req, res) => {
  try {
    const docIndex = complianceDocuments.findIndex(d => d.id === req.params.id);
    
    if (docIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Compliance document not found'
      });
    }
    
    const {
      type,
      inspector,
      scheduledDate,
      notes,
      requirements = []
    } = req.body;
    
    if (!type || !inspector) {
      return res.status(400).json({
        success: false,
        message: 'Inspection type and inspector are required'
      });
    }
    
    const newInspection = {
      id: `INS${Date.now()}`,
      type,
      status: 'scheduled',
      inspector,
      scheduledDate: scheduledDate || new Date().toISOString(),
      notes: notes || '',
      requirements,
      createdDate: new Date().toISOString(),
      createdBy: 'Current User' // This should come from authentication
    };
    
    complianceDocuments[docIndex].inspections.push(newInspection);
    complianceDocuments[docIndex].updatedDate = new Date().toISOString();
    
    res.status(201).json({
      success: true,
      message: 'Inspection scheduled successfully',
      data: newInspection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to schedule inspection',
      error: error.message
    });
  }
});

// PATCH /api/compliance/:id/inspections/:inspectionId - Update inspection
router.patch('/:id/inspections/:inspectionId', (req, res) => {
  try {
    const docIndex = complianceDocuments.findIndex(d => d.id === req.params.id);
    
    if (docIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Compliance document not found'
      });
    }
    
    const inspectionIndex = complianceDocuments[docIndex].inspections
      .findIndex(i => i.id === req.params.inspectionId);
    
    if (inspectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Inspection not found'
      });
    }
    
    const { status, result, notes, completedDate } = req.body;
    
    const inspection = complianceDocuments[docIndex].inspections[inspectionIndex];
    
    if (status) inspection.status = status;
    if (result) inspection.result = result;
    if (notes) inspection.notes = notes;
    if (completedDate) inspection.completedDate = completedDate;
    
    if (status === 'completed' && !inspection.completedDate) {
      inspection.completedDate = new Date().toISOString();
    }
    
    inspection.updatedDate = new Date().toISOString();
    inspection.updatedBy = 'Current User';
    
    complianceDocuments[docIndex].updatedDate = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Inspection updated successfully',
      data: inspection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update inspection',
      error: error.message
    });
  }
});

// DELETE /api/compliance/:id - Delete compliance document
router.delete('/:id', (req, res) => {
  try {
    const docIndex = complianceDocuments.findIndex(d => d.id === req.params.id);
    
    if (docIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Compliance document not found'
      });
    }
    
    const doc = complianceDocuments[docIndex];
    
    // Delete associated files
    doc.documents.forEach(document => {
      if (document.filePath && fs.existsSync(path.join(__dirname, '..', document.filePath))) {
        fs.unlinkSync(path.join(__dirname, '..', document.filePath));
      }
    });
    
    complianceDocuments.splice(docIndex, 1);
    
    res.json({
      success: true,
      message: 'Compliance document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete compliance document',
      error: error.message
    });
  }
});

// GET /api/compliance/project/:projectId - Get compliance by project
router.get('/project/:projectId', (req, res) => {
  try {
    const projectDocs = complianceDocuments.filter(d => d.projectId === req.params.projectId);
    
    // Group by category
    const grouped = projectDocs.reduce((acc, doc) => {
      const category = doc.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(doc);
      return acc;
    }, {});
    
    // Calculate stats
    const stats = {
      total: projectDocs.length,
      byStatus: {
        pending: projectDocs.filter(d => d.status === 'pending').length,
        in_review: projectDocs.filter(d => d.status === 'in_review').length,
        approved: projectDocs.filter(d => d.status === 'approved').length,
        completed: projectDocs.filter(d => d.status === 'completed').length,
        rejected: projectDocs.filter(d => d.status === 'rejected').length
      },
      byType: {
        permit: projectDocs.filter(d => d.type === 'permit').length,
        inspection: projectDocs.filter(d => d.type === 'inspection').length,
        certificate: projectDocs.filter(d => d.type === 'certificate').length
      }
    };
    
    res.json({
      success: true,
      data: projectDocs,
      grouped,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project compliance documents',
      error: error.message
    });
  }
});

// GET /api/compliance/stats - Get compliance statistics
router.get('/stats', (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    const stats = {
      total: complianceDocuments.length,
      byStatus: {
        pending: complianceDocuments.filter(d => d.status === 'pending').length,
        in_review: complianceDocuments.filter(d => d.status === 'in_review').length,
        approved: complianceDocuments.filter(d => d.status === 'approved').length,
        completed: complianceDocuments.filter(d => d.status === 'completed').length,
        rejected: complianceDocuments.filter(d => d.status === 'rejected').length,
        expired: complianceDocuments.filter(d => d.status === 'expired').length
      },
      byType: {
        permit: complianceDocuments.filter(d => d.type === 'permit').length,
        inspection: complianceDocuments.filter(d => d.type === 'inspection').length,
        certificate: complianceDocuments.filter(d => d.type === 'certificate').length
      },
      byPriority: {
        high: complianceDocuments.filter(d => d.priority === 'high').length,
        medium: complianceDocuments.filter(d => d.priority === 'medium').length,
        low: complianceDocuments.filter(d => d.priority === 'low').length
      },
      expiringSoon: complianceDocuments.filter(d => 
        d.expiryDate && new Date(d.expiryDate) <= thirtyDaysFromNow && new Date(d.expiryDate) > now
      ).length,
      totalInspections: complianceDocuments.reduce((sum, doc) => sum + doc.inspections.length, 0),
      upcomingInspections: complianceDocuments.reduce((count, doc) => 
        count + doc.inspections.filter(i => i.status === 'scheduled').length, 0
      )
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get compliance statistics',
      error: error.message
    });
  }
});

// GET /api/compliance/:id/file/:documentId - Serve compliance document file
router.get('/:id/file/:documentId', (req, res) => {
  try {
    const doc = complianceDocuments.find(d => d.id === req.params.id);
    
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Compliance document not found'
      });
    }
    
    const document = doc.documents.find(d => d.id === req.params.documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document file not found'
      });
    }
    
    const fullPath = path.join(__dirname, '..', document.filePath);
    
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