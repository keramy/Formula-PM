#!/usr/bin/env node

/**
 * Formula PM Service Initialization Script
 * Initializes all backend services in the correct order
 */

const ServiceRegistry = require('../services/ServiceRegistry');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initializeServices() {
  try {
    console.log('🚀 Starting Formula PM service initialization...');
    console.log('📅 Started at:', new Date().toISOString());
    
    // Initialize all services through the registry
    await ServiceRegistry.initializeServices();
    
    // Perform health check
    console.log('\n🏥 Performing initial health check...');
    const health = await ServiceRegistry.performHealthCheck();
    
    console.log(`\n✅ Health Check Results:`);
    console.log(`   Overall Status: ${health.status}`);
    console.log(`   Healthy Services: ${health.healthyServices}/${health.totalServices}`);
    console.log(`   Response Time: ${health.responseTime}ms`);
    
    if (health.status === 'degraded') {
      console.log('\n⚠️  Some services are not healthy:');
      Object.entries(health.services).forEach(([name, result]) => {
        if (result.status !== 'operational') {
          console.log(`   - ${name}: ${result.status} (${result.error || 'Unknown error'})`);
        }
      });
    }
    
    // Get service metrics
    const metrics = await ServiceRegistry.getServiceMetrics();
    console.log(`\n📊 Service Metrics:`);
    console.log(`   Registered Services: ${metrics.registeredServices}`);
    console.log(`   Initialized Services: ${metrics.initializedServices}`);
    console.log(`   Health Checks Enabled: ${metrics.healthChecksEnabled}`);
    
    console.log('\n🎉 Formula PM services initialized successfully!');
    console.log('📋 Available services:');
    ServiceRegistry.getServiceNames().forEach(name => {
      console.log(`   ✓ ${name}`);
    });
    
    console.log('\n🌐 API endpoints now available at:');
    console.log(`   Health: GET /api/system/health`);
    console.log(`   Status: GET /api/status`);
    console.log(`   Documentation: GET /api/docs`);
    console.log(`   Search: GET /api/search/global?q=<query>`);
    console.log(`   Analytics: GET /api/analytics/dashboard`);
    console.log(`   Reports: POST /api/reports/project-summary/:projectId`);
    console.log(`   Notifications: GET /api/notifications`);
    console.log(`   Mentions: GET /api/mentions/search?q=<query>`);
    
    return true;
  } catch (error) {
    console.error('\n❌ Service initialization failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Received SIGINT, shutting down gracefully...');
  try {
    await ServiceRegistry.shutdown();
    console.log('✅ Services shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Received SIGTERM, shutting down gracefully...');
  try {
    await ServiceRegistry.shutdown();
    console.log('✅ Services shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeServices()
    .then(() => {
      console.log('\n📝 Note: This script initializes services but does not start the server.');
      console.log('   To start the server, run: npm start');
      console.log('   To run in development mode: npm run dev');
    })
    .catch((error) => {
      console.error('Initialization script failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeServices };