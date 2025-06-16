import { useState, useEffect, useCallback } from 'react';
import shopDrawingService from '../services/shopDrawingService';

export const useShopDrawings = (projectId = null) => {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load drawings
  const loadDrawings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (projectId) {
        data = await shopDrawingService.getDrawingsByProject(projectId);
      } else {
        data = await shopDrawingService.getAllDrawings();
      }
      
      setDrawings(data);
    } catch (err) {
      setError(err.message || 'Failed to load shop drawings');
      console.error('Error loading shop drawings:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Upload new drawing
  const uploadDrawing = useCallback(async (formData) => {
    try {
      setError(null);
      const newDrawing = await shopDrawingService.uploadDrawing(formData);
      setDrawings(prev => [newDrawing, ...prev]);
      return newDrawing;
    } catch (err) {
      setError(err.message || 'Failed to upload drawing');
      throw err;
    }
  }, []);

  // Update drawing
  const updateDrawing = useCallback(async (drawingId, updates) => {
    try {
      setError(null);
      const updatedDrawing = await shopDrawingService.updateDrawing(drawingId, updates);
      setDrawings(prev => prev.map(d => d.id === drawingId ? updatedDrawing : d));
      return updatedDrawing;
    } catch (err) {
      setError(err.message || 'Failed to update drawing');
      throw err;
    }
  }, []);

  // Update drawing status
  const updateDrawingStatus = useCallback(async (drawingId, status, notes = '') => {
    try {
      setError(null);
      const updatedDrawing = await shopDrawingService.updateDrawingStatus(drawingId, status, notes);
      setDrawings(prev => prev.map(d => d.id === drawingId ? updatedDrawing : d));
      return updatedDrawing;
    } catch (err) {
      setError(err.message || 'Failed to update drawing status');
      throw err;
    }
  }, []);

  // Add revision
  const addRevision = useCallback(async (drawingId, revisionData) => {
    try {
      setError(null);
      const updatedDrawing = await shopDrawingService.addRevision(drawingId, revisionData);
      setDrawings(prev => prev.map(d => d.id === drawingId ? updatedDrawing : d));
      return updatedDrawing;
    } catch (err) {
      setError(err.message || 'Failed to add revision');
      throw err;
    }
  }, []);

  // Delete drawing
  const deleteDrawing = useCallback(async (drawingId) => {
    try {
      setError(null);
      await shopDrawingService.deleteDrawing(drawingId);
      setDrawings(prev => prev.filter(d => d.id !== drawingId));
    } catch (err) {
      setError(err.message || 'Failed to delete drawing');
      throw err;
    }
  }, []);

  // Get drawing file URL
  const getDrawingFileUrl = useCallback((drawingId, version = 'latest') => {
    return shopDrawingService.getDrawingFileUrl(drawingId, version);
  }, []);

  // Load drawings on mount or when projectId changes
  useEffect(() => {
    loadDrawings();
  }, [loadDrawings]);

  return {
    drawings,
    loading,
    error,
    loadDrawings,
    uploadDrawing,
    updateDrawing,
    updateDrawingStatus,
    addRevision,
    deleteDrawing,
    getDrawingFileUrl
  };
};

export const useShopDrawing = (drawingId) => {
  const [drawing, setDrawing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDrawing = useCallback(async () => {
    if (!drawingId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await shopDrawingService.getDrawing(drawingId);
      setDrawing(data);
    } catch (err) {
      setError(err.message || 'Failed to load drawing');
      console.error('Error loading drawing:', err);
    } finally {
      setLoading(false);
    }
  }, [drawingId]);

  useEffect(() => {
    loadDrawing();
  }, [loadDrawing]);

  return {
    drawing,
    loading,
    error,
    loadDrawing
  };
};

// Hook for drawing statistics
export const useShopDrawingStats = () => {
  const { drawings, loading } = useShopDrawings();

  const stats = {
    total: drawings.length,
    pending: drawings.filter(d => d.status === 'pending').length,
    approved: drawings.filter(d => d.status === 'approved').length,
    revisionRequired: drawings.filter(d => d.status === 'revision_required').length,
    rejected: drawings.filter(d => d.status === 'rejected').length
  };

  return { stats, loading };
};