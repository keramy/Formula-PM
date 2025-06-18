/**
 * Connection Service - Manages relationships between scope items, shop drawings, and material specifications
 */

import apiService from './api/apiService';
import { PerformanceMonitor } from '../utils/performance';

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
          condition: (scopeItem) => {
            // Check if scope item requires shop drawings based on category/type
            const category = scopeItem.category?.toLowerCase() || '';
            return category.includes('cabinet') || category.includes('millwork') || 
                   category.includes('custom') || scopeItem.shopDrawingRequired === true;
          },
          message: "Shop drawing approval required before production"
        },
        materialSpecRequired: {
          condition: (scopeItem) => {
            // Most items require material specifications
            return scopeItem.materialSpecRequired !== false; // Default to true unless explicitly false
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

  getConnectedDrawings(scopeItemId, allDrawings = []) {
    // First check in-memory connections
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

    // Also check if drawings are linked by scopeItemIds in the backend data
    const linkedDrawings = allDrawings
      .filter(drawing => drawing.scopeItemIds?.includes(scopeItemId))
      .map(drawing => ({
        connectionId: `auto_${scopeItemId}_${drawing.id}`,
        drawingId: drawing.id,
        notes: 'Auto-linked from backend',
        createdAt: drawing.createdAt || new Date().toISOString(),
        drawing
      }));

    // Combine and deduplicate
    const allConnected = [...connectedDrawings, ...linkedDrawings];
    const unique = allConnected.filter((item, index, self) => 
      index === self.findIndex(t => t.drawingId === item.drawingId)
    );

    return unique;
  }

  getConnectedMaterialSpecs(scopeItemId, allSpecs = []) {
    // First check in-memory connections
    const connections = this.getConnections('scope', scopeItemId);
    const connectedSpecs = connections
      .filter(conn => conn.targetType === 'material')
      .map(conn => {
        const spec = allSpecs.find(s => s.id === conn.targetId);
        return spec ? {
          connectionId: conn.id,
          specId: conn.targetId,
          notes: conn.notes,
          createdAt: conn.createdAt,
          spec
        } : null;
      })
      .filter(Boolean);

    // Also check if specs are linked by scopeItemIds in the backend data
    const linkedSpecs = allSpecs
      .filter(spec => spec.scopeItemIds?.includes(scopeItemId))
      .map(spec => ({
        connectionId: `auto_${scopeItemId}_${spec.id}`,
        specId: spec.id,
        notes: 'Auto-linked from backend',
        createdAt: spec.createdAt || new Date().toISOString(),
        spec
      }));

    // Combine and deduplicate
    const allConnected = [...connectedSpecs, ...linkedSpecs];
    const unique = allConnected.filter((item, index, self) => 
      index === self.findIndex(t => t.specId === item.specId)
    );

    return unique;
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

    // Get connected items (now includes backend auto-linking)
    analysis.connections.drawings = this.getConnectedDrawings(scopeItem.id, shopDrawings);
    analysis.connections.materials = this.getConnectedMaterialSpecs(scopeItem.id, materialSpecs);

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
      const category = item.category?.toLowerCase() || '';
      const description = item.description?.toLowerCase() || '';
      
      if (category.includes('construction') || category.includes('structural') || 
          category.includes('demolition') || category.includes('flooring') ||
          description.includes('construction') || description.includes('structural')) {
        groups.construction.push(item);
      } else if (category.includes('millwork') || category.includes('cabinet') || 
                 category.includes('carpentry') || category.includes('woodwork') ||
                 description.includes('cabinet') || description.includes('millwork')) {
        groups.millwork.push(item);
      } else if (category.includes('electrical') || category.includes('lighting') || 
                 category.includes('power') || category.includes('electric') ||
                 description.includes('electrical') || description.includes('lighting')) {
        groups.electric.push(item);
      } else if (category.includes('mep') || category.includes('hvac') || 
                 category.includes('plumbing') || category.includes('mechanical') ||
                 description.includes('hvac') || description.includes('mechanical')) {
        groups.mep.push(item);
      } else {
        // Default to construction if no clear category
        groups.construction.push(item);
      }
    });

    // Calculate progress for each group
    const progress = {};
    Object.entries(groups).forEach(([groupKey, items]) => {
      if (items.length === 0) {
        progress[groupKey] = 0;
      } else {
        // Calculate progress based on item progress values or completion status
        const totalProgress = items.reduce((sum, item) => {
          if (item.progress !== undefined) {
            return sum + (item.progress || 0);
          } else if (item.status === 'completed') {
            return sum + 100;
          } else if (item.status === 'in-progress') {
            return sum + 50;
          } else {
            return sum + 0;
          }
        }, 0);
        
        progress[groupKey] = Math.round(totalProgress / items.length);
      }
    });

    return progress;
  }

  // Workflow Analysis
  async getWorkflowStatusAsync(projectId) {
    const startTime = performance.now();
    
    try {
      // Fetch all data from backend
      PerformanceMonitor.startMeasurement('workflowDataFetch');
      const [scopeItems, shopDrawings, materialSpecs] = await Promise.all([
        apiService.getScopeItems(projectId),
        apiService.getShopDrawings(projectId),
        apiService.getMaterialSpecifications({ projectId })
      ]);
      PerformanceMonitor.endMeasurement('workflowDataFetch');

      const result = this.getWorkflowStatus(projectId, scopeItems, shopDrawings, materialSpecs);
      
      // Track workflow analysis performance
      const duration = performance.now() - startTime;
      PerformanceMonitor.trackFormulaPMOperation('workflowAnalysis', duration, {
        projectId,
        scopeItemsCount: scopeItems.length,
        shopDrawingsCount: shopDrawings.length,
        materialSpecsCount: materialSpecs.length
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      PerformanceMonitor.trackFormulaPMOperation('workflowAnalysis', duration, {
        projectId,
        error: error.message,
        success: false
      });
      
      console.error('Error fetching workflow data:', error);
      // Return empty analysis if backend fails
      return this.getWorkflowStatus(projectId, [], [], []);
    }
  }

  getWorkflowStatus(projectId, scopeItems, shopDrawings, materialSpecs) {
    PerformanceMonitor.startMeasurement('workflowAnalysisCalculation');
    
    const analysis = this.analyzeDependencies(scopeItems, shopDrawings, materialSpecs);
    
    const result = {
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

    PerformanceMonitor.endMeasurement('workflowAnalysisCalculation');
    return result;
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