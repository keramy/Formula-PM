#!/usr/bin/env node

/**
 * Documentation Validation Script for Formula PM
 * 
 * Validates that documentation is accurate and up-to-date
 * with the current codebase.
 */

const fs = require('fs').promises;
const path = require('path');

class DocumentationValidator {
  constructor() {
    this.rootDir = path.resolve(__dirname, '../../');
    this.docsDir = path.join(this.rootDir, 'docs', 'ai-agent-system');
    this.srcDir = path.join(this.rootDir, 'formula-project-app', 'src');
    this.errors = [];
    this.warnings = [];
  }

  async validate() {
    console.log('🔍 Starting documentation validation...');

    try {
      // 1. Check required documentation exists
      await this.checkRequiredDocs();
      
      // 2. Validate business logic documentation
      await this.validateBusinessLogicDocs();
      
      // 3. Check documentation freshness
      await this.checkDocumentationFreshness();
      
      // 4. Validate cross-references
      await this.validateCrossReferences();
      
      // 5. Report results
      this.reportResults();
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    }
  }

  async checkRequiredDocs() {
    console.log('📋 Checking required documentation...');

    const requiredDocs = [
      'README.md',
      'business-logic/connection-system.md',
      'business-logic/dependency-engine.md', 
      'business-logic/production-readiness.md',
      'workflows/session-startup-guide.md',
      'components/README.md',
      'api/README.md',
      'patterns/INDEX.md'
    ];

    for (const docPath of requiredDocs) {
      const fullPath = path.join(this.docsDir, docPath);
      try {
        await fs.access(fullPath);
        console.log(`✅ ${docPath} exists`);
      } catch (error) {
        this.errors.push(`Missing required documentation: ${docPath}`);
        console.log(`❌ ${docPath} missing`);
      }
    }
  }

  async validateBusinessLogicDocs() {
    console.log('🏗️ Validating business logic documentation...');

    // Check if connection service exists
    const connectionServicePath = path.join(this.srcDir, 'services', 'connectionService.js');
    
    try {
      const connectionServiceContent = await fs.readFile(connectionServicePath, 'utf8');
      
      // Check if docs mention key methods
      const keyMethods = [
        'createConnection',
        'analyzeDependencies', 
        'getWorkflowStatus',
        'generateRecommendations'
      ];

      const connectionDocsPath = path.join(this.docsDir, 'business-logic', 'connection-system.md');
      
      try {
        const docsContent = await fs.readFile(connectionDocsPath, 'utf8');
        
        for (const method of keyMethods) {
          if (connectionServiceContent.includes(method) && !docsContent.includes(method)) {
            this.warnings.push(`Connection docs missing method: ${method}`);
          }
        }
        
        console.log('✅ Business logic documentation validated');
        
      } catch (error) {
        this.errors.push('Cannot read connection system documentation');
      }
      
    } catch (error) {
      this.warnings.push('Cannot access connection service for validation');
    }
  }

  async checkDocumentationFreshness() {
    console.log('⏰ Checking documentation freshness...');

    const docsPath = path.join(this.docsDir, 'README.md');
    
    try {
      const stats = await fs.stat(docsPath);
      const lastModified = stats.mtime;
      const now = new Date();
      const daysSinceUpdate = (now - lastModified) / (1000 * 60 * 60 * 24);
      
      if (daysSinceUpdate > 7) {
        this.warnings.push(`Documentation hasn't been updated in ${Math.round(daysSinceUpdate)} days`);
      } else {
        console.log(`✅ Documentation last updated ${Math.round(daysSinceUpdate)} days ago`);
      }
      
    } catch (error) {
      this.warnings.push('Cannot check documentation freshness');
    }
  }

  async validateCrossReferences() {
    console.log('🔗 Validating cross-references...');

    const readmePath = path.join(this.docsDir, 'README.md');
    
    try {
      const readmeContent = await fs.readFile(readmePath, 'utf8');
      
      // Extract markdown links
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const links = [];
      let match;
      
      while ((match = linkRegex.exec(readmeContent)) !== null) {
        if (!match[2].startsWith('http')) {
          links.push(match[2]);
        }
      }
      
      // Check if linked files exist
      for (const link of links) {
        const linkPath = path.join(this.docsDir, link);
        try {
          await fs.access(linkPath);
        } catch (error) {
          this.errors.push(`Broken link: ${link}`);
        }
      }
      
      console.log(`✅ Validated ${links.length} cross-references`);
      
    } catch (error) {
      this.warnings.push('Cannot validate cross-references');
    }
  }

  reportResults() {
    console.log('\n📊 Validation Results:');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All documentation validation checks passed!');
      return;
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => console.log(`  • ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
    
    console.log(`\n📈 Summary: ${this.errors.length} errors, ${this.warnings.length} warnings`);
    
    if (this.errors.length > 0) {
      console.log('\n🔧 Run "npm run docs:generate" to fix missing documentation');
      process.exit(1);
    }
  }
}

// CLI execution
if (require.main === module) {
  const validator = new DocumentationValidator();
  validator.validate()
    .then(() => console.log('✅ Documentation validation completed'))
    .catch(error => {
      console.error('❌ Documentation validation failed:', error);
      process.exit(1);
    });
}

module.exports = DocumentationValidator;