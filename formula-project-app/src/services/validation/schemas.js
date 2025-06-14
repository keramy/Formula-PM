import * as yup from 'yup';

// ============================================
// UTILITY VALIDATION FUNCTIONS
// ============================================

const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Custom validation for dates
const futureDate = (message = 'Date must be in the future') => 
  yup.date().min(new Date(), message);

const pastDate = (message = 'Date must be in the past') => 
  yup.date().max(new Date(), message);

// Custom validation for end date after start date
const endDateAfterStartDate = (startDateField = 'startDate') =>
  yup.date().when(startDateField, (startDate, schema) => {
    if (startDate) {
      return schema.min(startDate, 'End date must be after start date');
    }
    return schema;
  });

// ============================================
// PROJECT VALIDATION SCHEMA
// ============================================

export const projectSchema = yup.object({
  name: yup
    .string()
    .required('Project name is required')
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must not exceed 100 characters')
    .trim(),
    
  description: yup
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .trim(),
    
  type: yup
    .string()
    .required('Project type is required')
    .oneOf(
      ['fit-out', 'mep', 'general-contractor', 'renovation', 'new-construction', 'other'],
      'Please select a valid project type'
    ),
    
  status: yup
    .string()
    .oneOf(
      ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
      'Please select a valid status'
    )
    .default('planning'),
    
  priority: yup
    .string()
    .oneOf(['low', 'medium', 'high', 'critical'], 'Please select a valid priority')
    .default('medium'),
    
  clientId: yup
    .number()
    .required('Client is required')
    .positive('Please select a valid client'),
    
  managerId: yup
    .number()
    .nullable()
    .positive('Please select a valid project manager'),
    
  startDate: yup
    .date()
    .required('Start date is required')
    .typeError('Please enter a valid start date'),
    
  endDate: yup
    .date()
    .required('End date is required')
    .typeError('Please enter a valid end date')
    .test('end-after-start', 'End date must be after start date', function(value) {
      const { startDate } = this.parent;
      if (startDate && value) {
        return new Date(value) > new Date(startDate);
      }
      return true;
    }),
    
  budget: yup
    .number()
    .required('Budget is required')
    .positive('Budget must be a positive number')
    .max(100000000, 'Budget seems unreasonably high')
    .typeError('Please enter a valid budget amount'),
    
  progress: yup
    .number()
    .min(0, 'Progress cannot be negative')
    .max(100, 'Progress cannot exceed 100%')
    .default(0),
    
  location: yup.object({
    address: yup.string().max(200, 'Address must not exceed 200 characters'),
    city: yup.string().max(50, 'City must not exceed 50 characters'),
    state: yup.string().max(50, 'State must not exceed 50 characters'),
    zipCode: yup.string().max(20, 'Zip code must not exceed 20 characters'),
    country: yup.string().max(50, 'Country must not exceed 50 characters'),
  }).nullable(),
});

// ============================================
// TASK VALIDATION SCHEMA
// ============================================

export const taskSchema = yup.object({
  name: yup
    .string()
    .required('Task name is required')
    .min(3, 'Task name must be at least 3 characters')
    .max(200, 'Task name must not exceed 200 characters')
    .trim(),
    
  description: yup
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim(),
    
  projectId: yup
    .number()
    .required('Project is required')
    .positive('Please select a valid project'),
    
  assignedTo: yup
    .number()
    .nullable()
    .positive('Please select a valid team member'),
    
  status: yup
    .string()
    .oneOf(
      ['todo', 'in-progress', 'review', 'blocked', 'completed'],
      'Please select a valid status'
    )
    .default('todo'),
    
  priority: yup
    .string()
    .oneOf(['low', 'medium', 'high', 'urgent'], 'Please select a valid priority')
    .default('medium'),
    
  dueDate: yup
    .date()
    .required('Due date is required')
    .typeError('Please enter a valid due date'),
    
  estimatedHours: yup
    .number()
    .nullable()
    .positive('Estimated hours must be positive')
    .max(1000, 'Estimated hours seems unreasonably high'),
    
  actualHours: yup
    .number()
    .nullable()
    .min(0, 'Actual hours cannot be negative')
    .max(1000, 'Actual hours seems unreasonably high'),
    
  progress: yup
    .number()
    .min(0, 'Progress cannot be negative')
    .max(100, 'Progress cannot exceed 100%')
    .default(0),
    
  tags: yup
    .array()
    .of(yup.string().trim())
    .max(10, 'Maximum 10 tags allowed'),
});

