/**
 * Photo Service - Enhanced photo management with rich metadata
 * SiteCam-inspired photo documentation system for Formula PM
 */

import { generateUniqueId } from '../../../utils/generators/idGenerator';

class PhotoService {
  constructor() {
    this.photos = new Map();
    this.initialized = false;
    this.init();
  }

  init() {
    // Initialize with some demo photos if needed
    this.initialized = true;
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