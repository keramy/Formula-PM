#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Comprehensive icon mapping from iconoir-react to react-icons/md
const iconMapping = {
  // Navigation & Actions
  'Plus': 'MdAdd',
  'ArrowUp': 'MdKeyboardArrowUp',
  'ArrowDown': 'MdKeyboardArrowDown',
  'NavArrowUp': 'MdExpandLess',
  'NavArrowDown': 'MdExpandMore',
  'ExpandMoreIcon': 'MdExpandMore',
  'ExpandLessIcon': 'MdExpandLess',
  'ArrowRight': 'MdArrowForward',
  'ArrowLeft': 'MdArrowBack',
  'NavArrowLeft': 'MdArrowBack',
  
  // Status & Approval
  'Check': 'MdCheck',
  'CheckCircle': 'MdCheckCircle',
  'Xmark': 'MdClose',
  'Cancel': 'MdCancel',
  'WarningTriangle': 'MdWarning',
  'Warning': 'MdWarning',
  'WarningCircle': 'MdWarning',
  'InfoCircle': 'MdInfo',
  
  // Basic UI
  'Search': 'MdSearch',
  'Filter': 'MdFilterList',
  'Settings': 'MdSettings',
  'MoreVert': 'MdMoreVert',
  'Edit': 'MdEdit',
  'Trash': 'MdDelete',
  'Eye': 'MdVisibility',
  'EyeOff': 'MdVisibilityOff',
  'Refresh': 'MdRefresh',
  'Star': 'MdStar',
  'StarDashed': 'MdStarBorder',
  
  // Files & Documents
  'Download': 'MdDownload',
  'Upload': 'MdCloudUpload',
  'Page': 'MdDescription',
  'Archive': 'MdArchive',
  'Folder': 'MdFolder',
  
  // Communication
  'Mail': 'MdEmail',
  'Bell': 'MdNotifications',
  'ChatBubble': 'MdChat',
  'Comment': 'MdComment',
  'Phone': 'MdPhone',
  
  // Business & Project
  'Building': 'MdBusiness',
  'User': 'MdPerson',
  'Group': 'MdGroup',
  'Calendar': 'MdCalendarToday',
  'Clock': 'MdSchedule',
  'Timeline': 'MdTimeline',
  
  // Technical
  'Design2D': 'MdDesignServices',
  'Engineering': 'MdEngineering',
  'Cog': 'MdSettings',
  'Link': 'MdLink',
  'Unlink': 'MdLinkOff',
  
  // Media & Content
  'Forward': 'MdForward',
  'Reply': 'MdReply',
  'Share': 'MdShare',
  'Printer': 'MdPrint',
  
  // Location & Movement
  'LocationOn': 'MdLocationOn',
  'MapPin': 'MdLocationOn',
  
  // Shopping & Commerce
  'Cart': 'MdShoppingCart',
  'ShoppingBag': 'MdShoppingBag',
  'DollarSign': 'MdAttachMoney',
  'DollarCircle': 'MdAttachMoney',
  'AttachMoney': 'MdAttachMoney',
  
  // Data & Analytics
  'StatsReport': 'MdAnalytics',
  'StatUp': 'MdTrendingUp',
  'BarChart': 'MdBarChart',
  'PieChart': 'MdPieChart',
  'Dashboard': 'MdDashboard',
  'Activity': 'MdLocalActivity',
  
  // Delivery & Transport
  'Truck': 'MdLocalShipping',
  'Delivery': 'MdLocalShipping',
  
  // Special Cases
  'Dot': 'MdCircle',
  'Circle': 'MdCircle',
  'CircleIcon': 'MdCircle',
  'OnlineIcon': 'MdFiberManualRecord',
  'Tag': 'MdLabel',
  'TagOutline': 'MdLabel',
  'Megaphone': 'MdCampaign',
  'Rocket': 'MdRocket',
  'MagicWand': 'MdAutoFixHigh',
  'Lightning': 'MdFlash',
  'Flash': 'MdFlash',
  'Leaf': 'MdEco',
  'ShieldCheck': 'MdSecurity',
  'Trending': 'MdTrendingUp',
  'Package': 'MdInventory',
  'Receipt': 'MdReceipt',
  'Quote': 'MdFormatQuote',
  'ClipboardCheck': 'MdTask',
  'HistoryCircle': 'MdHistory',
  'ZoomIn': 'MdZoomIn',
  'ZoomOut': 'MdZoomOut',
  'RotateLeft': 'MdRotateLeft',
  'RotateRight': 'MdRotateRight',
  'Expand': 'MdFullscreen',
  'Export': 'MdFileDownload',
  'Send': 'MdSend',
  'AttachIcon': 'MdAttachFile',
  'FitToScreen': 'MdFitScreen',
  'Book': 'MdBook',
  'PushPin': 'MdPushPin',
  'AnnouncementIcon': 'MdCampaign',
  'DesktopIcon': 'MdDesktopWindows',
  'GlobalIcon': 'MdPublic',
  'EmailIcon': 'MdEmail',
  'PhoneIcon': 'MdPhone'
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace iconoir-react import with react-icons/md import
  const iconoirImportRegex = /import\s*{([^}]+)}\s*from\s*['"]iconoir-react['"];/g;
  
  content = content.replace(iconoirImportRegex, (match, imports) => {
    modified = true;
    
    // Parse imports
    const importPairs = imports.split(',').map(imp => imp.trim()).filter(imp => imp);
    const mappedImports = [];
    
    for (const importItem of importPairs) {
      const asMatch = importItem.match(/(.+)\s+as\s+(.+)/);
      if (asMatch) {
        const [, originalName, aliasName] = asMatch;
        const originalTrimmed = originalName.trim();
        const aliasTrimmed = aliasName.trim();
        
        const mappedName = iconMapping[originalTrimmed] || `Md${originalTrimmed}`;
        mappedImports.push(`${mappedName} as ${aliasTrimmed}`);
      } else {
        const iconName = importItem.trim();
        const mappedName = iconMapping[iconName] || `Md${iconName}`;
        mappedImports.push(`${mappedName} as ${iconName}`);
      }
    }
    
    return `import {\n  ${mappedImports.join(',\n  ')}\n} from 'react-icons/md';`;
  });

  // Replace style={{fontSize: X}} with size={X}
  content = content.replace(/style\s*=\s*\{\{\s*fontSize:\s*(\d+)([^}]*)\}\}/g, (match, size, rest) => {
    modified = true;
    if (rest.trim() === '' || rest.trim() === ',') {
      return `size={${size}}`;
    } else {
      return `size={${size}} style={{${rest.replace(/,\s*$/, '')}}}`;
    }
  });

  // Replace width={X} height={X} with size={X}
  content = content.replace(/width\s*=\s*\{\s*(\d+)\s*\}\s*height\s*=\s*\{\s*\d+\s*\}/g, (match, size) => {
    modified = true;
    return `size={${size}}`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Migrated: ${filePath}`);
    return true;
  }
  
  return false;
}

function findFilesWithIconoir(dir) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walk(fullPath);
      } else if (stat.isFile() && (item.endsWith('.jsx') || item.endsWith('.js'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes("from 'iconoir-react'")) {
            files.push(fullPath);
          }
        } catch (err) {
          console.warn(`⚠️ Could not read ${fullPath}: ${err.message}`);
        }
      }
    }
  }
  
  walk(dir);
  return files;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
console.log('🔍 Finding files with iconoir-react imports...');

const filesToMigrate = findFilesWithIconoir(srcDir);
console.log(`📁 Found ${filesToMigrate.length} files to migrate`);

let migratedCount = 0;

for (const file of filesToMigrate) {
  try {
    if (migrateFile(file)) {
      migratedCount++;
    }
  } catch (err) {
    console.error(`❌ Error migrating ${file}: ${err.message}`);
  }
}

console.log(`\n🎉 Migration complete! ${migratedCount}/${filesToMigrate.length} files migrated`);
console.log('\n📝 Run "npm run build" to test the migration');