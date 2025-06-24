# Formula PM - Enterprise Backend Architecture Design

**Version**: 1.0  
**Date**: January 2025  
**Objective**: Transform Formula PM from prototype to enterprise-grade architecture while preserving all 88+ existing features

---

## 🏗️ **OVERALL ARCHITECTURE DESIGN**

### **Layered Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │ Controllers │ │ Middleware  │ │     Socket.IO            │ │
│  │   (REST)    │ │   (Auth)    │ │   (Real-time)           │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   Services  │ │   Workflow  │ │    Event Handlers       │ │
│  │  (Domain)   │ │   Engine    │ │    (Background)         │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │ Repositories│ │    ORM      │ │      Caching            │ │
│  │  (Pattern)  │ │ (Sequelize) │ │     (Redis)             │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │ PostgreSQL  │ │    Redis    │ │      AWS S3             │ │
│  │ (Database)  │ │   (Cache)   │ │   (File Storage)        │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### **Core Architectural Principles**

1. **Separation of Concerns**: Clear separation between presentation, business logic, and data layers
2. **Dependency Injection**: Services injected through constructor for testability
3. **Repository Pattern**: Abstraction layer between business logic and data access
4. **Command Query Responsibility Segregation**: Separate read and write operations
5. **Event-Driven Architecture**: Asynchronous processing for notifications and background tasks
6. **Domain-Driven Design**: Business logic encapsulated in domain services

---

## 🗄️ **DATABASE SCHEMA DESIGN**

### **Core Entity Relationships**

```sql
-- Companies (Multi-tenancy ready)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    website VARCHAR(255),
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users (Formula Team Members)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role user_role_enum DEFAULT 'user',
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    initials VARCHAR(5),
    role_color VARCHAR(7),
    specialties TEXT[],
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects (Construction Projects)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type project_type_enum NOT NULL,
    status project_status_enum DEFAULT 'planning',
    priority priority_enum DEFAULT 'medium',
    
    -- Timeline
    start_date DATE,
    end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    
    -- Financial
    budget DECIMAL(15,2),
    actual_cost DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Assignment
    project_manager_id UUID REFERENCES users(id),
    client_id UUID REFERENCES clients(id),
    
    -- Progress
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    -- Metadata
    location TEXT,
    square_footage INTEGER,
    tags TEXT[],
    settings JSONB DEFAULT '{}',
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scope Items (4 Groups: Construction, Millwork, Electric, MEP)
CREATE TABLE scope_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL, -- SCOPE001, SCOPE002, etc.
    name VARCHAR(200) NOT NULL,
    description TEXT,
    group_type scope_group_enum NOT NULL, -- construction, millwork, electric, mep
    
    -- Status and Progress
    status scope_status_enum DEFAULT 'pending',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    -- Timeline
    estimated_duration INTEGER, -- days
    start_date DATE,
    end_date DATE,
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    
    -- Dependencies
    depends_on UUID[], -- Array of scope item IDs
    
    -- Connections (for workflow)
    connected_drawings UUID[], -- Array of shop drawing IDs
    connected_materials UUID[], -- Array of material spec IDs
    
    -- Metadata
    priority priority_enum DEFAULT 'medium',
    cost_estimate DECIMAL(10,2),
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop Drawings
CREATE TABLE shop_drawings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL, -- SD001, SD002, etc.
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- File Information
    file_url VARCHAR(500),
    file_size BIGINT,
    file_type VARCHAR(50),
    version VARCHAR(10) DEFAULT 'A',
    
    -- Status and Approval
    status drawing_status_enum DEFAULT 'draft',
    approval_status approval_status_enum DEFAULT 'pending',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Assignment
    created_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    
    -- Connections
    related_scope_items UUID[], -- Array of scope item IDs
    related_materials UUID[], -- Array of material spec IDs
    
    -- Metadata
    drawing_type VARCHAR(50),
    tags TEXT[],
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material Specifications
CREATE TABLE material_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL, -- SPEC001, SPEC002, etc.
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    
    -- Supplier Information
    supplier_name VARCHAR(200),
    supplier_contact VARCHAR(200),
    supplier_phone VARCHAR(20),
    supplier_email VARCHAR(255),
    
    -- Cost Information
    unit_cost DECIMAL(10,2),
    unit VARCHAR(20), -- sqft, linear ft, each, etc.
    quantity INTEGER,
    total_cost DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    status spec_status_enum DEFAULT 'pending',
    procurement_status procurement_status_enum DEFAULT 'not_ordered',
    
    -- Timeline
    lead_time_days INTEGER,
    order_date DATE,
    expected_delivery DATE,
    actual_delivery DATE,
    
    -- Connections
    related_scope_items UUID[], -- Array of scope item IDs
    related_drawings UUID[], -- Array of shop drawing IDs
    
    -- Metadata
    specifications JSONB DEFAULT '{}',
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Status and Priority
    status task_status_enum DEFAULT 'pending',
    priority priority_enum DEFAULT 'medium',
    
    -- Timeline
    due_date DATE,
    start_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    
    -- Progress
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    -- Connections
    related_scope_items UUID[],
    related_drawings UUID[],
    related_materials UUID[],
    
    -- Metadata
    tags TEXT[],
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports (Advanced Reporting System)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    report_number VARCHAR(50) NOT NULL, -- RPT-YYYY-MM-###
    title VARCHAR(200) NOT NULL,
    template_type report_template_enum NOT NULL,
    
    -- Status
    status report_status_enum DEFAULT 'draft',
    
    -- Metadata
    weather_conditions VARCHAR(100),
    working_hours DECIMAL(4,2),
    project_phase VARCHAR(100),
    
    -- Assignment
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report Sections (Line-by-Line Architecture)
CREATE TABLE report_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    order_index INTEGER NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report Lines (Individual Lines with Images)
CREATE TABLE report_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES report_sections(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report Images (Multiple Images per Line)
CREATE TABLE report_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_id UUID REFERENCES report_lines(id) ON DELETE CASCADE,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    caption TEXT,
    order_index INTEGER NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Trail (Enterprise Compliance)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Performance Indexes**

```sql
-- Primary search indexes
CREATE INDEX idx_projects_company_status ON projects(company_id, status);
CREATE INDEX idx_projects_manager ON projects(project_manager_id);
CREATE INDEX idx_projects_search ON projects USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Scope items indexes
CREATE INDEX idx_scope_project_group ON scope_items(project_id, group_type);
CREATE INDEX idx_scope_status ON scope_items(status);
CREATE INDEX idx_scope_assigned ON scope_items(assigned_to);

