import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  Construction,
  Warning,
  CheckCircle,
  Refresh
} from 'iconoir-react';

// Import our new components
import { 
  ProjectCard, 
  TaskCard,
  StatusChip,
  ConstructionPhaseChip,
  QualityStatusChip,
  SafetyLevelChip
} from './StandardCards';
import {
  PageLoading,
  SectionLoading,
  CardSkeleton,
  ListLoading,
  TableLoading,
  FormLoading,
  DashboardLoading
} from './LoadingStates';
import { getConstructionAriaProps, announceToScreenReader } from '../../utils/accessibilityUtils';

// Sample data for demonstration
const sampleProject = {
  id: 1,
  name: "Luxury Office Renovation",
  client: "Formula International",
  projectCode: "PRJ-2025-001",
  type: "commercial",
  status: "active",
  phase: "framing",
  progress: 65,
  priority: "high",
  location: "Toronto, ON",
  budget: 1250000,
  startDate: "2025-01-15",
  deadline: "2025-06-30",
  safetyScore: 92,
  qualityStatus: "approved",
  teamMembers: [
    { name: "John Smith", role: "PM" },
    { name: "Sarah Wilson", role: "Supervisor" },
    { name: "Mike Johnson", role: "Foreman" }
  ]
};

const sampleTask = {
  id: 1,
  title: "Install MEP rough-in systems",
  projectName: "Office Renovation",
  status: "in-progress",
  priority: "high",
  assignee: "Mike Johnson",
  dueDate: "2025-01-25",
  category: "construction",
  tags: ["safety", "mep"],
  phase: "MEP Systems",
  progress: 40
};

const ConstructionUIShowcase = () => {
  const [showLoadingStates, setShowLoadingStates] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [constructionContext, setConstructionContext] = useState(true);

  const handleAnnouncementTest = () => {
    announceToScreenReader(
      "Construction UI showcase updated with new accessibility features",
      "polite"
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box textAlign="center">
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            <Construction sx={{ mr: 2, fontSize: 'inherit', verticalAlign: 'text-bottom' }} />
            Construction UI Polish Showcase
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Phase 3: Advanced UI Components with Construction Industry Context
          </Typography>
          
          {/* Controls */}
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={showLoadingStates}
                  onChange={(e) => setShowLoadingStates(e.target.checked)}
                />
              }
              label="Show Loading States"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              }
              label="Dark Mode"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={constructionContext}
                  onChange={(e) => setConstructionContext(e.target.checked)}
                />
              }
              label="Construction Context"
            />
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleAnnouncementTest}
            >
              Test Screen Reader
            </Button>
          </Stack>
        </Box>

        <Divider />

        {/* Status Chips Showcase */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            🏷️ Enhanced Status Chips
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Construction-specific status indicators with improved accessibility
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Standard Status</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <StatusChip type="project" status="active" />
                <StatusChip type="task" status="in-progress" />
                <StatusChip type="priority" status="high" />
                <StatusChip type="projectType" status="commercial" />
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Construction-Specific</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <ConstructionPhaseChip status="framing" />
                <QualityStatusChip status="approved" />
                <SafetyLevelChip status="excellent" />
                <ConstructionPhaseChip status="mep-rough" />
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Card Components Showcase */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            🗂️ Professional Card Components
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Industry-optimized cards with construction context and accessibility
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Typography variant="h6" gutterBottom>Project Card</Typography>
              {showLoadingStates ? (
                <CardSkeleton 
                  variant="project" 
                  constructionContext={constructionContext}
                />
              ) : (
                <ProjectCard
                  project={sampleProject}
                  variant="medium"
                  onClick={(project) => console.log('Project clicked:', project)}
                  onActionClick={(e, project) => console.log('Action clicked:', project)}
                  {...getConstructionAriaProps('project-card', sampleProject)}
                />
              )}
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <Typography variant="h6" gutterBottom>Task Card</Typography>
              {showLoadingStates ? (
                <CardSkeleton 
                  variant="task" 
                  constructionContext={constructionContext}
                />
              ) : (
                <TaskCard
                  task={sampleTask}
                  variant="medium"
                  onClick={(task) => console.log('Task clicked:', task)}
                  {...getConstructionAriaProps('task-card', sampleTask)}
                />
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Loading States Showcase */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            ⏳ Professional Loading States
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Skeleton loading with construction branding and smooth transitions
          </Typography>
          
          {showLoadingStates ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Section Loading</Typography>
                    <SectionLoading 
                      message="Loading construction data..."
                      constructionIcon="construction"
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Form Loading</Typography>
                    <FormLoading 
                      fields={3}
                      constructionContext={constructionContext}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Table Loading</Typography>
                    <TableLoading 
                      rows={5}
                      columns={6}
                      constructionContext={constructionContext}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Toggle "Show Loading States" above to see the skeleton loaders in action
              </Typography>
            </Alert>
          )}
        </Paper>

        {/* Accessibility Features */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            ♿ Accessibility Features
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            WCAG 2.1 AA compliant with construction industry considerations
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <CheckCircle color="success" sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Palette Contrast</Typography>
                  <Typography variant="body2">
                    4.5:1 contrast ratio minimum for all text and interactive elements
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <CheckCircle color="success" sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Keyboard Navigation</Typography>
                  <Typography variant="body2">
                    Full keyboard accessibility with focus management and ARIA support
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <CheckCircle color="success" sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Screen Reader</Typography>
                  <Typography variant="body2">
                    Construction-specific announcements and semantic markup
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Features Summary */}
        <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            🎯 Phase 3 Implementation Complete
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>✅ Cards & Status</Typography>
              <ul>
                <li>ProjectCard with construction context</li>
                <li>TaskCard with safety indicators</li>
                <li>Enhanced StatusChip components</li>
                <li>Construction-specific status types</li>
              </ul>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>✅ Loading & Accessibility</Typography>
              <ul>
                <li>Professional skeleton loading states</li>
                <li>WCAG 2.1 AA compliance</li>
                <li>Construction industry optimization</li>
                <li>Mobile/tablet site usage ready</li>
              </ul>
            </Grid>
          </Grid>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ConstructionUIShowcase;