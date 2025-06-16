import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import PerformanceMonitor from '../../utils/performance';

const PerformanceDashboard = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [webVitals, setWebVitals] = useState({});
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    loadPerformanceData();
    loadWebVitals();
    loadMemoryInfo();
  }, []);

  const loadPerformanceData = () => {
    const data = PerformanceMonitor.getAnalytics();
    setPerformanceData(data.slice(-20)); // Show last 20 entries
  };

  const loadWebVitals = async () => {
    try {
      const vitals = await PerformanceMonitor.getCoreWebVitals();
      setWebVitals(vitals);
    } catch (error) {
      console.warn('Could not load Web Vitals:', error);
    }
  };

  const loadMemoryInfo = () => {
    if (typeof performance.memory !== 'undefined') {
      const memory = performance.memory;
      setMemoryInfo({
        used: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
        total: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
        limit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)
      });
    }
  };

  const clearData = () => {
    PerformanceMonitor.clearAnalytics();
    setPerformanceData([]);
  };

  const getPerformanceStatus = (metric, value) => {
    const thresholds = {
      'componentRender': { good: 100, poor: 300 },
      'searchOperation': { good: 50, poor: 200 },
      'apiRequest': { good: 1000, poor: 3000 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'default';

    if (value <= threshold.good) return 'success';
    if (value <= threshold.poor) return 'warning';
    return 'error';
  };

  const getWebVitalStatus = (metric, value) => {
    const thresholds = {
      cls: { good: 0.1, poor: 0.25 },
      fid: { good: 100, poor: 300 },
      lcp: { good: 2500, poor: 4000 },
      fcp: { good: 1800, poor: 3000 },
      ttfb: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'default';

    if (value <= threshold.good) return 'success';
    if (value <= threshold.poor) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Performance Dashboard
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This dashboard monitors Formula PM application performance in real-time.
        Metrics are collected automatically and stored locally for debugging.
      </Alert>

      <Grid container spacing={3}>
        {/* Memory Usage */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Memory Usage
              </Typography>
              {memoryInfo ? (
                <Box>
                  <Typography variant="body2">
                    Used: {memoryInfo.used} MB
                  </Typography>
                  <Typography variant="body2">
                    Total: {memoryInfo.total} MB
                  </Typography>
                  <Typography variant="body2">
                    Limit: {memoryInfo.limit} MB
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={memoryInfo.used > 100 ? 'High Usage' : 'Normal'}
                      color={memoryInfo.used > 100 ? 'warning' : 'success'}
                      size="small"
                    />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Memory information not available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Web Vitals */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Core Web Vitals
              </Typography>
              {Object.keys(webVitals).length > 0 ? (
                <Grid container spacing={2}>
                  {Object.entries(webVitals).map(([metric, data]) => (
                    <Grid item xs={6} sm={4} key={metric}>
                      <Box textAlign="center">
                        <Typography variant="h6">
                          {data.value?.toFixed(0) || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {metric.toUpperCase()}
                        </Typography>
                        <Chip 
                          label={getWebVitalStatus(metric, data.value)}
                          color={getWebVitalStatus(metric, data.value)}
                          size="small"
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Web Vitals loading...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Recent Performance Measurements
              </Typography>
              <Box>
                <Button onClick={loadPerformanceData} sx={{ mr: 1 }}>
                  Refresh
                </Button>
                <Button onClick={clearData} color="secondary">
                  Clear Data
                </Button>
              </Box>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Duration (ms)</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>User Agent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {performanceData.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>{entry.metric}</TableCell>
                      <TableCell align="right">{entry.value.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getPerformanceStatus(entry.metric, entry.value)}
                          color={getPerformanceStatus(entry.metric, entry.value)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {entry.userAgent}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {performanceData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No performance data available. Use the application to generate metrics.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Performance Tips */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Optimization Tips
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <li>
                  <Typography variant="body2">
                    Component renders should be under 300ms for good user experience
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Search operations should complete in under 50ms
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    API requests should finish within 2 seconds
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Memory usage over 100MB may indicate memory leaks
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Use React DevTools Profiler for detailed component analysis
                  </Typography>
                </li>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerformanceDashboard;