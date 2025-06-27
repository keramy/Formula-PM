/**
 * Optimistic Updates Utility
 * Handles optimistic UI updates with error rollback
 */

import { toast } from 'react-toastify';

class OptimisticUpdateManager {
  constructor() {
    this.pendingUpdates = new Map();
    this.rollbackCallbacks = new Map();
    this.errorHandlers = new Map();
  }

  /**
   * Perform an optimistic update
   * @param {string} id - Unique identifier for the update
   * @param {Function} optimisticUpdate - Function to apply optimistic changes
   * @param {Function} apiCall - Function that returns a promise for the actual API call
   * @param {Function} rollback - Function to rollback changes on error
   * @param {Object} options - Additional options
   */
  async performUpdate(id, optimisticUpdate, apiCall, rollback, options = {}) {
    const {
      successMessage,
      errorMessage,
      showLoading = true,
      timeout = 10000,
      retryCount = 1
    } = options;

    // Apply optimistic update immediately
    try {
      const optimisticResult = optimisticUpdate();
      this.pendingUpdates.set(id, { 
        timestamp: Date.now(),
        optimisticResult 
      });
      this.rollbackCallbacks.set(id, rollback);

      if (showLoading) {
        toast.info('Updating...', { autoClose: false, toastId: `loading-${id}` });
      }

      // Perform actual API call
      const result = await this.executeWithRetry(apiCall, retryCount, timeout);

      // Success - remove pending update
      this.cleanup(id);
      
      if (successMessage) {
        toast.dismiss(`loading-${id}`);
        toast.success(successMessage);
      }

      return { success: true, data: result };

    } catch (error) {
      console.error('Optimistic update failed:', error);
      
      // Rollback optimistic changes
      if (this.rollbackCallbacks.has(id)) {
        try {
          this.rollbackCallbacks.get(id)();
        } catch (rollbackError) {
          console.error('Rollback failed:', rollbackError);
        }
      }

      this.cleanup(id);
      
      const message = errorMessage || error.message || 'Update failed';
      toast.dismiss(`loading-${id}`);
      toast.error(message);

      return { success: false, error };
    }
  }

  /**
   * Execute API call with retry logic
   */
  async executeWithRetry(apiCall, retryCount, timeout) {
    let lastError;
    
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        // Race between API call and timeout
        const result = await Promise.race([apiCall(), timeoutPromise]);
        return result;

      } catch (error) {
        lastError = error;
        
        // Don't retry on certain error types
        if (error.status === 401 || error.status === 403 || error.status === 404) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < retryCount) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Create an optimistic update handler for React components
   */
  createUpdateHandler(setState, errorFallback) {
    return {
      updateItem: async (id, updates, apiCall, options = {}) => {
        const optimisticUpdate = () => {
          setState(prev => prev.map(item => 
            item.id === id ? { ...item, ...updates } : item
          ));
        };

        const rollback = () => {
          setState(prev => prev.map(item => 
            item.id === id ? { ...item, ...errorFallback } : item
          ));
        };

        return this.performUpdate(
          `update-${id}`,
          optimisticUpdate,
          apiCall,
          rollback,
          options
        );
      },

      addItem: async (tempItem, apiCall, options = {}) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticItem = { ...tempItem, id: tempId, _isOptimistic: true };

        const optimisticUpdate = () => {
          setState(prev => [optimisticItem, ...prev]);
        };

        const rollback = () => {
          setState(prev => prev.filter(item => item.id !== tempId));
        };

        const result = await this.performUpdate(
          `add-${tempId}`,
          optimisticUpdate,
          apiCall,
          rollback,
          options
        );

        if (result.success && result.data) {
          // Replace optimistic item with real data
          setState(prev => prev.map(item => 
            item.id === tempId ? { ...result.data, _isOptimistic: false } : item
          ));
        }

        return result;
      },

      deleteItem: async (id, apiCall, options = {}) => {
        let deletedItem = null;

        const optimisticUpdate = () => {
          setState(prev => {
            const item = prev.find(item => item.id === id);
            deletedItem = item;
            return prev.filter(item => item.id !== id);
          });
        };

        const rollback = () => {
          if (deletedItem) {
            setState(prev => [deletedItem, ...prev]);
          }
        };

        return this.performUpdate(
          `delete-${id}`,
          optimisticUpdate,
          apiCall,
          rollback,
          options
        );
      }
    };
  }

  /**
   * Clean up tracking for completed/failed updates
   */
  cleanup(id) {
    this.pendingUpdates.delete(id);
    this.rollbackCallbacks.delete(id);
    this.errorHandlers.delete(id);
  }

  /**
   * Get all pending updates
   */
  getPendingUpdates() {
    return Array.from(this.pendingUpdates.entries());
  }

  /**
   * Check if an update is pending
   */
  isPending(id) {
    return this.pendingUpdates.has(id);
  }

  /**
   * Clean up old pending updates (older than 30 seconds)
   */
  cleanupStaleUpdates() {
    const now = Date.now();
    const staleThreshold = 30000; // 30 seconds

    for (const [id, update] of this.pendingUpdates.entries()) {
      if (now - update.timestamp > staleThreshold) {
        console.warn(`Cleaning up stale update: ${id}`);
        
        // Attempt rollback
        if (this.rollbackCallbacks.has(id)) {
          try {
            this.rollbackCallbacks.get(id)();
          } catch (error) {
            console.error('Stale update rollback failed:', error);
          }
        }

        this.cleanup(id);
      }
    }
  }
}

// Export singleton instance
export const optimisticUpdateManager = new OptimisticUpdateManager();

// Clean up stale updates every 60 seconds
setInterval(() => {
  optimisticUpdateManager.cleanupStaleUpdates();
}, 60000);

/**
 * React hook for optimistic updates
 */
export const useOptimisticUpdates = (initialState, errorFallback = {}) => {
  const [state, setState] = React.useState(initialState);
  
  const handlers = React.useMemo(() => 
    optimisticUpdateManager.createUpdateHandler(setState, errorFallback),
    [errorFallback]
  );

  return [state, handlers, setState];
};

/**
 * Higher-order component for optimistic updates
 */
export const withOptimisticUpdates = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    const optimisticProps = {
      ...props,
      optimisticUpdateManager
    };

    return <WrappedComponent ref={ref} {...optimisticProps} />;
  });
};

export default optimisticUpdateManager;