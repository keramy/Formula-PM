// Test script to check available Iconoir icons

console.log('🎯 Testing Iconoir icon availability...\n');

const testIcons = [
  // Navigation
  'Home', 'Dashboard', 'Menu', 'Timeline', 'Folder', 'FolderOpen',
  
  // Actions  
  'Plus', 'Add', 'Search', 'Filter', 'Edit', 'Delete', 'Trash', 'Save',
  
  // Views
  'Grid', 'Table', 'List', 'Calendar', 'ViewKanban', 'ViewModule',
  
  // Status
  'Check', 'Warning', 'Error', 'Star', 'Info',
  
  // Business
  'Building', 'Task', 'Group', 'User', 'Settings', 'Assignment',
  
  // UI Elements
  'ExpandLess', 'ExpandMore', 'ChevronUp', 'ChevronDown', 'ChevronLeft', 'ChevronRight',
  
  // Tools
  'Share', 'Download', 'Upload', 'Eye', 'Close', 'MoreHoriz'
];

const available = [];
const missing = [];

for (const iconName of testIcons) {
  try {
    const iconoir = require('iconoir-react');
    if (iconoir[iconName]) {
      available.push(iconName);
      console.log(`✅ ${iconName} - Available`);
    } else {
      missing.push(iconName);
      console.log(`❌ ${iconName} - Missing`);
    }
  } catch (error) {
    missing.push(iconName);
    console.log(`❌ ${iconName} - Error: ${error.message}`);
  }
}

console.log(`\n📊 Summary:`);
console.log(`Available: ${available.length} icons`);
console.log(`Missing: ${missing.length} icons`);

console.log(`\n✅ Available icons:`);
console.log(available.join(', '));

console.log(`\n❌ Missing icons that need alternatives:`);
console.log(missing.join(', '));