#!/usr/bin/env node

/**
 * Integration Test Script
 * Tests the enhanced backend API endpoints to ensure they work with frontend
 */

const https = require('http');

const API_BASE = 'http://localhost:5015/api/v1';

async function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            status: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: result,
            path: path
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            success: false,
            error: 'Invalid JSON response',
            raw: data,
            path: path
          });
        }
      });
    });

    req.on('error', (error) => {
      reject({
        path: path,
        error: error.message,
        success: false
      });
    });

    if (body && method !== 'GET') {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function runIntegrationTests() {
  console.log('🚀 Running Enhanced Backend Integration Tests\n');
  
  const tests = [
    { name: 'Health Check', path: '/health', baseUrl: 'http://localhost:5015' },
    { name: 'Users List', path: '/users' },
    { name: 'Projects List', path: '/projects' },
    { name: 'Tasks List', path: '/tasks' },
    { name: 'Clients List', path: '/clients' },
    { name: 'Material Specifications', path: '/specifications' }
  ];

  const results = [];
  
  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      
      let result;
      if (test.baseUrl) {
        // Special handling for health check
        result = await testEndpoint(test.path.replace('/api/v1', ''));
        result.url = test.baseUrl + test.path;
      } else {
        result = await testEndpoint(test.path);
        result.url = API_BASE + test.path;
      }
      
      if (result.success) {
        console.log(`✅ ${test.name}: SUCCESS`);
        if (result.data?.data?.length) {
          console.log(`   📊 Records: ${result.data.data.length}`);
        } else if (result.data?.pagination?.total) {
          console.log(`   📊 Total: ${result.data.pagination.total}`);
        }
        console.log(`   🔗 URL: ${result.url}`);
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   🔗 URL: ${result.url}`);
        console.log(`   📄 Status: ${result.status}`);
        if (result.error) {
          console.log(`   🚨 Error: ${result.error}`);
        }
      }
      
      results.push({
        name: test.name,
        success: result.success,
        status: result.status,
        url: result.url,
        dataCount: result.data?.data?.length || result.data?.pagination?.total || 0
      });
      
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR`);
      console.log(`   🚨 ${error.error || error.message}`);
      results.push({
        name: test.name,
        success: false,
        error: error.error || error.message
      });
    }
    
    console.log('');
  }

  // Summary
  console.log('📋 Integration Test Summary');
  console.log('=' * 50);
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  console.log(`📊 Success Rate: ${Math.round((successful / total) * 100)}%`);
  
  if (successful === total) {
    console.log('\n🎉 All tests passed! Backend is ready for frontend integration.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the issues above.');
  }
  
  return {
    total,
    successful,
    successRate: Math.round((successful / total) * 100),
    results
  };
}

// Health check function for specific testing
async function testHealthAndCore() {
  console.log('🔍 Testing Core API Health...\n');
  
  try {
    // Test health endpoint
    const healthResult = await testEndpoint('', 'GET', null);
    healthResult.url = 'http://localhost:5015/health';
    
    console.log('Health Check:', healthResult.success ? '✅ HEALTHY' : '❌ UNHEALTHY');
    
    if (!healthResult.success) {
      console.log('❌ Backend server is not responding properly');
      return false;
    }
    
    // Test core endpoints that frontend expects
    const coreTests = ['users', 'projects', 'tasks', 'clients'];
    let allPassed = true;
    
    for (const endpoint of coreTests) {
      try {
        const result = await testEndpoint(`/${endpoint}`);
        const passed = result.success && result.data?.data;
        console.log(`${endpoint.toUpperCase()}:`, passed ? '✅ OK' : '❌ FAIL');
        if (!passed) allPassed = false;
      } catch (error) {
        console.log(`${endpoint.toUpperCase()}: ❌ ERROR`);
        allPassed = false;
      }
    }
    
    return allPassed;
    
  } catch (error) {
    console.log('❌ Failed to connect to backend server');
    return false;
  }
}

// Run the tests
if (require.main === module) {
  runIntegrationTests()
    .then((summary) => {
      process.exit(summary.successRate === 100 ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Integration test failed:', error);
      process.exit(1);
    });
}

module.exports = { testEndpoint, runIntegrationTests, testHealthAndCore };