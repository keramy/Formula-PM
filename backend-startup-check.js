#!/usr/bin/env node

/**
 * Backend Startup and Database Connectivity Check
 * Verifies backend prerequisites before full API testing
 */

const { spawn } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

// Check database connectivity first
const checkDatabaseConnection = async () => {
  console.log('🔍 Checking PostgreSQL database connectivity...');
  
  try {
    // Try to connect to the database using psql
    const { stdout, stderr } = await exec('psql "postgresql://formula_pm_user:formula_pm_password@localhost:5432/formula_pm_dev" -c "SELECT 1;" 2>&1');
    
    if (stdout.includes('1')) {
      console.log('✅ PostgreSQL database is accessible');
      return true;
    } else {
      console.log('❌ PostgreSQL database connection failed:');
      console.log(stderr || stdout);
      return false;
    }
  } catch (error) {
    console.log('❌ PostgreSQL database connection error:');
    console.log(error.message);
    
    // Check if PostgreSQL is running
    try {
      await exec('systemctl status postgresql 2>/dev/null || service postgresql status 2>/dev/null');
      console.log('ℹ️ PostgreSQL service appears to be running');
    } catch (serviceError) {
      console.log('⚠️ PostgreSQL service may not be running');
    }
    
    return false;
  }
};

// Check Redis connectivity
const checkRedisConnection = async () => {
  console.log('🔍 Checking Redis connectivity...');
  
  try {
    const { stdout, stderr } = await exec('redis-cli ping 2>&1');
    
    if (stdout.trim() === 'PONG') {
      console.log('✅ Redis is accessible');
      return true;
    } else {
      console.log('❌ Redis connection failed:');
      console.log(stderr || stdout);
      return false;
    }
  } catch (error) {
    console.log('❌ Redis connection error:');
    console.log(error.message);
    console.log('ℹ️ Redis is optional for basic functionality');
    return false;
  }
};

// Start backend in development mode for testing
const startBackendForTesting = async (backendPath) => {
  console.log(`🚀 Starting backend server at ${backendPath}...`);
  
  return new Promise((resolve, reject) => {
    const serverProcess = spawn('node', ['server.js'], {
      cwd: backendPath,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'development' }
    });
    
    let serverStarted = false;
    let startupTimeout;
    
    // Set timeout for server startup
    startupTimeout = setTimeout(() => {
      if (!serverStarted) {
        console.log('⏰ Server startup timeout (30s)');
        serverProcess.kill();
        reject(new Error('Server startup timeout'));
      }
    }, 30000);
    
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[SERVER] ${output.trim()}`);
      
      // Check for successful startup indicators
      if (output.includes('Server running on port') || output.includes('✅ Server running')) {
        console.log('✅ Backend server started successfully');
        clearTimeout(startupTimeout);
        serverStarted = true;
        resolve(serverProcess);
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      const output = data.toString();
      console.log(`[SERVER ERROR] ${output.trim()}`);
      
      // Check for critical errors
      if (output.includes('EADDRINUSE')) {
        console.log('❌ Port already in use');
        clearTimeout(startupTimeout);
        reject(new Error('Port already in use'));
      } else if (output.includes('database') && output.includes('connect')) {
        console.log('❌ Database connection error during startup');
      }
    });
    
    serverProcess.on('error', (error) => {
      console.log('❌ Server process error:', error.message);
      clearTimeout(startupTimeout);
      reject(error);
    });
    
    serverProcess.on('exit', (code) => {
      clearTimeout(startupTimeout);
      if (!serverStarted) {
        console.log(`❌ Server exited with code ${code} before successful startup`);
        reject(new Error(`Server exited with code ${code}`));
      }
    });
  });
};

// Test basic API connectivity
const testBasicConnectivity = async (baseUrl = 'http://localhost:5014') => {
  console.log('🧪 Testing basic API connectivity...');
  
  // Import fetch dynamically
  const fetch = (await import('node-fetch')).default;
  
  try {
    const response = await fetch(`${baseUrl}/health`, { timeout: 5000 });
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Basic API connectivity successful');
      console.log(`📊 Health Status: ${data.database || 'unknown'}`);
      return true;
    } else {
      console.log(`❌ API returned error status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ API connectivity test failed:', error.message);
    return false;
  }
};

