/**
 * Formula PM Audit Logging Service
 * Comprehensive audit trail for compliance and data integrity tracking
 */

const cacheService = require('./cacheService');

// Will be initialized with shared database service
let prisma = null;

class AuditService {
  constructor() {
    this.config = {
      retentionDays: parseInt(process.env.AUDIT_RETENTION_DAYS) || 365,
      enableCaching: true,
      batchSize: 100,
      flushInterval: 30000, // 30 seconds
      sensitiveFields: [
        'password', 'passwordHash', 'token', 'secret', 
        'apiKey', 'credentials', 'ssn', 'creditCard'
      ],
      // Database connection settings
      connectionRetryAttempts: 3,
      connectionRetryDelay: 5000, // 5 seconds
      enableFallbackLogging: true
    };
    
    // Batch processing for high-volume audit logs
    this.batchQueue = [];
    this.flushTimer = null;
    
    // Database connection state
    this.isDatabaseAvailable = false;
    this.lastConnectionCheck = 0;
    this.connectionCheckInterval = 60000; // 1 minute
    this.connectionRetryCount = 0;
    
    // Statistics
    this.stats = {
      logsCreated: 0,
      batchesProcessed: 0,
      errors: 0,
      connectionErrors: 0,
      fallbackLogs: 0,
      lastFlush: Date.now(),
      lastConnectionAttempt: 0
    };
    
    this.flushTimer = null;
    this.isInitialized = false;
  }
  
  /**
   * Set the shared Prisma client
   */
  setPrismaClient(prismaClient) {
    prisma = prismaClient;
  }

