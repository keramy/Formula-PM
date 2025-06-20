/**
 * React Icons System Exports
 * Complete React Icons implementation for Formula PM
 */

// Main icon wrapper components
export { default as IconWrapper } from './IconWrapper';
export {
  NavigationIcon,
  ActionIcon,
  StatusIcon,
  ConstructionIcon
} from './IconWrapper';

// React Icons mappings and utilities
export {
  ConstructionIcons,
  NavigationIcons,
  ActionIcons,
  StatusIcons,
  ViewIcons,
  FileIcons,
  CommunicationIcons,
  ChartIcons,
  NavigationControlIcons,
  AllIcons,
  getIcon,
  getConstructionIcon,
  IconCategories
} from './ReactIcons';

// Re-export some commonly used icons directly for convenience
export {
  AllIcons as Icons
} from './ReactIcons';

// Default export
export { AllIcons as default } from './ReactIcons';