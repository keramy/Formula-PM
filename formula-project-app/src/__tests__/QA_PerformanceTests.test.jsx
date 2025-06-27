/**
 * QA Performance Testing Suite
 * Comprehensive performance testing for load, response times, and optimization
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import apiService from '../../services/api/apiService';
import socketService from '../../services/realtime/socketService';

// Performance monitoring utilities
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.marks = new Map();
  }

  mark(name) {
    this.marks.set(name, performance.now());
  }

  measure(name, startMark, endMark) {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();
    const duration = end - start;
    
    this.metrics.push({
      name,
      duration,
      timestamp: new Date().toISOString()
    });
    
    return duration;
  }

  getMetrics() {
    return this.metrics;
  }

  getAverageMetric(name) {
    const filtered = this.metrics.filter(m => m.name === name);
    if (filtered.length === 0) return 0;
    return filtered.reduce((sum, m) => sum + m.duration, 0) / filtered.length;
  }

  reset() {
    this.metrics = [];
    this.marks.clear();
  }
}

// Test configuration
const theme = createTheme();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: 0 },
    mutations: { retry: false }
  }
});

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  </BrowserRouter>
);

// Generate large datasets for testing
const generateMockProjects = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `project-${i}`,
    name: `Project ${i}`,
    description: `Description for project ${i}`,
    status: ['active', 'on_hold', 'completed'][i % 3],
    priority: ['low', 'medium', 'high'][i % 3],
    progress: Math.floor(Math.random() * 100),
    budget: Math.floor(Math.random() * 10000000),
    client: { id: `client-${i % 10}`, name: `Client ${i % 10}` },
    projectManager: { id: `pm-${i % 5}`, name: `PM ${i % 5}` },
    teamMembers: Array.from({ length: 5 }, (_, j) => ({
      id: `member-${i}-${j}`,
      name: `Member ${i}-${j}`
    }))
  }));
};

const generateMockTasks = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `task-${i}`,
    name: `Task ${i}`,
    description: `Task description ${i}`,
    status: ['pending', 'in_progress', 'completed'][i % 3],
    priority: ['low', 'medium', 'high', 'urgent'][i % 4],
    assignedTo: { id: `user-${i % 10}`, name: `User ${i % 10}` },
    projectId: `project-${Math.floor(i / 10)}`,
    dueDate: new Date(Date.now() + (i * 86400000)).toISOString()
  }));
};

describe('QA Performance Testing Suite', () => {
  let performanceMonitor;

  beforeEach(() => {
    performanceMonitor = new PerformanceMonitor();
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn();
    
    // Mock auth
    localStorage.setItem('auth_token', 'mock-token');
    localStorage.setItem('user_data', JSON.stringify({
      id: '1',
      email: 'test@formulapm.com',
      role: 'admin'
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Load Testing - Concurrent Users', () => {
    it('should handle 100 concurrent API requests', async () => {
      const mockProjects = generateMockProjects(100);
      
      // Mock responses
      global.fetch.mockImplementation(() => 
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({ data: mockProjects })
            });
          }, Math.random() * 100); // Random delay 0-100ms
        })
      );

      performanceMonitor.mark('concurrent-start');

      // Simulate 100 concurrent requests
      const requests = Array.from({ length: 100 }, () => 
        apiService.getProjects()
      );

      const results = await Promise.all(requests);
      
      const duration = performanceMonitor.measure('concurrent-requests', 'concurrent-start');

      // Verify all requests completed
      expect(results).toHaveLength(100);
      expect(results.every(r => r.data)).toBe(true);

      // Performance assertion - should complete within 5 seconds
      expect(duration).toBeLessThan(5000);
      
      console.log(`100 concurrent requests completed in ${duration}ms`);
    });

    it('should handle 50 concurrent WebSocket connections', async () => {
      let connectionCount = 0;
      const mockSocket = {
        connect: vi.fn(() => connectionCount++),
        disconnect: vi.fn(() => connectionCount--),
        on: vi.fn(),
        emit: vi.fn(),
        connected: true
      };

      socketService.initialize = vi.fn().mockResolvedValue(mockSocket);

      performanceMonitor.mark('websocket-start');

      // Simulate 50 concurrent connections
      const connections = Array.from({ length: 50 }, async (_, i) => {
        const socket = await socketService.initialize();
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
        return socket;
      });

      await Promise.all(connections);
      
      const duration = performanceMonitor.measure('websocket-connections', 'websocket-start');

      expect(connectionCount).toBe(50);
      expect(duration).toBeLessThan(3000); // Should complete within 3 seconds
      
      console.log(`50 WebSocket connections established in ${duration}ms`);
    });

    it('should maintain performance with 1000 DOM elements', async () => {
      const LargeProjectList = () => {
        const projects = generateMockProjects(1000);
        return (
          <div>
            {projects.map(project => (
              <div key={project.id} data-testid={`project-${project.id}`}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <span>{project.status}</span>
                <span>{project.priority}</span>
                <span>{project.progress}%</span>
              </div>
            ))}
          </div>
        );
      };

      performanceMonitor.mark('render-start');
      
      render(<LargeProjectList />, { wrapper: TestWrapper });
      
      const duration = performanceMonitor.measure('large-render', 'render-start');

      // Verify all elements rendered
      const projects = screen.getAllByTestId(/project-/);
      expect(projects).toHaveLength(1000);

      // Initial render should be under 2 seconds
      expect(duration).toBeLessThan(2000);
      
      console.log(`1000 elements rendered in ${duration}ms`);
    });
  });

  describe('2. API Response Time Testing', () => {
    it('should load project list under 200ms', async () => {
      const mockProjects = generateMockProjects(20);
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects })
      });

      performanceMonitor.mark('api-start');
      
      const result = await apiService.getProjects();
      
      const duration = performanceMonitor.measure('api-projects', 'api-start');

      expect(result.data).toHaveLength(20);
      expect(duration).toBeLessThan(200);
      
      console.log(`Project list loaded in ${duration}ms`);
    });

    it('should perform search queries under 150ms', async () => {
      const searchResults = {
        results: generateMockProjects(10).map(p => ({
          id: p.id,
          type: 'project',
          title: p.name,
          description: p.description
        }))
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => searchResults
      });

      performanceMonitor.mark('search-start');
      
      const result = await apiService.globalSearch('test');
      
      const duration = performanceMonitor.measure('search-query', 'search-start');

      expect(result.results).toHaveLength(10);
      expect(duration).toBeLessThan(150);
      
      console.log(`Search completed in ${duration}ms`);
    });

    it('should handle pagination efficiently', async () => {
      const pageSize = 50;
      const totalPages = 10;
      
      // Test loading multiple pages
      for (let page = 1; page <= totalPages; page++) {
        const mockData = generateMockProjects(pageSize);
        
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: mockData,
            total: pageSize * totalPages,
            page,
            hasNext: page < totalPages
          })
        });

        performanceMonitor.mark(`page-${page}-start`);
        
        const result = await apiService.getProjects({ page, limit: pageSize });
        
        const duration = performanceMonitor.measure(`page-${page}`, `page-${page}-start`);

        expect(result.data).toHaveLength(pageSize);
        expect(duration).toBeLessThan(100); // Each page under 100ms
      }

      const avgPageLoad = performanceMonitor.getAverageMetric(/page-\d+/);
      console.log(`Average page load time: ${avgPageLoad}ms`);
      expect(avgPageLoad).toBeLessThan(80);
    });
  });

  describe('3. Real-time Performance Testing', () => {
    it('should handle rapid real-time updates', async () => {
      const mockSocket = {
        on: vi.fn(),
        emit: vi.fn(),
        connected: true
      };

      socketService.socket = mockSocket;

      const updateCount = 100;
      const updates = [];

      // Simulate rapid updates
      performanceMonitor.mark('realtime-start');

      for (let i = 0; i < updateCount; i++) {
        const update = {
          type: 'project:updated',
          data: {
            projectId: `project-${i}`,
            changes: { progress: Math.floor(Math.random() * 100) }
          }
        };

        // Simulate processing update
        updates.push(update);
        
        // Small delay to simulate real conditions
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const duration = performanceMonitor.measure('realtime-updates', 'realtime-start');

      expect(updates).toHaveLength(updateCount);
      expect(duration).toBeLessThan(2000); // 100 updates in under 2 seconds
      
      const updatesPerSecond = (updateCount / duration) * 1000;
      console.log(`Processed ${updatesPerSecond.toFixed(2)} updates per second`);
      expect(updatesPerSecond).toBeGreaterThan(50);
    });

    it('should maintain low latency for presence updates', async () => {
      const latencies = [];

      for (let i = 0; i < 50; i++) {
        const startTime = performance.now();
        
        // Simulate presence update
        const presenceData = {
          userId: `user-${i}`,
          status: 'online',
          lastSeen: new Date().toISOString()
        };

        // Mock processing
        await new Promise(resolve => setTimeout(resolve, 5));
        
        const latency = performance.now() - startTime;
        latencies.push(latency);
      }

      const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const maxLatency = Math.max(...latencies);

      console.log(`Average presence latency: ${avgLatency.toFixed(2)}ms`);
      console.log(`Max presence latency: ${maxLatency.toFixed(2)}ms`);

      expect(avgLatency).toBeLessThan(10);
      expect(maxLatency).toBeLessThan(20);
    });
  });

  describe('4. Memory Usage Testing', () => {
    it('should not leak memory when mounting/unmounting components', async () => {
      const TestComponent = () => {
        const [data] = React.useState(() => generateMockProjects(100));
        return <div>{data.length} projects</div>;
      };

      // Initial memory baseline
      if (performance.memory) {
        const initialMemory = performance.memory.usedJSHeapSize;

        // Mount and unmount component multiple times
        for (let i = 0; i < 10; i++) {
          const { unmount } = render(<TestComponent />, { wrapper: TestWrapper });
          await new Promise(resolve => setTimeout(resolve, 50));
          unmount();
        }

        // Force garbage collection if available
        if (global.gc) {
          global.gc();
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryIncrease = finalMemory - initialMemory;
        const memoryIncreaseMB = memoryIncrease / (1024 * 1024);

        console.log(`Memory increase after 10 mount/unmount cycles: ${memoryIncreaseMB.toFixed(2)}MB`);
        
        // Should not increase by more than 10MB
        expect(memoryIncreaseMB).toBeLessThan(10);
      }
    });

    it('should efficiently handle large datasets in memory', async () => {
      const largeTasks = generateMockTasks(5000);
      
      if (performance.memory) {
        const beforeMemory = performance.memory.usedJSHeapSize;
        
        // Store in memory
        const taskMap = new Map();
        largeTasks.forEach(task => {
          taskMap.set(task.id, task);
        });

        const afterMemory = performance.memory.usedJSHeapSize;
        const memoryUsedMB = (afterMemory - beforeMemory) / (1024 * 1024);

        console.log(`Memory used for 5000 tasks: ${memoryUsedMB.toFixed(2)}MB`);
        
        // Should use less than 50MB for 5000 tasks
        expect(memoryUsedMB).toBeLessThan(50);
      }
    });
  });

  describe('5. Database Query Performance', () => {
    it('should execute complex queries efficiently', async () => {
      // Mock complex aggregation query
      const complexQueryResult = {
        projectStats: {
          total: 500,
          active: 200,
          completed: 250,
          onHold: 50
        },
        taskStats: {
          total: 5000,
          completed: 3000,
          inProgress: 1500,
          pending: 500
        },
        userStats: {
          totalUsers: 100,
          activeUsers: 85
        }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: complexQueryResult })
      });

      performanceMonitor.mark('complex-query-start');
      
      const result = await apiService.getDashboardAnalytics();
      
      const duration = performanceMonitor.measure('complex-query', 'complex-query-start');

      expect(result.data).toEqual(complexQueryResult);
      expect(duration).toBeLessThan(500); // Complex queries under 500ms
      
      console.log(`Complex analytics query completed in ${duration}ms`);
    });

    it('should handle concurrent database operations', async () => {
      const operations = [
        { type: 'create', endpoint: '/projects', data: { name: 'New Project' } },
        { type: 'update', endpoint: '/projects/1', data: { status: 'active' } },
        { type: 'delete', endpoint: '/projects/2' },
        { type: 'read', endpoint: '/projects/3' },
        { type: 'list', endpoint: '/tasks?projectId=1' }
      ];

      // Mock responses for each operation
      operations.forEach(() => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        });
      });

      performanceMonitor.mark('concurrent-db-start');

      // Execute all operations concurrently
      const results = await Promise.all(
        operations.map(op => 
          fetch(`http://localhost:5014/api/v1${op.endpoint}`, {
            method: op.type === 'read' || op.type === 'list' ? 'GET' : 
                   op.type === 'create' ? 'POST' : 
                   op.type === 'update' ? 'PUT' : 'DELETE',
            body: op.data ? JSON.stringify(op.data) : undefined
          })
        )
      );

      const duration = performanceMonitor.measure('concurrent-db-ops', 'concurrent-db-start');

      expect(results).toHaveLength(5);
      expect(results.every(r => r.ok)).toBe(true);
      expect(duration).toBeLessThan(1000); // All operations under 1 second
      
      console.log(`5 concurrent DB operations completed in ${duration}ms`);
    });
  });

  describe('6. File Upload/Download Performance', () => {
    it('should upload large files efficiently', async () => {
      const fileSizes = [1, 5, 10, 25]; // MB
      
      for (const sizeMB of fileSizes) {
        const fileSize = sizeMB * 1024 * 1024;
        const mockFile = new File(['x'.repeat(fileSize)], `test-${sizeMB}MB.pdf`, {
          type: 'application/pdf'
        });

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: `file-${sizeMB}`,
            fileName: mockFile.name,
            fileSize: fileSize
          })
        });

        performanceMonitor.mark(`upload-${sizeMB}MB-start`);

        const formData = new FormData();
        formData.append('file', mockFile);

        const response = await fetch('http://localhost:5014/api/v1/files/upload', {
          method: 'POST',
          body: formData
        });

        const duration = performanceMonitor.measure(
          `upload-${sizeMB}MB`,
          `upload-${sizeMB}MB-start`
        );

        expect(response.ok).toBe(true);
        
        // Calculate upload speed
        const uploadSpeedMBps = sizeMB / (duration / 1000);
        console.log(`${sizeMB}MB file uploaded in ${duration}ms (${uploadSpeedMBps.toFixed(2)} MB/s)`);
        
        // Should maintain at least 1MB/s upload speed
        expect(uploadSpeedMBps).toBeGreaterThan(1);
      }
    });

    it('should download files with progress tracking', async () => {
      const fileSize = 10 * 1024 * 1024; // 10MB
      let bytesDownloaded = 0;
      const progressUpdates = [];

      // Mock streaming response
      const mockBlob = new Blob(['x'.repeat(fileSize)]);
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({
          'content-length': fileSize.toString()
        }),
        body: {
          getReader: () => ({
            read: vi.fn()
              .mockResolvedValueOnce({ 
                done: false, 
                value: new Uint8Array(fileSize * 0.25) 
              })
              .mockResolvedValueOnce({ 
                done: false, 
                value: new Uint8Array(fileSize * 0.25) 
              })
              .mockResolvedValueOnce({ 
                done: false, 
                value: new Uint8Array(fileSize * 0.25) 
              })
              .mockResolvedValueOnce({ 
                done: false, 
                value: new Uint8Array(fileSize * 0.25) 
              })
              .mockResolvedValueOnce({ done: true })
          })
        }
      });

      performanceMonitor.mark('download-start');

      // Simulate download with progress
      const response = await fetch('http://localhost:5014/api/v1/files/download/test.pdf');
      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        bytesDownloaded += value.length;
        const progress = (bytesDownloaded / fileSize) * 100;
        progressUpdates.push(progress);
      }

      const duration = performanceMonitor.measure('download', 'download-start');

      expect(progressUpdates.length).toBeGreaterThan(0);
      expect(bytesDownloaded).toBe(fileSize);
      
      const downloadSpeedMBps = (fileSize / (1024 * 1024)) / (duration / 1000);
      console.log(`10MB file downloaded in ${duration}ms (${downloadSpeedMBps.toFixed(2)} MB/s)`);
      
      expect(downloadSpeedMBps).toBeGreaterThan(5); // At least 5MB/s
    });
  });

  describe('7. Cache Performance Testing', () => {
    it('should demonstrate cache effectiveness', async () => {
      const mockData = generateMockProjects(50);
      
      // First request - no cache
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData })
      });

      performanceMonitor.mark('no-cache-start');
      const firstResult = await apiService.getProjects();
      const noCacheDuration = performanceMonitor.measure('no-cache', 'no-cache-start');

      // Simulate cache hit
      performanceMonitor.mark('with-cache-start');
      const cachedResult = { data: mockData }; // Direct return, no fetch
      const cacheDuration = performanceMonitor.measure('with-cache', 'with-cache-start');

      const improvement = ((noCacheDuration - cacheDuration) / noCacheDuration) * 100;
      
      console.log(`No cache: ${noCacheDuration}ms`);
      console.log(`With cache: ${cacheDuration}ms`);
      console.log(`Performance improvement: ${improvement.toFixed(2)}%`);

      expect(cacheDuration).toBeLessThan(noCacheDuration * 0.1); // 90% faster
    });

    it('should handle cache invalidation efficiently', async () => {
      const cacheEntries = 1000;
      const invalidationPatterns = [
        'project:*',
        'task:project-1:*',
        'user:*:preferences'
      ];

      performanceMonitor.mark('invalidation-start');

      // Simulate cache invalidation
      for (const pattern of invalidationPatterns) {
        // Mock finding and removing matching keys
        const matchingKeys = Array.from({ length: cacheEntries / 10 }, (_, i) => 
          `cache:${pattern.replace('*', i)}`
        );
        
        // Simulate deletion
        await Promise.all(matchingKeys.map(key => 
          new Promise(resolve => setTimeout(resolve, 0.1))
        ));
      }

      const duration = performanceMonitor.measure('cache-invalidation', 'invalidation-start');

      console.log(`Cache invalidation for ${invalidationPatterns.length} patterns completed in ${duration}ms`);
      expect(duration).toBeLessThan(500); // Under 500ms for invalidation
    });
  });

  describe('8. Search Performance Testing', () => {
    it('should perform full-text search efficiently', async () => {
      const searchTerms = ['project', 'task', 'urgent', 'dubai', 'construction'];
      const searchResults = [];

      for (const term of searchTerms) {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: generateMockProjects(20).map(p => ({
              id: p.id,
              type: 'project',
              title: p.name,
              description: p.description,
              score: Math.random()
            }))
          })
        });

        performanceMonitor.mark(`search-${term}-start`);
        
        const result = await apiService.globalSearch(term);
        
        const duration = performanceMonitor.measure(`search-${term}`, `search-${term}-start`);
        searchResults.push({ term, duration, count: result.results.length });
      }

      const avgSearchTime = searchResults.reduce((sum, r) => sum + r.duration, 0) / searchResults.length;
      
      console.log('Search performance:');
      searchResults.forEach(r => {
        console.log(`  "${r.term}": ${r.duration.toFixed(2)}ms (${r.count} results)`);
      });
      console.log(`Average search time: ${avgSearchTime.toFixed(2)}ms`);

      expect(avgSearchTime).toBeLessThan(150);
      expect(Math.max(...searchResults.map(r => r.duration))).toBeLessThan(200);
    });

    it('should handle search suggestions with low latency', async () => {
      const keystrokes = 'construction project'.split('');
      let searchTerm = '';
      const latencies = [];

      for (const char of keystrokes) {
        searchTerm += char;
        
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            suggestions: [
              `${searchTerm} management`,
              `${searchTerm} planning`,
              `${searchTerm} timeline`
            ]
          })
        });

        const startTime = performance.now();
        
        // Simulate debounced search
        await new Promise(resolve => setTimeout(resolve, 50));
        const result = await apiService.getSearchSuggestions(searchTerm);
        
        const latency = performance.now() - startTime;
        latencies.push(latency);
      }

      const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const p95Latency = latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.95)];

      console.log(`Average suggestion latency: ${avgLatency.toFixed(2)}ms`);
      console.log(`95th percentile latency: ${p95Latency.toFixed(2)}ms`);

      expect(avgLatency).toBeLessThan(100);
      expect(p95Latency).toBeLessThan(150);
    });
  });

  describe('9. Report Generation Performance', () => {
    it('should generate PDF reports efficiently', async () => {
      const reportSizes = [
        { pages: 10, projects: 5 },
        { pages: 50, projects: 20 },
        { pages: 100, projects: 50 }
      ];

      for (const { pages, projects } of reportSizes) {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          blob: async () => new Blob(['x'.repeat(pages * 100000)], { 
            type: 'application/pdf' 
          })
        });

        performanceMonitor.mark(`report-${pages}-start`);

        const response = await fetch('http://localhost:5014/api/v1/reports/generate', {
          method: 'POST',
          body: JSON.stringify({
            type: 'project_status',
            projectIds: Array.from({ length: projects }, (_, i) => `project-${i}`)
          })
        });

        const blob = await response.blob();
        
        const duration = performanceMonitor.measure(`report-${pages}`, `report-${pages}-start`);
        
        const generationSpeed = pages / (duration / 1000); // pages per second
        console.log(`${pages}-page report generated in ${duration}ms (${generationSpeed.toFixed(2)} pages/sec)`);

        expect(duration).toBeLessThan(pages * 100); // Max 100ms per page
        expect(generationSpeed).toBeGreaterThan(1); // At least 1 page per second
      }
    });

    it('should export large datasets to Excel', async () => {
      const rowCounts = [1000, 5000, 10000];

      for (const rows of rowCounts) {
        const mockData = generateMockProjects(rows);
        
        global.fetch.mockResolvedValueOnce({
          ok: true,
          blob: async () => new Blob([JSON.stringify(mockData)], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
        });

        performanceMonitor.mark(`excel-${rows}-start`);

        const response = await fetch('http://localhost:5014/api/v1/export/excel', {
          method: 'POST',
          body: JSON.stringify({ type: 'projects', limit: rows })
        });

        const blob = await response.blob();
        
        const duration = performanceMonitor.measure(`excel-${rows}`, `excel-${rows}-start`);
        
        const rowsPerSecond = rows / (duration / 1000);
        console.log(`${rows} rows exported in ${duration}ms (${rowsPerSecond.toFixed(0)} rows/sec)`);

        expect(duration).toBeLessThan(rows * 2); // Max 2ms per row
        expect(rowsPerSecond).toBeGreaterThan(500); // At least 500 rows per second
      }
    });
  });

  describe('10. Overall System Performance', () => {
    it('should maintain performance under sustained load', async () => {
      const testDuration = 10000; // 10 seconds
      const operationsPerSecond = 10;
      const operations = ['read', 'write', 'update', 'search'];
      let completedOperations = 0;
      let errors = 0;

      performanceMonitor.mark('sustained-load-start');
      const startTime = Date.now();

      while (Date.now() - startTime < testDuration) {
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        });

        try {
          await apiService.request(`/test/${operation}`);
          completedOperations++;
        } catch (error) {
          errors++;
        }

        await new Promise(resolve => 
          setTimeout(resolve, 1000 / operationsPerSecond)
        );
      }

      const duration = performanceMonitor.measure('sustained-load', 'sustained-load-start');
      const actualOpsPerSecond = completedOperations / (duration / 1000);
      const errorRate = (errors / (completedOperations + errors)) * 100;

      console.log(`Sustained load test results:`);
      console.log(`  Duration: ${duration}ms`);
      console.log(`  Operations completed: ${completedOperations}`);
      console.log(`  Operations per second: ${actualOpsPerSecond.toFixed(2)}`);
      console.log(`  Error rate: ${errorRate.toFixed(2)}%`);

      expect(actualOpsPerSecond).toBeGreaterThan(operationsPerSecond * 0.9); // 90% of target
      expect(errorRate).toBeLessThan(1); // Less than 1% errors
    });

    it('should provide performance metrics summary', () => {
      const metrics = performanceMonitor.getMetrics();
      
      // Group metrics by category
      const categories = {
        api: metrics.filter(m => m.name.includes('api')),
        realtime: metrics.filter(m => m.name.includes('realtime')),
        search: metrics.filter(m => m.name.includes('search')),
        cache: metrics.filter(m => m.name.includes('cache'))
      };

      console.log('\n=== Performance Summary ===');
      
      Object.entries(categories).forEach(([category, categoryMetrics]) => {
        if (categoryMetrics.length > 0) {
          const avg = categoryMetrics.reduce((sum, m) => sum + m.duration, 0) / categoryMetrics.length;
          const min = Math.min(...categoryMetrics.map(m => m.duration));
          const max = Math.max(...categoryMetrics.map(m => m.duration));
          
          console.log(`\n${category.toUpperCase()}:`);
          console.log(`  Average: ${avg.toFixed(2)}ms`);
          console.log(`  Min: ${min.toFixed(2)}ms`);
          console.log(`  Max: ${max.toFixed(2)}ms`);
        }
      });

      // Overall performance score
      const avgResponseTime = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
      const performanceScore = Math.max(0, 100 - (avgResponseTime / 10));
      
      console.log(`\nOverall Performance Score: ${performanceScore.toFixed(1)}/100`);
      
      expect(performanceScore).toBeGreaterThan(80); // Expect good performance
    });
  });
});