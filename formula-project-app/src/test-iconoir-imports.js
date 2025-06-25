// Test script to verify Iconoir icon imports
console.log('🔍 Testing Iconoir icon imports...');

try {
  // Test basic icons that should definitely exist
  const basicIcons = require('iconoir-react');
  
  const testIconNames = [
    'Home', 'Search', 'Menu', 'Settings', 'User', 'Plus', 
    'Edit', 'Delete', 'Save', 'Share', 'Download', 'Upload',
    'Calendar', 'Dashboard', 'Timeline', 'Building', 'Group',
    'Bell', 'Mail', 'Task', 'List', 'Folder', 'Page',
    'NavArrowUp', 'NavArrowDown', 'NavArrowLeft', 'NavArrowRight',
    'ViewGrid', 'Table', 'Filter', 'Cancel', 'Check'
  ];
  
  console.log('\n✅ Available icons:');
  testIconNames.forEach(iconName => {
    if (basicIcons[iconName]) {
      console.log(`✅ ${iconName}`);
    } else {
      console.log(`❌ ${iconName} - NOT FOUND`);
    }
  });
  
  console.log('\n📋 All available Iconoir exports:');
  console.log(Object.keys(basicIcons).sort().slice(0, 50)); // Show first 50
  
} catch (error) {
  console.error('❌ Error testing Iconoir imports:', error.message);
}