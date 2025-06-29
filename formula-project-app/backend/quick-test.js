const express = require('express');

console.log('🚀 Testing basic server startup...');

// Test basic Express setup
const app = express();
app.use(express.json());

// Simple health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server with timeout
const server = app.listen(5015, () => {
  console.log('✅ Basic server running on port 5015');
  console.log('Test: curl http://localhost:5015/api/health');
  
  // Auto-shutdown after 5 seconds for testing
  setTimeout(() => {
    console.log('🛑 Shutting down test server...');
    server.close();
    process.exit(0);
  }, 5000);
});

// Error handling
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});