// ============================================
// TEAM MEMBER VALIDATION SCHEMA
// ============================================

export const teamMemberSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
    
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters')
    .lowercase(),
    
  phone: yup
    .string()
    .nullable()
    .matches(phoneRegex, 'Please enter a valid phone number')
    .max(20, 'Phone number must not exceed 20 characters'),
    
  role: yup
    .string()
    .required('Role is required')
    .oneOf(
      ['project-manager', 'team-lead', 'senior-developer', 'developer', 'designer', 'qa-engineer', 'other'],
      'Please select a valid role'
    ),
    
  department: yup
    .string()
    .required('Department is required')
    .max(50, 'Department must not exceed 50 characters')
    .trim(),
    
  position: yup
    .string()
    .required('Position is required')
    .max(100, 'Position must not exceed 100 characters')
    .trim(),
    
  level: yup
    .string()
    .oneOf(['junior', 'mid', 'senior', 'lead', 'manager'], 'Please select a valid level')
    .default('mid'),
    
  skills: yup
    .array()
    .of(yup.string().trim())
    .max(20, 'Maximum 20 skills allowed'),
    
  hourlyRate: yup
    .number()
    .nullable()
    .positive('Hourly rate must be positive')
    .max(1000, 'Hourly rate seems unreasonably high'),
    
  startDate: yup
    .date()
    .nullable()
    .typeError('Please enter a valid start date'),
    
  isActive: yup
    .boolean()
    .default(true),
});

// ============================================
// CLIENT VALIDATION SCHEMA
// ============================================

export const clientSchema = yup.object({
  companyName: yup
    .string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name must not exceed 200 characters')
    .trim(),
    
  industry: yup
    .string()
    .max(100, 'Industry must not exceed 100 characters')
    .trim(),
    
  contactName: yup
    .string()
    .required('Contact name is required')
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name must not exceed 100 characters')
    .trim(),
    
  contactEmail: yup
    .string()
    .required('Contact email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters')
    .lowercase(),
    
  contactPhone: yup
    .string()
    .nullable()
    .matches(phoneRegex, 'Please enter a valid phone number')
    .max(20, 'Phone number must not exceed 20 characters'),
    
  contactPosition: yup
    .string()
    .max(100, 'Position must not exceed 100 characters')
    .trim(),
    
  website: yup
    .string()
    .nullable()
    .url('Please enter a valid website URL')
    .max(200, 'Website URL must not exceed 200 characters'),
    
  address: yup.object({
    street: yup.string().max(200, 'Street must not exceed 200 characters'),
    city: yup.string().max(50, 'City must not exceed 50 characters'),
    state: yup.string().max(50, 'State must not exceed 50 characters'),
    zipCode: yup.string().max(20, 'Zip code must not exceed 20 characters'),
    country: yup.string().max(50, 'Country must not exceed 50 characters'),
  }).nullable(),
    
  notes: yup
    .string()
    .max(2000, 'Notes must not exceed 2000 characters')
    .trim(),
});

// ============================================
// SEARCH & FILTER VALIDATION SCHEMAS
// ============================================

export const searchFilterSchema = yup.object({
  searchTerm: yup
    .string()
    .max(200, 'Search term must not exceed 200 characters')
    .trim(),
    
  status: yup
    .string()
    .oneOf(['', 'planning', 'active', 'on-hold', 'completed', 'cancelled']),
    
  priority: yup
    .string()
    .oneOf(['', 'low', 'medium', 'high', 'urgent', 'critical']),
    
  dateRange: yup.object({
    start: yup.date().nullable(),
    end: yup.date().nullable().when('start', (start, schema) => {
      if (start) {
        return schema.min(start, 'End date must be after start date');
      }
      return schema;
    }),
  }).nullable(),
    
  budgetRange: yup.object({
    min: yup.number().nullable().min(0, 'Minimum budget cannot be negative'),
    max: yup.number().nullable().when('min', (min, schema) => {
      if (min) {
        return schema.min(min, 'Maximum budget must be greater than minimum');
      }
      return schema;
    }),
  }).nullable(),
});

