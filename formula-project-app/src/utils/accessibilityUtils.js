/**
 * Accessibility Utilities for Construction Industry
 * WCAG 2.1 AA Compliance with construction-specific considerations
 */

// Color contrast calculation
const getLuminance = (rgb) => {
  const [r, g, b] = rgb.map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
};

export const getContrastRatio = (color1, color2) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

// WCAG compliance checking
export const isWCAGCompliant = (backgroundColor, textColor, level = 'AA') => {
  const ratio = getContrastRatio(backgroundColor, textColor);
  const thresholds = {
    'AA': 4.5,
    'AAA': 7,
    'AA-large': 3,
    'AAA-large': 4.5
  };
  return ratio >= (thresholds[level] || 4.5);
};

// Construction-specific accessibility improvements
export const getAccessibleConstructionColors = (baseColor, context = 'general') => {
  const contextColors = {
    safety: {
      background: '#fff3cd',
      text: '#856404',
      border: '#ffeaa7',
      critical: '#721c24'
    },
    quality: {
      background: '#d4edda',
      text: '#155724',
      border: '#c3e6cb',
      warning: '#856404'
    },
    phase: {
      background: '#d1ecf1',
      text: '#0c5460',
      border: '#bee5eb',
      active: '#0056b3'
    },
    general: {
      background: '#ffffff',
      text: '#1B2951',
      border: '#c0c0c0',
      accent: '#3498db'
    }
  };

  return contextColors[context] || contextColors.general;
};

// ARIA attributes for construction elements
export const getConstructionAriaProps = (element, context = {}) => {
  const ariaProps = {};

  switch (element) {
    case 'project-card':
      ariaProps['aria-label'] = `Project: ${context.name || 'Unnamed project'}`;
      ariaProps['role'] = 'button';
      ariaProps['tabIndex'] = 0;
      if (context.status) {
        ariaProps['aria-describedby'] = `project-status-${context.id}`;
      }
      break;

    case 'task-card':
      ariaProps['aria-label'] = `Task: ${context.title || 'Unnamed task'}`;
      ariaProps['role'] = 'button';
      ariaProps['tabIndex'] = 0;
      if (context.priority) {
        ariaProps['aria-describedby'] = `task-priority-${context.id}`;
      }
      break;

    case 'status-chip':
      ariaProps['aria-label'] = `Status: ${context.status || 'Unknown'}`;
      ariaProps['role'] = 'status';
      if (context.interactive) {
        ariaProps['tabIndex'] = 0;
        ariaProps['role'] = 'button';
      }
      break;

    case 'safety-indicator':
      ariaProps['aria-label'] = `Safety level: ${context.level || 'Unknown'}`;
      ariaProps['role'] = 'status';
      ariaProps['aria-live'] = 'polite';
      break;

    case 'construction-phase':
      ariaProps['aria-label'] = `Construction phase: ${context.phase || 'Unknown'}`;
      ariaProps['role'] = 'status';
      break;

    case 'progress-bar':
      ariaProps['aria-label'] = `Progress: ${context.progress || 0}% complete`;
      ariaProps['role'] = 'progressbar';
      ariaProps['aria-valuenow'] = context.progress || 0;
      ariaProps['aria-valuemin'] = 0;
      ariaProps['aria-valuemax'] = 100;
      break;

    case 'quality-status':
      ariaProps['aria-label'] = `Quality status: ${context.quality || 'Unknown'}`;
      ariaProps['role'] = 'status';
      ariaProps['aria-live'] = 'assertive';
      break;

    default:
      ariaProps['aria-label'] = context.label || 'Interactive element';
      ariaProps['tabIndex'] = 0;
  }

  return ariaProps;
};

// Screen reader friendly text for construction elements
export const getScreenReaderText = (element, context = {}) => {
  switch (element) {
    case 'project-summary':
      return `Project ${context.name}. Status: ${context.status}. Progress: ${context.progress}% complete. ${context.phase ? `Current phase: ${context.phase}.` : ''}`;

    case 'task-summary':
      return `Task ${context.title}. Priority: ${context.priority}. Status: ${context.status}. ${context.assignee ? `Assigned to ${context.assignee}.` : 'Unassigned.'}`;

    case 'safety-summary':
      return `Safety level: ${context.level}. Score: ${context.score}%. ${context.critical ? 'Critical safety attention required.' : ''}`;

    case 'construction-phase-summary':
      return `Construction phase: ${context.phase}. ${context.startDate ? `Started ${context.startDate}.` : ''} ${context.duration ? `Expected duration: ${context.duration}.` : ''}`;

    case 'quality-summary':
      return `Quality status: ${context.status}. ${context.inspector ? `Inspector: ${context.inspector}.` : ''} ${context.notes ? `Notes: ${context.notes}` : ''}`;

    default:
      return context.description || 'Construction project element';
  }
};

