/**
 * Input Validation Middleware
 * Handles request validation using express-validator and custom validators
 */

const { body, param, query, validationResult } = require('express-validator');
const { v4: isValidUUID } = require('uuid');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach(error => {
      formattedErrors[error.path] = error.msg;
    });

    return res.status(422).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: formattedErrors,
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

/**
 * Custom UUID validator
 */
const isUUID = (value) => {
  try {
    return isValidUUID(value);
  } catch {
    return false;
  }
};

/**
 * Authentication validation rules
 */
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  handleValidationErrors
];

const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('First name must be between 2 and 100 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters'),
  body('role')
    .isIn(['admin', 'project_manager', 'designer', 'craftsman', 'coordinator', 'client'])
    .withMessage('Invalid role specified'),
  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position must be less than 100 characters'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department must be less than 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number required'),
  handleValidationErrors
];

const validateRefreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
  handleValidationErrors
];

/**
 * User validation rules
 */
const validateCreateUser = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('First name must be between 2 and 100 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters'),
  body('role')
    .isIn(['admin', 'project_manager', 'designer', 'craftsman', 'coordinator', 'client'])
    .withMessage('Invalid role specified'),
  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position must be less than 100 characters'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department must be less than 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number required'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('certifications')
    .optional()
    .isArray()
    .withMessage('Certifications must be an array'),
  handleValidationErrors
];

const validateUpdateUser = [
  param('id')
    .custom(isUUID)
    .withMessage('Valid user ID is required'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('First name must be between 2 and 100 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'project_manager', 'designer', 'craftsman', 'coordinator', 'client'])
    .withMessage('Invalid role specified'),
  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position must be less than 100 characters'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department must be less than 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number required'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Invalid status specified'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('certifications')
    .optional()
    .isArray()
    .withMessage('Certifications must be an array'),
  handleValidationErrors
];

/**
 * Project validation rules
 */
const validateCreateProject = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Project name must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('type')
    .isIn(['commercial', 'residential', 'retail', 'hospitality', 'industrial', 'healthcare'])
    .withMessage('Invalid project type'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  body('budget')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Budget must be a valid decimal number'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters'),
  body('clientId')
    .custom(isUUID)
    .withMessage('Valid client ID is required'),
  body('projectManagerId')
    .optional()
    .custom(isUUID)
    .withMessage('Valid project manager ID is required'),
  handleValidationErrors
];

const validateUpdateProject = [
  param('id')
    .custom(isUUID)
    .withMessage('Valid project ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Project name must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('type')
    .optional()
    .isIn(['commercial', 'residential', 'retail', 'hospitality', 'industrial', 'healthcare'])
    .withMessage('Invalid project type'),
  body('status')
    .optional()
    .isIn(['draft', 'active', 'on_tender', 'on_hold', 'completed', 'cancelled'])
    .withMessage('Invalid project status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  body('budget')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Budget must be a valid decimal number'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters'),
  body('projectManagerId')
    .optional()
    .custom(isUUID)
    .withMessage('Valid project manager ID is required'),
  handleValidationErrors
];

/**
 * Task validation rules
 */
const validateCreateTask = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Task name must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('projectId')
    .custom(isUUID)
    .withMessage('Valid project ID is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  body('assignedTo')
    .optional()
    .custom(isUUID)
    .withMessage('Valid assignee ID is required'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('estimatedHours')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Estimated hours must be a valid decimal number'),
  handleValidationErrors
];

const validateUpdateTask = [
  param('id')
    .custom(isUUID)
    .withMessage('Valid task ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Task name must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'review', 'completed', 'cancelled'])
    .withMessage('Invalid task status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  body('assignedTo')
    .optional()
    .custom(isUUID)
    .withMessage('Valid assignee ID is required'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('estimatedHours')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Estimated hours must be a valid decimal number'),
  body('actualHours')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Actual hours must be a valid decimal number'),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  handleValidationErrors
];

/**
 * Scope validation rules
 */
const validateCreateScopeGroup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Scope group name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('orderIndex')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order index must be a non-negative integer'),
  handleValidationErrors
];

const validateCreateScopeItem = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Scope item name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('scopeGroupId')
    .custom(isUUID)
    .withMessage('Valid scope group ID is required'),
  body('estimatedCost')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Estimated cost must be a valid decimal number'),
  body('orderIndex')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order index must be a non-negative integer'),
  handleValidationErrors
];

/**
 * Material specification validation rules
 */
const validateCreateMaterial = [
  body('description')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Description must be between 5 and 500 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  body('material')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Material must be less than 100 characters'),
  body('finish')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Finish must be less than 100 characters'),
  body('quantity')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Quantity must be a valid decimal number'),
  body('unit')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Unit must be between 1 and 20 characters'),
  body('unitCost')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Unit cost must be a valid decimal number'),
  body('supplier')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Supplier must be less than 200 characters'),
  body('leadTime')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Lead time must be less than 50 characters'),
  handleValidationErrors
];

/**
 * Query parameter validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Sort field must be specified'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  handleValidationErrors
];

const validateSearch = [
  query('q')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Search query must be between 2 and 200 characters'),
  query('type')
    .optional()
    .isIn(['projects', 'tasks', 'users', 'materials', 'drawings'])
    .withMessage('Invalid search type'),
  handleValidationErrors
];

/**
 * Common parameter validation
 */
const validateUUIDParam = (paramName = 'id') => [
  param(paramName)
    .custom(isUUID)
    .withMessage(`Valid ${paramName} is required`),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  
  // Authentication
  validateLogin,
  validateRegister,
  validateRefreshToken,
  
  // Users
  validateCreateUser,
  validateUpdateUser,
  
  // Projects
  validateCreateProject,
  validateUpdateProject,
  
  // Tasks
  validateCreateTask,
  validateUpdateTask,
  
  // Scope
  validateCreateScopeGroup,
  validateCreateScopeItem,
  
  // Materials
  validateCreateMaterial,
  
  // Query parameters
  validatePagination,
  validateSearch,
  
  // Common
  validateUUIDParam,
  isUUID
};