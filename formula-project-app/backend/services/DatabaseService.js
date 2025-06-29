/**
 * Database Service - Single Prisma Instance Manager
 * Manages a single shared Prisma client instance across all services
 */

const { PrismaClient } = require('@prisma/client');

class DatabaseService {
  constructor() {
    this.prisma = null;
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxConnectionAttempts = 3;
    this.connectionTimeout = 30000; // 30 seconds
    this.connectionMonitorInterval = null;
  }

  /**
   * Initialize the single Prisma client instance
   */
  async initialize() {
    if (this.prisma) {
      console.log('📊 Database service already initialized');
      return this.prisma;
    }

    console.log('🔄 Initializing shared Prisma client...');

    try {
      this.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' 
          ? ['query', 'info', 'warn', 'error'] 
          : ['error'],
        errorFormat: 'pretty',
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        },
        // Connection pool configuration for optimal performance
        __internal: {
          engine: {
            // Connection pool settings
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 20,
            // Connection timeout
            connectTimeout: this.connectionTimeout,
            // Pool timeout
            poolTimeout: parseInt(process.env.DB_POOL_TIMEOUT) || 10000,
            // Maximum connection idle time
            idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT) || 600000, // 10 minutes
          }
        }
      });

      // Test the connection
      await this.prisma.$connect();
      await this.prisma.$queryRaw`SELECT 1`;
      
      this.isConnected = true;
      this.connectionAttempts = 0;
      
      console.log('✅ Shared Prisma client initialized successfully');
      console.log(`📊 Connection pool limit: ${process.env.DB_CONNECTION_LIMIT || 20}`);
      
      // Set up connection monitoring
      this.setupConnectionMonitoring();
      
      return this.prisma;
    } catch (error) {
      this.connectionAttempts++;
      console.error(`❌ Failed to initialize Prisma client (attempt ${this.connectionAttempts}):`, error.message);
      
      if (this.connectionAttempts < this.maxConnectionAttempts) {
        console.log(`🔄 Retrying database connection in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.initialize();
      } else {
        throw new Error(`Database connection failed after ${this.maxConnectionAttempts} attempts: ${error.message}`);
      }
    }
  }

  /**
   * Get the shared Prisma client instance
   */
  getClient() {
    if (!this.prisma) {
      throw new Error('Database service not initialized. Call initialize() first.');
    }
    return this.prisma;
  }

  /**
   * Check if the database is connected
   */
  isReady() {
    return this.isConnected && this.prisma !== null;
  }

  /**
   * Get connection health status
   */
  async getHealthStatus() {
    try {
      if (!this.prisma) {
        return { status: 'disconnected', error: 'Prisma client not initialized' };
      }

      // Test basic connectivity
      await this.prisma.$queryRaw`SELECT 1`;
      
      // Get connection pool stats (if available)
      const metrics = await this.getConnectionMetrics();
      
      return {
        status: 'healthy',
        connected: this.isConnected,
        metrics
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        connected: false,
        error: error.message
      };
    }
  }

  /**
   * Get connection pool metrics
   */
  async getConnectionMetrics() {
    try {
      // Get basic database stats
      const [userCount, projectCount, taskCount] = await Promise.all([
        this.prisma.user.count().catch(() => 0),
        this.prisma.project.count().catch(() => 0),
        this.prisma.task.count().catch(() => 0)
      ]);

      return {
        records: {
          users: userCount,
          projects: projectCount,
          tasks: taskCount
        },
        connectionPool: {
          limit: process.env.DB_CONNECTION_LIMIT || 20,
          timeout: process.env.DB_POOL_TIMEOUT || 10000,
          idleTimeout: process.env.DB_IDLE_TIMEOUT || 600000
        }
      };
    } catch (error) {
      console.error('❌ Error getting connection metrics:', error);
      return {
        error: error.message
      };
    }
  }

  /**
   * Setup connection monitoring and health checks
   */
  setupConnectionMonitoring() {
    // Monitor connection every 30 seconds
    this.connectionMonitorInterval = setInterval(async () => {
      try {
        await this.prisma.$queryRaw`SELECT 1`;
        if (!this.isConnected) {
          this.isConnected = true;
          console.log('✅ Database connection restored');
        }
      } catch (error) {
        if (this.isConnected) {
          this.isConnected = false;
          console.error('❌ Database connection lost:', error.message);
        }
      }
    }, 30000);
  }

  /**
   * Execute a database operation with error handling
   */
  async executeOperation(operation, context = 'database operation') {
    if (!this.prisma) {
      throw new Error('Database service not initialized');
    }

    try {
      return await operation(this.prisma);
    } catch (error) {
      console.error(`❌ Database operation failed (${context}):`, error.message);
      
      // If it's a connection error, try to reconnect
      if (error.code === 'P1001' || error.code === 'P1017') {
        console.log('🔄 Attempting to reconnect to database...');
        try {
          await this.prisma.$connect();
          this.isConnected = true;
          // Retry the operation once
          return await operation(this.prisma);
        } catch (reconnectError) {
          console.error('❌ Failed to reconnect:', reconnectError.message);
          this.isConnected = false;
        }
      }
      
      throw error;
    }
  }

  /**
   * Gracefully shutdown the database connection
   */
  async shutdown() {
    try {
      console.log('🔄 Shutting down database connection...');
      
      // Clear connection monitoring interval to prevent memory leaks
      if (this.connectionMonitorInterval) {
        clearInterval(this.connectionMonitorInterval);
        this.connectionMonitorInterval = null;
        console.log('✅ Database connection monitoring stopped');
      }
      
      if (this.prisma) {
        await this.prisma.$disconnect();
        this.prisma = null;
        this.isConnected = false;
        console.log('✅ Database connection closed');
      }
    } catch (error) {
      console.error('❌ Error during database shutdown:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const databaseService = new DatabaseService();

module.exports = databaseService;