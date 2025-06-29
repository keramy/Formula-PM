# Dependency Engine

## Overview

The Dependency Engine is the sophisticated business logic that enforces construction industry workflows in Formula PM. It implements a **three-group dependency system** (Construction → Millwork → MEP) and validates production readiness based on shop drawing and material specification approvals.

## Architecture

### Three-Group Construction Workflow
```javascript
// Core Dependency Rules - Construction Industry Standard
groupDependencies: {
  construction: {
    dependsOn: [],                    // Can start immediately
    blocks: ['millwork', 'mep']       // Must complete before millwork/MEP
  },
  millwork: {
    dependsOn: ['construction'],      // Requires construction foundation
    blocks: []                        // Doesn't block other groups
  },
  mep: {
    dependsOn: ['construction'],      // Requires construction foundation  
    blocks: []                        // Doesn't block other groups
  }
}
```

### Production Blocker Rules
```javascript
// Production Requirements - Industry Standards
productionBlockers: {
  shopDrawingRequired: {
    condition: (scopeItem) => {
      const category = scopeItem.category?.toLowerCase() || '';
      return category.includes('cabinet') || 
             category.includes('millwork') || 
             category.includes('custom') || 
             scopeItem.shopDrawingRequired === true;
    },
    message: "Shop drawing approval required before production"
  },
  materialSpecRequired: {
    condition: (scopeItem) => {
      return scopeItem.materialSpecRequired !== false; // Default true
    },
    message: "Material specification approval required before production"
  }
}
```

## Core Business Logic

### Dependency Analysis Engine
```javascript
// File: src/services/connectionService.js
analyzeDependencies(scopeItems, shopDrawings, materialSpecs) {
  const analysis = {
    blockers: [],        // Items blocking production
    warnings: [],        // Items with warnings
    ready: [],          // Items ready for production
    groupDependencies: this.analyzeGroupDependencies(scopeItems)
  };

  scopeItems.forEach(item => {
    const itemAnalysis = this.analyzeScopeItemDependencies(
      item, shopDrawings, materialSpecs
    );
    
    if (itemAnalysis.isBlocked) {
      analysis.blockers.push({ scopeItem: item, ...itemAnalysis });
    } else if (itemAnalysis.hasWarnings) {
      analysis.warnings.push({ scopeItem: item, ...itemAnalysis });
    } else {
      analysis.ready.push({ scopeItem: item, ...itemAnalysis });
    }
  });

  return analysis;
}
```

## Group Dependency System

### Group Classification Logic
```javascript
calculateGroupProgress(scopeItems) {
  const groups = { construction: [], millwork: [], mep: [] };

  scopeItems.forEach(item => {
    const category = item.category?.toLowerCase() || '';
    const description = item.description?.toLowerCase() || '';
    
    if (this.isConstructionItem(category, description)) {
      groups.construction.push(item);
    } else if (this.isMillworkItem(category, description)) {
      groups.millwork.push(item);
    } else if (this.isMEPItem(category, description)) {
      groups.mep.push(item);
    } else {
      groups.construction.push(item); // Default to construction
    }
  });

  return this.calculateProgressForGroups(groups);
}
```

## Troubleshooting

### Group Dependencies Not Working
1. Check scope item categorization logic
2. Verify progress calculation for each group
3. Review dependency rules configuration

### Production Blockers Not Detected
1. Verify connection system is working correctly
2. Check shop drawing/material spec approval status
3. Review production blocker conditions

### Performance Issues
1. Monitor analysis duration for large projects
2. Implement caching for repeated analyses
3. Optimize group classification logic

---

**Next**: [Production Readiness Workflow Documentation](./production-readiness.md)