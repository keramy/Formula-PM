import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { queryKeys, invalidateQueries } from '../services/queryClient';

// Socket instance - singleton pattern
let socketInstance = null;

// Create socket connection
const createSocket = () => {
  if (!socketInstance) {
    const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    
    socketInstance = io(serverUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      upgrade: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });
    
    // Global connection event handlers
    socketInstance.on('connect', () => {
      console.log('🔗 Connected to real-time server');
    });
    
    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from real-time server:', reason);
    });
    
    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });
  }
  
  return socketInstance;
};

// Main real-time hook
export const useRealTime = (options = {}) => {
  const {
    autoConnect = true,
    userInfo = { userId: 1008, userName: 'Anonymous User', email: 'user@example.com' }
  } = options;
  
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);
  
  useEffect(() => {
    if (!autoConnect) return;
    
    socketRef.current = createSocket();
    const socket = socketRef.current;
    
    // Connection handlers
    const handleConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
      
      // Authenticate user
      socket.emit('authenticate', userInfo);
    };
    
    const handleDisconnect = () => {
      setIsConnected(false);
    };
    
    const handleConnectError = (error) => {
      setConnectionError(error.message);
      setIsConnected(false);
    };
    
    // Data update handlers
    const handleDataUpdate = (update) => {
      const { type, action, data } = update;
      
      switch (type) {
        case 'projects':
          if (action === 'created') {
            queryClient.setQueryData(queryKeys.projects, (oldProjects) => {
              return oldProjects ? [...oldProjects, data] : [data];
            });
          } else if (action === 'updated') {
            queryClient.setQueryData(queryKeys.projects, (oldProjects) => {
              return oldProjects?.map(project => 
                project.id === data.id ? data : project
              );
            });
          } else if (action === 'deleted') {
            queryClient.setQueryData(queryKeys.projects, (oldProjects) => {
              return oldProjects?.filter(project => project.id !== data.id);
            });
          }
          break;
          
        case 'tasks':
          if (action === 'created') {
            queryClient.setQueryData(queryKeys.tasks, (oldTasks) => {
              return oldTasks ? [...oldTasks, data] : [data];
            });
          } else if (action === 'updated') {
            queryClient.setQueryData(queryKeys.tasks, (oldTasks) => {
              return oldTasks?.map(task => 
                task.id === data.id ? data : task
              );
            });
          } else if (action === 'deleted') {
            queryClient.setQueryData(queryKeys.tasks, (oldTasks) => {
              return oldTasks?.filter(task => task.id !== data.id);
            });
          }
          break;
          
        case 'teamMembers':
          if (action === 'created') {
            queryClient.setQueryData(queryKeys.teamMembers, (oldMembers) => {
              return oldMembers ? [...oldMembers, data] : [data];
            });
          } else if (action === 'updated') {
            queryClient.setQueryData(queryKeys.teamMembers, (oldMembers) => {
              return oldMembers?.map(member => 
                member.id === data.id ? data : member
              );
            });
          }
          break;
          
        case 'clients':
          if (action === 'created') {
            queryClient.setQueryData(queryKeys.clients, (oldClients) => {
              return oldClients ? [...oldClients, data] : [data];
            });
          } else if (action === 'updated') {
            queryClient.setQueryData(queryKeys.clients, (oldClients) => {
              return oldClients?.map(client => 
                client.id === data.id ? data : client
              );
            });
          }
          break;
      }
      
      // Invalidate related queries to refresh stats
      queryClient.invalidateQueries(queryKeys.stats);
    };
    
    // Register event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('dataUpdated', handleDataUpdate);
    
    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }
    
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('dataUpdated', handleDataUpdate);
    };
  }, [autoConnect, userInfo, queryClient]);
  
  // Manual connection methods
  const connect = useCallback(() => {
    if (socketRef.current && !socketRef.current.connected) {
      socketRef.current.connect();
    }
  }, []);
  
  const disconnect = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.disconnect();
    }
  }, []);
  
  // Room management
  const joinRoom = useCallback((roomType, roomId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('joinRoom', {
        roomType,
        roomId,
        userId: userInfo.userId
      });
    }
  }, [userInfo.userId]);
  
  const leaveRoom = useCallback((roomType, roomId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('leaveRoom', {
        roomType,
        roomId,
        userId: userInfo.userId
      });
    }
  }, [userInfo.userId]);
  
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

// Hook for activity feed
export const useActivityFeed = (limit = 20) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef(null);
  
  useEffect(() => {
    socketRef.current = createSocket();
    const socket = socketRef.current;
    
    const handleActivity = (activity) => {
      setActivities(prev => {
        const newActivities = [activity, ...prev];
        return newActivities.slice(0, limit);
      });
    };
    
    const handleActivityHistory = (history) => {
      setActivities(history);
      setIsLoading(false);
    };
    
    socket.on('activity', handleActivity);
    socket.on('activityHistory', handleActivityHistory);
    
    // Connect and request history if not connected
    if (!socket.connected) {
      socket.connect();
    }
    
    return () => {
      socket.off('activity', handleActivity);
      socket.off('activityHistory', handleActivityHistory);
    };
  }, [limit]);
  
  return {
    activities,
    isLoading
  };
};