// ============================================
// FORM VALIDATION HELPERS
// ============================================

export const validateField = async (schema, fieldName, value) => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

export const validateForm = async (schema, data) => {
  try {
    const validData = await schema.validate(data, { abortEarly: false });
    return { isValid: true, data: validData, errors: {} };
  } catch (error) {
    const errors = {};
    error.inner.forEach(err => {
      errors[err.path] = err.message;
    });
    return { isValid: false, data: null, errors };
  }
};

// ============================================
// CUSTOM VALIDATION RULES
// ============================================

export const customValidations = {
  // Validate unique project name within client
  uniqueProjectName: (projects = [], currentProjectId = null) => {
    return yup.string().test(
      'unique-project-name',
      'Project name already exists for this client',
      function(value) {
        if (!value) return true;
        const { clientId } = this.parent;
        const existingProject = projects.find(p => 
          p.clientId === clientId && 
          p.name.toLowerCase() === value.toLowerCase() &&
          p.id !== currentProjectId
        );
        return !existingProject;
      }
    );
  },
  
  // Validate unique email for team members
  uniqueEmail: (teamMembers = [], currentMemberId = null) => {
    return yup.string().test(
      'unique-email',
      'Email address is already in use',
      function(value) {
        if (!value) return true;
        const existingMember = teamMembers.find(m => 
          m.email.toLowerCase() === value.toLowerCase() &&
          m.id !== currentMemberId
        );
        return !existingMember;
      }
    );
  },
  
  // Validate task dependency cycles
  noCyclicDependencies: (tasks = [], currentTaskId = null) => {
    return yup.array().test(
      'no-cyclic-dependencies',
      'Task dependencies cannot create cycles',
      function(dependencies) {
        if (!dependencies || dependencies.length === 0) return true;
        
        // Simple cycle detection (would need more sophisticated logic for complex cases)
        const hasCycle = dependencies.some(depId => {
          const depTask = tasks.find(t => t.id === depId);
          return depTask && depTask.dependencies && 
                 depTask.dependencies.includes(currentTaskId);
        });
        
        return !hasCycle;
      }
    );
  },
  
  // Validate file upload
  fileUpload: (maxSize = 10 * 1024 * 1024, allowedTypes = []) => {
    return yup.mixed().test(
      'file-validation',
      'Invalid file',
      function(file) {
        if (!file) return true;
        
        // Check file size
        if (file.size > maxSize) {
          return this.createError({
            message: `File size must be less than ${maxSize / (1024 * 1024)}MB`
          });
        }
        
        // Check file type
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
          return this.createError({
            message: `File type must be one of: ${allowedTypes.join(', ')}`
          });
        }
        
        return true;
      }
    );
  },
};

// ============================================
// SCHEMA COMBINATIONS FOR COMPLEX FORMS
// ============================================

// Project form with all validations
export const createProjectSchema = (projects = [], clients = []) => {
  return projectSchema.concat(
    yup.object({
      name: customValidations.uniqueProjectName(projects),
      clientId: yup.number().test(
        'client-exists',
        'Selected client does not exist',
        value => clients.some(c => c.id === value)
      ),
    })
  );
};

// Team member form with unique email validation
export const createTeamMemberSchema = (teamMembers = []) => {
  return teamMemberSchema.concat(
    yup.object({
      email: customValidations.uniqueEmail(teamMembers),
    })
  );
};

// Task form with project and assignee validation
export const createTaskSchema = (projects = [], teamMembers = [], tasks = []) => {
  return taskSchema.concat(
    yup.object({
      projectId: yup.number().test(
        'project-exists',
        'Selected project does not exist',
        value => projects.some(p => p.id === value)
      ),
      assignedTo: yup.number().nullable().test(
        'member-exists',
        'Selected team member does not exist',
        value => !value || teamMembers.some(m => m.id === value)
      ),
      dependencies: customValidations.noCyclicDependencies(tasks),
    })
  );
};

export default {
  projectSchema,
  taskSchema,
  teamMemberSchema,
  clientSchema,
  searchFilterSchema,
  validateField,
  validateForm,
  customValidations,
  createProjectSchema,
  createTeamMemberSchema,
  createTaskSchema,
};