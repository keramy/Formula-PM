#!/usr/bin/env node

/**
 * Formula PM Backend API Verification Test Suite
 * Tests all API endpoints for functionality and error handling
 */

const fetch = require('node-fetch').default || require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'http://localhost:5014';
const TEST_RESULTS_FILE = path.join(__dirname, 'api-test-results.json');

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  environment: 'development',
  apiBaseUrl: API_BASE_URL,
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    errors: 0
  },
  tests: []
};

// Utility functions
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📋',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  }[type] || 'ℹ️';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
};

const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = response.headers.get('content-type')?.includes('application/json') 
      ? await response.json() 
      : await response.text();
    
    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data,
      success: response.ok
    };
  } catch (error) {
    return {
      status: 0,
      statusText: 'Network Error',
      error: error.message,
      success: false
    };
  }
};

const addTestResult = (name, endpoint, method, result, expected = null) => {
  const test = {
    name,
    endpoint,
    method,
    timestamp: new Date().toISOString(),
    status: result.status,
    success: result.success,
    responseTime: result.responseTime,
    error: result.error || null,
    expected,
    actual: result.data
  };
  
  testResults.tests.push(test);
  testResults.summary.total++;
  
  if (result.success) {
    testResults.summary.passed++;
    log(`✅ ${name} - ${method} ${endpoint}`, 'success');
  } else {
    testResults.summary.failed++;
    log(`❌ ${name} - ${method} ${endpoint} - Status: ${result.status}`, 'error');
    if (result.error) {
      log(`   Error: ${result.error}`, 'error');
    }
  }
};

// Test suite functions
const testHealthEndpoints = async () => {
  log('Testing Health Endpoints...', 'info');
  
  // Basic health check
  const healthResult = await makeRequest('/health');
  addTestResult('Basic Health Check', '/health', 'GET', healthResult);
  
  // Detailed health check
  const detailedHealthResult = await makeRequest('/health/detailed');
  addTestResult('Detailed Health Check', '/health/detailed', 'GET', detailedHealthResult);
};

const testAPIDocumentation = async () => {
  log('Testing API Documentation...', 'info');
  
  // API root endpoint
  const apiRootResult = await makeRequest('/api');
  addTestResult('API Root Documentation', '/api', 'GET', apiRootResult);
  
  // API v1 documentation
  const apiDocsResult = await makeRequest('/api/v1/docs');
  addTestResult('API v1 Documentation', '/api/v1/docs', 'GET', apiDocsResult);
  
  // API status
  const apiStatusResult = await makeRequest('/api/v1/status');
  addTestResult('API v1 Status', '/api/v1/status', 'GET', apiStatusResult);
};

const testAuthenticationEndpoints = async () => {
  log('Testing Authentication Endpoints (without valid credentials)...', 'info');
  
  // Test auth endpoints that should return 401/400 without credentials
  const authTests = [
    { endpoint: '/api/v1/auth/me', method: 'GET', expectedStatus: 401 },
    { endpoint: '/api/v1/auth/logout', method: 'POST', expectedStatus: 401 },
    { endpoint: '/api/v1/auth/refresh', method: 'POST', expectedStatus: 400 }
  ];
  
  for (const test of authTests) {
    const result = await makeRequest(test.endpoint, { method: test.method });
    addTestResult(
      `Authentication ${test.method} ${test.endpoint}`, 
      test.endpoint, 
      test.method, 
      result, 
      test.expectedStatus
    );
  }
};

const testUserEndpoints = async () => {
  log('Testing User Endpoints (should require authentication)...', 'info');
  
  const userTests = [
    { endpoint: '/api/v1/users', method: 'GET', expectedStatus: 401 },
    { endpoint: '/api/v1/users/meta/roles', method: 'GET', expectedStatus: 401 },
  ];
  
  for (const test of userTests) {
    const result = await makeRequest(test.endpoint, { method: test.method });
    addTestResult(
      `User ${test.method} ${test.endpoint}`, 
      test.endpoint, 
      test.method, 
      result, 
      test.expectedStatus
    );
  }
};

const testProjectEndpoints = async () => {
  log('Testing Project Endpoints (should require authentication)...', 'info');
  
  const projectTests = [
    { endpoint: '/api/v1/projects', method: 'GET', expectedStatus: 401 },
    { endpoint: '/api/v1/clients', method: 'GET', expectedStatus: 401 },
    { endpoint: '/api/v1/tasks', method: 'GET', expectedStatus: 401 }
  ];
  
  for (const test of projectTests) {
    const result = await makeRequest(test.endpoint, { method: test.method });
    addTestResult(
      `Project ${test.method} ${test.endpoint}`, 
      test.endpoint, 
      test.method, 
      result, 
      test.expectedStatus
    );
  }
};

const testAdvancedServiceEndpoints = async () => {
  log('Testing Advanced Service Endpoints...', 'info');
  
  const serviceTests = [
    { endpoint: '/api/v1/search/global', method: 'GET', expectedStatus: 401 },
    { endpoint: '/api/v1/mentions/search', method: 'GET', expectedStatus: 401 },
    { endpoint: '/api/v1/analytics/dashboard', method: 'GET', expectedStatus: 401 },
    { endpoint: '/api/v1/reports/types', method: 'GET', expectedStatus: 401 },
    { endpoint: '/api/v1/notifications', method: 'GET', expectedStatus: 401 },
    { endpoint: '/api/v1/system/health', method: 'GET', expectedStatus: 200 } // System health should be public
  ];
  
  for (const test of serviceTests) {
    const result = await makeRequest(test.endpoint, { method: test.method });
    addTestResult(
      `Service ${test.method} ${test.endpoint}`, 
      test.endpoint, 
      test.method, 
      result, 
      test.expectedStatus
    );
  }
};

