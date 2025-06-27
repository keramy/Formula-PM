/**
 * Automated Icon Migration Script
 * 
 * This script helps automate the migration from Material-UI icons to FluentUI icons
 * by finding and replacing common icon usage patterns.
 * 
 * Usage:
 * node icon-migration-script.js
 * 
 * What it does:
 * - Scans all .jsx and .js files in src directory
 * - Finds Material-UI icon imports and usage
 * - Suggests FluentUI replacements
 * - Optionally performs automatic replacements
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Icon mapping from Material-UI to FluentUI
const ICON_MAPPING = {
  // Navigation Icons
  'Dashboard': 'dashboard',
  'FolderOpen': 'projects',
  'Assignment': 'tasks',
  'People': 'team',
  'Business': 'clients',
  'Person': 'myWork',
  'Architecture': 'shopDrawings',
  'ShoppingCart': 'materials',
  'Timeline': 'timeline',
  'DynamicFeed': 'activityFeed',
  
  // Action Icons
  'Add': 'add',
  'Edit': 'edit',
  'Delete': 'delete',
  'Search': 'search',
  'FilterList': 'filter',
  'GetApp': 'export',
  'Save': 'save',
  'Share': 'share',
  'MoreHoriz': 'more',
  'MoreVert': 'more',
  'Close': 'close',
  'Clear': 'close',
  
  // Status Icons
  'CheckCircle': 'success',
  'Error': 'error',
  'Warning': 'warning',
  'Info': 'info',
  'Star': 'star',
  'StarBorder': 'starOff',
  
  // Navigation Controls
  'ArrowBack': 'arrowLeft',
  'ArrowForward': 'arrowRight',
  'KeyboardArrowLeft': 'chevronLeft',
  'KeyboardArrowRight': 'chevronRight',
  'ExpandMore': 'chevronDown',
  'ExpandLess': 'chevronUp',
  'ChevronLeft': 'chevronLeft',
  'ChevronRight': 'chevronRight',
  
  // View Icons
  'ViewList': 'listView',
  'ViewModule': 'gridView',
  'TableChart': 'tableView',
  'CalendarToday': 'calendarView',
  'ViewKanban': 'boardView',
  'Visibility': 'visible',
  'VisibilityOff': 'hidden',
  
  // File Icons
  'AttachFile': 'attachFile',
  'CloudDownload': 'cloudDownload',
  'CloudUpload': 'cloudUpload',
  'Description': 'document',
  'Folder': 'folder',
  'InsertDriveFile': 'document',
  
  // Communication Icons
  'Email': 'email',
  'Phone': 'phone',
  'Message': 'message',
  'Notifications': 'notifications',
  'NotificationsOff': 'notificationsOff',
  
  // Settings Icons
  'Settings': 'settings',
  'Tune': 'tune',
  'Refresh': 'refresh',
  'Sync': 'sync',
  'Help': 'help',
  
  // Progress Icons
  'Schedule': 'schedule',
  'PlayArrow': 'playArrow',
  'Pause': 'pause',
  'Stop': 'stop',
  'PriorityHigh': 'priorityHigh',
  
  // Chart Icons
  'BarChart': 'barChart',
  'PieChart': 'pieChart',
  'ShowChart': 'showChart',
  'TrendingUp': 'trendingUp',
  'TrendingDown': 'trendingUp',
  
  // Theme Icons
  'Brightness4': 'darkMode',
  'Brightness7': 'lightMode',
  
  // User Icons
  'Person': 'profile',
  'Logout': 'logout',
  
  // Utility Icons
  'Menu': 'menu',
  'Home': 'home',
  'LocationOn': 'locationOn',
  'DateRange': 'dateRange',
  'AccessTime': 'schedule',
  'MonetizationOn': 'monetizationOn'
};

// Component mapping for specialized icon components
const COMPONENT_MAPPING = {
  'navigation': 'NavigationIcon',
  'action': 'ActionIcon', 
  'status': 'StatusIcon',
  'view': 'ViewIcon',
  'file': 'FileIcon',
  'priority': 'PriorityIcon'
};

class IconMigrator {
  constructor() {
    this.srcDir = './src';
    this.results = {
      scannedFiles: 0,
      filesWithIcons: 0,
      replacements: [],
      errors: []
    };
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async run() {
    console.log('🚀 FluentUI Icon Migration Script\n');
    
    try {
      // Step 1: Scan files
      console.log('📁 Scanning files for Material-UI icon usage...');
      const files = this.scanDirectory(this.srcDir);
      
      // Step 2: Analyze each file
      console.log(`\n📊 Analyzing ${files.length} files...`);
      const filesToMigrate = this.analyzeFiles(files);
      
      // Step 3: Show results
      this.showResults(filesToMigrate);
      
      // Step 4: Ask for confirmation
      const shouldProceed = await this.askConfirmation(
        `\nFound ${filesToMigrate.length} files to migrate. Proceed with automatic migration? (y/N): `
      );
      
      if (shouldProceed) {
        // Step 5: Perform migration
        console.log('\n🔄 Performing migration...');
        await this.migrateFiles(filesToMigrate);
        console.log('\n✅ Migration completed!');
        this.showSummary();
      } else {
        console.log('\n❌ Migration cancelled.');
        this.generateManualMigrationGuide(filesToMigrate);
      }
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
    } finally {
      this.rl.close();
    }
  }

  scanDirectory(dir) {
    const files = [];
    
    function scan(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules and build directories
          if (!['node_modules', 'build', 'dist', '.git'].includes(item)) {
            scan(fullPath);
          }
        } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
          files.push(fullPath);
        }
      });
    }
    
    scan(dir);
    return files;
  }

  analyzeFiles(files) {
    const filesToMigrate = [];
    
    files.forEach(filePath => {
      this.results.scannedFiles++;
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for Material-UI icon imports
      const materialIconImports = this.findMaterialIconImports(content);
      
      if (materialIconImports.length > 0) {
        this.results.filesWithIcons++;
        
        // Find icon usage in the file
        const iconUsages = this.findIconUsages(content, materialIconImports);
        
        if (iconUsages.length > 0) {
          filesToMigrate.push({
            filePath,
            imports: materialIconImports,
            usages: iconUsages,
            content
          });
        }
      }
    });
    
    return filesToMigrate;
  }

  findMaterialIconImports(content) {
    const imports = [];
    const importPattern = /import\s+{([^}]+)}\s+from\s+['"]@mui\/icons-material['"];?/g;
    let match;
    
    while ((match = importPattern.exec(content)) !== null) {
      const importedIcons = match[1]
        .split(',')
        .map(icon => {
          const parts = icon.trim().split(' as ');
          return {
            original: parts[0].trim(),
            alias: parts[1] ? parts[1].trim() : parts[0].trim()
          };
        });
      
      imports.push({
        fullImport: match[0],
        icons: importedIcons
      });
    }
    
    return imports;
  }

  findIconUsages(content, imports) {
    const usages = [];
    
    imports.forEach(importGroup => {
      importGroup.icons.forEach(icon => {
        // Find JSX usage of the icon
        const usagePattern = new RegExp(`<${icon.alias}[^>]*\\/?>`, 'g');
        let match;
        
        while ((match = usagePattern.exec(content)) !== null) {
          const fluentEquivalent = ICON_MAPPING[icon.original];
          
          if (fluentEquivalent) {
            usages.push({
              original: match[0],
              materialIcon: icon.original,
              materialAlias: icon.alias,
              fluentIcon: fluentEquivalent,
              position: match.index,
              suggestion: this.generateReplacement(match[0], fluentEquivalent)
            });
          } else {
            usages.push({
              original: match[0],
              materialIcon: icon.original,
              materialAlias: icon.alias,
              fluentIcon: null,
              position: match.index,
              warning: `No FluentUI equivalent found for ${icon.original}`
            });
          }
        }
      });
    });
    
    return usages;
  }

  generateReplacement(originalJsx, fluentIcon) {
    // Extract props from original JSX
    const propsMatch = originalJsx.match(/<[^>]+\s+([^>]*)\/?>/);
    const props = propsMatch ? propsMatch[1] : '';
    
    // Convert common Material-UI props to UniversalIcon props
    let convertedProps = props
      .replace(/fontSize=["'](\w+)["']/g, (match, size) => {
        const sizeMap = { small: '16', medium: '20', large: '24' };
        return `size={${sizeMap[size] || '20'}}`;
      })
      .replace(/sx=\{\{[^}]*fontSize:\s*(\d+)[^}]*\}\}/g, (match, size) => {
        return match.replace(/fontSize:\s*\d+/, '') + ` size={${size}}`;
      });
    
    // Determine the best component type
    const componentType = this.determineComponentType(fluentIcon);
    
    if (componentType !== 'UniversalIcon') {
      return `<${componentType} name="${fluentIcon}" ${convertedProps} />`;
    } else {
      return `<UniversalIcon name="${fluentIcon}" ${convertedProps} />`;
    }
  }

  determineComponentType(fluentIcon) {
    // Determine the most appropriate specialized component
    const navigationIcons = ['dashboard', 'projects', 'tasks', 'team', 'clients', 'myWork'];
    const actionIcons = ['add', 'edit', 'delete', 'search', 'filter', 'export', 'save'];
    const statusIcons = ['success', 'error', 'warning', 'info'];
    const viewIcons = ['gridView', 'listView', 'tableView', 'calendarView', 'boardView'];
    
    if (navigationIcons.includes(fluentIcon)) return 'NavigationIcon';
    if (actionIcons.includes(fluentIcon)) return 'ActionIcon';
    if (statusIcons.includes(fluentIcon)) return 'StatusIcon';
    if (viewIcons.includes(fluentIcon)) return 'ViewIcon';
    
    return 'UniversalIcon';
  }

  showResults(filesToMigrate) {
    console.log('\n📋 Migration Analysis Results:');
    console.log(`   Files scanned: ${this.results.scannedFiles}`);
    console.log(`   Files with Material-UI icons: ${this.results.filesWithIcons}`);
    console.log(`   Files requiring migration: ${filesToMigrate.length}`);
    
    if (filesToMigrate.length > 0) {
      console.log('\n📄 Files to migrate:');
      filesToMigrate.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.filePath} (${file.usages.length} icons)`);
      });
      
      console.log('\n🔍 Icon replacements:');
      const iconCounts = {};
      filesToMigrate.forEach(file => {
        file.usages.forEach(usage => {
          if (usage.fluentIcon) {
            iconCounts[usage.materialIcon] = (iconCounts[usage.materialIcon] || 0) + 1;
          }
        });
      });
      
      Object.entries(iconCounts).forEach(([material, count]) => {
        const fluent = ICON_MAPPING[material];
        console.log(`   ${material} → ${fluent} (${count} usage${count > 1 ? 's' : ''})`);
      });
    }
  }

  async askConfirmation(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.toLowerCase().startsWith('y'));
      });
    });
  }

  async migrateFiles(filesToMigrate) {
    let migratedCount = 0;
    
    for (const file of filesToMigrate) {
      try {
        let newContent = file.content;
        
        // Replace imports
        file.imports.forEach(importGroup => {
          // Remove the Material-UI import
          newContent = newContent.replace(importGroup.fullImport, '');
        });
        
        // Add FluentUI import if not present
        const hasFluentImport = newContent.includes('import UniversalIcon') || 
                              newContent.includes('import { NavigationIcon');
        
        if (!hasFluentImport) {
          // Add import after existing imports
          const lastImportMatch = newContent.match(/import[^;]+;(?=[^import]*)/g);
          if (lastImportMatch) {
            const lastImport = lastImportMatch[lastImportMatch.length - 1];
            const importToAdd = "import UniversalIcon, { NavigationIcon, ActionIcon, StatusIcon, ViewIcon } from '../ui/UniversalIcon';";
            newContent = newContent.replace(lastImport, lastImport + '\n' + importToAdd);
          }
        }
        
        // Replace icon usages (in reverse order to maintain positions)
        file.usages
          .sort((a, b) => b.position - a.position)
          .forEach(usage => {
            if (usage.suggestion) {
              newContent = newContent.substring(0, usage.position) + 
                          usage.suggestion + 
                          newContent.substring(usage.position + usage.original.length);
            }
          });
        
        // Write the modified file
        fs.writeFileSync(file.filePath, newContent, 'utf8');
        migratedCount++;
        
        console.log(`   ✅ ${file.filePath}`);
        
      } catch (error) {
        console.log(`   ❌ ${file.filePath}: ${error.message}`);
        this.results.errors.push({
          file: file.filePath,
          error: error.message
        });
      }
    }
    
    this.results.migratedFiles = migratedCount;
  }

  showSummary() {
    console.log('\n📊 Migration Summary:');
    console.log(`   Files migrated: ${this.results.migratedFiles || 0}`);
    console.log(`   Errors: ${this.results.errors.length}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.results.errors.forEach(error => {
        console.log(`   ${error.file}: ${error.error}`);
      });
    }
    
    console.log('\n🎯 Next steps:');
    console.log('   1. Test the application to ensure all icons render correctly');
    console.log('   2. Remove unused Material-UI icon dependencies');
    console.log('   3. Run the icon usage report to verify migration');
    console.log('   4. Update any remaining manual icon usages');
  }

  generateManualMigrationGuide(filesToMigrate) {
    const guideContent = `# Manual Migration Guide

Generated on: ${new Date().toISOString()}

## Files to migrate manually:

${filesToMigrate.map((file, index) => `
### ${index + 1}. ${file.filePath}

**Current imports:**
\`\`\`javascript
${file.imports.map(imp => imp.fullImport).join('\n')}
\`\`\`

**Suggested replacement:**
\`\`\`javascript
import UniversalIcon, { NavigationIcon, ActionIcon, StatusIcon, ViewIcon } from '../ui/UniversalIcon';
\`\`\`

**Icon replacements needed:**
${file.usages.map(usage => `
- \`${usage.original}\` → \`${usage.suggestion || 'Manual replacement needed'}\`
  ${usage.warning ? `  ⚠️ ${usage.warning}` : ''}
`).join('')}
`).join('')}

## Icon Mapping Reference:

${Object.entries(ICON_MAPPING).map(([material, fluent]) => 
  `- ${material} → ${fluent}`
).join('\n')}
`;

    fs.writeFileSync('./manual-migration-guide.md', guideContent);
    console.log('\n📋 Manual migration guide generated: ./manual-migration-guide.md');
  }
}

// Run the migration script
if (require.main === module) {
  const migrator = new IconMigrator();
  migrator.run().catch(console.error);
}

module.exports = IconMigrator;