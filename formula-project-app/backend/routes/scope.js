/**
 * Project Scope Routes
 * Manage scope groups and scope items for projects
 */

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const { 
  verifyToken, 
  requireProjectAccess 
} = require('../middleware/auth');

const { 
  validateCreateScopeGroup, 
  validateCreateScopeItem, 
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

// Apply authentication to all scope routes
router.use(verifyToken);

/**
 * GET /api/v1/projects/:projectId/scope
 * Get all scope groups and items for a project
 */
router.get('/', requireProjectAccess, asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { includeItems = 'true' } = req.query;
  const { prisma } = req.app.locals;

  const scopeGroups = await dbOperation(async () => {
    const selectOptions = {
      id: true,
      name: true,
      description: true,
      orderIndex: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        scopeItems: true
      }
    };

    if (includeItems === 'true') {
      selectOptions.scopeItems = {
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          completionPercentage: true,
          orderIndex: true,
          estimatedCost: true,
          actualCost: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            shopDrawings: true,
            materialSpecs: true,
            workflowConnections: true
          }
        },
        orderBy: { orderIndex: 'asc' }
      };
    }

    return await prisma.scopeGroup.findMany({
      where: { projectId },
      select: selectOptions,
      orderBy: { orderIndex: 'asc' }
    });
  });

  // Calculate summary statistics
  const summary = {
    totalGroups: scopeGroups.length,
    totalItems: scopeGroups.reduce((sum, group) => sum + group._count.scopeItems, 0),
    totalEstimatedCost: 0,
    totalActualCost: 0,
    averageCompletion: 0
  };

  if (includeItems === 'true') {
    const allItems = scopeGroups.flatMap(group => group.scopeItems || []);
    summary.totalEstimatedCost = allItems.reduce((sum, item) => sum + (parseFloat(item.estimatedCost) || 0), 0);
    summary.totalActualCost = allItems.reduce((sum, item) => sum + (parseFloat(item.actualCost) || 0), 0);
    summary.averageCompletion = allItems.length > 0 
      ? allItems.reduce((sum, item) => sum + item.completionPercentage, 0) / allItems.length 
      : 0;
  }

  successResponse(res, {
    scopeGroups,
    summary
  }, 'Project scope retrieved successfully');
}));

/**
 * GET /api/v1/projects/:projectId/scope/groups
 * Get scope groups for a project with pagination
 */
router.get('/groups', requireProjectAccess, validatePagination, asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const {
    page = 1,
    limit = 20,
    sortBy = 'orderIndex',
    sortOrder = 'asc'
  } = req.query;
  const { prisma } = req.app.locals;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [scopeGroups, total] = await Promise.all([
    dbOperation(async () => {
      return await prisma.scopeGroup.findMany({
        where: { projectId },
        select: {
          id: true,
          name: true,
          description: true,
          orderIndex: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            scopeItems: true
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take
      });
    }),
    dbOperation(async () => {
      return await prisma.scopeGroup.count({
        where: { projectId }
      });
    })
  ]);

  paginatedResponse(res, scopeGroups, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Scope groups retrieved successfully');
}));

/**
 * POST /api/v1/projects/:projectId/scope/groups
 * Create a new scope group
 */
router.post('/groups', requireProjectAccess, validateCreateScopeGroup, asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description, orderIndex } = req.body;
  const currentUser = req.user;

  // Check if user can edit this project's scope
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
      throw new AuthorizationError('Insufficient permissions to manage project scope');
    }
  }

  // Check for duplicate name within project
  const existingGroup = await dbOperation(async () => {
    return await prisma.scopeGroup.findFirst({
      where: {
        projectId,
        name: name.trim()
      }
    });
  });

  if (existingGroup) {
    throw new ConflictError('Scope group with this name already exists in the project');
  }

  // Get next order index if not provided
  let finalOrderIndex = orderIndex;
  if (finalOrderIndex === undefined) {
    const lastGroup = await dbOperation(async () => {
      return await prisma.scopeGroup.findFirst({
        where: { projectId },
        orderBy: { orderIndex: 'desc' },
        select: { orderIndex: true }
      });
    });
    finalOrderIndex = (lastGroup?.orderIndex || 0) + 1;
  }

  const scopeGroup = await dbOperation(async () => {
    return await prisma.scopeGroup.create({
      data: {
        projectId,
        name: name.trim(),
        description: description?.trim(),
        orderIndex: finalOrderIndex
      },
      select: {
        id: true,
        name: true,
        description: true,
        orderIndex: true,
        createdAt: true,
        project: {
          select: { id: true, name: true }
        }
      }
    });
  });

  // Log scope group creation
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'create_scope_group',
        details: {
          projectId,
          scopeGroupId: scopeGroup.id,
          scopeGroupName: scopeGroup.name,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log scope group creation:', auditError);
    }
  }

  successResponse(res, scopeGroup, 'Scope group created successfully', 201);
}));