const testPlaceholderEndpoints = async () => {
  log('Testing Placeholder Endpoints (under development)...', 'info');
  
  const placeholderTests = [
    { endpoint: '/api/v1/projects/test-id/materials', method: 'GET', expectedStatus: 501 },
    { endpoint: '/api/v1/projects/test-id/workflow', method: 'GET', expectedStatus: 501 }
  ];
  
  for (const test of placeholderTests) {
    const result = await makeRequest(test.endpoint, { method: test.method });
    addTestResult(
      `Placeholder ${test.method} ${test.endpoint}`, 
      test.endpoint, 
      test.method, 
      result, 
      test.expectedStatus
    );
  }
};

const testErrorHandling = async () => {
  log('Testing Error Handling...', 'info');
  
  // Test 404 handling
  const notFoundResult = await makeRequest('/api/v1/nonexistent-endpoint');
  addTestResult('404 Error Handling', '/api/v1/nonexistent-endpoint', 'GET', notFoundResult, 404);
  
  // Test malformed JSON
  const malformedJsonResult = await makeRequest('/api/v1/auth/login', {
    method: 'POST',
    body: 'invalid json',
    headers: { 'Content-Type': 'application/json' }
  });
  addTestResult('Malformed JSON Handling', '/api/v1/auth/login', 'POST', malformedJsonResult, 400);
};

const testServerConnectivity = async () => {
  log('Testing Basic Server Connectivity...', 'info');
  
  try {
    const response = await fetch(API_BASE_URL, { timeout: 5000 });
    addTestResult('Server Connectivity', '/', 'GET', {
      status: response.status,
      success: response.ok,
      data: 'Server reachable'
    });
  } catch (error) {
    addTestResult('Server Connectivity', '/', 'GET', {
      status: 0,
      success: false,
      error: error.message
    });
  }
};

const checkDatabaseConnectivity = async () => {
  log('Testing Database Connectivity via Health Check...', 'info');
  
  const healthResult = await makeRequest('/health');
  if (healthResult.success && healthResult.data) {
    const hasDb = healthResult.data.database === 'healthy';
    addTestResult('Database Connectivity', '/health', 'GET', {
      status: healthResult.status,
      success: hasDb,
      data: healthResult.data.database || 'unknown'
    });
  } else {
    addTestResult('Database Connectivity', '/health', 'GET', {
      status: healthResult.status,
      success: false,
      error: 'Health check failed'
    });
  }
};

const generateReport = () => {
  log('Generating Test Report...', 'info');
  
  // Calculate success rate
  const successRate = testResults.summary.total > 0 
    ? ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(2)
    : 0;
  
  // Add summary statistics
  testResults.summary.successRate = successRate;
  testResults.summary.duration = new Date().toISOString();
  
  // Save detailed results to file
  fs.writeFileSync(TEST_RESULTS_FILE, JSON.stringify(testResults, null, 2));
  
  // Console summary
  console.log('\n' + '='.repeat(80));
  console.log('🧪 API VERIFICATION TEST RESULTS SUMMARY');
  console.log('='.repeat(80));
  console.log(`📊 Total Tests: ${testResults.summary.total}`);
  console.log(`✅ Passed: ${testResults.summary.passed}`);
  console.log(`❌ Failed: ${testResults.summary.failed}`);
  console.log(`📈 Success Rate: ${successRate}%`);
  console.log(`📁 Detailed results saved to: ${TEST_RESULTS_FILE}`);
  
  // Show critical failures
  const criticalFailures = testResults.tests.filter(test => 
    !test.success && test.endpoint.includes('/health')
  );
  
  if (criticalFailures.length > 0) {
    console.log('\n⚠️  CRITICAL FAILURES (Health/Connectivity):');
    criticalFailures.forEach(test => {
      console.log(`   ❌ ${test.name}: ${test.error || `Status ${test.status}`}`);
    });
  }
  
  // Show authentication failures (expected)
  const authFailures = testResults.tests.filter(test => 
    !test.success && test.status === 401
  );
  
  if (authFailures.length > 0) {
    console.log(`\n🔒 Authentication Required (${authFailures.length} endpoints): ✅ Expected`);
  }
  
  console.log('='.repeat(80));
  
  return testResults;
};

// Main test execution
const runAllTests = async () => {
  console.log('🚀 Starting Formula PM Backend API Verification...');
  console.log(`🌐 Testing API at: ${API_BASE_URL}`);
  console.log(`📅 Test Started: ${new Date().toISOString()}\n`);
  
  try {
    // Core connectivity and health
    await testServerConnectivity();
    await testHealthEndpoints();
    await checkDatabaseConnectivity();
    
    // API documentation
    await testAPIDocumentation();
    
    // Authentication system
    await testAuthenticationEndpoints();
    
    // Core business logic endpoints
    await testUserEndpoints();
    await testProjectEndpoints();
    
    // Advanced service endpoints
    await testAdvancedServiceEndpoints();
    
    // Placeholder endpoints
    await testPlaceholderEndpoints();
    
    // Error handling
    await testErrorHandling();
    
  } catch (error) {
    log(`Test execution error: ${error.message}`, 'error');
    testResults.summary.errors++;
  }
  
  return generateReport();
};

// Export for use as module or run directly
if (require.main === module) {
  runAllTests().then((results) => {
    // Exit with appropriate code
    const hasErrors = results.summary.failed > 0 || results.summary.errors > 0;
    process.exit(hasErrors ? 1 : 0);
  }).catch((error) => {
    console.error('Fatal test error:', error);
    process.exit(1);
  });
} else {
  module.exports = { runAllTests, makeRequest, testResults };
}