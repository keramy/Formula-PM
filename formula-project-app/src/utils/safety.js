/**
 * Comprehensive null safety and data validation utilities
 * Provides defensive programming patterns and safe data access
 */

// Core null safety functions
export const isNullOrUndefined = (value) => value === null || value === undefined;
export const isNullOrEmpty = (value) => isNullOrUndefined(value) || value === '';
export const isValidValue = (value) => !isNullOrUndefined(value);

// Safe property access with default values
export const safeGet = (obj, path, defaultValue = null) => {
  if (isNullOrUndefined(obj)) return defaultValue;
  
  const keys = Array.isArray(path) ? path : path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (isNullOrUndefined(current) || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return isNullOrUndefined(current) ? defaultValue : current;
};

// Safe array operations
export const safeArray = (arr, defaultValue = []) => {
  return Array.isArray(arr) ? arr : defaultValue;
};

export const safeArrayAccess = (arr, index, defaultValue = null) => {
  if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
    return defaultValue;
  }
  return arr[index];
};

export const safeArrayMap = (arr, mapper, defaultValue = []) => {
  if (!Array.isArray(arr)) return defaultValue;
  
  try {
    return arr.map((item, index) => {
      try {
        return mapper(item, index);
      } catch (error) {
        console.warn('Error in array mapper:', error);
        return null;
      }
    }).filter(item => item !== null);
  } catch (error) {
    console.warn('Error in safeArrayMap:', error);
    return defaultValue;
  }
};

export const safeArrayFilter = (arr, predicate, defaultValue = []) => {
  if (!Array.isArray(arr)) return defaultValue;
  
  try {
    return arr.filter((item, index) => {
      try {
        return predicate(item, index);
      } catch (error) {
        console.warn('Error in array filter predicate:', error);
        return false;
      }
    });
  } catch (error) {
    console.warn('Error in safeArrayFilter:', error);
    return defaultValue;
  }
};

export const safeArrayFind = (arr, predicate, defaultValue = null) => {
  if (!Array.isArray(arr)) return defaultValue;
  
  try {
    return arr.find((item, index) => {
      try {
        return predicate(item, index);
      } catch (error) {
        console.warn('Error in array find predicate:', error);
        return false;
      }
    }) || defaultValue;
  } catch (error) {
    console.warn('Error in safeArrayFind:', error);
    return defaultValue;
  }
};

// Safe string operations
export const safeString = (str, defaultValue = '') => {
  if (typeof str === 'string') return str;
  if (typeof str === 'number') return str.toString();
  return defaultValue;
};

export const safeStringLength = (str, defaultValue = 0) => {
  return safeString(str).length || defaultValue;
};

export const safeTrim = (str, defaultValue = '') => {
  return safeString(str, defaultValue).trim();
};

export const safeUpperCase = (str, defaultValue = '') => {
  return safeString(str, defaultValue).toUpperCase();
};

export const safeLowerCase = (str, defaultValue = '') => {
  return safeString(str, defaultValue).toLowerCase();
};

// Safe number operations
export const safeNumber = (num, defaultValue = 0) => {
  if (typeof num === 'number' && !isNaN(num)) return num;
  
  const parsed = parseFloat(num);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const safeInteger = (num, defaultValue = 0) => {
  const parsed = parseInt(num, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const safeAdd = (a, b, defaultValue = 0) => {
  return safeNumber(a) + safeNumber(b, 0);
};

export const safeSubtract = (a, b, defaultValue = 0) => {
  return safeNumber(a) - safeNumber(b, 0);
};

export const safeMultiply = (a, b, defaultValue = 0) => {
  return safeNumber(a) * safeNumber(b, 1);
};

export const safeDivide = (a, b, defaultValue = 0) => {
  const numA = safeNumber(a);
  const numB = safeNumber(b);
  
  if (numB === 0) {
    console.warn('Division by zero attempted');
    return defaultValue;
  }
  
  return numA / numB;
};

// Safe date operations
export const safeDate = (date, defaultValue = null) => {
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date;
  }
  
  if (typeof date === 'string' || typeof date === 'number') {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  
  return defaultValue;
};

export const safeDateFormat = (date, options = {}, defaultValue = '') => {
  const safeD = safeDate(date);
  if (!safeD) return defaultValue;
  
  try {
    return safeD.toLocaleDateString(undefined, options);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return defaultValue;
  }
};

export const safeDateDiff = (date1, date2, unit = 'days', defaultValue = 0) => {
  const d1 = safeDate(date1);
  const d2 = safeDate(date2);
  
  if (!d1 || !d2) return defaultValue;
  
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  
  switch (unit) {
    case 'milliseconds':
      return diffMs;
    case 'seconds':
      return Math.floor(diffMs / 1000);
    case 'minutes':
      return Math.floor(diffMs / (1000 * 60));
    case 'hours':
      return Math.floor(diffMs / (1000 * 60 * 60));
    case 'days':
      return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    default:
      return defaultValue;
  }
};

// Safe object operations
export const safeObject = (obj, defaultValue = {}) => {
  return (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : defaultValue;
};

export const safeObjectKeys = (obj, defaultValue = []) => {
  const safeObj = safeObject(obj);
  return Object.keys(safeObj) || defaultValue;
};

export const safeObjectValues = (obj, defaultValue = []) => {
  const safeObj = safeObject(obj);
  return Object.values(safeObj) || defaultValue;
};

export const safeObjectEntries = (obj, defaultValue = []) => {
  const safeObj = safeObject(obj);
  return Object.entries(safeObj) || defaultValue;
};

// Safe JSON operations
export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.warn('Error parsing JSON:', error);
    return defaultValue;
  }
};

export const safeJsonStringify = (obj, defaultValue = '{}') => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.warn('Error stringifying JSON:', error);
    return defaultValue;
  }
};