/**
 * PUT /api/v1/projects/:projectId/scope/groups/:groupId
 * Update scope group
 */
router.put('/groups/:groupId', requireProjectAccess, validateUUIDParam('groupId'), asyncHandler(async (req, res) => {
  const { projectId, groupId } = req.params;
  const { name, description, orderIndex } = req.body;
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
      throw new AuthorizationError('Insufficient permissions to manage project scope');
    }
  }

  const updates = {};
  if (name !== undefined) updates.name = name.trim();
  if (description !== undefined) updates.description = description?.trim();
  if (orderIndex !== undefined) updates.orderIndex = orderIndex;

  if (Object.keys(updates).length === 0) {
    throw new ValidationError('No valid updates provided');
  }

  // Check if scope group exists and belongs to project
  const existingGroup = await dbOperation(async () => {
    return await prisma.scopeGroup.findFirst({
      where: { id: groupId, projectId },
      select: { id: true, name: true }
    });
  });

  if (!existingGroup) {
    throw new NotFoundError('Scope group not found in this project');
  }

  // Check for duplicate name if name is being updated
  if (updates.name && updates.name !== existingGroup.name) {
    const duplicateName = await dbOperation(async () => {
      return await prisma.scopeGroup.findFirst({
        where: {
          projectId,
          name: updates.name,
          id: { not: groupId }
        }
      });
    });

    if (duplicateName) {
      throw new ConflictError('Scope group with this name already exists in the project');
    }
  }

  const scopeGroup = await dbOperation(async () => {
    return await prisma.scopeGroup.update({
      where: { id: groupId },
      data: updates,
      select: {
        id: true,
        name: true,
        description: true,
        orderIndex: true,
        updatedAt: true,
        _count: {
          scopeItems: true
        }
      }
    });
  });

  // Log scope group update
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'update_scope_group',
        details: {
          projectId,
          scopeGroupId: groupId,
          updatedFields: Object.keys(updates),
          changes: updates,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log scope group update:', auditError);
    }
  }

  successResponse(res, scopeGroup, 'Scope group updated successfully');
}));

/**
 * DELETE /api/v1/projects/:projectId/scope/groups/:groupId
 * Delete scope group
 */
router.delete('/groups/:groupId', requireProjectAccess, validateUUIDParam('groupId'), asyncHandler(async (req, res) => {
  const { projectId, groupId } = req.params;
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
      throw new AuthorizationError('Insufficient permissions to manage project scope');
    }
  }

  // Check if scope group exists and get item count
  const scopeGroup = await dbOperation(async () => {
    return await prisma.scopeGroup.findFirst({
      where: { id: groupId, projectId },
      select: { 
        id: true, 
        name: true,
        _count: { scopeItems: true }
      }
    });
  });

  if (!scopeGroup) {
    throw new NotFoundError('Scope group not found in this project');
  }

  if (scopeGroup._count.scopeItems > 0) {
    throw new ValidationError(`Cannot delete scope group with ${scopeGroup._count.scopeItems} scope items. Delete items first.`);
  }

  await dbOperation(async () => {
    return await prisma.scopeGroup.delete({
      where: { id: groupId }
    });
  });

  // Log scope group deletion
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'delete_scope_group',
        details: {
          projectId,
          scopeGroupId: groupId,
          scopeGroupName: scopeGroup.name,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log scope group deletion:', auditError);
    }
  }

  successResponse(res, null, 'Scope group deleted successfully');
}));

