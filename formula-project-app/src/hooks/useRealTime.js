import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { queryKeys, invalidateQueries } from '../services/queryClient';

// Socket instance - singleton pattern
let socketInstance = null;

// Create socket connection
const createSocket = () => {
  if (!socketInstance) {
    const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:5014';
    
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

// Enhanced mock activity data for development with project-specific activities
const mockActivities = [
  // Global activities
  {
    id: 1,
    type: 'project',
    action: 'created',
    description: 'New project "Downtown Office Complex" has been created',
    userName: 'John Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    metadata: { projectId: 1, projectName: 'Downtown Office Complex', targetTab: 'overview' }
  },
  {
    id: 2,
    type: 'task',
    action: 'completed',
    description: 'Task "Foundation inspection" completed in project "Downtown Office Complex"',
    userName: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    metadata: { projectId: 1, taskId: 1, taskName: 'Foundation inspection', targetTab: 'overview' }
  },
  {
    id: 3,
    type: 'project',
    action: 'updated',
    description: 'Project "Residential Tower" status updated to In Progress',
    userName: 'Mike Davis',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    metadata: { projectId: 2, projectName: 'Residential Tower', targetTab: 'overview' }
  },
  {
    id: 4,
    type: 'task',
    action: 'created',
    description: 'New task "Electrical wiring installation" assigned to Alex Chen in project "Residential Tower"',
    userName: 'Emily Brown',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    metadata: { projectId: 2, taskId: 2, taskName: 'Electrical wiring installation', assignee: 'Alex Chen', targetTab: 'overview' }
  },
  {
    id: 5,
    type: 'team_member',
    action: 'created',
    description: 'New team member "David Wilson" has been added to the team',
    userName: 'Admin User',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    metadata: { memberId: 5, memberName: 'David Wilson' }
  },
  {
    id: 6,
    type: 'task',
    action: 'started',
    description: 'Task "Concrete pouring" started in project "Downtown Office Complex"',
    userName: 'Robert Garcia',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    metadata: { projectId: 1, taskId: 3, taskName: 'Concrete pouring', targetTab: 'overview' }
  },

  // Project-specific activities for project 1 (Downtown Office Complex)
  {
    id: 101,
    type: 'scope',
    action: 'updated',
    description: 'Scope item "Kitchen Upper Cabinets" progress updated to 75% in project "Downtown Office Complex"',
    userName: 'John Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    metadata: { projectId: 1, scopeItemId: 'SCOPE001', scopeItemName: 'Kitchen Upper Cabinets', targetTab: 'scope' }
  },
  {
    id: 102,
    type: 'shop_drawing',
    action: 'approved',
    description: 'Shop drawing "Kitchen_Upper_Cabinets_Rev_C.pdf" approved in project "Downtown Office Complex"',
    userName: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
    metadata: { projectId: 1, drawingId: 'SD001', drawingName: 'Kitchen_Upper_Cabinets_Rev_C.pdf', targetTab: 'drawings' }
  },
  {
    id: 103,
    type: 'material_spec',
    action: 'approved',
    description: 'Material specification "Maple Wood Grade A" approved in project "Downtown Office Complex"',
    userName: 'Mike Wilson',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 minutes ago
    metadata: { projectId: 1, specId: 'SPEC001', specName: 'Maple Wood Grade A', targetTab: 'specifications' }
  },
  {
    id: 104,
    type: 'timeline',
    action: 'updated',
    description: 'Project timeline updated - new milestone added in project "Downtown Office Complex"',
    userName: 'Emily Brown',
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(), // 50 minutes ago
    metadata: { projectId: 1, milestoneId: 'M001', milestoneName: 'Kitchen Installation Complete', targetTab: 'timeline' }
  },
  {
    id: 105,
    type: 'compliance',
    action: 'updated',
    description: 'Building permit documentation uploaded for project "Downtown Office Complex"',
    userName: 'Lisa Chen',
    timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString(), // 70 minutes ago
    metadata: { projectId: 1, documentId: 'DOC001', documentName: 'Building Permit BP-2024-001', targetTab: 'compliance' }
  },

  // Project-specific activities for project 2 (Residential Tower)
  {
    id: 201,
    type: 'scope',
    action: 'created',
    description: 'New scope item "Lobby Reception Desk" added to project "Residential Tower"',
    userName: 'Alex Chen',
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(), // 40 minutes ago
    metadata: { projectId: 2, scopeItemId: 'SCOPE201', scopeItemName: 'Lobby Reception Desk', targetTab: 'scope' }
  },
  {
    id: 202,
    type: 'shop_drawing',
    action: 'pending',
    description: 'Shop drawing "Lobby_Reception_Rev_A.pdf" pending review in project "Residential Tower"',
    userName: 'David Rodriguez',
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(), // 55 minutes ago
    metadata: { projectId: 2, drawingId: 'SD201', drawingName: 'Lobby_Reception_Rev_A.pdf', targetTab: 'drawings' }
  },
  {
    id: 203,
    type: 'task',
    action: 'reassigned',
    description: 'Task "Structural engineering review" reassigned to Robert Garcia in project "Residential Tower"',
    userName: 'Project Manager',
    timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(), // 80 minutes ago
    metadata: { projectId: 2, taskId: 201, taskName: 'Structural engineering review', assignee: 'Robert Garcia', targetTab: 'overview' }
  }
];

// Hook for activity feed
export const useActivityFeed = (limit = 20) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Import activity service dynamically to avoid circular imports
    let activityService;
    
    const loadActivityService = async () => {
      try {
        const module = await import('../services/activityService');
        activityService = module.default;
        return activityService;
      } catch (error) {
        console.error('Error loading activity service:', error);
        return null;
      }
    };
    
    // Generate realistic activities based on actual demo data and logged activities
    const generateRealisticActivities = async () => {
      try {
        const service = await loadActivityService();
        // This would normally fetch from API, but for demo we'll generate realistic activities
        // Using ACTUAL project data from Formula International's demo database
        const realisticActivities = [
          // Akbank Head Office Renovation (Project ID: 2001) activities
          {
            id: 1,
            type: 'project',
            action: 'updated',
            description: 'Project "Akbank Head Office Renovation" status updated to Completed',
            userName: 'Kubilay Ilgın',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            metadata: { projectId: 2001, projectName: 'Akbank Head Office Renovation', targetTab: 'overview' }
          },
          {
            id: 2,
            type: 'task',
            action: 'completed',
            description: 'Task "Executive Kitchen Cabinet Design Review" completed in project "Akbank Head Office Renovation"',
            userName: 'Hande Selen Karaman',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            metadata: { projectId: 2001, taskId: 3001, taskName: 'Executive Kitchen Cabinet Design Review', targetTab: 'overview' }
          },
          {
            id: 3,
            type: 'scope',
            action: 'updated',
            description: 'Scope item "Executive Kitchen Upper Cabinets - Maple Hardwood with LED Lighting" progress updated to 75% in project "Akbank Head Office Renovation"',
            userName: 'Hande Selen Karaman',
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            metadata: { projectId: 2001, scopeItemId: 'SCOPE001', scopeItemName: 'Executive Kitchen Upper Cabinets - Maple Hardwood with LED Lighting', targetTab: 'scope' }
          },
          {
            id: 4,
            type: 'shop_drawing',
            action: 'approved',
            description: 'Shop drawing "Executive_Kitchen_Cabinets_Rev_C.pdf" approved in project "Akbank Head Office Renovation"',
            userName: 'Kubilay Ilgın',
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            metadata: { projectId: 2001, drawingId: 'SD001', drawingName: 'Executive_Kitchen_Cabinets_Rev_C.pdf', targetTab: 'drawings' }
          },
          {
            id: 5,
            type: 'task',
            action: 'completed',
            description: 'Task "Material Procurement - Kitchen Cabinets" completed in project "Akbank Head Office Renovation"',
            userName: 'Serra Uluveren',
            timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
            metadata: { projectId: 2001, taskId: 3002, taskName: 'Material Procurement - Kitchen Cabinets', targetTab: 'overview' }
          },
          {
            id: 6,
            type: 'scope',
            action: 'updated',
            description: 'Scope item "Custom Executive Reception Desk with Technology Integration" progress updated to 90% in project "Akbank Head Office Renovation"',
            userName: 'Hande Selen Karaman',
            timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
            metadata: { projectId: 2001, scopeItemId: 'SCOPE003', scopeItemName: 'Custom Executive Reception Desk with Technology Integration', targetTab: 'scope' }
          },
          {
            id: 7,
            type: 'shop_drawing',
            action: 'approved',
            description: 'Shop drawing "Executive_Reception_Desk_Rev_B.pdf" approved in project "Akbank Head Office Renovation"',
            userName: 'Ömer Onan',
            timestamp: new Date(Date.now() - 1000 * 60 * 105).toISOString(),
            metadata: { projectId: 2001, drawingId: 'SD002', drawingName: 'Executive_Reception_Desk_Rev_B.pdf', targetTab: 'drawings' }
          },
          
          // Garanti BBVA Tech Center MEP (Project ID: 2002) activities
          {
            id: 8,
            type: 'task',
            action: 'completed',
            description: 'Task "HVAC System Design - Data Center" completed in project "Garanti BBVA Tech Center MEP"',
            userName: 'Emre Koc',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            metadata: { projectId: 2002, taskId: 3003, taskName: 'HVAC System Design - Data Center', targetTab: 'overview' }
          },
          {
            id: 9,
            type: 'shop_drawing',
            action: 'approved',
            description: 'Shop drawing "Data_Center_HVAC_System_Rev_A.pdf" approved in project "Garanti BBVA Tech Center MEP"',
            userName: 'Mehmet Demir',
            timestamp: new Date(Date.now() - 1000 * 60 * 135).toISOString(),
            metadata: { projectId: 2002, drawingId: 'SD003', drawingName: 'Data_Center_HVAC_System_Rev_A.pdf', targetTab: 'drawings' }
          },
          // Report activities examples
          {
            id: 10,
            type: 'report',
            action: 'created',
            description: 'Report "Weekly Progress Report - Week 12" created in project "Akbank Head Office Renovation"',
            userName: 'Hande Selen Karaman',
            timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
            metadata: { projectId: 2001, reportId: 'RPT-001', reportTitle: 'Weekly Progress Report - Week 12', targetTab: 'reports' }
          },
          {
            id: 11,
            type: 'report',
            action: 'exported',
            description: 'Report "Quality Inspection Report - Kitchen Cabinets" exported as PDF from project "Akbank Head Office Renovation"',
            userName: 'Kubilay Ilgın',
            timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
            metadata: { projectId: 2001, reportId: 'RPT-002', reportTitle: 'Quality Inspection Report - Kitchen Cabinets', exportFormat: 'PDF', targetTab: 'reports' }
          },
          {
            id: 12,
            type: 'report',
            action: 'published',
            description: 'Report "Issue Report - Electrical Systems" published with team visibility in project "Garanti BBVA Tech Center MEP"',
            userName: 'Emre Koc',
            timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
            metadata: { projectId: 2002, reportId: 'RPT-003', reportTitle: 'Issue Report - Electrical Systems', visibility: 'team', targetTab: 'reports' }
          },
          {
            id: 13,
            type: 'scope',
            action: 'updated',
            description: 'Scope item "Data Center Precision Air Conditioning - 20 Ton Unit" progress updated to 25% in project "Garanti BBVA Tech Center MEP"',
            userName: 'Emre Koc',
            timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
            metadata: { projectId: 2002, scopeItemId: 'SCOPE009', scopeItemName: 'Data Center Precision Air Conditioning - 20 Ton Unit', targetTab: 'scope' }
          },
          {
            id: 11,
            type: 'task',
            action: 'in_progress',
            description: 'Task "Electrical Infrastructure Installation" is in progress in project "Garanti BBVA Tech Center MEP"',
            userName: 'Fatma Arslan',
            timestamp: new Date(Date.now() - 1000 * 60 * 165).toISOString(),
            metadata: { projectId: 2002, taskId: 3004, taskName: 'Electrical Infrastructure Installation', targetTab: 'overview' }
          },
          {
            id: 12,
            type: 'shop_drawing',
            action: 'revision_required',
            description: 'Shop drawing "Main_Electrical_Distribution_Rev_A.pdf" requires revision - load calculations need verification in project "Garanti BBVA Tech Center MEP"',
            userName: 'Fatma Arslan',
            timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
            metadata: { projectId: 2002, drawingId: 'SD004', drawingName: 'Main_Electrical_Distribution_Rev_A.pdf', targetTab: 'drawings' }
          },
          
          // Zorlu Center Luxury Retail Fit-out (Project ID: 2004) activities
          {
            id: 13,
            type: 'task',
            action: 'completed',
            description: 'Task "Luxury Display Case Design Review" completed in project "Zorlu Center Luxury Retail Fit-out"',
            userName: 'İpek Gönenç',
            timestamp: new Date(Date.now() - 1000 * 60 * 195).toISOString(),
            metadata: { projectId: 2004, taskId: 3024, taskName: 'Luxury Display Case Design Review', targetTab: 'overview' }
          },
          {
            id: 14,
            type: 'shop_drawing',
            action: 'approved',
            description: 'Shop drawing "Luxury_Display_Cases_Rev_A.pdf" approved in project "Zorlu Center Luxury Retail Fit-out"',
            userName: 'İpek Gönenç',
            timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
            metadata: { projectId: 2004, drawingId: 'SD007', drawingName: 'Luxury_Display_Cases_Rev_A.pdf', targetTab: 'drawings' }
          },
          {
            id: 15,
            type: 'task',
            action: 'active',
            description: 'Task "Retail Floor Layout Planning" is active in project "Zorlu Center Luxury Retail Fit-out"',
            userName: 'Hakan Ayseli',
            timestamp: new Date(Date.now() - 1000 * 60 * 225).toISOString(),
            metadata: { projectId: 2004, taskId: 3025, taskName: 'Retail Floor Layout Planning', targetTab: 'overview' }
          },
          
          // Formula HQ Showroom & Office Renovation (Project ID: 2007) activities
          {
            id: 16,
            type: 'task',
            action: 'completed',
            description: 'Task "Formula Branded Reception Wall Design" completed in project "Formula HQ Showroom & Office Renovation"',
            userName: 'Yusuf Sağlam',
            timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
            metadata: { projectId: 2007, taskId: 3033, taskName: 'Formula Branded Reception Wall Design', targetTab: 'overview' }
          },
          {
            id: 17,
            type: 'shop_drawing',
            action: 'approved',
            description: 'Shop drawing "Formula_Branded_Reception_Wall_Rev_B.pdf" approved in project "Formula HQ Showroom & Office Renovation"',
            userName: 'Yusuf Sağlam',
            timestamp: new Date(Date.now() - 1000 * 60 * 255).toISOString(),
            metadata: { projectId: 2007, drawingId: 'SD010', drawingName: 'Formula_Branded_Reception_Wall_Rev_B.pdf', targetTab: 'drawings' }
          },
          {
            id: 18,
            type: 'task',
            action: 'active',
            description: 'Task "Showroom Display System Setup" is active in project "Formula HQ Showroom & Office Renovation"',
            userName: 'Hakan Ayseli',
            timestamp: new Date(Date.now() - 1000 * 60 * 270).toISOString(),
            metadata: { projectId: 2007, taskId: 3034, taskName: 'Showroom Display System Setup', targetTab: 'overview' }
          },
          
          // Tekfen Plaza Office Modernization (Project ID: 2005) activities
          {
            id: 19,
            type: 'task',
            action: 'completed',
            description: 'Task "Acoustic Ceiling System Design" completed in project "Tekfen Plaza Office Modernization"',
            userName: 'Hande Selen Karaman',
            timestamp: new Date(Date.now() - 1000 * 60 * 285).toISOString(),
            metadata: { projectId: 2005, taskId: 3027, taskName: 'Acoustic Ceiling System Design', targetTab: 'overview' }
          },
          {
            id: 20,
            type: 'shop_drawing',
            action: 'approved',
            description: 'Shop drawing "Acoustic_Ceiling_System_Rev_A.pdf" approved in project "Tekfen Plaza Office Modernization"',
            userName: 'Hande Selen Karaman',
            timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
            metadata: { projectId: 2005, drawingId: 'SD008', drawingName: 'Acoustic_Ceiling_System_Rev_A.pdf', targetTab: 'drawings' }
          }
        ];
        
        // Combine mock activities with real logged activities
        const loggedActivities = service ? service.getActivities(limit) : [];
        const allActivities = [...loggedActivities, ...realisticActivities];
        
        const finalActivities = allActivities
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, limit);
        
        setActivities(finalActivities);
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating activities:', error);
        // Fallback to original mock data
        setActivities(mockActivities.slice(0, limit));
        setIsLoading(false);
      }
    };

    const timer = setTimeout(generateRealisticActivities, 500);
    
    // Listen for new activities from the activity service
    const handleNewActivity = (event) => {
      const newActivity = event.detail;
      setActivities(prev => [newActivity, ...prev].slice(0, limit));
    };
    
    window.addEventListener('newActivity', handleNewActivity);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('newActivity', handleNewActivity);
    };
  }, [limit]);
  
  return {
    activities,
    isLoading
  };
};

