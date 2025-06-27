/**
 * Shop Drawings Routes
 * Manage shop drawings for projects with file upload and approval workflow
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { PrismaClient } = require('@prisma/client');

const { 
  verifyToken, 
  requireProjectAccess 
} = require('../middleware/auth');

const { 
  validateUUIDParam,
  validatePagination 
} = require('../middleware/validation');

const { 
  asyncHandler, 
  successResponse, 
  paginatedResponse,
  NotFoundError,
  ConflictError,
  AuthorizationError,
  ValidationError,
  dbOperation
} = require('../middleware/errorHandler');

const router = express.Router({ mergeParams: true }); // mergeParams to access projectId from parent route

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { projectId } = req.params;
    const uploadPath = path.join(process.env.UPLOAD_PATH || './uploads', 'drawings', projectId);
    
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow common drawing file types
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/tiff',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/x-autocad', // .dwg
    'image/vnd.dwg', // .dwg
    'application/dxf' // .dxf
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`File type ${file.mimetype} not allowed. Allowed types: PDF, JPG, PNG, TIFF, DWG, DXF, Excel`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // 50MB default
    files: 5 // Maximum 5 files per upload
  }
});

// Apply authentication to all drawing routes
router.use(verifyToken);

/**
 * GET /api/v1/projects/:projectId/drawings
 * Get shop drawings for a project with pagination and filtering
 */