/**
 * GET /api/v1/projects/:projectId/scope/items
 * Get scope items for a project with pagination and filtering
 */
router.get('/items', requireProjectAccess, validatePagination, asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const {
    page = 1,
    limit = 20,
    sortBy = 'orderIndex',
    sortOrder = 'asc',
    scopeGroupId,
    status,
    search
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Build where clause
  const where = { projectId };
  
  if (scopeGroupId) {
    where.scopeGroupId = scopeGroupId;
  }
  
  if (status) {
    where.status = status;
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [scopeItems, total] = await Promise.all([
    dbOperation(async () => {
      return await prisma.scopeItem.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          completionPercentage: true,
          orderIndex: true,
          estimatedCost: true,
          actualCost: true,
          createdAt: true,
          updatedAt: true,
          scopeGroup: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            shopDrawings: true,
            materialSpecs: true,
            workflowConnections: true
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take
      });
    }),
    dbOperation(async () => {
      return await prisma.scopeItem.count({ where });
    })
  ]);

  paginatedResponse(res, scopeItems, {
    page: parseInt(page),
    limit: parseInt(limit),
    total
  }, 'Scope items retrieved successfully');
}));

/**
 * POST /api/v1/projects/:projectId/scope/items
 * Create a new scope item
 */
router.post('/items', requireProjectAccess, validateCreateScopeItem, asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { 
    name, 
    description, 
    scopeGroupId, 
    estimatedCost, 
    orderIndex 
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
        currentUser.role !== 'project_manager') {
      throw new AuthorizationError('Insufficient permissions to manage project scope');
    }
  }

  // Validate scope group exists and belongs to project
  const scopeGroup = await dbOperation(async () => {
    return await prisma.scopeGroup.findFirst({
      where: { id: scopeGroupId, projectId },
      select: { id: true, name: true }
    });
  });

  if (!scopeGroup) {
    throw new NotFoundError('Scope group not found in this project');
  }

  // Check for duplicate name within scope group
  const existingItem = await dbOperation(async () => {
    return await prisma.scopeItem.findFirst({
      where: {
        scopeGroupId,
        name: name.trim()
      }
    });
  });

  if (existingItem) {
    throw new ConflictError('Scope item with this name already exists in the scope group');
  }

  // Get next order index if not provided
  let finalOrderIndex = orderIndex;
  if (finalOrderIndex === undefined) {
    const lastItem = await dbOperation(async () => {
      return await prisma.scopeItem.findFirst({
        where: { scopeGroupId },
        orderBy: { orderIndex: 'desc' },
        select: { orderIndex: true }
      });
    });
    finalOrderIndex = (lastItem?.orderIndex || 0) + 1;
  }

  const scopeItem = await dbOperation(async () => {
    return await prisma.scopeItem.create({
      data: {
        projectId,
        scopeGroupId,
        name: name.trim(),
        description: description?.trim(),
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
        orderIndex: finalOrderIndex,
        status: 'pending',
        completionPercentage: 0
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        completionPercentage: true,
        orderIndex: true,
        estimatedCost: true,
        actualCost: true,
        createdAt: true,
        scopeGroup: {
          select: { id: true, name: true }
        }
      }
    });
  });

  // Log scope item creation
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'create_scope_item',
        details: {
          projectId,
          scopeGroupId,
          scopeItemId: scopeItem.id,
          scopeItemName: scopeItem.name,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log scope item creation:', auditError);
    }
  }

  successResponse(res, scopeItem, 'Scope item created successfully', 201);
}));

/**
 * PUT /api/v1/projects/:projectId/scope/items/:itemId
 * Update scope item
 */
