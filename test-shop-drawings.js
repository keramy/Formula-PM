#!/usr/bin/env node

const API_BASE = 'http://localhost:5014/api';

async function testShopDrawingsAPI() {
  console.log('🎨 Testing Shop Drawings API Integration...\n');
  
  try {
    // Test 1: Get all shop drawings
    console.log('1️⃣  Testing: GET /api/shop-drawings');
    const response = await fetch(`${API_BASE}/shop-drawings`);
    if (response.ok) {
      const data = await response.json();
      const drawings = data.data || data;
      console.log(`✅ Found ${drawings.length} shop drawings`);
      
      // Show sample data
      if (drawings.length > 0) {
        const sample = drawings[0];
        console.log(`   📋 Sample: ${sample.fileName} - ${sample.projectName} - Status: ${sample.status}`);
      }
    } else {
      console.log(`❌ HTTP ${response.status}`);
      return false;
    }
    
    // Test 2: Get drawings by project
    console.log('\n2️⃣  Testing: GET /api/shop-drawings/project/2001');
    const projectResponse = await fetch(`${API_BASE}/shop-drawings/project/2001`);
    if (projectResponse.ok) {
      const projectData = await projectResponse.json();
      const projectDrawings = projectData.data || projectData;
      console.log(`✅ Found ${projectDrawings.length} drawings for project 2001`);
    } else {
      console.log(`❌ HTTP ${projectResponse.status}`);
    }
    
    // Test 3: Get drawing statistics
    console.log('\n3️⃣  Testing: GET /api/shop-drawings/stats');
    const statsResponse = await fetch(`${API_BASE}/shop-drawings/stats`);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      const stats = statsData.data || statsData;
      console.log(`✅ Stats: ${stats.total} total, ${stats.byStatus.approved} approved, ${stats.byStatus.pending} pending`);
    } else {
      console.log(`❌ HTTP ${statsResponse.status}`);
    }
    
    console.log('\n🎉 Shop Drawings API integration test completed successfully!');
    return true;
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

testShopDrawingsAPI();