/**
 * Connection Service - Manages relationships between scope items, shop drawings, and material specifications
 */

class ConnectionService {
  constructor() {
    this.connections = new Map(); // Store connections in memory (would be API calls in production)
    this.dependencyRules = this.initializeDependencyRules();
  }

  initializeDependencyRules() {
    return {
      // Rules for what dependencies are required before production can start
      productionBlockers: {
        shopDrawingRequired: {
          condition: (scopeItem) => scopeItem.shopDrawingRequired === true,
          blockedBy: (scopeItem, connections) => {
            const drawings = this.getConnectedDrawings(scopeItem.id);
            return drawings.filter(d => d.status !== 'approved').length > 0;
          },
          message: "Shop drawing approval required before production"
        },
        materialSpecRequired: {
          condition: (scopeItem) => scopeItem.materialSpecRequired === true,
          blockedBy: (scopeItem, connections) => {
            const specs = this.getConnectedMaterialSpecs(scopeItem.id);
            return specs.filter(s => s.status !== 'approved').length > 0;
          },
          message: "Material specification approval required before production"
        }
      },
      
      // Rules for scope group dependencies
      groupDependencies: {
        construction: {
          dependsOn: [],
          blocks: ['millwork', 'electric', 'mep']
        },
        millwork: {
          dependsOn: ['construction'],
          blocks: []
        },
        electric: {
          dependsOn: ['construction'],
          blocks: []
        },
        mep: {
          dependsOn: ['construction'], 
          blocks: []
        }
      }
    };
  }

  // Connection Management
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

  removeConnection(connectionId) {
    return this.connections.delete(connectionId);
  }

  getConnections(sourceType, sourceId) {
    return Array.from(this.connections.values()).filter(
      conn => conn.sourceType === sourceType && conn.sourceId === sourceId
    );
  }

  // Scope Item Connections
  connectScopeToDrawing(scopeItemId, drawingId, notes = '') {
    return this.createConnection('scope', scopeItemId, 'drawing', drawingId, { notes });
  }

  connectScopeToMaterialSpec(scopeItemId, specId, notes = '') {
    return this.createConnection('scope', scopeItemId, 'material', specId, { notes });
  }

  getConnectedDrawings(scopeItemId) {
    const connections = this.getConnections('scope', scopeItemId);
    return connections
      .filter(conn => conn.targetType === 'drawing')
      .map(conn => ({
        connectionId: conn.id,
        drawingId: conn.targetId,
        notes: conn.notes,
        createdAt: conn.createdAt
      }));
  }

  getConnectedMaterialSpecs(scopeItemId) {
    const connections = this.getConnections('scope', scopeItemId);
    return connections
      .filter(conn => conn.targetType === 'material')
      .map(conn => ({
        connectionId: conn.id,
        specId: conn.targetId,
        notes: conn.notes,
        createdAt: conn.createdAt
      }));
  }

  // Dependency Analysis
  analyzeDependencies(scopeItems, shopDrawings, materialSpecs) {
    const analysis = {
      blockers: [],
      warnings: [],
      ready: [],
      groupDependencies: this.analyzeGroupDependencies(scopeItems)
    };

    scopeItems.forEach(item => {
      const itemAnalysis = this.analyzeScopeItemDependencies(item, shopDrawings, materialSpecs);
      
      if (itemAnalysis.isBlocked) {
        analysis.blockers.push({
          scopeItem: item,
          ...itemAnalysis
        });
      } else if (itemAnalysis.hasWarnings) {
        analysis.warnings.push({
          scopeItem: item,
          ...itemAnalysis
        });
      } else {
        analysis.ready.push({
          scopeItem: item,
          ...itemAnalysis
        });
      }
    });

    return analysis;
  }

  analyzeScopeItemDependencies(scopeItem, shopDrawings = [], materialSpecs = []) {
    const analysis = {
      isBlocked: false,
      hasWarnings: false,
      blockers: [],
      warnings: [],
      connections: {
        drawings: [],
        materials: []
      }
    };

    // Get connected items
    const connectedDrawings = this.getConnectedDrawings(scopeItem.id);
    const connectedSpecs = this.getConnectedMaterialSpecs(scopeItem.id);

    // Populate actual connected items
    analysis.connections.drawings = connectedDrawings.map(conn => {
      const drawing = shopDrawings.find(d => d.id === conn.drawingId);
      return { ...conn, drawing };
    }).filter(conn => conn.drawing);

    analysis.connections.materials = connectedSpecs.map(conn => {
      const spec = materialSpecs.find(s => s.id === conn.specId);
      return { ...conn, spec };
    }).filter(conn => conn.spec);

    // Check production blockers
    Object.entries(this.dependencyRules.productionBlockers).forEach(([ruleKey, rule]) => {
      if (rule.condition(scopeItem)) {
        if (ruleKey === 'shopDrawingRequired') {
          const unapprovedDrawings = analysis.connections.drawings.filter(
            conn => conn.drawing.status !== 'approved'
          );
          
          if (scopeItem.shopDrawingRequired && analysis.connections.drawings.length === 0) {
            analysis.isBlocked = true;
            analysis.blockers.push({
              type: 'missing_shop_drawing',
              message: "Shop drawing connection required",
              severity: 'error'
            });
          } else if (unapprovedDrawings.length > 0) {
            analysis.isBlocked = true;
            analysis.blockers.push({
              type: 'unapproved_shop_drawing',
              message: "Shop drawing approval required before production",
              severity: 'error',
              count: unapprovedDrawings.length
            });
          }
        }
        
        if (ruleKey === 'materialSpecRequired') {
          const unapprovedSpecs = analysis.connections.materials.filter(
            conn => conn.spec.status !== 'approved'
          );
          
          if (scopeItem.materialSpecRequired && analysis.connections.materials.length === 0) {
            analysis.isBlocked = true;
            analysis.blockers.push({
              type: 'missing_material_spec',
              message: "Material specification connection required",
              severity: 'error'
            });
          } else if (unapprovedSpecs.length > 0) {
            analysis.isBlocked = true;
            analysis.blockers.push({
              type: 'unapproved_material_spec',
              message: "Material specification approval required before production",
              severity: 'error',
              count: unapprovedSpecs.length
            });
          }
        }
      }
    });

    // Check for warnings
    if (scopeItem.progress > 0 && analysis.isBlocked) {
      analysis.hasWarnings = true;
      analysis.warnings.push({
        type: 'progress_with_blockers',
        message: "Item has progress but has production blockers",
        severity: 'warning'
      });
    }

    return analysis;
  }

