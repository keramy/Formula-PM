/**
 * Real-Time Features Test Page
 * Comprehensive testing page for all real-time interactive features
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  MdPlayArrow as PlayIcon,
  MdStop as StopIcon,
  MdRefresh as RefreshIcon,
  MdNotifications as NotificationsIcon,
  MdActivity as ActivityIcon,
  MdDashboard as DashboardIcon,
  MdPeople as PeopleIcon,
  MdTest as TestIcon
} from 'react-icons/md';
import { useSocket } from '../hooks/useSocket';
import RealTimeNotificationBell from '../components/notifications/RealTimeNotificationBell';
import RealTimeActivityFeed from '../components/realtime/RealTimeActivityFeed';
import LiveDashboardCards from '../components/realtime/LiveDashboardCards';
import { OnlineUsersList, TypingIndicator, UserPresenceIndicator } from '../components/realtime/PresenceIndicators';
import apiService from '../services/api/apiService';

const RealTimeTestPage = () => {
  const { isReady, connected, authenticated, socketService } = useSocket();
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [demoData, setDemoData] = useState({
    projects: [],
    tasks: [],
    teamMembers: []
  });

  // Test configuration
  const [testConfig, setTestConfig] = useState({
    notificationFrequency: 3000, // 3 seconds
    activityFrequency: 2000, // 2 seconds
    presenceUpdates: true,
    realTimeSync: true
  });

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
    try {
      const [projectsData, tasksData, teamData] = await Promise.all([
        apiService.getProjects(),
        apiService.getTasks(),
        apiService.getTeamMembers()
      ]);

      setDemoData({
        projects: projectsData.projects || [],
        tasks: tasksData.tasks || [],
        teamMembers: teamData.teamMembers || []
      });
    } catch (error) {
      console.error('Failed to load demo data:', error);
    }
  };

  const addTestResult = (test, status, message) => {
    const result = {
      id: Date.now(),
      test,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev.slice(0, 19)]);
  };

  // Test 1: Socket Connection
  const testSocketConnection = async () => {
    addTestResult('Socket Connection', 'running', 'Testing Socket.IO connection...');
    
    if (connected && authenticated) {
      addTestResult('Socket Connection', 'success', `Connected to Socket.IO on ${socketService.socket?.io.uri}`);
    } else if (connected && !authenticated) {
      addTestResult('Socket Connection', 'warning', 'Connected but not authenticated');
    } else {
      addTestResult('Socket Connection', 'error', 'Failed to connect to Socket.IO');
    }
  };

  // Test 2: Real-time Notifications
  const testNotifications = async () => {
    addTestResult('Notifications', 'running', 'Testing real-time notifications...');
    
    try {
      // Simulate creating a project which should trigger a notification
      const testProject = {
        name: `Test Project ${Date.now()}`,
        description: 'Real-time test project',
        type: 'commercial',
        clientId: demoData.teamMembers[0]?.id || '1'
      };

      await apiService.createProject(testProject);
      addTestResult('Notifications', 'success', 'Project created - notification should appear');
    } catch (error) {
      addTestResult('Notifications', 'error', `Failed to create test project: ${error.message}`);
    }
  };

  // Test 3: Activity Feed Updates
  const testActivityFeed = async () => {
    addTestResult('Activity Feed', 'running', 'Testing real-time activity updates...');
    
    try {
      // Create a task which should appear in activity feed
      const testTask = {
        name: `Real-time Test Task ${Date.now()}`,
        description: 'Testing activity feed updates',
        projectId: demoData.projects[0]?.id || '1',
        status: 'in_progress',
        priority: 'high'
      };

      await apiService.createTask(testTask);
      addTestResult('Activity Feed', 'success', 'Task created - should appear in activity feed');
    } catch (error) {
      addTestResult('Activity Feed', 'error', `Failed to create test task: ${error.message}`);
    }
  };

  // Test 4: Dashboard Updates
  const testDashboardUpdates = async () => {
    addTestResult('Dashboard Updates', 'running', 'Testing live dashboard updates...');
    
    try {
      // Update an existing project
      if (demoData.projects.length > 0) {
        const project = demoData.projects[0];
        const updatedProgress = Math.floor(Math.random() * 100);
        
        await apiService.updateProject(project.id, {
          progress: updatedProgress
        });
        
        addTestResult('Dashboard Updates', 'success', `Project progress updated to ${updatedProgress}%`);
      } else {
        addTestResult('Dashboard Updates', 'warning', 'No projects available for testing');
      }
    } catch (error) {
      addTestResult('Dashboard Updates', 'error', `Failed to update project: ${error.message}`);
    }
  };

  // Test 5: Presence Indicators
  const testPresenceIndicators = async () => {
    addTestResult('Presence Indicators', 'running', 'Testing user presence updates...');
    
    if (socketService.isReady()) {
      try {
        // Update user presence
        socketService.updatePresence({
          status: 'active',
          activity: 'Testing real-time features',
          location: 'real-time-test-page'
        });
        
        addTestResult('Presence Indicators', 'success', 'Presence updated successfully');
      } catch (error) {
        addTestResult('Presence Indicators', 'error', `Failed to update presence: ${error.message}`);
      }
    } else {
      addTestResult('Presence Indicators', 'error', 'Socket not ready for presence updates');
    }
  };

  // Test 6: Typing Indicators
  const testTypingIndicators = async () => {
    addTestResult('Typing Indicators', 'running', 'Testing typing indicators...');
    
    if (socketService.isReady()) {
      try {
        // Start typing
        socketService.sendTyping('real-time-test-page', true);
        
        setTimeout(() => {
          // Stop typing
          socketService.sendTyping('real-time-test-page', false);
          addTestResult('Typing Indicators', 'success', 'Typing indicators tested');
        }, 3000);
        
      } catch (error) {
        addTestResult('Typing Indicators', 'error', `Failed to test typing: ${error.message}`);
      }
    } else {
      addTestResult('Typing Indicators', 'error', 'Socket not ready for typing indicators');
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    try {
      await testSocketConnection();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testNotifications();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testActivityFeed();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testDashboardUpdates();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testPresenceIndicators();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testTypingIndicators();
      
      addTestResult('All Tests', 'success', 'All real-time tests completed');
    } catch (error) {
      addTestResult('All Tests', 'error', `Test suite failed: ${error.message}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'running': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <TestIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Real-Time Features Test Suite
          </Typography>
          {isReady && (
            <Chip label="Socket Connected" color="success" />
          )}
          {!isReady && (
            <Chip label="Socket Disconnected" color="error" />
          )}
        </Stack>
        
        <Typography variant="body1" color="textSecondary">
          Comprehensive testing page for all real-time interactive features including notifications, 
          activity feeds, dashboard updates, and collaborative features.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Test Controls */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Test Controls"
              avatar={<TestIcon />}
            />
            <CardContent>
              <Stack spacing={3}>
                {/* Connection Status */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Connection Status
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip 
                      label={`Socket: ${connected ? 'Connected' : 'Disconnected'}`}
                      color={connected ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip 
                      label={`Auth: ${authenticated ? 'Yes' : 'No'}`}
                      color={authenticated ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip 
                      label={`Ready: ${isReady ? 'Yes' : 'No'}`}
                      color={isReady ? 'success' : 'error'}
                      size="small"
                    />
                  </Stack>
                </Box>

                {/* Test Actions */}
                <Divider />
                
                <Button
                  variant="contained"
                  startIcon={isRunningTests ? <StopIcon /> : <PlayIcon />}
                  onClick={runAllTests}
                  disabled={isRunningTests}
                  size="large"
                  fullWidth
                >
                  {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
                </Button>

                <Stack spacing={1}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={testSocketConnection}
                    disabled={isRunningTests}
                  >
                    Test Socket Connection
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={testNotifications}
                    disabled={isRunningTests}
                  >
                    Test Notifications
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={testActivityFeed}
                    disabled={isRunningTests}
                  >
                    Test Activity Feed
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={testDashboardUpdates}
                    disabled={isRunningTests}
                  >
                    Test Dashboard Updates
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={testPresenceIndicators}
                    disabled={isRunningTests}
                  >
                    Test Presence
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={testTypingIndicators}
                    disabled={isRunningTests}
                  >
                    Test Typing
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card sx={{ mt: 3 }}>
            <CardHeader title="Test Results" />
            <CardContent>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {testResults.length === 0 ? (
                  <Typography color="textSecondary" variant="body2">
                    No test results yet. Run tests to see results here.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {testResults.map((result) => (
                      <Alert 
                        key={result.id} 
                        severity={result.status === 'running' ? 'info' : result.status}
                        variant="outlined"
                      >
                        <Typography variant="body2">
                          <strong>{result.test}:</strong> {result.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {result.timestamp}
                        </Typography>
                      </Alert>
                    ))}
                  </Stack>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Real-Time Components Demo */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Real-Time Notification Bell */}
            <Card>
              <CardHeader 
                title="Real-Time Notifications"
                avatar={<NotificationsIcon />}
                action={<RealTimeNotificationBell />}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  The notification bell shows real-time notifications with live updates, 
                  sound alerts, and browser notifications. Create a project to test.
                </Typography>
              </CardContent>
            </Card>

            {/* Live Activity Feed */}
            <Card>
              <CardHeader 
                title="Live Activity Feed"
                avatar={<ActivityIcon />}
              />
              <CardContent>
                <RealTimeActivityFeed 
                  maxHeight={300}
                  showHeader={false}
                  limit={10}
                />
              </CardContent>
            </Card>

            {/* Live Dashboard Elements */}
            <Card>
              <CardHeader 
                title="Live Dashboard Cards"
                avatar={<DashboardIcon />}
              />
              <CardContent>
                <LiveDashboardCards />
              </CardContent>
            </Card>

            {/* Presence Indicators */}
            <Card>
              <CardHeader 
                title="Presence Indicators"
                avatar={<PeopleIcon />}
              />
              <CardContent>
                <Stack spacing={2}>
                  <OnlineUsersList compact={false} maxUsers={5} />
                  <TypingIndicator location="real-time-test-page" />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealTimeTestPage;