import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Paper, Collapse, Divider, Chip } from '@mui/material';
import { FaTimes as CloseIcon, FaChevronUp as ExpandLessIcon, FaChevronDown as ExpandMoreIcon, FaTachometerAlt as SpeedIcon } from 'react-icons/fa';
import PerformanceMonitor from './monitor';

/**
 * PerformanceMonitor - Development tool for monitoring app performance
 */
const PerformanceMonitorComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    renderTime: 0,
  });
  const [formulaMetrics, setFormulaMetrics] = useState({
    totalRequests: 0,
    avgApiTime: 0,
    slowRequests: 0,
    lastWorkflowTime: 0,
  });

  useEffect(() => {
    if (!isOpen) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime > lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Get memory usage if available
        const memory = performance.memory 
          ? Math.round(performance.memory.usedJSHeapSize / 1048576) 
          : 0;

        setMetrics({
          fps,
          memory,
          renderTime: Math.round(currentTime - lastTime),
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      if (isOpen) {
        requestAnimationFrame(measureFPS);
      }
    };

    requestAnimationFrame(measureFPS);
  }, [isOpen]);

  // Update Formula PM metrics from analytics data
  useEffect(() => {
    if (!isOpen) return;

    const updateFormulaMetrics = () => {
      const analytics = PerformanceMonitor.getAnalytics();
      
      const apiRequests = analytics.filter(a => a.metric.startsWith('api_'));
      const workflowMetrics = analytics.filter(a => a.metric.includes('workflow'));
      
      const avgApiTime = apiRequests.length > 0 
        ? Math.round(apiRequests.reduce((sum, r) => sum + r.value, 0) / apiRequests.length)
        : 0;
      
      const slowRequests = apiRequests.filter(r => r.value > 2000).length;
      
      const lastWorkflow = workflowMetrics.length > 0 
        ? Math.round(workflowMetrics[workflowMetrics.length - 1]?.value || 0)
        : 0;

      setFormulaMetrics({
        totalRequests: apiRequests.length,
        avgApiTime,
        slowRequests,
        lastWorkflowTime: lastWorkflow,
      });
    };

    updateFormulaMetrics();
    const interval = setInterval(updateFormulaMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 1,
          backgroundColor: 'background.paper',
          minWidth: 200,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: isOpen ? 1 : 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpeedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="body2" fontWeight="bold">
              Performance
            </Typography>
          </Box>
          <Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(!isOpen)}
              sx={{ p: 0.5 }}
            >
              {isOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={isOpen}>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" fontWeight="bold" display="block" sx={{ mb: 1 }}>
              System Metrics
            </Typography>
            <Typography variant="caption" display="block">
              FPS: {metrics.fps}
            </Typography>
            {performance.memory && (
              <Typography variant="caption" display="block">
                Memory: {metrics.memory} MB
              </Typography>
            )}
            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
              Render: {metrics.renderTime} ms
            </Typography>

            <Divider sx={{ my: 1 }} />
            
            <Typography variant="caption" fontWeight="bold" display="block" sx={{ mb: 1 }}>
              Formula PM Metrics
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              <Chip 
                label={`${formulaMetrics.totalRequests} API calls`} 
                size="small" 
                variant="outlined" 
                sx={{ fontSize: '0.6rem', height: 18 }}
              />
              {formulaMetrics.slowRequests > 0 && (
                <Chip 
                  label={`${formulaMetrics.slowRequests} slow`} 
                  size="small" 
                  color="warning"
                  sx={{ fontSize: '0.6rem', height: 18 }}
                />
              )}
            </Box>
            
            <Typography variant="caption" display="block">
              Avg API: {formulaMetrics.avgApiTime}ms
            </Typography>
            {formulaMetrics.lastWorkflowTime > 0 && (
              <Typography variant="caption" display="block">
                Last Workflow: {formulaMetrics.lastWorkflowTime}ms
              </Typography>
            )}
            
            <Box sx={{ mt: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  cursor: 'pointer', 
                  color: 'primary.main',
                  textDecoration: 'underline'
                }}
                onClick={() => {
                  console.log('📊 Performance Analytics:', PerformanceMonitor.getAnalytics());
                  console.log('🧠 Current Memory:', performance.memory);
                }}
              >
                View Console Logs
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default PerformanceMonitorComponent;