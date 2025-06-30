/**
 * Formula PM Frontend API Testing
 * Tests frontend connectivity and API integration
 */

const axios = require('axios');

// Configuration
const FRONTEND_URL = 'http://localhost:3003';
const BACKEND_URL = 'http://localhost:5015';

// Test results
const testResults = {
  connectivity: { total: 0, passed: 0, failed: 0, errors: [] },
  assets: { total: 0, passed: 0, failed: 0, errors: [] },
  api: { total: 0, passed: 0, failed: 0, errors: [] }
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

// Test frontend connectivity
async function testFrontendConnectivity() {
  console.log('\n🔍 Testing Frontend Connectivity...\n');
  
  try {
    // Test main page
    const response = await axios.get(FRONTEND_URL);
    logTest('connectivity', 'Frontend main page loads', response.status === 200);
    
    // Check if it's the React app
    const hasReactRoot = response.data.includes('root') || response.data.includes('app');
    logTest('connectivity', 'React app detected', hasReactRoot);
    
    // Test static assets
    const assets = [
      { path: '/vite.svg', name: 'Vite logo' },
      { path: '/index.html', name: 'Index HTML' }
    ];
    
    for (const asset of assets) {
      try {
        const assetResponse = await axios.get(`${FRONTEND_URL}${asset.path}`);
        logTest('assets', `${asset.name} loads`, assetResponse.status === 200);
      } catch (error) {
        logTest('assets', `${asset.name} loads`, false, error);
      }
    }
    
  } catch (error) {
    logTest('connectivity', 'Frontend server connection', false, error);
  }
}

// Test API proxy
async function testAPIProxy() {
  console.log('\n🔍 Testing Frontend API Proxy...\n');
  
  try {
    // Test if frontend proxies API calls
    const endpoints = [
      { path: '/api/v1/projects', name: 'Projects API proxy' },
      { path: '/api/v1/users', name: 'Users API proxy' },
      { path: '/api/v1/tasks', name: 'Tasks API proxy' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${FRONTEND_URL}${endpoint.path}`);
        logTest('api', endpoint.name, response.status === 200);
      } catch (error) {
        // Check if it's a 404 (no proxy) or other error
        if (error.response?.status === 404) {
          logTest('api', `${endpoint.name} (needs proxy config)`, false, new Error('Proxy not configured'));
        } else {
          logTest('api', endpoint.name, false, error);
        }
      }
    }
    
  } catch (error) {
    logTest('api', 'API proxy configuration', false, error);
  }
}

// Test build artifacts
async function testBuildArtifacts() {
  console.log('\n🔍 Testing Build Artifacts...\n');
  
  try {
    // Check for common build issues
    const response = await axios.get(FRONTEND_URL);
    
    // Check for console errors in HTML
    const hasConsoleErrors = response.data.includes('console.error') || 
                            response.data.includes('Error:');
    logTest('assets', 'No build errors in HTML', !hasConsoleErrors);
    
    // Check for proper meta tags
    const hasViewport = response.data.includes('viewport');
    logTest('assets', 'Viewport meta tag present', hasViewport);
    
    // Check for app title
    const hasTitle = response.data.includes('<title>') && 
                    response.data.includes('Formula PM');
    logTest('assets', 'Application title set', hasTitle);
    
  } catch (error) {
    logTest('assets', 'Build artifacts check', false, error);
  }
}

// Generate report
function generateReport() {
  console.log('\n📊 FRONTEND API TEST REPORT\n');
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
  console.log(`  FRONTEND API SCORE: ${overallScore}%`);
  console.log('=' .repeat(50));
  
  return overallScore;
}

// Main test runner
async function runFrontendAPITests() {
  console.log('🚀 Starting Formula PM Frontend API Tests...\n');
  
  try {
    await testFrontendConnectivity();
    await testAPIProxy();
    await testBuildArtifacts();
  } catch (error) {
    console.error('Fatal error during testing:', error.message);
  }
  
  const score = generateReport();
  
  // Provide recommendations
  console.log('\n📋 RECOMMENDATIONS:\n');
  if (score < 90) {
    console.log('1. Configure Vite proxy to forward /api requests to backend');
    console.log('2. Ensure all static assets are properly served');
    console.log('3. Check console for any runtime errors');
  } else {
    console.log('✅ Frontend is properly configured and running!');
  }
  
  process.exit(score >= 80 ? 0 : 1); // Lower threshold for API tests
}

// Run tests
runFrontendAPITests();