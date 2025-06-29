/**
 * Simple Formula PM Backend Server (for testing)
 * Minimal version without service initialization
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

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

// Demo API endpoints
app.get('/api/v1/users/me', (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/v1/projects', (req, res) => {
  res.json({
    projects: [
      { id: '1', name: 'Demo Project 1', status: 'active' },
      { id: '2', name: 'Demo Project 2', status: 'completed' }
    ]
  });
});

app.get('/api/v1/team-members', (req, res) => {
  res.json({
    teamMembers: [
      { id: '1', firstName: 'John', lastName: 'Doe', role: 'project_manager' },
      { id: '2', firstName: 'Jane', lastName: 'Smith', role: 'designer' }
    ]
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
console.log('🚀 Starting Simple Formula PM Backend Server...');

server.listen(PORT, () => {
  console.log(`✅ Simple server running on port ${PORT}`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API root: http://localhost:${PORT}/api`);
  console.log(`👤 Demo user: http://localhost:${PORT}/api/v1/users/me`);
  console.log(`📊 Mode: DEMO (no database/redis required)`);
});

module.exports = server;