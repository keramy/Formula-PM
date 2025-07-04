import { useEffect } from 'react';
import { notificationService } from '../services/notifications/notificationService';
import { PerformanceMonitor } from '../utils/performance';

/**
 * Custom hook for application initialization
 * Handles performance monitoring and notification service setup
 */
export const useAppInitialization = (teamMembers, projects, tasks) => {
  // Initialize performance monitoring
  useEffect(() => {
    try {
      PerformanceMonitor.init();
      
      // Optional: Log performance metrics during development
      if (import.meta.env.MODE === 'development') {
        console.log('🚀 Performance monitoring initialized');
      }
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
    }
  }, []);

  // Initialize notification service when data is available
  useEffect(() => {
    if (teamMembers.length > 0 && projects.length > 0 && tasks.length > 0) {
      try {
        notificationService.init(teamMembers, projects, tasks);
        
        if (import.meta.env.MODE === 'development') {
          console.log('🔔 Notification service initialized with:', {
            teamMembers: teamMembers.length,
            projects: projects.length,
            tasks: tasks.length
          });
        }
        
        // Cleanup on unmount
        return () => {
          try {
            notificationService.destroy();
            if (import.meta.env.MODE === 'development') {
              console.log('🔔 Notification service destroyed');
            }
          } catch (error) {
            console.error('Error destroying notification service:', error);
          }
        };
      } catch (error) {
        console.error('Failed to initialize notification service:', error);
      }
    }
  }, [teamMembers, projects, tasks]);

  // Additional initialization logic can be added here
  // For example:
  // - Check for browser notifications permission
  // - Initialize WebSocket connections
  // - Set up global error handlers
  // - Check for updates
  // - Load user preferences

  // Request notification permission on initialization
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      // Request permission after a slight delay to avoid blocking initial render
      setTimeout(() => {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('✅ Browser notifications enabled');
          } else if (permission === 'denied') {
            console.log('❌ Browser notifications denied');
          }
        });
      }, 2000);
    }
  }, []);

  // Monitor performance and log warnings in development
  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      const checkPerformance = () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          if (loadTime > 3000) {
            console.warn(`⚠️ Page load time is ${loadTime}ms, consider optimization`);
          }
        }
      };

      // Check after page load
      if (document.readyState === 'complete') {
        checkPerformance();
      } else {
        window.addEventListener('load', checkPerformance);
        return () => window.removeEventListener('load', checkPerformance);
      }
    }
  }, []);

  return {
    // Can return initialization status or methods if needed
    isInitialized: true,
    performanceMonitor: PerformanceMonitor,
    notificationService
  };
};