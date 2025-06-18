#!/usr/bin/env node

const API_BASE = 'http://localhost:5014/api';

async function testEndpoint(endpoint, description) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (response.ok) {
      const data = await response.json();
      const count = Array.isArray(data) ? data.length : (data.data ? data.data.length : 1);
      console.log(`✅ ${description}: ${count} items`);
      return true;
    } else {
      console.log(`❌ ${description}: HTTP ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🔍 Testing Backend-Frontend Connectivity...\n');
  
  const tests = [
    ['/health', 'Health Check'],
    ['/team-members', 'Team Members'],
    ['/projects', 'Projects'],
    ['/tasks', 'Tasks'],
    ['/clients', 'Clients'],
    ['/specifications', 'Material Specifications']
  ];
  
  let passed = 0;
  for (const [endpoint, description] of tests) {
    if (await testEndpoint(endpoint, description)) {
      passed++;
    }
  }
  
  console.log(`\n📊 Results: ${passed}/${tests.length} tests passed`);
  
  if (passed === tests.length) {
    console.log('🎉 All connectivity tests passed! Backend-frontend connection is restored.');
  } else {
    console.log('⚠️  Some tests failed. Check backend server status.');
  }
}

runTests();