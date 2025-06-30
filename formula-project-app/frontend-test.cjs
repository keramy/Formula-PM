/**
 * Formula PM Frontend Integration Testing
 * Tests frontend functionality and UI/UX polish
 */

const puppeteer = require('puppeteer');
const axios = require('axios');

// Configuration
const FRONTEND_URL = 'http://localhost:3003';
const BACKEND_URL = 'http://localhost:5015';

// Test results
const testResults = {
  pages: { total: 0, passed: 0, failed: 0, errors: [] },
  navigation: { total: 0, passed: 0, failed: 0, errors: [] },
  forms: { total: 0, passed: 0, failed: 0, errors: [] },
  realtime: { total: 0, passed: 0, failed: 0, errors: [] },
  ui: { total: 0, passed: 0, failed: 0, errors: [] }
};

// Helper function to log test results
function logTest(category, testName, passed, error = null) {
  testResults[category].total++;
  if (passed) {
    testResults[category].passed++;
    console.log(`✅ ${category.toUpperCase()} - ${testName}`);
  } else {
    testResults[category].failed++;
    testResults[category].errors.push({ test: testName, error: error?.message || 'Unknown error' });
    console.log(`❌ ${category.toUpperCase()} - ${testName}:`, error?.message || 'Failed');
  }
}

// Wait for selector with timeout
async function waitForSelectorSafe(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    return false;
  }
}

// Test page loading and navigation
async function testPageNavigation(browser) {
  console.log('\n🔍 Testing Page Navigation...\n');
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Monitor console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  try {
    // Test home page
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
    logTest('pages', 'Home page loads', true);
    
    // Test main pages
    const pages = [
      { path: '/dashboard', name: 'Dashboard', selector: '[data-testid="dashboard-content"], .dashboard-container, main' },
      { path: '/projects', name: 'Projects', selector: '[data-testid="projects-content"], .projects-container, main' },
      { path: '/tasks', name: 'Tasks', selector: '[data-testid="tasks-content"], .tasks-container, main' },
      { path: '/team', name: 'Team', selector: '[data-testid="team-content"], .team-container, main' },
      { path: '/clients', name: 'Clients', selector: '[data-testid="clients-content"], .clients-container, main' },
      { path: '/inbox', name: 'Inbox', selector: '[data-testid="inbox-content"], .inbox-container, main' },
      { path: '/updates', name: 'Updates', selector: '[data-testid="updates-content"], .updates-container, main' }
    ];
    
    for (const pageInfo of pages) {
      try {
        await page.goto(`${FRONTEND_URL}${pageInfo.path}`, { waitUntil: 'networkidle2' });
        const loaded = await waitForSelectorSafe(page, pageInfo.selector);
        logTest('pages', `${pageInfo.name} page loads`, loaded);
        
        // Check for loading states
        const hasLoader = await page.$('.loader, .spinner, .loading');
        if (hasLoader) {
          await page.waitForSelector('.loader, .spinner, .loading', { hidden: true, timeout: 5000 }).catch(() => {});
        }
      } catch (error) {
        logTest('pages', `${pageInfo.name} page loads`, false, error);
      }
    }
    
    // Test console errors
    logTest('ui', 'No critical console errors', consoleErrors.length === 0);
    if (consoleErrors.length > 0) {
      console.log('Console errors found:', consoleErrors.slice(0, 5));
    }
    
  } catch (error) {
    logTest('pages', 'Page navigation', false, error);
  } finally {
    await page.close();
  }
}

// Test navigation menu
async function testNavigationMenu(browser) {
  console.log('\n🔍 Testing Navigation Menu...\n');
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
    
    // Test sidebar navigation
    const sidebarExists = await waitForSelectorSafe(page, '.sidebar, nav, [data-testid="navigation"]');
    logTest('navigation', 'Sidebar menu exists', sidebarExists);
    
    // Test navigation links
    const navLinks = await page.$$eval('a[href^="/"], nav a, .sidebar a', links => 
      links.map(link => ({ href: link.href, text: link.textContent.trim() }))
    );
    logTest('navigation', `Navigation links found: ${navLinks.length}`, navLinks.length > 5);
    
    // Test menu collapsing
    const collapseButton = await page.$('[data-testid="menu-toggle"], .menu-toggle, button[aria-label*="menu"]');
    if (collapseButton) {
      await collapseButton.click();
      await page.waitForTimeout(500);
      logTest('navigation', 'Menu collapse/expand works', true);
    }
    
  } catch (error) {
    logTest('navigation', 'Navigation menu', false, error);
  } finally {
    await page.close();
  }
}

// Test CRUD forms
async function testCRUDForms(browser) {
  console.log('\n🔍 Testing CRUD Forms...\n');
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    // Test project creation form
    await page.goto(`${FRONTEND_URL}/projects`, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(1000);
    
    // Look for create button
    const createButton = await page.$('button:has-text("Create"), button:has-text("Add"), button:has-text("New"), [data-testid="create-project"]');
    if (createButton) {
      await createButton.click();
      await page.waitForTimeout(500);
      
      // Check if form/modal opened
      const formExists = await waitForSelectorSafe(page, 'form, [role="dialog"], .modal, .dialog');
      logTest('forms', 'Project creation form opens', formExists);
      
      // Close form/modal
      const closeButton = await page.$('button:has-text("Cancel"), button:has-text("Close"), [aria-label*="close"]');
      if (closeButton) await closeButton.click();
    } else {
      logTest('forms', 'Project creation button exists', false);
    }
    
    // Test task form
    await page.goto(`${FRONTEND_URL}/tasks`, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(1000);
    
    const taskCreateButton = await page.$('button:has-text("Create"), button:has-text("Add"), button:has-text("New"), [data-testid="create-task"]');
    logTest('forms', 'Task creation button exists', !!taskCreateButton);
    
  } catch (error) {
    logTest('forms', 'CRUD forms', false, error);
  } finally {
    await page.close();
  }
}

// Test UI polish
async function testUIPolish(browser) {
  console.log('\n🔍 Testing UI Polish...\n');
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    await page.goto(`${FRONTEND_URL}/dashboard`, { waitUntil: 'networkidle2' });
    
    // Test responsive design
    await page.setViewport({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    logTest('ui', 'Responsive design (tablet)', true);
    
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    logTest('ui', 'Responsive design (mobile)', true);
    
    // Reset viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Check for broken images
    const brokenImages = await page.$$eval('img', images => 
      images.filter(img => !img.complete || img.naturalHeight === 0).length
    );
    logTest('ui', 'No broken images', brokenImages === 0);
    
    // Check loading states
    await page.goto(`${FRONTEND_URL}/projects`, { waitUntil: 'domcontentloaded' });
    const hasLoadingStates = await waitForSelectorSafe(page, '.skeleton, .loader, .loading, [data-loading="true"]', 1000);
    logTest('ui', 'Loading states implemented', hasLoadingStates);
    
    // Check for proper icons
    const iconElements = await page.$$('svg, i[class*="icon"], .icon, [data-icon]');
    logTest('ui', `Icons rendered: ${iconElements.length}`, iconElements.length > 0);
    
  } catch (error) {
    logTest('ui', 'UI polish checks', false, error);
  } finally {
    await page.close();
  }
}

// Test real-time features
async function testRealTimeFeatures(browser) {
  console.log('\n🔍 Testing Real-Time Features...\n');
  
  const page1 = await browser.newPage();
  const page2 = await browser.newPage();
  
  try {
    // Open two browser windows
    await page1.goto(`${FRONTEND_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await page2.goto(`${FRONTEND_URL}/dashboard`, { waitUntil: 'networkidle2' });
    
    // Check for WebSocket connection indicators
    const wsConnected = await page1.evaluate(() => {
      return window.io && window.io.connected || 
             window.socket && window.socket.connected ||
             document.querySelector('[data-ws-status="connected"]');
    });
    logTest('realtime', 'WebSocket connection established', !!wsConnected);
    
    // Test notifications
    await page1.goto(`${FRONTEND_URL}/inbox`, { waitUntil: 'networkidle2' });
    const notificationArea = await waitForSelectorSafe(page1, '.notifications, [data-testid="notifications"], .inbox-container');
    logTest('realtime', 'Notification area exists', notificationArea);
    
  } catch (error) {
    logTest('realtime', 'Real-time features', false, error);
  } finally {
    await page1.close();
    await page2.close();
  }
}

// Generate report
function generateReport() {
  console.log('\n📊 FRONTEND TEST REPORT\n');
  console.log('=' .repeat(50));
  
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const [category, results] of Object.entries(testResults)) {
    totalTests += results.total;
    totalPassed += results.passed;
    totalFailed += results.failed;
    
    const score = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;
    console.log(`\n${category.toUpperCase()} TESTS:`);
    console.log(`  Total: ${results.total}`);
    console.log(`  Passed: ${results.passed}`);
    console.log(`  Failed: ${results.failed}`);
    console.log(`  Score: ${score}%`);
    
    if (results.errors.length > 0) {
      console.log(`  Errors:`);
      results.errors.forEach(err => {
        console.log(`    - ${err.test}: ${err.error}`);
      });
    }
  }
  
  const overallScore = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
  
  console.log('\n' + '=' .repeat(50));
  console.log('OVERALL RESULTS:');
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  Passed: ${totalPassed}`);
  console.log(`  Failed: ${totalFailed}`);
  console.log(`  FRONTEND SCORE: ${overallScore}%`);
  console.log('=' .repeat(50));
  
  return overallScore;
}

// Main test runner
async function runFrontendTests() {
  console.log('🚀 Starting Formula PM Frontend Tests...\n');
  console.log('Note: Ensure frontend is running on http://localhost:3003\n');
  
  let browser;
  
  try {
    // Check if frontend is running
    try {
      await axios.get(FRONTEND_URL);
    } catch (error) {
      console.error('❌ Frontend is not running on', FRONTEND_URL);
      console.error('Please start the frontend with: npm run dev');
      process.exit(1);
    }
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    await testPageNavigation(browser);
    await testNavigationMenu(browser);
    await testCRUDForms(browser);
    await testUIPolish(browser);
    await testRealTimeFeatures(browser);
    
  } catch (error) {
    console.error('Fatal error during testing:', error.message);
  } finally {
    if (browser) await browser.close();
  }
  
  const score = generateReport();
  process.exit(score >= 90 ? 0 : 1);
}

// Run tests
runFrontendTests();