  analyzeGroupDependencies(scopeItems) {
    const groupProgress = this.calculateGroupProgress(scopeItems);
    const dependencies = {};

    Object.entries(this.dependencyRules.groupDependencies).forEach(([groupKey, rules]) => {
      const dependencyAnalysis = {
        canStart: true,
        blockedBy: [],
        blocking: [],
        progress: groupProgress[groupKey] || 0
      };

      // Check if dependencies are met
      rules.dependsOn.forEach(depGroup => {
        const depProgress = groupProgress[depGroup] || 0;
        if (depProgress < 100) {
          dependencyAnalysis.canStart = false;
          dependencyAnalysis.blockedBy.push({
            group: depGroup,
            progress: depProgress,
            remaining: 100 - depProgress
          });
        }
      });

      // Check what this group is blocking
      rules.blocks.forEach(blockedGroup => {
        const blockedProgress = groupProgress[blockedGroup] || 0;
        if (blockedProgress > 0 && groupProgress[groupKey] < 100) {
          dependencyAnalysis.blocking.push({
            group: blockedGroup,
            progress: blockedProgress
          });
        }
      });

      dependencies[groupKey] = dependencyAnalysis;
    });

    return dependencies;
  }

  calculateGroupProgress(scopeItems) {
    const groups = {
      construction: [],
      millwork: [],
      electric: [],
      mep: []
    };

    // Group scope items by category
    scopeItems.forEach(item => {
      const category = item.category?.toLowerCase();
      if (category?.includes('construction') || category?.includes('structural') || 
          category?.includes('demolition') || category?.includes('flooring')) {
        groups.construction.push(item);
      } else if (category?.includes('millwork') || category?.includes('cabinet') || 
                 category?.includes('carpentry')) {
        groups.millwork.push(item);
      } else if (category?.includes('electrical') || category?.includes('lighting') || 
                 category?.includes('power')) {
        groups.electric.push(item);
      } else if (category?.includes('mep') || category?.includes('hvac') || 
                 category?.includes('plumbing') || category?.includes('mechanical')) {
        groups.mep.push(item);
      }
    });

    // Calculate progress for each group
    const progress = {};
    Object.entries(groups).forEach(([groupKey, items]) => {
      if (items.length === 0) {
        progress[groupKey] = 0;
      } else {
        const completedItems = items.filter(item => item.status === 'completed').length;
        progress[groupKey] = Math.round((completedItems / items.length) * 100);
      }
    });

    return progress;
  }

  // Workflow Analysis
  getWorkflowStatus(projectId, scopeItems, shopDrawings, materialSpecs) {
    const analysis = this.analyzeDependencies(scopeItems, shopDrawings, materialSpecs);
    
    return {
      projectId,
      timestamp: new Date().toISOString(),
      summary: {
        totalItems: scopeItems.length,
        readyItems: analysis.ready.length,
        blockedItems: analysis.blockers.length,
        warningItems: analysis.warnings.length,
        canStartProduction: analysis.blockers.length === 0
      },
      details: analysis,
      recommendations: this.generateRecommendations(analysis)
    };
  }

  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.blockers.length > 0) {
      recommendations.push({
        type: 'urgent',
        title: `${analysis.blockers.length} items blocked from production`,
        description: 'Review and resolve blocking issues to proceed with production',
        actions: ['Review shop drawing approvals', 'Check material specification status']
      });
    }

    if (analysis.warnings.length > 0) {
      recommendations.push({
        type: 'warning',
        title: `${analysis.warnings.length} items have warnings`,
        description: 'Address warnings to ensure smooth production flow',
        actions: ['Review item progress vs dependencies', 'Verify connection accuracy']
      });
    }

    // Group dependency recommendations
    Object.entries(analysis.groupDependencies).forEach(([groupKey, deps]) => {
      if (!deps.canStart && deps.progress > 0) {
        recommendations.push({
          type: 'dependency',
          title: `${groupKey} group started prematurely`,
          description: `This group depends on: ${deps.blockedBy.map(b => b.group).join(', ')}`,
          actions: ['Review group dependencies', 'Adjust project timeline']
        });
      }
    });

    return recommendations;
  }
}

// Create singleton instance
const connectionService = new ConnectionService();
export default connectionService;