  /**
   * Check database connection availability with timeout
   */
  async checkDatabaseConnection(timeoutMs = 3000) {
    if (!prisma) {
      this.isDatabaseAvailable = false;
      return false;
    }

    const now = Date.now();
    
    // Skip check if recently checked
    if (now - this.lastConnectionCheck < this.connectionCheckInterval && this.isDatabaseAvailable) {
      return this.isDatabaseAvailable;
    }

    try {
      // Simple query to test connection with timeout
      const connectionPromise = prisma.$queryRaw`SELECT 1`;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), timeoutMs)
      );
      
      await Promise.race([connectionPromise, timeoutPromise]);
      
      if (!this.isDatabaseAvailable) {
        console.log('✅ Database connection restored for audit service');
      }
      
      this.isDatabaseAvailable = true;
      this.lastConnectionCheck = now;
      this.connectionRetryCount = 0;
      this.stats.lastConnectionAttempt = now;
      
      return true;
    } catch (error) {
      const wasAvailable = this.isDatabaseAvailable;
      this.isDatabaseAvailable = false;
      this.lastConnectionCheck = now;
      this.stats.connectionErrors++;
      this.stats.lastConnectionAttempt = now;
      this.connectionRetryCount++;

      // Only log first connection failure or significant retry milestones
      if (wasAvailable || this.connectionRetryCount === 1 || this.connectionRetryCount % 10 === 0) {
        if (error.message === 'Connection timeout') {
          console.log(`⚠️  Database connection timeout for audit service (${timeoutMs}ms) - continuing with fallback logging`);
        } else if (error.code === 'P1001' || error.message.includes("Can't reach database")) {
          console.log(`⚠️  Database unavailable for audit service (attempt ${this.connectionRetryCount}) - continuing with fallback logging`);
        } else {
          console.log(`⚠️  Database connection error for audit service: ${error.message}`);
        }
      }
      
      return false;
    }
  }

  /**
   * Initialize service (called by ServiceRegistry)
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }

    if (!prisma) {
      console.log('⚠️  AuditService: No Prisma client available - running in fallback mode');
      this.isDatabaseAvailable = false;
    } else {
      console.log('🔄 Checking database connection for audit service...');
      // Use short timeout for initialization to prevent blocking
      await this.checkDatabaseConnection(1000); // 1 second timeout
    }
    
    console.log('🔄 Initializing audit service...');
    this.startBatchProcessor();
    this.isInitialized = true;
    
    if (this.isDatabaseAvailable) {
      console.log('✅ Audit service initialized with database connection');
    } else {
      console.log('✅ Audit service initialized in fallback mode (no database)');
    }
  }

  /**
   * Log a data change audit entry
   */
  async logDataChange(options) {
    const {
      tableName,
      recordId,
      action, // 'create', 'update', 'delete'
      oldValues = null,
      newValues = null,
      userId = null,
      userEmail = null,
      ipAddress = null,
      userAgent = null,
      metadata = {}
    } = options;

    try {
      // Sanitize sensitive data
      const sanitizedOldValues = this.sanitizeData(oldValues);
      const sanitizedNewValues = this.sanitizeData(newValues);
      
      // Calculate changed fields for updates
      const changedFields = this.getChangedFields(sanitizedOldValues, sanitizedNewValues);
      
      const auditEntry = {
        tableName,
        recordId: recordId.toString(),
        action,
        oldValues: sanitizedOldValues,
        newValues: sanitizedNewValues,
        changedFields,
        userId,
        userEmail,
        ipAddress,
        userAgent,
        metadata
      };

      // Add to batch queue for processing
      this.batchQueue.push(auditEntry);
      
      // If batch is full, flush immediately
      if (this.batchQueue.length >= this.config.batchSize) {
        await this.flushBatch();
      }
      
      this.stats.logsCreated++;
      
      return true;
    } catch (error) {
      console.error('❌ Audit logging error:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Log user action audit entry
   */
  async logUserAction(options) {
    const {
      action, // 'login', 'logout', 'view', 'export', 'approve', 'reject'
      entityType = 'system',
      entityId = null,
      userId,
      userEmail,
      ipAddress = null,
      userAgent = null,
      details = {}
    } = options;

    return this.logDataChange({
      tableName: 'user_actions',
      recordId: entityId || 'system',
      action,
      newValues: {
        entityType,
        entityId,
        details,
        timestamp: new Date().toISOString()
      },
      userId,
      userEmail,
      ipAddress,
      userAgent,
      metadata: { type: 'user_action' }
    });
  }

  /**
   * Log system event
   */
  async logSystemEvent(options) {
    const {
      event, // 'startup', 'shutdown', 'error', 'backup', 'migration'
      severity = 'info', // 'info', 'warning', 'error', 'critical'
      description,
      metadata = {}
    } = options;

    return this.logDataChange({
      tableName: 'system_events',
      recordId: 'system',
      action: event,
      newValues: {
        severity,
        description,
        timestamp: new Date().toISOString(),
        metadata
      },
      userEmail: 'system@formulapm.com',
      metadata: { type: 'system_event', severity }
    });
  }

  /**
   * Get changed fields between old and new values
   */
  getChangedFields(oldValues, newValues) {
    if (!oldValues || !newValues) {
      return [];
    }

    const changedFields = [];
    const allKeys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);

    for (const key of allKeys) {
      const oldValue = oldValues[key];
      const newValue = newValues[key];
      
      // Compare values (handle different types)
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changedFields.push(key);
      }
    }

    return changedFields;
  }

  /**
   * Remove sensitive data from audit logs
   */
  sanitizeData(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sanitized = { ...data };
    
    for (const field of this.config.sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
      
      // Check for fields containing sensitive keywords
      for (const key of Object.keys(sanitized)) {
        if (key.toLowerCase().includes(field.toLowerCase()) && sanitized[key]) {
          sanitized[key] = '[REDACTED]';
        }
      }
    }

    return sanitized;
  }

  /**
   * Start batch processor for high-volume audit logs
   */
  startBatchProcessor() {
    this.flushTimer = setInterval(() => {
      if (this.batchQueue.length > 0) {
        this.flushBatch().catch(error => {
          console.error('❌ Batch flush error:', error);
          this.stats.errors++;
        });
      }
    }, this.config.flushInterval);
  }

  /**
   * Fallback logging when database is unavailable
   */
  logToFallback(entries) {
    if (!this.config.enableFallbackLogging) {
      return;
    }

    for (const entry of entries) {
      const timestamp = new Date().toISOString();
      const logMessage = `[AUDIT-FALLBACK ${timestamp}] ${entry.action.toUpperCase()} ${entry.tableName}/${entry.recordId} by ${entry.userEmail || 'system'}`;
      
      if (entry.changedFields && entry.changedFields.length > 0) {
        console.log(`${logMessage} - Changed: ${entry.changedFields.join(', ')}`);
      } else {
        console.log(logMessage);
      }
      
      this.stats.fallbackLogs++;
    }
  }

  /**
   * Flush batch queue to database
   */
  async flushBatch() {
    if (this.batchQueue.length === 0) {
      return;
    }

    const batch = [...this.batchQueue];
    this.batchQueue = [];

    // Check database connection before attempting to write (short timeout for batching)
    const dbAvailable = await this.checkDatabaseConnection(2000);
    
    if (!dbAvailable) {
      // Use fallback logging
      this.logToFallback(batch);
      this.stats.lastFlush = Date.now();
      return;
    }

    try {
      await prisma.auditLog.createMany({
        data: batch
      });
      
      this.stats.batchesProcessed++;
      this.stats.lastFlush = Date.now();
      
      console.log(`✅ Audit batch flushed: ${batch.length} entries`);
    } catch (error) {
      // Handle Prisma-specific errors
      if (error.code === 'P1001' || error.code === 'P1002' || error.message.includes("Can't reach database")) {
        console.log(`⚠️  Database unavailable during audit flush - using fallback logging for ${batch.length} entries`);
        this.isDatabaseAvailable = false;
        this.logToFallback(batch);
        this.stats.connectionErrors++;
      } else {
        console.error('❌ Batch flush database error:', error);
        this.stats.errors++;
        // Re-add failed entries to queue for retry
        this.batchQueue.unshift(...batch);
      }
    }
  }

  /**
   * Query audit logs with filtering
   */
  async queryAuditLogs(options = {}) {
    const {
      tableName = null,
      recordId = null,
      userId = null,
      action = null,
      startDate = null,
      endDate = null,
      limit = 100,
      offset = 0,
      orderBy = 'timestamp',
      orderDirection = 'desc'
    } = options;

    // Check database availability first (short timeout for queries)
    const dbAvailable = await this.checkDatabaseConnection(1500);
    if (!dbAvailable) {
      console.log('⚠️  Database unavailable for audit query - returning empty results');
      return {
        logs: [],
        total: 0,
        message: 'Database unavailable - audit logs cannot be queried'
      };
    }

    try {
      // Build cache key for frequent queries
      const cacheKey = cacheService.generateKey('audit', `query_${JSON.stringify(options)}`);
      
      // Check cache first
      if (this.config.enableCaching) {
        const cached = await cacheService.get(cacheKey);
        if (cached) {
          return cached;
        }
      }

      // Build where clause
      const where = {};
      if (tableName) where.tableName = tableName;
      if (recordId) where.recordId = recordId.toString();
      if (userId) where.userId = userId;
      if (action) where.action = action;
      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp.gte = new Date(startDate);
        if (endDate) where.timestamp.lte = new Date(endDate);
      }

      const auditLogs = await prisma.auditLog.findMany({
        where,
        orderBy: {
          [orderBy]: orderDirection
        },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          }
        }
      });

      const total = await prisma.auditLog.count({ where });

      const result = {
        data: auditLogs,
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      };

      // Cache results for 5 minutes
      if (this.config.enableCaching) {
        await cacheService.set(cacheKey, result, 300);
      }

      return result;
    } catch (error) {
      console.error('❌ Audit query error:', error);
      throw error;
    }
  }

  /**
   * Get audit trail for specific record
   */
  async getRecordHistory(tableName, recordId, options = {}) {
    const {
      limit = 50,
      includeUserActions = true
    } = options;

    try {
      const cacheKey = cacheService.generateKey('audit', `history_${tableName}_${recordId}`);
      
      if (this.config.enableCaching) {
        const cached = await cacheService.get(cacheKey);
        if (cached) {
          return cached;
        }
      }

      const where = {
        tableName,
        recordId: recordId.toString()
      };

      const auditLogs = await prisma.auditLog.findMany({
        where,
        orderBy: {
          timestamp: 'desc'
        },
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          }
        }
      });

      // Enrich with formatted changes
      const enrichedLogs = auditLogs.map(log => ({
        ...log,
        formattedChanges: this.formatChanges(log.changedFields, log.oldValues, log.newValues),
        actionDescription: this.getActionDescription(log.action, log.tableName, log.changedFields)
      }));

      const result = {
        tableName,
        recordId,
        history: enrichedLogs,
        totalChanges: auditLogs.length
      };

      // Cache for 2 minutes
      if (this.config.enableCaching) {
        await cacheService.set(cacheKey, result, 120);
      }

      return result;
    } catch (error) {
      console.error('❌ Record history error:', error);
      throw error;
    }
  }

  /**
   * Format changes for human-readable display
   */
  formatChanges(changedFields, oldValues, newValues) {
    if (!changedFields || changedFields.length === 0) {
      return [];
    }

    return changedFields.map(field => {
      const oldValue = oldValues?.[field];
      const newValue = newValues?.[field];
      
      return {
        field,
        oldValue: this.formatValue(oldValue),
        newValue: this.formatValue(newValue),
        changed: true
      };
    });
  }

  /**
   * Format value for display
   */
  formatValue(value) {
    if (value === null || value === undefined) {
      return 'null';
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    
    return value.toString();
  }

  /**
   * Get human-readable action description
   */
  getActionDescription(action, tableName, changedFields) {
    const descriptions = {
      create: `Created new ${tableName.replace('_', ' ')}`,
      update: `Updated ${tableName.replace('_', ' ')} (${changedFields?.length || 0} fields changed)`,
      delete: `Deleted ${tableName.replace('_', ' ')}`,
      view: `Viewed ${tableName.replace('_', ' ')}`,
      approve: `Approved ${tableName.replace('_', ' ')}`,
      reject: `Rejected ${tableName.replace('_', ' ')}`
    };
    
    return descriptions[action] || `Performed ${action} on ${tableName.replace('_', ' ')}`;
  }

  /**
   * Get audit statistics
   */
  async getAuditStats(options = {}) {
    const {
      startDate = null,
      endDate = null,
      tableName = null
    } = options;

    try {
      const where = {};
      if (tableName) where.tableName = tableName;
      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp.gte = new Date(startDate);
        if (endDate) where.timestamp.lte = new Date(endDate);
      }

      const [
        totalLogs,
        actionStats,
        tableStats,
        userStats
      ] = await Promise.all([
        prisma.auditLog.count({ where }),
        
        prisma.auditLog.groupBy({
          by: ['action'],
          where,
          _count: { action: true }
        }),
        
        prisma.auditLog.groupBy({
          by: ['tableName'],
          where,
          _count: { tableName: true }
        }),
        
        prisma.auditLog.groupBy({
          by: ['userId'],
          where,
          _count: { userId: true }
        })
      ]);

      return {
        total: totalLogs,
        serviceStats: this.stats,
        actions: actionStats.reduce((acc, item) => {
          acc[item.action] = item._count.action;
          return acc;
        }, {}),
        tables: tableStats.reduce((acc, item) => {
          acc[item.tableName] = item._count.tableName;
          return acc;
        }, {}),
        users: userStats.reduce((acc, item) => {
          acc[item.userId || 'system'] = item._count.userId;
          return acc;
        }, {}),
        queueStatus: {
          pending: this.batchQueue.length,
          lastFlush: new Date(this.stats.lastFlush).toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Audit stats error:', error);
      throw error;
    }
  }

  /**
   * Cleanup old audit logs based on retention policy
   */
  async cleanupOldLogs() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

      const deletedCount = await prisma.auditLog.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      });

      console.log(`✅ Cleaned up ${deletedCount.count} old audit logs`);
      
      // Log the cleanup event
      await this.logSystemEvent({
        event: 'audit_cleanup',
        description: `Cleaned up ${deletedCount.count} audit logs older than ${this.config.retentionDays} days`,
        metadata: { deletedCount: deletedCount.count, cutoffDate }
      });

      return deletedCount.count;
    } catch (error) {
      console.error('❌ Audit cleanup error:', error);
      throw error;
    }
  }

  /**
   * Export audit logs for compliance
   */
  async exportAuditLogs(options = {}) {
    const {
      format = 'json', // 'json', 'csv'
      startDate = null,
      endDate = null,
      tableName = null
    } = options;

    try {
      const logs = await this.queryAuditLogs({
        tableName,
        startDate,
        endDate,
        limit: 10000 // Large limit for export
      });

      if (format === 'csv') {
        return this.convertToCSV(logs.data);
      }

      return {
        exportDate: new Date().toISOString(),
        criteria: { tableName, startDate, endDate },
        totalRecords: logs.total,
        data: logs.data
      };
    } catch (error) {
      console.error('❌ Audit export error:', error);
      throw error;
    }
  }

  /**
   * Convert audit logs to CSV format
   */
  convertToCSV(logs) {
    if (logs.length === 0) {
      return '';
    }

    const headers = ['timestamp', 'tableName', 'recordId', 'action', 'userId', 'userEmail', 'changedFields', 'ipAddress'];
    const csvRows = [headers.join(',')];

    for (const log of logs) {
      const row = [
        log.timestamp,
        log.tableName,
        log.recordId,
        log.action,
        log.userId || '',
        log.userEmail || '',
        log.changedFields?.join(';') || '',
        log.ipAddress || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`);
      
      csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
  }

  /**
   * Get service health status
   */
  getHealthStatus() {
    return {
      healthy: this.isInitialized,
      database: this.isDatabaseAvailable,
      queueLength: this.batchQueue.length,
      lastFlush: this.stats.lastFlush,
      stats: {
        ...this.stats,
        uptime: Date.now() - (this.stats.lastFlush - 30000) // Approximate uptime
      }
    };
  }

  /**
   * Shutdown audit service
   */
  async shutdown() {
    console.log('🔄 Shutting down audit service...');
    
    // Clear flush timer
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    // Flush remaining batch with timeout to prevent hanging
    try {
      const flushPromise = this.flushBatch();
      const timeoutPromise = new Promise((resolve) => 
        setTimeout(() => {
          console.log('⚠️  Audit service flush timeout during shutdown - proceeding');
          resolve();
        }, 3000)
      );
      
      await Promise.race([flushPromise, timeoutPromise]);
    } catch (error) {
      console.log('⚠️  Error during audit service shutdown flush:', error.message);
    }
    
    console.log('✅ Audit service shutdown complete');
  }
}

// Create singleton instance
const auditService = new AuditService();

module.exports = auditService;