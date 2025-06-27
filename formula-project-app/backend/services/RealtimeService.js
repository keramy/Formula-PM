/**
 * Formula PM Realtime Service
 * Manages Socket.IO connections, rooms, and real-time collaboration features
 */

const { Server } = require('socket.io');

// Optional Redis adapter for production clustering
let createAdapter;
try {
  const redisAdapter = require('@socket.io/redis-adapter');
  createAdapter = redisAdapter.createAdapter;
} catch (error) {
  console.log('⚠️  Redis adapter not available - using memory adapter for Socket.IO');
  createAdapter = null;
}
const { 
  socketAuth, 
  socketAuthorize, 
  socketRateLimit,
  validateProjectAccess,
  validateTaskAccess 
} = require('../middleware/socketAuth');
const cacheService = require('./cacheService');
const auditService = require('./auditService');

class RealtimeService {
  constructor() {
    this.io = null;
    this.server = null;
    this.connectedUsers = new Map(); // userId -> socket data
    this.userSockets = new Map(); // userId -> Set of socket IDs
    this.projectRooms = new Map(); // projectId -> Set of userIds
    this.activeCollaborations = new Map(); // resourceId -> collaboration data
    
    // Performance tracking
    this.stats = {
      connections: 0,
      totalConnections: 0,
      messagesPerMinute: 0,
      averageLatency: 0,
      roomCount: 0,
      activeCollaborations: 0
    };
    
    this.messageCount = 0;
    this.latencySum = 0;
    this.latencyCount = 0;
  }

  /**
   * Initialize Socket.IO server
   */
  async initialize(httpServer) {
    try {
      console.log('🚀 Initializing Realtime Service...');
      
      this.server = httpServer;
      
      // Create Socket.IO server with configuration
      this.io = new Server(httpServer, {
        cors: {
          origin: process.env.CORS_ORIGIN || 'http://localhost:3003',
          methods: ['GET', 'POST'],
          credentials: true
        },
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000,
        upgradeTimeout: 30000,
        allowEIO3: true
      });

      // Setup Redis adapter for scaling (if Redis is available)
      if (cacheService.isConnected && createAdapter) {
        try {
          const redisClient = cacheService.client;
          const adapter = createAdapter(redisClient, redisClient.duplicate());
          this.io.adapter(adapter);
          console.log('✅ Socket.IO Redis adapter configured');
        } catch (error) {
          console.warn('⚠️ Redis adapter setup failed, using memory adapter:', error.message);
        }
      } else {
        console.log('ℹ️  Using Socket.IO memory adapter (single instance mode)');
      }

      // Apply authentication middleware
      this.io.use(socketAuth);
      
      // Apply rate limiting
      this.io.use(socketRateLimit(50, 60000)); // 50 events per minute

      // Setup event handlers
      this.setupEventHandlers();

      // Start performance monitoring
      this.startPerformanceMonitoring();

      console.log('✅ Realtime Service initialized successfully');
      
      await auditService.logSystemEvent({
        event: 'realtime_service_initialized',
        description: 'Socket.IO realtime service started',
        metadata: {
          corsOrigin: process.env.CORS_ORIGIN,
          redisEnabled: cacheService.isConnected
        }
      });

    } catch (error) {
      console.error('❌ Realtime Service initialization failed:', error);
      throw error;
    }
  }

  /**
   * Setup main Socket.IO event handlers
   */
  setupEventHandlers() {
    this.io.on('connection', async (socket) => {
      try {
        this.stats.connections++;
        this.stats.totalConnections++;
        
        const user = socket.user;
        console.log(`👤 User connected: ${user.firstName} ${user.lastName} (${socket.id})`);

        // Track user connection
        this.addUserConnection(socket);

        // Join user to their personal room
        socket.join(`user:${user.id}`);

        // Auto-join user to their project rooms
        await this.joinUserProjectRooms(socket);

        // Update user presence
        await this.updateUserPresence(user.id, 'online', socket.id);

        // Broadcast user online status
        this.broadcastUserPresence(user.id, 'online');

        // Setup socket event handlers
        this.setupSocketEvents(socket);

        // Send initial data
        await this.sendInitialData(socket);

      } catch (error) {
        console.error('❌ Connection setup error:', error);
        socket.disconnect(true);
      }
    });
  }