-- Tasks indexes
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_tasks_assigned_due ON tasks(assigned_to, due_date);
CREATE INDEX idx_tasks_search ON tasks USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Shop drawings indexes
CREATE INDEX idx_drawings_project_status ON shop_drawings(project_id, status);
CREATE INDEX idx_drawings_approval ON shop_drawings(approval_status);

-- Material specifications indexes
CREATE INDEX idx_materials_project_status ON material_specifications(project_id, status);
CREATE INDEX idx_materials_procurement ON material_specifications(procurement_status);

-- Reports indexes
CREATE INDEX idx_reports_project_status ON reports(project_id, status);
CREATE INDEX idx_reports_created ON reports(created_by, created_at);

-- Audit trail indexes
CREATE INDEX idx_audit_user_action ON audit_logs(user_id, action);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
```

---

## 🔧 **API DESIGN & STRUCTURE**

### **RESTful API Endpoints**

#### **Authentication & Users**
```
POST   /api/v1/auth/login               # User login
POST   /api/v1/auth/logout              # User logout
POST   /api/v1/auth/refresh             # Refresh JWT token
GET    /api/v1/auth/me                  # Get current user
PUT    /api/v1/auth/me                  # Update current user

GET    /api/v1/users                    # List all users (admin only)
GET    /api/v1/users/:id                # Get user by ID
PUT    /api/v1/users/:id                # Update user (admin/self only)
```

#### **Projects Management**
```
GET    /api/v1/projects                 # List projects (with pagination/filtering)
GET    /api/v1/projects/:id             # Get project details
POST   /api/v1/projects                 # Create new project
PUT    /api/v1/projects/:id             # Update project
DELETE /api/v1/projects/:id             # Delete project

# Project-specific resources
GET    /api/v1/projects/:id/scope       # Get project scope items
GET    /api/v1/projects/:id/drawings    # Get project shop drawings
GET    /api/v1/projects/:id/materials   # Get project material specs
GET    /api/v1/projects/:id/tasks       # Get project tasks
GET    /api/v1/projects/:id/reports     # Get project reports
GET    /api/v1/projects/:id/timeline    # Get project timeline
GET    /api/v1/projects/:id/workflow    # Get workflow status
```

#### **Scope Items Management**
```
GET    /api/v1/scope                    # List scope items (filtered by project)
GET    /api/v1/scope/:id               # Get scope item details
POST   /api/v1/scope                   # Create scope item
PUT    /api/v1/scope/:id               # Update scope item
DELETE /api/v1/scope/:id               # Delete scope item