// Safe function execution
export const safeExecute = (fn, defaultValue = null, ...args) => {
  if (typeof fn !== 'function') {
    console.warn('safeExecute: provided value is not a function');
    return defaultValue;
  }
  
  try {
    return fn(...args);
  } catch (error) {
    console.warn('Error executing function:', error);
    return defaultValue;
  }
};

export const safeAsyncExecute = async (fn, defaultValue = null, ...args) => {
  if (typeof fn !== 'function') {
    console.warn('safeAsyncExecute: provided value is not a function');
    return defaultValue;
  }
  
  try {
    return await fn(...args);
  } catch (error) {
    console.warn('Error executing async function:', error);
    return defaultValue;
  }
};

// Data validation helpers
export const validateRequired = (value, fieldName = 'field') => {
  if (isNullOrEmpty(value)) {
    throw new Error(`${fieldName} is required`);
  }
  return value;
};

export const validateEmail = (email, defaultValue = null) => {
  const emailStr = safeString(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (emailRegex.test(emailStr)) {
    return emailStr;
  }
  
  return defaultValue;
};

export const validatePhone = (phone, defaultValue = null) => {
  const phoneStr = safeString(phone).replace(/\D/g, '');
  
  if (phoneStr.length >= 10) {
    return phoneStr;
  }
  
  return defaultValue;
};

export const validateUrl = (url, defaultValue = null) => {
  try {
    new URL(url);
    return url;
  } catch (error) {
    return defaultValue;
  }
};

// Complex data structure validators
export const validateProjectData = (project) => {
  const errors = [];
  
  if (isNullOrEmpty(safeGet(project, 'name'))) {
    errors.push('Project name is required');
  }
  
  if (isNullOrEmpty(safeGet(project, 'clientId'))) {
    errors.push('Client is required');
  }
  
  const startDate = safeDate(safeGet(project, 'startDate'));
  if (!startDate) {
    errors.push('Valid start date is required');
  }
  
  const endDate = safeDate(safeGet(project, 'endDate'));
  if (!endDate) {
    errors.push('Valid end date is required');
  }
  
  if (startDate && endDate && startDate >= endDate) {
    errors.push('End date must be after start date');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: {
      id: safeGet(project, 'id'),
      name: safeTrim(safeGet(project, 'name')),
      description: safeTrim(safeGet(project, 'description', '')),
      clientId: safeGet(project, 'clientId'),
      startDate: startDate,
      endDate: endDate,
      status: safeGet(project, 'status', 'draft'),
      budget: safeNumber(safeGet(project, 'budget'), 0),
      teamMembers: safeArray(safeGet(project, 'teamMembers')),
      tags: safeArray(safeGet(project, 'tags'))
    }
  };
};

export const validateTaskData = (task) => {
  const errors = [];
  
  if (isNullOrEmpty(safeGet(task, 'title'))) {
    errors.push('Task title is required');
  }
  
  if (isNullOrEmpty(safeGet(task, 'projectId'))) {
    errors.push('Project is required');
  }
  
  const dueDate = safeGet(task, 'dueDate');
  if (dueDate && !safeDate(dueDate)) {
    errors.push('Valid due date is required if provided');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: {
      id: safeGet(task, 'id'),
      title: safeTrim(safeGet(task, 'title')),
      description: safeTrim(safeGet(task, 'description', '')),
      projectId: safeGet(task, 'projectId'),
      assigneeId: safeGet(task, 'assigneeId'),
      status: safeGet(task, 'status', 'pending'),
      priority: safeGet(task, 'priority', 'medium'),
      dueDate: safeDate(dueDate),
      estimatedHours: safeNumber(safeGet(task, 'estimatedHours'), 0),
      tags: safeArray(safeGet(task, 'tags'))
    }
  };
};

export const validateTeamMemberData = (member) => {
  const errors = [];
  
  if (isNullOrEmpty(safeGet(member, 'name'))) {
    errors.push('Name is required');
  }
  
  const email = safeGet(member, 'email');
  if (isNullOrEmpty(email)) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Valid email is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: {
      id: safeGet(member, 'id'),
      name: safeTrim(safeGet(member, 'name')),
      email: safeTrim(safeGet(member, 'email')),
      role: safeGet(member, 'role', 'member'),
      department: safeTrim(safeGet(member, 'department', '')),
      phone: validatePhone(safeGet(member, 'phone'), ''),
      isActive: Boolean(safeGet(member, 'isActive', true))
    }
  };
};

