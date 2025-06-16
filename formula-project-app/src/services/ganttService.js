import { addDays, differenceInDays, format, startOfWeek, endOfWeek } from 'date-fns';
import connectionService from './connectionService';

/**
 * Gantt Service - Manages timeline integration with scope, shop drawings, and material specs
 * 
 * This service provides the logic for integrating various project components into
 * a comprehensive Gantt chart timeline that shows dependencies and workflow progression.
 */

class GanttService {
  constructor() {
    this.defaultDurations = {
      'scope-item': 14, // days
      'shop-drawing': 7,
      'material-spec': 5,
      'approval-process': 3,
      'production': 21
    };
    
    this.workflowStages = {
      SCOPE_DEFINITION: 'scope-definition',
      SHOP_DRAWING_CREATION: 'shop-drawing-creation', 
      SHOP_DRAWING_APPROVAL: 'shop-drawing-approval',
      MATERIAL_SPEC_CREATION: 'material-spec-creation',
      MATERIAL_SPEC_APPROVAL: 'material-spec-approval',
      PRODUCTION_READY: 'production-ready',
      PRODUCTION: 'production',
      INSTALLATION: 'installation'
    };
  }

  /**
   * Creates a comprehensive timeline that integrates scope items with shop drawings and material specs
   */
  createIntegratedTimeline(projectId, scopeItems, shopDrawings, materialSpecs, options = {}) {
    const {
      startDate = new Date(),
      includeBufferDays = true,
      bufferDays = 2,
      autoCalculateDependencies = true
    } = options;

    // Group scope items by category/group
    const scopeGroups = this.groupScopeItems(scopeItems);
    
    // Create timeline for each scope group
    const groupTimelines = {};
    let currentDate = new Date(startDate);

    // Construction group starts first (no dependencies)
    groupTimelines.construction = this.createGroupTimeline(
      scopeGroups.construction,
      shopDrawings,
      materialSpecs,
      currentDate,
      { bufferDays, includeBufferDays }
    );

    // Calculate when construction group ends
    const constructionEndDate = this.getGroupEndDate(groupTimelines.construction);
    
    // Millwork, Electric, and MEP can start after construction foundation
    const parallelStartDate = addDays(constructionEndDate, -14); // 2 weeks overlap allowed
    
    groupTimelines.millwork = this.createGroupTimeline(
      scopeGroups.millwork,
      shopDrawings,
      materialSpecs,
      parallelStartDate,
      { bufferDays, includeBufferDays }
    );

    groupTimelines.electric = this.createGroupTimeline(
      scopeGroups.electric,
      shopDrawings,
      materialSpecs,
      parallelStartDate,
      { bufferDays, includeBufferDays }
    );

    groupTimelines.mep = this.createGroupTimeline(
      scopeGroups.mep,
      shopDrawings,
      materialSpecs,
      parallelStartDate,
      { bufferDays, includeBufferDays }
    );

    return {
      projectId,
      groupTimelines,
      projectStartDate: startDate,
      projectEndDate: this.calculateProjectEndDate(groupTimelines),
      criticalPath: this.calculateCriticalPath(groupTimelines),
      totalDuration: this.calculateTotalDuration(groupTimelines),
      workflowStatus: this.analyzeWorkflowStatus(groupTimelines, scopeItems, shopDrawings, materialSpecs)
    };
  }

  /**
   * Creates a detailed timeline for a specific scope group
   */
  createGroupTimeline(scopeItems, shopDrawings, materialSpecs, startDate, options = {}) {
    const { bufferDays = 2, includeBufferDays = true } = options;
    const timeline = [];
    let currentDate = new Date(startDate);

    scopeItems.forEach((scopeItem, index) => {
      const itemTimeline = this.createScopeItemWorkflow(
        scopeItem,
        shopDrawings,
        materialSpecs,
        currentDate,
        options
      );

      timeline.push(itemTimeline);

      // Update current date for next item (parallel vs sequential logic)
      const itemEndDate = this.getWorkflowEndDate(itemTimeline);
      if (this.shouldRunSequentially(scopeItem, scopeItems[index + 1])) {
        currentDate = addDays(itemEndDate, includeBufferDays ? bufferDays : 0);
      }
    });

    return timeline;
  }

