/**
 * Socket.IO Client Service
 * Handles real-time communication with the backend
 */

import { io } from 'socket.io-client';
import authService from '../auth/authService';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.authenticated = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
    this.currentUser = null;
    this.currentProjectId = null;
  }

  /**
   * Initialize Socket.IO connection
   */
  async initialize() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = authService.getToken();
    if (!token) {
      console.warn('No auth token found, cannot initialize socket');
      return null;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5015';
    
    this.socket = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxHttpBufferSize: 1e6
    });

    this.setupEventHandlers();
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Socket connection timeout'));
      }, 10000);

      this.socket.once('connect', () => {
        clearTimeout(timeout);
        console.log('Socket.IO connected successfully');
        this.connected = true;
        resolve(this.socket);
      });

      this.socket.once('connect_error', (error) => {
        clearTimeout(timeout);
        console.error('Socket.IO connection error:', error);
        reject(error);
      });
    });
  }

  /**
   * Setup socket event handlers
   */
  setupEventHandlers() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emit('socket:connected', { socketId: this.socket.id });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.connected = false;
      this.authenticated = false;
      this.emit('socket:disconnected', { reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.emit('socket:reconnect_failed', { error });
      }
    });

    // Authentication events
    this.socket.on('authenticated', (data) => {
      console.log('Socket authenticated:', data);
      this.authenticated = true;
      this.currentUser = data.user;
      this.emit('socket:authenticated', data);
    });

    this.socket.on('authentication_error', (error) => {
      console.error('Socket authentication error:', error);
      this.authenticated = false;
      this.emit('socket:auth_error', error);
    });

    // Real-time data events
    this.socket.on('project:updated', (data) => {
      console.log('Project updated:', data);
      this.emit('project:updated', data);
    });

    this.socket.on('task:created', (data) => {
      console.log('Task created:', data);
      this.emit('task:created', data);
    });

    this.socket.on('task:updated', (data) => {
      console.log('Task updated:', data);
      this.emit('task:updated', data);
    });

    this.socket.on('scope:updated', (data) => {
      console.log('Scope updated:', data);
      this.emit('scope:updated', data);
    });

    this.socket.on('user:presence', (data) => {
      console.log('User presence update:', data);
      this.emit('user:presence', data);
    });

    this.socket.on('notification:new', (data) => {
      console.log('New notification:', data);
      this.emit('notification:new', data);
    });

    this.socket.on('mention:created', (data) => {
      console.log('New mention:', data);
      this.emit('mention:created', data);
    });

    // Collaboration events
    this.socket.on('collaboration:user_joined', (data) => {
      console.log('User joined collaboration:', data);
      this.emit('collaboration:user_joined', data);
    });

    this.socket.on('collaboration:user_left', (data) => {
      console.log('User left collaboration:', data);
      this.emit('collaboration:user_left', data);
    });

    this.socket.on('collaboration:cursor_moved', (data) => {
      this.emit('collaboration:cursor_moved', data);
    });

    this.socket.on('collaboration:selection_changed', (data) => {
      this.emit('collaboration:selection_changed', data);
    });
  }

  /**
   * Join a project room for real-time updates
   */
  async joinProject(projectId) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected, cannot join project');
      return false;
    }

    return new Promise((resolve) => {
      this.socket.emit('project:join', { projectId }, (response) => {
        if (response.success) {
          console.log(`Joined project room: ${projectId}`);
          this.currentProjectId = projectId;
          this.emit('project:joined', { projectId });
          resolve(true);
        } else {
          console.error('Failed to join project room:', response.error);
          resolve(false);
        }
      });
    });
  }

  /**
   * Leave a project room
   */
  async leaveProject(projectId) {
    if (!this.socket?.connected) {
      return false;
    }

    return new Promise((resolve) => {
      this.socket.emit('project:leave', { projectId }, (response) => {
        if (response.success) {
          console.log(`Left project room: ${projectId}`);
          if (this.currentProjectId === projectId) {
            this.currentProjectId = null;
          }
          this.emit('project:left', { projectId });
          resolve(true);
        } else {
          console.error('Failed to leave project room:', response.error);
          resolve(false);
        }
      });
    });
  }

  /**
   * Send a real-time update
   */
  sendUpdate(event, data) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected, cannot send update');
      return false;
    }

    this.socket.emit(event, data);
    return true;
  }

  /**
   * Send user presence update
   */
  updatePresence(presence) {
    if (!this.socket?.connected) {
      return false;
    }

    this.socket.emit('user:presence_update', {
      ...presence,
      timestamp: new Date().toISOString()
    });
    return true;
  }

  /**
   * Send typing indicator
   */
  sendTyping(location, isTyping = true) {
    if (!this.socket?.connected) {
      return false;
    }

    this.socket.emit('collaboration:typing', {
      location,
      isTyping,
      timestamp: new Date().toISOString()
    });
    return true;
  }

  /**
   * Send cursor position for collaboration
   */
  sendCursorPosition(position) {
    if (!this.socket?.connected) {
      return false;
    }

    this.socket.emit('collaboration:cursor_move', {
      position,
      timestamp: new Date().toISOString()
    });
    return true;
  }

  /**
   * Subscribe to real-time events
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Unsubscribe from real-time events
   */
  off(event, callback) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Emit event to all listeners
   */
  emit(event, data) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in socket event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      console.log('Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.authenticated = false;
      this.currentProjectId = null;
      this.listeners.clear();
    }
  }

  /**
   * Reconnect socket with new authentication
   */
  async reconnectWithAuth() {
    this.disconnect();
    return this.initialize();
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.connected,
      authenticated: this.authenticated,
      socketId: this.socket?.id,
      currentProjectId: this.currentProjectId,
      currentUser: this.currentUser
    };
  }

  /**
   * Check if socket is ready for use
   */
  isReady() {
    return this.socket?.connected && this.authenticated;
  }
}

// Export singleton instance
export default new SocketService();