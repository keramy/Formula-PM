// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const nodemailer = require('nodemailer');
const SimpleDB = require('./database');
const seedData = require('./seedData');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://keramy.github.io"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});
const PORT = process.env.PORT || 5001;

// Initialize Database
const db = new SimpleDB('./data');

// Store connected users and their presence
const connectedUsers = new Map();
const userPresence = new Map();

// Activity log for real-time updates
const activityLog = [];
const MAX_ACTIVITIES = 100; // Keep last 100 activities

// Utility function to broadcast activity
function broadcastActivity(activity) {
  // Add to activity log
  const activityEntry = {
    id: Date.now(),
    ...activity,
    timestamp: new Date().toISOString()
  };
  
  activityLog.unshift(activityEntry);
  if (activityLog.length > MAX_ACTIVITIES) {
    activityLog.pop();
  }
  
  // Broadcast to all connected clients
  io.emit('activity', activityEntry);
  
  // Log for debugging
  console.log('📡 Activity broadcast:', activityEntry);
}

// Socket.IO connection handling - Simplified to prevent hanging
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  // Handle user authentication/identification
  socket.on('authenticate', (userData) => {
    try {
      const user = {
        socketId: socket.id,
        userId: userData.userId || socket.id,
        userName: userData.userName || 'Anonymous',
        email: userData.email || '',
        joinedAt: new Date().toISOString()
      };
      
      connectedUsers.set(socket.id, user);
      userPresence.set(user.userId, {
        ...user,
        status: 'online',
        lastActivity: new Date().toISOString()
      });
      
      console.log(`✅ User authenticated: ${user.userName}`);
      
      // Send acknowledgment to the user
      socket.emit('authenticated', { success: true, user });
    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('authenticated', { success: false, error: error.message });
    }
  });
  
  // Handle joining specific rooms (projects, tasks, etc.)
  socket.on('joinRoom', (roomData) => {
    const { roomType, roomId, userId } = roomData;
    const roomName = `${roomType}-${roomId}`;
    
    socket.join(roomName);
    console.log(`📍 User ${userId} joined room: ${roomName}`);
    
    // Notify others in the room
    socket.to(roomName).emit('userJoinedRoom', {
      userId,
      userName: connectedUsers.get(socket.id)?.userName,
      roomType,
      roomId
    });
  });
  
  // Handle leaving rooms
  socket.on('leaveRoom', (roomData) => {
    const { roomType, roomId, userId } = roomData;
    const roomName = `${roomType}-${roomId}`;
    
    socket.leave(roomName);
    console.log(`📍 User ${userId} left room: ${roomName}`);
    
    // Notify others in the room
    socket.to(roomName).emit('userLeftRoom', {
      userId,
      userName: connectedUsers.get(socket.id)?.userName,
      roomType,
      roomId
    });
  });
  
  // Handle real-time data updates
  socket.on('dataUpdate', (updateData) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    
    const { type, action, data, roomId } = updateData;
    
    // Broadcast to specific room or all users
    const targetRoom = roomId ? `${type}-${roomId}` : null;
    const target = targetRoom ? socket.to(targetRoom) : socket.broadcast;
    
    target.emit('dataUpdated', {
      type,
      action,
      data,
      user: {
        id: user.userId,
        name: user.userName
      },
      timestamp: new Date().toISOString()
    });
    
    // Log activity
    broadcastActivity({
      type: 'data_update',
      action,
      entityType: type,
      entityId: data.id,
      userId: user.userId,
      userName: user.userName,
      description: `${user.userName} ${action} ${type} "${data.name || data.title}"`
    });
  });
  
  // Handle typing indicators
  socket.on('typing', (typingData) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    
    const { roomType, roomId, isTyping } = typingData;
    const roomName = `${roomType}-${roomId}`;
    
    socket.to(roomName).emit('userTyping', {
      userId: user.userId,
      userName: user.userName,
      isTyping
    });
  });
  
  // Handle cursor/presence updates
  socket.on('cursorUpdate', (cursorData) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    
    const { roomType, roomId, position, element } = cursorData;
    const roomName = `${roomType}-${roomId}`;
    
    socket.to(roomName).emit('cursorMoved', {
      userId: user.userId,
      userName: user.userName,
      position,
      element
    });
  });
  
  // Handle comments/messages
  socket.on('newComment', (commentData) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    
    const { entityType, entityId, message } = commentData;
    const comment = {
      id: Date.now(),
      entityType,
      entityId,
      message,
      userId: user.userId,
      userName: user.userName,
      createdAt: new Date().toISOString()
    };
    
    // Broadcast to relevant room
    const roomName = `${entityType}-${entityId}`;
    io.to(roomName).emit('commentAdded', comment);
    
    // Log activity
    broadcastActivity({
      type: 'comment',
      action: 'added',
      entityType,
      entityId,
      userId: user.userId,
      userName: user.userName,
      description: `${user.userName} commented on ${entityType}`,
      metadata: { message: message.substring(0, 50) + '...' }
    });
  });
  
  // Handle heartbeat/keep-alive
  socket.on('heartbeat', () => {
    const user = connectedUsers.get(socket.id);
    if (user && userPresence.has(user.userId)) {
      const presence = userPresence.get(user.userId);
      presence.lastActivity = new Date().toISOString();
      userPresence.set(user.userId, presence);
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    try {
      const user = connectedUsers.get(socket.id);
      
      if (user) {
        console.log(`👋 User disconnected: ${user.userName}`);
        
        // Update presence
        const presence = userPresence.get(user.userId);
        if (presence) {
          presence.status = 'offline';
          presence.lastActivity = new Date().toISOString();
          userPresence.set(user.userId, presence);
        }
        
        // Remove from connected users
        connectedUsers.delete(socket.id);
      } else {
        console.log('👋 Anonymous user disconnected:', socket.id);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
});

// API endpoint to get current activities
app.get('/api/activities', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const activities = activityLog.slice(0, limit);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// API endpoint to get user presence
app.get('/api/presence', (req, res) => {
  try {
    const presence = Array.from(userPresence.values());
    res.json(presence);
  } catch (error) {
    console.error('Error fetching presence:', error);
    res.status(500).json({ error: 'Failed to fetch presence' });
  }
});

// Initialize database with seed data
function initializeDatabase() {
  console.log('🗄️  Initializing database...');
  
  // Seed team members
  const existingMembers = db.read('teamMembers');
  if (existingMembers.length === 0) {
    db.write('teamMembers', seedData.teamMembers);
    console.log(`✅ Seeded ${seedData.teamMembers.length} team members`);
  } else {
    console.log(`📋 Found ${existingMembers.length} existing team members`);
  }
  
  // Seed projects
  const existingProjects = db.read('projects');
  if (existingProjects.length === 0) {
    db.write('projects', seedData.projects);
    console.log(`✅ Seeded ${seedData.projects.length} projects`);
  } else {
    console.log(`📋 Found ${existingProjects.length} existing projects`);
  }
  
  // Seed tasks
  const existingTasks = db.read('tasks');
  if (existingTasks.length === 0) {
    db.write('tasks', seedData.tasks);
    console.log(`✅ Seeded ${seedData.tasks.length} tasks`);
  } else {
    console.log(`📋 Found ${existingTasks.length} existing tasks`);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Formula Project Management API is running' });
});

// Send email notification
app.post('/api/send-notification', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    if (!to || !subject) {
      return res.status(400).json({ error: 'Missing required fields: to, subject' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@formulaproject.com',
      to,
      subject,
      html,
      text
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Team Members API endpoints
app.get('/api/team-members', (req, res) => {
  try {
    const teamMembers = db.read('teamMembers');
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

app.post('/api/team-members', (req, res) => {
  try {
    const newMember = db.insert('teamMembers', req.body);
    if (newMember) {
      res.status(201).json(newMember);
    } else {
      res.status(500).json({ error: 'Failed to create team member' });
    }
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

app.put('/api/team-members/:id', (req, res) => {
  try {
    const updatedMember = db.update('teamMembers', req.params.id, req.body);
    if (updatedMember) {
      res.json(updatedMember);
    } else {
      res.status(404).json({ error: 'Team member not found' });
    }
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

app.delete('/api/team-members/:id', (req, res) => {
  try {
    const deleted = db.delete('teamMembers', req.params.id);
    if (deleted) {
      res.json({ message: 'Team member deleted successfully' });
    } else {
      res.status(404).json({ error: 'Team member not found' });
    }
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

// Projects API endpoints
app.get('/api/projects', (req, res) => {
  try {
    const projects = db.read('projects');
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', (req, res) => {
  try {
    const newProject = db.insert('projects', req.body);
    if (newProject) {
      // Broadcast real-time update
      io.emit('dataUpdated', {
        type: 'projects',
        action: 'created',
        data: newProject,
        timestamp: new Date().toISOString()
      });
      
      // Log activity
      broadcastActivity({
        type: 'project',
        action: 'created',
        entityType: 'project',
        entityId: newProject.id,
        description: `New project "${newProject.name}" was created`
      });
      
      res.status(201).json(newProject);
    } else {
      res.status(500).json({ error: 'Failed to create project' });
    }
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', (req, res) => {
  try {
    const updatedProject = db.update('projects', req.params.id, req.body);
    if (updatedProject) {
      // Broadcast real-time update
      io.emit('dataUpdated', {
        type: 'projects',
        action: 'updated',
        data: updatedProject,
        timestamp: new Date().toISOString()
      });
      
      // Broadcast to project-specific room
      io.to(`project-${updatedProject.id}`).emit('projectUpdated', updatedProject);
      
      // Log activity
      broadcastActivity({
        type: 'project',
        action: 'updated',
        entityType: 'project',
        entityId: updatedProject.id,
        description: `Project "${updatedProject.name}" was updated`
      });
      
      res.json(updatedProject);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  try {
    const deleted = db.delete('projects', req.params.id);
    if (deleted) {
      // Also delete related tasks
      const tasks = db.read('tasks');
      const filteredTasks = tasks.filter(task => task.projectId != req.params.id);
      db.write('tasks', filteredTasks);
      
      res.json({ message: 'Project and related tasks deleted successfully' });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Clients API endpoints
app.get('/api/clients', (req, res) => {
  try {
    const clients = db.read('clients');
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

app.post('/api/clients', (req, res) => {
  try {
    const newClient = db.insert('clients', req.body);
    if (newClient) {
      res.status(201).json(newClient);
    } else {
      res.status(500).json({ error: 'Failed to create client' });
    }
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

app.put('/api/clients/:id', (req, res) => {
  try {
    const updatedClient = db.update('clients', req.params.id, req.body);
    if (updatedClient) {
      res.json(updatedClient);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

app.delete('/api/clients/:id', (req, res) => {
  try {
    const deleted = db.delete('clients', req.params.id);
    if (deleted) {
      res.json({ message: 'Client deleted successfully' });
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// Scope Items API endpoints
app.get('/api/projects/:projectId/scope', (req, res) => {
  try {
    const scopeItems = db.read('scopeItems');
    const projectScope = scopeItems.filter(item => item.projectId == req.params.projectId);
    res.json(projectScope);
  } catch (error) {
    console.error('Error fetching scope items:', error);
    res.status(500).json({ error: 'Failed to fetch scope items' });
  }
});

app.post('/api/projects/:projectId/scope', (req, res) => {
  try {
    const scopeItem = {
      ...req.body,
      projectId: req.params.projectId,
      createdAt: new Date().toISOString()
    };
    const newScopeItem = db.insert('scopeItems', scopeItem);
    if (newScopeItem) {
      res.status(201).json(newScopeItem);
    } else {
      res.status(500).json({ error: 'Failed to create scope item' });
    }
  } catch (error) {
    console.error('Error creating scope item:', error);
    res.status(500).json({ error: 'Failed to create scope item' });
  }
});

app.put('/api/scope/:id', (req, res) => {
  try {
    const updatedScopeItem = db.update('scopeItems', req.params.id, req.body);
    if (updatedScopeItem) {
      res.json(updatedScopeItem);
    } else {
      res.status(404).json({ error: 'Scope item not found' });
    }
  } catch (error) {
    console.error('Error updating scope item:', error);
    res.status(500).json({ error: 'Failed to update scope item' });
  }
});

app.delete('/api/scope/:id', (req, res) => {
  try {
    const deleted = db.delete('scopeItems', req.params.id);
    if (deleted) {
      res.json({ message: 'Scope item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Scope item not found' });
    }
  } catch (error) {
    console.error('Error deleting scope item:', error);
    res.status(500).json({ error: 'Failed to delete scope item' });
  }
});

// Tasks API endpoints
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = db.read('tasks');
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const newTask = db.insert('tasks', req.body);
    if (newTask) {
      res.status(201).json(newTask);
    } else {
      res.status(500).json({ error: 'Failed to create task' });
    }
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const oldTask = db.read('tasks').find(t => t.id == req.params.id);
    const updatedTask = db.update('tasks', req.params.id, req.body);
    if (updatedTask) {
      // Broadcast real-time update
      io.emit('dataUpdated', {
        type: 'tasks',
        action: 'updated',
        data: updatedTask,
        timestamp: new Date().toISOString()
      });
      
      // Broadcast to task-specific room
      io.to(`task-${updatedTask.id}`).emit('taskUpdated', updatedTask);
      
      // Broadcast to project room
      io.to(`project-${updatedTask.projectId}`).emit('projectTaskUpdated', updatedTask);
      
      // Special handling for status changes
      if (oldTask && oldTask.status !== updatedTask.status) {
        io.emit('taskStatusChanged', {
          taskId: updatedTask.id,
          oldStatus: oldTask.status,
          newStatus: updatedTask.status,
          taskName: updatedTask.name
        });
      }
      
      // Log activity
      broadcastActivity({
        type: 'task',
        action: 'updated',
        entityType: 'task',
        entityId: updatedTask.id,
        description: `Task "${updatedTask.name}" was updated`,
        metadata: {
          projectId: updatedTask.projectId,
          status: updatedTask.status,
          assignedTo: updatedTask.assignedTo
        }
      });
      
      res.json(updatedTask);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const deleted = db.delete('tasks', req.params.id);
    if (deleted) {
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// File upload endpoint
app.post('/api/upload', (req, res) => {
  res.json({ message: 'File upload endpoint - implement file storage' });
});

// Scope Items routes
app.get('/api/scope-items/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    const scopeItems = db.read('scopeItems').filter(item => item.projectId == projectId);
    res.json(scopeItems);
  } catch (error) {
    console.error('Error fetching scope items:', error);
    res.status(500).json({ error: 'Failed to fetch scope items' });
  }
});

app.post('/api/scope-items', (req, res) => {
  try {
    const scopeItem = req.body;
    const newItem = {
      ...scopeItem,
      id: scopeItem.id || Date.now(),
      createdAt: scopeItem.createdAt || new Date().toISOString()
    };
    
    const scopeItems = db.read('scopeItems');
    scopeItems.push(newItem);
    db.write('scopeItems', scopeItems);
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating scope item:', error);
    res.status(500).json({ error: 'Failed to create scope item' });
  }
});

app.put('/api/scope-items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const scopeItems = db.read('scopeItems');
    const index = scopeItems.findIndex(item => item.id == id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Scope item not found' });
    }
    
    scopeItems[index] = {
      ...scopeItems[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    db.write('scopeItems', scopeItems);
    res.json(scopeItems[index]);
  } catch (error) {
    console.error('Error updating scope item:', error);
    res.status(500).json({ error: 'Failed to update scope item' });
  }
});

app.delete('/api/scope-items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const scopeItems = db.read('scopeItems');
    const filteredItems = scopeItems.filter(item => item.id != id);
    
    if (filteredItems.length === scopeItems.length) {
      return res.status(404).json({ error: 'Scope item not found' });
    }
    
    db.write('scopeItems', filteredItems);
    res.json({ message: 'Scope item deleted successfully' });
  } catch (error) {
    console.error('Error deleting scope item:', error);
    res.status(500).json({ error: 'Failed to delete scope item' });
  }
});

// Import and use new route modules
const shopDrawingsRouter = require('./routes/shopDrawings');
const specificationsRouter = require('./routes/specifications');
const complianceRouter = require('./routes/compliance');

// Mount the new routes
app.use('/api/shop-drawings', shopDrawingsRouter);
app.use('/api/specifications', specificationsRouter);
app.use('/api/compliance', complianceRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, (err) => {
  if (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
  
  console.log(`🚀 Formula Project Management API running on port ${PORT}`);
  console.log(`🌐 Server accessible at http://localhost:${PORT}`);
  console.log(`📧 Email service configured: ${process.env.EMAIL_USER ? 'Yes' : 'No (set EMAIL_USER and EMAIL_PASS)'}`);
  console.log(`🔗 WebSocket server ready for real-time connections`);
  
  // Initialize database with seed data after server starts
  setTimeout(() => {
    initializeDatabase();
  }, 100);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});