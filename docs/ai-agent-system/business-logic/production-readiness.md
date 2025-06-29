# Production Readiness Workflow

## Overview

The Production Readiness Workflow is the complete end-to-end process that determines when scope items can proceed to production in Formula PM. It integrates the Connection System and Dependency Engine to enforce construction industry standards.

## Complete Workflow Process

### Stage 1: Scope Item Creation
```javascript
// Scope item with production requirements
scopeItem = {
  id: "scope_123",
  description: "Custom kitchen cabinets",
  category: "millwork",
  shopDrawingRequired: true,      // Industry requirement for millwork
  materialSpecRequired: true,     // Standard requirement
  progress: 0,                    // Initial state
  status: "not-started"
}
```

### Stage 2: Connection Assignment
```javascript
// Required connections for production readiness
requiredConnections = {
  shopDrawings: [
    {
      drawingId: "drawing_456",
      status: "pending",           // Must be "approved" for production
      type: "cabinet_details"
    }
  ],
  materialSpecs: [
    {
      specId: "spec_789", 
      status: "pending",           // Must be "approved" for production
      type: "wood_specifications"
    }
  ]
}
```

### Stage 3: Approval Workflow
```javascript
// Shop drawing approval process
shopDrawing.status = "under-review" → "revision-required" → "approved"

// Material specification approval process  
materialSpec.status = "pending" → "under-review" → "approved"
```

### Stage 4: Production Readiness Analysis
```javascript
const analysis = connectionService.analyzeScopeItemDependencies(
  scopeItem,
  shopDrawings,
  materialSpecs
);

// Result determines production status
if (!analysis.isBlocked) {
  scopeItem.canStartProduction = true;
} else {
  scopeItem.productionBlockers = analysis.blockers;
}
```

## Business Rules Implementation

### Millwork Items (Highest Requirements)
```javascript
// Example: Kitchen cabinets
const millworkItem = {
  category: "millwork",
  shopDrawingRequired: true,      // Always required
  materialSpecRequired: true,     // Always required
  customHardware: true           // May require additional approvals
};

// Production blockers for millwork
const blockers = [
  "Shop drawing approval required",
  "Material specification approval required", 
  "Hardware specification approval required"
];
```

### Construction Items (Foundation Work)
```javascript
// Example: Structural work
const constructionItem = {
  category: "construction", 
  shopDrawingRequired: false,     // Usually not required
  materialSpecRequired: true,     // Standard materials only
  dependsOn: []                  // Can start immediately
};

// Blocks other groups until complete
const blockedGroups = ["millwork", "mep"];
```

### MEP Items (Dependent on Construction)
```javascript
// Example: HVAC installation
const mepItem = {
  category: "mep",
  shopDrawingRequired: false,     // Standard installations
  materialSpecRequired: true,     // Equipment specifications
  dependsOn: ["construction"]    // Requires structure in place
};
```

## Workflow State Machine

### State Transitions
```javascript
const workflowStates = {
  'not-started': {
    canTransitionTo: ['in-design'],
    requirements: []
  },
  'in-design': {
    canTransitionTo: ['pending-approval', 'revision-required'],
    requirements: ['shop_drawing_created', 'material_spec_created']
  },
  'pending-approval': {
    canTransitionTo: ['approved', 'revision-required'],
    requirements: ['connections_established']
  },
  'revision-required': {
    canTransitionTo: ['pending-approval'],
    requirements: ['revisions_completed']
  },
  'approved': {
    canTransitionTo: ['ready-for-production'],
    requirements: ['all_dependencies_met']
  },
  'ready-for-production': {
    canTransitionTo: ['in-production'],
    requirements: ['group_dependencies_satisfied']
  },
  'in-production': {
    canTransitionTo: ['completed'],
    requirements: []
  },
  'completed': {
    canTransitionTo: [],
    requirements: []
  }
};
```