router.put('/items/:itemId', requireProjectAccess, validateUUIDParam('itemId'), asyncHandler(async (req, res) => {
  const { projectId, itemId } = req.params;
  const { 
    name, 
    description, 
    status, 
    completionPercentage, 
    estimatedCost, 
    actualCost, 
    orderIndex 
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
        currentUser.role !== 'project_manager') {
      throw new AuthorizationError('Insufficient permissions to manage project scope');
    }
  }

  const updates = {};
  if (name !== undefined) updates.name = name.trim();
  if (description !== undefined) updates.description = description?.trim();
  if (status !== undefined) updates.status = status;
  if (completionPercentage !== undefined) updates.completionPercentage = Math.max(0, Math.min(100, parseInt(completionPercentage)));
  if (estimatedCost !== undefined) updates.estimatedCost = estimatedCost ? parseFloat(estimatedCost) : null;
  if (actualCost !== undefined) updates.actualCost = actualCost ? parseFloat(actualCost) : null;
  if (orderIndex !== undefined) updates.orderIndex = orderIndex;

  if (Object.keys(updates).length === 0) {
    throw new ValidationError('No valid updates provided');
  }

  // Check if scope item exists and belongs to project
  const existingItem = await dbOperation(async () => {
    return await prisma.scopeItem.findFirst({
      where: { id: itemId, projectId },
      select: { 
        id: true, 
        name: true, 
        scopeGroupId: true 
      }
    });
  });

  if (!existingItem) {
    throw new NotFoundError('Scope item not found in this project');
  }

  // Check for duplicate name if name is being updated
  if (updates.name && updates.name !== existingItem.name) {
    const duplicateName = await dbOperation(async () => {
      return await prisma.scopeItem.findFirst({
        where: {
          scopeGroupId: existingItem.scopeGroupId,
          name: updates.name,
          id: { not: itemId }
        }
      });
    });

    if (duplicateName) {
      throw new ConflictError('Scope item with this name already exists in the scope group');
    }
  }

  const scopeItem = await dbOperation(async () => {
    return await prisma.scopeItem.update({
      where: { id: itemId },
      data: updates,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        completionPercentage: true,
        orderIndex: true,
        estimatedCost: true,
        actualCost: true,
        updatedAt: true,
        scopeGroup: {
          select: { id: true, name: true }
        }
      }
    });
  });

  // Log scope item update
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'update_scope_item',
        details: {
          projectId,
          scopeItemId: itemId,
          updatedFields: Object.keys(updates),
          changes: updates,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log scope item update:', auditError);
    }
  }

  successResponse(res, scopeItem, 'Scope item updated successfully');
}));

/**
 * DELETE /api/v1/projects/:projectId/scope/items/:itemId
 * Delete scope item
 */
router.delete('/items/:itemId', requireProjectAccess, validateUUIDParam('itemId'), asyncHandler(async (req, res) => {
  const { projectId, itemId } = req.params;
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
      throw new AuthorizationError('Insufficient permissions to manage project scope');
    }
  }

  // Check if scope item exists and get related items count
  const scopeItem = await dbOperation(async () => {
    return await prisma.scopeItem.findFirst({
      where: { id: itemId, projectId },
      select: { 
        id: true, 
        name: true,
        _count: {
          shopDrawings: true,
          materialSpecs: true,
          workflowConnections: true
        }
      }
    });
  });

  if (!scopeItem) {
    throw new NotFoundError('Scope item not found in this project');
  }

  const hasRelatedItems = scopeItem._count.shopDrawings > 0 || 
                         scopeItem._count.materialSpecs > 0 || 
                         scopeItem._count.workflowConnections > 0;

  if (hasRelatedItems) {
    throw new ValidationError('Cannot delete scope item with related drawings, materials, or workflow connections. Remove them first.');
  }

  await dbOperation(async () => {
    return await prisma.scopeItem.delete({
      where: { id: itemId }
    });
  });

  // Log scope item deletion
  if (req.app.locals.auditService) {
    try {
      await req.app.locals.auditService.logUserAction({
        userId: currentUser.id,
        action: 'delete_scope_item',
        details: {
          projectId,
          scopeItemId: itemId,
          scopeItemName: scopeItem.name,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      });
    } catch (auditError) {
      console.error('Failed to log scope item deletion:', auditError);
    }
  }

  successResponse(res, null, 'Scope item deleted successfully');
}));

module.exports = router;