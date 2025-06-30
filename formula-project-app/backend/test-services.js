/**
 * Individual Service Testing Script
 * Use this to test each service individually to identify which one is hanging
 */

require('dotenv').config();

async function testService(ServiceClass, serviceName) {
  try {
    console.log(`\n🔬 Testing ${serviceName}...`);
    
    // Initialize database first if needed
    let prisma = null;
    if (serviceName !== 'auditService' && serviceName !== 'cacheService') {
      try {
        const databaseService = require('./services/DatabaseService');
        prisma = await databaseService.initialize();
        console.log(`✅ Database initialized for ${serviceName}`);
      } catch (error) {
        console.log(`⚠️  Database not available for ${serviceName}, continuing...`);
      }
    }
    
    const service = new ServiceClass();
    
    // Set Prisma client if service supports it
    if (prisma && typeof service.setPrismaClient === 'function') {
      console.log(`🔍 Setting Prisma client for ${serviceName}...`);
      service.setPrismaClient(prisma);
    }
    
    const startTime = Date.now();
    
    // Create timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${serviceName} test timed out after 15 seconds`));
      }, 15000);
    });
    
    // Test initialization
    await Promise.race([
      service.initialize(),
      timeoutPromise
    ]);
    
    const duration = Date.now() - startTime;
    console.log(`✅ ${serviceName} initialized successfully in ${duration}ms`);
    
    return { success: true, duration };
  } catch (error) {
    console.error(`❌ ${serviceName} failed:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runServiceTests() {
  console.log('🚀 Starting individual service tests...\n');
  
  const tests = [
    // Test in order of potential issues (most likely to hang first)
    { service: require('./services/EmailService'), name: 'EmailService' },
    { service: require('./services/BackgroundJobService'), name: 'BackgroundJobService' },
    { service: require('./services/RealtimeService'), name: 'RealtimeService' },
    { service: require('./services/CloudStorageService'), name: 'CloudStorageService' },
    { service: require('./services/cacheService'), name: 'cacheService' },
    { service: require('./services/ProjectService'), name: 'ProjectService' },
    { service: require('./services/WorkflowEngine'), name: 'WorkflowEngine' },
    { service: require('./services/NotificationService'), name: 'NotificationService' },
    { service: require('./services/MentionService'), name: 'MentionService' },
    { service: require('./services/SearchService'), name: 'SearchService' },
    { service: require('./services/AnalyticsService'), name: 'AnalyticsService' },
    { service: require('./services/ReportGenerator'), name: 'ReportGenerator' },
    { service: require('./services/PerformanceMonitoringService'), name: 'PerformanceMonitoringService' }
  ];
  
  const results = [];
  
  for (const { service: ServiceClass, name } of tests) {
    try {
      const result = await testService(ServiceClass, name);
      results.push({ name, ...result });
    } catch (error) {
      console.error(`💥 Failed to load ${name}:`, error.message);
      results.push({ name, success: false, error: `Failed to load: ${error.message}` });
    }
  }
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('=' .repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  successful.forEach(r => {
    console.log(`   ${r.name}: ${r.duration}ms`);
  });
  
  console.log(`❌ Failed: ${failed.length}`);
  failed.forEach(r => {
    console.log(`   ${r.name}: ${r.error}`);
  });
  
  if (failed.length > 0) {
    console.log('\n🎯 Recommendations:');
    failed.forEach(r => {
      console.log(`- Disable ${r.name} with environment variable or fix the underlying issue`);
    });
  }
  
  process.exit(0);
}

// Run tests
runServiceTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});