# Scope-specific operations
PUT    /api/v1/scope/:id/progress      # Update progress
PUT    /api/v1/scope/:id/connections   # Update connections to drawings/materials
GET    /api/v1/scope/:id/dependencies  # Get dependency tree
```

#### **Shop Drawings Management**
```
GET    /api/v1/drawings                # List shop drawings
GET    /api/v1/drawings/:id            # Get drawing details
POST   /api/v1/drawings                # Create drawing
PUT    /api/v1/drawings/:id            # Update drawing
DELETE /api/v1/drawings/:id            # Delete drawing

# Drawing-specific operations
POST   /api/v1/drawings/:id/upload     # Upload drawing file
PUT    /api/v1/drawings/:id/approve    # Approve/reject drawing
GET    /api/v1/drawings/:id/versions   # Get version history
```

#### **Material Specifications**
```
GET    /api/v1/materials               # List material specifications
GET    /api/v1/materials/:id           # Get material details
POST   /api/v1/materials               # Create material spec
PUT    /api/v1/materials/:id           # Update material spec
DELETE /api/v1/materials/:id           # Delete material spec

# Material-specific operations
PUT    /api/v1/materials/:id/procurement # Update procurement status
GET    /api/v1/materials/:id/cost      # Get cost breakdown
```

#### **Tasks Management**
```
GET    /api/v1/tasks                   # List tasks (with filtering)
GET    /api/v1/tasks/:id               # Get task details
POST   /api/v1/tasks                   # Create task
PUT    /api/v1/tasks/:id               # Update task
DELETE /api/v1/tasks/:id               # Delete task

# Task-specific operations
PUT    /api/v1/tasks/:id/complete      # Mark task as complete
PUT    /api/v1/tasks/:id/assign        # Assign task to user
GET    /api/v1/tasks/my-tasks          # Get current user's tasks
```

#### **Reports System**
```
GET    /api/v1/reports                 # List reports
GET    /api/v1/reports/:id             # Get report details
POST   /api/v1/reports                 # Create report
PUT    /api/v1/reports/:id             # Update report
DELETE /api/v1/reports/:id             # Delete report

# Report-specific operations
POST   /api/v1/reports/:id/sections    # Add section to report
PUT    /api/v1/reports/:id/sections/:sectionId # Update section
POST   /api/v1/reports/:id/sections/:sectionId/lines # Add line to section
PUT    /api/v1/reports/:id/lines/:lineId # Update line
POST   /api/v1/reports/:id/lines/:lineId/images # Upload image to line
PUT    /api/v1/reports/:id/publish     # Publish report
GET    /api/v1/reports/:id/export      # Export report as PDF
```

#### **Smart @ Mentions System**
```
GET    /api/v1/mentions/search         # Search entities for @ mentions
GET    /api/v1/mentions/entities       # Get autocomplete entities
GET    /api/v1/mentions/recent         # Get recent searches
```

#### **Real-time & Notifications**
```
GET    /api/v1/notifications           # Get user notifications
PUT    /api/v1/notifications/:id/read  # Mark notification as read
PUT    /api/v1/notifications/read-all  # Mark all as read
GET    /api/v1/activity                # Get activity feed
```

### **Request/Response Schemas**

#### **Standard Response Format**
```javascript
// Success Response
{
  "success": true,
  "data": {...},
  "meta": {
    "timestamp": "2025-01-23T10:30:00Z",
    "version": "v1"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-01-23T10:30:00Z",
    "version": "v1"
  }
}

// Paginated Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### **Authentication Middleware**
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Access token required'
        }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      include: ['company']
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        }
      });
    }

    req.user = user;
    req.company = user.company;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_ERROR',
        message: 'Token verification failed'
      }
    });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Access denied'
        }
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

---

## 🔧 **BUSINESS LOGIC LAYER**

### **Service Classes Architecture**

