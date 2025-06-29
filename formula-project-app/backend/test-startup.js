/**
 * Test script to verify backend startup improvements
 */

const ServiceRegistry = require('./services/ServiceRegistry');

async function testStartup() {
  console.log('=== Testing Backend Service Startup ===\n');
  
  const startTime = Date.now();
  
  try {
    console.log('Starting service initialization...');
    
    // Initialize services
    await ServiceRegistry.initializeServices();
    
    const duration = Date.now() - startTime;
    console.log(`\n✅ Service initialization completed in ${duration}ms`);
    
    // Get service info
    const info = ServiceRegistry.getServiceInfo();
    console.log('\n📊 Service Status:');
    console.log(`- Total services: ${Object.keys(info.services).length}`);
    console.log(`- Failed services: ${info.failedServices.length}`);
    console.log(`- Initialization time: ${duration}ms`);
    
    if (info.failedServices.length > 0) {
      console.log('\n⚠️  Failed services:', info.failedServices);
    }
    
    // Check individual service status
    console.log('\n📋 Service Details:');
    for (const [name, service] of Object.entries(info.services)) {
      const status = service.failed ? '❌ Failed' : '✅ Success';
      console.log(`- ${name}: ${status}`);
    }
    
    // Perform health check
    console.log('\n🏥 Performing health check...');
    const health = await ServiceRegistry.performHealthCheck();
    console.log(`- Overall health: ${health.status}`);
    console.log(`- Healthy services: ${health.healthyServices}/${health.totalServices}`);
    
    // Check if target time was met
    if (duration < 30000) {
      console.log('\n🎉 SUCCESS: Backend starts in less than 30 seconds!');
    } else {
      console.log('\n⚠️  WARNING: Backend took longer than 30 seconds to start');
    }
    
    // Shutdown services
    console.log('\n🔄 Shutting down services...');
    await ServiceRegistry.shutdown();
    console.log('✅ Shutdown complete');
    
    process.exit(0);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`\n❌ FAILED: Service initialization failed after ${duration}ms`);
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the test
testStartup();