### State Validation
```javascript
validateStateTransition(currentState, targetState, scopeItem) {
  const stateConfig = workflowStates[currentState];
  
  if (!stateConfig.canTransitionTo.includes(targetState)) {
    throw new Error(`Cannot transition from ${currentState} to ${targetState}`);
  }
  
  const unmetRequirements = stateConfig.requirements.filter(req => 
    !this.checkRequirement(req, scopeItem)
  );
  
  if (unmetRequirements.length > 0) {
    throw new Error(`Unmet requirements: ${unmetRequirements.join(', ')}`);
  }
  
  return true;
}
```

## Group Coordination Workflow

### Construction → Millwork → MEP Sequence
```javascript
const groupWorkflow = {
  phase1: {
    group: 'construction',
    description: 'Foundation and structural work',
    requirements: [],
    blocks: ['millwork', 'mep'],
    typicalDuration: '4-6 weeks'
  },
  phase2: {
    group: 'millwork', 
    description: 'Custom millwork and cabinetry',
    requirements: ['construction_75_percent_complete'],
    blocks: [],
    typicalDuration: '6-8 weeks'
  },
  phase3: {
    group: 'mep',
    description: 'Mechanical, electrical, plumbing',
    requirements: ['construction_75_percent_complete'],
    blocks: [],
    typicalDuration: '3-4 weeks'
  }
};
```

### Group Readiness Check
```javascript
checkGroupReadiness(groupName, allScopeItems) {
  const groupItems = this.getItemsByGroup(groupName, allScopeItems);
  const dependencies = this.dependencyRules.groupDependencies[groupName];
  
  // Check if dependent groups are sufficiently complete
  const dependencyCheck = dependencies.dependsOn.every(depGroup => {
    const depProgress = this.getGroupProgress(depGroup, allScopeItems);
    return depProgress >= 75; // 75% threshold for dependent work
  });
  
  if (!dependencyCheck) {
    return {
      canStart: false,
      reason: `Dependent groups not ready: ${dependencies.dependsOn.join(', ')}`
    };
  }
  
  // Check if group items are individually ready
  const readyItems = groupItems.filter(item => 
    !this.isProductionBlocked(item)
  );
  
  return {
    canStart: readyItems.length > 0,
    readyCount: readyItems.length,
    totalCount: groupItems.length,
    readyItems
  };
}
```

## Production Dashboard Integration

### Real-time Status Updates
```javascript
// File: src/features/projects/components/WorkflowDashboard.jsx
const updateProductionStatus = async () => {
  const workflowStatus = await connectionService.getWorkflowStatusAsync(project.id);
  
  setProductionMetrics({
    totalItems: workflowStatus.summary.totalItems,
    readyForProduction: workflowStatus.summary.readyItems,
    blocked: workflowStatus.summary.blockedItems,
    productionReadiness: (workflowStatus.summary.readyItems / workflowStatus.summary.totalItems) * 100
  });
  
  setGroupStatus(workflowStatus.details.groupDependencies);
};
```

### Production Readiness Visualization
```javascript
const renderProductionReadiness = () => {
  const readinessPercentage = (productionMetrics.readyForProduction / productionMetrics.totalItems) * 100;
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Production Readiness</Typography>
        <LinearProgress 
          variant="determinate" 
          value={readinessPercentage}
          sx={{
            height: 8,
            backgroundColor: readinessPercentage === 100 ? '#4caf50' : '#ff9800'
          }}
        />
        <Typography variant="body2">
          {productionMetrics.readyForProduction} of {productionMetrics.totalItems} items ready
        </Typography>
        
        {productionMetrics.blocked > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {productionMetrics.blocked} items are blocking production
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
```

## Error Prevention Strategies

### Common Workflow Errors
1. **Starting millwork before construction foundation**
2. **Missing shop drawing approvals for custom items**
3. **Proceeding without material specifications**
4. **Group dependency violations**

### Prevention Mechanisms
```javascript
const preventWorkflowErrors = {
  // Prevent premature group starts
  validateGroupStart: (groupName, currentProgress) => {
    const dependencies = this.dependencyRules.groupDependencies[groupName];
    const unmetDeps = dependencies.dependsOn.filter(dep => 
      currentProgress[dep] < 75
    );
    
    if (unmetDeps.length > 0) {
      throw new WorkflowError(
        `Cannot start ${groupName} - incomplete dependencies: ${unmetDeps.join(', ')}`
      );
    }
  },
  
  // Validate production requirements
  validateProductionStart: (scopeItem) => {
    const analysis = this.analyzeScopeItemDependencies(scopeItem);
    
    if (analysis.isBlocked) {
      const blockerMessages = analysis.blockers.map(b => b.message);
      throw new ProductionError(
        `Cannot start production: ${blockerMessages.join(', ')}`
      );
    }
  },
  
  // Check approval workflows
  validateApprovals: (scopeItem, connections) => {
    const requiredApprovals = [];
    
    if (scopeItem.shopDrawingRequired) {
      const unapprovedDrawings = connections.drawings.filter(d => 
        d.drawing.status !== 'approved'
      );
      if (unapprovedDrawings.length > 0) {
        requiredApprovals.push(`${unapprovedDrawings.length} shop drawing approvals`);
      }
    }
    
    if (scopeItem.materialSpecRequired) {
      const unapprovedSpecs = connections.materials.filter(m => 
        m.spec.status !== 'approved'
      );
      if (unapprovedSpecs.length > 0) {
        requiredApprovals.push(`${unapprovedSpecs.length} material spec approvals`);
      }
    }
    
    if (requiredApprovals.length > 0) {
      throw new ApprovalError(
        `Missing approvals: ${requiredApprovals.join(', ')}`
      );
    }
  }
};
```

## Performance Optimization

### Workflow Caching
```javascript
class WorkflowCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes
  }
  
  getCachedWorkflowStatus(projectId) {
    const cached = this.cache.get(projectId);
    if (cached && (Date.now() - cached.timestamp) < this.ttl) {
      return cached.data;
    }
    return null;
  }
  
  setCachedWorkflowStatus(projectId, data) {
    this.cache.set(projectId, {
      data,
      timestamp: Date.now()
    });
  }
}
```

### Batch Processing
```javascript
const batchAnalyzeProduction = async (projectIds) => {
  const results = await Promise.all(
    projectIds.map(async (projectId) => {
      try {
        return await connectionService.getWorkflowStatusAsync(projectId);
      } catch (error) {
        console.error(`Error analyzing project ${projectId}:`, error);
        return null;
      }
    })
  );
  
  return results.filter(Boolean);
};
```

## Testing and Validation

### Workflow Testing Patterns
```javascript
describe('Production Readiness Workflow', () => {
  test('millwork item requires shop drawing approval', async () => {
    const millworkItem = createTestScopeItem({ category: 'millwork' });
    const unapprovedDrawing = createTestDrawing({ status: 'pending' });
    
    const analysis = connectionService.analyzeScopeItemDependencies(
      millworkItem,
      [unapprovedDrawing],
      []
    );
    
    expect(analysis.isBlocked).toBe(true);
    expect(analysis.blockers).toContainEqual(
      expect.objectContaining({
        type: 'unapproved_shop_drawing'
      })
    );
  });
  
  test('construction group can start immediately', () => {
    const constructionItems = [createTestScopeItem({ category: 'construction' })];
    const groupAnalysis = connectionService.analyzeGroupDependencies(constructionItems);
    
    expect(groupAnalysis.construction.canStart).toBe(true);
    expect(groupAnalysis.construction.blockedBy).toHaveLength(0);
  });
});
```

## Change Log

### Version 1.0.0 (Current)
- Complete production readiness workflow
- Three-group dependency coordination
- State machine workflow management
- Error prevention mechanisms

### Planned Features
- Automated workflow notifications
- Integration with project scheduling
- Advanced workflow analytics
- Custom workflow templates

---

**Next**: [Component Architecture Documentation](../components/README.md)