// Hook for user presence
export const usePresence = () => {
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const socketRef = useRef(null);
  
  useEffect(() => {
    socketRef.current = createSocket();
    const socket = socketRef.current;
    
    const handlePresenceUpdate = (presenceList) => {
      setUsers(presenceList);
    };
    
    const handleUserJoined = (user) => {
      setUsers(prev => {
        const exists = prev.find(u => u.userId === user.userId);
        if (exists) {
          return prev.map(u => u.userId === user.userId ? { ...u, status: 'online' } : u);
        }
        return [...prev, { ...user, status: 'online' }];
      });
    };
    
    const handleUserLeft = (user) => {
      setUsers(prev => prev.map(u => 
        u.userId === user.userId ? { ...u, status: 'offline' } : u
      ));
    };
    
    const handleUserTyping = ({ userId, userName, isTyping }) => {
      setTypingUsers(prev => {
        if (isTyping) {
          const exists = prev.find(u => u.userId === userId);
          if (!exists) {
            return [...prev, { userId, userName }];
          }
          return prev;
        } else {
          return prev.filter(u => u.userId !== userId);
        }
      });
    };
    
    socket.on('presenceUpdate', handlePresenceUpdate);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('userTyping', handleUserTyping);
    
    if (!socket.connected) {
      socket.connect();
    }
    
    return () => {
      socket.off('presenceUpdate', handlePresenceUpdate);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('userTyping', handleUserTyping);
    };
  }, []);
  
  const sendTyping = useCallback((roomType, roomId, isTyping) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('typing', {
        roomType,
        roomId,
        isTyping
      });
    }
  }, []);
  
  return {
    users,
    typingUsers,
    onlineUsers: users.filter(u => u.status === 'online'),
    sendTyping
  };
};

// Hook for real-time project updates
export const useProjectUpdates = (projectId) => {
  const queryClient = useQueryClient();
  const [projectActivity, setProjectActivity] = useState([]);
  const socketRef = useRef(null);
  
  useEffect(() => {
    if (!projectId) return;
    
    socketRef.current = createSocket();
    const socket = socketRef.current;
    
    const handleProjectUpdate = (project) => {
      // Update project in cache
      queryClient.setQueryData(queryKeys.project(projectId), project);
      queryClient.setQueryData(queryKeys.projects, (oldProjects) => {
        return oldProjects?.map(p => p.id === project.id ? project : p);
      });
      
      // Add to activity
      setProjectActivity(prev => [{
        type: 'project_updated',
        data: project,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 19)]);
    };
    
    const handleProjectTaskUpdate = (task) => {
      // Update task in cache
      queryClient.setQueryData(queryKeys.tasksByProject(projectId), (oldTasks) => {
        return oldTasks?.map(t => t.id === task.id ? task : t);
      });
      
      // Add to activity
      setProjectActivity(prev => [{
        type: 'task_updated',
        data: task,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 19)]);
    };
    
    socket.on('projectUpdated', handleProjectUpdate);
    socket.on('projectTaskUpdated', handleProjectTaskUpdate);
    
    // Join project room
    if (socket.connected) {
      socket.emit('joinRoom', {
        roomType: 'project',
        roomId: projectId,
        userId: 1008 // This should come from auth context
      });
    }
    
    return () => {
      socket.off('projectUpdated', handleProjectUpdate);
      socket.off('projectTaskUpdated', handleProjectTaskUpdate);
      
      // Leave project room
      if (socket.connected) {
        socket.emit('leaveRoom', {
          roomType: 'project',
          roomId: projectId,
          userId: 1008
        });
      }
    };
  }, [projectId, queryClient]);
  
  return {
    projectActivity
  };
};

// Hook for real-time task status changes
export const useTaskStatusUpdates = () => {
  const [statusChanges, setStatusChanges] = useState([]);
  const socketRef = useRef(null);
  
  useEffect(() => {
    socketRef.current = createSocket();
    const socket = socketRef.current;
    
    const handleTaskStatusChange = (change) => {
      setStatusChanges(prev => [change, ...prev.slice(0, 9)]); // Keep last 10 changes
      
      // Show a notification (you could integrate with a toast library)
      console.log(`📋 Task "${change.taskName}" changed from ${change.oldStatus} to ${change.newStatus}`);
    };
    
    socket.on('taskStatusChanged', handleTaskStatusChange);
    
    if (!socket.connected) {
      socket.connect();
    }
    
    return () => {
      socket.off('taskStatusChanged', handleTaskStatusChange);
    };
  }, []);
  
  return {
    statusChanges
  };
};

// Hook for collaborative comments
export const useCollaborativeComments = (entityType, entityId) => {
  const [comments, setComments] = useState([]);
  const socketRef = useRef(null);
  
  useEffect(() => {
    if (!entityType || !entityId) return;
    
    socketRef.current = createSocket();
    const socket = socketRef.current;
    
    const handleCommentAdded = (comment) => {
      if (comment.entityType === entityType && comment.entityId === entityId) {
        setComments(prev => [comment, ...prev]);
      }
    };
    
    socket.on('commentAdded', handleCommentAdded);
    
    // Join room for this entity
    if (socket.connected) {
      socket.emit('joinRoom', {
        roomType: entityType,
        roomId: entityId,
        userId: 1008
      });
    }
    
    return () => {
      socket.off('commentAdded', handleCommentAdded);
      
      if (socket.connected) {
        socket.emit('leaveRoom', {
          roomType: entityType,
          roomId: entityId,
          userId: 1008
        });
      }
    };
  }, [entityType, entityId]);
  
  const addComment = useCallback((message) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('newComment', {
        entityType,
        entityId,
        message
      });
    }
  }, [entityType, entityId]);
  
  return {
    comments,
    addComment
  };
};

// Utility hook for heartbeat (keep connection alive)
export const useHeartbeat = (interval = 30000) => {
  const socketRef = useRef(null);
  
  useEffect(() => {
    socketRef.current = createSocket();
    const socket = socketRef.current;
    
    const heartbeatInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('heartbeat');
      }
    }, interval);
    
    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [interval]);
};

export default {
  useRealTime,
  useActivityFeed,
  usePresence,
  useProjectUpdates,
  useTaskStatusUpdates,
  useCollaborativeComments,
  useHeartbeat
};