  /**
   * Setup individual socket event handlers
   */
  setupSocketEvents(socket) {
    const user = socket.user;

    // Handle disconnection
    socket.on('disconnect', async (reason) => {
      try {
        console.log(`👋 User disconnected: ${user.firstName} ${user.lastName} (${reason})`);
        
        this.stats.connections--;
        this.removeUserConnection(socket);
        
        // Check if user has other active connections
        const userSockets = this.userSockets.get(user.id);
        if (!userSockets || userSockets.size === 0) {
          await this.updateUserPresence(user.id, 'offline');
          this.broadcastUserPresence(user.id, 'offline');
        }

      } catch (error) {
        console.error('❌ Disconnect handler error:', error);
      }
    });

    // Project room management
    socket.on('join_project', async (data) => {
      try {
        const { projectId } = data;
        
        if (!projectId) {
          return socket.emit('error', { message: 'Project ID required' });
        }

        const hasAccess = await validateProjectAccess(socket, projectId);
        if (!hasAccess) {
          return socket.emit('error', { message: 'Access denied to project' });
        }

        await this.joinProjectRoom(socket, projectId);
        socket.emit('joined_project', { projectId });

      } catch (error) {
        console.error('❌ Join project error:', error);
        socket.emit('error', { message: 'Failed to join project' });
      }
    });

    socket.on('leave_project', async (data) => {
      try {
        const { projectId } = data;
        await this.leaveProjectRoom(socket, projectId);
        socket.emit('left_project', { projectId });
      } catch (error) {
        console.error('❌ Leave project error:', error);
      }
    });

    // Real-time collaboration events
    socket.on('start_collaboration', async (data) => {
      try {
        const { resourceType, resourceId, projectId } = data;
        
        const hasAccess = await this.validateResourceAccess(socket, resourceType, resourceId);
        if (!hasAccess) {
          return socket.emit('error', { message: 'Access denied to resource' });
        }

        await this.startCollaboration(socket, resourceType, resourceId, projectId);
      } catch (error) {
        console.error('❌ Start collaboration error:', error);
      }
    });

    socket.on('end_collaboration', async (data) => {
      try {
        const { resourceType, resourceId } = data;
        await this.endCollaboration(socket, resourceType, resourceId);
      } catch (error) {
        console.error('❌ End collaboration error:', error);
      }
    });

    // Live cursor tracking
    socket.on('cursor_move', (data) => {
      try {
        const { resourceId, position } = data;
        this.broadcastCursorMovement(socket, resourceId, position);
      } catch (error) {
        console.error('❌ Cursor move error:', error);
      }
    });

    // Typing indicators
    socket.on('typing_start', (data) => {
      try {
        const { resourceId, field } = data;
        this.broadcastTypingIndicator(socket, resourceId, field, 'start');
      } catch (error) {
        console.error('❌ Typing start error:', error);
      }
    });

    socket.on('typing_end', (data) => {
      try {
        const { resourceId, field } = data;
        this.broadcastTypingIndicator(socket, resourceId, field, 'end');
      } catch (error) {
        console.error('❌ Typing end error:', error);
      }
    });

    // Activity feed events
    socket.on('activity_created', async (data) => {
      try {
        await this.broadcastActivity(data);
      } catch (error) {
        console.error('❌ Activity broadcast error:', error);
      }
    });

    // Performance ping
    socket.on('ping', (timestamp) => {
      const latency = Date.now() - timestamp;
      this.updateLatencyStats(latency);
      socket.emit('pong', timestamp);
    });
  }

  /**
   * Add user connection tracking
   */
  addUserConnection(socket) {
    const userId = socket.userId;
    
    // Track connected user
    this.connectedUsers.set(socket.id, {
      userId,
      user: socket.user,
      connectedAt: new Date(),
      lastActivity: new Date()
    });

    // Track user sockets
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(socket.id);
  }