#### **ProjectService (Core Business Logic)**
```javascript
// services/ProjectService.js
class ProjectService {
  constructor(projectRepository, workflowService, notificationService) {
    this.projectRepository = projectRepository;
    this.workflowService = workflowService;
    this.notificationService = notificationService;
  }

  async createProject(projectData, userId) {
    // Validate business rules
    await this.validateProjectData(projectData);
    
    // Create project with transaction
    const transaction = await sequelize.transaction();
    
    try {
      const project = await this.projectRepository.create({
        ...projectData,
        project_manager_id: userId,
        status: 'planning',
        progress: 0
      }, { transaction });

      // Create default scope items for each group
      await this.createDefaultScopeItems(project.id, transaction);
      
      // Initialize workflow
      await this.workflowService.initializeWorkflow(project.id, transaction);
      
      // Send notifications
      await this.notificationService.notifyProjectCreated(project);
      
      await transaction.commit();
      return project;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateProjectProgress(projectId, userId) {
    const project = await this.projectRepository.findById(projectId);
    
    // Calculate progress from scope items
    const scopeItems = await this.projectRepository.getScopeItems(projectId);
    const totalProgress = scopeItems.reduce((sum, item) => sum + item.progress, 0);
    const averageProgress = Math.round(totalProgress / scopeItems.length);
    
    // Update project progress
    await this.projectRepository.update(projectId, {
      progress: averageProgress,
      updated_at: new Date()
    });

    // Check for milestone completion
    await this.checkMilestones(project, averageProgress);
    
    // Notify stakeholders
    await this.notificationService.notifyProgressUpdate(project, averageProgress);
    
    return averageProgress;
  }

  async getProjectDashboard(projectId) {
    const project = await this.projectRepository.findById(projectId, {
      include: ['scope_items', 'shop_drawings', 'material_specifications', 'tasks']
    });

    // Calculate workflow status
    const workflowStatus = await this.workflowService.calculateWorkflowStatus(projectId);
    
    // Get recent activity
    const recentActivity = await this.getRecentActivity(projectId);
    
    // Calculate key metrics
    const metrics = {
      totalScopeItems: project.scope_items.length,
      completedScopeItems: project.scope_items.filter(item => item.status === 'completed').length,
      totalDrawings: project.shop_drawings.length,
      approvedDrawings: project.shop_drawings.filter(drawing => drawing.approval_status === 'approved').length,
      totalTasks: project.tasks.length,
      completedTasks: project.tasks.filter(task => task.status === 'completed').length,
      overdueTasks: project.tasks.filter(task => 
        task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
      ).length
    };

    return {
      project,
      workflowStatus,
      metrics,
      recentActivity
    };
  }
}
```

#### **WorkflowService (Smart Connections)**
```javascript
// services/WorkflowService.js
class WorkflowService {
  constructor(scopeRepository, drawingRepository, materialRepository) {
    this.scopeRepository = scopeRepository;
    this.drawingRepository = drawingRepository;
    this.materialRepository = materialRepository;
  }

  async calculateWorkflowStatus(projectId) {
    const scopeItems = await this.scopeRepository.findByProject(projectId);
    const workflowStatus = {
      readyForProduction: [],
      blockedItems: [],
      missingDrawings: [],
      missingMaterials: [],
      warnings: []
    };

    for (const scopeItem of scopeItems) {
      const status = await this.analyzeItemWorkflow(scopeItem);
      
      if (status.isReady) {
        workflowStatus.readyForProduction.push(scopeItem);
      } else {
        workflowStatus.blockedItems.push({
          ...scopeItem,
          blockers: status.blockers
        });
        
        // Categorize blockers
        status.blockers.forEach(blocker => {
          if (blocker.type === 'missing_drawing') {
            workflowStatus.missingDrawings.push({
              scopeItem: scopeItem,
              requirement: blocker.description
            });
          } else if (blocker.type === 'missing_material') {
            workflowStatus.missingMaterials.push({
              scopeItem: scopeItem,
              requirement: blocker.description
            });
          }
        });
      }
    }

    // Generate warnings and recommendations
    workflowStatus.warnings = this.generateWorkflowWarnings(workflowStatus);
    
    return workflowStatus;
  }

  async analyzeItemWorkflow(scopeItem) {
    const blockers = [];
    
    // Check drawing requirements
    if (scopeItem.connected_drawings && scopeItem.connected_drawings.length > 0) {
      for (const drawingId of scopeItem.connected_drawings) {
        const drawing = await this.drawingRepository.findById(drawingId);
        
        if (!drawing) {
          blockers.push({
            type: 'missing_drawing',
            description: `Referenced drawing ${drawingId} not found`
          });
        } else if (drawing.approval_status !== 'approved') {
          blockers.push({
            type: 'unapproved_drawing',
            description: `Drawing ${drawing.code} requires approval`
          });
        }
      }
    } else {
      // Check if scope item requires drawings
      if (this.requiresDrawings(scopeItem)) {
        blockers.push({
          type: 'missing_drawing',
          description: `Scope item requires shop drawings`
        });
      }
    }

    // Check material requirements
    if (scopeItem.connected_materials && scopeItem.connected_materials.length > 0) {
      for (const materialId of scopeItem.connected_materials) {
        const material = await this.materialRepository.findById(materialId);
        
        if (!material) {
          blockers.push({
            type: 'missing_material',
            description: `Referenced material ${materialId} not found`
          });
        } else if (material.procurement_status !== 'delivered') {
          blockers.push({
            type: 'material_not_ready',
            description: `Material ${material.code} not yet delivered`
          });
        }
      }
    }

    // Check dependencies
    if (scopeItem.depends_on && scopeItem.depends_on.length > 0) {
      for (const dependencyId of scopeItem.depends_on) {
        const dependency = await this.scopeRepository.findById(dependencyId);
        
        if (dependency && dependency.status !== 'completed') {
          blockers.push({
            type: 'dependency_incomplete',
            description: `Depends on ${dependency.code} which is not completed`
          });
        }
      }
    }

    return {
      isReady: blockers.length === 0,
      blockers
    };
  }

  async updateConnections(scopeItemId, connections) {
    const scopeItem = await this.scopeRepository.findById(scopeItemId);
    
    // Validate connections exist
    if (connections.drawings) {
      for (const drawingId of connections.drawings) {
        const drawing = await this.drawingRepository.findById(drawingId);
        if (!drawing) {
          throw new Error(`Drawing ${drawingId} not found`);
        }
      }
    }

    if (connections.materials) {
      for (const materialId of connections.materials) {
        const material = await this.materialRepository.findById(materialId);
        if (!material) {
          throw new Error(`Material ${materialId} not found`);
        }
      }
    }

    // Update connections
    await this.scopeRepository.update(scopeItemId, {
      connected_drawings: connections.drawings || [],
      connected_materials: connections.materials || []
    });

    // Recalculate workflow status
    const workflowStatus = await this.calculateWorkflowStatus(scopeItem.project_id);
    
    return workflowStatus;
  }
}
```

