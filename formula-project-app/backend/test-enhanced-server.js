/**
 * Enhanced Server Test Suite
 * Tests all CRUD endpoints for the enhanced Formula PM backend
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5015'; // Use different port for testing
const API_BASE = `${BASE_URL}/api/v1`;

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Test helper functions
function logTest(testName, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName} - ${details}`);
  }
  testResults.details.push({ testName, passed, details });
}

async function testEndpoint(method, endpoint, data = null, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      timeout: 5000
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return {
      success: response.status === expectedStatus,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 0,
      error: error.message,
      data: error.response?.data
    };
  }
}

async function runTests() {
  console.log('🚀 Starting Enhanced Server Test Suite...\n');
  
  // Test health endpoint
  console.log('📊 Testing Health & Info Endpoints...');
  let result = await testEndpoint('GET', '/../health');
  logTest('Health endpoint', result.success && result.data?.status === 'healthy');
  
  result = await testEndpoint('GET', '/../api');
  logTest('API root endpoint', result.success && result.data?.message?.includes('Formula PM'));
  
  // Test Users CRUD
  console.log('\n👥 Testing Users CRUD Operations...');
  
  // Get current user
  result = await testEndpoint('GET', '/users/me');
  logTest('GET /users/me', result.success);
  
  // List users
  result = await testEndpoint('GET', '/users');
  logTest('GET /users (list)', result.success && result.data?.data);
  
  // Get user by ID (demo mode)
  result = await testEndpoint('GET', '/users/1');
  logTest('GET /users/:id', result.success);
  
  // Create user
  const newUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@formulapm.com',
    role: 'designer'
  };
  result = await testEndpoint('POST', '/users', newUser, 201);
  logTest('POST /users (create)', result.success);
  const createdUserId = result.data?.data?.id;
  
  // Update user
  if (createdUserId) {
    result = await testEndpoint('PUT', `/users/${createdUserId}`, { position: 'Senior Designer' });
    logTest('PUT /users/:id (update)', result.success);
  }
  
  // Delete user
  if (createdUserId) {
    result = await testEndpoint('DELETE', `/users/${createdUserId}`);
    logTest('DELETE /users/:id', result.success);
  }
  
  // Test Projects CRUD
  console.log('\n📋 Testing Projects CRUD Operations...');
  
  // List projects
  result = await testEndpoint('GET', '/projects');
  logTest('GET /projects (list)', result.success && result.data?.data);
  
  // Get project by ID
  result = await testEndpoint('GET', '/projects/1');
  logTest('GET /projects/:id', result.success);
  
  // Create project
  const newProject = {
    name: 'Test Project',
    description: 'Test project description',
    type: 'commercial',
    clientId: '1'
  };
  result = await testEndpoint('POST', '/projects', newProject, 201);
  logTest('POST /projects (create)', result.success);
  const createdProjectId = result.data?.data?.id;
  
  // Update project
  if (createdProjectId) {
    result = await testEndpoint('PUT', `/projects/${createdProjectId}`, { status: 'active' });
    logTest('PUT /projects/:id (update)', result.success);
  }
  
  // Delete project
  if (createdProjectId) {
    result = await testEndpoint('DELETE', `/projects/${createdProjectId}`);
    logTest('DELETE /projects/:id', result.success);
  }
  
  // Test Tasks CRUD
  console.log('\n📝 Testing Tasks CRUD Operations...');
  
  // List tasks
  result = await testEndpoint('GET', '/tasks');
  logTest('GET /tasks (list)', result.success && result.data?.data);
  
  // Get task by ID
  result = await testEndpoint('GET', '/tasks/1');
  logTest('GET /tasks/:id', result.success);
  
  // Create task
  const newTask = {
    projectId: '1',
    name: 'Test Task',
    description: 'Test task description',
    priority: 'high'
  };
  result = await testEndpoint('POST', '/tasks', newTask, 201);
  logTest('POST /tasks (create)', result.success);
  const createdTaskId = result.data?.data?.id;
  
  // Update task
  if (createdTaskId) {
    result = await testEndpoint('PUT', `/tasks/${createdTaskId}`, { status: 'in_progress' });
    logTest('PUT /tasks/:id (update)', result.success);
  }
  
  // Delete task
  if (createdTaskId) {
    result = await testEndpoint('DELETE', `/tasks/${createdTaskId}`);
    logTest('DELETE /tasks/:id', result.success);
  }
  
  // Test Clients CRUD
  console.log('\n🏢 Testing Clients CRUD Operations...');
  
  // List clients
  result = await testEndpoint('GET', '/clients');
  logTest('GET /clients (list)', result.success && result.data?.data);
  
  // Get client by ID
  result = await testEndpoint('GET', '/clients/1');
  logTest('GET /clients/:id', result.success);
  
  // Create client
  const newClient = {
    name: 'Test Corp',
    contactPerson: 'John Doe',
    email: 'john@testcorp.com',
    type: 'commercial'
  };
  result = await testEndpoint('POST', '/clients', newClient, 201);
  logTest('POST /clients (create)', result.success);
  const createdClientId = result.data?.data?.id;
  
  // Update client
  if (createdClientId) {
    result = await testEndpoint('PUT', `/clients/${createdClientId}`, { phone: '+1234567890' });
    logTest('PUT /clients/:id (update)', result.success);
  }
  
  // Delete client
  if (createdClientId) {
    result = await testEndpoint('DELETE', `/clients/${createdClientId}`);
    logTest('DELETE /clients/:id', result.success);
  }
  
  // Test Team Members
  console.log('\n👥 Testing Team Members Operations...');
  
  // List team members
  result = await testEndpoint('GET', '/team-members');
  logTest('GET /team-members (list)', result.success && result.data?.data);
  
  // Add team member
  const newTeamMember = {
    projectId: '1',
    userId: '1',
    role: 'designer'
  };
  result = await testEndpoint('POST', '/team-members', newTeamMember, 201);
  logTest('POST /team-members (add)', result.success || result.status === 409); // 409 if already exists
  
  // Test Activities
  console.log('\n📊 Testing Activities Operations...');
  
  // List activities
  result = await testEndpoint('GET', '/activities');
  logTest('GET /activities (list)', result.success && result.data?.data);
  
  // Create activity
  const newActivity = {
    tableName: 'test',
    recordId: '1',
    action: 'create'
  };
  result = await testEndpoint('POST', '/activities', newActivity, 201);
  logTest('POST /activities (create)', result.success);
  
  // Test Notifications CRUD
  console.log('\n🔔 Testing Notifications CRUD Operations...');
  
  // List notifications
  result = await testEndpoint('GET', '/notifications');
  logTest('GET /notifications (list)', result.success && result.data?.data);
  
  // Create notification
  const newNotification = {
    userId: '1',
    type: 'task_assigned',
    title: 'Test Notification',
    message: 'This is a test notification'
  };
  result = await testEndpoint('POST', '/notifications', newNotification, 201);
  logTest('POST /notifications (create)', result.success);
  const createdNotificationId = result.data?.data?.id;
  
  // Update notification
  if (createdNotificationId) {
    result = await testEndpoint('PUT', `/notifications/${createdNotificationId}`, { readStatus: true });
    logTest('PUT /notifications/:id (update)', result.success);
  }
  
  // Delete notification
  if (createdNotificationId) {
    result = await testEndpoint('DELETE', `/notifications/${createdNotificationId}`);
    logTest('DELETE /notifications/:id', result.success);
  }
  
  // Test Updates
  console.log('\n📢 Testing Updates Operations...');
  
  // List updates
  result = await testEndpoint('GET', '/updates');
  logTest('GET /updates (list)', result.success && result.data?.data);
  
  // Create update
  const newUpdate = {
    title: 'Test Update',
    content: 'This is a test update',
    type: 'system'
  };
  result = await testEndpoint('POST', '/updates', newUpdate, 201);
  logTest('POST /updates (create)', result.success);
  
  // Test Shop Drawings CRUD
  console.log('\n📐 Testing Shop Drawings CRUD Operations...');
  
  // List shop drawings
  result = await testEndpoint('GET', '/shop-drawings');
  logTest('GET /shop-drawings (list)', result.success && result.data?.data);
  
  // Create shop drawing
  const newDrawing = {
    projectId: '1',
    fileName: 'test-drawing.pdf',
    drawingType: 'cabinet',
    room: 'kitchen'
  };
  result = await testEndpoint('POST', '/shop-drawings', newDrawing, 201);
  logTest('POST /shop-drawings (create)', result.success);
  const createdDrawingId = result.data?.data?.id;
  
  // Update shop drawing
  if (createdDrawingId) {
    result = await testEndpoint('PUT', `/shop-drawings/${createdDrawingId}`, { status: 'approved' });
    logTest('PUT /shop-drawings/:id (update)', result.success);
  }
  
  // Delete shop drawing
  if (createdDrawingId) {
    result = await testEndpoint('DELETE', `/shop-drawings/${createdDrawingId}`);
    logTest('DELETE /shop-drawings/:id', result.success);
  }
  
  // Test Material Specifications CRUD
  console.log('\n🔧 Testing Material Specifications CRUD Operations...');
  
  // List material specs
  result = await testEndpoint('GET', '/material-specs');
  logTest('GET /material-specs (list)', result.success && result.data?.data);
  
  // Create material spec
  const newMaterialSpec = {
    projectId: '1',
    description: 'Test Material',
    quantity: 10,
    unit: 'pcs',
    unitCost: 25.50
  };
  result = await testEndpoint('POST', '/material-specs', newMaterialSpec, 201);
  logTest('POST /material-specs (create)', result.success);
  const createdSpecId = result.data?.data?.id;
  
  // Update material spec
  if (createdSpecId) {
    result = await testEndpoint('PUT', `/material-specs/${createdSpecId}`, { status: 'approved' });
    logTest('PUT /material-specs/:id (update)', result.success);
  }
  
  // Delete material spec
  if (createdSpecId) {
    result = await testEndpoint('DELETE', `/material-specs/${createdSpecId}`);
    logTest('DELETE /material-specs/:id', result.success);
  }
  
  // Test Procurement Items CRUD
  console.log('\n🛒 Testing Procurement Items CRUD Operations...');
  
  // List procurement items
  result = await testEndpoint('GET', '/procurement-items');
  logTest('GET /procurement-items (list)', result.success && result.data?.data);
  
  // Create procurement item
  const newProcurementItem = {
    projectId: '1',
    description: 'Test Procurement Item',
    quantity: 5,
    unit: 'boxes',
    unitCost: 15.75
  };
  result = await testEndpoint('POST', '/procurement-items', newProcurementItem, 201);
  logTest('POST /procurement-items (create)', result.success);
  const createdProcurementId = result.data?.data?.id;
  
  // Update procurement item
  if (createdProcurementId) {
    result = await testEndpoint('PUT', `/procurement-items/${createdProcurementId}`, { status: 'ordered' });
    logTest('PUT /procurement-items/:id (update)', result.success);
  }
  
  // Delete procurement item
  if (createdProcurementId) {
    result = await testEndpoint('DELETE', `/procurement-items/${createdProcurementId}`);
    logTest('DELETE /procurement-items/:id', result.success);
  }
  
  // Test error handling
  console.log('\n❌ Testing Error Handling...');
  
  // Test 404 errors
  result = await testEndpoint('GET', '/users/nonexistent');
  logTest('404 error handling', result.status === 404);
  
  // Test validation errors
  result = await testEndpoint('POST', '/users', {});
  logTest('Validation error handling', result.status === 400);
  
  // Test invalid UUID format
  result = await testEndpoint('GET', '/projects/invalid-uuid');
  logTest('Invalid UUID error handling', result.status === 400);
  
  // Print final results
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📊 Total: ${testResults.total}`);
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.details
      .filter(test => !test.passed)
      .forEach(test => console.log(`   - ${test.testName}: ${test.details}`));
  }
  
  console.log('\n✅ Enhanced Server Test Suite Complete!');
  
  // Return score for evaluation
  const score = Math.round((testResults.passed / testResults.total) * 100);
  console.log(`\n🎯 FINAL SCORE: ${score}/100`);
  
  return score;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };