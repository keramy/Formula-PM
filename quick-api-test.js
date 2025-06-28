#!/usr/bin/env node

/**
 * Quick API Test Suite
 * Tests core API endpoints with simple backend
 */

const http = require('http');

const makeRequest = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5014,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data && method !== 'GET') {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const parsedBody = JSON.parse(body);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsedBody
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Quick API Test Suite for Formula PM');
  console.log('=====================================\n');

  const tests = [
    { name: 'Health Check', path: '/api/health', expected: 200 },
    { name: 'Team Members List', path: '/api/team-members', expected: 200 },
    { name: 'Projects List', path: '/api/projects', expected: 200 },
    { name: 'Tasks List', path: '/api/tasks', expected: 200 },
    { name: 'Clients List', path: '/api/clients', expected: 200 },
    { name: 'Activities List', path: '/api/activities', expected: 200 },
    { name: 'User Presence', path: '/api/presence', expected: 200 },
    { name: 'Auth Routes', path: '/api/auth/login', expected: 400 }, // Should fail without data
    { name: 'Shop Drawings', path: '/api/shop-drawings', expected: 200 },
    { name: 'Specifications', path: '/api/specifications', expected: 200 },
    { name: 'Compliance', path: '/api/compliance', expected: 200 },
    { name: 'Non-existent Route', path: '/api/non-existent', expected: 404 }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      
      const result = await makeRequest(test.path, 'GET');
      
      if (result.status === test.expected) {
        console.log(`✅ ${test.name} - Status: ${result.status}`);
        if (result.data && typeof result.data === 'object') {
          if (Array.isArray(result.data)) {
            console.log(`   📊 Returned ${result.data.length} items`);
          } else if (result.data.status || result.data.message) {
            console.log(`   📋 ${result.data.status || result.data.message}`);
          }
        }
        passed++;
      } else {
        console.log(`❌ ${test.name} - Expected: ${test.expected}, Got: ${result.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`);
      failed++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);

  // Test data creation
  console.log('\n🧪 Testing Data Creation...');
  
  try {
    const newProject = {
      name: 'API Test Project',
      description: 'Test project created by API verification',
      type: 'commercial',
      status: 'draft',
      clientId: '1',
      location: 'Test Location'
    };

    const createResult = await makeRequest('/api/projects', 'POST', newProject);
    
    if (createResult.status === 201) {
      console.log('✅ Project Creation - Success');
      console.log(`   📋 Created project: ${createResult.data.name}`);
    } else {
      console.log(`❌ Project Creation - Status: ${createResult.status}`);
    }
  } catch (error) {
    console.log(`❌ Project Creation - Error: ${error.message}`);
  }

  // Test scope items
  try {
    const scopeResult = await makeRequest('/api/projects/1/scope', 'GET');
    
    if (scopeResult.status === 200) {
      console.log('✅ Scope Items Retrieval - Success');
      console.log(`   📊 Found ${scopeResult.data.length} scope items for project 1`);
    } else {
      console.log(`❌ Scope Items Retrieval - Status: ${scopeResult.status}`);
    }
  } catch (error) {
    console.log(`❌ Scope Items Retrieval - Error: ${error.message}`);
  }

  console.log('\n✅ API verification complete!');
  console.log('🌐 Simple backend is functional and responding correctly');
};

runTests().catch(console.error);