  /**
   * Remove user connection tracking
   */
  removeUserConnection(socket) {
    const userId = socket.userId;
    
    // Remove from connected users
    this.connectedUsers.delete(socket.id);

    // Remove from user sockets
    if (this.userSockets.has(userId)) {
      this.userSockets.get(userId).delete(socket.id);
      
      // Clean up empty sets
      if (this.userSockets.get(userId).size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  /**
   * Join user to their project rooms automatically
   */
  async joinUserProjectRooms(socket) {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      // Get user's projects
      const userProjects = await prisma.projectMember.findMany({
        where: { userId: socket.userId },
        select: { projectId: true }
      });

      // Also get projects where user is the manager
      const managedProjects = await prisma.project.findMany({
        where: { projectManagerId: socket.userId },
        select: { id: true }
      });

      // Combine and deduplicate project IDs
      const projectIds = new Set([
        ...userProjects.map(p => p.projectId),
        ...managedProjects.map(p => p.id)
      ]);

      // Join all project rooms
      for (const projectId of projectIds) {
        await this.joinProjectRoom(socket, projectId, false); // silent join
      }

      await prisma.$disconnect();
    } catch (error) {
      console.error('❌ Auto-join project rooms error:', error);
    }
  }

  /**
   * Join a project room
   */
  async joinProjectRoom(socket, projectId, notify = true) {
    try {
      const roomName = `project:${projectId}`;
      socket.join(roomName);

      // Track project room membership
      if (!this.projectRooms.has(projectId)) {
        this.projectRooms.set(projectId, new Set());
      }
      this.projectRooms.get(projectId).add(socket.userId);

      if (notify) {
        // Notify other users in the project
        socket.to(roomName).emit('user_joined_project', {
          projectId,
          user: {
            id: socket.user.id,
            firstName: socket.user.firstName,
            lastName: socket.user.lastName,
            avatar: socket.user.avatar
          },
          joinedAt: new Date()
        });
      }

      console.log(`📂 User ${socket.user.firstName} joined project room: ${projectId}`);
    } catch (error) {
      console.error('❌ Join project room error:', error);
      throw error;
    }
  }

  /**
   * Leave a project room
   */
  async leaveProjectRoom(socket, projectId) {
    try {
      const roomName = `project:${projectId}`;
      socket.leave(roomName);

      // Remove from project room tracking
      if (this.projectRooms.has(projectId)) {
        this.projectRooms.get(projectId).delete(socket.userId);
        
        // Clean up empty project rooms
        if (this.projectRooms.get(projectId).size === 0) {
          this.projectRooms.delete(projectId);
        }
      }

      // Notify other users
      socket.to(roomName).emit('user_left_project', {
        projectId,
        userId: socket.userId,
        leftAt: new Date()
      });

      console.log(`📂 User ${socket.user.firstName} left project room: ${projectId}`);
    } catch (error) {
      console.error('❌ Leave project room error:', error);
    }
  }

  /**
   * Update user presence status
   */
  async updateUserPresence(userId, status, socketId = null) {
    try {
      const presenceData = {
        userId,
        status,
        lastSeen: new Date(),
        socketId
      };

      // Cache presence data
      const cacheKey = cacheService.generateKey('presence', userId);
      await cacheService.set(cacheKey, presenceData, 300); // 5 minutes TTL

      return presenceData;
    } catch (error) {
      console.error('❌ Update presence error:', error);
    }
  }

  /**
   * Broadcast user presence changes
   */
  broadcastUserPresence(userId, status) {
    try {
      this.io.emit('user_presence_changed', {
        userId,
        status,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ Broadcast presence error:', error);
    }
  }

  /**
   * Send initial data to newly connected socket
   */
  async sendInitialData(socket) {
    try {
      // Send online users list
      const onlineUsers = await this.getOnlineUsers();
      socket.emit('online_users', onlineUsers);

      // Send active project collaborations
      const activeCollabs = Array.from(this.activeCollaborations.entries()).map(([resourceId, data]) => ({
        resourceId,
        ...data
      }));
      socket.emit('active_collaborations', activeCollabs);

    } catch (error) {
      console.error('❌ Send initial data error:', error);
    }
  }

  /**
   * Get list of online users
   */
  async getOnlineUsers() {
    try {
      const onlineUsers = [];
      
      for (const [socketId, connectionData] of this.connectedUsers) {
        onlineUsers.push({
          id: connectionData.user.id,
          firstName: connectionData.user.firstName,
          lastName: connectionData.user.lastName,
          avatar: connectionData.user.avatar,
          department: connectionData.user.department,
          lastActivity: connectionData.lastActivity
        });
      }

      // Remove duplicates (users with multiple connections)
      const uniqueUsers = onlineUsers.reduce((acc, user) => {
        if (!acc.find(u => u.id === user.id)) {
          acc.push(user);
        }
        return acc;
      }, []);

      return uniqueUsers;
    } catch (error) {
      console.error('❌ Get online users error:', error);
      return [];
    }
  }

  /**
   * Validate resource access for collaboration
   */
  async validateResourceAccess(socket, resourceType, resourceId) {
    try {
      switch (resourceType) {
        case 'project':
          return await validateProjectAccess(socket, resourceId);
        case 'task':
          return await validateTaskAccess(socket, resourceId);
        case 'drawing':
        case 'material':
          // These are project-scoped, need to validate through project
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          
          const resource = await prisma[resourceType].findUnique({
            where: { id: resourceId },
            select: { projectId: true }
          });
          
          await prisma.$disconnect();
          
          if (!resource) return false;
          return await validateProjectAccess(socket, resource.projectId);
        default:
          return false;
      }
    } catch (error) {
      console.error('❌ Resource access validation error:', error);
      return false;
    }
  }

  /**
   * Start collaboration session
   */
  async startCollaboration(socket, resourceType, resourceId, projectId) {
    try {
      const collaborationId = `${resourceType}:${resourceId}`;
      
      if (!this.activeCollaborations.has(collaborationId)) {
        this.activeCollaborations.set(collaborationId, {
          resourceType,
          resourceId,
          projectId,
          participants: new Set(),
          startedAt: new Date(),
          activity: []
        });
      }

      const collaboration = this.activeCollaborations.get(collaborationId);
      collaboration.participants.add({
        userId: socket.userId,
        user: socket.user,
        joinedAt: new Date(),
        socketId: socket.id
      });

      // Join collaboration room
      const roomName = `collaboration:${collaborationId}`;
      socket.join(roomName);

      // Broadcast collaboration start
      this.io.to(`project:${projectId}`).emit('collaboration_started', {
        collaborationId,
        resourceType,
        resourceId,
        user: socket.user,
        participants: Array.from(collaboration.participants)
      });

      this.stats.activeCollaborations++;
      
      console.log(`🤝 Collaboration started: ${collaborationId} by ${socket.user.firstName}`);
    } catch (error) {
      console.error('❌ Start collaboration error:', error);
    }
  }

  /**
   * End collaboration session
   */
  async endCollaboration(socket, resourceType, resourceId) {
    try {
      const collaborationId = `${resourceType}:${resourceId}`;
      const collaboration = this.activeCollaborations.get(collaborationId);
      
      if (!collaboration) return;

      // Remove participant
      collaboration.participants = new Set(
        Array.from(collaboration.participants).filter(p => p.userId !== socket.userId)
      );

      // Leave collaboration room
      const roomName = `collaboration:${collaborationId}`;
      socket.leave(roomName);

      // If no participants left, remove collaboration
      if (collaboration.participants.size === 0) {
        this.activeCollaborations.delete(collaborationId);
        this.stats.activeCollaborations--;
        
        // Broadcast collaboration ended
        this.io.to(`project:${collaboration.projectId}`).emit('collaboration_ended', {
          collaborationId,
          resourceType,
          resourceId,
          endedAt: new Date()
        });
      } else {
        // Broadcast participant left
        this.io.to(roomName).emit('collaboration_participant_left', {
          collaborationId,
          userId: socket.userId,
          leftAt: new Date()
        });
      }

      console.log(`🤝 Collaboration ended: ${collaborationId} by ${socket.user.firstName}`);
    } catch (error) {
      console.error('❌ End collaboration error:', error);
    }
  }

  /**
   * Broadcast cursor movement
   */
  broadcastCursorMovement(socket, resourceId, position) {
    try {
      const roomName = `collaboration:${resourceId}`;
      socket.to(roomName).emit('cursor_moved', {
        userId: socket.userId,
        user: {
          firstName: socket.user.firstName,
          lastName: socket.user.lastName,
          avatar: socket.user.avatar
        },
        position,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ Broadcast cursor error:', error);
    }
  }

  /**
   * Broadcast typing indicators
   */
  broadcastTypingIndicator(socket, resourceId, field, action) {
    try {
      const roomName = `collaboration:${resourceId}`;
      socket.to(roomName).emit('typing_indicator', {
        userId: socket.userId,
        user: {
          firstName: socket.user.firstName,
          lastName: socket.user.lastName
        },
        field,
        action, // 'start' or 'end'
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ Broadcast typing error:', error);
    }
  }

  /**
   * Broadcast activity feed updates
   */
  async broadcastActivity(activityData) {
    try {
      const { projectId, type, data } = activityData;
      
      if (!projectId) return;

      const roomName = `project:${projectId}`;
      this.io.to(roomName).emit('activity_update', {
        type,
        data,
        timestamp: new Date()
      });

      // Also emit to general activity feed
      this.io.emit('global_activity_update', {
        projectId,
        type,
        data,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('❌ Broadcast activity error:', error);
    }
  }

  /**
   * Performance monitoring
   */
  startPerformanceMonitoring() {
    // Update stats every minute
    setInterval(() => {
      this.stats.messagesPerMinute = this.messageCount;
      this.stats.averageLatency = this.latencyCount > 0 ? this.latencySum / this.latencyCount : 0;
      this.stats.roomCount = this.io.sockets.adapter.rooms.size;
      
      // Reset counters
      this.messageCount = 0;
      this.latencySum = 0;
      this.latencyCount = 0;
    }, 60000);
  }

  /**
   * Update latency statistics
   */
  updateLatencyStats(latency) {
    this.latencySum += latency;
    this.latencyCount++;
  }

  /**
   * Get service status and metrics
   */
  getServiceStatus() {
    return {
      status: 'operational',
      ...this.stats,
      connectedUsers: this.connectedUsers.size,
      uniqueUsers: this.userSockets.size,
      projectRooms: this.projectRooms.size,
      timestamp: new Date()
    };
  }

  /**
   * Broadcast system notifications
   */
  broadcastSystemNotification(notification) {
    try {
      this.io.emit('system_notification', {
        ...notification,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ Broadcast system notification error:', error);
    }
  }

  /**
   * Send notification to specific user
   */
  sendUserNotification(userId, notification) {
    try {
      this.io.to(`user:${userId}`).emit('user_notification', {
        ...notification,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ Send user notification error:', error);
    }
  }

  /**
   * Send notification to project members
   */
  sendProjectNotification(projectId, notification) {
    try {
      this.io.to(`project:${projectId}`).emit('project_notification', {
        ...notification,
        projectId,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ Send project notification error:', error);
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    try {
      console.log('🔄 Shutting down Realtime Service...');
      
      // Notify all connected users
      this.io.emit('server_shutdown', {
        message: 'Server is shutting down for maintenance',
        timestamp: new Date()
      });

      // Wait a moment for messages to be sent
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close all connections
      this.io.close();
      
      // Clear tracking data
      this.connectedUsers.clear();
      this.userSockets.clear();
      this.projectRooms.clear();
      this.activeCollaborations.clear();

      console.log('✅ Realtime Service shutdown complete');
      
      await auditService.logSystemEvent({
        event: 'realtime_service_shutdown',
        description: 'Socket.IO realtime service stopped gracefully',
        metadata: { finalStats: this.stats }
      });

    } catch (error) {
      console.error('❌ Realtime Service shutdown error:', error);
    }
  }
}

// Create singleton instance
const realtimeService = new RealtimeService();

module.exports = realtimeService;