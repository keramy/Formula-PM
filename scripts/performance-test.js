const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Performance testing script for Formula PM
 * Runs automated performance tests and generates reports
 */

async function performanceTest() {
  console.log('🚀 Starting Formula PM Performance Test...');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set up performance monitoring
    await page.evaluateOnNewDocument(() => {
      window.performanceMetrics = [];
      
      // Override console.log to capture performance logs
      const originalLog = console.log;
      console.log = (...args) => {
        if (args[0] && args[0].includes('⏱️')) {
          window.performanceMetrics.push(args.join(' '));
        }
        originalLog.apply(console, args);
      };
    });
    
    // Start performance tracing
    await page.tracing.start({ 
      path: path.join(__dirname, '../reports/trace.json'),
      screenshots: true 
    });
    
    console.log('📊 Navigating to application...');
    
    // Navigate to app and measure load time
    const startTime = Date.now();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    
    console.log(`⏱️ Initial load time: ${loadTime}ms`);
    
    // Wait for React to render
    await page.waitForSelector('[data-testid="app-loaded"], .MuiTab-root', { timeout: 30000 });
    
    // Test navigation performance
    console.log('🧭 Testing navigation performance...');
    const navStartTime = Date.now();
    
    // Click on Projects tab
    await page.click('button[role="tab"]:nth-child(2)');
    await page.waitForTimeout(1000);
    
    // Click on Tasks tab
    await page.click('button[role="tab"]:nth-child(4)');
    await page.waitForTimeout(1000);
    
    // Click on Team tab
    await page.click('button[role="tab"]:nth-child(5)');
    await page.waitForTimeout(1000);
    
    const navTime = Date.now() - navStartTime;
    console.log(`🧭 Navigation test completed: ${navTime}ms`);
    
    // Test search performance
    console.log('🔍 Testing search performance...');
    const searchInput = await page.$('input[placeholder*="Search"], input[type="search"]');
    if (searchInput) {
      const searchStartTime = Date.now();
      await searchInput.type('project');
      await page.waitForTimeout(500);
      const searchTime = Date.now() - searchStartTime;
      console.log(`🔍 Search test completed: ${searchTime}ms`);
    }
    
    // Collect performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paintEntries = performance.getEntriesByType('paint');
      
      return {
        navigation: {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          responseTime: navigation.responseEnd - navigation.responseStart,
        },
        paint: paintEntries.reduce((acc, entry) => {
          acc[entry.name] = entry.startTime;
          return acc;
        }, {}),
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        } : null,
        customMetrics: window.performanceMetrics || []
      };
    });
    
    // Stop tracing
    await page.tracing.stop();
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      loadTime,
      navigationTime: navTime,
      performanceMetrics,
      thresholds: {
        loadTime: { target: 5000, achieved: loadTime < 5000 },
        navigation: { target: 1000, achieved: navTime < 1000 },
        memory: performanceMetrics.memory ? {
          target: 100,
          achieved: performanceMetrics.memory.used < 100
        } : null
      }
    };
    
    // Save report
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const reportPath = path.join(reportsDir, `performance-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate summary
    console.log('\n📋 Performance Test Summary:');
    console.log('================================');
    console.log(`📊 Load Time: ${loadTime}ms ${loadTime < 5000 ? '✅' : '⚠️'} (target: <5000ms)`);
    console.log(`🧭 Navigation: ${navTime}ms ${navTime < 1000 ? '✅' : '⚠️'} (target: <1000ms)`);
    
    if (performanceMetrics.memory) {
      console.log(`🧠 Memory Usage: ${performanceMetrics.memory.used}MB ${performanceMetrics.memory.used < 100 ? '✅' : '⚠️'} (target: <100MB)`);
    }
    
    if (performanceMetrics.paint['first-contentful-paint']) {
      const fcp = performanceMetrics.paint['first-contentful-paint'];
      console.log(`🎨 First Contentful Paint: ${fcp.toFixed(0)}ms ${fcp < 2000 ? '✅' : '⚠️'} (target: <2000ms)`);
    }
    
    console.log(`\n📄 Report saved: ${reportPath}`);
    console.log(`📊 Trace saved: ${path.join(__dirname, '../reports/trace.json')}`);
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
if (require.main === module) {
  performanceTest()
    .then(() => {
      console.log('✅ Performance test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Performance test failed:', error);
      process.exit(1);
    });
}

module.exports = performanceTest;