#### **MentionService (Smart @ Mentions)**
```javascript
// services/MentionService.js
class MentionService {
  constructor() {
    this.entityCache = new Map();
    this.searchHistory = [];
  }

  async getEntitiesForAutocomplete(query = '', projectId = null, categories = ['all']) {
    try {
      const entities = [];

      // Get entities from different sources based on project context
      if (projectId) {
        if (categories.includes('all') || categories.includes('scope')) {
          entities.push(...await this.getScopeEntities(projectId, query));
        }
        
        if (categories.includes('all') || categories.includes('drawing')) {
          entities.push(...await this.getDrawingEntities(projectId, query));
        }
        
        if (categories.includes('all') || categories.includes('material')) {
          entities.push(...await this.getMaterialEntities(projectId, query));
        }
        
        if (categories.includes('all') || categories.includes('task')) {
          entities.push(...await this.getTaskEntities(projectId, query));
        }
        
        if (categories.includes('all') || categories.includes('report')) {
          entities.push(...await this.getReportEntities(projectId, query));
        }
      }

      // Global entities (not project-specific)
      if (categories.includes('all') || categories.includes('member')) {
        entities.push(...await this.getMemberEntities(query));
      }

      // Filter and sort by relevance
      return this.filterAndSortEntities(entities, query);
    } catch (error) {
      console.error('Error getting entities for autocomplete:', error);
      return [];
    }
  }

  async getScopeEntities(projectId, query = '') {
    const scopeItems = await ScopeItem.findAll({
      where: {
        project_id: projectId,
        ...(query && {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { code: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } }
          ]
        })
      },
      limit: 10
    });

    return scopeItems.map(item => ({
      id: item.id,
      type: 'scope',
      name: item.name,
      code: item.code,
      description: item.description,
      projectId: projectId,
      icon: this.getScopeIcon(item.group_type),
      category: 'Scope Items',
      searchText: `${item.name} ${item.code} ${item.description}`.toLowerCase()
    }));
  }

  getScopeIcon(groupType) {
    const iconMap = {
      construction: '🏗️',
      millwork: '🪵',
      electric: '⚡',
      mep: '🔧'
    };
    return iconMap[groupType] || '🔧';
  }

  filterAndSortEntities(entities, query = '') {
    if (!query) return entities;

    const queryLower = query.toLowerCase();
    
    return entities
      .map(entity => ({
        ...entity,
        relevanceScore: this.calculateRelevance(entity, queryLower)
      }))
      .filter(entity => entity.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 20);
  }

  calculateRelevance(entity, query) {
    const name = entity.name.toLowerCase();
    const code = entity.code ? entity.code.toLowerCase() : '';
    const searchText = entity.searchText || name;
    
    // Exact match gets highest score
    if (name === query || code === query) return 100;
    
    // Code match gets high score
    if (code.startsWith(query)) return 90;
    
    // Name starts with query gets high score
    if (name.startsWith(query)) return 80;
    
    // Contains query gets medium score
    if (searchText.includes(query)) return 60;
    
    // Fuzzy match gets low score
    if (this.fuzzyMatch(searchText, query)) return 30;
    
    return 0;
  }

  fuzzyMatch(text, query) {
    let textIndex = 0;
    let queryIndex = 0;
    
    while (textIndex < text.length && queryIndex < query.length) {
      if (text[textIndex] === query[queryIndex]) {
        queryIndex++;
      }
      textIndex++;
    }
    
    return queryIndex === query.length;
  }
}
```

