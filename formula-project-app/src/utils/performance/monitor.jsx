import React from 'react';

/**
 * Performance monitoring utilities for Formula PM
 * Tracks key metrics and prevents performance regressions
 */

class PerformanceMonitor {
  static measurements = new Map();
  static thresholds = {
    componentRender: 300, // ms
    apiRequest: 2000, // ms
    searchOperation: 50, // ms
    bundleSize: 10 * 1024 * 1024, // 10MB
    hotReload: 500, // ms
    buildTime: 5000, // ms
    // Formula PM specific thresholds
    projectPageLoad: 1000, // ms
    scopeItemsLoad: 800, // ms
    shopDrawingsLoad: 1200, // ms
    materialSpecsLoad: 1000, // ms
    workflowAnalysis: 500, // ms
    notificationDelivery: 100, // ms
  };

  static diagnostics = {
    totalComponents: 0,
    renderCount: 0,
    errorCount: 0,
    lastError: null,
    startTime: Date.now(),
  };

  /**
   * Start measuring a performance metric
   * @param {string} name - Unique name for the measurement
   */
  static startMeasurement(name) {
    this.measurements.set(name, performance.now());
    // Add performance mark for DevTools
    if (typeof performance.mark === 'function') {
      performance.mark(`${name}-start`);
    }
  }

  /**
   * End measuring and log the result
   * @param {string} name - Name of the measurement to end
   * @returns {number} Duration in milliseconds
   */
  static endMeasurement(name) {
    const start = this.measurements.get(name);
    if (start) {
      const duration = performance.now() - start;
      
      // Add performance measure for DevTools
      if (typeof performance.measure === 'function') {
        try {
          performance.measure(name, `${name}-start`);
        } catch (e) {
          // Ignore if mark doesn't exist
        }
      }

      // Log with appropriate level based on performance
      const threshold = this.thresholds[name] || 1000;
      const logLevel = duration > threshold ? 'warn' : 'log';
      
      console[logLevel](`⏱️ ${name}: ${duration.toFixed(2)}ms ${duration > threshold ? '⚠️ SLOW' : '✅'}`);
      
      this.measurements.delete(name);
      
      // Send to analytics in production
      if (import.meta.env.MODE === 'production') {
        this.sendAnalytics(name, duration);
      }
      
      return duration;
    }
    return 0;
  }

  /**
   * Measure function execution time
   * @param {string} name - Name for the measurement
   * @param {Function} fn - Function to measure
   * @returns {Function} Wrapped function
   */
  static measureFunction(name, fn) {
    return async (...args) => {
      this.startMeasurement(name);
      try {
        const result = await fn(...args);
        this.endMeasurement(name);
        return result;
      } catch (error) {
        this.endMeasurement(name);
        throw error;
      }
    };
  }

  /**
   * Measure React component render time
   * @param {string} componentName - Name of the component
   * @returns {Object} Hook functions for component measurement
   */
  static useComponentMeasurement(componentName) {
    return {
      onRenderStart: () => this.startMeasurement(`${componentName} Render`),
      onRenderEnd: () => this.endMeasurement(`${componentName} Render`),
    };
  }

  /**
   * Send performance data to analytics service
   * @param {string} metric - Metric name
   * @param {number} value - Metric value
   * @param {Object} metadata - Additional metadata
   */
  static sendAnalytics(metric, value, metadata = {}) {
    // In a real app, this would send to your analytics service
    // For now, we'll just store in localStorage for debugging
    try {
      const perfData = JSON.parse(localStorage.getItem('formula-pm-perf') || '[]');
      perfData.push({
        metric,
        value,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent.substring(0, 100),
        url: window.location.pathname,
        ...metadata
      });
      
      // Keep only last 100 entries
      if (perfData.length > 100) {
        perfData.splice(0, perfData.length - 100);
      }
      
      localStorage.setItem('formula-pm-perf', JSON.stringify(perfData));
    } catch (e) {
      console.warn('Failed to store performance data:', e);
    }
  }

  /**
   * Get performance analytics data
   * @returns {Array} Performance data array
   */
  static getAnalytics() {
    try {
      return JSON.parse(localStorage.getItem('formula-pm-perf') || '[]');
    } catch (e) {
      return [];
    }
  }

  /**
   * Clear performance analytics data
   */
  static clearAnalytics() {
    localStorage.removeItem('formula-pm-perf');
  }

  /**
   * Get Core Web Vitals
   * @returns {Promise<Object>} Web vitals data
   */
  static async getCoreWebVitals() {
    try {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
      
      const vitals = {};
      
      return new Promise((resolve) => {
        let collected = 0;
        const total = 5;
        
        const finish = () => {
          collected++;
          if (collected === total) {
            resolve(vitals);
          }
        };

        getCLS((metric) => { vitals.cls = metric; finish(); });
        getFID((metric) => { vitals.fid = metric; finish(); });
        getFCP((metric) => { vitals.fcp = metric; finish(); });
        getLCP((metric) => { vitals.lcp = metric; finish(); });
        getTTFB((metric) => { vitals.ttfb = metric; finish(); });
      });
    } catch (e) {
      console.warn('Core Web Vitals not available:', e);
      return {};
    }
  }