  /**
   * Creates a complete workflow timeline for a single scope item
   */
  createScopeItemWorkflow(scopeItem, shopDrawings, materialSpecs, startDate, options = {}) {
    const workflow = {
      scopeItem,
      scopeItemId: scopeItem.id,
      startDate,
      stages: [],
      dependencies: [],
      blockers: [],
      warnings: []
    };

    let currentStageDate = new Date(startDate);

    // Stage 1: Scope Definition (usually already done)
    const scopeStage = this.createWorkflowStage(
      this.workflowStages.SCOPE_DEFINITION,
      'Scope Item Definition',
      currentStageDate,
      1, // 1 day (usually already complete)
      scopeItem.status === 'completed' ? 100 : (scopeItem.progress || 0),
      'scope-item'
    );
    workflow.stages.push(scopeStage);
    currentStageDate = addDays(currentStageDate, 1);

    // Stage 2: Shop Drawing Creation (if required)
    if (scopeItem.shopDrawingRequired) {
      const relatedDrawings = this.findRelatedShopDrawings(scopeItem, shopDrawings);
      
      if (relatedDrawings.length === 0) {
        // Need to create shop drawing
        const drawingCreationStage = this.createWorkflowStage(
          this.workflowStages.SHOP_DRAWING_CREATION,
          'Shop Drawing Creation',
          currentStageDate,
          this.defaultDurations['shop-drawing'],
          0,
          'shop-drawing-creation'
        );
        workflow.stages.push(drawingCreationStage);
        workflow.blockers.push({
          type: 'missing_shop_drawing',
          message: 'Shop drawing creation required',
          stage: this.workflowStages.SHOP_DRAWING_CREATION
        });
        currentStageDate = addDays(currentStageDate, this.defaultDurations['shop-drawing']);
      } else {
        // Check existing drawings status
        relatedDrawings.forEach(drawing => {
          if (drawing.status !== 'approved') {
            const approvalStage = this.createWorkflowStage(
              this.workflowStages.SHOP_DRAWING_APPROVAL,
              `Shop Drawing Approval - ${drawing.fileName}`,
              currentStageDate,
              this.defaultDurations['approval-process'],
              drawing.status === 'approved' ? 100 : 0,
              'shop-drawing-approval'
            );
            workflow.stages.push(approvalStage);
            
            if (drawing.status !== 'approved') {
              workflow.blockers.push({
                type: 'unapproved_shop_drawing',
                message: `Shop drawing "${drawing.fileName}" requires approval`,
                stage: this.workflowStages.SHOP_DRAWING_APPROVAL,
                drawingId: drawing.id
              });
            }
            currentStageDate = addDays(currentStageDate, this.defaultDurations['approval-process']);
          }
        });
      }
    }

    // Stage 3: Material Specification (if required)
    if (scopeItem.materialSpecRequired) {
      const relatedSpecs = this.findRelatedMaterialSpecs(scopeItem, materialSpecs);
      
      if (relatedSpecs.length === 0) {
        // Need to create material spec
        const specCreationStage = this.createWorkflowStage(
          this.workflowStages.MATERIAL_SPEC_CREATION,
          'Material Specification Creation',
          currentStageDate,
          this.defaultDurations['material-spec'],
          0,
          'material-spec-creation'
        );
        workflow.stages.push(specCreationStage);
        workflow.blockers.push({
          type: 'missing_material_spec',
          message: 'Material specification creation required',
          stage: this.workflowStages.MATERIAL_SPEC_CREATION
        });
        currentStageDate = addDays(currentStageDate, this.defaultDurations['material-spec']);
      } else {
        // Check existing specs status
        relatedSpecs.forEach(spec => {
          if (spec.status !== 'approved') {
            const approvalStage = this.createWorkflowStage(
              this.workflowStages.MATERIAL_SPEC_APPROVAL,
              `Material Spec Approval - ${spec.description}`,
              currentStageDate,
              this.defaultDurations['approval-process'],
              spec.status === 'approved' ? 100 : 0,
              'material-spec-approval'
            );
            workflow.stages.push(approvalStage);
            
            if (spec.status !== 'approved') {
              workflow.blockers.push({
                type: 'unapproved_material_spec',
                message: `Material spec "${spec.description}" requires approval`,
                stage: this.workflowStages.MATERIAL_SPEC_APPROVAL,
                specId: spec.id
              });
            }
            currentStageDate = addDays(currentStageDate, this.defaultDurations['approval-process']);
          }
        });
      }
    }

    // Stage 4: Production Ready Check
    const productionReadyStage = this.createWorkflowStage(
      this.workflowStages.PRODUCTION_READY,
      'Production Ready',
      currentStageDate,
      1,
      workflow.blockers.length === 0 ? 100 : 0,
      'production-ready'
    );
    workflow.stages.push(productionReadyStage);
    currentStageDate = addDays(currentStageDate, 1);

    // Stage 5: Production
    const productionStage = this.createWorkflowStage(
      this.workflowStages.PRODUCTION,
      'Production',
      currentStageDate,
      this.defaultDurations['production'],
      workflow.blockers.length === 0 ? (scopeItem.progress || 0) : 0,
      'production'
    );
    workflow.stages.push(productionStage);
    currentStageDate = addDays(currentStageDate, this.defaultDurations['production']);

    // Stage 6: Installation
    const installationStage = this.createWorkflowStage(
      this.workflowStages.INSTALLATION,
      'Installation',
      currentStageDate,
      7, // 1 week installation
      scopeItem.status === 'completed' ? 100 : 0,
      'installation'
    );
    workflow.stages.push(installationStage);

    workflow.endDate = addDays(currentStageDate, 7);
    workflow.totalDuration = differenceInDays(workflow.endDate, workflow.startDate);
    workflow.isBlocked = workflow.blockers.length > 0;
    workflow.canStartProduction = workflow.blockers.length === 0;

    return workflow;
  }

