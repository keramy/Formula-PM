/**
 * Photo Service - Enhanced photo management with rich metadata
 * SiteCam-inspired photo documentation system for Formula PM
 */

// Simple ID generator for mock implementation
const generateUniqueId = (prefix = 'ID') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

class PhotoService {
  constructor() {
    this.photos = new Map();
    this.initialized = false;
    this.init();
  }

  init() {
    // Initialize with some demo photos for development
    this.loadMockPhotos();
    this.initialized = true;
  }

  loadMockPhotos() {
    const mockPhotos = [
      {
        id: 'IMG_001',
        filename: 'kitchen_progress_001.jpg',
        originalName: 'kitchen_progress.jpg',
        capturedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        uploadedAt: new Date().toISOString(),
        fileSize: 2500000,
        mimeType: 'image/jpeg',
        url: '/mock-images/kitchen-progress.jpg',
        thumbnail: '/mock-images/kitchen-progress-thumb.jpg',
        location: {
          gps: null,
          floor: '1st Floor',
          room: 'Kitchen',
          area: 'Cabinet Area',
          building: 'Main Building'
        },
        project: {
          id: '2001',
          name: 'Akbank Head Office Renovation',
          phase: 'Construction',
          workCategory: 'Millwork'
        },
        quality: {
          resolution: { width: 3840, height: 2160 },
          fileSize: '2.4',
          format: 'JPEG'
        },
        tags: ['progress', 'cabinets', 'millwork'],
        caption: 'Kitchen cabinet installation progress',
        description: 'Upper and lower cabinets being installed in executive kitchen area',
        category: 'progress',
        priority: 'normal',
        device: {
          camera: 'iPhone 14 Pro',
          lens: 'Main Camera',
          settings: {}
        },
        construction: {
          trade: 'Millwork',
          workType: 'Cabinet Installation',
          inspectionType: '',
          defectType: '',
          status: 'active'
        },
        createdBy: 'project-manager',
        assignedTo: '',
        reviewStatus: 'approved',
        approvalStatus: 'approved'
      },
      {
        id: 'IMG_002',
        filename: 'quality_check_002.jpg',
        originalName: 'quality_check.jpg',
        capturedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        uploadedAt: new Date().toISOString(),
        fileSize: 1800000,
        mimeType: 'image/jpeg',
        url: '/mock-images/quality-check.jpg',
        thumbnail: '/mock-images/quality-check-thumb.jpg',
        location: {
          gps: null,
          floor: '1st Floor',
          room: 'Conference Room',
          area: 'Cabinet Area',
          building: 'Main Building'
        },
        project: {
          id: '2001',
          name: 'Akbank Head Office Renovation',
          phase: 'Quality Control',
          workCategory: 'Millwork'
        },
        quality: {
          resolution: { width: 3840, height: 2160 },
          fileSize: '1.8',
          format: 'JPEG'
        },
        tags: ['quality', 'inspection', 'cabinet-doors'],
        caption: 'Quality inspection of cabinet doors',
        description: 'Final quality control inspection of cabinet door alignment and finish',
        category: 'quality',
        priority: 'high',
        device: {
          camera: 'iPhone 14 Pro',
          lens: 'Main Camera',
          settings: {}
        },
        construction: {
          trade: 'Millwork',
          workType: 'Quality Control',
          inspectionType: 'Final Inspection',
          defectType: '',
          status: 'active'
        },
        createdBy: 'quality-inspector',
        assignedTo: '',
        reviewStatus: 'approved',
        approvalStatus: 'approved'
      },
      {
        id: 'IMG_003',
        filename: 'milestone_003.jpg',
        originalName: 'milestone.jpg',
        capturedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        uploadedAt: new Date().toISOString(),
        fileSize: 3200000,
        mimeType: 'image/jpeg',
        url: '/mock-images/milestone.jpg',
        thumbnail: '/mock-images/milestone-thumb.jpg',
        location: {
          gps: null,
          floor: '1st Floor',
          room: 'Reception',
          area: 'Reception Desk',
          building: 'Main Building'
        },
        project: {
          id: '2001',
          name: 'Akbank Head Office Renovation',
          phase: 'Completion',
          workCategory: 'Millwork'
        },
        quality: {
          resolution: { width: 4032, height: 3024 },
          fileSize: '3.2',
          format: 'JPEG'
        },
        tags: ['milestone', 'completion', 'reception-desk'],
        caption: 'Reception desk installation completed',
        description: 'Custom reception desk installation milestone achieved',
        category: 'milestone',
        priority: 'high',
        device: {
          camera: 'iPhone 14 Pro',
          lens: 'Main Camera',
          settings: {}
        },
        construction: {
          trade: 'Millwork',
          workType: 'Installation',
          inspectionType: '',
          defectType: '',
          status: 'completed'
        },
        createdBy: 'project-manager',
        assignedTo: '',
        reviewStatus: 'approved',
        approvalStatus: 'approved'
      }
    ];

    mockPhotos.forEach(photo => {
      this.photos.set(photo.id, photo);
    });
  }

