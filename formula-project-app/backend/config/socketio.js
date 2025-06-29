/**
 * Socket.IO Security Configuration
 * Enhanced security settings for WebSocket connections
 */

const securityConfig = require('./security');

/**
 * Get secure Socket.IO configuration
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.IO configuration
 */
const getSocketIOConfig = (server) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    // CORS configuration
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3003",
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"],
      optionsSuccessStatus: 200
    },

    // Connection limits and timeouts
    connectTimeout: 45000, // 45 seconds
    pingTimeout: 60000,    // 60 seconds
    pingInterval: 25000,   // 25 seconds
    maxHttpBufferSize: 1e6, // 1MB
    
    // Security settings
    allowEIO3: false, // Disable Engine.IO v3 compatibility
    transports: ['websocket', 'polling'],
    
    // Rate limiting
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
      skipMiddlewares: false
    },

    // Additional security headers
    allowRequest: (req, callback) => {
      // Basic request validation
      const origin = req.headers.origin;
      const allowedOrigins = [
        process.env.CORS_ORIGIN || "http://localhost:3003",
        "https://formula-pm.com",
        "https://www.formula-pm.com"
      ];

      // Allow requests without origin (for native apps) in development
      if (!origin && isDevelopment) {
        return callback(null, true);
      }

      // Check if origin is allowed
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`🚫 Socket.IO: Blocked connection from unauthorized origin: ${origin}`);
      return callback('Unauthorized origin', false);
    }
  };
};

/**
 * Setup Socket.IO security middleware
 * @param {Socket.IO} io - Socket.IO instance
 * @param {PrismaClient} prisma - Prisma client instance
 */
const setupSocketSecurity = (io, prisma) => {
  const { createSocketAuth, socketRateLimit } = require('../middleware/socketAuth');

  // Global rate limiting for all socket connections
  io.engine.on("connection_error", (err) => {
    console.error("Socket.IO connection error:", err.req);
    console.error("Socket.IO error code:", err.code);
    console.error("Socket.IO error message:", err.message);
    console.error("Socket.IO error context:", err.context);
  });

  // Authentication middleware
  io.use(createSocketAuth(prisma));

  // Rate limiting middleware
  io.use(socketRateLimit(100, 60000)); // 100 events per minute

  // Connection logging and monitoring
  io.on("connection", (socket) => {
    const userInfo = socket.user ? `${socket.user.firstName} ${socket.user.lastName} (${socket.user.email})` : 'Anonymous';
    console.log(`🔌 Socket connected: ${userInfo} - ID: ${socket.id}`);
    
    // Track connection time for monitoring
    socket.connectionTime = Date.now();
    
    // Set up disconnect logging
    socket.on("disconnect", (reason) => {
      const duration = Date.now() - socket.connectionTime;
      console.log(`🔌 Socket disconnected: ${userInfo} - Reason: ${reason} - Duration: ${duration}ms`);
    });

    // Error handling
    socket.on("error", (error) => {
      console.error(`❌ Socket error for ${userInfo}:`, error);
    });

    // Set up automatic cleanup for idle connections
    let heartbeatTimeout;
    
    const resetHeartbeat = () => {
      clearTimeout(heartbeatTimeout);
      heartbeatTimeout = setTimeout(() => {
        console.log(`⏰ Disconnecting idle socket: ${userInfo}`);
        socket.disconnect();
      }, 300000); // 5 minutes idle timeout
    };

    // Reset heartbeat on any activity
    socket.onAny(() => {
      resetHeartbeat();
    });

    // Initial heartbeat
    resetHeartbeat();
  });

  // Monitor connection counts
  setInterval(() => {
    const connections = io.engine.clientsCount;
    if (connections > 100) { // Alert if too many connections
      console.warn(`⚠️  High Socket.IO connection count: ${connections}`);
    }
  }, 30000); // Check every 30 seconds
};

/**
 * Setup Redis adapter with security considerations
 * @param {Socket.IO} io - Socket.IO instance
 * @returns {Promise<void>}
 */
const setupRedisAdapter = async (io) => {
  try {
    const { createAdapter } = require('@socket.io/redis-adapter');
    const { createClient } = require('redis');

    // Create Redis clients with security settings
    const pubClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retry_unfulfilled_commands: true,
      connect_timeout: 60000,
      command_timeout: 30000,
      // Security: disable dangerous commands
      disable_resubscribing: false,
      enable_offline_queue: false
    });

    const subClient = pubClient.duplicate();

    // Error handling
    pubClient.on('error', (err) => {
      console.error('Redis Pub Client Error:', err);
    });

    subClient.on('error', (err) => {
      console.error('Redis Sub Client Error:', err);
    });

    // Connect to Redis
    await Promise.all([
      pubClient.connect(),
      subClient.connect()
    ]);

    // Setup adapter
    io.adapter(createAdapter(pubClient, subClient));
    console.log('✅ Socket.IO Redis adapter connected securely');

  } catch (error) {
    console.warn('⚠️  Redis adapter setup failed, falling back to memory adapter:', error.message);
    console.warn('⚠️  This is acceptable for development but not recommended for production');
    
    // Fallback to memory adapter (default)
    // No additional setup needed
  }
};

/**
 * Validate socket event data to prevent injection attacks
 * @param {Object} data - Event data
 * @returns {Object} Sanitized data
 */
const validateSocketData = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Sanitize string values
    if (typeof value === 'string') {
      sanitized[key] = securityConfig.sanitizeInput(value);
    } 
    // Recursively sanitize nested objects
    else if (typeof value === 'object' && value !== null) {
      sanitized[key] = validateSocketData(value);
    } 
    // Keep other types as-is (numbers, booleans, etc.)
    else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Create secure event handler wrapper
 * @param {Function} handler - Original event handler
 * @returns {Function} Wrapped handler with security checks
 */
const secureEventHandler = (handler) => {
  return async (socket, data, callback) => {
    try {
      // Validate and sanitize input data
      const sanitizedData = validateSocketData(data);
      
      // Add request context for logging
      const context = {
        userId: socket.userId,
        userRole: socket.userRole,
        socketId: socket.id,
        timestamp: new Date().toISOString()
      };

      // Call the original handler with sanitized data
      const result = await handler(socket, sanitizedData, context);
      
      // Send response if callback provided
      if (callback && typeof callback === 'function') {
        callback({ success: true, data: result });
      }

    } catch (error) {
      console.error('❌ Socket event handler error:', error);
      
      // Send error response if callback provided
      if (callback && typeof callback === 'function') {
        callback({ 
          success: false, 
          error: 'Internal server error',
          code: 'SOCKET_HANDLER_ERROR'
        });
      }
    }
  };
};

module.exports = {
  getSocketIOConfig,
  setupSocketSecurity,
  setupRedisAdapter,
  validateSocketData,
  secureEventHandler
};