// Safe data transformation helpers
export const safeTransformProjects = (projects) => {
  return safeArrayMap(safeArray(projects), (project) => ({
    id: safeGet(project, 'id'),
    name: safeTrim(safeGet(project, 'name', 'Untitled Project')),
    description: safeTrim(safeGet(project, 'description', '')),
    status: safeGet(project, 'status', 'draft'),
    clientId: safeGet(project, 'clientId'),
    clientName: safeTrim(safeGet(project, 'clientName', 'Unknown Client')),
    startDate: safeDate(safeGet(project, 'startDate')),
    endDate: safeDate(safeGet(project, 'endDate')),
    budget: safeNumber(safeGet(project, 'budget'), 0),
    progress: Math.max(0, Math.min(100, safeNumber(safeGet(project, 'progress'), 0))),
    teamMembers: safeArray(safeGet(project, 'teamMembers')),
    tags: safeArray(safeGet(project, 'tags')),
    createdAt: safeDate(safeGet(project, 'createdAt')),
    updatedAt: safeDate(safeGet(project, 'updatedAt'))
  }));
};

export const safeTransformTasks = (tasks) => {
  return safeArrayMap(safeArray(tasks), (task) => ({
    id: safeGet(task, 'id'),
    title: safeTrim(safeGet(task, 'title', 'Untitled Task')),
    description: safeTrim(safeGet(task, 'description', '')),
    status: safeGet(task, 'status', 'pending'),
    priority: safeGet(task, 'priority', 'medium'),
    projectId: safeGet(task, 'projectId'),
    projectName: safeTrim(safeGet(task, 'projectName', 'Unknown Project')),
    assigneeId: safeGet(task, 'assigneeId'),
    assigneeName: safeTrim(safeGet(task, 'assigneeName', 'Unassigned')),
    dueDate: safeDate(safeGet(task, 'dueDate')),
    estimatedHours: safeNumber(safeGet(task, 'estimatedHours'), 0),
    actualHours: safeNumber(safeGet(task, 'actualHours'), 0),
    tags: safeArray(safeGet(task, 'tags')),
    createdAt: safeDate(safeGet(task, 'createdAt')),
    updatedAt: safeDate(safeGet(task, 'updatedAt'))
  }));
};

export const safeTransformTeamMembers = (members) => {
  return safeArrayMap(safeArray(members), (member) => ({
    id: safeGet(member, 'id'),
    name: safeTrim(safeGet(member, 'name', 'Unknown User')),
    email: safeTrim(safeGet(member, 'email', '')),
    role: safeGet(member, 'role', 'member'),
    department: safeTrim(safeGet(member, 'department', '')),
    phone: safeTrim(safeGet(member, 'phone', '')),
    avatar: safeGet(member, 'avatar'),
    isActive: Boolean(safeGet(member, 'isActive', true)),
    lastLoginAt: safeDate(safeGet(member, 'lastLoginAt')),
    createdAt: safeDate(safeGet(member, 'createdAt')),
    updatedAt: safeDate(safeGet(member, 'updatedAt'))
  }));
};

// Debug helpers
export const debugSafety = {
  logNullAccess: (obj, path, context = 'unknown') => {
    if (import.meta.env.MODE === 'development') {
      const value = safeGet(obj, path);
      if (isNullOrUndefined(value)) {
        console.warn(`Null/undefined access in ${context}: ${path}`, obj);
      }
    }
  },
  
  validateDataStructure: (data, expectedKeys, context = 'data') => {
    if (import.meta.env.MODE === 'development') {
      const safeData = safeObject(data);
      const missingKeys = expectedKeys.filter(key => !(key in safeData));
      
      if (missingKeys.length > 0) {
        console.warn(`Missing keys in ${context}:`, missingKeys, safeData);
      }
    }
  }
};

export default {
  // Core functions
  isNullOrUndefined,
  isNullOrEmpty,
  isValidValue,
  safeGet,
  
  // Array operations
  safeArray,
  safeArrayAccess,
  safeArrayMap,
  safeArrayFilter,
  safeArrayFind,
  
  // String operations
  safeString,
  safeStringLength,
  safeTrim,
  safeUpperCase,
  safeLowerCase,
  
  // Number operations
  safeNumber,
  safeInteger,
  safeAdd,
  safeSubtract,
  safeMultiply,
  safeDivide,
  
  // Date operations
  safeDate,
  safeDateFormat,
  safeDateDiff,
  
  // Object operations
  safeObject,
  safeObjectKeys,
  safeObjectValues,
  safeObjectEntries,
  
  // JSON operations
  safeJsonParse,
  safeJsonStringify,
  
  // Function execution
  safeExecute,
  safeAsyncExecute,
  
  // Validation
  validateRequired,
  validateEmail,
  validatePhone,
  validateUrl,
  validateProjectData,
  validateTaskData,
  validateTeamMemberData,
  
  // Data transformation
  safeTransformProjects,
  safeTransformTasks,
  safeTransformTeamMembers,
  
  // Debug helpers
  debugSafety
};