import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Building as DrawingIcon,
  Package as SpecIcon,
  ClipboardCheck as TaskIcon,
  ArrowUp as ArrowUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckIcon,
  Clock as PendingIcon,
  WarningTriangle as WarningIcon,
  MoneySquare as MoneyIcon,
  Timeline as TimelineIcon,
  Eye as ViewIcon
} from 'iconoir-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const EnhancedDashboardWidgets = ({ 
  projects = [], 
  tasks = [], 
  teamMembers = [] 
}) => {
  // Mock data for new modules - this will come from hooks later
  const shopDrawings = [
    { id: 'SD001', status: 'approved', projectId: 'P001', uploadDate: '2025-06-15' },
    { id: 'SD002', status: 'pending', projectId: 'P001', uploadDate: '2025-06-14' },
    { id: 'SD003', status: 'revision_required', projectId: 'P002', uploadDate: '2025-06-13' },
    { id: 'SD004', status: 'approved', projectId: 'P001', uploadDate: '2025-06-12' }
  ];

  const specifications = [
    { id: 'SPEC001', status: 'approved', totalCost: 1800, category: 'Kitchen Cabinets', projectId: 'P001' },
    { id: 'SPEC002', status: 'approved', totalCost: 3900, category: 'Kitchen Cabinets', projectId: 'P001' },
    { id: 'SPEC003', status: 'pending', totalCost: 2800, category: 'Reception Furniture', projectId: 'P002' }
  ];

  // Calculate statistics
  const drawingStats = {
    total: shopDrawings.length,
    approved: shopDrawings.filter(d => d.status === 'approved').length,
    pending: shopDrawings.filter(d => d.status === 'pending').length,
    revision: shopDrawings.filter(d => d.status === 'revision_required').length
  };

  const specStats = {
    total: specifications.length,
    approved: specifications.filter(s => s.status === 'approved').length,
    totalCost: specifications.reduce((sum, spec) => sum + spec.totalCost, 0)
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  // Chart data
  const drawingStatusData = [
    { name: 'Approved', value: drawingStats.approved, color: '#4CAF50' },
    { name: 'Pending', value: drawingStats.pending, color: '#FF9800' },
    { name: 'Revision', value: drawingStats.revision, color: '#F44336' }
  ];

  const costByCategoryData = specifications.reduce((acc, spec) => {
    const existing = acc.find(item => item.category === spec.category);
    if (existing) {
      existing.cost += spec.totalCost;
    } else {
      acc.push({ category: spec.category, cost: spec.totalCost });
    }
    return acc;
  }, []);

  const weeklyProgressData = [
    { week: 'Week 1', drawings: 2, specs: 1, tasks: 5 },
    { week: 'Week 2', drawings: 1, specs: 2, tasks: 8 },
    { week: 'Week 3', drawings: 3, specs: 1, tasks: 6 },
    { week: 'Week 4', drawings: 2, specs: 3, tasks: 9 }
  ];

  const ShopDrawingsWidget = () => (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Shop Drawings</Typography>
          <DrawingIcon color="primary" />
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {drawingStats.total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#4CAF50' }}>
                {drawingStats.approved}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Approved
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#FF9800' }}>
                {drawingStats.pending}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2">Approval Progress</Typography>
          <Typography variant="body2">
            {drawingStats.total > 0 ? Math.round((drawingStats.approved / drawingStats.total) * 100) : 0}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={drawingStats.total > 0 ? (drawingStats.approved / drawingStats.total) * 100 : 0}
          sx={{ height: 8, borderRadius: 4 }}
        />

        <Box sx={{ mt: 2 }}>
          {drawingStats.revision > 0 && (
            <Chip 
              icon={<WarningIcon />}
              label={`${drawingStats.revision} need revision`}
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const SpecificationsWidget = () => (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Material Specs</Typography>
          <SpecIcon color="primary" />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            ${specStats.totalCost.toLocaleString('en-US')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Specification Cost
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5">
                {specStats.total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Items
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: '#4CAF50' }}>
                {specStats.approved}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Approved
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {costByCategoryData.length > 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Cost by Category
            </Typography>
            {costByCategoryData.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">{item.category}</Typography>
                <Typography variant="caption" fontWeight={600}>
                  ${item.cost.toLocaleString('en-US')}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const DrawingStatusChart = () => (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Drawing Status Distribution
        </Typography>
        <Box sx={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={drawingStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {drawingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  const WeeklyProgressChart = () => (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Weekly Progress
        </Typography>
        <Box sx={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <RechartsTooltip />
              <Line type="monotone" dataKey="drawings" stroke="#1976d2" name="Drawings" />
              <Line type="monotone" dataKey="specs" stroke="#388e3c" name="Specifications" />
              <Line type="monotone" dataKey="tasks" stroke="#f57c00" name="Tasks" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  const RecentActivityWidget = () => (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: '#4CAF50', width: 32, height: 32 }}>
                <CheckIcon fontSize="small" />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary="Kitchen Cabinets drawing approved"
              secondary="2 hours ago"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                <SpecIcon fontSize="small" />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary="New material specification added"
              secondary="4 hours ago"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: '#FF9800', width: 32, height: 32 }}>
                <PendingIcon fontSize="small" />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary="Reception desk drawing pending review"
              secondary="1 day ago"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: '#388e3c', width: 32, height: 32 }}>
                <TaskIcon fontSize="small" />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary="Installation task completed"
              secondary="2 days ago"
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  const QuickActionsWidget = () => (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box 
              sx={{ 
                p: 2, 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundPalette: '#f5f5f5' }
              }}
            >
              <DrawingIcon sx={{ fontSize: 32, color: '#1976d2', mb: 1 }} />
              <Typography variant="body2">
                Upload Drawing
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box 
              sx={{ 
                p: 2, 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundPalette: '#f5f5f5' }
              }}
            >
              <SpecIcon sx={{ fontSize: 32, color: '#388e3c', mb: 1 }} />
              <Typography variant="body2">
                Add Specification
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box 
              sx={{ 
                p: 2, 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundPalette: '#f5f5f5' }
              }}
            >
              <TaskIcon sx={{ fontSize: 32, color: '#f57c00', mb: 1 }} />
              <Typography variant="body2">
                Create Task
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box 
              sx={{ 
                p: 2, 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundPalette: '#f5f5f5' }
              }}
            >
              <MoneyIcon sx={{ fontSize: 32, color: '#7b1fa2', mb: 1 }} />
              <Typography variant="body2">
                Cost Report
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      {/* Top Row - Key Metrics */}
      <Grid item xs={12} md={4}>
        <ShopDrawingsWidget />
      </Grid>
      <Grid item xs={12} md={4}>
        <SpecificationsWidget />
      </Grid>
      <Grid item xs={12} md={4}>
        <QuickActionsWidget />
      </Grid>

      {/* Middle Row - Charts */}
      <Grid item xs={12} md={6}>
        <DrawingStatusChart />
      </Grid>
      <Grid item xs={12} md={6}>
        <WeeklyProgressChart />
      </Grid>

      {/* Bottom Row - Activity */}
      <Grid item xs={12} md={6}>
        <RecentActivityWidget />
      </Grid>
      <Grid item xs={12} md={6}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cost Breakdown
            </Typography>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costByCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']} />
                  <Bar dataKey="cost" fill="#388e3c" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default EnhancedDashboardWidgets;