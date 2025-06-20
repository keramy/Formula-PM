// Centralized exports for standardized UI components
export { 
  default as StatusChip, 
  PriorityChip, 
  TaskStatusChip, 
  ProjectStatusChip, 
  ProjectTypeChip,
  ConstructionPhaseChip,
  QualityStatusChip,
  SafetyLevelChip
} from './StatusChip';

export { default as ActionTooltip } from './ActionTooltip';

// Enhanced card components
export { default as StandardCard } from './StandardCard';
export { ProjectCard, TaskCard } from './StandardCards';

// Comprehensive loading states
export {
  default as LoadingStates,
  PageLoading,
  SectionLoading,
  CardSkeleton,
  ListLoading,
  TableLoading,
  FormLoading,
  DashboardLoading,
  InlineLoading,
  LoadingWrapper
} from './LoadingStates';

// Re-export existing components for convenience
export { default as UnifiedHeader } from './UnifiedHeader';
export { default as UnifiedFilters } from './UnifiedFilters';
export { default as UnifiedTableView } from './UnifiedTableView';
export { default as GlobalSearchResults } from './GlobalSearchResults';
export { default as OptionsMenu } from './OptionsMenu';
export { default as ProjectTeamAvatars } from './ProjectTeamAvatars';

// Backward compatibility exports (temporary)
export { default as ActionIconButton } from './ActionTooltip';

// Common tooltips for backward compatibility
export const commonTooltips = {
  view: 'View details',
  edit: 'Edit',
  delete: 'Delete',
  complete: 'Mark as completed',
  start: 'Start working'
};