// Hook for project-specific activity feed
export const useProjectActivityFeed = (projectId, limit = 20) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const generateProjectActivities = async () => {
      try {
        // Generate project-specific activities based on the projectId using ACTUAL Formula International demo data
        const projectSpecificActivities = [
          // Akbank Head Office Renovation activities (Project ID: 2001)
          ...(projectId === 2001 || projectId === '2001' ? [
            {
              id: `${projectId}_1`,
              type: 'scope',
              action: 'updated',
              description: 'Scope item "Executive Kitchen Upper Cabinets - Maple Hardwood with LED Lighting" progress updated to 75% in project "Akbank Head Office Renovation"',
              userName: 'Hande Selen Karaman',
              timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
              metadata: { projectId: 2001, scopeItemId: 'SCOPE001', scopeItemName: 'Executive Kitchen Upper Cabinets - Maple Hardwood with LED Lighting', targetTab: 'scope' }
            },
            {
              id: `${projectId}_2`,
              type: 'shop_drawing',
              action: 'approved',
              description: 'Shop drawing "Executive_Kitchen_Cabinets_Rev_C.pdf" approved in project "Akbank Head Office Renovation"',
              userName: 'Kubilay Ilgın',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              metadata: { projectId: 2001, drawingId: 'SD001', drawingName: 'Executive_Kitchen_Cabinets_Rev_C.pdf', targetTab: 'drawings' }
            },
            {
              id: `${projectId}_3`,
              type: 'task',
              action: 'completed',
              description: 'Task "Executive Kitchen Cabinet Design Review" completed in project "Akbank Head Office Renovation"',
              userName: 'Hande Selen Karaman',
              timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
              metadata: { projectId: 2001, taskId: 3001, taskName: 'Executive Kitchen Cabinet Design Review', targetTab: 'overview' }
            },
            {
              id: `${projectId}_4`,
              type: 'scope',
              action: 'updated',
              description: 'Scope item "Custom Executive Reception Desk with Technology Integration" progress updated to 90% in project "Akbank Head Office Renovation"',
              userName: 'Hande Selen Karaman',
              timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
              metadata: { projectId: 2001, scopeItemId: 'SCOPE003', scopeItemName: 'Custom Executive Reception Desk with Technology Integration', targetTab: 'scope' }
            },
            {
              id: `${projectId}_5`,
              type: 'task',
              action: 'in_progress',
              description: 'Task "Reception Desk Fabrication Coordination" is in progress in project "Akbank Head Office Renovation"',
              userName: 'Hande Selen Karaman',
              timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
              metadata: { projectId: 2001, taskId: 3005, taskName: 'Reception Desk Fabrication Coordination', targetTab: 'overview' }
            },
            {
              id: `${projectId}_6`,
              type: 'scope',
              action: 'completed',
              description: 'Scope item "Interior Wall Demolition - Executive Areas" marked as completed (100%) in project "Akbank Head Office Renovation"',
              userName: 'Ebru Alkın',
              timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
              metadata: { projectId: 2001, scopeItemId: 'SCOPE004', scopeItemName: 'Interior Wall Demolition - Executive Areas', targetTab: 'scope' }
            }
          ] : []),
          
          // Garanti BBVA Tech Center MEP activities (Project ID: 2002)
          ...(projectId === 2002 || projectId === '2002' ? [
            {
              id: `${projectId}_1`,
              type: 'task',
              action: 'completed',
              description: 'Task "HVAC System Design - Data Center" completed in project "Garanti BBVA Tech Center MEP"',
              userName: 'Emre Koc',
              timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
              metadata: { projectId: 2002, taskId: 3003, taskName: 'HVAC System Design - Data Center', targetTab: 'overview' }
            },
            {
              id: `${projectId}_2`,
              type: 'shop_drawing',
              action: 'approved',
              description: 'Shop drawing "Data_Center_HVAC_System_Rev_A.pdf" approved in project "Garanti BBVA Tech Center MEP"',
              userName: 'Mehmet Demir',
              timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
              metadata: { projectId: 2002, drawingId: 'SD003', drawingName: 'Data_Center_HVAC_System_Rev_A.pdf', targetTab: 'drawings' }
            },
            {
              id: `${projectId}_3`,
              type: 'scope',
              action: 'updated',
              description: 'Scope item "Data Center Precision Air Conditioning - 20 Ton Unit" progress updated to 25% in project "Garanti BBVA Tech Center MEP"',
              userName: 'Emre Koc',
              timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
              metadata: { projectId: 2002, scopeItemId: 'SCOPE009', scopeItemName: 'Data Center Precision Air Conditioning - 20 Ton Unit', targetTab: 'scope' }
            },
            {
              id: `${projectId}_4`,
              type: 'shop_drawing',
              action: 'revision_required',
              description: 'Shop drawing "Main_Electrical_Distribution_Rev_A.pdf" requires revision - load calculations need verification in project "Garanti BBVA Tech Center MEP"',
              userName: 'Fatma Arslan',
              timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
              metadata: { projectId: 2002, drawingId: 'SD004', drawingName: 'Main_Electrical_Distribution_Rev_A.pdf', targetTab: 'drawings' }
            },
            {
              id: `${projectId}_5`,
              type: 'scope',
              action: 'updated',
              description: 'Scope item "HVAC Ductwork Distribution System - Galvanized Steel" progress updated to 25% in project "Garanti BBVA Tech Center MEP"',
              userName: 'Emre Koc',
              timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
              metadata: { projectId: 2002, scopeItemId: 'SCOPE010', scopeItemName: 'HVAC Ductwork Distribution System - Galvanized Steel', targetTab: 'scope' }
            }
          ] : []),
          
          // Zorlu Center Luxury Retail Fit-out activities (Project ID: 2004)
          ...(projectId === 2004 || projectId === '2004' ? [
            {
              id: `${projectId}_1`,
              type: 'task',
              action: 'completed',
              description: 'Task "Luxury Display Case Design Review" completed in project "Zorlu Center Luxury Retail Fit-out"',
              userName: 'İpek Gönenç',
              timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
              metadata: { projectId: 2004, taskId: 3024, taskName: 'Luxury Display Case Design Review', targetTab: 'overview' }
            },
            {
              id: `${projectId}_2`,
              type: 'shop_drawing',
              action: 'approved',
              description: 'Shop drawing "Luxury_Display_Cases_Rev_A.pdf" approved in project "Zorlu Center Luxury Retail Fit-out"',
              userName: 'İpek Gönenç',
              timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
              metadata: { projectId: 2004, drawingId: 'SD007', drawingName: 'Luxury_Display_Cases_Rev_A.pdf', targetTab: 'drawings' }
            },
            {
              id: `${projectId}_3`,
              type: 'task',
              action: 'active',
              description: 'Task "Retail Floor Layout Planning" is active with 75% progress in project "Zorlu Center Luxury Retail Fit-out"',
              userName: 'Hakan Ayseli',
              timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
              metadata: { projectId: 2004, taskId: 3025, taskName: 'Retail Floor Layout Planning', targetTab: 'overview' }
            },
            {
              id: `${projectId}_4`,
              type: 'shop_drawing',
              action: 'pending',
              description: 'Shop drawing "Retail_Floor_Layout_Rev_A.pdf" pending review in project "Zorlu Center Luxury Retail Fit-out"',
              userName: 'Serra Uluveren',
              timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
              metadata: { projectId: 2004, drawingId: 'SD011', drawingName: 'Retail_Floor_Layout_Rev_A.pdf', targetTab: 'drawings' }
            }
          ] : []),
          
          // Formula HQ Showroom & Office Renovation activities (Project ID: 2007)
          ...(projectId === 2007 || projectId === '2007' ? [
            {
              id: `${projectId}_1`,
              type: 'task',
              action: 'completed',
              description: 'Task "Formula Branded Reception Wall Design" completed in project "Formula HQ Showroom & Office Renovation"',
              userName: 'Yusuf Sağlam',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              metadata: { projectId: 2007, taskId: 3033, taskName: 'Formula Branded Reception Wall Design', targetTab: 'overview' }
            },
            {
              id: `${projectId}_2`,
              type: 'shop_drawing',
              action: 'approved',
              description: 'Shop drawing "Formula_Branded_Reception_Wall_Rev_B.pdf" approved in project "Formula HQ Showroom & Office Renovation"',
              userName: 'Yusuf Sağlam',
              timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
              metadata: { projectId: 2007, drawingId: 'SD010', drawingName: 'Formula_Branded_Reception_Wall_Rev_B.pdf', targetTab: 'drawings' }
            },
            {
              id: `${projectId}_3`,
              type: 'task',
              action: 'active',
              description: 'Task "Showroom Display System Setup" is active with 30% progress in project "Formula HQ Showroom & Office Renovation"',
              userName: 'Hakan Ayseli',
              timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
              metadata: { projectId: 2007, taskId: 3034, taskName: 'Showroom Display System Setup', targetTab: 'overview' }
            },
            {
              id: `${projectId}_4`,
              type: 'task',
              action: 'pending',
              description: 'Task "Office Furniture Coordination" is pending start in project "Formula HQ Showroom & Office Renovation"',
              userName: 'Serra Uluveren',
              timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
              metadata: { projectId: 2007, taskId: 3035, taskName: 'Office Furniture Coordination', targetTab: 'overview' }
            }
          ] : []),
          
          // Generic activities for any project
          {
            id: `${projectId}_generic_1`,
            type: 'project',
            action: 'updated',
            description: `Project status updated to Active`,
            userName: 'Project Manager',
            timestamp: new Date(Date.now() - 1000 * 60 * 100).toISOString(),
            metadata: { projectId: parseInt(projectId), targetTab: 'overview' }
          },
          {
            id: `${projectId}_generic_2`,
            type: 'compliance',
            action: 'updated',
            description: `Building permit documentation uploaded`,
            userName: 'Quality Assurance',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            metadata: { projectId: parseInt(projectId), documentId: 'DOC_GEN', documentName: 'Building Permit Documentation', targetTab: 'compliance' }
          }
        ];
        
        setActivities(projectSpecificActivities.slice(0, limit));
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating project activities:', error);
        setActivities([]);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(generateProjectActivities, 500);
    return () => clearTimeout(timer);
  }, [projectId, limit]);
  
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