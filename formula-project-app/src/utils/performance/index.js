/**
 * Performance utilities barrel exports
 * Centralized access to all performance monitoring tools
 */

// Export the performance monitor class
export { default as PerformanceMonitor } from './monitor';
export { default } from './monitor';

// Export the performance monitor component
export { default as PerformanceMonitorComponent } from './component';

// Re-export everything for convenience
export * from './monitor';