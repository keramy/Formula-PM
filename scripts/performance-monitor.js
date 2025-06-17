#!/usr/bin/env node

/**
 * WSL2 React Development Performance Monitor
 * Monitors and reports on various performance metrics
 * Last Updated: June 17, 2025
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class WSL2PerformanceMonitor {
    constructor() {
        this.startTime = Date.now();
        this.metrics = {
            system: {},
            wsl: {},
            react: {},
            network: {},
            recommendations: []
        };
    }

    // ANSI color codes for console output
    colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m'
    };

    log(message, color = 'reset') {
        console.log(`${this.colors[color]}${message}${this.colors.reset}`);
    }

    async getSystemInfo() {
        try {
            // Get system memory info
            const { stdout: memInfo } = await execAsync('free -h');
            const memLines = memInfo.split('\n')[1].split(/\s+/);
            
            this.metrics.system = {
                totalMemory: memLines[1],
                usedMemory: memLines[2],
                freeMemory: memLines[3],
                availableMemory: memLines[6] || memLines[3]
            };

            // Get CPU info
            const { stdout: cpuInfo } = await execAsync('nproc --all');
            this.metrics.system.cpuCores = parseInt(cpuInfo.trim());

            // Get load average
            const { stdout: loadAvg } = await execAsync('uptime');
            const loadMatch = loadAvg.match(/load average: ([\d.]+)/);
            this.metrics.system.loadAverage = loadMatch ? parseFloat(loadMatch[1]) : 0;

        } catch (error) {
            this.log(`Error getting system info: ${error.message}`, 'red');
        }
    }

    async getWSLInfo() {
        try {
            // Check if running in WSL
            const { stdout: wslCheck } = await execAsync('uname -r');
            this.metrics.wsl.isWSL = wslCheck.includes('microsoft') || wslCheck.includes('WSL');

            if (this.metrics.wsl.isWSL) {
                // Get WSL version info if available
                try {
                    const { stdout: wslVersion } = await execAsync('wsl.exe --version 2>/dev/null || echo "WSL1"');
                    this.metrics.wsl.version = wslVersion.includes('WSL version') ? 'WSL2' : 'WSL1';
                } catch {
                    this.metrics.wsl.version = 'Unknown';
                }

                // Check .wslconfig file
                const wslConfigPath = `/mnt/c/Users/${process.env.USER}/.wslconfig`;
                this.metrics.wsl.hasWslConfig = fs.existsSync(wslConfigPath);
                
                if (this.metrics.wsl.hasWslConfig) {
                    const wslConfig = fs.readFileSync(wslConfigPath, 'utf8');
                    this.metrics.wsl.configuredMemory = this.extractConfigValue(wslConfig, 'memory');
                    this.metrics.wsl.configuredProcessors = this.extractConfigValue(wslConfig, 'processors');
                }
            }
        } catch (error) {
            this.log(`Error getting WSL info: ${error.message}`, 'red');
        }
    }

    extractConfigValue(config, key) {
        const match = config.match(new RegExp(`${key}\\s*=\\s*(.+)`));
        return match ? match[1].trim() : null;
    }

    async getReactProjectInfo() {
        try {
            const packageJsonPath = path.join(process.cwd(), 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                
                this.metrics.react.isReactProject = !!packageJson.dependencies?.react;
                this.metrics.react.reactVersion = packageJson.dependencies?.react;
                this.metrics.react.reactScriptsVersion = packageJson.dependencies?.[('react-scripts')];
                
                // Check for optimization settings
                const envPath = path.join(process.cwd(), '.env');
                if (fs.existsSync(envPath)) {
                    const envContent = fs.readFileSync(envPath, 'utf8');
                    this.metrics.react.hasPolling = envContent.includes('WATCHPACK_POLLING=true') || 
                                                   envContent.includes('CHOKIDAR_USEPOLLING=true');
                    this.metrics.react.hasFastRefresh = envContent.includes('FAST_REFRESH=true');
                    this.metrics.react.hasSourceMapDisabled = envContent.includes('GENERATE_SOURCEMAP=false');
                }

                // Check node_modules size
                const nodeModulesPath = path.join(process.cwd(), 'node_modules');
                if (fs.existsSync(nodeModulesPath)) {
                    const { stdout: duOutput } = await execAsync(`du -sh "${nodeModulesPath}" 2>/dev/null || echo "0M"`);
                    this.metrics.react.nodeModulesSize = duOutput.split('\t')[0];
                }
            }
        } catch (error) {
            this.log(`Error getting React project info: ${error.message}`, 'red');
        }
    }

    async testNetworkPerformance() {
        try {
            // Test localhost connectivity
            const start = Date.now();
            try {
                await execAsync('curl -s --connect-timeout 2 http://localhost:3000 > /dev/null');
                this.metrics.network.localhostReachable = true;
                this.metrics.network.localhostLatency = Date.now() - start;
            } catch {
                this.metrics.network.localhostReachable = false;
            }

            // Get network interface info
            const { stdout: ipInfo } = await execAsync('hostname -I');
            this.metrics.network.wslIP = ipInfo.trim().split(' ')[0];

        } catch (error) {
            this.log(`Error testing network: ${error.message}`, 'red');
        }
    }

    async testFileSystemPerformance() {
        try {
            // Test file I/O performance
            const testFile = 'perf_test_' + Date.now() + '.tmp';
            const testData = 'x'.repeat(1024 * 1024); // 1MB of data
            
            // Write test
            const writeStart = Date.now();
            fs.writeFileSync(testFile, testData);
            const writeTime = Date.now() - writeStart;
            
            // Read test
            const readStart = Date.now();
            fs.readFileSync(testFile);
            const readTime = Date.now() - readStart;
            
            // Clean up
            fs.unlinkSync(testFile);
            
            this.metrics.system.fileIOWrite = writeTime;
            this.metrics.system.fileIORead = readTime;
            
            // Determine if we're on Windows filesystem
            const cwd = process.cwd();
            this.metrics.system.onWindowsFS = cwd.startsWith('/mnt/c') || cwd.startsWith('/mnt/');
            
        } catch (error) {
            this.log(`Error testing file system: ${error.message}`, 'red');
        }
    }

    generateRecommendations() {
        const rec = this.metrics.recommendations;

        // WSL2 Configuration Recommendations
        if (this.metrics.wsl.isWSL && !this.metrics.wsl.hasWslConfig) {
            rec.push({
                type: 'critical',
                category: 'WSL Configuration',
                message: 'Create .wslconfig file for optimal WSL2 performance',
                action: 'Create /mnt/c/Users/$USER/.wslconfig with memory and CPU settings'
            });
        }

        // Memory recommendations
        if (this.metrics.system.totalMemory) {
            const totalGB = this.parseMemoryToGB(this.metrics.system.totalMemory);
            const availableGB = this.parseMemoryToGB(this.metrics.system.availableMemory);
            
            if (availableGB < 4) {
                rec.push({
                    type: 'warning',
                    category: 'Memory',
                    message: `Low available memory (${this.metrics.system.availableMemory})`,
                    action: 'Close unused applications or increase WSL2 memory allocation'
                });
            }
        }

        // React project recommendations
        if (this.metrics.react.isReactProject) {
            if (!this.metrics.react.hasPolling && this.metrics.system.onWindowsFS) {
                rec.push({
                    type: 'critical',
                    category: 'React Development',
                    message: 'File watching polling not enabled for Windows filesystem',
                    action: 'Add WATCHPACK_POLLING=true to .env file'
                });
            }

            if (!this.metrics.react.hasSourceMapDisabled) {
                rec.push({
                    type: 'optimization',
                    category: 'React Performance',
                    message: 'Source maps enabled (slower builds)',
                    action: 'Add GENERATE_SOURCEMAP=false to .env for faster development builds'
                });
            }
        }

        // File system recommendations
        if (this.metrics.system.onWindowsFS) {
            if (this.metrics.system.fileIOWrite > 100 || this.metrics.system.fileIORead > 50) {
                rec.push({
                    type: 'performance',
                    category: 'File System',
                    message: 'Slow file I/O detected on Windows filesystem',
                    action: 'Consider moving project to WSL filesystem (/home/user/) for better performance'
                });
            }
        }

        // Load average recommendations
        if (this.metrics.system.loadAverage > this.metrics.system.cpuCores * 0.8) {
            rec.push({
                type: 'warning',
                category: 'CPU Usage',
                message: `High system load (${this.metrics.system.loadAverage})`,
                action: 'Close CPU-intensive applications or increase WSL2 CPU allocation'
            });
        }
    }

    parseMemoryToGB(memString) {
        const match = memString.match(/([\d.]+)([KMGT]?)/);
        if (!match) return 0;
        
        const value = parseFloat(match[1]);
        const unit = match[2];
        
        switch (unit) {
            case 'K': return value / 1024 / 1024;
            case 'M': return value / 1024;
            case 'G': return value;
            case 'T': return value * 1024;
            default: return value / 1024 / 1024 / 1024; // Assume bytes
        }
    }

    displayResults() {
        this.log('\n🚀 WSL2 React Development Performance Report', 'cyan');
        this.log('=' .repeat(50), 'cyan');

        // System Information
        this.log('\n📊 System Information:', 'blue');
        this.log(`   Memory: ${this.metrics.system.usedMemory}/${this.metrics.system.totalMemory} (Available: ${this.metrics.system.availableMemory})`);
        this.log(`   CPU Cores: ${this.metrics.system.cpuCores}`);
        this.log(`   Load Average: ${this.metrics.system.loadAverage}`);
        this.log(`   File System: ${this.metrics.system.onWindowsFS ? 'Windows (/mnt/c)' : 'Linux'}`);
        
        if (this.metrics.system.fileIOWrite !== undefined) {
            this.log(`   File I/O: Write ${this.metrics.system.fileIOWrite}ms, Read ${this.metrics.system.fileIORead}ms`);
        }

        // WSL Information
        if (this.metrics.wsl.isWSL) {
            this.log('\n🐧 WSL Information:', 'blue');
            this.log(`   Version: ${this.metrics.wsl.version}`);
            this.log(`   .wslconfig: ${this.metrics.wsl.hasWslConfig ? '✅ Found' : '❌ Missing'}`);
            
            if (this.metrics.wsl.configuredMemory) {
                this.log(`   Configured Memory: ${this.metrics.wsl.configuredMemory}`);
            }
            if (this.metrics.wsl.configuredProcessors) {
                this.log(`   Configured Processors: ${this.metrics.wsl.configuredProcessors}`);
            }
        }

        // React Project Information
        if (this.metrics.react.isReactProject) {
            this.log('\n⚛️  React Project Information:', 'blue');
            this.log(`   React Version: ${this.metrics.react.reactVersion}`);
            this.log(`   React Scripts: ${this.metrics.react.reactScriptsVersion}`);
            this.log(`   File Watching Polling: ${this.metrics.react.hasPolling ? '✅ Enabled' : '❌ Disabled'}`);
            this.log(`   Fast Refresh: ${this.metrics.react.hasFastRefresh ? '✅ Enabled' : '❌ Disabled'}`);
            this.log(`   Source Maps: ${this.metrics.react.hasSourceMapDisabled ? '✅ Disabled (Fast)' : '⚠️  Enabled (Slow)'}`);
            
            if (this.metrics.react.nodeModulesSize) {
                this.log(`   node_modules Size: ${this.metrics.react.nodeModulesSize}`);
            }
        }

        // Network Information
        this.log('\n🌐 Network Information:', 'blue');
        this.log(`   WSL IP: ${this.metrics.network.wslIP}`);
        this.log(`   Localhost:3000: ${this.metrics.network.localhostReachable ? '✅ Reachable' : '❌ Not Reachable'}`);
        
        if (this.metrics.network.localhostLatency) {
            this.log(`   Localhost Latency: ${this.metrics.network.localhostLatency}ms`);
        }

        // Recommendations
        if (this.metrics.recommendations.length > 0) {
            this.log('\n💡 Performance Recommendations:', 'yellow');
            
            this.metrics.recommendations.forEach((rec, index) => {
                const icon = rec.type === 'critical' ? '🔴' : 
                           rec.type === 'warning' ? '🟡' : 
                           rec.type === 'performance' ? '🔵' : '🟢';
                
                this.log(`\n   ${icon} ${rec.category}:`);
                this.log(`      Issue: ${rec.message}`);
                this.log(`      Action: ${rec.action}`);
            });
        } else {
            this.log('\n✅ No critical performance issues detected!', 'green');
        }

        // Performance Score
        const score = this.calculatePerformanceScore();
        const scoreColor = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';
        this.log(`\n🏆 Performance Score: ${score}/100`, scoreColor);
        
        const runTime = Date.now() - this.startTime;
        this.log(`\n⏱️  Analysis completed in ${runTime}ms`, 'cyan');
    }

    calculatePerformanceScore() {
        let score = 100;

        // Deduct points for various issues
        if (this.metrics.wsl.isWSL && !this.metrics.wsl.hasWslConfig) score -= 15;
        if (this.metrics.react.isReactProject && !this.metrics.react.hasPolling && this.metrics.system.onWindowsFS) score -= 20;
        if (!this.metrics.react.hasSourceMapDisabled) score -= 10;
        if (this.metrics.system.onWindowsFS) score -= 15;
        if (this.metrics.system.loadAverage > this.metrics.system.cpuCores) score -= 10;
        if (this.parseMemoryToGB(this.metrics.system.availableMemory) < 4) score -= 15;
        if (this.metrics.system.fileIOWrite > 100) score -= 10;
        if (!this.metrics.network.localhostReachable) score -= 5;

        return Math.max(0, score);
    }

    async run() {
        this.log('Starting WSL2 React Performance Analysis...', 'cyan');
        
        await this.getSystemInfo();
        await this.getWSLInfo();
        await this.getReactProjectInfo();
        await this.testNetworkPerformance();
        await this.testFileSystemPerformance();
        
        this.generateRecommendations();
        this.displayResults();
    }
}

// Run the performance monitor
if (require.main === module) {
    const monitor = new WSL2PerformanceMonitor();
    monitor.run().catch(error => {
        console.error('Error running performance monitor:', error);
        process.exit(1);
    });
}

module.exports = WSL2PerformanceMonitor;