  /**
   * Creates a workflow stage object
   */
  createWorkflowStage(stageId, name, startDate, duration, progress, type) {
    return {
      id: stageId,
      name,
      startDate,
      endDate: addDays(startDate, duration),
      duration,
      progress,
      type,
      status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending'
    };
  }

  /**
   * Groups scope items by their category/type
   */
  groupScopeItems(scopeItems) {
    const groups = {
      construction: [],
      millwork: [],
      electric: [],
      mep: []
    };

    scopeItems.forEach(item => {
      const category = item.category?.toLowerCase() || '';
      if (category.includes('construction') || category.includes('structural') || 
          category.includes('demolition') || category.includes('flooring')) {
        groups.construction.push(item);
      } else if (category.includes('millwork') || category.includes('cabinet') || 
                 category.includes('carpentry')) {
        groups.millwork.push(item);
      } else if (category.includes('electrical') || category.includes('lighting') || 
                 category.includes('power')) {
        groups.electric.push(item);
      } else if (category.includes('mep') || category.includes('hvac') || 
                 category.includes('plumbing') || category.includes('mechanical')) {
        groups.mep.push(item);
      } else {
        groups.construction.push(item); // default to construction
      }
    });

    return groups;
  }

  /**
   * Finds shop drawings related to a scope item
   */
  findRelatedShopDrawings(scopeItem, shopDrawings) {
    return shopDrawings.filter(drawing => {
      // Use connection service to find actual connections
      const connections = connectionService.getConnectedDrawings(scopeItem.id);
      return connections.some(conn => conn.drawingId === drawing.id);
    });
  }