router.get('/', requireProjectAccess, validatePagination, asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const {
    page = 1,
    limit = 20,
    sortBy = 'uploadDate',
    sortOrder = 'desc',
    status,
    drawingType,
    room,
    scopeItemId,
    search
  } = req.query;
  const { prisma } = req.app.locals;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Build where clause
  const where = { projectId };
  
  if (status) {
    where.status = status;
  }
  
  if (drawingType) {
    where.drawingType = { contains: drawingType, mode: 'insensitive' };
  }
  
  if (room) {
    where.room = { contains: room, mode: 'insensitive' };
  }
  
  if (scopeItemId) {
    where.scopeItemId = scopeItemId;
  }
  
  if (search) {
    where.OR = [
      { fileName: { contains: search, mode: 'insensitive' } },
      { drawingType: { contains: search, mode: 'insensitive' } },
      { room: { contains: search, mode: 'insensitive' } },
      { comments: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [drawings, total] = await Promise.all([
    dbOperation(async () => {
      return await prisma.shopDrawing.findMany({
        where,
        select: {
          id: true,
          fileName: true,
          drawingType: true,
          room: true,
          status: true,
          version: true,
          fileSize: true,
          uploadDate: true,
          approvedDate: true,
          comments: true,
          createdAt: true,
          updatedAt: true,
          scopeItem: {
            select: {
              id: true,
              name: true,
              scopeGroup: {
                select: { id: true, name: true }
              }
            }
          },
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          approver: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          _count: {
            workflowConnections: true
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take
      });
    }),
    dbOperation(async () => {
      return await prisma.shopDrawing.count({ where });
    })
  ]);

  // Get summary statistics
  const summary = await dbOperation(async () => {
    const statusCounts = await prisma.shopDrawing.groupBy({
      by: ['status'],
      where: { projectId },
      _count: { id: true }
    });

    const totalSize = await prisma.shopDrawing.aggregate({
      where: { projectId },
      _sum: { fileSize: true }
    });

    return {
      total: total,
      totalSize: totalSize._sum.fileSize || 0,
      by_status: statusCounts.reduce((acc, stat) => {
        acc[stat.status] = stat._count.id;
        return acc;
      }, {})
    };
  });

  paginatedResponse(res, {
    drawings,
    summary
  }, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Shop drawings retrieved successfully');
}));

/**
 * GET /api/v1/projects/:projectId/drawings/:id
 * Get specific shop drawing by ID
 */
router.get('/:id', requireProjectAccess, validateUUIDParam('id'), asyncHandler(async (req, res) => {
  const { projectId, id } = req.params;

  const drawing = await dbOperation(async () => {
    return await prisma.shopDrawing.findFirst({
      where: { id, projectId },
      select: {
        id: true,
        fileName: true,
        drawingType: true,
        room: true,
        status: true,
        version: true,
        filePath: true,
        fileSize: true,
        uploadDate: true,
        approvedDate: true,
        comments: true,
        createdAt: true,
        updatedAt: true,
        scopeItem: {
          select: {
            id: true,
            name: true,
            description: true,
            scopeGroup: {
              select: { id: true, name: true }
            }
          }
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true
          }
        },
        approver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true
          }
        },
        workflowConnections: {
          select: {
            id: true,
            connectionType: true,
            status: true,
            materialSpec: {
              select: { id: true, description: true }
            }
          }
        }
      }
    });
  });

  if (!drawing) {
    throw new NotFoundError('Shop drawing not found in this project');
  }

  successResponse(res, drawing, 'Shop drawing retrieved successfully');
}));

/**
 * POST /api/v1/projects/:projectId/drawings
 * Upload new shop drawing(s)
 */
router.post('/', requireProjectAccess, upload.array('drawings', 5), asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { 
    drawingType, 
    room, 
    scopeItemId, 
    comments,
    version = 'Rev A'
  } = req.body;
  const currentUser = req.user;

  if (!req.files || req.files.length === 0) {
    throw new ValidationError('At least one drawing file is required');
  }

  // Check permissions
  if (currentUser.role !== 'admin') {
    const project = await dbOperation(async () => {
      return await prisma.project.findUnique({
        where: { id: projectId },
        select: { projectManagerId: true, createdBy: true }
      });
    });

    if (!project) {
      throw new NotFoundError('Project');
    }

    if (project.projectManagerId !== currentUser.id && 
        project.createdBy !== currentUser.id && 
        !['project_manager', 'designer'].includes(currentUser.role)) {
      throw new AuthorizationError('Insufficient permissions to upload drawings');
    }
  }

  // Validate scope item if provided
  if (scopeItemId) {
    const scopeItem = await dbOperation(async () => {
      return await prisma.scopeItem.findFirst({
        where: { id: scopeItemId, projectId },
        select: { id: true, name: true }
      });
    });

    if (!scopeItem) {
      throw new NotFoundError('Scope item not found in this project');
    }
  }

  // Create drawing records for each uploaded file
  const drawings = await dbOperation(async () => {
    return await prisma.$transaction(async (tx) => {
      const createdDrawings = [];

      for (const file of req.files) {
        const drawing = await tx.shopDrawing.create({
          data: {
            projectId,
            scopeItemId: scopeItemId || null,
            fileName: file.originalname,
            drawingType: drawingType?.trim(),
            room: room?.trim(),
            status: 'draft',
            version: version.trim(),
            filePath: file.path,
            fileSize: BigInt(file.size),
            uploadDate: new Date(),
            comments: comments?.trim(),
            createdBy: currentUser.id
          },
          select: {
            id: true,
            fileName: true,
            drawingType: true,
            room: true,
            status: true,
            version: true,
            fileSize: true,
            uploadDate: true,
            createdAt: true,
            scopeItem: {
              select: { id: true, name: true }
            },
            creator: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        });

        createdDrawings.push(drawing);
      }

      return createdDrawings;
    });
  });

  // Log drawing uploads
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'upload_drawings',
        details: {
          projectId,
          scopeItemId,
          drawingCount: drawings.length,
          drawingIds: drawings.map(d => d.id),
          fileNames: drawings.map(d => d.fileName),
          totalSize: req.files.reduce((sum, file) => sum + file.size, 0),
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log drawing upload:', auditError);
    }
  }

  successResponse(res, drawings, `${drawings.length} drawing(s) uploaded successfully`, 201);
}));

/**
 * PUT /api/v1/projects/:projectId/drawings/:id
 * Update shop drawing metadata
 */
