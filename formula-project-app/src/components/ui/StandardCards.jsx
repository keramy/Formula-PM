import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Divider,
  useTheme
} from '@mui/material';
import {
  MoreVert,
  Calendar,
  LocationOn,
  Engineering,
  Warning,
  CheckCircle,
  Group,
  AttachMoney
} from 'iconoir-react';
// Now using React Icons system
import { getConstructionIcon, ConstructionIcons } from '../icons';
import { FaHardHat, FaSearch } from 'react-icons/fa';
import StatusChip from './StatusChip';
import { format } from 'date-fns';

// Base card styles for construction industry with enhanced palette
const getCardStyles = (theme, { selected, hoverable, variant, projectType }) => {
  // Project type gradients
  const typeGradients = {
    construction: 'linear-gradient(135deg, rgba(227, 175, 100, 0.1) 0%, rgba(255, 255, 255, 1) 100%)',
    fitout: 'linear-gradient(135deg, rgba(227, 175, 100, 0.1) 0%, rgba(255, 255, 255, 1) 100%)',
    millwork: 'linear-gradient(135deg, rgba(81, 106, 200, 0.1) 0%, rgba(255, 255, 255, 1) 100%)',
    mep: 'linear-gradient(135deg, rgba(38, 66, 139, 0.1) 0%, rgba(255, 255, 255, 1) 100%)',
    electrical: 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(255, 255, 255, 1) 100%)',
  };
  
  const typeBorderPalettes = {
    construction: '#E3AF64', // Caramel Essence
    fitout: '#E3AF64',
    millwork: '#516AC8', // Sapphire Dust
    mep: '#26428B', // Blue Oblivion
    electrical: '#f1c40f'
  };

  return {
    border: `1px solid var(--border-light, #E5E7EB)`,
    borderRadius: 'var(--border-radius-lg, 12px)',
    borderLeft: selected ? `4px solid ${typeBorderPalettes[projectType] || '#516AC8'}` : undefined,
    background: selected 
      ? typeGradients[projectType] || typeGradients.construction
      : 'linear-gradient(135deg, rgba(246, 243, 231, 0.3) 0%, rgba(255, 255, 255, 1) 100%)',
    cursor: hoverable ? 'pointer' : 'default',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: variant === 'compact' ? 'auto' : variant === 'full' ? 320 : 220,
    boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1))',
    '&:hover': hoverable ? {
      boxShadow: 'var(--shadow-hover, 0 4px 20px rgba(0, 0, 0, 0.15))',
      borderPalette: typeBorderPalettes[projectType] || 'var(--caramel-essence)',
      transform: 'translateY(-2px)',
    } : {},
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: typeBorderPalettes[projectType] || 'transparent',
      opacity: 0.8,
      transition: 'opacity 0.2s ease'
    },
    '&:hover::before': {
      opacity: 1
    }
  };
};