  /**
   * Finds material specifications related to a scope item
   */
  findRelatedMaterialSpecs(scopeItem, materialSpecs) {
    return materialSpecs.filter(spec => {
      // Use connection service to find actual connections
      const connections = connectionService.getConnectedMaterialSpecs(scopeItem.id);
      return connections.some(conn => conn.specId === spec.id);
    });
  }

  /**
   * Transforms Gantt data to include workflow stages
   */
  transformWorkflowToGantt(integratedTimeline) {
    const ganttData = [];
    
    Object.entries(integratedTimeline.groupTimelines).forEach(([groupKey, groupTimeline]) => {
      // Add group header
      const groupStartDate = this.getGroupStartDate(groupTimeline);
      const groupEndDate = this.getGroupEndDate(groupTimeline);
      
      ganttData.push({
        id: `group-${groupKey}`,
        name: `${this.getGroupDisplayName(groupKey)} Group`,
        start: format(groupStartDate, 'yyyy-MM-dd'),
        end: format(groupEndDate, 'yyyy-MM-dd'),
        progress: this.calculateGroupProgress(groupTimeline),
        custom_class: `bar-${groupKey} group-header`,
        type: 'group'
      });

      // Add individual scope items and their stages
      groupTimeline.forEach((itemWorkflow, index) => {
        // Add main scope item
        ganttData.push({
          id: `scope-${itemWorkflow.scopeItemId}`,
          name: itemWorkflow.scopeItem.description,
          start: format(itemWorkflow.startDate, 'yyyy-MM-dd'),
          end: format(itemWorkflow.endDate, 'yyyy-MM-dd'),
          progress: itemWorkflow.scopeItem.progress || 0,
          custom_class: `bar-${groupKey} ${itemWorkflow.isBlocked ? 'bar-blocked' : ''}`,
          type: 'scope-item',
          parent: `group-${groupKey}`,
          blockers: itemWorkflow.blockers.length,
          warnings: itemWorkflow.warnings.length
        });

        // Add workflow stages as sub-tasks
        itemWorkflow.stages.forEach(stage => {
          ganttData.push({
            id: `stage-${itemWorkflow.scopeItemId}-${stage.id}`,
            name: stage.name,
            start: format(stage.startDate, 'yyyy-MM-dd'),
            end: format(stage.endDate, 'yyyy-MM-dd'),
            progress: stage.progress,
            custom_class: `bar-${stage.type} stage-item`,
            type: 'stage',
            parent: `scope-${itemWorkflow.scopeItemId}`,
            dependencies: this.getStageDependencies(stage, itemWorkflow, index)
          });
        });
      });
    });

    return ganttData;
  }

  /**
   * Calculates critical path through the project timeline
   */
  calculateCriticalPath(groupTimelines) {
    const criticalPath = [];
    
    // Construction group is always on critical path (everything depends on it)
    if (groupTimelines.construction) {
      criticalPath.push('group-construction');
      
      // Find the longest parallel path among millwork, electric, MEP
      const parallelGroups = ['millwork', 'electric', 'mep'];
      let longestGroup = null;
      let longestDuration = 0;
      
      parallelGroups.forEach(groupKey => {
        if (groupTimelines[groupKey]) {
          const duration = this.calculateGroupDuration(groupTimelines[groupKey]);
          if (duration > longestDuration) {
            longestDuration = duration;
            longestGroup = groupKey;
          }
        }
      });
      
      if (longestGroup) {
        criticalPath.push(`group-${longestGroup}`);
      }
    }
    
    return criticalPath;
  }

