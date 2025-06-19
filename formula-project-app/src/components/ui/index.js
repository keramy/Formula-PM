// Centralized exports for standardized UI components
export { default as StatusChip } from './StatusChip';
export { default as ActionTooltip } from './ActionTooltip';
export { default as StandardCard } from './StandardCard';

// Re-export existing components for convenience
export { default as UnifiedHeader } from './UnifiedHeader';
export { default as UnifiedFilters } from './UnifiedFilters';
export { default as UnifiedTableView } from './UnifiedTableView';
export { default as GlobalSearchResults } from './GlobalSearchResults';
export { default as OptionsMenu } from './OptionsMenu';

// Backward compatibility exports (temporary)
export { default as ActionIconButton } from './ActionTooltip';
export { default as TaskStatusChip } from './StatusChip';
export { default as PriorityChip } from './StatusChip';
export { default as ProjectStatusChip } from './StatusChip';
export { default as ProjectTypeChip } from './StatusChip';
export { default as TaskCard } from './StandardCard';
export { default as ProjectCard } from './StandardCard';

// Common tooltips for backward compatibility
export const commonTooltips = {
  view: 'View details',
  edit: 'Edit',
  delete: 'Delete',
  complete: 'Mark as completed',
  start: 'Start working'
};