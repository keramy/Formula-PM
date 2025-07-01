/**
 * Simple Formula PM Backend Server (for testing)
 * Minimal version without service initialization
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

// Import rich demo data
const { 
  demoProjects, 
  demoTasks, 
  demoTeamMembers, 
  demoClients, 
  demoShopDrawings, 
  demoProjectScopes, 
  demoActivities, 
  demoMaterialSpecs, 
  demoMyWork 
} = require('../src/services/demoDataService');

// Demo mode user for testing
const demoUser = {
  id: 'demo-user',
  email: 'demo@formulapm.com',
  firstName: 'Demo',
  lastName: 'User',
  role: 'admin'
};

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5014;

// Middleware setup
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3003',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Demo mode middleware
app.use((req, res, next) => {
  req.user = demoUser;
  next();
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: 'demo',
    timestamp: new Date().toISOString(),
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version
    }
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Formula PM API Server (Demo Mode)',
    version: '1.0.0',
    status: 'operational',
    mode: 'demo',
    timestamp: new Date().toISOString()
  });
});

// Demo API endpoints with rich data
app.get('/api/v1/users/me', (req, res) => {
  res.json({ user: req.user });
});

// Projects endpoint
app.get('/api/v1/projects', (req, res) => {
  res.json({
    success: true,
    data: demoProjects,
    total: demoProjects.length,
    message: 'Demo projects loaded successfully'
  });
});

// Users/Team Members endpoint  
app.get('/api/v1/users', (req, res) => {
  res.json({
    success: true,
    data: demoTeamMembers,
    total: demoTeamMembers.length,
    message: 'Demo team members loaded successfully'
  });
});

// Legacy team-members endpoint for compatibility
app.get('/api/v1/team-members', (req, res) => {
  res.json({
    success: true,
    data: demoTeamMembers,
    total: demoTeamMembers.length,
    message: 'Demo team members loaded successfully'
  });
});

// Tasks endpoint
app.get('/api/v1/tasks', (req, res) => {
  res.json({
    success: true,
    data: demoTasks,
    total: demoTasks.length,
    message: 'Demo tasks loaded successfully'
  });
});

// Clients endpoint
app.get('/api/v1/clients', (req, res) => {
  res.json({
    success: true,
    data: demoClients,
    total: demoClients.length,
    message: 'Demo clients loaded successfully'
  });
});

// Shop Drawings endpoint
app.get('/api/v1/projects/:projectId/drawings', (req, res) => {
  const { projectId } = req.params;
  const projectDrawings = demoShopDrawings.filter(drawing => drawing.projectId === projectId);
  res.json({
    success: true,
    data: projectDrawings,
    total: projectDrawings.length,
    message: 'Demo shop drawings loaded successfully'
  });
});

// All shop drawings
app.get('/api/v1/drawings', (req, res) => {
  res.json({
    success: true,
    data: demoShopDrawings,
    total: demoShopDrawings.length,
    message: 'Demo shop drawings loaded successfully'
  });
});

// Material Specifications endpoint
app.get('/api/v1/specifications', (req, res) => {
  res.json({
    success: true,
    data: demoMaterialSpecs,
    total: demoMaterialSpecs.length,
    message: 'Demo material specifications loaded successfully'
  });
});

// Activities endpoint
app.get('/api/v1/activities', (req, res) => {
  res.json({
    success: true,
    data: demoActivities,
    total: demoActivities.length,
    message: 'Demo activities loaded successfully'
  });
});

// Project Scopes endpoint
app.get('/api/v1/projects/:projectId/scope/items', (req, res) => {
  const { projectId } = req.params;
  const projectScope = demoProjectScopes.find(scope => scope.projectId === projectId);
  res.json({
    success: true,
    data: projectScope ? projectScope.items : [],
    total: projectScope ? projectScope.items.length : 0,
    message: 'Demo project scope loaded successfully'
  });
});

// My Work endpoint
app.get('/api/v1/my-work', (req, res) => {
  res.json({
    success: true,
    data: demoMyWork,
    message: 'Demo my work data loaded successfully'
  });
});

// Catch all other API routes
app.use('/api', (req, res) => {
  res.json({
    message: 'Demo mode endpoint',
    path: req.path,
    method: req.method,
    status: 'success'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
console.log('🚀 Starting Simple Formula PM Backend Server with Rich Demo Data...');

server.listen(PORT, () => {
  console.log(`✅ Simple server running on port ${PORT}`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API root: http://localhost:${PORT}/api`);
  console.log(`👤 Demo user: http://localhost:${PORT}/api/v1/users/me`);
  console.log(`📊 Projects (${demoProjects.length}): http://localhost:${PORT}/api/v1/projects`);
  console.log(`👥 Team Members (${demoTeamMembers.length}): http://localhost:${PORT}/api/v1/users`);
  console.log(`📋 Tasks (${demoTasks.length}): http://localhost:${PORT}/api/v1/tasks`);
  console.log(`🏢 Clients (${demoClients.length}): http://localhost:${PORT}/api/v1/clients`);
  console.log(`📐 Shop Drawings (${demoShopDrawings.length}): http://localhost:${PORT}/api/v1/drawings`);
  console.log(`🔧 Material Specs (${demoMaterialSpecs.length}): http://localhost:${PORT}/api/v1/specifications`);
  console.log(`📊 Mode: DEMO (Rich data loaded, no database required)`);
});

module.exports = server;