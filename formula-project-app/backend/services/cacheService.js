/**
 * Formula PM Redis Caching Service
 * Provides enterprise-grade caching with connection pooling and performance optimization
 */

const redis = require('redis');
const { promisify } = require('util');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxConnectionAttempts = 5;
    this.retryDelay = 1000; // 1 second
    
    // Cache configuration
    this.config = {
      defaultTTL: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour
      maxKeys: parseInt(process.env.CACHE_MAX_KEYS) || 1000,
      keyPrefix: 'formula_pm:',
      compression: true,
      retryAttempts: 3
    };
    
    // Cache hit/miss statistics
    this.stats = {
      hits: 0,
      misses: 0,
      errors: 0,
      lastReset: Date.now()
    };
    
    // Cache key patterns for different data types
    this.keyPatterns = {
      user: 'user:',
      project: 'project:',
      task: 'task:',
      client: 'client:',
      shopDrawing: 'drawing:',
      materialSpec: 'material:',
      notification: 'notification:',
      audit: 'audit:',
      search: 'search:',
      stats: 'stats:',
      session: 'session:'
    };
  }

  /**
   * Initialize Redis connection with retry logic
   */
  async connect() {
    if (this.isConnected) {
      return this.client;
    }

    try {
      console.log('🔄 Connecting to Redis...');
      
      // Create Redis client with configuration
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        password: process.env.REDIS_PASSWORD || undefined,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            console.error('❌ Redis server refused connection');
            return new Error('Redis server refused connection');
          }
          
          if (options.total_retry_time > 1000 * 60 * 60) {
            console.error('❌ Redis retry time exhausted');
            return new Error('Redis retry time exhausted');
          }
          
          if (options.attempt > this.maxConnectionAttempts) {
            console.error('❌ Redis max connection attempts reached');
            return new Error('Redis max connection attempts reached');
          }
          
          return Math.min(options.attempt * 100, 3000);
        },
        socket: {
          connectTimeout: 5000,
          lazyConnect: true
        }
      });

      // Set up event handlers
      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
        this.connectionAttempts = 0;
      });

      this.client.on('error', (error) => {
        console.error('❌ Redis connection error:', error);
        this.isConnected = false;
        this.stats.errors++;
      });

      this.client.on('end', () => {
        console.log('⚠️ Redis connection ended');
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        console.log('🔄 Redis reconnecting...');
        this.connectionAttempts++;
      });

      // Connect to Redis
      await this.client.connect();
      
      // Test connection
      await this.client.ping();
      console.log('✅ Redis connection test successful');
      
      return this.client;
      
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      this.isConnected = false;
      
      // If Redis is not available, continue without caching
      console.log('⚠️ Continuing without Redis caching');
      return null;
    }
  }

  /**
   * Generate cache key with prefix and pattern
   */
  generateKey(pattern, identifier, suffix = '') {
    const prefix = this.config.keyPrefix;
    const patternKey = this.keyPatterns[pattern] || 'general:';
    return `${prefix}${patternKey}${identifier}${suffix ? ':' + suffix : ''}`;
  }

  /**
   * Get value from cache
   */
  async get(key) {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      const value = await this.client.get(key);
      
      if (value !== null) {
        this.stats.hits++;
        return JSON.parse(value);
      } else {
        this.stats.misses++;
        return null;
      }
    } catch (error) {
      console.error('❌ Cache get error:', error);
      this.stats.errors++;
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set(key, value, ttl = null) {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      const cacheTTL = ttl || this.config.defaultTTL;
      
      await this.client.setEx(key, cacheTTL, serializedValue);
      return true;
    } catch (error) {
      console.error('❌ Cache set error:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Delete key from cache
   */
  async delete(key) {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const result = await this.client.del(key);
      return result > 0;
    } catch (error) {
      console.error('❌ Cache delete error:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async deletePattern(pattern) {
    if (!this.isConnected || !this.client) {
      return 0;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        const result = await this.client.del(keys);
        return result;
      }
      return 0;
    } catch (error) {
      console.error('❌ Cache delete pattern error:', error);
      this.stats.errors++;
      return 0;
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key) {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('❌ Cache exists error:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Set expiration for existing key
   */
  async expire(key, ttl) {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const result = await this.client.expire(key, ttl);
      return result === 1;
    } catch (error) {
      console.error('❌ Cache expire error:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget(keys) {
    if (!this.isConnected || !this.client || keys.length === 0) {
      return [];
    }

    try {
      const values = await this.client.mGet(keys);
      return values.map(value => value ? JSON.parse(value) : null);
    } catch (error) {
      console.error('❌ Cache mget error:', error);
      this.stats.errors++;
      return [];
    }
  }

  /**
   * Set multiple key-value pairs
   */
  async mset(keyValuePairs, ttl = null) {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const pipeline = this.client.multi();
      const cacheTTL = ttl || this.config.defaultTTL;
      
      for (const [key, value] of Object.entries(keyValuePairs)) {
        const serializedValue = JSON.stringify(value);
        pipeline.setEx(key, cacheTTL, serializedValue);
      }
      
      await pipeline.exec();
      return true;
    } catch (error) {
      console.error('❌ Cache mset error:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Increment counter
   */
  async increment(key, by = 1) {
    if (!this.isConnected || !this.client) {
      return 0;
    }

    try {
      const result = await this.client.incrBy(key, by);
      return result;
    } catch (error) {
      console.error('❌ Cache increment error:', error);
      this.stats.errors++;
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    const cacheStats = {
      ...this.stats,
      isConnected: this.isConnected,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      uptime: Date.now() - this.stats.lastReset
    };

    if (this.isConnected && this.client) {
      try {
        const info = await this.client.info('memory');
        const memoryInfo = info.split('\n').reduce((acc, line) => {
          const [key, value] = line.split(':');
          if (key && value) {
            acc[key.trim()] = value.trim();
          }
          return acc;
        }, {});
        
        cacheStats.memory = {
          used: memoryInfo.used_memory_human,
          peak: memoryInfo.used_memory_peak_human,
          rss: memoryInfo.used_memory_rss_human
        };
      } catch (error) {
        console.error('❌ Error getting Redis stats:', error);
      }
    }

    return cacheStats;
  }

  /**
   * Clear all cache entries
   */
  async flush() {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      await this.client.flushDb();
      console.log('✅ Cache flushed successfully');
      return true;
    } catch (error) {
      console.error('❌ Cache flush error:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      errors: 0,
      lastReset: Date.now()
    };
  }

  /**
   * Disconnect from Redis
   */
  async disconnect() {
    if (this.client) {
      try {
        await this.client.quit();
        console.log('✅ Redis disconnected successfully');
      } catch (error) {
        console.error('❌ Redis disconnect error:', error);
      }
    }
    this.isConnected = false;
  }

  /**
   * Health check
   */
  async healthCheck() {
    if (!this.isConnected || !this.client) {
      return {
        status: 'unhealthy',
        message: 'Redis not connected'
      };
    }

    try {
      const start = Date.now();
      await this.client.ping();
      const responseTime = Date.now() - start;
      
      return {
        status: 'healthy',
        responseTime: `${responseTime}ms`,
        isConnected: this.isConnected,
        stats: this.stats
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message,
        error: error.code
      };
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

module.exports = cacheService;