router.put('/:id', requireProjectAccess, validateUUIDParam('id'), asyncHandler(async (req, res) => {
  const { projectId, id } = req.params;
  const { 
    drawingType, 
    room, 
    scopeItemId, 
    comments,
    version
  } = req.body;
  const currentUser = req.user;

  // Check permissions
  if (currentUser.role !== 'admin') {
    const project = await dbOperation(async () => {
      return await prisma.project.findUnique({
        where: { id: projectId },
        select: { projectManagerId: true, createdBy: true }
      });
    });

    if (!project) {
      throw new NotFoundError('Project');
    }

    if (project.projectManagerId !== currentUser.id && 
        project.createdBy !== currentUser.id && 
        !['project_manager', 'designer'].includes(currentUser.role)) {
      throw new AuthorizationError('Insufficient permissions to update drawings');
    }
  }

  // Check if drawing exists
  const existingDrawing = await dbOperation(async () => {
    return await prisma.shopDrawing.findFirst({
      where: { id, projectId },
      select: { id: true, status: true, createdBy: true }
    });
  });

  if (!existingDrawing) {
    throw new NotFoundError('Shop drawing not found in this project');
  }

  // Non-admin users can only edit their own drawings that are not approved
  if (currentUser.role !== 'admin' && currentUser.role !== 'project_manager') {
    if (existingDrawing.createdBy !== currentUser.id) {
      throw new AuthorizationError('You can only edit your own drawings');
    }
    
    if (existingDrawing.status === 'approved') {
      throw new ValidationError('Cannot edit approved drawings');
    }
  }

  const updates = {};
  if (drawingType !== undefined) updates.drawingType = drawingType?.trim();
  if (room !== undefined) updates.room = room?.trim();
  if (scopeItemId !== undefined) updates.scopeItemId = scopeItemId;
  if (comments !== undefined) updates.comments = comments?.trim();
  if (version !== undefined) updates.version = version.trim();

  if (Object.keys(updates).length === 0) {
    throw new ValidationError('No valid updates provided');
  }

  // Validate scope item if being updated
  if (updates.scopeItemId) {
    const scopeItem = await dbOperation(async () => {
      return await prisma.scopeItem.findFirst({
        where: { id: updates.scopeItemId, projectId },
        select: { id: true, name: true }
      });
    });

    if (!scopeItem) {
      throw new NotFoundError('Scope item not found in this project');
    }
  }

  const drawing = await dbOperation(async () => {
    return await prisma.shopDrawing.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        fileName: true,
        drawingType: true,
        room: true,
        status: true,
        version: true,
        comments: true,
        updatedAt: true,
        scopeItem: {
          select: { id: true, name: true }
        }
      }
    });
  });

  // Log drawing update
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'update_drawing',
        details: {
          projectId,
          drawingId: id,
          updatedFields: Object.keys(updates),
          changes: updates,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log drawing update:', auditError);
    }
  }

  successResponse(res, drawing, 'Shop drawing updated successfully');
}));

/**
 * POST /api/v1/projects/:projectId/drawings/:id/approve
 * Approve shop drawing
 */
