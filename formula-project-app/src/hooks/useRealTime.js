import { useEffect, useRef, useState, useCallback } from 'react';
import logger from '../utils/logger';

// Socket instance - singleton pattern (simplified for now)
let socketInstance = null;

// Create socket connection (simplified for now)
const createSocket = () => {
  // For now, return a mock socket for development
  if (!socketInstance) {
    socketInstance = {
      connected: false,
      connect: () => { logger.debug('Mock socket connect'); },
      disconnect: () => { logger.debug('Mock socket disconnect'); },
      on: () => {},
      off: () => {},
      emit: () => {}
    };
  }
  
  return socketInstance;
};

// Main real-time hook (simplified)
export const useRealTime = (options = {}) => {
  const {
    autoConnect = true,
    userInfo = { userId: 1008, userName: 'Anonymous User', email: 'user@example.com' }
  } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!autoConnect) return;
    
    socketRef.current = createSocket();
    setIsConnected(false); // Mock as disconnected for now
    
    return () => {
      // Cleanup socket connection
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [autoConnect, userInfo.userId, userInfo.userName, userInfo.email]);
  
  const connect = useCallback(() => {
    logger.debug('Mock connect');
  }, []);
  
  const disconnect = useCallback(() => {
    logger.debug('Mock disconnect');
  }, []);
  
  const joinRoom = useCallback((roomType, roomId) => {
    logger.debug('Mock join room:', roomType, roomId);
  }, []);
  
  const leaveRoom = useCallback((roomType, roomId) => {
    logger.debug('Mock leave room:', roomType, roomId);
  }, []);
  
  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    socket: socketRef.current
  };
};

// Hook for activity feed (simplified and working)
export const useActivityFeed = (options = {}) => {
  const { 
    autoRefresh = true, 
    refreshInterval = 5000,
    limit = 20 
  } = options;
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const refreshFeed = useCallback(() => {
    setLoading(true);
    setError(null);
    
    // Simulate loading delay
    setTimeout(() => {
      // Return realistic activities based on actual project data
      const realisticActivities = [
        {
          id: 1,
          type: 'project',
          action: 'updated',
          entityType: 'project',
          description: 'Project "Akbank Head Office Renovation" status updated to Completed',
          user: { name: 'Kubilay Ilgın', id: 'user_1' },
          userName: 'Kubilay Ilgın',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          isNew: true
        },
        {
          id: 2,
          type: 'task',
          action: 'completed',
          entityType: 'task',
          description: 'Task "Executive Kitchen Cabinet Design Review" completed',
          user: { name: 'Hande Selen Karaman', id: 'user_2' },
          userName: 'Hande Selen Karaman',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          isNew: false
        },
        {
          id: 3,
          type: 'shop_drawing',
          action: 'approved',
          entityType: 'shop_drawing',
          description: 'Shop drawing "Executive_Kitchen_Cabinets_Rev_C.pdf" approved',
          user: { name: 'Kubilay Ilgın', id: 'user_1' },
          userName: 'Kubilay Ilgın',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          isNew: false
        },
        {
          id: 4,
          type: 'task',
          action: 'created',
          entityType: 'task',
          description: 'New task "Material Procurement - Kitchen Cabinets" created',
          user: { name: 'Serra Uluveren', id: 'user_3' },
          userName: 'Serra Uluveren',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          isNew: false
        },
        {
          id: 5,
          type: 'user',
          action: 'user_added',
          entityType: 'user',
          description: 'New team member "David Wilson" added to the team',
          user: { name: 'Admin User', id: 'admin' },
          userName: 'Admin User',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          isNew: false
        },
        {
          id: 6,
          type: 'report',
          action: 'created',
          entityType: 'report',
          description: 'Report "Weekly Progress Report - Week 12" created',
          user: { name: 'Hande Selen Karaman', id: 'user_2' },
          userName: 'Hande Selen Karaman',
          timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
          isNew: false
        },
        {
          id: 7,
          type: 'scope',
          action: 'updated',
          entityType: 'scope',
          description: 'Scope item "Executive Kitchen Upper Cabinets" progress updated to 75%',
          user: { name: 'Hande Selen Karaman', id: 'user_2' },
          userName: 'Hande Selen Karaman',
          timestamp: new Date(Date.now() - 1000 * 60 * 105).toISOString(),
          isNew: false
        },
        {
          id: 8,
          type: 'system',
          action: 'backup_completed',
          entityType: 'system',
          description: 'System backup completed successfully',
          user: { name: 'System', id: 'system' },
          userName: 'System',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          isNew: false
        }
      ];
      
      setActivities(realisticActivities.slice(0, limit));
      setLoading(false);
    }, 500);
  }, [limit]);
  
  useEffect(() => {
    refreshFeed();
  }, [refreshFeed]);
  
  return {
    activities,
    loading,
    error,
    refreshFeed
  };
};

// Hook for project-specific activity feed (simplified)
export const useProjectActivityFeed = (projectId, limit = 20) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    const generateProjectActivities = () => {
      if (!isMounted) return;
      
      const projectSpecificActivities = [
        {
          id: `${projectId}_1`,
          type: 'task',
          action: 'completed',
          description: 'Task completed in this project',
          userName: 'Project Team Member',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          metadata: { projectId: parseInt(projectId), targetTab: 'overview' }
        },
        {
          id: `${projectId}_2`,
          type: 'shop_drawing',
          action: 'approved',
          description: 'Shop drawing approved',
          userName: 'Project Manager',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          metadata: { projectId: parseInt(projectId), targetTab: 'drawings' }
        }
      ];
      
      if (isMounted) {
        setActivities(projectSpecificActivities.slice(0, limit));
        setIsLoading(false);
      }
    };

    const timer = setTimeout(generateProjectActivities, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [projectId, limit]);
  
  return {
    activities,
    isLoading
  };
};

// Hook for user presence (simplified)
export const usePresence = () => {
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  
  const sendTyping = useCallback((roomType, roomId, isTyping) => {
    logger.debug('Mock typing:', roomType, roomId, isTyping);
  }, []);
  
  return {
    users,
    typingUsers,
    onlineUsers: users.filter(u => u.status === 'online'),
    sendTyping
  };
};

// Hook for real-time project updates (simplified)
export const useProjectUpdates = (projectId) => {
  const [projectActivity, setProjectActivity] = useState([]);
  
  return {
    projectActivity
  };
};

// Hook for real-time task status changes (simplified)
export const useTaskStatusUpdates = () => {
  const [statusChanges, setStatusChanges] = useState([]);
  
  return {
    statusChanges
  };
};

// Hook for collaborative comments (simplified)
export const useCollaborativeComments = (entityType, entityId) => {
  const [comments, setComments] = useState([]);
  
  const addComment = useCallback((message) => {
    logger.debug('Mock add comment:', message);
  }, []);
  
  return {
    comments,
    addComment
  };
};

// Utility hook for heartbeat (simplified)
export const useHeartbeat = (interval = 30000) => {
  // Mock heartbeat
};

export default {
  useRealTime,
  useActivityFeed,
  usePresence,
  useProjectUpdates,
  useTaskStatusUpdates,
  useCollaborativeComments,
  useHeartbeat,
  useProjectActivityFeed
};