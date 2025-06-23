/**
 * Metadata Service - Manages photo and report metadata
 * Handles GPS, location, and construction-specific metadata
 */

class MetadataService {
  constructor() {
    this.locationTemplates = new Map();
    this.projectLocations = new Map();
    this.init();
  }

  init() {
    // Initialize with common location templates
    this.loadLocationTemplates();
  }

  /**
   * Extract GPS coordinates from device if available
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        options
      );
    });
  }

  /**
   * Get project-specific location templates
   */
  async getProjectLocations(projectId) {
    const locations = this.projectLocations.get(projectId) || this.getDefaultLocations();
    return Promise.resolve(locations);
  }

  /**
   * Add or update project location
   */
  async updateProjectLocation(projectId, location) {
    let projectLocs = this.projectLocations.get(projectId) || this.getDefaultLocations();
    
    // Check if location already exists
    const existingIndex = projectLocs.findIndex(loc => 
      loc.floor === location.floor && 
      loc.room === location.room && 
      loc.area === location.area
    );

    if (existingIndex !== -1) {
      projectLocs[existingIndex] = { ...projectLocs[existingIndex], ...location };
    } else {
      projectLocs.push({
        id: `loc_${Date.now()}`,
        ...location,
        createdAt: new Date().toISOString()
      });
    }

    this.projectLocations.set(projectId, projectLocs);
    return Promise.resolve(location);
  }

  /**
   * Get construction-specific metadata templates
   */
  getConstructionMetadataTemplates() {
    return {
      progress: {
        name: 'Progress Photo',
        requiredFields: ['workCategory', 'trade', 'workType'],
        optionalFields: ['milestone', 'percentComplete', 'notes'],
        tags: ['progress', 'milestone', 'construction']
      },
      quality: {
        name: 'Quality Control',
        requiredFields: ['inspectionType', 'trade', 'status'],
        optionalFields: ['defectType', 'severity', 'correctiveAction'],
        tags: ['quality', 'inspection', 'compliance']
      },
      issue: {
        name: 'Issue Documentation',
        requiredFields: ['issueType', 'severity', 'trade'],
        optionalFields: ['assignedTo', 'dueDate', 'resolution'],
        tags: ['issue', 'defect', 'action-required']
      },
      safety: {
        name: 'Safety Documentation',
        requiredFields: ['safetyType', 'severity'],
        optionalFields: ['hazardLevel', 'mitigationPlan', 'reportedBy'],
        tags: ['safety', 'hazard', 'compliance']
      },
      material: {
        name: 'Material Documentation',
        requiredFields: ['materialType', 'supplier'],
        optionalFields: ['quantity', 'condition', 'deliveryDate'],
        tags: ['material', 'delivery', 'inventory']
      }
    };
  }

  /**
   * Get metadata suggestions based on context
   */
  async getMetadataSuggestions(context = {}) {
    const suggestions = {
      tags: [],
      categories: [],
      workCategories: [],
      locations: []
    };

    // Context-based tag suggestions
    if (context.projectPhase) {
      suggestions.tags.push(...this.getPhaseBasedTags(context.projectPhase));
    }

    if (context.workCategory) {
      suggestions.tags.push(...this.getWorkCategoryTags(context.workCategory));
    }

    // Location suggestions
    if (context.projectId) {
      const projectLocations = await this.getProjectLocations(context.projectId);
      suggestions.locations = projectLocations;
    }

    // Category suggestions based on time of day
    const currentHour = new Date().getHours();
    if (currentHour >= 7 && currentHour <= 17) {
      suggestions.categories.push('progress', 'quality', 'material');
    } else {
      suggestions.categories.push('general', 'equipment');
    }

    return Promise.resolve(suggestions);
  }

  /**
   * Validate metadata completeness
   */
  validateMetadata(metadata, template = null) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    // Basic validation
    if (!metadata.caption && !metadata.description) {
      validation.warnings.push('Consider adding a caption or description');
    }

    if (!metadata.location || (!metadata.location.room && !metadata.location.area)) {
      validation.warnings.push('Location information is incomplete');
    }

    if (!metadata.tags || metadata.tags.length === 0) {
      validation.suggestions.push('Add tags to improve searchability');
    }

