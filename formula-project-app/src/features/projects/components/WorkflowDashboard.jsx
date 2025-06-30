import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Paper,
  Divider
} from '@mui/material';
import {
  MdWarning as WarningIcon,
  MdClose as ErrorIcon,
  MdCheckCircle as CheckIcon,
  MdTimeline as TimelineIcon,
  MdKeyboardArrowDown as ExpandMoreIcon,
  MdRefresh as RefreshIcon,
  MdCheck as ScopeIcon,
  MdDesignServices as DrawingIcon,
  MdArchive as MaterialIcon,
  MdBusiness as ProductionIcon,
  MdKeyboardArrowUp as ProgressIcon,
  MdCalendarToday as CalendarIcon
} from 'react-icons/md';
import connectionService from '../../../services/connectionService';

const WorkflowDashboard = ({ 
  project,
  scopeItems = [],
  shopDrawings = [],
  materialSpecs = [],
  onItemSelect
}) => {
  const [workflowStatus, setWorkflowStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeWorkflow();
  }, [scopeItems, shopDrawings, materialSpecs]);

  const analyzeWorkflow = async () => {
    setLoading(true);
    try {
      // Try to use the async method that fetches fresh data from backend
      const status = await connectionService.getWorkflowStatusAsync(project.id);
      setWorkflowStatus(status);
    } catch (error) {
      console.error('Error analyzing workflow:', error);
      try {
        // Fallback to using passed-in data
        const status = connectionService.getWorkflowStatus(
          project.id, 
          scopeItems, 
          shopDrawings, 
          materialSpecs
        );
        setWorkflowStatus(status);
      } catch (fallbackError) {
        console.error('Fallback workflow analysis failed:', fallbackError);
        setWorkflowStatus(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const getSeverityPalette = (severity) => {
    switch (severity) {
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'success': return '#4caf50';
      default: return '#2196f3';
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'urgent': return <ErrorIcon sx={{ color: '#f44336' }} />;
      case 'warning': return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'dependency': return <TimelineIcon sx={{ color: '#2196f3' }} />;
      default: return <CheckIcon sx={{ color: '#4caf50' }} />;
    }
  };

  const renderSummaryCards = () => {
    if (!workflowStatus) return null;

    const { summary } = workflowStatus;

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <ScopeIcon sx={{ fontSize: 40, color: '#2196f3' }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {summary.totalItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Scope Items
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <CheckIcon sx={{ fontSize: 40, color: '#4caf50' }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#4caf50' }}>
                {summary.readyItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ready for Production
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <ErrorIcon sx={{ fontSize: 40, color: '#f44336' }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#f44336' }}>
                {summary.blockedItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Production Blocked
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <WarningIcon sx={{ fontSize: 40, color: '#ff9800' }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#ff9800' }}>
                {summary.warningItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items with Warnings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderProductionStatus = () => {
    if (!workflowStatus) return null;

    const { summary } = workflowStatus;
    const productionReadiness = (summary.readyItems / summary.totalItems) * 100;

    return (
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Production Readiness
            </Typography>
            <IconButton onClick={analyzeWorkflow} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Ready for Production
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {productionReadiness.toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={productionReadiness}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: summary.canStartProduction ? '#4caf50' : '#ff9800'
                }
              }}
            />
          </Box>

          {summary.canStartProduction ? (
            <Alert severity="success" icon={<ProductionIcon />}>
              <Typography variant="body2">
                ✅ All dependencies satisfied - Production can start immediately
              </Typography>
            </Alert>
          ) : (
            <Alert severity="error" icon={<ErrorIcon />}>
              <Typography variant="body2">
                🚫 {summary.blockedItems} items are blocking production start
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderGroupDependencies = () => {
    if (!workflowStatus?.details?.groupDependencies) return null;

    const { groupDependencies } = workflowStatus.details;

    return (
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Group Dependencies & Timeline
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Track dependencies between scope groups
          </Typography>

          <Grid container spacing={2}>
            {Object.entries(groupDependencies).map(([groupKey, deps]) => {
              const groupNames = {
                construction: { name: 'Construction', icon: '🏗️', color: '#E67E22' },
                millwork: { name: 'Millwork', icon: '🪵', color: '#8B4513' },
                electric: { name: 'Electric', icon: '⚡', color: '#F1C40F' },
                mep: { name: 'MEP', icon: '🔧', color: '#3498DB' }
              };

              const group = groupNames[groupKey];
              if (!group) return null;

              return (
                <Grid item xs={12} md={6} key={groupKey}>
                  <Paper sx={{ p: 2, border: deps.canStart ? '1px solid #4caf50' : '1px solid #ff9800' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" sx={{ mr: 1 }}>{group.icon}</Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {group.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {deps.progress}% Complete
                        </Typography>
                      </Box>
                      <Chip 
                        label={deps.canStart ? "Can Start" : "Blocked"}
                        size="small"
                        sx={{
                          backgroundColor: deps.canStart ? '#4caf50' : '#ff9800',
                          color: 'white'
                        }}
                      />
                    </Box>

                    <LinearProgress 
                      variant="determinate" 
                      value={deps.progress}
                      sx={{ 
                        mb: 2,
                        height: 6, 
                        borderRadius: 3,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: group.color
                        }
                      }}
                    />

                    {deps.blockedBy.length > 0 && (
                      <Alert severity="warning" sx={{ mb: 1, py: 0 }}>
                        <Typography variant="caption">
                          Blocked by: {deps.blockedBy.map(b => `${b.group} (${b.remaining}% remaining)`).join(', ')}
                        </Typography>
                      </Alert>
                    )}

                    {deps.blocking.length > 0 && (
                      <Alert severity="info" sx={{ py: 0 }}>
                        <Typography variant="caption">
                          Blocking: {deps.blocking.map(b => b.group).join(', ')}
                        </Typography>
                      </Alert>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderBlockedItems = () => {
    if (!workflowStatus?.details?.blockers?.length) return null;

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon sx={{ color: '#f44336' }} />
            <Typography variant="h6">
              Production Blockers ({workflowStatus.details.blockers.length})
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {workflowStatus.details.blockers.map((item, index) => (
              <ListItem 
                key={index}
                button
                onClick={() => onItemSelect?.(item.scopeItem)}
                divider
              >
                <ListItemIcon>
                  <ErrorIcon sx={{ color: '#f44336' }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.scopeItem.description}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        Category: {item.scopeItem.category}
                      </Typography>
                      {item.blockers.map((blocker, bIndex) => (
                        <Typography key={bIndex} variant="caption" display="block" sx={{ color: '#f44336' }}>
                          • {blocker.message}
                        </Typography>
                      ))}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderRecommendations = () => {
    if (!workflowStatus?.recommendations?.length) return null;

    return (
      <Card elevation={2} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Recommendations
          </Typography>
          
          <List dense>
            {workflowStatus.recommendations.map((rec, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  {getRecommendationIcon(rec.type)}
                </ListItemIcon>
                <ListItemText
                  primary={rec.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {rec.description}
                      </Typography>
                      {rec.actions.map((action, aIndex) => (
                        <Typography key={aIndex} variant="caption" display="block">
                          • {action}
                        </Typography>
                      ))}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Analyzing workflow dependencies...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Workflow Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Monitor project dependencies and production readiness
      </Typography>

      {renderSummaryCards()}
      {renderProductionStatus()}
      {renderGroupDependencies()}
      {renderBlockedItems()}
      {renderRecommendations()}
    </Box>
  );
};

export default WorkflowDashboard;