router.post('/:id/approve', requireProjectAccess, validateUUIDParam('id'), asyncHandler(async (req, res) => {
  const { projectId, id } = req.params;
  const { comments } = req.body;
  const currentUser = req.user;

  // Check if user can approve drawings
  if (!['admin', 'project_manager'].includes(currentUser.role)) {
    throw new AuthorizationError('Only admins and project managers can approve drawings');
  }

  // Check if drawing exists and is not already approved
  const drawing = await dbOperation(async () => {
    return await prisma.shopDrawing.findFirst({
      where: { id, projectId },
      select: { 
        id: true, 
        fileName: true, 
        status: true,
        creator: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  });

  if (!drawing) {
    throw new NotFoundError('Shop drawing not found in this project');
  }

  if (drawing.status === 'approved') {
    throw new ValidationError('Drawing is already approved');
  }

  const approvedDrawing = await dbOperation(async () => {
    return await prisma.shopDrawing.update({
      where: { id },
      data: {
        status: 'approved',
        approvedBy: currentUser.id,
        approvedDate: new Date(),
        comments: comments?.trim() || drawing.comments
      },
      select: {
        id: true,
        fileName: true,
        status: true,
        approvedDate: true,
        comments: true,
        approver: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  });

  // Log drawing approval
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'approve_drawing',
        details: {
          projectId,
          drawingId: id,
          drawingName: drawing.fileName,
          comments: comments?.trim(),
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log drawing approval:', auditError);
    }
  }

  successResponse(res, approvedDrawing, 'Shop drawing approved successfully');
}));

/**
 * POST /api/v1/projects/:projectId/drawings/:id/reject
 * Reject shop drawing with revision requirements
 */
router.post('/:id/reject', requireProjectAccess, validateUUIDParam('id'), asyncHandler(async (req, res) => {
  const { projectId, id } = req.params;
  const { comments } = req.body;
  const currentUser = req.user;

  if (!comments || comments.trim().length === 0) {
    throw new ValidationError('Rejection comments are required');
  }

  // Check if user can reject drawings
  if (!['admin', 'project_manager'].includes(currentUser.role)) {
    throw new AuthorizationError('Only admins and project managers can reject drawings');
  }

  // Check if drawing exists
  const drawing = await dbOperation(async () => {
    return await prisma.shopDrawing.findFirst({
      where: { id, projectId },
      select: { 
        id: true, 
        fileName: true, 
        status: true,
        creator: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  });

  if (!drawing) {
    throw new NotFoundError('Shop drawing not found in this project');
  }

  if (drawing.status === 'approved') {
    throw new ValidationError('Cannot reject approved drawings');
  }

  const rejectedDrawing = await dbOperation(async () => {
    return await prisma.shopDrawing.update({
      where: { id },
      data: {
        status: 'revision_required',
        comments: comments.trim()
      },
      select: {
        id: true,
        fileName: true,
        status: true,
        comments: true,
        updatedAt: true
      }
    });
  });

  // Log drawing rejection
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'reject_drawing',
        details: {
          projectId,
          drawingId: id,
          drawingName: drawing.fileName,
          rejectionComments: comments.trim(),
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log drawing rejection:', auditError);
    }
  }

  successResponse(res, rejectedDrawing, 'Shop drawing rejected with revision requirements');
}));

/**
 * DELETE /api/v1/projects/:projectId/drawings/:id
 * Delete shop drawing
 */
router.delete('/:id', requireProjectAccess, validateUUIDParam('id'), asyncHandler(async (req, res) => {
  const { projectId, id } = req.params;
  const currentUser = req.user;

  // Check permissions
  if (currentUser.role !== 'admin') {
    const project = await dbOperation(async () => {
      return await prisma.project.findUnique({
        where: { id: projectId },
        select: { projectManagerId: true, createdBy: true }
      });
    });

    if (!project) {
      throw new NotFoundError('Project');
    }

    if (project.projectManagerId !== currentUser.id && 
        project.createdBy !== currentUser.id && 
        currentUser.role !== 'project_manager') {
      throw new AuthorizationError('Insufficient permissions to delete drawings');
    }
  }

  // Check if drawing exists
  const drawing = await dbOperation(async () => {
    return await prisma.shopDrawing.findFirst({
      where: { id, projectId },
      select: { 
        id: true, 
        fileName: true, 
        filePath: true,
        status: true,
        createdBy: true,
        _count: {
          workflowConnections: true
        }
      }
    });
  });

  if (!drawing) {
    throw new NotFoundError('Shop drawing not found in this project');
  }

  // Prevent deletion of approved drawings unless admin
  if (drawing.status === 'approved' && currentUser.role !== 'admin') {
    throw new ValidationError('Cannot delete approved drawings');
  }

  // Check for workflow connections
  if (drawing._count.workflowConnections > 0) {
    throw new ValidationError('Cannot delete drawing with workflow connections. Remove connections first.');
  }

  // Delete file and database record
  await dbOperation(async () => {
    return await prisma.$transaction(async (tx) => {
      // Delete from database
      await tx.shopDrawing.delete({
        where: { id }
      });

      // Delete physical file
      try {
        if (drawing.filePath) {
          await fs.unlink(drawing.filePath);
        }
      } catch (fileError) {
        console.error('Failed to delete file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    });
  });

  // Log drawing deletion
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'delete_drawing',
        details: {
          projectId,
          drawingId: id,
          drawingName: drawing.fileName,
          filePath: drawing.filePath,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log drawing deletion:', auditError);
    }
  }

  successResponse(res, null, 'Shop drawing deleted successfully');
}));

/**
 * GET /api/v1/projects/:projectId/drawings/:id/download
 * Download shop drawing file
 */
router.get('/:id/download', requireProjectAccess, validateUUIDParam('id'), asyncHandler(async (req, res) => {
  const { projectId, id } = req.params;

  const drawing = await dbOperation(async () => {
    return await prisma.shopDrawing.findFirst({
      where: { id, projectId },
      select: {
        id: true,
        fileName: true,
        filePath: true,
        fileSize: true
      }
    });
  });

  if (!drawing) {
    throw new NotFoundError('Shop drawing not found in this project');
  }

  if (!drawing.filePath) {
    throw new NotFoundError('Drawing file not found');
  }

  try {
    // Check if file exists
    await fs.access(drawing.filePath);
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${drawing.fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', drawing.fileSize.toString());
    
    // Stream the file
    res.sendFile(path.resolve(drawing.filePath));
  } catch (error) {
    throw new NotFoundError('Drawing file not found on disk');
  }
}));

module.exports = router;