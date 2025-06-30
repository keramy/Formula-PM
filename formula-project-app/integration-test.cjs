/**
 * Formula PM Integration Testing Script
 * Comprehensive testing for production readiness
 */

const axios = require('axios');
const { io } = require('socket.io-client');

// Configuration
const BACKEND_URL = 'http://localhost:5015';
const API_URL = `${BACKEND_URL}/api/v1`;
const WS_URL = BACKEND_URL;

// Test results
const testResults = {
  backend: { total: 0, passed: 0, failed: 0, errors: [] },
  database: { total: 0, passed: 0, failed: 0, errors: [] },
  websocket: { total: 0, passed: 0, failed: 0, errors: [] },
  crud: { total: 0, passed: 0, failed: 0, errors: [] },
  performance: { total: 0, passed: 0, failed: 0, errors: [] }
};

// Helper function to log test results
function logTest(category, testName, passed, error = null) {
  testResults[category].total++;
  if (passed) {
    testResults[category].passed++;
    console.log(`✅ ${category.toUpperCase()} - ${testName}`);
  } else {
    testResults[category].failed++;
    testResults[category].errors.push({ test: testName, error: error?.message || 'Unknown error' });
    console.log(`❌ ${category.toUpperCase()} - ${testName}:`, error?.message || 'Failed');
  }
}

// Test backend connectivity
async function testBackendConnectivity() {
  console.log('\n🔍 Testing Backend Connectivity...\n');
  
  try {
    // Test root endpoint
    const healthCheck = await axios.get(`${BACKEND_URL}/health`);
    logTest('backend', 'Health check endpoint', healthCheck.status === 200);
    
    // Test API endpoints
    const endpoints = [
      { path: '/api/v1/users', name: 'Users endpoint' },
      { path: '/api/v1/projects', name: 'Projects endpoint' },
      { path: '/api/v1/tasks', name: 'Tasks endpoint' },
      { path: '/api/v1/clients', name: 'Clients endpoint' },
      { path: '/api/v1/team-members', name: 'Team members endpoint' },
      { path: '/api/v1/notifications', name: 'Notifications endpoint' },
      { path: '/api/v1/activities', name: 'Activities endpoint' },
      { path: '/api/v1/shop-drawings', name: 'Shop drawings endpoint' },
      { path: '/api/v1/materials', name: 'Materials endpoint' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${BACKEND_URL}${endpoint.path}`);
        logTest('backend', endpoint.name, response.status === 200);
      } catch (error) {
        logTest('backend', endpoint.name, false, error);
      }
    }
  } catch (error) {
    logTest('backend', 'Backend server connection', false, error);
  }
}

// Test database operations
async function testDatabaseOperations() {
  console.log('\n🔍 Testing Database Operations...\n');
  
  try {
    // Get counts from all tables
    const endpoints = [
      { path: '/api/v1/users', name: 'Users count' },
      { path: '/api/v1/projects', name: 'Projects count' },
      { path: '/api/v1/tasks', name: 'Tasks count' },
      { path: '/api/v1/clients', name: 'Clients count' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${BACKEND_URL}${endpoint.path}`);
        const data = response.data;
        let count = 0;
        if (data.success && data.data) {
          count = Array.isArray(data.data) ? data.data.length : 0;
        } else if (Array.isArray(data)) {
          count = data.length;
        }
        logTest('database', `${endpoint.name}: ${count} records`, count > 0);
      } catch (error) {
        logTest('database', endpoint.name, false, error);
      }
    }
  } catch (error) {
    logTest('database', 'Database connection', false, error);
  }
}

// Test WebSocket connectivity
async function testWebSocketConnectivity() {
  console.log('\n🔍 Testing WebSocket Connectivity...\n');
  
  return new Promise((resolve) => {
    const socket = io(WS_URL, {
      transports: ['websocket'],
      reconnection: false
    });
    
    const timeout = setTimeout(() => {
      logTest('websocket', 'WebSocket connection', false, new Error('Connection timeout'));
      socket.disconnect();
      resolve();
    }, 5000);
    
    socket.on('connect', () => {
      clearTimeout(timeout);
      logTest('websocket', 'WebSocket connection', true);
      
      // Test event emission
      socket.emit('test-event', { message: 'test' });
      logTest('websocket', 'Event emission', true);
      
      socket.disconnect();
      resolve();
    });
    
    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      logTest('websocket', 'WebSocket connection', false, error);
      resolve();
    });
  });
}

// Test CRUD operations
async function testCRUDOperations() {
  console.log('\n🔍 Testing CRUD Operations...\n');
  
  // Test Project CRUD
  try {
    // Create
    const createData = {
      name: 'Integration Test Project',
      type: 'commercial',
      status: 'active',
      priority: 'high',
      description: 'Created by integration test',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    const createResponse = await axios.post(`${API_URL}/projects`, createData);
    const projectId = createResponse.data.id;
    logTest('crud', 'Create project', createResponse.status === 201 && projectId);
    
    // Read
    const readResponse = await axios.get(`${API_URL}/projects/${projectId}`);
    logTest('crud', 'Read project', readResponse.status === 200);
    
    // Update
    const updateData = { name: 'Updated Test Project', priority: 'medium' };
    const updateResponse = await axios.put(`${API_URL}/projects/${projectId}`, updateData);
    logTest('crud', 'Update project', updateResponse.status === 200);
    
    // Delete
    const deleteResponse = await axios.delete(`${API_URL}/projects/${projectId}`);
    logTest('crud', 'Delete project', deleteResponse.status === 200);
    
  } catch (error) {
    logTest('crud', 'Project CRUD operations', false, error);
  }
  
  // Test Task CRUD
  try {
    // Get a project for task creation
    const projectsResponse = await axios.get(`${API_URL}/projects`);
    const projects = projectsResponse.data;
    if (projects && projects.length > 0) {
      const projectId = projects[0].id;
      
      // Create task
      const taskData = {
        name: 'Integration Test Task',
        projectId: projectId,
        status: 'pending',
        priority: 'medium',
        description: 'Created by integration test'
      };
      
      const createResponse = await axios.post(`${API_URL}/tasks`, taskData);
      const taskId = createResponse.data.id;
      logTest('crud', 'Create task', createResponse.status === 201 && taskId);
      
      // Delete task
      const deleteResponse = await axios.delete(`${API_URL}/tasks/${taskId}`);
      logTest('crud', 'Delete task', deleteResponse.status === 200);
    }
  } catch (error) {
    logTest('crud', 'Task CRUD operations', false, error);
  }
}

// Test performance
async function testPerformance() {
  console.log('\n🔍 Testing Performance...\n');
  
  const endpoints = [
    { path: '/api/v1/projects', name: 'Projects list' },
    { path: '/api/v1/tasks', name: 'Tasks list' },
    { path: '/api/v1/users', name: 'Users list' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const start = Date.now();
      await axios.get(`${BACKEND_URL}${endpoint.path}`);
      const duration = Date.now() - start;
      
      const passed = duration < 1000; // Should respond in less than 1 second
      logTest('performance', `${endpoint.name} response time: ${duration}ms`, passed);
    } catch (error) {
      logTest('performance', endpoint.name, false, error);
    }
  }
}

// Generate final report
function generateReport() {
  console.log('\n📊 INTEGRATION TEST REPORT\n');
  console.log('=' .repeat(50));
  
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const [category, results] of Object.entries(testResults)) {
    totalTests += results.total;
    totalPassed += results.passed;
    totalFailed += results.failed;
    
    const score = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;
    console.log(`\n${category.toUpperCase()} TESTS:`);
    console.log(`  Total: ${results.total}`);
    console.log(`  Passed: ${results.passed}`);
    console.log(`  Failed: ${results.failed}`);
    console.log(`  Score: ${score}%`);
    
    if (results.errors.length > 0) {
      console.log(`  Errors:`);
      results.errors.forEach(err => {
        console.log(`    - ${err.test}: ${err.error}`);
      });
    }
  }
  
  const overallScore = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
  
  console.log('\n' + '=' .repeat(50));
  console.log('OVERALL RESULTS:');
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  Passed: ${totalPassed}`);
  console.log(`  Failed: ${totalFailed}`);
  console.log(`  INTEGRATION SCORE: ${overallScore}%`);
  console.log('=' .repeat(50));
  
  // Production readiness assessment
  console.log('\n🚀 PRODUCTION READINESS ASSESSMENT:');
  if (overallScore >= 90) {
    console.log('✅ Application is READY for production deployment!');
  } else if (overallScore >= 70) {
    console.log('⚠️  Application needs minor fixes before production.');
  } else {
    console.log('❌ Application requires significant fixes before production.');
  }
  
  return overallScore;
}

// Main test runner
async function runIntegrationTests() {
  console.log('🚀 Starting Formula PM Integration Tests...\n');
  
  try {
    await testBackendConnectivity();
    await testDatabaseOperations();
    await testWebSocketConnectivity();
    await testCRUDOperations();
    await testPerformance();
  } catch (error) {
    console.error('Fatal error during testing:', error.message);
  }
  
  const score = generateReport();
  process.exit(score >= 90 ? 0 : 1);
}

// Run tests
runIntegrationTests();