  /**
   * Monitor bundle size and warn if exceeded
   */
  static monitorBundleSize() {
    if (typeof performance.getEntriesByType === 'function') {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation && navigation.transferSize) {
        const bundleSize = navigation.transferSize;
        
        if (bundleSize > this.thresholds.bundleSize) {
          console.warn(`📦 Bundle size warning: ${(bundleSize / 1024 / 1024).toFixed(2)}MB exceeds ${(this.thresholds.bundleSize / 1024 / 1024).toFixed(2)}MB threshold`);
        } else {
          console.log(`📦 Bundle size: ${(bundleSize / 1024 / 1024).toFixed(2)}MB ✅`);
        }
      }
    }
  }

  /**
   * Track API request performance
   * @param {string} endpoint - API endpoint
   * @param {number} duration - Request duration in ms
   * @param {boolean} success - Whether request was successful
   * @param {string} method - HTTP method
   */
  static trackApiRequest(endpoint, duration, success, method = 'GET') {
    const metricName = `api_${method.toLowerCase()}_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`;
    
    // Log with appropriate level
    const threshold = this.thresholds.apiRequest;
    const logLevel = duration > threshold ? 'warn' : 'log';
    const status = success ? '✅' : '❌';
    
    console[logLevel](`🌐 API ${method} ${endpoint}: ${duration.toFixed(2)}ms ${status} ${duration > threshold ? '⚠️ SLOW' : ''}`);
    
    // Store for analytics
    if (import.meta.env.MODE === 'production') {
      this.sendAnalytics(metricName, duration, {
        endpoint,
        method,
        success,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Track Formula PM specific operations
   * @param {string} operation - Operation name
   * @param {number} duration - Duration in ms
   * @param {Object} metadata - Additional metadata
   */
  static trackFormulaPMOperation(operation, duration, metadata = {}) {
    const threshold = this.thresholds[operation] || 1000;
    const logLevel = duration > threshold ? 'warn' : 'log';
    
    console[logLevel](`🏗️ Formula PM ${operation}: ${duration.toFixed(2)}ms ${duration > threshold ? '⚠️ SLOW' : '✅'}`, metadata);
    
    if (import.meta.env.MODE === 'production') {
      this.sendAnalytics(`formula_pm_${operation}`, duration, metadata);
    }
  }

  /**
   * Track user interactions for UX optimization
   * @param {string} action - User action (click, scroll, etc.)
   * @param {string} element - Element identifier
   * @param {number} duration - Time to complete action
   */
  static trackUserInteraction(action, element, duration) {
    const metricName = `user_${action}_${element}`;
    
    if (duration > 200) { // Only log slow interactions
      console.log(`👤 User ${action} on ${element}: ${duration.toFixed(2)}ms`);
    }
    
    if (import.meta.env.MODE === 'production') {
      this.sendAnalytics(metricName, duration, {
        action,
        element,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Initialize performance monitoring
   */
  static init() {
    console.log('🚀 Performance monitoring initialized');
    
    // Monitor bundle size
    if (document.readyState === 'complete') {
      this.monitorBundleSize();
    } else {
      window.addEventListener('load', () => this.monitorBundleSize());
    }

    // Monitor memory usage
    if (typeof performance.memory !== 'undefined') {
      setInterval(() => {
        const memory = performance.memory;
        const used = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
        const total = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
        const limit = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
        
        if (used > 100) { // Warn if over 100MB
          console.warn(`🧠 Memory usage: ${used}MB/${total}MB (limit: ${limit}MB) ⚠️`);
        }
      }, 60000); // Check every minute
    }

    // Log initial performance markers
    this.logInitialMetrics();
  }

  /**
   * Log initial performance metrics
   */
  static logInitialMetrics() {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log('📊 Initial Performance Metrics:');
        console.log(`  DNS Lookup: ${perfData.domainLookupEnd - perfData.domainLookupStart}ms`);
        console.log(`  Connection: ${perfData.connectEnd - perfData.connectStart}ms`);
        console.log(`  Response: ${perfData.responseEnd - perfData.responseStart}ms`);
        console.log(`  DOM Interactive: ${perfData.domInteractive - perfData.navigationStart}ms`);
        console.log(`  DOM Complete: ${perfData.domComplete - perfData.navigationStart}ms`);
        console.log(`  Load Complete: ${perfData.loadEventEnd - perfData.navigationStart}ms`);
      }
    }, 2000);
  }
}

// React Hook for component performance measurement
export const usePerformanceMeasurement = (componentName) => {
  const measurement = PerformanceMonitor.useComponentMeasurement(componentName);
  
  React.useEffect(() => {
    measurement.onRenderStart();
    return () => measurement.onRenderEnd();
  });
};

// HOC for automatic component performance measurement
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  const name = componentName || WrappedComponent.displayName || WrappedComponent.name;
  
  return React.memo((props) => {
    const measurement = PerformanceMonitor.useComponentMeasurement(name);
    
    React.useEffect(() => {
      measurement.onRenderStart();
      return () => measurement.onRenderEnd();
    });
    
    return React.createElement(WrappedComponent, props);
  });
};

// Hook for Formula PM specific operation timing
export const useFormulaPMTiming = (operationName) => {
  const startTiming = React.useCallback(() => {
    PerformanceMonitor.startMeasurement(operationName);
  }, [operationName]);

  const endTiming = React.useCallback((metadata = {}) => {
    const duration = PerformanceMonitor.endMeasurement(operationName);
    PerformanceMonitor.trackFormulaPMOperation(operationName, duration, metadata);
    return duration;
  }, [operationName]);

  return { startTiming, endTiming };
};

// Hook for user interaction timing
export const useUserInteractionTiming = () => {
  const trackInteraction = React.useCallback((action, element) => {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      PerformanceMonitor.trackUserInteraction(action, element, duration);
    };
  }, []);

  return { trackInteraction };
};

export default PerformanceMonitor;