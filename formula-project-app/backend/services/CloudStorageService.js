/**
 * Formula PM Cloud Storage Service
 * Handles file uploads, storage, and management with AWS S3 integration
 */

// Optional AWS S3 dependencies
let S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, HeadObjectCommand, getSignedUrl;
try {
  const s3 = require('@aws-sdk/client-s3');
  const presigner = require('@aws-sdk/s3-request-presigner');
  S3Client = s3.S3Client;
  PutObjectCommand = s3.PutObjectCommand;
  GetObjectCommand = s3.GetObjectCommand;
  DeleteObjectCommand = s3.DeleteObjectCommand;
  ListObjectsV2Command = s3.ListObjectsV2Command;
  HeadObjectCommand = s3.HeadObjectCommand;
  getSignedUrl = presigner.getSignedUrl;
} catch (error) {
  console.log('⚠️  AWS S3 SDK not available - cloud storage features disabled');
}

// Optional sharp dependency for image processing
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('⚠️  Sharp not available - image processing features disabled');
}

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const cacheService = require('./cacheService');
const auditService = require('./auditService');

class CloudStorageService {
  constructor() {
    this.s3Client = null;
    this.isInitialized = false;
    this.config = {
      bucket: process.env.AWS_S3_BUCKET || 'formula-pm-storage',
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      cdnUrl: process.env.CDN_URL,
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024, // 100MB
      allowedTypes: [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain', 'text/csv', 'application/zip'
      ]
    };
    
    // Storage statistics
    this.stats = {
      totalUploads: 0,
      totalDownloads: 0,
      totalStorageUsed: 0,
      failedUploads: 0,
      averageUploadTime: 0
    };
    
    // Local storage fallback configuration
    this.localStorageConfig = {
      enabled: process.env.LOCAL_STORAGE_ENABLED === 'true',
      path: process.env.LOCAL_STORAGE_PATH || path.join(process.cwd(), 'uploads'),
      publicUrl: process.env.LOCAL_PUBLIC_URL || 'http://localhost:5014/uploads'
    };
  }

  /**
   * Initialize cloud storage service
   */
  async initialize() {
    try {
      if (this.isInitialized) {
        console.log('✅ Cloud Storage Service already initialized');
        return;
      }

      console.log('🚀 Initializing Cloud Storage Service...');

      // Initialize S3 client if AWS SDK is available and credentials are provided
      if (S3Client && this.config.accessKeyId && this.config.secretAccessKey) {
        this.s3Client = new S3Client({
          region: this.config.region,
          credentials: {
            accessKeyId: this.config.accessKeyId,
            secretAccessKey: this.config.secretAccessKey
          }
        });

        // Test S3 connection
        await this.testS3Connection();
        console.log('✅ AWS S3 client initialized successfully');
      } else {
        if (!S3Client) {
          console.log('ℹ️  AWS S3 SDK not available, using local storage');
        } else {
          console.warn('⚠️ AWS credentials not found, using local storage fallback');
        }
        await this.initializeLocalStorage();
      }

      this.isInitialized = true;
      console.log('✅ Cloud Storage Service initialized successfully');

      await auditService.logSystemEvent({
        event: 'cloud_storage_initialized',
        description: 'Cloud storage service started',
        metadata: {
          provider: this.s3Client ? 'AWS S3' : 'Local Storage',
          bucket: this.config.bucket,
          maxFileSize: this.config.maxFileSize
        }
      });

    } catch (error) {
      console.error('❌ Cloud Storage Service initialization failed:', error);
      
      // Fallback to local storage
      if (!this.localStorageConfig.enabled) {
        console.log('🔄 Falling back to local storage...');
        this.localStorageConfig.enabled = true;
        await this.initializeLocalStorage();
      }
    }
  }