  /**
   * Upload photo with enhanced metadata capture
   */
  async uploadPhoto(file, metadata = {}) {
    try {
      // Generate unique photo ID
      const photoId = generateUniqueId('IMG');
      
      // Extract basic file metadata
      const fileMetadata = await this.extractFileMetadata(file);
      
      // Create comprehensive photo object
      const photoData = {
        id: photoId,
        filename: `${Date.now()}_${file.name}`,
        originalName: file.name,
        capturedAt: new Date().toISOString(),
        uploadedAt: new Date().toISOString(),
        
        // File properties
        fileSize: file.size,
        mimeType: file.type,
        url: URL.createObjectURL(file), // For demo purposes
        thumbnail: URL.createObjectURL(file), // For demo purposes
        
        // Enhanced metadata
        location: {
          gps: metadata.gps || null,
          floor: metadata.floor || '',
          room: metadata.room || '',
          area: metadata.area || '',
          building: metadata.building || ''
        },
        
        project: {
          id: metadata.projectId || '',
          name: metadata.projectName || '',
          phase: metadata.projectPhase || '',
          workCategory: metadata.workCategory || 'General'
        },
        
        // Photo metadata
        quality: {
          resolution: fileMetadata.resolution || { width: 0, height: 0 },
          fileSize: (file.size / 1024 / 1024).toFixed(2), // MB
          format: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN'
        },
        
        // Content metadata
        tags: metadata.tags || [],
        caption: metadata.caption || '',
        description: metadata.description || '',
        category: metadata.category || 'general',
        priority: metadata.priority || 'normal',
        
        // Technical metadata
        device: {
          camera: metadata.deviceInfo?.camera || 'Unknown',
          lens: metadata.deviceInfo?.lens || 'Unknown',
          settings: metadata.deviceInfo?.settings || {}
        },
        
        // Construction-specific metadata
        construction: {
          trade: metadata.trade || '',
          workType: metadata.workType || '',
          inspectionType: metadata.inspectionType || '',
          defectType: metadata.defectType || '',
          status: metadata.status || 'active'
        },
        
        // Organizational metadata
        createdBy: metadata.createdBy || 'current-user',
        assignedTo: metadata.assignedTo || '',
        reviewStatus: 'pending',
        approvalStatus: 'pending'
      };

      // Store photo data
      this.photos.set(photoId, photoData);
      
      return Promise.resolve(photoData);
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw new Error('Failed to upload photo: ' + error.message);
    }
  }

  /**
   * Get photo by ID
   */
  async getPhoto(photoId) {
    const photo = this.photos.get(photoId);
    return Promise.resolve(photo || null);
  }

  /**
   * Get photos by project with filtering
   */
  async getPhotosByProject(projectId, filters = {}) {
    const projectPhotos = Array.from(this.photos.values())
      .filter(photo => photo.project.id === projectId)
      .filter(photo => this.applyFilters(photo, filters))
      .sort((a, b) => new Date(b.capturedAt) - new Date(a.capturedAt));
    
    return Promise.resolve(projectPhotos);
  }

  /**
   * Get photos by location
   */
  async getPhotosByLocation(locationFilter) {
    const locationPhotos = Array.from(this.photos.values())
      .filter(photo => {
        const loc = photo.location;
        return (
          (!locationFilter.floor || loc.floor === locationFilter.floor) &&
          (!locationFilter.room || loc.room === locationFilter.room) &&
          (!locationFilter.area || loc.area === locationFilter.area) &&
          (!locationFilter.building || loc.building === locationFilter.building)
        );
      })
      .sort((a, b) => new Date(b.capturedAt) - new Date(a.capturedAt));
    
    return Promise.resolve(locationPhotos);
  }

  /**
   * Update photo metadata
   */
  async updatePhoto(photoId, updates) {
    const existingPhoto = this.photos.get(photoId);
    if (!existingPhoto) {
      throw new Error('Photo not found');
    }

    const updatedPhoto = {
      ...existingPhoto,
      ...updates,
      lastModified: new Date().toISOString()
    };

    this.photos.set(photoId, updatedPhoto);
    return Promise.resolve(updatedPhoto);
  }

  /**
   * Delete photo
   */
  async deletePhoto(photoId) {
    const photo = this.photos.get(photoId);
    if (photo) {
      // Cleanup URLs
      if (photo.url && photo.url.startsWith('blob:')) {
        URL.revokeObjectURL(photo.url);
      }
      if (photo.thumbnail && photo.thumbnail.startsWith('blob:')) {
        URL.revokeObjectURL(photo.thumbnail);
      }
    }
    
    const deleted = this.photos.delete(photoId);
    return Promise.resolve(deleted);
  }