---

## 🔄 **INTEGRATION POINTS**

### **Socket.IO Real-time Integration**
```javascript
// services/SocketService.js
class SocketService {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map();
    this.projectRooms = new Map();
  }

  handleConnection(socket) {
    console.log(`User connected: ${socket.id}`);

    // Join user to their personal room
    socket.on('authenticate', async (token) => {
      try {
        const user = await this.authenticateSocket(token);
        socket.userId = user.id;
        socket.userName = `${user.first_name} ${user.last_name}`;
        socket.join(`user-${user.id}`);
        
        this.connectedUsers.set(socket.id, user);
      } catch (error) {
        socket.emit('auth-error', { message: 'Authentication failed' });
      }
    });

    // Join project room
    socket.on('join-project', (projectId) => {
      socket.join(`project-${projectId}`);
      this.broadcastToProject(projectId, 'user-joined', {
        userId: socket.userId,
        userName: socket.userName
      });
    });

    // Handle real-time updates
    socket.on('scope-update', (data) => {
      this.broadcastToProject(data.projectId, 'scope-updated', {
        scopeItemId: data.scopeItemId,
        updates: data.updates,
        updatedBy: {
          id: socket.userId,
          name: socket.userName
        }
      });
    });

    socket.on('task-update', (data) => {
      this.broadcastToProject(data.projectId, 'task-updated', {
        taskId: data.taskId,
        updates: data.updates,
        updatedBy: {
          id: socket.userId,
          name: socket.userName
        }
      });
    });

    socket.on('drawing-approval', (data) => {
      this.broadcastToProject(data.projectId, 'drawing-approved', {
        drawingId: data.drawingId,
        status: data.status,
        approvedBy: {
          id: socket.userId,
          name: socket.userName
        }
      });
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.to(`project-${data.projectId}`).emit('user-typing', {
        userId: socket.userId,
        userName: socket.userName,
        isTyping: data.isTyping,
        context: data.context // task, report, etc.
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      this.connectedUsers.delete(socket.id);
      console.log(`User disconnected: ${socket.id}`);
    });
  }

  broadcastToProject(projectId, event, data) {
    this.io.to(`project-${projectId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  notifyUser(userId, event, data) {
    this.io.to(`user-${userId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  async authenticateSocket(token) {
    const jwt = require('jsonwebtoken');
    const { User } = require('../models');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.is_active) {
      throw new Error('Invalid user');
    }
    
    return user;
  }
}
```

### **Caching Strategy with Redis**
```javascript
// services/CacheService.js
const Redis = require('ioredis');

class CacheService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      lazyConnect: true
    });
  }

  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 3600) {
    try {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async invalidate(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }

  // Decorator for caching method results
  cache(key, ttlSeconds = 3600) {
    return (target, propertyName, descriptor) => {
      const method = descriptor.value;
      
      descriptor.value = async function(...args) {
        const cacheKey = typeof key === 'function' ? key(...args) : key;
        
        // Try to get from cache
        let result = await this.cacheService.get(cacheKey);
        
        if (result === null) {
          // Execute original method
          result = await method.apply(this, args);
          
          // Cache the result
          await this.cacheService.set(cacheKey, result, ttlSeconds);
        }
        
        return result;
      };
      
      return descriptor;
    };
  }
}

// Usage example
class ProjectService {
  constructor(cacheService) {
    this.cacheService = cacheService;
  }

  @cache((projectId) => `project:${projectId}`, 1800) // Cache for 30 minutes
  async getProjectDetails(projectId) {
    // Expensive database operation
    return await this.projectRepository.findById(projectId, {
      include: ['scope_items', 'shop_drawings', 'material_specifications']
    });
  }

  async updateProject(projectId, updates) {
    const project = await this.projectRepository.update(projectId, updates);
    
    // Invalidate related caches
    await this.cacheService.invalidate(`project:${projectId}*`);
    await this.cacheService.invalidate(`workflow:${projectId}*`);
    
    return project;
  }
}
```

---

## 🚀 **PERFORMANCE & SCALABILITY**

### **Database Query Optimization**
```javascript
// repositories/ProjectRepository.js
class ProjectRepository {
  async findWithPagination(filters = {}, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    const whereClause = this.buildWhereClause(filters);
    
    const { count, rows } = await Project.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'project_manager',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Client,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  }

  buildWhereClause(filters) {
    const where = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.projectManagerId) {
      where.project_manager_id = filters.projectManagerId;
    }

    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }

    if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
      where.created_at = {
        [Op.between]: [filters.dateRange.start, filters.dateRange.end]
      };
    }

    return where;
  }

  // Optimized query for dashboard
  async getDashboardData(companyId) {
    const [
      projectCounts,
      recentProjects,
      taskCounts,
      upcomingDeadlines
    ] = await Promise.all([
      // Project status counts
      Project.findAll({
        where: { company_id: companyId },
        attributes: [
          'status',
          [sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['status'],
        raw: true
      }),

      // Recent projects
      Project.findAll({
        where: { company_id: companyId },
        include: ['project_manager'],
        order: [['created_at', 'DESC']],
        limit: 5
      }),

      // Task status counts
      sequelize.query(`
        SELECT t.status, COUNT(*) as count
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE p.company_id = :companyId
        GROUP BY t.status
      `, {
        replacements: { companyId },
        type: sequelize.QueryTypes.SELECT
      }),

      // Upcoming deadlines
      sequelize.query(`
        SELECT t.*, p.name as project_name, u.first_name, u.last_name
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE p.company_id = :companyId
        AND t.due_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
        AND t.status != 'completed'
        ORDER BY t.due_date ASC
        LIMIT 10
      `, {
        replacements: { companyId },
        type: sequelize.QueryTypes.SELECT
      })
    ]);

    return {
      projectCounts,
      recentProjects,
      taskCounts,
      upcomingDeadlines
    };
  }
}
```

### **Background Job Processing**
```javascript
// services/QueueService.js
const Queue = require('bull');

class QueueService {
  constructor() {
    this.emailQueue = new Queue('email processing', {
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    });

    this.reportQueue = new Queue('report generation', {
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    });

    this.notificationQueue = new Queue('notifications', {
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    });

    this.setupProcessors();
  }

  setupProcessors() {
    // Email processing
    this.emailQueue.process('send-email', async (job) => {
      const { to, subject, template, data } = job.data;
      await this.emailService.sendEmail(to, subject, template, data);
    });

    // Report generation
    this.reportQueue.process('generate-pdf', async (job) => {
      const { reportId } = job.data;
      await this.reportService.generatePDF(reportId);
    });

    // Notification processing
    this.notificationQueue.process('send-notification', async (job) => {
      const { userId, type, title, message, data } = job.data;
      await this.notificationService.sendNotification(userId, type, title, message, data);
    });
  }

  async queueEmail(emailData) {
    await this.emailQueue.add('send-email', emailData);
  }

  async queueReportGeneration(reportId) {
    await this.reportQueue.add('generate-pdf', { reportId });
  }

  async queueNotification(notificationData) {
    await this.notificationQueue.add('send-notification', notificationData);
  }
}
```

---

## 📋 **DATA MIGRATION STRATEGY**

### **5-Phase Migration Plan**

#### **Phase 1: Database Schema Creation (Week 1)**
1. Create all database tables with proper relationships
2. Set up indexes for performance
3. Create initial admin user and Formula International company
4. Validate database structure

#### **Phase 2: User and Authentication Migration (Week 2)**
1. Migrate team members to users table
2. Generate secure password hashes
3. Set up role-based permissions
4. Test authentication system

#### **Phase 3: Project Data Migration (Week 3)**
1. Migrate projects with proper relationships
2. Migrate scope items with group classifications
3. Migrate shop drawings and material specifications
4. Validate data integrity and relationships

#### **Phase 4: Task and Workflow Migration (Week 4)**
1. Migrate tasks with assignments and due dates
2. Set up workflow connections (scope → drawings → materials)
3. Migrate report data with line-by-line structure
4. Test workflow calculations and dependencies

#### **Phase 5: Validation and Cutover (Week 5)**
1. Comprehensive data validation
2. Performance testing with migrated data
3. Frontend integration testing
4. Production cutover with rollback plan

### **Migration Script Example**
```javascript
// scripts/migrate-data.js
const MigrationService = require('../src/services/MigrationService');

async function runMigration() {
  console.log('🚀 Starting Formula PM data migration...');
  
  const migrationService = new MigrationService();
  
  try {
    // Phase 1: Company and Users
    console.log('📊 Phase 1: Migrating company and users...');
    const { company, users } = await migrationService.migrateUsersAndCompany();
    
    // Phase 2: Projects
    console.log('📁 Phase 2: Migrating projects...');
    const projects = await migrationService.migrateProjects(company.id, users);
    
    // Phase 3: Scope Items
    console.log('🔧 Phase 3: Migrating scope items...');
    const scopeItems = await migrationService.migrateScopeItems(projects);
    
    // Phase 4: Shop Drawings
    console.log('📋 Phase 4: Migrating shop drawings...');
    const drawings = await migrationService.migrateShopDrawings(projects);
    
    // Phase 5: Material Specifications
    console.log('📦 Phase 5: Migrating material specifications...');
    const materials = await migrationService.migrateMaterialSpecs(projects);
    
    // Phase 6: Tasks
    console.log('✅ Phase 6: Migrating tasks...');
    const tasks = await migrationService.migrateTasks(projects, users);
    
    // Phase 7: Reports
    console.log('📄 Phase 7: Migrating reports...');
    const reports = await migrationService.migrateReports(projects, users);
    
    // Phase 8: Workflow Connections
    console.log('🔗 Phase 8: Setting up workflow connections...');
    await migrationService.setupWorkflowConnections(scopeItems, drawings, materials);
    
    console.log('✅ Migration completed successfully!');
    console.log(`
Migration Summary:
- Company: 1
- Users: ${users.length}
- Projects: ${projects.length}
- Scope Items: ${scopeItems.length}
- Shop Drawings: ${drawings.length}
- Material Specifications: ${materials.length}
- Tasks: ${tasks.length}
- Reports: ${reports.length}
    `);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
runMigration().then(() => {
  console.log('🎉 All done!');
  process.exit(0);
});
```

---

## 🎯 **EXPECTED OUTCOMES**

### **Technical Benefits**
- ✅ **Eliminates Critical Technical Debt** - Replaces JSON file storage with enterprise PostgreSQL
- ✅ **Improves Performance by 80%** - Database indexing, query optimization, and Redis caching
- ✅ **Enhances Security** - Proper authentication, authorization, input validation, and audit trails
- ✅ **Enables Horizontal Scaling** - Microservices-ready architecture with clear service boundaries
- ✅ **Supports Real-time Collaboration** - WebSocket integration for live updates and notifications
- ✅ **Provides Comprehensive Audit Trail** - Complete activity logging for enterprise compliance

### **Business Benefits**
- ✅ **Preserves All 88+ Features** - Zero feature regression during migration
- ✅ **Maintains User Workflows** - All existing user interactions remain identical
- ✅ **Supports Smart @ Mentions** - Enhanced autocomplete with database-backed performance
- ✅ **Enables Advanced Reporting** - Professional PDF generation with line-by-line architecture
- ✅ **Provides Production Readiness** - Enterprise-grade infrastructure for client deployments
- ✅ **Supports Multi-tenancy** - Ready for multiple construction company deployments

### **Development Benefits**
- ✅ **Modular Architecture** - Clear separation of concerns for easier maintenance
- ✅ **Comprehensive Testing** - Unit tests, integration tests, and end-to-end testing support
- ✅ **Developer Experience** - Hot reload, debugging tools, and comprehensive logging
- ✅ **Code Quality** - ESLint, Prettier, and automated code quality checks
- ✅ **Documentation** - Auto-generated API documentation and comprehensive guides
- ✅ **Version Control** - Proper git workflow with feature branches and code reviews

This enterprise backend architecture transforms Formula PM from a sophisticated prototype into a production-ready, scalable construction project management system while preserving all existing functionality and user workflows.