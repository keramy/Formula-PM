/**
 * Backend CRUD Pattern
 * Standard RESTful API endpoint structure for consistent CRUD operations
 */

const express = require('express');
const router = express.Router();

// Mock data store (replace with actual database)
let entities = [
  { id: '1', name: 'Example Entity', status: 'active', createdAt: new Date().toISOString() }
];

// Helper function to generate IDs
function generateId() {
  return Date.now().toString();
}

// GET /api/entities - Read all with optional filtering and pagination
router.get('/', (req, res) => {
  try {
    const { status, search, limit, offset } = req.query;
    
    let filtered = [...entities];
    
    // Apply filters
    if (status) {
      filtered = filtered.filter(entity => entity.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(entity => 
        entity.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply pagination
    const startIndex = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || 50;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);
    
    res.json({
      success: true,
      data: paginated,
      pagination: {
        total: filtered.length,
        offset: startIndex,
        limit: limitNum,
        hasMore: startIndex + limitNum < filtered.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch entities',
      error: error.message
    });
  }
});

// GET /api/entities/:id - Read single entity
router.get('/:id', (req, res) => {
  try {
    const entity = entities.find(e => e.id === req.params.id);
    
    if (!entity) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found'
      });
    }
    
    res.json({
      success: true,
      data: entity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch entity',
      error: error.message
    });
  }
});

// POST /api/entities - Create new entity
router.post('/', (req, res) => {
  try {
    const { name, status } = req.body;
    
    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    const newEntity = {
      id: generateId(),
      name,
      status: status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    entities.unshift(newEntity);
    
    res.status(201).json({
      success: true,
      message: 'Entity created successfully',
      data: newEntity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create entity',
      error: error.message
    });
  }
});

// PUT /api/entities/:id - Update entity
router.put('/:id', (req, res) => {
  try {
    const entityIndex = entities.findIndex(e => e.id === req.params.id);
    
    if (entityIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found'
      });
    }
    
    const allowedUpdates = ['name', 'status'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    entities[entityIndex] = {
      ...entities[entityIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Entity updated successfully',
      data: entities[entityIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update entity',
      error: error.message
    });
  }
});

// DELETE /api/entities/:id - Delete entity
router.delete('/:id', (req, res) => {
  try {
    const entityIndex = entities.findIndex(e => e.id === req.params.id);
    
    if (entityIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Entity not found'
      });
    }
    
    entities.splice(entityIndex, 1);
    
    res.json({
      success: true,
      message: 'Entity deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete entity',
      error: error.message
    });
  }
});

// GET /api/entities/stats - Get entity statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      total: entities.length,
      byStatus: {
        active: entities.filter(e => e.status === 'active').length,
        inactive: entities.filter(e => e.status === 'inactive').length
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
      error: error.message
    });
  }
});

module.exports = router;