  /**
   * Bulk upload photos
   */
  async uploadPhotos(files, commonMetadata = {}) {
    const uploadPromises = files.map(file => 
      this.uploadPhoto(file, { ...commonMetadata })
    );
    
    try {
      const results = await Promise.all(uploadPromises);
      return Promise.resolve(results);
    } catch (error) {
      console.error('Error in bulk upload:', error);
      throw new Error('Bulk upload failed: ' + error.message);
    }
  }

  /**
   * Get photo statistics for project
   */
  async getPhotoStats(projectId) {
    const projectPhotos = Array.from(this.photos.values())
      .filter(photo => photo.project.id === projectId);

    const stats = {
      totalPhotos: projectPhotos.length,
      byCategory: {},
      byLocation: {},
      byDate: {},
      byWorkCategory: {},
      totalFileSize: 0
    };

    projectPhotos.forEach(photo => {
      // By category
      stats.byCategory[photo.category] = (stats.byCategory[photo.category] || 0) + 1;
      
      // By location
      const locationKey = `${photo.location.floor} - ${photo.location.room}`;
      stats.byLocation[locationKey] = (stats.byLocation[locationKey] || 0) + 1;
      
      // By date
      const dateKey = photo.capturedAt.split('T')[0];
      stats.byDate[dateKey] = (stats.byDate[dateKey] || 0) + 1;
      
      // By work category
      stats.byWorkCategory[photo.project.workCategory] = (stats.byWorkCategory[photo.project.workCategory] || 0) + 1;
      
      // Total file size
      stats.totalFileSize += photo.fileSize;
    });

    return Promise.resolve(stats);
  }

  /**
   * Search photos by text
   */
  async searchPhotos(query, projectId = null) {
    const searchQuery = query.toLowerCase();
    let photosToSearch = Array.from(this.photos.values());
    
    if (projectId) {
      photosToSearch = photosToSearch.filter(photo => photo.project.id === projectId);
    }

    const matchingPhotos = photosToSearch.filter(photo => {
      return (
        photo.caption.toLowerCase().includes(searchQuery) ||
        photo.description.toLowerCase().includes(searchQuery) ||
        photo.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
        photo.location.room.toLowerCase().includes(searchQuery) ||
        photo.location.area.toLowerCase().includes(searchQuery) ||
        photo.construction.trade.toLowerCase().includes(searchQuery) ||
        photo.construction.workType.toLowerCase().includes(searchQuery)
      );
    });

    return Promise.resolve(matchingPhotos);
  }

  // Helper methods
  async extractFileMetadata(file) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          resolution: {
            width: img.width,
            height: img.height
          }
        });
      };
      img.onerror = () => {
        resolve({
          resolution: { width: 0, height: 0 }
        });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  applyFilters(photo, filters) {
    if (filters.category && photo.category !== filters.category) return false;
    if (filters.workCategory && photo.project.workCategory !== filters.workCategory) return false;
    if (filters.status && photo.construction.status !== filters.status) return false;
    if (filters.priority && photo.priority !== filters.priority) return false;
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => photo.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    if (filters.dateFrom && photo.capturedAt < filters.dateFrom) return false;
    if (filters.dateTo && photo.capturedAt > filters.dateTo) return false;
    
    return true;
  }

  /**
   * Get predefined categories for photos
   */
  getPhotoCategories() {
    return [
      { id: 'progress', name: 'Progress Photos', icon: 'FaCog', color: '#2196F3' },
      { id: 'quality', name: 'Quality Control', icon: 'FaCheckCircle', color: '#4CAF50' },
      { id: 'issue', name: 'Issues/Defects', icon: 'FaExclamationTriangle', color: '#FF9800' },
      { id: 'safety', name: 'Safety', icon: 'FaShieldAlt', color: '#F44336' },
      { id: 'material', name: 'Materials', icon: 'FaCubes', color: '#9C27B0' },
      { id: 'equipment', name: 'Equipment', icon: 'FaTools', color: '#607D8B' },
      { id: 'milestone', name: 'Milestones', icon: 'FaFlag', color: '#FF5722' },
      { id: 'general', name: 'General', icon: 'FaCamera', color: '#757575' }
    ];
  }

  /**
   * Get predefined work categories
   */
  getWorkCategories() {
    return [
      'Construction',
      'Millwork',
      'Electric',
      'MEP',
      'HVAC',
      'Plumbing',
      'Flooring',
      'Painting',
      'Drywall',
      'Roofing',
      'Windows',
      'Doors',
      'General'
    ];
  }
}

export default new PhotoService();