import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

// Read the available iconoir icons from the data file
const iconoirData = JSON.parse(fs.readFileSync('./src/data/all-iconoir-icons.json', 'utf8'));
const availableIcons = new Set();

// Extract all available icon names from the data
Object.values(iconoirData.categories).forEach(category => {
  if (Array.isArray(category)) {
    category.forEach(icon => availableIcons.add(icon));
  }
});

console.log(`📊 Total available iconoir icons: ${availableIcons.size}`);

// Function to extract icon imports from a file
function extractIconImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find iconoir-react imports
    const iconoirImportRegex = /from ['"](?:@iconoir\/react|iconoir-react)['"]([^;]*);/g;
    const imports = [];
    
    let match;
    while ((match = iconoirImportRegex.exec(content)) !== null) {
      const importStatement = match[0];
      const beforeImport = content.substring(0, match.index);
      const lastNewline = beforeImport.lastIndexOf('\n');
      const importBlock = content.substring(lastNewline + 1, match.index + match[0].length);
      
      // Extract individual icons from the import block
      const iconPattern = /(\w+)(?:\s+as\s+(\w+))?/g;
      let iconMatch;
      while ((iconMatch = iconPattern.exec(importBlock)) !== null) {
        const [, originalName, aliasName] = iconMatch;
        if (originalName && !['import', 'from', 'iconoir', 'react'].includes(originalName.toLowerCase())) {
          imports.push({
            original: originalName,
            alias: aliasName || originalName,
            line: beforeImport.split('\n').length,
            available: availableIcons.has(originalName)
          });
        }
      }
    }
    
    return imports;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
}

// Function to recursively find all JSX files
function findJSXFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findJSXFiles(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main audit function
function auditIcons() {
  console.log('🔍 Starting icon audit...\n');
  
  const srcDir = './src';
  const jsxFiles = findJSXFiles(srcDir);
  
  console.log(`📁 Found ${jsxFiles.length} JSX/TSX files\n`);
  
  const auditResults = {
    totalFiles: jsxFiles.length,
    filesWithIcons: 0,
    totalIconImports: 0,
    availableIcons: 0,
    missingIcons: 0,
    fileResults: [],
    missingIconsList: [],
    duplicateIcons: {},
    iconUsageCount: {}
  };
  
  jsxFiles.forEach(filePath => {
    const icons = extractIconImports(filePath);
    
    if (icons.length > 0) {
      auditResults.filesWithIcons++;
      auditResults.totalIconImports += icons.length;
      
      const fileResult = {
        file: filePath.replace('./src/', 'src/'),
        icons: icons
      };
      
      icons.forEach(icon => {
        // Count usage
        auditResults.iconUsageCount[icon.original] = (auditResults.iconUsageCount[icon.original] || 0) + 1;
        
        if (icon.available) {
          auditResults.availableIcons++;
        } else {
          auditResults.missingIcons++;
          if (!auditResults.missingIconsList.some(m => m.name === icon.original)) {
            auditResults.missingIconsList.push({
              name: icon.original,
              files: [filePath.replace('./src/', 'src/')]
            });
          } else {
            const existing = auditResults.missingIconsList.find(m => m.name === icon.original);
            if (!existing.files.includes(filePath.replace('./src/', 'src/'))) {
              existing.files.push(filePath.replace('./src/', 'src/'));
            }
          }
        }
      });
      
      auditResults.fileResults.push(fileResult);
    }
  });
  
  // Generate report
  console.log('📋 ICON AUDIT REPORT');
  console.log('='.repeat(50));
  console.log(`📊 Summary:`);
  console.log(`  - Total files scanned: ${auditResults.totalFiles}`);
  console.log(`  - Files using icons: ${auditResults.filesWithIcons}`);
  console.log(`  - Total icon imports: ${auditResults.totalIconImports}`);
  console.log(`  - Available icons: ${auditResults.availableIcons}`);
  console.log(`  - Missing icons: ${auditResults.missingIcons}`);
  
  if (auditResults.missingIcons > 0) {
    console.log(`\n❌ MISSING ICONS (${auditResults.missingIcons} total):`);
    console.log('-'.repeat(50));
    auditResults.missingIconsList.forEach(icon => {
      console.log(`  🚫 ${icon.name}`);
      console.log(`     Used in ${icon.files.length} file(s):`);
      icon.files.forEach(file => {
        console.log(`       - ${file}`);
      });
    });
  }
  
  console.log(`\n📈 MOST USED ICONS:`);
  console.log('-'.repeat(30));
  const sortedIcons = Object.entries(auditResults.iconUsageCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15);
  
  sortedIcons.forEach(([icon, count]) => {
    const status = availableIcons.has(icon) ? '✅' : '❌';
    console.log(`  ${status} ${icon}: ${count} uses`);
  });
  
  console.log(`\n🔧 RECOMMENDED ACTIONS:`);
  console.log('-'.repeat(30));
  
  if (auditResults.missingIcons > 0) {
    console.log(`1. Replace missing icons with available alternatives:`);
    auditResults.missingIconsList.forEach(icon => {
      const suggestions = getSuggestions(icon.name);
      if (suggestions.length > 0) {
        console.log(`   ${icon.name} → ${suggestions.join(' or ')}`);
      }
    });
  }
  
  console.log(`2. Consider creating icon fallback system for missing icons`);
  console.log(`3. Standardize icon sizing and props across components`);
  console.log(`4. Update IconoirProvider configuration if needed`);
  
  // Save detailed report to file
  fs.writeFileSync('./ICON_AUDIT_REPORT.json', JSON.stringify(auditResults, null, 2));
  console.log(`\n💾 Detailed report saved to: ICON_AUDIT_REPORT.json`);
}

// Function to suggest alternative icons
function getSuggestions(missingIcon) {
  const suggestions = [];
  const lowerIcon = missingIcon.toLowerCase();
  
  const mappings = {
    'assignment': ['TaskList', 'Check', 'List'],
    'person': ['User', 'Profile', 'People'],
    'business': ['Building', 'BusinessCard', 'Company'],
    'description': ['Page', 'Document', 'FileText'],
    'engineering': ['Wrench', 'Settings', 'Tools'],
    'dashboard': ['Grid', 'LayoutLeft', 'ViewGrid'],
    'folderopen': ['Folder', 'FolderOpen', 'Archive'],
    'timeline': ['Timeline', 'Calendar', 'Clock']
  };
  
  if (mappings[lowerIcon]) {
    return mappings[lowerIcon].filter(icon => availableIcons.has(icon));
  }
  
  // Try to find similar icons
  const availableArray = Array.from(availableIcons);
  const similar = availableArray.filter(icon => 
    icon.toLowerCase().includes(lowerIcon) || 
    lowerIcon.includes(icon.toLowerCase())
  );
  
  return similar.slice(0, 3);
}

// Run the audit
auditIcons();