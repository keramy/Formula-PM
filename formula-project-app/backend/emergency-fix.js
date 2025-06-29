const fs = require('fs');
const path = require('path');

const files = [
  'services/ReportGenerator.js',
  'services/WorkflowEngine.js', 
  'services/BackgroundJobService.js'
];

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove any malformed setPrismaClient insertions
    content = content.replace(/([^}]+)\s*\/\*\*\s*\n\s*\*\s*Set the shared Prisma client\s*\n\s*\*\/\s*\n\s*setPrismaClient\([^}]+}\s*\n\s*},?/gs, '$1,');
    
    // Make sure there's a proper setPrismaClient method after constructor
    if (!content.includes('setPrismaClient(prismaClient) {') || content.match(/setPrismaClient\([^}]+}\s*\n\s*},/)) {
      // Find constructor end and add method
      content = content.replace(/(\s+}\s*\n\s*)(\/\*\*(?!\s*Set the shared Prisma client))/s, 
        `$1
  /**
   * Set the shared Prisma client
   */
  setPrismaClient(prismaClient) {
    prisma = prismaClient;
  }

  $2`);
    }
    
    fs.writeFileSync(file, content);
    console.log(`✅ Fixed ${file}`);
  } catch (err) {
    console.log(`❌ Error with ${file}: ${err.message}`);
  }
});

console.log('🎉 Emergency fix complete!');