    // Template-based validation
    if (template && this.getConstructionMetadataTemplates()[template]) {
      const templateConfig = this.getConstructionMetadataTemplates()[template];
      
      templateConfig.requiredFields.forEach(field => {
        if (!metadata[field] && !metadata.construction?.[field]) {
          validation.errors.push(`${field} is required for ${template} photos`);
          validation.isValid = false;
        }
      });
    }

    return validation;
  }

  /**
   * Auto-populate metadata based on context
   */
  async autoPopulateMetadata(context = {}) {
    const metadata = {
      capturedAt: new Date().toISOString(),
      tags: [],
      category: 'general',
      priority: 'normal'
    };

    // Auto-populate based on time and context
    if (context.projectId) {
      metadata.project = {
        id: context.projectId,
        name: context.projectName || '',
        phase: context.projectPhase || ''
      };
    }

    // Auto-populate location if available
    try {
      const gpsLocation = await this.getCurrentLocation();
      metadata.location = {
        gps: {
          latitude: gpsLocation.latitude,
          longitude: gpsLocation.longitude,
          accuracy: gpsLocation.accuracy
        }
      };
    } catch (error) {
      // GPS not available, continue without it
    }

    // Auto-populate tags based on context
    if (context.workCategory) {
      metadata.tags.push(context.workCategory.toLowerCase());
      metadata.project.workCategory = context.workCategory;
    }

    // Auto-populate category based on time of day
    const currentHour = new Date().getHours();
    if (currentHour >= 7 && currentHour <= 17) {
      metadata.category = 'progress';
      metadata.tags.push('work-hours');
    }

    return Promise.resolve(metadata);
  }

  /**
   * Get EXIF data from image file
   */
  async extractExifData(file) {
    // This would typically use a library like exif-js
    // For now, return basic file information
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
            fileSize: file.size,
            lastModified: new Date(file.lastModified).toISOString(),
            type: file.type
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Helper methods
  loadLocationTemplates() {
    // Load common construction location templates
    const commonLocations = this.getDefaultLocations();
    this.locationTemplates.set('default', commonLocations);
  }

  getDefaultLocations() {
    return [
      {
        id: 'exec_kitchen',
        building: 'Main Building',
        floor: 'Ground Floor',
        room: 'Executive Kitchen',
        areas: ['Upper Cabinets', 'Lower Cabinets', 'Island', 'Countertops', 'Appliances']
      },
      {
        id: 'conf_room_a',
        building: 'Main Building',
        floor: 'Ground Floor',
        room: 'Conference Room A',
        areas: ['Presentation Wall', 'Seating Area', 'AV Equipment', 'Lighting']
      },
      {
        id: 'lobby',
        building: 'Main Building',
        floor: 'Ground Floor',
        room: 'Main Lobby',
        areas: ['Reception Desk', 'Seating Area', 'Entrance', 'Ceiling']
      },
      {
        id: 'office_1',
        building: 'Main Building',
        floor: 'Second Floor',
        room: 'Office 1',
        areas: ['Workstation', 'Storage', 'Windows', 'Lighting']
      },
      {
        id: 'office_2',
        building: 'Main Building',
        floor: 'Second Floor',
        room: 'Office 2',
        areas: ['Workstation', 'Storage', 'Windows', 'Lighting']
      }
    ];
  }

  getPhaseBasedTags(phase) {
    const phaseTagMap = {
      'planning': ['planning', 'design', 'prep'],
      'construction': ['construction', 'installation', 'assembly'],
      'finishing': ['finishing', 'painting', 'final'],
      'inspection': ['inspection', 'quality', 'review'],
      'completion': ['completion', 'handover', 'final']
    };
    return phaseTagMap[phase] || [];
  }

  getWorkCategoryTags(category) {
    const categoryTagMap = {
      'Construction': ['construction', 'structural', 'building'],
      'Millwork': ['millwork', 'carpentry', 'custom'],
      'Electric': ['electrical', 'wiring', 'lighting'],
      'MEP': ['mechanical', 'electrical', 'plumbing'],
      'HVAC': ['hvac', 'ventilation', 'climate'],
      'Plumbing': ['plumbing', 'pipes', 'fixtures']
    };
    return categoryTagMap[category] || [];
  }
}

export default new MetadataService();