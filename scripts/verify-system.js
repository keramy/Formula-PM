#!/usr/bin/env node

/**
 * System Verification Script for Formula PM
 * 
 * Quickly verifies that the system is properly set up
 * and core functionality is working.
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class SystemVerifier {
  constructor() {
    this.rootDir = path.resolve(__dirname, '../');
    this.frontendDir = path.join(this.rootDir, 'formula-project-app');
    this.backendDir = path.join(this.rootDir, 'formula-backend');
    this.docsDir = path.join(this.rootDir, 'docs', 'ai-agent-system');
    
    this.checks = [];
  }

  async verify() {
    console.log('🔍 Starting Formula PM system verification...\n');

    try {
      // 1. Check directory structure
      await this.checkDirectoryStructure();
      
      // 2. Check dependency installations
      await this.checkDependencies();
      
      // 3. Check configuration files
      await this.checkConfiguration();
      
      // 4. Verify documentation system
      await this.verifyDocumentation();
      
      // 5. Test core services
      await this.testCoreServices();
      
      // 6. Report results
      this.reportResults();
      
    } catch (error) {
      console.error('❌ System verification failed:', error);
      process.exit(1);
    }
  }

  async checkDirectoryStructure() {
    console.log('📁 Checking directory structure...');

    const requiredDirs = [
      { path: this.frontendDir, name: 'Frontend (formula-project-app)' },
      { path: this.backendDir, name: 'Backend (formula-backend)' },
      { path: this.docsDir, name: 'AI Documentation System' },
      { path: path.join(this.frontendDir, 'src'), name: 'Frontend source' },
      { path: path.join(this.frontendDir, 'src', 'services'), name: 'Frontend services' },
      { path: path.join(this.frontendDir, 'src', 'features'), name: 'Frontend features' },
      { path: path.join(this.backendDir, 'routes'), name: 'Backend routes' }
    ];

    for (const dir of requiredDirs) {
      try {
        const stats = await fs.stat(dir.path);
        if (stats.isDirectory()) {
          this.addCheck(true, `${dir.name} directory exists`);
        } else {
          this.addCheck(false, `${dir.name} is not a directory`);
        }
      } catch (error) {
        this.addCheck(false, `${dir.name} directory missing`);
      }
    }
  }

  async checkDependencies() {
    console.log('📦 Checking dependencies...');

    // Check if package.json files exist
    const packageFiles = [
      { path: path.join(this.frontendDir, 'package.json'), name: 'Frontend package.json' },
      { path: path.join(this.backendDir, 'package.json'), name: 'Backend package.json' },
      { path: path.join(this.rootDir, 'package.json'), name: 'Root package.json' }
    ];

    for (const pkg of packageFiles) {
      try {
        await fs.access(pkg.path);
        this.addCheck(true, `${pkg.name} exists`);
        
        // Check if node_modules exists
        const nodeModulesPath = path.join(path.dirname(pkg.path), 'node_modules');
        try {
          await fs.access(nodeModulesPath);
          this.addCheck(true, `${pkg.name} dependencies installed`);
        } catch (error) {
          this.addCheck(false, `${pkg.name} dependencies missing - run npm install`);
        }
      } catch (error) {
        this.addCheck(false, `${pkg.name} missing`);
      }
    }
  }

  async checkConfiguration() {
    console.log('⚙️ Checking configuration...');

    // Check backend .env file
    const envPath = path.join(this.backendDir, '.env');
    try {
      await fs.access(envPath);
      this.addCheck(true, 'Backend .env file exists');
      
      // Check .env content
      const envContent = await fs.readFile(envPath, 'utf8');
      if (envContent.includes('EMAIL_USER') && envContent.includes('EMAIL_PASS')) {
        this.addCheck(true, 'Email configuration found in .env');
      } else {
        this.addCheck(false, 'Email configuration missing in .env');
      }
    } catch (error) {
      this.addCheck(false, 'Backend .env file missing - copy from .env.example');
    }

    // Check frontend Vite config
    const viteConfigPath = path.join(this.frontendDir, 'vite.config.js');
    try {
      await fs.access(viteConfigPath);
      this.addCheck(true, 'Frontend Vite config exists');
    } catch (error) {
      this.addCheck(false, 'Frontend Vite config missing');
    }
  }

  async verifyDocumentation() {
    console.log('📚 Verifying documentation system...');

    // Check if documentation files exist
    const docFiles = [
      'README.md',
      'business-logic/connection-system.md',
      'workflows/session-startup-guide.md'
    ];

    for (const docFile of docFiles) {
      const docPath = path.join(this.docsDir, docFile);
      try {
        await fs.access(docPath);
        this.addCheck(true, `Documentation: ${docFile}`);
      } catch (error) {
        this.addCheck(false, `Documentation missing: ${docFile}`);
      }
    }

    // Check if documentation scripts exist
    const scriptPath = path.join(this.rootDir, 'scripts', 'docs', 'generate-docs.js');
    try {
      await fs.access(scriptPath);
      this.addCheck(true, 'Documentation generation script exists');
    } catch (error) {
      this.addCheck(false, 'Documentation generation script missing');
    }
  }

  async testCoreServices() {
    console.log('🧪 Testing core services...');

    // Check if connection service exists
    const connectionServicePath = path.join(this.frontendDir, 'src', 'services', 'connectionService.js');
    try {
      await fs.access(connectionServicePath);
      this.addCheck(true, 'Connection service file exists');
      
      // Basic syntax check
      const content = await fs.readFile(connectionServicePath, 'utf8');
      if (content.includes('class ConnectionService') || content.includes('ConnectionService')) {
        this.addCheck(true, 'Connection service appears valid');
      } else {
        this.addCheck(false, 'Connection service structure invalid');
      }
    } catch (error) {
      this.addCheck(false, 'Connection service missing');
    }

    // Check if backend server file exists
    const serverPath = path.join(this.backendDir, 'server.js');
    try {
      await fs.access(serverPath);
      this.addCheck(true, 'Backend server file exists');
    } catch (error) {
      this.addCheck(false, 'Backend server file missing');
    }
  }

  addCheck(passed, message) {
    this.checks.push({ passed, message });
    const icon = passed ? '✅' : '❌';
    console.log(`  ${icon} ${message}`);
  }

  reportResults() {
    const passed = this.checks.filter(check => check.passed).length;
    const total = this.checks.length;
    const percentage = Math.round((passed / total) * 100);

    console.log('\n📊 System Verification Results:');
    console.log(`✅ Passed: ${passed}/${total} (${percentage}%)`);
    
    const failed = this.checks.filter(check => !check.passed);
    if (failed.length > 0) {
      console.log('\n❌ Failed Checks:');
      failed.forEach(check => console.log(`  • ${check.message}`));
      
      console.log('\n🔧 Recommended Actions:');
      if (failed.some(c => c.message.includes('dependencies missing'))) {
        console.log('  • Run: npm run install:all');
      }
      if (failed.some(c => c.message.includes('.env'))) {
        console.log('  • Copy .env.example to .env in formula-backend/');
      }
      if (failed.some(c => c.message.includes('Documentation'))) {
        console.log('  • Run: npm run docs:generate');
      }
    } else {
      console.log('\n🎉 All system checks passed! Formula PM is ready for development.');
    }

    if (percentage < 80) {
      console.log('\n⚠️ System verification score below 80%. Please address failed checks before development.');
      process.exit(1);
    }
  }
}

// CLI execution
if (require.main === module) {
  const verifier = new SystemVerifier();
  verifier.verify()
    .then(() => console.log('\n✅ System verification completed'))
    .catch(error => {
      console.error('\n❌ System verification failed:', error);
      process.exit(1);
    });
}

module.exports = SystemVerifier;