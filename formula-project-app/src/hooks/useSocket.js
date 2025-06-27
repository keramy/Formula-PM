/**
 * React Hook for Socket.IO Integration
 * Provides real-time functionality to React components
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import socketService from '../services/realtime/socketService';
import { useAuth } from '../context/AuthContext';

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const initializedRef = useRef(false);

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user && !initializedRef.current) {
      initializedRef.current = true;
      
      const initializeSocket = async () => {
        try {
          await socketService.initialize();
          setError(null);
        } catch (err) {
          console.error('Failed to initialize socket:', err);
          setError(err.message);
        }
      };

      initializeSocket();
    }

    // Cleanup on unmount or auth change
    return () => {
      if (!isAuthenticated) {
        socketService.disconnect();
        initializedRef.current = false;
        setConnected(false);
        setAuthenticated(false);
      }
    };
  }, [isAuthenticated, user]);

  // Subscribe to socket status changes
  useEffect(() => {
    const handleConnected = () => {
      setConnected(true);
      setError(null);
    };

    const handleDisconnected = () => {
      setConnected(false);
    };

    const handleAuthenticated = () => {
      setAuthenticated(true);
      setError(null);
    };

    const handleAuthError = (error) => {
      setAuthenticated(false);
      setError(error.message);
    };

    const handleReconnectFailed = (data) => {
      setError('Failed to reconnect to server');
    };

    // Subscribe to socket events
    const unsubscribeConnected = socketService.on('socket:connected', handleConnected);
    const unsubscribeDisconnected = socketService.on('socket:disconnected', handleDisconnected);
    const unsubscribeAuthenticated = socketService.on('socket:authenticated', handleAuthenticated);
    const unsubscribeAuthError = socketService.on('socket:auth_error', handleAuthError);
    const unsubscribeReconnectFailed = socketService.on('socket:reconnect_failed', handleReconnectFailed);

    // Set initial state
    const status = socketService.getStatus();
    setConnected(status.connected);
    setAuthenticated(status.authenticated);

    return () => {
      unsubscribeConnected();
      unsubscribeDisconnected();
      unsubscribeAuthenticated();
      unsubscribeAuthError();
      unsubscribeReconnectFailed();
    };
  }, []);

  // Join project room
  const joinProject = useCallback(async (projectId) => {
    if (!socketService.isReady()) {
      console.warn('Socket not ready, cannot join project');
      return false;
    }
    return socketService.joinProject(projectId);
  }, []);

  // Leave project room
  const leaveProject = useCallback(async (projectId) => {
    if (!socketService.isReady()) {
      return false;
    }
    return socketService.leaveProject(projectId);
  }, []);

  // Send real-time update
  const sendUpdate = useCallback((event, data) => {
    return socketService.sendUpdate(event, data);
  }, []);

  // Update user presence
  const updatePresence = useCallback((presence) => {
    return socketService.updatePresence(presence);
  }, []);

  // Send typing indicator
  const sendTyping = useCallback((location, isTyping = true) => {
    return socketService.sendTyping(location, isTyping);
  }, []);

  // Get socket status
  const getStatus = useCallback(() => {
    return socketService.getStatus();
  }, []);

  return {
    connected,
    authenticated,
    error,
    isReady: connected && authenticated,
    joinProject,
    leaveProject,
    sendUpdate,
    updatePresence,
    sendTyping,
    getStatus,
    // Direct access to socket service for advanced usage
    socketService
  };
};

/**
 * Hook for subscribing to specific real-time events
 */
export const useSocketEvent = (event, callback, dependencies = []) => {
  const callbackRef = useRef(callback);
  
  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleEvent = (data) => {
      callbackRef.current(data);
    };

    const unsubscribe = socketService.on(event, handleEvent);
    
    return unsubscribe;
  }, [event, ...dependencies]);
};

/**
 * Hook for real-time project updates
 */
export const useProjectRealtime = (projectId) => {
  const { joinProject, leaveProject, isReady } = useSocket();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Join project room when ready
  useEffect(() => {
    if (isReady && projectId) {
      setLoading(true);
      joinProject(projectId).then((success) => {
        if (success) {
          setLoading(false);
        }
      });

      return () => {
        leaveProject(projectId);
      };
    }
  }, [isReady, projectId, joinProject, leaveProject]);

  // Subscribe to project updates
  useSocketEvent('project:updated', (data) => {
    if (data.projectId === projectId) {
      setProjectData(prev => ({ ...prev, ...data.updates }));
    }
  }, [projectId]);

  // Subscribe to task updates
  useSocketEvent('task:created', (data) => {
    if (data.projectId === projectId) {
      // Handle new task
      console.log('New task created:', data);
    }
  }, [projectId]);

  useSocketEvent('task:updated', (data) => {
    if (data.projectId === projectId) {
      // Handle task update
      console.log('Task updated:', data);
    }
  }, [projectId]);

  // Subscribe to scope updates
  useSocketEvent('scope:updated', (data) => {
    if (data.projectId === projectId) {
      // Handle scope update
      console.log('Scope updated:', data);
    }
  }, [projectId]);

  return {
    projectData,
    loading,
    isConnected: isReady
  };
};

/**
 * Hook for real-time notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Subscribe to new notifications
  useSocketEvent('notification:new', (data) => {
    setNotifications(prev => [data, ...prev]);
    setUnreadCount(count => count + 1);
  });

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(count => Math.max(0, count - 1));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll
  };
};

/**
 * Hook for real-time presence indicators
 */
export const usePresence = (location) => {
  const { updatePresence, isReady } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Update presence when location changes
  useEffect(() => {
    if (isReady && location) {
      updatePresence({
        location,
        status: 'active',
        lastSeen: new Date().toISOString()
      });
    }
  }, [isReady, location, updatePresence]);

  // Subscribe to presence updates
  useSocketEvent('user:presence', (data) => {
    setOnlineUsers(data.users || []);
  });

  // Update presence on activity
  const updateActivity = useCallback((activity) => {
    if (isReady) {
      updatePresence({
        location,
        status: 'active',
        activity,
        lastSeen: new Date().toISOString()
      });
    }
  }, [isReady, location, updatePresence]);

  return {
    onlineUsers,
    updateActivity
  };
};