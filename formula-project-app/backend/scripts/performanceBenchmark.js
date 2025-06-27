/**
 * Formula PM Performance Benchmark Suite
 * Comprehensive testing and benchmarking for real-time features and performance
 */

const http = require('http');
const https = require('https');
const { Client } = require('socket.io-client');
const { performance } = require('perf_hooks');

class PerformanceBenchmark {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:5014';
    this.wsUrl = options.wsUrl || 'ws://localhost:5014';
    this.concurrentUsers = options.concurrentUsers || 10;
    this.testDuration = options.testDuration || 60000; // 1 minute
    this.authToken = options.authToken || null;
    
    this.results = {
      api: {},
      websocket: {},
      database: {},
      realtime: {},
      summary: {}
    };
    
    this.clients = [];
    this.metrics = {
      requests: 0,
      responses: 0,
      errors: 0,
      totalLatency: 0,
      minLatency: Infinity,
      maxLatency: 0,
      wsConnections: 0,
      wsMessages: 0,
      wsErrors: 0
    };
  }

  /**
   * Run complete benchmark suite
   */
  async runBenchmarks() {
    try {
      console.log('🚀 Starting Formula PM Performance Benchmark Suite');
      console.log(`📊 Base URL: ${this.baseUrl}`);
      console.log(`🔌 WebSocket URL: ${this.wsUrl}`);
      console.log(`👥 Concurrent Users: ${this.concurrentUsers}`);
      console.log(`⏱️ Test Duration: ${this.testDuration}ms`);
      console.log();

      // Health check first
      await this.healthCheck();

      // API performance tests
      await this.testApiPerformance();

      // WebSocket performance tests
      await this.testWebSocketPerformance();

      // Database performance tests
      await this.testDatabasePerformance();

      // Real-time features tests
      await this.testRealtimeFeatures();

      // Load testing
      await this.loadTesting();

      // Generate report
      this.generateReport();

    } catch (error) {
      console.error('❌ Benchmark suite failed:', error);
      throw error;
    }
  }

  /**
   * Health check before testing
   */
  async healthCheck() {
    console.log('🏥 Performing health check...');
    
    try {
      const startTime = performance.now();
      const response = await this.makeRequest('/health');
      const responseTime = performance.now() - startTime;
      
      if (response.statusCode === 200) {
        console.log(`✅ Health check passed (${responseTime.toFixed(2)}ms)`);
        this.results.healthCheck = {
          status: 'passed',
          responseTime: responseTime,
          timestamp: new Date()
        };
      } else {
        throw new Error(`Health check failed with status ${response.statusCode}`);
      }
    } catch (error) {
      console.error('❌ Health check failed:', error);
      this.results.healthCheck = {
        status: 'failed',
        error: error.message,
        timestamp: new Date()
      };
      throw error;
    }
  }

  /**
   * Test API performance
   */
  async testApiPerformance() {
    console.log('📊 Testing API performance...');
    
    const endpoints = [
      { path: '/api/v1/users', method: 'GET', name: 'Users List' },
      { path: '/api/v1/projects', method: 'GET', name: 'Projects List' },
      { path: '/api/v1/tasks', method: 'GET', name: 'Tasks List' },
      { path: '/health/detailed', method: 'GET', name: 'Detailed Health' },
      { path: '/api/v1/analytics/dashboard', method: 'GET', name: 'Analytics Dashboard' }
    ];

    const apiResults = {};

    for (const endpoint of endpoints) {
      console.log(`  Testing ${endpoint.name}...`);
      
      const results = await this.benchmarkEndpoint(endpoint);
      apiResults[endpoint.name] = results;
      
      console.log(`    Avg: ${results.averageLatency.toFixed(2)}ms, Min: ${results.minLatency.toFixed(2)}ms, Max: ${results.maxLatency.toFixed(2)}ms`);
    }

    this.results.api = apiResults;
  }

  /**
   * Benchmark specific endpoint
   */
  async benchmarkEndpoint(endpoint) {
    const iterations = 10;
    const latencies = [];
    let errors = 0;

    for (let i = 0; i < iterations; i++) {
      try {
        const startTime = performance.now();
        const response = await this.makeRequest(endpoint.path, endpoint.method);
        const latency = performance.now() - startTime;
        
        if (response.statusCode < 400) {
          latencies.push(latency);
        } else {
          errors++;
        }
        
        // Small delay between requests
        await this.sleep(50);
      } catch (error) {
        errors++;
      }
    }

    return {
      iterations,
      successfulRequests: latencies.length,
      errors,
      averageLatency: latencies.length > 0 ? latencies.reduce((a, b) => a + b) / latencies.length : 0,
      minLatency: latencies.length > 0 ? Math.min(...latencies) : 0,
      maxLatency: latencies.length > 0 ? Math.max(...latencies) : 0,
      errorRate: (errors / iterations) * 100
    };
  }

  /**
   * Test WebSocket performance
   */
  async testWebSocketPerformance() {
    console.log('🔌 Testing WebSocket performance...');
    
    const connectionResults = await this.testWebSocketConnections();
    const messagingResults = await this.testWebSocketMessaging();
    
    this.results.websocket = {
      connections: connectionResults,
      messaging: messagingResults
    };
  }

  /**
   * Test WebSocket connections
   */
  async testWebSocketConnections() {
    console.log('  Testing WebSocket connections...');
    
    const connectionPromises = [];
    const connectionTimes = [];
    let successfulConnections = 0;
    let connectionErrors = 0;

    for (let i = 0; i < this.concurrentUsers; i++) {
      connectionPromises.push(this.createWebSocketConnection(i, connectionTimes));
    }

    const results = await Promise.allSettled(connectionPromises);
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        successfulConnections++;
      } else {
        connectionErrors++;
        console.error(`Connection error:`, result.reason);
      }
    });

    return {
      totalAttempts: this.concurrentUsers,
      successfulConnections,
      connectionErrors,
      averageConnectionTime: connectionTimes.length > 0 ? 
        connectionTimes.reduce((a, b) => a + b) / connectionTimes.length : 0,
      connectionRate: (successfulConnections / this.concurrentUsers) * 100
    };
  }

  /**
   * Create WebSocket connection
   */
  async createWebSocketConnection(index, connectionTimes) {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      
      const client = new Client(this.wsUrl, {
        auth: {
          token: this.authToken || 'test-token'
        },
        timeout: 5000
      });

      client.on('connect', () => {
        const connectionTime = performance.now() - startTime;
        connectionTimes.push(connectionTime);
        this.clients.push(client);
        this.metrics.wsConnections++;
        resolve(client);
      });

      client.on('connect_error', (error) => {
        this.metrics.wsErrors++;
        reject(error);
      });

      client.on('disconnect', () => {
        this.metrics.wsConnections--;
      });
    });
  }

  /**
   * Test WebSocket messaging
   */
  async testWebSocketMessaging() {
    console.log('  Testing WebSocket messaging...');
    
    if (this.clients.length === 0) {
      return { error: 'No WebSocket connections available' };
    }

    const messagingResults = {
      messagesSent: 0,
      messagesReceived: 0,
      averageLatency: 0,
      errors: 0
    };

    const latencies = [];
    const messagePromises = [];

    for (let i = 0; i < Math.min(this.clients.length, 5); i++) {
      const client = this.clients[i];
      
      messagePromises.push(new Promise((resolve) => {
        const startTime = performance.now();
        
        client.emit('ping', startTime);
        messagingResults.messagesSent++;
        
        client.on('pong', (timestamp) => {
          const latency = performance.now() - timestamp;
          latencies.push(latency);
          messagingResults.messagesReceived++;
          resolve();
        });

        // Timeout after 5 seconds
        setTimeout(() => {
          messagingResults.errors++;
          resolve();
        }, 5000);
      }));
    }

    await Promise.all(messagePromises);
    
    messagingResults.averageLatency = latencies.length > 0 ? 
      latencies.reduce((a, b) => a + b) / latencies.length : 0;

    return messagingResults;
  }

  /**
   * Test database performance
   */
  async testDatabasePerformance() {
    console.log('💾 Testing database performance...');
    
    const queries = [
      { name: 'User Count', path: '/api/v1/users?limit=1' },
      { name: 'Project Count', path: '/api/v1/projects?limit=1' },
      { name: 'Task Count', path: '/api/v1/tasks?limit=1' },
      { name: 'Complex Query', path: '/api/v1/analytics/dashboard' }
    ];

    const dbResults = {};

    for (const query of queries) {
      console.log(`  Testing ${query.name}...`);
      
      const results = await this.benchmarkEndpoint({ 
        path: query.path, 
        method: 'GET', 
        name: query.name 
      });
      
      dbResults[query.name] = results;
    }

    this.results.database = dbResults;
  }

  /**
   * Test real-time features
   */
  async testRealtimeFeatures() {
    console.log('⚡ Testing real-time features...');
    
    if (this.clients.length === 0) {
      this.results.realtime = { error: 'No WebSocket connections available' };
      return;
    }

    const realtimeTests = {
      presenceIndicators: await this.testPresenceIndicators(),
      projectRooms: await this.testProjectRooms(),
      activityFeeds: await this.testActivityFeeds(),
      collaboration: await this.testCollaboration()
    };

    this.results.realtime = realtimeTests;
  }

  /**
   * Test presence indicators
   */
  async testPresenceIndicators() {
    console.log('  Testing presence indicators...');
    
    return new Promise((resolve) => {
      if (this.clients.length === 0) {
        resolve({ error: 'No clients available' });
        return;
      }

      const client = this.clients[0];
      let receivedPresence = false;

      client.on('user_presence_changed', (data) => {
        receivedPresence = true;
        resolve({
          success: true,
          presenceData: data,
          responseTime: performance.now()
        });
      });

      // Simulate presence change
      setTimeout(() => {
        if (!receivedPresence) {
          resolve({
            success: false,
            error: 'No presence update received'
          });
        }
      }, 3000);
    });
  }

  /**
   * Test project rooms
   */
  async testProjectRooms() {
    console.log('  Testing project rooms...');
    
    return new Promise((resolve) => {
      if (this.clients.length === 0) {
        resolve({ error: 'No clients available' });
        return;
      }

      const client = this.clients[0];
      let joinedRoom = false;

      client.on('joined_project', (data) => {
        joinedRoom = true;
        resolve({
          success: true,
          projectData: data,
          responseTime: performance.now()
        });
      });

      // Try to join a test project room
      client.emit('join_project', { projectId: 'test-project-id' });

      setTimeout(() => {
        if (!joinedRoom) {
          resolve({
            success: false,
            error: 'Could not join project room'
          });
        }
      }, 3000);
    });
  }

  /**
   * Test activity feeds
   */
  async testActivityFeeds() {
    console.log('  Testing activity feeds...');
    
    return new Promise((resolve) => {
      if (this.clients.length === 0) {
        resolve({ error: 'No clients available' });
        return;
      }

      const client = this.clients[0];
      let receivedActivity = false;

      client.on('activity_update', (data) => {
        receivedActivity = true;
        resolve({
          success: true,
          activityData: data,
          responseTime: performance.now()
        });
      });

      // Simulate activity
      client.emit('activity_created', {
        projectId: 'test-project-id',
        type: 'task_updated',
        data: { message: 'Test activity' }
      });

      setTimeout(() => {
        if (!receivedActivity) {
          resolve({
            success: false,
            error: 'No activity update received'
          });
        }
      }, 3000);
    });
  }

  /**
   * Test collaboration features
   */
  async testCollaboration() {
    console.log('  Testing collaboration features...');
    
    return new Promise((resolve) => {
      if (this.clients.length < 2) {
        resolve({ error: 'Need at least 2 clients for collaboration test' });
        return;
      }

      const client1 = this.clients[0];
      const client2 = this.clients[1];
      let collaborationStarted = false;

      client2.on('collaboration_started', (data) => {
        collaborationStarted = true;
        resolve({
          success: true,
          collaborationData: data,
          responseTime: performance.now()
        });
      });

      // Start collaboration
      client1.emit('start_collaboration', {
        resourceType: 'task',
        resourceId: 'test-task-id',
        projectId: 'test-project-id'
      });

      setTimeout(() => {
        if (!collaborationStarted) {
          resolve({
            success: false,
            error: 'Collaboration not established'
          });
        }
      }, 3000);
    });
  }

  /**
   * Load testing
   */
  async loadTesting() {
    console.log('🔥 Running load testing...');
    
    const loadResults = {
      duration: this.testDuration,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageLatency: 0,
      throughput: 0
    };

    const startTime = performance.now();
    const endTime = startTime + this.testDuration;
    const latencies = [];
    
    const requestPromises = [];

    // Generate load
    while (performance.now() < endTime) {
      for (let i = 0; i < this.concurrentUsers; i++) {
        requestPromises.push(this.makeLoadTestRequest(latencies, loadResults));
      }
      
      await this.sleep(100); // 100ms between batches
    }

    // Wait for all requests to complete
    await Promise.allSettled(requestPromises);

    const actualDuration = performance.now() - startTime;
    
    loadResults.averageLatency = latencies.length > 0 ? 
      latencies.reduce((a, b) => a + b) / latencies.length : 0;
    loadResults.throughput = (loadResults.successfulRequests / actualDuration) * 1000; // requests per second

    this.results.loadTesting = loadResults;
    
    console.log(`  Completed ${loadResults.totalRequests} requests in ${actualDuration.toFixed(2)}ms`);
    console.log(`  Success rate: ${((loadResults.successfulRequests / loadResults.totalRequests) * 100).toFixed(2)}%`);
    console.log(`  Throughput: ${loadResults.throughput.toFixed(2)} req/s`);
  }

  /**
   * Make load test request
   */
  async makeLoadTestRequest(latencies, loadResults) {
    try {
      loadResults.totalRequests++;
      
      const startTime = performance.now();
      const response = await this.makeRequest('/health');
      const latency = performance.now() - startTime;
      
      if (response.statusCode < 400) {
        loadResults.successfulRequests++;
        latencies.push(latency);
      } else {
        loadResults.failedRequests++;
      }
    } catch (error) {
      loadResults.failedRequests++;
    }
  }

  /**
   * Make HTTP request
   */
  async makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const options = {
        method,
        headers: {}
      };

      if (this.authToken) {
        options.headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const req = (url.protocol === 'https:' ? https : http).request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    });
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    console.log('\n📋 Performance Benchmark Report');
    console.log('================================');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`Health Check: ${this.results.healthCheck?.status || 'N/A'}`);
    console.log(`API Tests: ${Object.keys(this.results.api || {}).length} endpoints tested`);
    console.log(`WebSocket Connections: ${this.results.websocket?.connections?.successfulConnections || 0}/${this.concurrentUsers}`);
    console.log(`Load Test Requests: ${this.results.loadTesting?.totalRequests || 0}`);
    console.log(`Load Test Success Rate: ${this.results.loadTesting ? ((this.results.loadTesting.successfulRequests / this.results.loadTesting.totalRequests) * 100).toFixed(2) : 0}%`);

    // Performance targets check
    console.log('\n🎯 Performance Targets:');
    this.checkPerformanceTargets();

    // Recommendations
    console.log('\n💡 Recommendations:');
    this.generateRecommendations();

    // Save results to file
    this.saveResults();
  }

  /**
   * Check performance targets
   */
  checkPerformanceTargets() {
    const targets = {
      apiResponseTime: 200, // ms
      wsConnectionTime: 1000, // ms
      throughput: 10, // req/s
      errorRate: 5 // %
    };

    // Check API response times
    if (this.results.api) {
      let apiPassed = true;
      for (const [endpoint, results] of Object.entries(this.results.api)) {
        const passed = results.averageLatency < targets.apiResponseTime;
        console.log(`  API ${endpoint}: ${results.averageLatency.toFixed(2)}ms ${passed ? '✅' : '❌'}`);
        if (!passed) apiPassed = false;
      }
    }

    // Check WebSocket performance
    if (this.results.websocket?.connections) {
      const wsAvgTime = this.results.websocket.connections.averageConnectionTime;
      const wsPassed = wsAvgTime < targets.wsConnectionTime;
      console.log(`  WebSocket Connection: ${wsAvgTime.toFixed(2)}ms ${wsPassed ? '✅' : '❌'}`);
    }

    // Check throughput
    if (this.results.loadTesting) {
      const throughputPassed = this.results.loadTesting.throughput > targets.throughput;
      console.log(`  Throughput: ${this.results.loadTesting.throughput.toFixed(2)} req/s ${throughputPassed ? '✅' : '❌'}`);
      
      const errorRate = (this.results.loadTesting.failedRequests / this.results.loadTesting.totalRequests) * 100;
      const errorRatePassed = errorRate < targets.errorRate;
      console.log(`  Error Rate: ${errorRate.toFixed(2)}% ${errorRatePassed ? '✅' : '❌'}`);
    }
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // API performance recommendations
    if (this.results.api) {
      for (const [endpoint, results] of Object.entries(this.results.api)) {
        if (results.averageLatency > 200) {
          recommendations.push(`Consider optimizing ${endpoint} - response time is ${results.averageLatency.toFixed(2)}ms`);
        }
        if (results.errorRate > 5) {
          recommendations.push(`Investigate errors in ${endpoint} - error rate is ${results.errorRate.toFixed(2)}%`);
        }
      }
    }

    // WebSocket recommendations
    if (this.results.websocket?.connections) {
      const connectionRate = this.results.websocket.connections.connectionRate;
      if (connectionRate < 95) {
        recommendations.push(`WebSocket connection success rate is ${connectionRate.toFixed(2)}% - investigate connection issues`);
      }
    }

    // Load testing recommendations
    if (this.results.loadTesting) {
      if (this.results.loadTesting.throughput < 10) {
        recommendations.push('Throughput is below target - consider scaling or optimization');
      }
      
      const errorRate = (this.results.loadTesting.failedRequests / this.results.loadTesting.totalRequests) * 100;
      if (errorRate > 5) {
        recommendations.push(`Error rate is ${errorRate.toFixed(2)}% - investigate server stability`);
      }
    }

    if (recommendations.length === 0) {
      console.log('  🎉 All performance targets met! System is performing well.');
    } else {
      recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }
  }

  /**
   * Save results to file
   */
  saveResults() {
    const fs = require('fs');
    const path = require('path');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `performance_report_${timestamp}.json`;
    const reportPath = path.join(process.cwd(), 'reports', filename);
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const report = {
      timestamp: new Date(),
      configuration: {
        baseUrl: this.baseUrl,
        wsUrl: this.wsUrl,
        concurrentUsers: this.concurrentUsers,
        testDuration: this.testDuration
      },
      results: this.results,
      metrics: this.metrics
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${reportPath}`);
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup connections
   */
  cleanup() {
    console.log('\n🧹 Cleaning up connections...');
    
    this.clients.forEach(client => {
      if (client.connected) {
        client.disconnect();
      }
    });
    
    this.clients = [];
    console.log('✅ Cleanup completed');
  }
}

/**
 * Run benchmark if called directly
 */
if (require.main === module) {
  const benchmark = new PerformanceBenchmark({
    baseUrl: process.env.BENCHMARK_URL || 'http://localhost:5014',
    wsUrl: process.env.BENCHMARK_WS_URL || 'http://localhost:5014',
    concurrentUsers: parseInt(process.env.CONCURRENT_USERS) || 10,
    testDuration: parseInt(process.env.TEST_DURATION) || 30000,
    authToken: process.env.TEST_AUTH_TOKEN
  });

  benchmark.runBenchmarks()
    .then(() => {
      console.log('\n✅ Benchmark suite completed successfully');
    })
    .catch(error => {
      console.error('\n❌ Benchmark suite failed:', error);
      process.exit(1);
    })
    .finally(() => {
      benchmark.cleanup();
      process.exit(0);
    });
}

module.exports = PerformanceBenchmark;