// Try to start the simple backend if advanced backend fails
const trySimpleBackend = async () => {
  console.log('🔄 Attempting to start simple file-based backend...');
  
  const simpleBackendPath = '/mnt/c/Users/Kerem/Desktop/formula-pm/formula-backend';
  
  if (fs.existsSync(path.join(simpleBackendPath, 'server.js'))) {
    try {
      const serverProcess = await startBackendForTesting(simpleBackendPath);
      
      // Wait a moment for server to fully start
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Test connectivity
      const isConnected = await testBasicConnectivity();
      
      if (isConnected) {
        console.log('✅ Simple backend is running and accessible');
        return { success: true, process: serverProcess, type: 'simple' };
      } else {
        console.log('❌ Simple backend started but not accessible');
        serverProcess.kill();
        return { success: false };
      }
    } catch (error) {
      console.log('❌ Failed to start simple backend:', error.message);
      return { success: false };
    }
  } else {
    console.log('❌ Simple backend not found');
    return { success: false };
  }
};

// Main execution
const main = async () => {
  console.log('🧪 Formula PM Backend Startup and Connectivity Check');
  console.log('='.repeat(60));
  
  // Check prerequisites
  const dbConnected = await checkDatabaseConnection();
  const redisConnected = await checkRedisConnection();
  
  console.log('\n📊 Prerequisites Summary:');
  console.log(`   Database (PostgreSQL): ${dbConnected ? '✅' : '❌'}`);
  console.log(`   Cache (Redis): ${redisConnected ? '✅' : '⚠️ Optional'}`);
  
  // Try to start advanced backend first
  const advancedBackendPath = '/mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app/backend';
  
  if (dbConnected) {
    console.log('\n🚀 Attempting to start advanced backend (Prisma + PostgreSQL)...');
    
    try {
      const serverProcess = await startBackendForTesting(advancedBackendPath);
      
      // Wait for full startup
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const isConnected = await testBasicConnectivity();
      
      if (isConnected) {
        console.log('\n✅ SUCCESS: Advanced backend is running and functional');
        console.log('🌐 API available at: http://localhost:5014');
        console.log('📋 Health check: http://localhost:5014/health');
        console.log('📖 Documentation: http://localhost:5014/api/docs');
        
        // Keep server running for testing
        console.log('\n⏱️ Server will run for 2 minutes for testing...');
        setTimeout(() => {
          console.log('\n🛑 Stopping server...');
          serverProcess.kill();
          process.exit(0);
        }, 120000); // 2 minutes
        
        return;
      } else {
        console.log('❌ Advanced backend started but not responding correctly');
        serverProcess.kill();
      }
    } catch (error) {
      console.log('❌ Advanced backend startup failed:', error.message);
    }
  }
  
  // Fallback to simple backend
  console.log('\n🔄 Falling back to simple file-based backend...');
  const simpleResult = await trySimpleBackend();
  
  if (simpleResult.success) {
    console.log('\n✅ SUCCESS: Simple backend is running');
    console.log('🌐 API available at: http://localhost:5014');
    console.log('📋 Health check: http://localhost:5014/api/health');
    
    console.log('\n⏱️ Server will run for 2 minutes for testing...');
    setTimeout(() => {
      console.log('\n🛑 Stopping server...');
      simpleResult.process.kill();
      process.exit(0);
    }, 120000);
  } else {
    console.log('\n❌ FAILURE: Unable to start any backend server');
    console.log('\n🔧 Recommended Actions:');
    console.log('   1. Install and start PostgreSQL service');
    console.log('   2. Create database: formula_pm_dev');
    console.log('   3. Run: cd formula-project-app/backend && npm run db:migrate');
    console.log('   4. Check environment configuration (.env file)');
    process.exit(1);
  }
};

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { checkDatabaseConnection, checkRedisConnection, startBackendForTesting };