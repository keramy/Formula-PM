/**
 * Unified Components Export
 * Phase 2 Component Standardization for Formula PM
 * 
 * These components provide consistent UI patterns across the application:
 * - MasterHeader: Standardized header with [Search] [Filters] [Export] [Add] [More] [User] layout
 * - UnifiedSearch: Centralized search with debouncing, live results, and keyboard navigation
 * - UniversalTabs: Flexible tab system supporting standard, enhanced, and pills variants
 * - UniversalFilters: Configurable filter system with dropdown, chips, and sidebar layouts
 */

export { default as MasterHeader } from './MasterHeader';
export { default as UnifiedSearch } from './UnifiedSearch';
export { default as UniversalTabs } from './UniversalTabs';
export { default as UniversalFilters } from './UniversalFilters';
export { default as UnifiedComponentsExample } from './UnifiedComponentsExample';

// Re-export types if needed
export const HeaderVariants = {
  DEFAULT: 'default',
  COMPACT: 'compact',
  MINIMAL: 'minimal'
};

export const TabVariants = {
  STANDARD: 'standard',
  ENHANCED: 'enhanced',
  PILLS: 'pills'
};

export const FilterLayouts = {
  DROPDOWN: 'dropdown',
  CHIPS: 'chips',
  SIDEBAR: 'sidebar'
};

export const FilterTypes = {
  TEXT: 'text',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  DATE: 'date',
  DATERANGE: 'daterange',
  RANGE: 'range',
  BOOLEAN: 'boolean'
};