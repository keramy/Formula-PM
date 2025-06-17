import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Paper, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * PerformanceMonitor - Development tool for monitoring app performance
 */
const PerformanceMonitor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    renderTime: 0,
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
          <Typography variant="body2" fontWeight="bold">
            Performance
          </Typography>
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
            <Typography variant="caption" display="block">
              FPS: {metrics.fps}
            </Typography>
            {performance.memory && (
              <Typography variant="caption" display="block">
                Memory: {metrics.memory} MB
              </Typography>
            )}
            <Typography variant="caption" display="block">
              Render: {metrics.renderTime} ms
            </Typography>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default PerformanceMonitor;