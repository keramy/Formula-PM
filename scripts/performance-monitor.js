#!/usr/bin/env node

/**
 * Performance Monitoring Script for Formula PM in WSL2
 * This script monitors system performance and provides optimization recommendations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor() {
    this.results = {
      system: {},
      wsl: {},
      react: {},
      recommendations: []
    };
  }

  // System performance checks
  checkSystemPerformance() {
    console.log('🔍 Checking system performance...');
    
    try {
      // Memory usage
      const memInfo = execSync('free -h', { encoding: 'utf8' });
      const memLines = memInfo.split('\n');
      const memData = memLines[1].split(/\s+/);
      
      this.results.system.memory = {
        total: memData[1],
        used: memData[2],
        free: memData[3],
        available: memData[6]
      };

      // CPU info
      const cpuInfo = execSync('nproc', { encoding: 'utf8' }).trim();
      this.results.system.cpuCores = parseInt(cpuInfo);

      // Disk I/O performance test
      console.log('📊 Testing disk I/O performance...');
      const startTime = Date.now();
      execSync('dd if=/dev/zero of=/tmp/perf_test bs=1M count=100 oflag=direct 2>&1', { encoding: 'utf8' });
      execSync('rm -f /tmp/perf_test');
      const diskTime = Date.now() - startTime;
      this.results.system.diskWriteTime = diskTime;

      console.log('✅ System performance checked');
    } catch (error) {
      console.error('❌ Error checking system performance:', error.message);
    }
  }

  // WSL2 configuration checks
  checkWSLConfiguration() {
    console.log('🔧 Checking WSL2 configuration...');
    
    try {
      // Check .wslconfig file
      const wslConfigPath = '/mnt/c/Users/Kerem/.wslconfig';
      if (fs.existsSync(wslConfigPath)) {
        const config = fs.readFileSync(wslConfigPath, 'utf8');
        this.results.wsl.configExists = true;
        this.results.wsl.memoryAllocated = config.includes('memory=8GB');
        this.results.wsl.networkOptimized = config.includes('networkingMode=mirrored');
      } else {
        this.results.wsl.configExists = false;
      }

      // Check WSL version
      try {
        const wslVersion = execSync('wsl --status 2>/dev/null | grep -i version || echo "WSL2"', { encoding: 'utf8' });
        this.results.wsl.version = wslVersion.trim();
      } catch (e) {
        this.results.wsl.version = 'WSL2 (assumed)';
      }

      console.log('✅ WSL2 configuration checked');
    } catch (error) {
      console.error('❌ Error checking WSL configuration:', error.message);
    }
  }

  // React environment checks
  checkReactEnvironment() {
    console.log('⚛️  Checking React environment...');
    
    try {
      const projectPath = '/mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app';
      
      // Check .env file
      const envPath = path.join(projectPath, '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        this.results.react.pollingEnabled = envContent.includes('CHOKIDAR_USEPOLLING=true');
        this.results.react.watchpackEnabled = envContent.includes('WATCHPACK_POLLING=true');
        this.results.react.sourcemapsDisabled = envContent.includes('GENERATE_SOURCEMAP=false');
        this.results.react.memoryOptimized = envContent.includes('NODE_OPTIONS=--max-old-space-size=4096');
      }

      // Check package.json
      const packagePath = path.join(projectPath, 'package.json');
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        this.results.react.hasReactScripts = packageJson.dependencies?.['react-scripts'] || packageJson.devDependencies?.['react-scripts'];
        this.results.react.hasVite = packageJson.devDependencies?.vite;
        this.results.react.optimizedScripts = packageJson.scripts?.['start:fast'] ? true : false;
      }

      // Test file access performance
      console.log('📁 Testing file access performance...');
      const startTime = Date.now();
      execSync(`ls -la ${projectPath}/src > /dev/null 2>&1`);
      const fileAccessTime = Date.now() - startTime;
      this.results.react.fileAccessTime = fileAccessTime;

      console.log('✅ React environment checked');
    } catch (error) {
      console.error('❌ Error checking React environment:', error.message);
    }
  }

  // Generate recommendations
  generateRecommendations() {
    console.log('💡 Generating recommendations...');

    // System recommendations
    if (this.results.system.diskWriteTime > 5000) {
      this.results.recommendations.push({
        type: 'CRITICAL',
        message: 'Disk I/O is very slow. Consider moving project to WSL filesystem.',
        action: 'cp -r /mnt/c/Users/Kerem/Desktop/formula-pm ~/formula-pm'
      });
    }

    // WSL recommendations
    if (!this.results.wsl.configExists) {
      this.results.recommendations.push({
        type: 'HIGH',
        message: '.wslconfig file not found. This will improve memory allocation.',
        action: 'Create .wslconfig file with optimal settings'
      });
    }

    if (!this.results.wsl.memoryAllocated) {
      this.results.recommendations.push({
        type: 'MEDIUM',
        message: 'WSL2 memory not optimally allocated.',
        action: 'Add memory=8GB to .wslconfig'
      });
    }

    // React recommendations
    if (!this.results.react.pollingEnabled) {
      this.results.recommendations.push({
        type: 'HIGH',
        message: 'File polling not enabled. Hot reloading may not work.',
        action: 'Add CHOKIDAR_USEPOLLING=true to .env'
      });
    }

    if (this.results.react.hasReactScripts && !this.results.react.hasVite) {
      this.results.recommendations.push({
        type: 'MEDIUM',
        message: 'Using react-scripts. Vite would be 5-10x faster.',
        action: 'Run ./vite-migration/migrate-to-vite.sh'
      });
    }

    if (this.results.react.fileAccessTime > 1000) {
      this.results.recommendations.push({
        type: 'HIGH',
        message: 'File access is slow. Consider Docker development environment.',
        action: 'Run npm run docker:dev'
      });
    }
  }

  // Calculate performance score
  calculateScore() {
    let score = 100;
    
    // Deduct points for issues
    if (this.results.system.diskWriteTime > 5000) score -= 20;
    if (!this.results.wsl.configExists) score -= 15;
    if (!this.results.react.pollingEnabled) score -= 20;
    if (this.results.react.fileAccessTime > 1000) score -= 15;
    if (this.results.react.hasReactScripts && !this.results.react.hasVite) score -= 10;
    if (!this.results.react.sourcemapsDisabled) score -= 5;
    if (!this.results.react.memoryOptimized) score -= 5;

    return Math.max(0, score);
  }

  // Display results
  displayResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 FORMULA PM PERFORMANCE REPORT');
    console.log('='.repeat(60));

    // Performance Score
    const score = this.calculateScore();
    const scoreColor = score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴';
    console.log(`\n${scoreColor} Overall Performance Score: ${score}/100`);

    // System Info
    console.log('\n🖥️  SYSTEM PERFORMANCE:');
    console.log(`   Memory: ${this.results.system.memory?.used || 'N/A'}/${this.results.system.memory?.total || 'N/A'} used`);
    console.log(`   CPU Cores: ${this.results.system.cpuCores || 'N/A'}`);
    console.log(`   Disk I/O: ${this.results.system.diskWriteTime || 'N/A'}ms`);

    // WSL Info
    console.log('\n🔧 WSL2 CONFIGURATION:');
    console.log(`   Config File: ${this.results.wsl.configExists ? '✅' : '❌'}`);
    console.log(`   Memory Optimized: ${this.results.wsl.memoryAllocated ? '✅' : '❌'}`);
    console.log(`   Network Optimized: ${this.results.wsl.networkOptimized ? '✅' : '❌'}`);

    // React Info
    console.log('\n⚛️  REACT ENVIRONMENT:');
    console.log(`   File Polling: ${this.results.react.pollingEnabled ? '✅' : '❌'}`);
    console.log(`   Watchpack Polling: ${this.results.react.watchpackEnabled ? '✅' : '❌'}`);
    console.log(`   Source Maps Disabled: ${this.results.react.sourcemapsDisabled ? '✅' : '❌'}`);
    console.log(`   Memory Optimized: ${this.results.react.memoryOptimized ? '✅' : '❌'}`);
    console.log(`   File Access Time: ${this.results.react.fileAccessTime || 'N/A'}ms`);
    console.log(`   Using Vite: ${this.results.react.hasVite ? '✅' : '❌'}`);

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      this.results.recommendations.forEach((rec, index) => {
        const icon = rec.type === 'CRITICAL' ? '🚨' : rec.type === 'HIGH' ? '⚠️' : '💡';
        console.log(`   ${icon} [${rec.type}] ${rec.message}`);
        console.log(`      Action: ${rec.action}`);
      });
    } else {
      console.log('\n✅ No recommendations - your setup is optimized!');
    }

    console.log('\n' + '='.repeat(60));
    console.log('🚀 Quick Start Commands:');
    console.log('   Docker (Recommended): npm run docker:dev');
    console.log('   Vite Migration:       ./vite-migration/migrate-to-vite.sh');
    console.log('   WSL Restart:          wsl --shutdown');
    console.log('='.repeat(60));
  }

  // Main execution
  async run() {
    console.log('🚀 Formula PM Performance Monitor');
    console.log('Analyzing your WSL2 React development environment...\n');

    this.checkSystemPerformance();
    this.checkWSLConfiguration();
    this.checkReactEnvironment();
    this.generateRecommendations();
    this.displayResults();
  }
}

// Run the performance monitor
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.run().catch(console.error);
}

module.exports = PerformanceMonitor;