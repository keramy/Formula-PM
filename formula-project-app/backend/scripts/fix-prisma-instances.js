#!/usr/bin/env node

/**
 * Script to fix multiple Prisma client instances across all services
 * Replaces individual PrismaClient instances with shared database service pattern
 */

const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '../services');

// Services that need to be fixed (excluding ones already done)
const servicesToFix = [
  'SearchService.js',
  'ReportGenerator.js', 
  'NotificationService.js',
  'MentionService.js',
  'AnalyticsService.js',
  'WorkflowEngine.js',
  'RealtimeService.js',
  'BackgroundJobService.js'
];

function fixServiceFile(filePath) {
  console.log(`Fixing ${path.basename(filePath)}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace PrismaClient import and instantiation
  content = content.replace(
    /const { PrismaClient } = require\('@prisma\/client'\);\s*/g,
    ''
  );
  
  // Replace standalone prisma instantiation
  content = content.replace(
    /const prisma = new PrismaClient\(\);\s*/g,
    '// Will be initialized with shared database service\nlet prisma = null;\n'
  );
  
  // Replace prisma instantiation with options
  content = content.replace(
    /const prisma = new PrismaClient\([^)]*\);\s*/g,
    '// Will be initialized with shared database service\nlet prisma = null;\n'
  );
  
  // Add setPrismaClient method after constructor (if class-based)
  if (content.includes('class ') && content.includes('constructor()')) {
    content = content.replace(
      /(constructor\(\) {[\s\S]*?}\s*)/,
      '$1\n  /**\n   * Set the shared Prisma client\n   */\n  setPrismaClient(prismaClient) {\n    prisma = prismaClient;\n  }\n'
    );
  }
  
  // Handle RealtimeService special case - multiple prisma instantiations
  if (filePath.includes('RealtimeService.js')) {
    content = content.replace(
      /const prisma = new PrismaClient\(\);/g,
      'const prisma = this.prisma || require(\'./DatabaseService\').getClient();'
    );
  }
  
  // Handle BackgroundJobService special case - prisma in method
  if (filePath.includes('BackgroundJobService.js')) {
    content = content.replace(
      /const prisma = new PrismaClient\(\);/g,
      'const prisma = this.prisma || require(\'./DatabaseService\').getClient();'
    );
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed ${path.basename(filePath)}`);
}

function main() {
  console.log('🔧 Fixing Prisma client instances in services...\n');
  
  for (const serviceFile of servicesToFix) {
    const filePath = path.join(servicesDir, serviceFile);
    
    if (fs.existsSync(filePath)) {
      try {
        fixServiceFile(filePath);
      } catch (error) {
        console.error(`❌ Error fixing ${serviceFile}:`, error.message);
      }
    } else {
      console.warn(`⚠️ File not found: ${serviceFile}`);
    }
  }
  
  console.log('\n✅ Prisma client instance fixes completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Update server.js to set Prisma clients for all services');
  console.log('2. Test the application to ensure all services work correctly');
  console.log('3. Monitor database connection pool usage');
}

if (require.main === module) {
  main();
}

module.exports = { fixServiceFile };