  /**
   * Test S3 connection
   */
  async testS3Connection() {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.config.bucket,
        MaxKeys: 1
      });
      
      await this.s3Client.send(command);
    } catch (error) {
      if (error.name === 'NoSuchBucket') {
        throw new Error(`S3 bucket '${this.config.bucket}' does not exist`);
      }
      throw error;
    }
  }

  /**
   * Initialize local storage fallback
   */
  async initializeLocalStorage() {
    try {
      // Create upload directories
      const uploadPath = this.localStorageConfig.path;
      await fs.mkdir(uploadPath, { recursive: true });
      await fs.mkdir(path.join(uploadPath, 'images'), { recursive: true });
      await fs.mkdir(path.join(uploadPath, 'documents'), { recursive: true });
      await fs.mkdir(path.join(uploadPath, 'temp'), { recursive: true });
      
      console.log('✅ Local storage initialized at:', uploadPath);
    } catch (error) {
      console.error('❌ Local storage initialization failed:', error);
      throw error;
    }
  }

  /**
   * Upload file to storage
   */
  async uploadFile(fileBuffer, fileName, mimeType, options = {}) {
    try {
      const startTime = Date.now();
      
      // Validate file
      const validation = this.validateFile(fileBuffer, fileName, mimeType);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Generate unique file key
      const fileKey = this.generateFileKey(fileName, options.prefix);
      
      // Process file if needed (resize images, etc.)
      const processedBuffer = await this.processFile(fileBuffer, mimeType, options);
      
      let uploadResult;
      
      if (this.s3Client) {
        uploadResult = await this.uploadToS3(processedBuffer, fileKey, mimeType, options);
      } else {
        uploadResult = await this.uploadToLocal(processedBuffer, fileKey, mimeType, options);
      }

      const uploadTime = Date.now() - startTime;
      this.updateUploadStats(uploadTime, true);

      // Cache file metadata
      await this.cacheFileMetadata(fileKey, {
        ...uploadResult,
        originalName: fileName,
        mimeType,
        size: processedBuffer.length,
        uploadedAt: new Date()
      });

      // Log upload
      await auditService.logSystemEvent({
        event: 'file_uploaded',
        description: `File uploaded: ${fileName}`,
        metadata: {
          fileKey,
          size: processedBuffer.length,
          mimeType,
          uploadTime,
          provider: this.s3Client ? 'S3' : 'Local'
        }
      });

      return {
        ...uploadResult,
        fileKey,
        originalName: fileName,
        size: processedBuffer.length,
        uploadTime
      };

    } catch (error) {
      this.updateUploadStats(0, false);
      console.error('❌ File upload failed:', error);
      throw error;
    }
  }

  /**
   * Upload file to S3
   */
  async uploadToS3(fileBuffer, fileKey, mimeType, options = {}) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: mimeType,
        Metadata: {
          uploadedBy: options.userId?.toString() || 'system',
          projectId: options.projectId?.toString() || '',
          uploadedAt: new Date().toISOString()
        },
        ServerSideEncryption: 'AES256'
      });

      await this.s3Client.send(command);

      const url = this.config.cdnUrl 
        ? `${this.config.cdnUrl}/${fileKey}`
        : `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${fileKey}`;

      return {
        url,
        provider: 'S3',
        bucket: this.config.bucket,
        region: this.config.region
      };
    } catch (error) {
      console.error('❌ S3 upload error:', error);
      throw error;
    }
  }

  /**
   * Upload file to local storage
   */
  async uploadToLocal(fileBuffer, fileKey, mimeType, options = {}) {
    try {
      const filePath = path.join(this.localStorageConfig.path, fileKey);
      const directory = path.dirname(filePath);
      
      // Ensure directory exists
      await fs.mkdir(directory, { recursive: true });
      
      // Write file
      await fs.writeFile(filePath, fileBuffer);
      
      const url = `${this.localStorageConfig.publicUrl}/${fileKey}`;
      
      return {
        url,
        provider: 'Local',
        path: filePath
      };
    } catch (error) {
      console.error('❌ Local upload error:', error);
      throw error;
    }
  }

  /**
   * Download file from storage
   */
  async downloadFile(fileKey) {
    try {
      const startTime = Date.now();
      
      let fileBuffer;
      
      if (this.s3Client) {
        fileBuffer = await this.downloadFromS3(fileKey);
      } else {
        fileBuffer = await this.downloadFromLocal(fileKey);
      }

      const downloadTime = Date.now() - startTime;
      this.stats.totalDownloads++;

      // Log download
      await auditService.logSystemEvent({
        event: 'file_downloaded',
        description: `File downloaded: ${fileKey}`,
        metadata: {
          fileKey,
          downloadTime,
          provider: this.s3Client ? 'S3' : 'Local'
        }
      });

      return fileBuffer;
    } catch (error) {
      console.error('❌ File download failed:', error);
      throw error;
    }
  }

  /**
   * Download file from S3
   */
  async downloadFromS3(fileKey) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: fileKey
      });

      const response = await this.s3Client.send(command);
      
      // Convert stream to buffer
      const chunks = [];
      for await (const chunk of response.Body) {
        chunks.push(chunk);
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('❌ S3 download error:', error);
      throw error;
    }
  }

  /**
   * Download file from local storage
   */
  async downloadFromLocal(fileKey) {
    try {
      const filePath = path.join(this.localStorageConfig.path, fileKey);
      return await fs.readFile(filePath);
    } catch (error) {
      console.error('❌ Local download error:', error);
      throw error;
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(fileKey) {
    try {
      if (this.s3Client) {
        await this.deleteFromS3(fileKey);
      } else {
        await this.deleteFromLocal(fileKey);
      }

      // Remove from cache
      await this.removeCachedFileMetadata(fileKey);

      // Log deletion
      await auditService.logSystemEvent({
        event: 'file_deleted',
        description: `File deleted: ${fileKey}`,
        metadata: {
          fileKey,
          provider: this.s3Client ? 'S3' : 'Local'
        }
      });

      return true;
    } catch (error) {
      console.error('❌ File deletion failed:', error);
      throw error;
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFromS3(fileKey) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: fileKey
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('❌ S3 deletion error:', error);
      throw error;
    }
  }

  /**
   * Delete file from local storage
   */
  async deleteFromLocal(fileKey) {
    try {
      const filePath = path.join(this.localStorageConfig.path, fileKey);
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('❌ Local deletion error:', error);
        throw error;
      }
    }
  }

  /**
   * Generate signed URL for file access
   */
  async generateSignedUrl(fileKey, expiresIn = 3600) {
    try {
      if (this.s3Client) {
        const command = new GetObjectCommand({
          Bucket: this.config.bucket,
          Key: fileKey
        });

        const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
        return signedUrl;
      } else {
        // For local storage, return direct URL (not actually signed)
        return `${this.localStorageConfig.publicUrl}/${fileKey}`;
      }
    } catch (error) {
      console.error('❌ Generate signed URL error:', error);
      throw error;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(fileKey) {
    try {
      // Try cache first
      const cached = await this.getCachedFileMetadata(fileKey);
      if (cached) {
        return cached;
      }

      // Get from storage
      let metadata;
      
      if (this.s3Client) {
        metadata = await this.getS3FileMetadata(fileKey);
      } else {
        metadata = await this.getLocalFileMetadata(fileKey);
      }

      // Cache for future requests
      await this.cacheFileMetadata(fileKey, metadata);
      
      return metadata;
    } catch (error) {
      console.error('❌ Get file metadata error:', error);
      throw error;
    }
  }

  /**
   * Get S3 file metadata
   */
  async getS3FileMetadata(fileKey) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.config.bucket,
        Key: fileKey
      });

      const response = await this.s3Client.send(command);
      
      return {
        size: response.ContentLength,
        mimeType: response.ContentType,
        lastModified: response.LastModified,
        etag: response.ETag,
        metadata: response.Metadata
      };
    } catch (error) {
      console.error('❌ S3 metadata error:', error);
      throw error;
    }
  }

  /**
   * Get local file metadata
   */
  async getLocalFileMetadata(fileKey) {
    try {
      const filePath = path.join(this.localStorageConfig.path, fileKey);
      const stats = await fs.stat(filePath);
      
      return {
        size: stats.size,
        lastModified: stats.mtime,
        created: stats.birthtime
      };
    } catch (error) {
      console.error('❌ Local metadata error:', error);
      throw error;
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(fileBuffer, fileName, mimeType) {
    // Check file size
    if (fileBuffer.length > this.config.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds limit of ${this.config.maxFileSize / (1024 * 1024)}MB`
      };
    }

    // Check file type
    if (!this.config.allowedTypes.includes(mimeType)) {
      return {
        valid: false,
        error: `File type ${mimeType} is not allowed`
      };
    }

    // Check filename
    if (!fileName || fileName.length > 255) {
      return {
        valid: false,
        error: 'Invalid filename'
      };
    }

    return { valid: true };
  }

  /**
   * Process file (resize images, etc.)
   */
  async processFile(fileBuffer, mimeType, options = {}) {
    try {
      // Process images
      if (mimeType.startsWith('image/') && options.resize) {
        return await this.resizeImage(fileBuffer, options.resize);
      }

      // TODO: Add document processing, virus scanning, etc.
      
      return fileBuffer;
    } catch (error) {
      console.error('❌ File processing error:', error);
      return fileBuffer; // Return original if processing fails
    }
  }

  /**
   * Resize image
   */
  async resizeImage(imageBuffer, resizeOptions) {
    try {
      // Check if sharp is available
      if (!sharp) {
        console.log('⚠️  Sharp not available - returning original image buffer');
        return imageBuffer;
      }

      const { width, height, quality = 80 } = resizeOptions;
      
      let sharpInstance = sharp(imageBuffer);
      
      if (width || height) {
        sharpInstance = sharpInstance.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      
      return await sharpInstance
        .jpeg({ quality })
        .toBuffer();
    } catch (error) {
      console.error('❌ Image resize error:', error);
      // Fallback to original buffer if processing fails
      return imageBuffer;
    }
  }

  /**
   * Generate unique file key
   */
  generateFileKey(fileName, prefix = '') {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9]/g, '_');
    
    const key = prefix 
      ? `${prefix}/${timestamp}_${random}_${baseName}${ext}`
      : `${timestamp}_${random}_${baseName}${ext}`;
    
    return key;
  }

  /**
   * Cache file metadata
   */
  async cacheFileMetadata(fileKey, metadata) {
    try {
      if (cacheService.isConnected) {
        const cacheKey = cacheService.generateKey('file', fileKey);
        await cacheService.set(cacheKey, metadata, 86400); // 24 hours
      }
    } catch (error) {
      console.error('❌ Cache metadata error:', error);
    }
  }

  /**
   * Get cached file metadata
   */
  async getCachedFileMetadata(fileKey) {
    try {
      if (cacheService.isConnected) {
        const cacheKey = cacheService.generateKey('file', fileKey);
        return await cacheService.get(cacheKey);
      }
      return null;
    } catch (error) {
      console.error('❌ Get cached metadata error:', error);
      return null;
    }
  }

  /**
   * Remove cached file metadata
   */
  async removeCachedFileMetadata(fileKey) {
    try {
      if (cacheService.isConnected) {
        const cacheKey = cacheService.generateKey('file', fileKey);
        await cacheService.delete(cacheKey);
      }
    } catch (error) {
      console.error('❌ Remove cached metadata error:', error);
    }
  }

  /**
   * Update upload statistics
   */
  updateUploadStats(uploadTime, success) {
    if (success) {
      this.stats.totalUploads++;
      
      // Calculate rolling average upload time
      const alpha = 0.1;
      this.stats.averageUploadTime = 
        (this.stats.averageUploadTime * (1 - alpha)) + (uploadTime * alpha);
    } else {
      this.stats.failedUploads++;
    }
  }

  /**
   * Get service statistics
   */
  getServiceStats() {
    return {
      ...this.stats,
      provider: this.s3Client ? 'AWS S3' : 'Local Storage',
      config: {
        bucket: this.config.bucket,
        maxFileSize: this.config.maxFileSize,
        allowedTypes: this.config.allowedTypes.length
      },
      isInitialized: this.isInitialized,
      timestamp: new Date()
    };
  }

  /**
   * Get service status
   */
  getServiceStatus() {
    return {
      status: this.isInitialized ? 'operational' : 'initializing',
      provider: this.s3Client ? 'AWS S3' : 'Local Storage',
      bucket: this.config.bucket,
      statistics: this.stats,
      timestamp: new Date()
    };
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    try {
      console.log('🔄 Shutting down Cloud Storage Service...');
      
      // Clear cached data
      this.s3Client = null;
      this.isInitialized = false;
      
      console.log('✅ Cloud Storage Service shutdown complete');
      
      await auditService.logSystemEvent({
        event: 'cloud_storage_shutdown',
        description: 'Cloud storage service stopped gracefully',
        metadata: { finalStats: this.stats }
      });

    } catch (error) {
      console.error('❌ Cloud Storage Service shutdown error:', error);
    }
  }
}

// Create singleton instance
const cloudStorageService = new CloudStorageService();

module.exports = cloudStorageService;