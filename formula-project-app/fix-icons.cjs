#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Icon corrections for react-icons/md
const corrections = {
  'MdMoreVertCircle': 'MdMoreVert',
  'MdFloppyDisk': 'MdSave',
  'MdHelpCircle': 'MdHelp',
  'MdViewGrid': 'MdViewModule',
  'MdShareAndroid': 'MdShare',
  'MdCopy': 'MdContentCopy',
  'MdXmarkCircle': 'MdError',
  'MdPlay': 'MdPlayArrow',
  'MdTriangleFlag': 'MdFlag',
  'MdDesignPencil': 'MdDesignServices',
  'MdQrCode': 'MdQrCodeScanner',
  'MdFlash': 'MdElectricBolt',
  'MdMoneySquare': 'MdAttachMoney',
  'MdGraphUp': 'MdTrendingUp',
  'MdReports': 'MdAnalytics',
  'MdIconoirProvider': 'REMOVE_THIS_LINE',
  'IconoirProvider': 'REMOVE_PROVIDER'
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [wrong, correct] of Object.entries(corrections)) {
    if (content.includes(wrong)) {
      if (correct === 'REMOVE_THIS_LINE') {
        // Remove the entire import line containing this
        content = content.replace(new RegExp(`\\s*${wrong}[^\\n]*\\n`, 'g'), '');
        modified = true;
      } else if (correct === 'REMOVE_PROVIDER') {
        // Remove IconoirProvider wrapper
        content = content.replace(/<IconoirProvider[^>]*>/g, '<>');
        content = content.replace(/<\/IconoirProvider>/g, '</>');
        modified = true;
      } else {
        const regex = new RegExp(wrong, 'g');
        if (content.match(regex)) {
          content = content.replace(regex, correct);
          modified = true;
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  
  return false;
}

function findJSXFiles(dir) {
  const files = [];
  
  function walk(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          walk(fullPath);
        } else if (stat.isFile() && (item.endsWith('.jsx') || item.endsWith('.js'))) {
          files.push(fullPath);
        }
      }
    } catch (err) {
      console.warn(`⚠️ Could not read directory ${currentDir}`);
    }
  }
  
  walk(dir);
  return files;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
console.log('🔧 Fixing remaining icon issues...');

const files = findJSXFiles(srcDir);
let fixedCount = 0;

for (const file of files) {
  try {
    if (fixFile(file)) {
      fixedCount++;
    }
  } catch (err) {
    console.error(`❌ Error fixing ${file}: ${err.message}`);
  }
}

console.log(`\n🎉 Fixed ${fixedCount} files`);
console.log('📝 Run "npm run build" to test the fixes');