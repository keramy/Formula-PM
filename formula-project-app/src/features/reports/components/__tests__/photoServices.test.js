/**
 * Photo Services Test - Verify functionality of photo and metadata services
 */

import photoService from '../services/photoService';
import metadataService from '../services/metadataService';

// Mock File class for testing
class MockFile {
  constructor(name, size, type) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.lastModified = Date.now();
  }
}

describe('Photo Services', () => {
  describe('PhotoService', () => {
    test('should upload photo with metadata', async () => {
      const mockFile = new MockFile('test-image.jpg', 1024000, 'image/jpeg');
      const metadata = {
        projectId: 'TEST_PROJECT',
        caption: 'Test photo',
        tags: ['test', 'demo'],
        location: {
          floor: 'Ground Floor',
          room: 'Test Room'
        }
      };

      const result = await photoService.uploadPhoto(mockFile, metadata);

      expect(result).toBeTruthy();
      expect(result.id).toBeTruthy();
      expect(result.caption).toBe('Test photo');
      expect(result.tags).toEqual(['test', 'demo']);
      expect(result.location.floor).toBe('Ground Floor');
      expect(result.project.id).toBe('TEST_PROJECT');
    });

    test('should get photos by project', async () => {
      const photos = await photoService.getPhotosByProject('TEST_PROJECT');
      expect(Array.isArray(photos)).toBe(true);
    });

    test('should return photo categories', () => {
      const categories = photoService.getPhotoCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toHaveProperty('id');
      expect(categories[0]).toHaveProperty('name');
    });
  });

  describe('MetadataService', () => {
    test('should get construction metadata templates', () => {
      const templates = metadataService.getConstructionMetadataTemplates();
      expect(templates).toBeTruthy();
      expect(templates.progress).toBeTruthy();
      expect(templates.quality).toBeTruthy();
      expect(templates.progress.requiredFields).toBeTruthy();
    });

    test('should validate metadata', () => {
      const metadata = {
        caption: 'Test photo',
        location: { room: 'Test Room' },
        tags: ['test']
      };

      const validation = metadataService.validateMetadata(metadata);
      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('errors');
      expect(validation).toHaveProperty('warnings');
    });

    test('should auto-populate metadata', async () => {
      const context = {
        projectId: 'TEST_PROJECT',
        workCategory: 'Construction'
      };

      const metadata = await metadataService.autoPopulateMetadata(context);
      expect(metadata).toBeTruthy();
      expect(metadata.project.id).toBe('TEST_PROJECT');
      expect(metadata.project.workCategory).toBe('Construction');
      expect(metadata.tags).toContain('construction');
    });
  });
});

// Test if the services integrate properly
describe('Photo Services Integration', () => {
  test('should work together for complete photo workflow', async () => {
    // 1. Auto-populate metadata
    const context = {
      projectId: 'INTEGRATION_TEST',
      projectName: 'Test Project',
      workCategory: 'Millwork'
    };
    
    const autoMetadata = await metadataService.autoPopulateMetadata(context);
    expect(autoMetadata.project.workCategory).toBe('Millwork');

    // 2. Upload photo with metadata
    const mockFile = new MockFile('integration-test.jpg', 2048000, 'image/jpeg');
    const uploadResult = await photoService.uploadPhoto(mockFile, {
      ...autoMetadata,
      caption: 'Integration test photo',
      location: { floor: 'Second Floor', room: 'Workshop' }
    });

    expect(uploadResult.id).toBeTruthy();
    expect(uploadResult.caption).toBe('Integration test photo');
    expect(uploadResult.project.workCategory).toBe('Millwork');

    // 3. Retrieve and verify
    const projectPhotos = await photoService.getPhotosByProject('INTEGRATION_TEST');
    expect(projectPhotos.length).toBeGreaterThan(0);
    
    const uploadedPhoto = projectPhotos.find(p => p.id === uploadResult.id);
    expect(uploadedPhoto).toBeTruthy();
    expect(uploadedPhoto.location.room).toBe('Workshop');
  });
});

console.log('✅ Photo Services Test Suite - All tests should pass if services are working correctly');
console.log('🔧 Phase 1 Implementation Complete: Enhanced Photo Documentation System');