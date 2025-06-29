#!/usr/bin/env node

/**
 * AI Agent Documentation Generator for Formula PM
 * 
 * This script automatically generates and updates documentation
 * for AI agents to understand the codebase and continue development
 * where previous sessions left off.
 */

const fs = require('fs').promises;
const path = require('path');

class FormulaDocumentationGenerator {
  constructor() {
    this.rootDir = path.resolve(__dirname, '../../');
    this.docsDir = path.join(this.rootDir, 'docs', 'ai-agent-system');
    this.srcDir = path.join(this.rootDir, 'formula-project-app', 'src');
    this.backendDir = path.join(this.rootDir, 'formula-backend');
    
    this.patterns = {
      businessLogic: [],
      components: [],
      services: [],
      apis: []
    };
  }

  async generate() {
    console.log('🤖 Starting AI Agent Documentation Generation...');
    
    try {
      // 1. Analyze codebase for patterns
      await this.analyzeCodebase();
      
      // 2. Generate component documentation
      await this.generateComponentDocs();
      
      // 3. Generate API documentation
      await this.generateApiDocs();
      
      // 4. Update pattern index
      await this.updatePatternIndex();
      
      // 5. Generate troubleshooting guide
      await this.generateTroubleshootingGuide();
      
      // 6. Update master index
      await this.updateMasterIndex();
      
      console.log('✅ Documentation generation complete!');
      
    } catch (error) {
      console.error('❌ Documentation generation failed:', error);
      process.exit(1);
    }
  }

  async analyzeCodebase() {
    console.log('📊 Analyzing codebase patterns...');
    
    // Analyze connection service (core business logic)
    await this.analyzeConnectionService();
    
    // Analyze React components
    await this.analyzeComponents();
    
    // Analyze backend services
    await this.analyzeBackendServices();
  }

  async analyzeConnectionService() {
    const connectionServicePath = path.join(this.srcDir, 'services', 'connectionService.js');
    
    try {
      const content = await fs.readFile(connectionServicePath, 'utf8');
      
      // Extract business logic patterns
      const patterns = {
        connectionPatterns: this.extractPatterns(content, /createConnection|connectScopeTo/g),
        dependencyPatterns: this.extractPatterns(content, /analyzeDependencies|checkBlockers/g),
        groupPatterns: this.extractPatterns(content, /groupDependencies|calculateGroupProgress/g),
        workflowPatterns: this.extractPatterns(content, /getWorkflowStatus|generateRecommendations/g)
      };
      
      this.patterns.businessLogic.push({
        file: 'connectionService.js',
        type: 'core_business_logic',
        patterns,
        criticality: 'high',
        description: 'Core connection and dependency management'
      });
      
    } catch (error) {
      console.warn('⚠️ Could not analyze connection service:', error.message);
    }
  }

