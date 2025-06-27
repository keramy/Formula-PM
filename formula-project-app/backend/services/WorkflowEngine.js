/**
 * Formula PM Workflow Engine
 * Advanced workflow management with scope→drawing→material connections, 
 * production readiness analysis, and dependency tracking
 */

const { PrismaClient } = require('@prisma/client');
const cacheService = require('./cacheService');
const auditService = require('./auditService');
const _ = require('lodash');

const prisma = new PrismaClient();

class WorkflowEngine {
  constructor() {
    this.config = {
      cacheTTL: 180, // 3 minutes
      maxConnectionDepth: 10,
      productionReadinessRules: {
        requiredDrawingStatus: ['approved'],
        requiredMaterialStatus: ['in_stock', 'delivered'],
        minimumCompletionPercentage: 100
      },
      blockerTypes: {
        missing_drawing: 'Missing approved shop drawing',
        material_not_ready: 'Materials not available',
        dependency_incomplete: 'Dependent scope item incomplete',
        approval_pending: 'Approval pending',
        resource_conflict: 'Resource scheduling conflict'
      }
    };
  }

  /**
   * Create workflow connection between scope, drawing, and material
   */
  async createWorkflowConnection(connectionData, createdBy) {
    try {
      const {
        scopeItemId,
        shopDrawingId = null,
        materialSpecId = null,
        connectionType = 'standard',
        notes = null
      } = connectionData;

      // Validate scope item exists
      const scopeItem = await prisma.scopeItem.findUnique({
        where: { id: scopeItemId },
        include: { project: true }
      });
      if (!scopeItem) {
        throw new Error('Scope item not found');
      }

      // Validate shop drawing if provided
      if (shopDrawingId) {
        const drawing = await prisma.shopDrawing.findUnique({
          where: { id: shopDrawingId }
        });
        if (!drawing || drawing.projectId !== scopeItem.projectId) {
          throw new Error('Invalid shop drawing for this project');
        }
      }

      // Validate material spec if provided
      if (materialSpecId) {
        const material = await prisma.materialSpecification.findUnique({
          where: { id: materialSpecId }
        });
        if (!material || material.projectId !== scopeItem.projectId) {
          throw new Error('Invalid material specification for this project');
        }
      }

      // Create workflow connection
      const connection = await prisma.workflowConnection.create({
        data: {
          scopeItemId,
          shopDrawingId,
          materialSpecId,
          connectionType,
          notes
        }
      });

      // Log workflow connection creation
      await auditService.logDataChange({
        tableName: 'workflow_connections',
        recordId: connection.id,
        action: 'create',
        newValues: connection,
        userId: createdBy
      });

      // Update project workflow analysis
      await this.updateProjectWorkflowAnalysis(scopeItem.projectId);

      return connection;
    } catch (error) {
      console.error('❌ Workflow connection creation error:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive workflow analysis for a project
   */
  async analyzeWorkflow(projectId) {
    try {
      const cacheKey = cacheService.generateKey('project', projectId, 'workflow_analysis');
      
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const [connections, scopeItems, drawings, materials] = await Promise.all([
        this.getProjectConnections(projectId),
        this.getScopeItems(projectId),
        this.getProjectDrawings(projectId),
        this.getProjectMaterials(projectId)
      ]);

      const analysis = {
        overview: {
          totalScopeItems: scopeItems.length,
          connectedItems: connections.length,
          disconnectedItems: scopeItems.length - connections.length,
          connectionRate: scopeItems.length > 0 ? Math.round((connections.length / scopeItems.length) * 100) : 0
        },
        readiness: await this.analyzeProductionReadiness(connections, scopeItems, drawings, materials),
        blockers: await this.identifyBlockers(connections, scopeItems, drawings, materials),
        recommendations: await this.generateRecommendations(scopeItems, connections, drawings, materials),
        workflow: await this.buildWorkflowMap(connections, scopeItems, drawings, materials),
        timeline: await this.analyzeWorkflowTimeline(projectId)
      };

      // Cache analysis for 3 minutes
      await cacheService.set(cacheKey, analysis, this.config.cacheTTL);

      return analysis;
    } catch (error) {
      console.error('❌ Workflow analysis error:', error);
      throw error;
    }
  }

  /**
   * Get all workflow connections for a project
   */
  async getProjectConnections(projectId) {
    return await prisma.workflowConnection.findMany({
      where: {
        scopeItem: { projectId }
      },
      include: {
        scopeItem: {
          select: {
            id: true,
            name: true,
            status: true,
            completionPercentage: true
          }
        },
        shopDrawing: {
          select: {
            id: true,
            fileName: true,
            status: true,
            version: true,
            approvedDate: true
          }
        },
        materialSpec: {
          select: {
            id: true,
            description: true,
            status: true,
            quantity: true,
            unitCost: true,
            supplier: true
          }
        }
      }
    });
  }

  /**
   * Get scope items for a project
   */
  async getScopeItems(projectId) {
    return await prisma.scopeItem.findMany({
      where: { projectId },
      include: {
        scopeGroup: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { scopeGroup: { orderIndex: 'asc' } },
        { orderIndex: 'asc' }
      ]
    });
  }

  /**
   * Get project drawings
   */
  async getProjectDrawings(projectId) {
    return await prisma.shopDrawing.findMany({
      where: { projectId },
      orderBy: { uploadDate: 'desc' }
    });
  }

  /**
   * Get project materials
   */
  async getProjectMaterials(projectId) {
    return await prisma.materialSpecification.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Analyze production readiness
   */
  async analyzeProductionReadiness(connections, scopeItems, drawings, materials) {
    const readyConnections = [];
    const notReadyConnections = [];
    const readinessRules = this.config.productionReadinessRules;

    for (const connection of connections) {
      const readiness = {
        connectionId: connection.id,
        scopeItemId: connection.scopeItemId,
        scopeItemName: connection.scopeItem.name,
        isReady: true,
        issues: []
      };

      // Check scope item completion
      if (connection.scopeItem.completionPercentage < readinessRules.minimumCompletionPercentage) {
        readiness.isReady = false;
        readiness.issues.push(`Scope item only ${connection.scopeItem.completionPercentage}% complete`);
      }

      // Check drawing status
      if (connection.shopDrawing) {
        if (!readinessRules.requiredDrawingStatus.includes(connection.shopDrawing.status)) {
          readiness.isReady = false;
          readiness.issues.push(`Drawing status is ${connection.shopDrawing.status}, needs approval`);
        }
      } else {
        // Check if drawing is required but missing
        readiness.isReady = false;
        readiness.issues.push('No shop drawing attached');
      }

      // Check material status
      if (connection.materialSpec) {
        if (!readinessRules.requiredMaterialStatus.includes(connection.materialSpec.status)) {
          readiness.isReady = false;
          readiness.issues.push(`Material status is ${connection.materialSpec.status}`);
        }
      }

      if (readiness.isReady) {
        readyConnections.push(readiness);
      } else {
        notReadyConnections.push(readiness);
      }
    }

    // Find scope items without connections
    const connectedScopeItemIds = new Set(connections.map(c => c.scopeItemId));
    const unconnectedItems = scopeItems.filter(item => !connectedScopeItemIds.has(item.id));

    return {
      readyForProduction: readyConnections.length,
      notReady: notReadyConnections.length,
      readyConnections,
      notReadyConnections,
      unconnectedItems,
      readinessRate: connections.length > 0 ? Math.round((readyConnections.length / connections.length) * 100) : 0
    };
  }

  /**
   * Identify workflow blockers
   */
  async identifyBlockers(connections, scopeItems, drawings, materials) {
    const blockers = [];
    const blockerTypes = this.config.blockerTypes;

    // Check for missing drawings
    const connectedScopeItems = connections.map(c => c.scopeItemId);
    const scopeItemsWithoutDrawings = scopeItems.filter(item => 
      connectedScopeItems.includes(item.id) && 
      !connections.find(c => c.scopeItemId === item.id && c.shopDrawing)
    );

    scopeItemsWithoutDrawings.forEach(item => {
      blockers.push({
        type: 'missing_drawing',
        severity: 'high',
        description: blockerTypes.missing_drawing,
        scopeItemId: item.id,
        scopeItemName: item.name,
        impact: 'Cannot proceed with production'
      });
    });

    // Check for material availability issues
    connections.forEach(connection => {
      if (connection.materialSpec && 
          ['pending', 'pending_approval'].includes(connection.materialSpec.status)) {
        blockers.push({
          type: 'material_not_ready',
          severity: 'medium',
          description: blockerTypes.material_not_ready,
          scopeItemId: connection.scopeItemId,
          scopeItemName: connection.scopeItem.name,
          materialDescription: connection.materialSpec.description,
          impact: 'Production delay expected'
        });
      }
    });

    // Check for pending approvals
    connections.forEach(connection => {
      if (connection.shopDrawing && 
          ['draft', 'pending', 'revision_required'].includes(connection.shopDrawing.status)) {
        blockers.push({
          type: 'approval_pending',
          severity: connection.shopDrawing.status === 'revision_required' ? 'high' : 'medium',
          description: blockerTypes.approval_pending,
          scopeItemId: connection.scopeItemId,
          scopeItemName: connection.scopeItem.name,
          drawingName: connection.shopDrawing.fileName,
          impact: 'Awaiting design approval'
        });
      }
    });

    // Analyze dependencies (simplified version)
    const dependencyBlockers = await this.analyzeDependencies(scopeItems, connections);
    blockers.push(...dependencyBlockers);

    return {
      total: blockers.length,
      critical: blockers.filter(b => b.severity === 'high').length,
      warning: blockers.filter(b => b.severity === 'medium').length,
      info: blockers.filter(b => b.severity === 'low').length,
      blockers: blockers.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
    };
  }

  /**
   * Analyze scope item dependencies
   */
  async analyzeDependencies(scopeItems, connections) {
    const blockers = [];
    
    // Group scope items by scope group to identify potential dependencies
    const groupedItems = _.groupBy(scopeItems, item => item.scopeGroup.id);
    
    Object.values(groupedItems).forEach(groupItems => {
      // Sort by order index to identify sequence
      const sortedItems = groupItems.sort((a, b) => a.orderIndex - b.orderIndex);
      
      for (let i = 1; i < sortedItems.length; i++) {
        const currentItem = sortedItems[i];
        const previousItem = sortedItems[i - 1];
        
        // If current item is in progress but previous item is not completed
        if (currentItem.status === 'in_progress' && 
            previousItem.completionPercentage < 100) {
          blockers.push({
            type: 'dependency_incomplete',
            severity: 'medium',
            description: this.config.blockerTypes.dependency_incomplete,
            scopeItemId: currentItem.id,
            scopeItemName: currentItem.name,
            dependentOnId: previousItem.id,
            dependentOnName: previousItem.name,
            impact: 'Sequential dependency not met'
          });
        }
      }
    });
    
    return blockers;
  }

  /**
   * Generate workflow recommendations
   */
  async generateRecommendations(scopeItems, connections, drawings, materials) {
    const recommendations = [];

    // Unconnected scope items
    const connectedScopeItemIds = new Set(connections.map(c => c.scopeItemId));
    const unconnectedItems = scopeItems.filter(item => !connectedScopeItemIds.has(item.id));

    if (unconnectedItems.length > 0) {
      recommendations.push({
        type: 'connection',
        priority: 'high',
        title: 'Connect Scope Items to Workflow',
        description: `${unconnectedItems.length} scope items are not connected to drawings or materials`,
        action: 'Create workflow connections for disconnected scope items',
        impact: 'Improve workflow visibility and production readiness tracking'
      });
    }

    // Unused drawings
    const connectedDrawingIds = new Set(connections.map(c => c.shopDrawingId).filter(Boolean));
    const unusedDrawings = drawings.filter(drawing => !connectedDrawingIds.has(drawing.id));

    if (unusedDrawings.length > 0) {
      recommendations.push({
        type: 'optimization',
        priority: 'medium',
        title: 'Connect Unused Drawings',
        description: `${unusedDrawings.length} shop drawings are not connected to scope items`,
        action: 'Review and connect relevant drawings to scope items',
        impact: 'Better workflow organization and drawing utilization'
      });
    }

    // Material optimization
    const materialsByStatus = _.groupBy(materials, 'status');
    if (materialsByStatus.pending && materialsByStatus.pending.length > 5) {
      recommendations.push({
        type: 'procurement',
        priority: 'high',
        title: 'Accelerate Material Procurement',
        description: `${materialsByStatus.pending.length} materials are still pending`,
        action: 'Review and expedite material ordering process',
        impact: 'Reduce production delays and improve timeline adherence'
      });
    }

    // Scope completion optimization
    const inProgressItems = scopeItems.filter(item => item.status === 'in_progress');
    const stuckItems = inProgressItems.filter(item => item.completionPercentage < 50);

    if (stuckItems.length > 0) {
      recommendations.push({
        type: 'progress',
        priority: 'medium',
        title: 'Address Stalled Scope Items',
        description: `${stuckItems.length} scope items are in progress but below 50% completion`,
        action: 'Review and resolve blockers for stalled items',
        impact: 'Improve overall project progress and timeline'
      });
    }

    // Drawing approval bottleneck
    const pendingDrawings = drawings.filter(d => ['pending', 'revision_required'].includes(d.status));
    if (pendingDrawings.length > 3) {
      recommendations.push({
        type: 'approval',
        priority: 'high',
        title: 'Expedite Drawing Approvals',
        description: `${pendingDrawings.length} drawings are waiting for approval`,
        action: 'Prioritize drawing review and approval process',
        impact: 'Unblock production workflow and reduce delays'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Build comprehensive workflow map
   */
  async buildWorkflowMap(connections, scopeItems, drawings, materials) {
    const workflowMap = {
      nodes: [],
      edges: [],
      clusters: []
    };

    // Create scope group clusters
    const scopeGroups = _.groupBy(scopeItems, item => item.scopeGroup.id);
    
    Object.entries(scopeGroups).forEach(([groupId, items], clusterIndex) => {
      if (items.length > 0) {
        workflowMap.clusters.push({
          id: groupId,
          name: items[0].scopeGroup.name,
          items: items.length,
          color: this.getClusterColor(clusterIndex)
        });
      }
    });

    // Add scope item nodes
    scopeItems.forEach(item => {
      workflowMap.nodes.push({
        id: item.id,
        type: 'scope_item',
        name: item.name,
        status: item.status,
        completion: item.completionPercentage,
        cluster: item.scopeGroup.id,
        position: { x: 0, y: 0 } // Will be calculated by frontend
      });
    });

    // Add drawing nodes
    drawings.forEach(drawing => {
      workflowMap.nodes.push({
        id: drawing.id,
        type: 'shop_drawing',
        name: drawing.fileName,
        status: drawing.status,
        version: drawing.version,
        position: { x: 0, y: 0 }
      });
    });

    // Add material nodes
    materials.forEach(material => {
      workflowMap.nodes.push({
        id: material.id,
        type: 'material_spec',
        name: material.description,
        status: material.status,
        quantity: material.quantity,
        position: { x: 0, y: 0 }
      });
    });

    // Add edges from connections
    connections.forEach(connection => {
      if (connection.shopDrawingId) {
        workflowMap.edges.push({
          id: `${connection.scopeItemId}-${connection.shopDrawingId}`,
          source: connection.scopeItemId,
          target: connection.shopDrawingId,
          type: 'scope_to_drawing',
          status: connection.status
        });
      }

      if (connection.materialSpecId) {
        workflowMap.edges.push({
          id: `${connection.scopeItemId}-${connection.materialSpecId}`,
          source: connection.scopeItemId,
          target: connection.materialSpecId,
          type: 'scope_to_material',
          status: connection.status
        });
      }

      if (connection.shopDrawingId && connection.materialSpecId) {
        workflowMap.edges.push({
          id: `${connection.shopDrawingId}-${connection.materialSpecId}`,
          source: connection.shopDrawingId,
          target: connection.materialSpecId,
          type: 'drawing_to_material',
          status: connection.status
        });
      }
    });

    return workflowMap;
  }

  /**
   * Get cluster color for visualization
   */
  getClusterColor(index) {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];
    return colors[index % colors.length];
  }

  /**
   * Analyze workflow timeline
   */
  async analyzeWorkflowTimeline(projectId) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { startDate: true, endDate: true }
      });

      if (!project.startDate || !project.endDate) {
        return {
          hasTimeline: false,
          message: 'Project timeline not defined'
        };
      }

      const totalDays = Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24));
      const currentDay = Math.ceil((new Date() - new Date(project.startDate)) / (1000 * 60 * 60 * 24));
      
      // Get scope items with their estimated completion dates
      const scopeItems = await prisma.scopeItem.findMany({
        where: { projectId },
        include: {
          scopeGroup: {
            select: { name: true, orderIndex: true }
          }
        },
        orderBy: [
          { scopeGroup: { orderIndex: 'asc' } },
          { orderIndex: 'asc' }
        ]
      });

      // Calculate timeline phases
      const phases = this.calculateWorkflowPhases(scopeItems, totalDays);

      return {
        hasTimeline: true,
        totalDays,
        currentDay,
        progress: Math.min(100, Math.round((currentDay / totalDays) * 100)),
        phases,
        milestones: await this.calculateWorkflowMilestones(scopeItems, project.startDate, totalDays)
      };
    } catch (error) {
      console.error('❌ Workflow timeline analysis error:', error);
      throw error;
    }
  }

  /**
   * Calculate workflow phases
   */
  calculateWorkflowPhases(scopeItems, totalDays) {
    const scopeGroups = _.groupBy(scopeItems, item => item.scopeGroup.orderIndex);
    const phases = [];
    
    const groupCount = Object.keys(scopeGroups).length;
    const daysPerGroup = Math.floor(totalDays / groupCount);
    
    Object.entries(scopeGroups).forEach(([groupIndex, items], index) => {
      const startDay = index * daysPerGroup + 1;
      const endDay = index === groupCount - 1 ? totalDays : (index + 1) * daysPerGroup;
      
      phases.push({
        name: items[0]?.scopeGroup?.name || `Phase ${index + 1}`,
        startDay,
        endDay,
        duration: endDay - startDay + 1,
        scopeItems: items.length,
        averageCompletion: Math.round(
          items.reduce((sum, item) => sum + item.completionPercentage, 0) / items.length
        )
      });
    });
    
    return phases;
  }

  /**
   * Calculate workflow milestones
   */
  calculateWorkflowMilestones(scopeItems, startDate, totalDays) {
    const milestones = [];
    const start = new Date(startDate);
    
    // Design completion milestone (25% of timeline)
    const designComplete = new Date(start);
    designComplete.setDate(start.getDate() + Math.floor(totalDays * 0.25));
    
    milestones.push({
      name: 'Design Phase Complete',
      date: designComplete.toISOString().split('T')[0],
      day: Math.floor(totalDays * 0.25),
      status: 'pending',
      description: 'All shop drawings approved and materials specified'
    });
    
    // Production start milestone (40% of timeline)
    const productionStart = new Date(start);
    productionStart.setDate(start.getDate() + Math.floor(totalDays * 0.4));
    
    milestones.push({
      name: 'Production Start',
      date: productionStart.toISOString().split('T')[0],
      day: Math.floor(totalDays * 0.4),
      status: 'pending',
      description: 'Manufacturing begins with approved drawings and available materials'
    });
    
    // Installation ready milestone (75% of timeline)
    const installationReady = new Date(start);
    installationReady.setDate(start.getDate() + Math.floor(totalDays * 0.75));
    
    milestones.push({
      name: 'Installation Ready',
      date: installationReady.toISOString().split('T')[0],
      day: Math.floor(totalDays * 0.75),
      status: 'pending',
      description: 'All items manufactured and ready for installation'
    });
    
    return milestones;
  }

  /**
   * Update project workflow analysis cache
   */
  async updateProjectWorkflowAnalysis(projectId) {
    try {
      // Clear existing cache
      const cacheKey = cacheService.generateKey('project', projectId, 'workflow_analysis');
      await cacheService.delete(cacheKey);
      
      // Regenerate analysis
      const analysis = await this.analyzeWorkflow(projectId);
      
      // Update project progress based on workflow
      await this.updateProjectProgressFromWorkflow(projectId, analysis);
      
      return analysis;
    } catch (error) {
      console.error('❌ Update workflow analysis error:', error);
      throw error;
    }
  }

  /**
   * Update project progress based on workflow analysis
   */
  async updateProjectProgressFromWorkflow(projectId, workflowAnalysis) {
    try {
      const { readiness } = workflowAnalysis;
      
      // Calculate overall project progress based on workflow readiness
      const totalConnections = readiness.readyForProduction + readiness.notReady;
      const workflowProgress = totalConnections > 0 
        ? Math.round((readiness.readyForProduction / totalConnections) * 100)
        : 0;
      
      // Update project progress
      await prisma.project.update({
        where: { id: projectId },
        data: {
          progress: workflowProgress,
          updatedAt: new Date()
        }
      });
      
      // Clear project cache
      const projectCacheKey = cacheService.generateKey('project', projectId, 'details');
      await cacheService.delete(projectCacheKey);
      
    } catch (error) {
      console.error('❌ Update project progress error:', error);
      // Don't throw error to prevent workflow analysis from failing
    }
  }

  /**
   * Get workflow connection details
   */
  async getWorkflowConnection(connectionId) {
    try {
      const connection = await prisma.workflowConnection.findUnique({
        where: { id: connectionId },
        include: {
          scopeItem: {
            include: {
              scopeGroup: true,
              project: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          shopDrawing: true,
          materialSpec: true
        }
      });

      if (!connection) {
        throw new Error('Workflow connection not found');
      }

      return connection;
    } catch (error) {
      console.error('❌ Get workflow connection error:', error);
      throw error;
    }
  }

  /**
   * Update workflow connection
   */
  async updateWorkflowConnection(connectionId, updateData, updatedBy) {
    try {
      const existingConnection = await prisma.workflowConnection.findUnique({
        where: { id: connectionId }
      });

      if (!existingConnection) {
        throw new Error('Workflow connection not found');
      }

      const updatedConnection = await prisma.workflowConnection.update({
        where: { id: connectionId },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      });

      // Log update
      await auditService.logDataChange({
        tableName: 'workflow_connections',
        recordId: connectionId,
        action: 'update',
        oldValues: existingConnection,
        newValues: updatedConnection,
        userId: updatedBy
      });

      // Update workflow analysis for the project
      const connection = await this.getWorkflowConnection(connectionId);
      await this.updateProjectWorkflowAnalysis(connection.scopeItem.projectId);

      return updatedConnection;
    } catch (error) {
      console.error('❌ Update workflow connection error:', error);
      throw error;
    }
  }

  /**
   * Delete workflow connection
   */
  async deleteWorkflowConnection(connectionId, deletedBy) {
    try {
      const connection = await this.getWorkflowConnection(connectionId);
      
      await prisma.workflowConnection.delete({
        where: { id: connectionId }
      });

      // Log deletion
      await auditService.logDataChange({
        tableName: 'workflow_connections',
        recordId: connectionId,
        action: 'delete',
        oldValues: connection,
        userId: deletedBy
      });

      // Update workflow analysis
      await this.updateProjectWorkflowAnalysis(connection.scopeItem.projectId);

      return true;
    } catch (error) {
      console.error('❌ Delete workflow connection error:', error);
      throw error;
    }
  }
}

module.exports = new WorkflowEngine();