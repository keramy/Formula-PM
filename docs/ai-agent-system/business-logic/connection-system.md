# Connection Management System

## Overview

The Connection Management System is the core business logic that differentiates Formula PM from other project management systems. It manages the relationships between **Scope Items**, **Shop Drawings**, and **Material Specifications** in the construction/millwork industry workflow.

## Architecture

### Core Connection Pattern
```javascript
// Connection Entity Structure
connection = {
  id: "scope_123_drawing_456",           // Unique identifier
  sourceType: "scope",                   // Source entity type
  sourceId: "123",                       // Source entity ID
  targetType: "drawing",                 // Target entity type  
  targetId: "456",                       // Target entity ID
  createdAt: "2025-06-28T10:00:00Z",    // Creation timestamp
  notes: "Custom installation details"   // Optional connection notes
}
```

### Supported Connection Types
1. **Scope → Shop Drawing**: `scope_to_drawing`
2. **Scope → Material Specification**: `scope_to_material`
3. **Auto-linked connections**: Backend-managed via `scopeItemIds` arrays

## Core Business Logic

### Connection Creation
```javascript
// File: src/services/connectionService.js
createConnection(sourceType, sourceId, targetType, targetId, connectionData = {}) {
  const connectionId = `${sourceType}_${sourceId}_${targetType}_${targetId}`;
  const connection = {
    id: connectionId,
    sourceType,
    sourceId,
    targetType,
    targetId,
    createdAt: new Date().toISOString(),
    ...connectionData
  };
  
  this.connections.set(connectionId, connection);
  return connection;
}
```

### Connection Retrieval with Backend Integration
```javascript
getConnectedDrawings(scopeItemId, allDrawings = []) {
  // 1. Check in-memory connections (user-created)
  const connections = this.getConnections('scope', scopeItemId);
  const connectedDrawings = connections
    .filter(conn => conn.targetType === 'drawing')
    .map(conn => {
      const drawing = allDrawings.find(d => d.id === conn.targetId);
      return drawing ? {
        connectionId: conn.id,
        drawingId: conn.targetId,
        notes: conn.notes,
        createdAt: conn.createdAt,
        drawing
      } : null;
    })
    .filter(Boolean);

  // 2. Check backend auto-linked connections
  const linkedDrawings = allDrawings
    .filter(drawing => drawing.scopeItemIds?.includes(scopeItemId))
    .map(drawing => ({
      connectionId: `auto_${scopeItemId}_${drawing.id}`,
      drawingId: drawing.id,
      notes: 'Auto-linked from backend',
      createdAt: drawing.createdAt || new Date().toISOString(),
      drawing
    }));

  // 3. Combine and deduplicate
  const allConnected = [...connectedDrawings, ...linkedDrawings];
  return allConnected.filter((item, index, self) => 
    index === self.findIndex(t => t.drawingId === item.drawingId)
  );
}
```

## Integration Points

### With Dependency Engine
The Connection System feeds into the Dependency Engine to determine production readiness:

```javascript
// Production blockers depend on connections
productionBlockers: {
  shopDrawingRequired: {
    condition: (scopeItem) => {
      const category = scopeItem.category?.toLowerCase() || '';
      return category.includes('cabinet') || category.includes('millwork') || 
             category.includes('custom') || scopeItem.shopDrawingRequired === true;
    },
    message: "Shop drawing approval required before production"
  }
}
```

### With React Components
```javascript
// File: src/features/projects/components/ConnectionManagementDialog.jsx
const handleCreateConnection = async () => {
  const connection = connectionService.connectScopeToDrawing(
    scopeItemId, 
    selectedDrawingId, 
    connectionNotes
  );
  
  // Update UI state
  onConnectionCreated(connection);
};
```

## Business Rules

### Connection Requirements
1. **Millwork Items**: Must have shop drawing connections
2. **Custom Items**: Must have both shop drawing and material spec connections  
3. **Standard Items**: Material spec connection sufficient
4. **Construction Items**: Flexible connection requirements

### Validation Rules
```javascript
validateConnection(sourceType, sourceId, targetType, targetId) {
  // 1. Prevent duplicate connections
  const existingConnection = this.connections.get(
    `${sourceType}_${sourceId}_${targetType}_${targetId}`
  );
  if (existingConnection) {
    throw new Error('Connection already exists');
  }
  
  // 2. Validate entity existence
  // 3. Check business rule compliance
  // 4. Verify connection type compatibility
}
```

## Usage Examples