  /**
   * Analyzes overall workflow status across all groups
   */
  analyzeWorkflowStatus(groupTimelines, scopeItems, shopDrawings, materialSpecs) {
    const status = {
      totalItems: scopeItems.length,
      readyItems: 0,
      blockedItems: 0,
      warningItems: 0,
      canStartProduction: false,
      productionReadiness: 0,
      blockers: [],
      warnings: [],
      groupStatuses: {}
    };

    Object.entries(groupTimelines).forEach(([groupKey, groupTimeline]) => {
      const groupStatus = this.analyzeGroupStatus(groupTimeline);
      status.groupStatuses[groupKey] = groupStatus;
      
      status.readyItems += groupStatus.readyItems;
      status.blockedItems += groupStatus.blockedItems;
      status.warningItems += groupStatus.warningItems;
      status.blockers.push(...groupStatus.blockers);
      status.warnings.push(...groupStatus.warnings);
    });

    status.canStartProduction = status.blockedItems === 0;
    status.productionReadiness = status.totalItems > 0 ? 
      (status.readyItems / status.totalItems) * 100 : 0;

    return status;
  }

  /**
   * Helper methods
   */
  getGroupStartDate(groupTimeline) {
    if (groupTimeline.length === 0) return new Date();
    return new Date(Math.min(...groupTimeline.map(item => new Date(item.startDate))));
  }

  getGroupEndDate(groupTimeline) {
    if (groupTimeline.length === 0) return new Date();
    return new Date(Math.max(...groupTimeline.map(item => new Date(item.endDate))));
  }

  getWorkflowEndDate(itemWorkflow) {
    return itemWorkflow.endDate;
  }

  shouldRunSequentially(currentItem, nextItem) {
    // Simple logic - could be enhanced with more sophisticated rules
    return currentItem && nextItem && 
           currentItem.category === nextItem.category;
  }

  calculateGroupProgress(groupTimeline) {
    if (groupTimeline.length === 0) return 0;
    const totalProgress = groupTimeline.reduce((sum, item) => 
      sum + (item.scopeItem.progress || 0), 0);
    return Math.round(totalProgress / groupTimeline.length);
  }

  calculateGroupDuration(groupTimeline) {
    if (groupTimeline.length === 0) return 0;
    const startDate = this.getGroupStartDate(groupTimeline);
    const endDate = this.getGroupEndDate(groupTimeline);
    return differenceInDays(endDate, startDate);
  }

  calculateProjectEndDate(groupTimelines) {
    const allEndDates = Object.values(groupTimelines).map(timeline => 
      this.getGroupEndDate(timeline)
    );
    return new Date(Math.max(...allEndDates));
  }

  calculateTotalDuration(groupTimelines) {
    const projectStart = new Date(Math.min(...Object.values(groupTimelines).map(timeline => 
      this.getGroupStartDate(timeline)
    )));
    const projectEnd = this.calculateProjectEndDate(groupTimelines);
    return differenceInDays(projectEnd, projectStart);
  }

  getGroupDisplayName(groupKey) {
    const names = {
      construction: 'Construction',
      millwork: 'Millwork',
      electric: 'Electric',
      mep: 'MEP'
    };
    return names[groupKey] || groupKey;
  }

  analyzeGroupStatus(groupTimeline) {
    const status = {
      readyItems: 0,
      blockedItems: 0,
      warningItems: 0,
      blockers: [],
      warnings: []
    };

    groupTimeline.forEach(itemWorkflow => {
      if (itemWorkflow.isBlocked) {
        status.blockedItems++;
        status.blockers.push(...itemWorkflow.blockers);
      } else if (itemWorkflow.warnings.length > 0) {
        status.warningItems++;
        status.warnings.push(...itemWorkflow.warnings);
      } else {
        status.readyItems++;
      }
    });

    return status;
  }

  getStageDependencies(stage, itemWorkflow, itemIndex) {
    // Simple dependency logic for stages
    const stageIndex = itemWorkflow.stages.findIndex(s => s.id === stage.id);
    if (stageIndex > 0) {
      const previousStage = itemWorkflow.stages[stageIndex - 1];
      return `stage-${itemWorkflow.scopeItemId}-${previousStage.id}`;
    }
    return '';
  }
}

// Create singleton instance
const ganttService = new GanttService();
export default ganttService;