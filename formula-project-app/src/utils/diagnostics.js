// Comprehensive diagnostic utilities for Formula PM
export class DiagnosticTools {
  static async generateHealthReport() {
    const report = {
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        nodeEnv: import.meta.env.MODE,
        reactVersion: React.version,
      },
      performance: await this.getPerformanceMetrics(),
      network: await this.checkNetworkConnectivity(),
      localStorage: this.checkLocalStorage(),
      errors: this.getRecentErrors(),
      recommendations: [],
    };

    // Generate recommendations based on findings
    report.recommendations = this.generateRecommendations(report);
    
    return report;
  }

  static async getPerformanceMetrics() {
    const perfData = performance.getEntriesByType('navigation')[0];
    
    return {
      pageLoadTime: perfData ? Math.round(perfData.loadEventEnd - perfData.fetchStart) : null,
      domContentLoaded: perfData ? Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart) : null,
      firstPaint: this.getFirstPaint(),
      memoryUsage: this.getMemoryUsage(),
      bundleSize: await this.getBundleSize(),
    };
  }

  static getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? Math.round(firstPaint.startTime) : null;
  }

  static getMemoryUsage() {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), // MB
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024), // MB
        jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024), // MB
      };
    }
    return null;
  }

  static async getBundleSize() {
    try {
      const entries = performance.getEntriesByType('resource');
      const jsFiles = entries.filter(entry => entry.name.includes('.js') && !entry.name.includes('node_modules'));
      const totalSize = jsFiles.reduce((total, file) => total + (file.transferSize || 0), 0);
      return Math.round(totalSize / 1024); // KB
    } catch (error) {
      return null;
    }
  }

  static async checkNetworkConnectivity() {
    const results = {
      frontend: { status: 'unknown', responseTime: null },
      backend: { status: 'unknown', responseTime: null },
      external: { status: 'unknown', responseTime: null },
    };

    // Test frontend connectivity (current page)
    try {
      const start = performance.now();
      await fetch(window.location.origin, { method: 'HEAD' });
      results.frontend = { 
        status: 'connected', 
        responseTime: Math.round(performance.now() - start) 
      };
    } catch (error) {
      results.frontend = { status: 'error', error: error.message };
    }

    // Test backend connectivity
    try {
      const start = performance.now();
      await fetch('/api/health');
      results.backend = { 
        status: 'connected', 
        responseTime: Math.round(performance.now() - start) 
      };
    } catch (error) {
      results.backend = { status: 'error', error: error.message };
    }

    return results;
  }

  static checkLocalStorage() {
    try {
      const testKey = '__diagnostic_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      const usage = this.getLocalStorageUsage();
      return {
        available: true,
        usage: usage,
        keys: Object.keys(localStorage).length,
      };
    } catch (error) {
      return {
        available: false,
        error: error.message,
      };
    }
  }

  static getLocalStorageUsage() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return Math.round(total / 1024); // KB
  }

  static getRecentErrors() {
    // This would integrate with error tracking
    const errors = window.__FORMULA_PM_ERRORS__ || [];
    return errors.slice(-5); // Last 5 errors
  }

  static generateRecommendations(report) {
    const recommendations = [];

    // Performance recommendations
    if (report.performance.pageLoadTime > 3000) {
      recommendations.push({
        type: 'performance',
        severity: 'high',
        message: 'Page load time is slow (>3s). Consider code splitting or bundle optimization.',
      });
    }

    if (report.performance.bundleSize > 5000) {
      recommendations.push({
        type: 'performance',
        severity: 'medium',
        message: 'Bundle size is large (>5MB). Consider lazy loading components.',
      });
    }

    // Network recommendations
    if (report.network.backend.status === 'error') {
      recommendations.push({
        type: 'network',
        severity: 'critical',
        message: 'Backend is not accessible. Check if formula-backend is running on port 5001.',
      });
    }

    // Memory recommendations
    const memory = report.performance.memoryUsage;
    if (memory && memory.usedJSHeapSize > 100) {
      recommendations.push({
        type: 'memory',
        severity: 'medium',
        message: 'Memory usage is high (>100MB). Check for memory leaks.',
      });
    }

    return recommendations;
  }

  static async exportDiagnosticReport() {
    const report = await this.generateHealthReport();
    const reportContent = `# Formula PM Diagnostic Report
Generated: ${report.timestamp}

## Summary
- Environment: ${report.environment.nodeEnv}
- Page Load Time: ${report.performance.pageLoadTime}ms
- Backend Status: ${report.network.backend.status}
- Memory Usage: ${report.performance.memoryUsage?.usedJSHeapSize || 'N/A'}MB

## Recommendations
${report.recommendations.map(rec => `- ${rec.severity.toUpperCase()}: ${rec.message}`).join('\n')}

## Full Report
\`\`\`json
${JSON.stringify(report, null, 2)}
\`\`\`
`;

    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `formula-pm-diagnostic-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);

    return report;
  }
}

export default DiagnosticTools;