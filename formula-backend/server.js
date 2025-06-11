const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const SimpleDB = require('./database');
const seedData = require('./seedData');

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Database
const db = new SimpleDB('./data');

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
    const updatedTask = db.update('tasks', req.params.id, req.body);
    if (updatedTask) {
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Formula Project Management API running on port ${PORT}`);
  console.log(`📧 Email service configured: ${process.env.EMAIL_USER ? 'Yes' : 'No (set EMAIL_USER and EMAIL_PASS)'}`);
  
  // Initialize database with seed data
  initializeDatabase();
});