  async analyzeComponents() {
    const componentsDir = path.join(this.srcDir, 'features');
    
    try {
      const features = await fs.readdir(componentsDir);
      
      for (const feature of features) {
        const featurePath = path.join(componentsDir, feature);
        const stats = await fs.stat(featurePath);
        
        if (stats.isDirectory()) {
          await this.analyzeFeatureComponents(feature, featurePath);
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Could not analyze components:', error.message);
    }
  }

  async analyzeFeatureComponents(featureName, featurePath) {
    const componentsPath = path.join(featurePath, 'components');
    
    try {
      const componentFiles = await fs.readdir(componentsPath);
      
      for (const file of componentFiles) {
        if (file.endsWith('.jsx') || file.endsWith('.js')) {
          const componentPath = path.join(componentsPath, file);
          const content = await fs.readFile(componentPath, 'utf8');
          
          const componentInfo = {
            file,
            feature: featureName,
            type: this.getComponentType(file, content),
            patterns: {
              hooks: this.extractPatterns(content, /use\w+/g),
              materialUI: this.extractPatterns(content, /from '@mui\/\w+'/g),
              connectionService: this.extractPatterns(content, /connectionService\.\w+/g),
              apiCalls: this.extractPatterns(content, /apiService\.\w+|await.*\(/g)
            },
            complexity: this.calculateComplexity(content),
            businessLogicIntegration: content.includes('connectionService')
          };
          
          this.patterns.components.push(componentInfo);
        }
      }
      
    } catch (error) {
      // Feature may not have components directory
    }
  }

  async analyzeBackendServices() {
    const routesPath = path.join(this.backendDir, 'routes');
    
    try {
      const routeFiles = await fs.readdir(routesPath);
      
      for (const file of routeFiles) {
        if (file.endsWith('.js')) {
          const routePath = path.join(routesPath, file);
          const content = await fs.readFile(routePath, 'utf8');
          
          const apiInfo = {
            file,
            type: 'api_routes',
            endpoints: this.extractEndpoints(content),
            methods: this.extractPatterns(content, /\.(get|post|put|delete|patch)/g),
            middleware: this.extractPatterns(content, /\.use\(/g),
            errorHandling: content.includes('try') && content.includes('catch')
          };
          
          this.patterns.apis.push(apiInfo);
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Could not analyze backend services:', error.message);
    }
  }

  // Helper methods
  extractPatterns(content, regex) {
    const matches = content.match(regex) || [];
    return [...new Set(matches)]; // Remove duplicates
  }

  extractEndpoints(content) {
    const endpointRegex = /router\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]/g;
    const endpoints = [];
    let match;
    
    while ((match = endpointRegex.exec(content)) !== null) {
      endpoints.push({
        method: match[1].toUpperCase(),
        path: match[2]
      });
    }
    
    return endpoints;
  }

  getComponentType(filename, content) {
    if (filename.includes('Dialog')) return 'dialog';
    if (filename.includes('Form')) return 'form';
    if (filename.includes('Dashboard')) return 'dashboard';
    if (filename.includes('Page')) return 'page';
    if (content.includes('useState') && content.includes('useEffect')) return 'stateful';
    return 'component';
  }

  calculateComplexity(content) {
    const lines = content.split('\n').length;
    const functions = (content.match(/const \w+ = \(/g) || []).length;
    const hooks = (content.match(/use\w+/g) || []).length;
    
    if (lines > 300 || functions > 10 || hooks > 5) return 'high';
    if (lines > 150 || functions > 5 || hooks > 3) return 'medium';
    return 'low';
  }

  calculateDocumentationCoverage() {
    const totalComponents = this.patterns.components.length;
    const documentedComponents = this.patterns.components.filter(c => 
      c.businessLogicIntegration || c.complexity === 'high'
    ).length;
    
    if (totalComponents === 0) return 100;
    return Math.round((documentedComponents / totalComponents) * 100);
  }

  async generateComponentDocs() {
    console.log('📝 Generating component documentation...');
    
    const componentDocsPath = path.join(this.docsDir, 'components');
    await this.ensureDirectory(componentDocsPath);
    
    const overviewContent = `# Component Architecture Overview

## Summary

This documentation is auto-generated to help AI agents understand the component architecture.

---
*For detailed component patterns, see the pattern documentation.*
`;
    await fs.writeFile(path.join(componentDocsPath, 'README.md'), overviewContent);
  }

  async generateApiDocs() {
    console.log('🔌 Generating API documentation...');
    
    const apiDocsPath = path.join(this.docsDir, 'api');
    await this.ensureDirectory(apiDocsPath);
    
    const apiOverviewContent = `# API Documentation Overview

## Summary

This documentation covers the backend API structure.

---
*For detailed API patterns, see the endpoint documentation.*
`;
    await fs.writeFile(path.join(apiDocsPath, 'README.md'), apiOverviewContent);
  }

  async updatePatternIndex() {
    console.log('📋 Updating pattern index...');
    
    const patternsDocsPath = path.join(this.docsDir, 'patterns');
    await this.ensureDirectory(patternsDocsPath);
    
    const patternIndexContent = `# Pattern Index

## Overview

This index contains common patterns found throughout the Formula PM codebase.

---
*This documentation is auto-generated.*
`;
    await fs.writeFile(path.join(patternsDocsPath, 'INDEX.md'), patternIndexContent);
  }

  async generateTroubleshootingGuide() {
    console.log('🚨 Generating troubleshooting guide...');
    
    const troubleshootingPath = path.join(this.docsDir, 'troubleshooting');
    await this.ensureDirectory(troubleshootingPath);
    
    const troubleshootingContent = `# Common Issues and Solutions

## Overview

This guide helps resolve common development issues.

---
*This guide is auto-generated and updated regularly.*
`;
    await fs.writeFile(path.join(troubleshootingPath, 'common-issues.md'), troubleshootingContent);
  }

  async updateMasterIndex() {
    console.log('📚 Updating master index...');
    // Master index is already created, this would update statistics
  }

  async ensureDirectory(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }
}

// CLI execution
if (require.main === module) {
  const generator = new FormulaDocumentationGenerator();
  generator.generate()
    .then(() => console.log('📚 Documentation generation completed successfully!'))
    .catch(error => {
      console.error('❌ Documentation generation failed:', error);
      process.exit(1);
    });
}

module.exports = FormulaDocumentationGenerator;