const fs = require('fs');
const path = require('path');

// Define the directories to search
const directories = [
  '/mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app/src/pages',
  '/mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app/src/components',
  '/mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app/src/features'
];

function fixBackgroundPalette(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Replace backgroundPalette with backgroundColor
    const newContent = content.replace(/backgroundPalette:/g, 'backgroundColor:');
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      changed = true;
      console.log(`Fixed: ${filePath}`);
    }
    
    return changed;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return;
  }
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
      fixBackgroundPalette(fullPath);
    }
  }
}

console.log('Starting backgroundPalette fix...');
let totalFixed = 0;

directories.forEach(dir => {
  console.log(`\nProcessing directory: ${dir}`);
  processDirectory(dir);
});

console.log('\nbackgroundPalette fix completed!');