// Debug utilities for development
export const isDevelopment = import.meta.env.MODE === 'development';

export const debugLog = (message, data = null) => {
  if (isDevelopment) {
    if (data) {
      console.log(`🐛 ${message}`, data);
    } else {
      console.log(`🐛 ${message}`);
    }
  }
};

export const debugError = (message, error = null) => {
  if (isDevelopment) {
    console.error(`🚨 ${message}`, error);
  }
};

export const debugWarn = (message, data = null) => {
  if (isDevelopment) {
    if (data) {
      console.warn(`⚠️ ${message}`, data);
    } else {
      console.warn(`⚠️ ${message}`);
    }
  }
};

export const debugTime = (label) => {
  if (isDevelopment) {
    console.time(label);
  }
};

export const debugTimeEnd = (label) => {
  if (isDevelopment) {
    console.timeEnd(label);
  }
};

export const debugComponent = (componentName, props = null) => {
  if (isDevelopment) {
    console.log(`📦 Rendering ${componentName}`, props);
  }
};

export default {
  isDevelopment,
  debugLog,
  debugError,
  debugWarn,
  debugTime,
  debugTimeEnd,
  debugComponent
};