const fs = require('fs');
const path = require('path');

// List of all service files that need fixing
const serviceFiles = [
  'ReportGenerator.js',
  'WorkflowEngine.js',
  'BackgroundJobService.js',
  // Add any other files that might have the same issue
];

function fixServiceFile(filePath) {
  console.log(`Fixing ${filePath}...`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern to find misplaced setPrismaClient method inside object definitions
    const problematicPattern = /(\s+)([^}]+)\s+\/\*\*\s*\n\s*\*\s*Set the shared Prisma client\s*\n\s*\*\/\s*\n\s*setPrismaClient\(prismaClient\)\s*{\s*\n\s*prisma\s*=\s*prismaClient;\s*\n\s*}\s*\n\s*,/gs;
    
    // Replace with just the proper object ending
    content = content.replace(problematicPattern, (match, indent, beforeMethod) => {
      return beforeMethod.trim().endsWith(',') ? beforeMethod : beforeMethod + ',';
    });
    
    // Find the end of constructor and add setPrismaClient method properly
    const constructorEndPattern = /(\s+this\.[^=]+=\s*[^;]+;\s*\n\s*}\s*\n\s*)(\/\*\*)/;
    
    if (constructorEndPattern.test(content)) {
      content = content.replace(constructorEndPattern, `$1
  /**
   * Set the shared Prisma client
   */
  setPrismaClient(prismaClient) {
    prisma = prismaClient;
  }

  $2`);
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Fix all service files
const servicesDir = path.join(__dirname, 'services');

serviceFiles.forEach(fileName => {
  const filePath = path.join(servicesDir, fileName);
  if (fs.existsSync(filePath)) {
    fixServiceFile(filePath);
  }
});

console.log('🎉 All syntax errors should be fixed!');