### Creating Scope-to-Drawing Connection
```javascript
import connectionService from '../services/connectionService';

// Create connection with notes
const connection = connectionService.connectScopeToDrawing(
  scopeItemId,
  drawingId,
  "Requires custom hardware specifications"
);

console.log(connection);
// Output: {
//   id: "scope_123_drawing_456",
//   sourceType: "scope",
//   sourceId: "123",
//   targetType: "drawing", 
//   targetId: "456",
//   notes: "Requires custom hardware specifications",
//   createdAt: "2025-06-28T10:00:00Z"
// }
```

### Retrieving All Connections for Scope Item
```javascript
// Get connected drawings (includes auto-linked)
const connectedDrawings = connectionService.getConnectedDrawings(
  scopeItemId,
  allProjectDrawings
);

// Get connected material specifications
const connectedSpecs = connectionService.getConnectedMaterialSpecs(
  scopeItemId,
  allProjectSpecs
);
```

### Connection Analysis for Production
```javascript
const analysis = connectionService.analyzeScopeItemDependencies(
  scopeItem,
  shopDrawings,
  materialSpecs
);

console.log(analysis);
// Output: {
//   isBlocked: false,
//   hasWarnings: false,
//   blockers: [],
//   warnings: [],
//   connections: {
//     drawings: [{ connectionId, drawingId, drawing, notes }],
//     materials: [{ connectionId, specId, spec, notes }]
//   }
// }
```

## Component Integration

### WorkflowDashboard Integration
```javascript
// File: src/features/projects/components/WorkflowDashboard.jsx
const analyzeWorkflow = async () => {
  setLoading(true);
  try {
    // Uses connection service to analyze all dependencies
    const status = await connectionService.getWorkflowStatusAsync(project.id);
    setWorkflowStatus(status);
  } catch (error) {
    console.error('Error analyzing workflow:', error);
  } finally {
    setLoading(false);
  }
};
```

### ConnectionManagementDialog Integration
```javascript
// File: src/features/projects/components/ConnectionManagementDialog.jsx
const [existingConnections, setExistingConnections] = useState([]);

useEffect(() => {
  // Load existing connections when dialog opens
  const drawings = connectionService.getConnectedDrawings(scopeItem.id, shopDrawings);
  const materials = connectionService.getConnectedMaterialSpecs(scopeItem.id, materialSpecs);
  
  setExistingConnections({
    drawings,
    materials
  });
}, [scopeItem.id, shopDrawings, materialSpecs]);
```

## Error Handling

### Common Connection Errors
1. **Duplicate Connection**: Connection already exists between entities
2. **Invalid Entity**: Source or target entity doesn't exist
3. **Business Rule Violation**: Connection violates industry rules
4. **Permission Error**: User lacks permission to create connection

### Error Resolution Patterns
```javascript
try {
  const connection = connectionService.createConnection(
    'scope', scopeId, 'drawing', drawingId
  );
} catch (error) {
  switch (error.type) {
    case 'DUPLICATE_CONNECTION':
      // Show existing connection details
      break;
    case 'INVALID_ENTITY':
      // Refresh entity data and retry
      break;
    case 'BUSINESS_RULE_VIOLATION':
      // Show business rule explanation
      break;
    default:
      // Log error and show generic message
      console.error('Connection error:', error);
  }
}
```

## Performance Considerations

### Memory Management
- Connections stored in-memory Map for fast access
- Backend persistence for permanent storage
- Automatic deduplication prevents memory bloat

### Optimization Patterns
```javascript
// Batch connection analysis for better performance
const analyzeMultipleConnections = (scopeItems) => {
  return scopeItems.map(item => ({
    scopeItem: item,
    connections: this.getConnectionsForScope(item.id),
    analysis: this.analyzeScopeItemDependencies(item)
  }));
};
```

## Troubleshooting

### Connection Not Appearing
1. Check if connection exists in memory: `connectionService.connections.get(connectionId)`
2. Verify backend auto-linking: Check `drawing.scopeItemIds` array
3. Refresh component state: Re-fetch connections after creation

### Production Still Blocked
1. Verify all required connections exist
2. Check approval status of connected drawings/specs
3. Review business rule conditions for scope item category

### Performance Issues
1. Monitor connection Map size: `connectionService.connections.size`
2. Check for duplicate connections causing memory bloat
3. Implement connection cleanup for deleted entities

## Change Log

### Version 1.0.0 (Current)
- Initial connection management system
- Support for scope-to-drawing and scope-to-material connections
- Integration with dependency engine and workflow dashboard
- Auto-linking with backend data

### Planned Features
- Connection versioning and history
- Bulk connection operations
- Connection templates for common patterns
- Advanced connection analytics

---

**Next**: [Dependency Engine Documentation](./dependency-engine.md)