// Construction Project Card Component
export const ProjectCard = ({
  project,
  onClick,
  selected = false,
  variant = 'medium',
  showActions = true,
  onActionClick,
  ...props
}) => {
  const theme = useTheme();
  
  // Get construction-specific configuration
  const typeConfig = getConstructionIcon(project.type, 'projectType');
  const phaseConfig = getConstructionIcon(project.phase, 'phase');
  
  // Calculate safety score color
  const getSafetyPalette = (score) => {
    if (score >= 90) return theme.palette.success.main;
    if (score >= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const cardStyles = getCardStyles(theme, { selected, hoverable: !!onClick, variant, projectType: project.type });

  return (
    <Card
      elevation={0}
      onClick={(e) => {
        if (onClick && !e.defaultPrevented) {
          onClick(project);
        }
      }}
      sx={cardStyles}
      className="card-entrance"
      {...props}
    >
      {/* Construction Phase Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: phaseConfig?.color || theme.palette.primary.main
        }}
      />

      <CardContent sx={{ pb: 1 }}>
        {/* Header with Project Type Icon */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Stack direction="row" spacing={2} alignItems="center" flex={1}>
            {typeConfig?.icon && (
              <Avatar
                sx={{
                  bgcolor: `${typeConfig.color}20`,
                  color: typeConfig.color,
                  width: 40,
                  height: 40
                }}
              >
                {React.createElement(typeConfig.icon, { size: 24 })}
              </Avatar>
            )}
            <Box flex={1}>
              <Typography 
                variant="h6" 
                component="div" 
                noWrap
                sx={{ fontWeight: 600, color: theme.palette.text.primary }}
              >
                {project.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {project.client} • {project.projectCode || `PRJ-${project.id}`}
              </Typography>
            </Box>
          </Stack>
          
          {showActions && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onActionClick?.(e, project);
              }}
              sx={{ ml: 1 }}
            >
              <MoreVert />
            </IconButton>
          )}
        </Stack>

        {/* Construction Details */}
        <Stack spacing={2}>
          {/* Status and Phase */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <StatusChip type="project" status={project.status} size="small" />
            {phaseConfig && (
              <Chip
                label={phaseConfig.label}
                size="small"
                sx={{
                  bgcolor: `${phaseConfig.color}20`,
                  color: phaseConfig.color,
                  fontWeight: 600
                }}
              />
            )}
            {project.priority && (
              <StatusChip type="priority" status={project.priority} size="small" />
            )}
          </Stack>

          {/* Key Metrics */}
          <Stack spacing={1}>
            {/* Progress */}
            <Box>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Overall Progress
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  {project.progress || 0}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={project.progress || 0}
                sx={{
                  height: 6,
                  borderRadius: 1,
                  bgcolor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 1,
                    bgcolor: project.progress >= 80 
                      ? theme.palette.success.main 
                      : project.progress >= 50 
                      ? theme.palette.info.main 
                      : theme.palette.warning.main
                  }
                }}
              />
            </Box>

            {/* Location and Budget */}
            <Stack direction="row" spacing={2}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {project.location || 'No location'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  ${(project.budget || 0).toLocaleString()}
                </Typography>
              </Stack>
            </Stack>

            {/* Timeline */}
            <Stack direction="row" spacing={2}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Calendar sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {project.startDate ? format(new Date(project.startDate), 'MMM dd, yyyy') : 'TBD'}
                </Typography>
              </Stack>
              {project.deadline && (
                <Typography variant="caption" color="text.secondary">
                  → {format(new Date(project.deadline), 'MMM dd, yyyy')}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Safety & Quality Indicators */}
          {variant !== 'compact' && (
            <Stack direction="row" spacing={2} pt={1}>
              <Tooltip title="Safety Score">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <FaHardHat 
                    style={{ 
                      fontSize: 16, 
                      color: getSafetyPalette(project.safetyScore || 100) 
                    }} 
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: getSafetyPalette(project.safetyScore || 100),
                      fontWeight: 600 
                    }}
                  >
                    {project.safetyScore || 100}%
                  </Typography>
                </Stack>
              </Tooltip>
              
              {project.qualityStatus && (
                <Tooltip title="Quality Status">
                  <Chip
                    icon={project.qualityStatus === 'approved' ? <CheckCircle /> : <Warning />}
                    label={project.qualityStatus}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.75rem',
                      bgcolor: project.qualityStatus === 'approved' 
                        ? theme.palette.success.light + '20'
                        : theme.palette.warning.light + '20',
                      color: project.qualityStatus === 'approved'
                        ? theme.palette.success.dark
                        : theme.palette.warning.dark
                    }}
                  />
                </Tooltip>
              )}
            </Stack>
          )}

          {/* Team Check */}
          {variant === 'full' && project.teamMembers && (
            <Stack direction="row" spacing={1} alignItems="center" pt={1}>
              <Group sx={{ fontSize: 16, color: 'text.secondary' }} />
              <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                {project.teamMembers.map((member, idx) => (
                  <Tooltip key={idx} title={member.name}>
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.75rem'
                      }}
                    >
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Construction Task Card Component
export const TaskCard = ({
  task,
  onClick,
  selected = false,
  variant = 'compact',
  showProject = true,
  onActionClick,
  ...props
}) => {
  const theme = useTheme();
  
  // Get construction context
  const isConstructionTask = task.category?.includes('construction');
  const isSafetyTask = task.tags?.includes('safety');
  const isQualityTask = task.tags?.includes('quality');
  
  const cardStyles = {
    ...getCardStyles(theme, { selected, hoverable: !!onClick, variant }),
    minHeight: variant === 'compact' ? 80 : 140,
    '&::before': {
      ...getCardStyles(theme, { selected, hoverable: !!onClick, variant })['&::before'],
      background: isSafetyTask 
        ? theme.palette.error.main 
        : isQualityTask 
        ? theme.palette.warning.main 
        : 'transparent'
    }
  };

  return (
    <Card
      elevation={0}
      onClick={(e) => {
        if (onClick && !e.defaultPrevented) {
          onClick(task);
        }
      }}
      sx={cardStyles}
      {...props}
    >
      <CardContent sx={{ py: variant === 'compact' ? 1.5 : 2 }}>
        <Stack spacing={1}>
          {/* Task Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Typography 
                variant={variant === 'compact' ? 'body2' : 'body1'}
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {(isSafetyTask || isQualityTask) && (
                  <Tooltip title={isSafetyTask ? 'Safety Task' : 'Quality Task'}>
                    {isSafetyTask ? (
                      <FaHardHat 
                        style={{ fontSize: 18, color: theme.palette.error.main }} 
                      />
                    ) : (
                      <FaSearch 
                        style={{ fontSize: 18, color: theme.palette.warning.main }} 
                      />
                    )}
                  </Tooltip>
                )}
                {task.title}
              </Typography>
              
              {showProject && task.projectName && (
                <Typography variant="caption" color="text.secondary">
                  {task.projectName} • {task.phase || 'General'}
                </Typography>
              )}
            </Box>
            
            <Stack direction="row" spacing={0.5} alignItems="center">
              <StatusChip type="task" status={task.status} size="small" />
              {task.priority && variant !== 'compact' && (
                <StatusChip type="priority" status={task.priority} size="small" />
              )}
            </Stack>
          </Stack>

          {/* Task Details */}
          {variant !== 'compact' && (
            <>
              {/* Assignee and Due Date */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  {task.assignee && (
                    <Tooltip title={`Assigned to ${task.assignee}`}>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24,
                          bgcolor: theme.palette.primary.main,
                          fontSize: '0.75rem'
                        }}
                      >
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </Tooltip>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {task.assignee || 'Unassigned'}
                  </Typography>
                </Stack>
                
                {task.dueDate && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Calendar sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(task.dueDate), 'MMM dd')}
                    </Typography>
                  </Stack>
                )}
              </Stack>

              {/* Construction-specific tags */}
              {(task.tags || task.category) && (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {task.tags?.map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={tag}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: theme.palette.grey[200],
                        color: theme.palette.text.secondary
                      }}
                    />
                  ))}
                </Stack>
              )}

              {/* Progress for construction tasks */}
              {isConstructionTask && task.progress !== undefined && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {task.progress}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={task.progress}
                    sx={{
                      height: 4,
                      borderRadius: 1,
                      bgcolor: theme.palette.grey[200]
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Standard Card wrapper for other content types
export const StandardCard = ({
  variant = 'medium',
  children,
  header,
  actions,
  onClick,
  selected = false,
  hoverable = true,
  constructionContext = false,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const cardStyles = getCardStyles(theme, { selected, hoverable, variant });

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{ ...cardStyles, ...sx }}
      {...props}
    >
      {constructionContext && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, 
              ${theme.palette.primary.main} 0%, 
              ${theme.palette.secondary.main} 100%)`
          }}
        />
      )}
      
      {header && (
        <Box sx={{ p: 2, pb: 0 }}>
          {typeof header === 'string' ? (
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {header}
            </Typography>
          ) : (
            header
          )}
        </Box>
      )}
      
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {children}
      </CardContent>
      
      {actions && (
        <>
          <Divider />
          <CardActions sx={{ p: 1.5 }}>
            {actions}
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default { ProjectCard, TaskCard, StandardCard };