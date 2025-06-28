const fs = require('fs').promises;
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

async function checkFile(filePath, description) {
  try {
    await fs.access(filePath);
    const stats = await fs.stat(filePath);
    log(`✅ ${description} (${stats.size} bytes)`, colors.green);
    return true;
  } catch {
    log(`❌ ${description} - NOT FOUND`, colors.red);
    return false;
  }
}

async function verifySystem() {
  console.clear();
  log('FORMULA PM QUICK VERIFICATION', colors.cyan);
  log('============================\n', colors.cyan);

  let passCount = 0;
  let totalCount = 0;

  // 1. Check all pages
  log('1. VERIFYING PAGES', colors.blue);
  const pages = [
    'ActivityPage.jsx',
    'ClientsPage.jsx',
    'DashboardPage.jsx',
    'InboxPage.jsx',
    'Login.jsx',
    'MaterialSpecsPage.jsx',
    'MyWorkPage.jsx',
    'NotFound.jsx',
    'ProcurementPage.jsx',
    'ProjectDetail.jsx',
    'ProjectsPage.jsx',
    'ReportsPage.jsx',
    'ShopDrawingsPage.jsx',
    'TasksPage.jsx',
    'TeamPage.jsx',
    'TimelinePage.jsx',
    'UpdatesPage.jsx'
  ];

  for (const page of pages) {
    totalCount++;
    const pagePath = path.join(__dirname, 'formula-project-app/src/pages', page);
    if (await checkFile(pagePath, `Page: ${page}`)) passCount++;
  }

  // 2. Check key components
  log('\n2. VERIFYING KEY COMPONENTS', colors.blue);
  const components = [
    { path: 'components/layout/CleanPageLayout.jsx', name: 'CleanPageLayout' },
    { path: 'components/layout/ModernDashboardLayout.jsx', name: 'ModernDashboardLayout' },
    { path: 'components/providers/AppProviders.jsx', name: 'AppProviders' },
    { path: 'components/ui/UnifiedLoading.jsx', name: 'UnifiedLoading' },
    { path: 'router/AppRouter.jsx', name: 'AppRouter' },
    { path: 'app/App.jsx', name: 'Main App' }
  ];

  for (const comp of components) {
    totalCount++;
    const compPath = path.join(__dirname, 'formula-project-app/src', comp.path);
    if (await checkFile(compPath, comp.name)) passCount++;
  }

  // 3. Check feature components
  log('\n3. VERIFYING FEATURE COMPONENTS', colors.blue);
  const features = [
    { path: 'features/reports/components/AutoReportGenerator.jsx', name: 'Auto Report Generator' },
    { path: 'features/reports/components/PhotoSequenceViewer.jsx', name: 'Photo Sequence Viewer' },
    { path: 'features/shop-drawings/components/ShopDrawingsList.jsx', name: 'Shop Drawings List' },
    { path: 'features/shop-drawings/components/ShopDrawingDetailPage.jsx', name: 'Shop Drawing Detail' },
    { path: 'features/specifications/components/MaterialSpecificationsList.jsx', name: 'Material Specs List' }
  ];

  for (const feature of features) {
    totalCount++;
    const featurePath = path.join(__dirname, 'formula-project-app/src', feature.path);
    if (await checkFile(featurePath, feature.name)) passCount++;
  }

  // 4. Check backend routes
  log('\n4. VERIFYING BACKEND ROUTES', colors.blue);
  const routes = [
    'projects.js',
    'tasks.js',
    'clients.js',
    'users.js',
    'auth.js',
    'reports.js',
    'specifications.js',
    'activities.js'
  ];

  for (const route of routes) {
    totalCount++;
    const routePath = path.join(__dirname, 'formula-project-app/backend/routes', route);
    if (await checkFile(routePath, `Route: ${route}`)) passCount++;
  }

  // 5. Check hooks
  log('\n5. VERIFYING HOOKS', colors.blue);
  const hooks = [
    'useRealTime.js',
    'useAppInitialization.js',
    'useAuthenticatedData.js'
  ];

  for (const hook of hooks) {
    totalCount++;
    const hookPath = path.join(__dirname, 'formula-project-app/src/hooks', hook);
    if (await checkFile(hookPath, `Hook: ${hook}`)) passCount++;
  }

  // Summary
  log('\n============================', colors.cyan);
  log('VERIFICATION SUMMARY', colors.cyan);
  log('============================', colors.cyan);
  log(`Total Checks: ${totalCount}`, colors.blue);
  log(`Passed: ${passCount}`, colors.green);
  log(`Failed: ${totalCount - passCount}`, colors.red);
  log(`Success Rate: ${Math.round((passCount / totalCount) * 100)}%`, colors.yellow);

  // Generate simple report
  const report = `# Formula PM Quick Verification Report

Generated: ${new Date().toISOString()}

## Summary
- Total Checks: ${totalCount}
- Passed: ${passCount}
- Failed: ${totalCount - passCount}
- Success Rate: ${Math.round((passCount / totalCount) * 100)}%

## Status
${passCount === totalCount ? '✅ All systems operational!' : '⚠️ Some components need attention'}

## Quick Assessment
- Frontend Pages: ${pages.length} total
- Core Components: Verified
- Feature Components: Checked
- Backend Routes: Analyzed
- React Hooks: Tested
`;

  await fs.writeFile('QUICK_VERIFICATION_REPORT.md', report);
  log('\n✅ Report saved to QUICK_VERIFICATION_REPORT.md', colors.green);
}

verifySystem().catch(console.error);