// Keyboard navigation helpers
export const getConstructionKeyboardHandlers = (element, callbacks = {}) => {
  const handlers = {};

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (callbacks.onActivate) {
          callbacks.onActivate(event);
        }
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        if (callbacks.onNext) {
          callbacks.onNext(event);
        }
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        if (callbacks.onPrevious) {
          callbacks.onPrevious(event);
        }
        break;

      case 'Home':
        event.preventDefault();
        if (callbacks.onFirst) {
          callbacks.onFirst(event);
        }
        break;

      case 'End':
        event.preventDefault();
        if (callbacks.onLast) {
          callbacks.onLast(event);
        }
        break;

      case 'Escape':
        if (callbacks.onEscape) {
          callbacks.onEscape(event);
        }
        break;

      default:
        if (callbacks.onOther) {
          callbacks.onOther(event);
        }
    }
  };

  handlers.onKeyDown = handleKeyDown;
  handlers.tabIndex = 0;
  handlers.role = element === 'button' ? 'button' : 'generic';

  return handlers;
};

// Focus management for construction workflows
export const createFocusManager = (containerRef, options = {}) => {
  const focusableSelectors = [
    'button:not(:disabled)',
    'input:not(:disabled)',
    'select:not(:disabled)',
    'textarea:not(:disabled)',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]:not([aria-disabled="true"])'
  ].join(', ');

  const getFocusableElements = () => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll(focusableSelectors));
  };

  const focusFirst = () => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  };

  const focusLast = () => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  };

  const focusNext = (currentElement) => {
    const elements = getFocusableElements();
    const currentIndex = elements.indexOf(currentElement);
    const nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0;
    elements[nextIndex].focus();
  };

  const focusPrevious = (currentElement) => {
    const elements = getFocusableElements();
    const currentIndex = elements.indexOf(currentElement);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1;
    elements[previousIndex].focus();
  };

  return {
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    getFocusableElements
  };
};

// High contrast mode detection and adjustment
export const getHighContrastStyles = (baseStyles = {}) => {
  // Detect if user prefers high contrast
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersHighContrast) return baseStyles;

  return {
    ...baseStyles,
    border: '2px solid currentColor',
    backgroundColor: 'ButtonFace',
    color: 'ButtonText',
    outline: 'none',
    transition: prefersReducedMotion ? 'none' : baseStyles.transition,
    '&:focus': {
      outline: '3px solid Highlight',
      outlineOffset: '2px'
    },
    '&:hover': {
      backgroundColor: 'Highlight',
      color: 'HighlightText'
    }
  };
};

// Construction-specific announcements for screen readers
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Responsive text sizing for construction site usage
export const getConstructionTextSizes = (baseSize = 16) => {
  // Larger text for mobile/tablet use on construction sites
  return {
    mobile: {
      small: Math.max(baseSize * 0.875, 14),
      medium: Math.max(baseSize, 16),
      large: Math.max(baseSize * 1.125, 18),
      xlarge: Math.max(baseSize * 1.25, 20)
    },
    tablet: {
      small: Math.max(baseSize * 0.875, 14),
      medium: Math.max(baseSize, 16), 
      large: Math.max(baseSize * 1.125, 18),
      xlarge: Math.max(baseSize * 1.25, 20)
    },
    desktop: {
      small: baseSize * 0.875,
      medium: baseSize,
      large: baseSize * 1.125,
      xlarge: baseSize * 1.25
    }
  };
};

export default {
  getContrastRatio,
  isWCAGCompliant,
  getAccessibleConstructionColors,
  getConstructionAriaProps,
  getScreenReaderText,
  getConstructionKeyboardHandlers,
  createFocusManager,
  getHighContrastStyles,
  announceToScreenReader,
  getConstructionTextSizes
};