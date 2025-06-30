/**
 * Test Runner for Enhanced Server
 * Starts the enhanced server on port 5015 and runs comprehensive tests
 */

const { spawn } = require('child_process');
const { runTests } = require('./test-enhanced-server');

// Modify the enhanced server to use port 5015 for testing
const fs = require('fs');
const path = require('path');

async function startTestServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting enhanced server for testing...');
    
    // Create a modified version for testing
    const serverContent = fs.readFileSync('enhanced-server.js', 'utf8');
    const testServerContent = serverContent.replace(
      'const PORT = process.env.PORT || 5014;',
      'const PORT = process.env.PORT || 5015;'
    );
    
    fs.writeFileSync('enhanced-server-test.js', testServerContent);
    
    const serverProcess = spawn('node', ['enhanced-server-test.js'], {
      stdio: 'pipe'
    });
    
    let serverReady = false;
    
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      if (output.includes('Enhanced server running on port 5015') && !serverReady) {
        serverReady = true;
        setTimeout(() => resolve(serverProcess), 2000); // Wait 2 seconds for full startup
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });
    
    serverProcess.on('close', (code) => {
      if (!serverReady) {
        reject(new Error(`Server failed to start, exit code: ${code}`));
      }
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (!serverReady) {
        serverProcess.kill();
        reject(new Error('Server startup timeout'));
      }
    }, 10000);
  });
}

async function runTestSuite() {
  let serverProcess = null;
  
  try {
    // Start the test server
    serverProcess = await startTestServer();
    
    console.log('\n🧪 Running test suite...\n');
    
    // Run the tests
    const score = await runTests();
    
    console.log('\n✅ Test suite completed successfully!');
    console.log(`🎯 Final Score: ${score}/100`);
    
    return score;
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    return 0;
  } finally {
    // Clean up
    if (serverProcess) {
      console.log('\n🔄 Shutting down test server...');
      serverProcess.kill();
    }
    
    // Remove test server file
    try {
      fs.unlinkSync('enhanced-server-test.js');
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runTestSuite()
    .then(score => {
      process.exit(score >= 90 ? 0 : 1); // Exit with error if score < 90
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runTestSuite };