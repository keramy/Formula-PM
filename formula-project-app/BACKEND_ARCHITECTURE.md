# Formula PM Enterprise Backend Architecture

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Overall Architecture Design](#overall-architecture-design)
3. [Database Schema Design](#database-schema-design)
4. [API Design & Structure](#api-design--structure)
5. [Business Logic Layer](#business-logic-layer)
6. [Integration Points](#integration-points)
7. [Performance & Scalability](#performance--scalability)
8. [Migration Strategy](#migration-strategy)
9. [Implementation Examples](#implementation-examples)

## Executive Summary

This document outlines a comprehensive enterprise backend architecture for Formula PM, designed to eliminate technical debt while preserving all 88+ existing features. The new architecture follows enterprise best practices including:

- **Layered Architecture**: Clear separation of concerns with presentation, business logic, and data access layers
- **PostgreSQL Database**: Robust relational database replacing JSON file storage
- **RESTful API**: Standardized API design with proper versioning and security
- **Microservices-Ready**: Service-oriented design allowing future microservices migration
- **Real-time Support**: WebSocket integration for collaborative features
- **Enterprise Security**: JWT authentication, role-based access control, input validation
- **Performance Optimization**: Redis caching, connection pooling, query optimization
- **Audit & Compliance**: Complete audit trail and data versioning

## Overall Architecture Design

### 1.1 Layered Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend Application                         │
│                    (React + Material-UI)                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │   API Gateway Layer   │
                    │  (Express + Socket.IO) │
                    └───────────┬───────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                     Presentation Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Routes    │  │ Middleware  │  │ Controllers │            │
│  │  (Express)  │  │   (Auth,    │  │   (Request  │            │
│  │             │  │  Validation)│  │   Handlers) │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Services   │  │   Domain    │  │  Workflow   │            │
│  │             │  │   Models    │  │   Engine    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │Notification │  │  Mention    │  │   Report    │            │
│  │  Service    │  │  Service    │  │  Generator  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                    Data Access Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │Repositories │  │    ORM      │  │   Cache     │            │
│  │             │  │  (Prisma)   │  │  (Redis)    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                     Infrastructure Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ PostgreSQL  │  │    Redis    │  │     S3      │            │
│  │  Database   │  │    Cache    │  │  Storage    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Core Design Principles

#### Dependency Injection & IoC
```typescript
// src/core/container.ts
import { Container } from 'inversify';
import { ProjectService } from './services/ProjectService';
import { ProjectRepository } from './repositories/ProjectRepository';
import { NotificationService } from './services/NotificationService';

const container = new Container();

// Services
container.bind<ProjectService>(ProjectService).toSelf().inSingletonScope();
container.bind<NotificationService>(NotificationService).toSelf().inSingletonScope();

// Repositories
container.bind<ProjectRepository>(ProjectRepository).toSelf().inSingletonScope();

export { container };
```

#### Error Handling Strategy
```typescript
// src/core/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// src/core/errors/ErrorHandler.ts
export class ErrorHandler {
  static handle(error: Error, res: Response) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // Log unexpected errors
    logger.error('Unexpected error:', error);
    
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
```

#### Logging Strategy
```typescript
// src/core/logging/Logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});
```

### 1.3 Security Architecture

#### Authentication & Authorization
```typescript
// src/security/AuthMiddleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    assignedProjects?: string[];
  };
}

export class AuthMiddleware {
  static authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  static authorize(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }
      next();
    };
  }

  static authorizeProjectAccess() {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
      const projectId = req.params.projectId;
      const user = req.user!;

      if (user.role === 'Admin' || user.role === 'Co-founder') {
        return next();
      }

      if (user.role === 'Project Manager' && user.assignedProjects?.includes(projectId)) {
        return next();
      }

      return res.status(403).json({ message: 'Access denied to this project' });
    };
  }
}
```

#### Input Validation
```typescript
// src/security/ValidationMiddleware.ts
import { body, param, query, validationResult } from 'express-validator';

export class ValidationMiddleware {
  static validateProject() {
    return [
      body('name').trim().notEmpty().isLength({ max: 255 }),
      body('type').isIn(['Commercial', 'Residential', 'Industrial', 'Millwork']),
      body('status').isIn(['Planning', 'In Progress', 'Completed', 'On Hold']),
      body('budget').isNumeric().isFloat({ min: 0 }),
      body('startDate').isISO8601(),
      body('deadline').isISO8601().custom((value, { req }) => {
        return new Date(value) > new Date(req.body.startDate);
      }),
      this.handleValidationErrors
    ];
  }

  static handleValidationErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error',
        errors: errors.array() 
      });
    }
    next();
  }
}
```

## Database Schema Design

### 2.1 PostgreSQL Schema

```sql
-- Core Tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Co-founder', 'Project Manager', 'Team Member')),
    avatar_url VARCHAR(500),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium',
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    project_manager_id UUID REFERENCES users(id),
    start_date DATE NOT NULL,
    deadline DATE NOT NULL,
    budget DECIMAL(15, 2),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Team Members
CREATE TABLE project_team_members (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id)
);

-- Scope Management
CREATE TABLE scope_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    duration_days INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scope_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    scope_group_id UUID REFERENCES scope_groups(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Not Started',
    progress INTEGER DEFAULT 0,
    has_dependencies BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, code)
);

-- Shop Drawings
CREATE TABLE shop_drawings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    drawing_number VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending',
    submitted_date DATE,
    approved_date DATE,
    revision_number INTEGER DEFAULT 0,
    file_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, drawing_number)
);

-- Material Specifications
CREATE TABLE material_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    spec_number VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    supplier VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending',
    unit_price DECIMAL(10, 2),
    quantity DECIMAL(10, 2),
    total_cost DECIMAL(15, 2),
    approved_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, spec_number)
);

-- Workflow Connections
CREATE TABLE workflow_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    scope_item_id UUID REFERENCES scope_items(id) ON DELETE CASCADE,
    shop_drawing_id UUID REFERENCES shop_drawings(id) ON DELETE SET NULL,
    material_spec_id UUID REFERENCES material_specifications(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(scope_item_id, shop_drawing_id, material_spec_id)
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'To Do',
    priority VARCHAR(20) DEFAULT 'Medium',
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    report_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    created_by UUID REFERENCES users(id),
    weather_conditions VARCHAR(100),
    temperature VARCHAR(20),
    working_hours_start TIME,
    working_hours_end TIME,
    manpower_count INTEGER,
    equipment_used TEXT[],
    project_phase VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(report_number)
);

CREATE TABLE report_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE report_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES report_sections(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE report_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_id UUID REFERENCES report_lines(id) ON DELETE CASCADE,
    file_url VARCHAR(500) NOT NULL,
    caption TEXT,
    order_index INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_deadline ON projects(deadline);
CREATE INDEX idx_projects_manager ON projects(project_manager_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_workflow_connections_scope ON workflow_connections(scope_item_id);

-- Full-text search indexes
CREATE INDEX idx_projects_search ON projects USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_tasks_search ON tasks USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_scope_items_search ON scope_items USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

### 2.2 Data Migration Strategy

```typescript
// src/migration/JsonToPostgresMigration.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

export class DataMigration {
  private prisma: PrismaClient;
  private dataPath: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.dataPath = path.join(__dirname, '../../formula-backend/data');
  }

  async migrate() {
    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. Migrate Users
        await this.migrateUsers(tx);
        
        // 2. Migrate Clients
        await this.migrateClients(tx);
        
        // 3. Migrate Projects
        await this.migrateProjects(tx);
        
        // 4. Migrate Tasks
        await this.migrateTasks(tx);
        
        // 5. Migrate Reports
        await this.migrateReports(tx);
        
        console.log('Migration completed successfully');
      });
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  private async migrateUsers(tx: any) {
    const teamData = await this.loadJsonFile('teamMembers.json');
    
    for (const member of teamData) {
      await tx.user.create({
        data: {
          id: member.id,
          email: member.email,
          passwordHash: await bcrypt.hash('demo123', 10),
          firstName: member.name.split(' ')[0],
          lastName: member.name.split(' ').slice(1).join(' '),
          role: member.role,
          department: member.department,
          avatarUrl: member.avatar
        }
      });
    }
  }

  private async loadJsonFile(filename: string) {
    const filePath = path.join(this.dataPath, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }
}
```

## API Design & Structure

### 3.1 RESTful API Endpoints

```typescript
// API Route Structure
/api/v1
├── /auth
│   ├── POST   /login
│   ├── POST   /logout
│   ├── POST   /refresh
│   └── GET    /me
├── /users
│   ├── GET    /           # List users (paginated)
│   ├── GET    /:id        # Get user details
│   ├── POST   /           # Create user (Admin only)
│   ├── PUT    /:id        # Update user
│   └── DELETE /:id        # Delete user (Admin only)
├── /projects
│   ├── GET    /           # List projects (filtered by role)
│   ├── GET    /:id        # Get project details
│   ├── POST   /           # Create project
│   ├── PUT    /:id        # Update project
│   ├── DELETE /:id        # Delete project
│   ├── GET    /:id/team   # Get project team
│   ├── POST   /:id/team   # Add team member
│   └── DELETE /:id/team/:userId # Remove team member
├── /projects/:projectId/scope
│   ├── GET    /groups     # List scope groups
│   ├── POST   /groups     # Create scope group
│   ├── PUT    /groups/:id # Update scope group
│   ├── GET    /items      # List scope items
│   ├── POST   /items      # Create scope item
│   └── PUT    /items/:id  # Update scope item
├── /projects/:projectId/drawings
│   ├── GET    /           # List shop drawings
│   ├── GET    /:id        # Get drawing details
│   ├── POST   /           # Create drawing
│   ├── PUT    /:id        # Update drawing
│   └── POST   /:id/approve # Approve drawing
├── /projects/:projectId/materials
│   ├── GET    /           # List material specs
│   ├── GET    /:id        # Get material details
│   ├── POST   /           # Create material spec
│   ├── PUT    /:id        # Update material spec
│   └── POST   /:id/approve # Approve material
├── /projects/:projectId/workflow
│   ├── GET    /connections # Get all connections
│   ├── POST   /connections # Create connection
│   ├── DELETE /connections/:id # Remove connection
│   └── GET    /analysis    # Get workflow analysis
├── /tasks
│   ├── GET    /           # List tasks (filtered)
│   ├── GET    /:id        # Get task details
│   ├── POST   /           # Create task
│   ├── PUT    /:id        # Update task
│   ├── DELETE /:id        # Delete task
│   └── POST   /:id/complete # Mark complete
├── /reports
│   ├── GET    /           # List reports
│   ├── GET    /:id        # Get report details
│   ├── POST   /           # Create report
│   ├── PUT    /:id        # Update report
│   ├── POST   /:id/publish # Publish report
│   └── GET    /:id/pdf    # Export as PDF
├── /notifications
│   ├── GET    /           # List notifications
│   ├── POST   /:id/read   # Mark as read
│   ├── POST   /read-all   # Mark all as read
│   └── GET    /settings   # Get notification settings
└── /search
    ├── GET    /           # Global search
    └── GET    /mentions   # Search for @mentions
```

### 3.2 Request/Response Schemas

```typescript
// src/api/schemas/ProjectSchemas.ts
export interface CreateProjectRequest {
  name: string;
  description?: string;
  type: 'Commercial' | 'Residential' | 'Industrial' | 'Millwork';
  clientId?: string;
  projectManagerId: string;
  startDate: string; // ISO 8601
  deadline: string;  // ISO 8601
  budget?: number;
  teamMembers?: string[];
}

export interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  client: ClientSummary;
  projectManager: UserSummary;
  team: UserSummary[];
  startDate: string;
  deadline: string;
  budget: number;
  progress: number;
  scopeGroups: ScopeGroupSummary[];
  stats: {
    totalTasks: number;
    completedTasks: number;
    totalDrawings: number;
    approvedDrawings: number;
    totalMaterials: number;
    approvedMaterials: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
```

### 3.3 API Implementation

```typescript
// src/api/controllers/ProjectController.ts
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ProjectService } from '../../services/ProjectService';
import { AuthRequest } from '../../security/AuthMiddleware';

@injectable()
export class ProjectController {
  constructor(
    @inject(ProjectService) private projectService: ProjectService
  ) {}

  async list(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 20, status, type, search } = req.query;
      const user = req.user!;

      const projects = await this.projectService.listProjects({
        userId: user.id,
        userRole: user.role,
        page: Number(page),
        limit: Number(limit),
        filters: { status, type, search: search as string }
      });

      return res.json({
        status: 'success',
        data: projects.data,
        meta: {
          page: projects.page,
          limit: projects.limit,
          total: projects.total,
          totalPages: projects.totalPages
        }
      });
    } catch (error) {
      return ErrorHandler.handle(error, res);
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const project = await this.projectService.createProject({
        ...req.body,
        createdBy: req.user!.id
      });

      return res.status(201).json({
        status: 'success',
        data: project
      });
    } catch (error) {
      return ErrorHandler.handle(error, res);
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const project = await this.projectService.updateProject(id, req.body);

      return res.json({
        status: 'success',
        data: project
      });
    } catch (error) {
      return ErrorHandler.handle(error, res);
    }
  }
}
```

### 3.4 API Versioning Strategy

```typescript
// src/api/versioning/VersionMiddleware.ts
export class VersionMiddleware {
  static handle(req: Request, res: Response, next: NextFunction) {
    const version = req.headers['api-version'] || 'v1';
    req.apiVersion = version;
    
    // Add version to response headers
    res.setHeader('API-Version', version);
    
    next();
  }
}

// src/api/routes/index.ts
import { Router } from 'express';
import { projectRoutesV1 } from './v1/projects';
import { projectRoutesV2 } from './v2/projects';

const router = Router();

// Version routing
router.use('/api/v1/projects', projectRoutesV1);
router.use('/api/v2/projects', projectRoutesV2);

// Default to latest version
router.use('/api/projects', projectRoutesV2);
```

## Business Logic Layer

### 4.1 Service Architecture

```typescript
// src/services/ProjectService.ts
import { injectable, inject } from 'inversify';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { NotificationService } from './NotificationService';
import { AuditService } from './AuditService';
import { CacheService } from './CacheService';
import { EventBus } from '../events/EventBus';

@injectable()
export class ProjectService {
  constructor(
    @inject(ProjectRepository) private projectRepo: ProjectRepository,
    @inject(NotificationService) private notificationService: NotificationService,
    @inject(AuditService) private auditService: AuditService,
    @inject(CacheService) private cacheService: CacheService,
    @inject(EventBus) private eventBus: EventBus
  ) {}

  async createProject(data: CreateProjectDto): Promise<Project> {
    // Begin transaction
    return await this.projectRepo.transaction(async (tx) => {
      // 1. Create project
      const project = await tx.project.create({
        data: {
          ...data,
          progress: 0,
          status: 'Planning'
        }
      });

      // 2. Create default scope groups
      await this.createDefaultScopeGroups(tx, project.id);

      // 3. Add team members
      if (data.teamMembers?.length) {
        await this.addTeamMembers(tx, project.id, data.teamMembers);
      }

      // 4. Create audit log
      await this.auditService.log({
        userId: data.createdBy,
        action: 'CREATE',
        entityType: 'project',
        entityId: project.id,
        newValues: project
      });

      // 5. Send notifications
      await this.notificationService.notifyProjectCreated(project);

      // 6. Emit event
      this.eventBus.emit('project.created', { project });

      // 7. Clear cache
      await this.cacheService.invalidatePattern('projects:*');

      return project;
    });
  }

  async updateProjectProgress(projectId: string): Promise<void> {
    const project = await this.projectRepo.findById(projectId);
    if (!project) throw new AppError(404, 'Project not found');

    // Calculate overall progress based on scope items
    const scopeItems = await this.projectRepo.getScopeItems(projectId);
    const totalProgress = scopeItems.reduce((sum, item) => sum + item.progress, 0);
    const averageProgress = Math.round(totalProgress / scopeItems.length);

    await this.projectRepo.update(projectId, { progress: averageProgress });

    // Check for milestone completion
    if (averageProgress === 100 && project.progress < 100) {
      this.eventBus.emit('project.completed', { projectId });
    }
  }

  private async createDefaultScopeGroups(tx: any, projectId: string) {
    const defaultGroups = [
      { name: 'Construction', icon: '🏗️', order: 0 },
      { name: 'Millwork', icon: '🪵', order: 1 },
      { name: 'Electric', icon: '⚡', order: 2 },
      { name: 'MEP', icon: '🔧', order: 3 }
    ];

    for (const group of defaultGroups) {
      await tx.scopeGroup.create({
        data: {
          projectId,
          ...group
        }
      });
    }
  }
}
```

### 4.2 Workflow Engine

```typescript
// src/services/WorkflowEngine.ts
import { injectable, inject } from 'inversify';

@injectable()
export class WorkflowEngine {
  constructor(
    @inject(WorkflowRepository) private workflowRepo: WorkflowRepository,
    @inject(NotificationService) private notificationService: NotificationService
  ) {}

  async analyzeWorkflow(projectId: string): Promise<WorkflowAnalysis> {
    const connections = await this.workflowRepo.getProjectConnections(projectId);
    const scopeItems = await this.workflowRepo.getScopeItems(projectId);
    
    const analysis: WorkflowAnalysis = {
      totalScopeItems: scopeItems.length,
      connectedItems: 0,
      readyForProduction: 0,
      blockers: [],
      recommendations: []
    };

    for (const item of scopeItems) {
      const connection = connections.find(c => c.scopeItemId === item.id);
      
      if (connection) {
        analysis.connectedItems++;
        
        const isReady = await this.checkProductionReadiness(connection);
        if (isReady) {
          analysis.readyForProduction++;
        } else {
          analysis.blockers.push(await this.identifyBlockers(connection, item));
        }
      } else {
        analysis.recommendations.push({
          type: 'missing_connection',
          scopeItem: item,
          message: `Connect ${item.name} to shop drawings and materials`
        });
      }
    }

    return analysis;
  }

  private async checkProductionReadiness(connection: WorkflowConnection): Promise<boolean> {
    if (!connection.shopDrawingId || !connection.materialSpecId) {
      return false;
    }

    const drawing = await this.workflowRepo.getShopDrawing(connection.shopDrawingId);
    const material = await this.workflowRepo.getMaterialSpec(connection.materialSpecId);

    return drawing.status === 'Approved' && material.status === 'Approved';
  }

  private async identifyBlockers(
    connection: WorkflowConnection, 
    scopeItem: ScopeItem
  ): Promise<WorkflowBlocker> {
    const blockers: string[] = [];

    if (!connection.shopDrawingId) {
      blockers.push('Missing shop drawing connection');
    } else {
      const drawing = await this.workflowRepo.getShopDrawing(connection.shopDrawingId);
      if (drawing.status !== 'Approved') {
        blockers.push(`Shop drawing ${drawing.drawingNumber} pending approval`);
      }
    }

    if (!connection.materialSpecId) {
      blockers.push('Missing material specification');
    } else {
      const material = await this.workflowRepo.getMaterialSpec(connection.materialSpecId);
      if (material.status !== 'Approved') {
        blockers.push(`Material ${material.specNumber} pending approval`);
      }
    }

    return {
      scopeItemId: scopeItem.id,
      scopeItemName: scopeItem.name,
      blockers,
      severity: blockers.length > 1 ? 'high' : 'medium'
    };
  }

  async createConnection(data: CreateConnectionDto): Promise<WorkflowConnection> {
    // Validate entities exist
    const scopeItem = await this.workflowRepo.getScopeItem(data.scopeItemId);
    if (!scopeItem) throw new AppError(404, 'Scope item not found');

    const connection = await this.workflowRepo.createConnection(data);

    // Check if this completes the workflow
    const isReady = await this.checkProductionReadiness(connection);
    if (isReady) {
      await this.notificationService.notifyProductionReady(scopeItem);
    }

    return connection;
  }
}
```

### 4.3 Mention Service

```typescript
// src/services/MentionService.ts
import { injectable, inject } from 'inversify';

@injectable()
export class MentionService {
  constructor(
    @inject(ProjectRepository) private projectRepo: ProjectRepository,
    @inject(UserRepository) private userRepo: UserRepository,
    @inject(CacheService) private cacheService: CacheService
  ) {}

  async searchEntities(query: string, context?: MentionContext): Promise<MentionResult[]> {
    const cacheKey = `mentions:${query}:${context?.projectId || 'global'}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const results: MentionResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search in parallel
    const [projects, users, scopeItems, drawings, materials, reports] = await Promise.all([
      this.searchProjects(searchTerm, context),
      this.searchUsers(searchTerm),
      context?.projectId ? this.searchScopeItems(searchTerm, context.projectId) : [],
      context?.projectId ? this.searchDrawings(searchTerm, context.projectId) : [],
      context?.projectId ? this.searchMaterials(searchTerm, context.projectId) : [],
      this.searchReports(searchTerm, context)
    ]);

    results.push(...projects, ...users, ...scopeItems, ...drawings, ...materials, ...reports);

    // Sort by relevance
    results.sort((a, b) => {
      // Exact matches first
      const aExact = a.name.toLowerCase() === searchTerm;
      const bExact = b.name.toLowerCase() === searchTerm;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      // Then by type priority
      const typePriority = ['user', 'project', 'scope', 'drawing', 'material', 'report'];
      return typePriority.indexOf(a.type) - typePriority.indexOf(b.type);
    });

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, results, 300);

    return results.slice(0, 20); // Limit results
  }

  async parseMentions(text: string): Promise<ParsedMention[]> {
    const mentionRegex = /@(\w+(?:\s+\w+)*?)(?=\s|$|[,.!?])/g;
    const mentions: ParsedMention[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const entityName = match[1];
      const entity = await this.resolveEntity(entityName);
      
      if (entity) {
        mentions.push({
          originalText: match[0],
          entityType: entity.type,
          entityId: entity.id,
          entityName: entity.name,
          startIndex: match.index,
          endIndex: match.index + match[0].length
        });
      }
    }

    return mentions;
  }

  private async resolveEntity(name: string): Promise<MentionEntity | null> {
    // Try to find exact match across all entity types
    const searchResults = await this.searchEntities(name);
    return searchResults.find(r => r.name.toLowerCase() === name.toLowerCase()) || null;
  }
}
```

### 4.4 Report Generator

```typescript
// src/services/ReportGenerator.ts
import { injectable, inject } from 'inversify';
import PDFDocument from 'pdfkit';
import { S3Service } from './S3Service';

@injectable()
export class ReportGenerator {
  constructor(
    @inject(ReportRepository) private reportRepo: ReportRepository,
    @inject(S3Service) private s3Service: S3Service
  ) {}

  async generatePDF(reportId: string): Promise<string> {
    const report = await this.reportRepo.getFullReport(reportId);
    if (!report) throw new AppError(404, 'Report not found');

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: report.title,
        Author: 'Formula PM',
        Subject: `${report.type} Report`,
        CreationDate: new Date()
      }
    });

    // Header
    this.addHeader(doc, report);

    // Metadata section
    this.addMetadata(doc, report);

    // Content sections
    for (const section of report.sections) {
      this.addSection(doc, section);
    }

    // Footer
    this.addFooter(doc, report);

    // Upload to S3
    const buffer = await this.streamToBuffer(doc);
    const key = `reports/${report.reportNumber}.pdf`;
    const url = await this.s3Service.upload(buffer, key, 'application/pdf');

    return url;
  }

  private addSection(doc: PDFDocument, section: ReportSection) {
    doc.fontSize(16).text(section.title, { underline: true });
    doc.moveDown(0.5);

    for (const line of section.lines) {
      doc.fontSize(12).text(line.description);
      
      if (line.images?.length) {
        doc.moveDown(0.5);
        for (const image of line.images) {
          // Add image placeholder or actual image if available
          doc.rect(50, doc.y, 500, 300).stroke();
          doc.fontSize(10).text(image.caption || 'Image', 55, doc.y + 5);
          doc.moveDown(15);
        }
      }
      
      doc.moveDown();
    }
  }
}
```

## Integration Points

### 5.1 Socket.IO Integration

```typescript
// src/realtime/SocketManager.ts
import { Server } from 'socket.io';
import { injectable, inject } from 'inversify';
import { AuthService } from '../services/AuthService';
import { NotificationService } from '../services/NotificationService';

@injectable()
export class SocketManager {
  private io: Server;
  private userSockets: Map<string, Set<string>> = new Map();

  initialize(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
      }
    });

    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const user = await this.authService.verifyToken(token);
        socket.data.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });

    this.io.on('connection', (socket) => {
      const userId = socket.data.user.id;
      this.addUserSocket(userId, socket.id);

      // Join project rooms
      socket.on('join:project', async (projectId) => {
        if (await this.canAccessProject(userId, projectId)) {
          socket.join(`project:${projectId}`);
        }
      });

      // Handle real-time updates
      socket.on('task:update', async (data) => {
        this.io.to(`project:${data.projectId}`).emit('task:updated', data);
      });

      socket.on('disconnect', () => {
        this.removeUserSocket(userId, socket.id);
      });
    });
  }

  emitToUser(userId: string, event: string, data: any) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach(socketId => {
        this.io.to(socketId).emit(event, data);
      });
    }
  }

  emitToProject(projectId: string, event: string, data: any) {
    this.io.to(`project:${projectId}`).emit(event, data);
  }
}
```

### 5.2 Email Service Integration

```typescript
// src/services/EmailService.ts
import { injectable } from 'inversify';
import nodemailer from 'nodemailer';
import { renderTemplate } from '../templates/EmailTemplates';

@injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendProjectAssignment(user: User, project: Project) {
    const html = await renderTemplate('project-assignment', {
      userName: user.firstName,
      projectName: project.name,
      projectUrl: `${process.env.FRONTEND_URL}/projects/${project.id}`
    });

    await this.send({
      to: user.email,
      subject: `You've been assigned to ${project.name}`,
      html
    });
  }

  async sendTaskReminder(user: User, task: Task) {
    const html = await renderTemplate('task-reminder', {
      userName: user.firstName,
      taskTitle: task.title,
      dueDate: task.dueDate,
      taskUrl: `${process.env.FRONTEND_URL}/tasks/${task.id}`
    });

    await this.send({
      to: user.email,
      subject: `Task Reminder: ${task.title}`,
      html
    });
  }

  private async send(options: nodemailer.SendMailOptions) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        ...options
      });
    } catch (error) {
      logger.error('Email send failed:', error);
      // Don't throw - email failures shouldn't break the app
    }
  }
}
```

### 5.3 File Storage Strategy

```typescript
// src/services/S3Service.ts
import { injectable } from 'inversify';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class S3Service {
  private s3: AWS.S3;
  private bucket: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
    this.bucket = process.env.S3_BUCKET!;
  }

  async upload(buffer: Buffer, key: string, contentType: string): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'private'
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresIn
    };

    return this.s3.getSignedUrlPromise('getObject', params);
  }

  async delete(key: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: this.bucket,
      Key: key
    }).promise();
  }

  generateKey(filename: string, folder: string): string {
    const ext = filename.split('.').pop();
    return `${folder}/${uuidv4()}.${ext}`;
  }
}
```

## Performance & Scalability

### 6.1 Caching Strategy

```typescript
// src/services/CacheService.ts
import { injectable } from 'inversify';
import Redis from 'ioredis';

@injectable()
export class CacheService {
  private redis: Redis;
  private defaultTTL = 3600; // 1 hour

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      keyPrefix: 'formulapm:'
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value as any;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await this.redis.set(key, serialized, 'EX', ttl || this.defaultTTL);
  }

  async invalidate(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // Caching decorator
  static cacheable(keyPattern: string, ttl?: number) {
    return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = async function(...args: any[]) {
        const cache = (this as any).cacheService as CacheService;
        const key = keyPattern.replace(/{(\d+)}/g, (match, index) => args[index]);
        
        const cached = await cache.get(key);
        if (cached) return cached;

        const result = await originalMethod.apply(this, args);
        await cache.set(key, result, ttl);
        
        return result;
      };
    };
  }
}

// Usage example
class ProjectService {
  @CacheService.cacheable('project:{0}', 300)
  async getProject(id: string) {
    // This will be cached for 5 minutes
    return this.projectRepo.findById(id);
  }
}
```

### 6.2 Database Optimization

```typescript
// src/database/QueryOptimizer.ts
import { Prisma } from '@prisma/client';

export class QueryOptimizer {
  static projectListQuery(filters: ProjectFilters): Prisma.ProjectFindManyArgs {
    return {
      where: {
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type }),
        ...(filters.search && {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } }
          ]
        })
      },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        projectManager: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true }
        },
        _count: {
          select: { tasks: true, scopeItems: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit
    };
  }

  static addIndexHints(query: string): string {
    // PostgreSQL specific index hints
    return query.replace(
      'FROM "projects"',
      'FROM "projects" /*+ INDEX(projects idx_projects_status) */'
    );
  }
}
```

### 6.3 Connection Pooling

```typescript
// src/database/ConnectionPool.ts
import { PrismaClient } from '@prisma/client';

export class DatabaseConnection {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        },
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        // Connection pool configuration
        connectionLimit: parseInt(process.env.DB_POOL_SIZE || '10'),
        pool: {
          min: 2,
          max: 10,
          acquireTimeoutMillis: 30000,
          createTimeoutMillis: 30000,
          destroyTimeoutMillis: 5000,
          idleTimeoutMillis: 30000,
          reapIntervalMillis: 1000,
          createRetryIntervalMillis: 100
        }
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.instance.$disconnect();
        process.exit(0);
      });
    }

    return this.instance;
  }
}
```

### 6.4 Background Jobs

```typescript
// src/jobs/JobQueue.ts
import Bull from 'bull';
import { injectable } from 'inversify';

@injectable()
export class JobQueue {
  private queues: Map<string, Bull.Queue> = new Map();

  constructor() {
    this.initializeQueues();
  }

  private initializeQueues() {
    const redisConfig = {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    };

    // Email queue
    this.createQueue('email', redisConfig);
    
    // Report generation queue
    this.createQueue('reports', redisConfig);
    
    // Notification queue
    this.createQueue('notifications', redisConfig);
    
    // Data export queue
    this.createQueue('exports', redisConfig);
  }

  private createQueue(name: string, config: any) {
    const queue = new Bull(name, { redis: config });
    this.queues.set(name, queue);
    return queue;
  }

  async addJob(queueName: string, data: any, options?: Bull.JobOptions) {
    const queue = this.queues.get(queueName);
    if (!queue) throw new Error(`Queue ${queueName} not found`);
    
    return queue.add(data, {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      ...options
    });
  }

  // Job processors
  processEmailJobs(processor: (job: Bull.Job) => Promise<void>) {
    const queue = this.queues.get('email')!;
    queue.process(5, processor); // Process 5 jobs concurrently
  }

  processReportJobs(processor: (job: Bull.Job) => Promise<void>) {
    const queue = this.queues.get('reports')!;
    queue.process(2, processor); // Process 2 reports concurrently
  }
}

// Usage
export class EmailProcessor {
  constructor(
    private emailService: EmailService,
    private jobQueue: JobQueue
  ) {
    this.jobQueue.processEmailJobs(async (job) => {
      const { type, data } = job.data;
      
      switch (type) {
        case 'project_assignment':
          await this.emailService.sendProjectAssignment(data.user, data.project);
          break;
        case 'task_reminder':
          await this.emailService.sendTaskReminder(data.user, data.task);
          break;
      }
    });
  }
}
```

## Migration Strategy

### 7.1 Phased Migration Plan

```typescript
// src/migration/MigrationPlan.ts
export class MigrationPlan {
  static phases = [
    {
      phase: 1,
      name: 'Database Setup & Core Tables',
      duration: '1 week',
      tasks: [
        'Set up PostgreSQL database',
        'Create core tables (users, projects, clients)',
        'Implement authentication system',
        'Migrate user data'
      ]
    },
    {
      phase: 2,
      name: 'Project Management Migration',
      duration: '2 weeks',
      tasks: [
        'Migrate project data',
        'Implement scope management',
        'Migrate shop drawings and materials',
        'Set up workflow connections'
      ]
    },
    {
      phase: 3,
      name: 'Task & Report Systems',
      duration: '1 week',
      tasks: [
        'Migrate task data',
        'Implement report system',
        'Set up notification system',
        'Migrate existing reports'
      ]
    },
    {
      phase: 4,
      name: 'Real-time & Performance',
      duration: '1 week',
      tasks: [
        'Implement Socket.IO integration',
        'Set up Redis caching',
        'Configure job queues',
        'Performance testing'
      ]
    },
    {
      phase: 5,
      name: 'Testing & Deployment',
      duration: '1 week',
      tasks: [
        'Complete integration testing',
        'User acceptance testing',
        'Data validation',
        'Production deployment'
      ]
    }
  ];

  static async executePhase(phase: number) {
    switch (phase) {
      case 1:
        await this.setupDatabase();
        await this.migrateUsers();
        break;
      case 2:
        await this.migrateProjects();
        await this.migrateScopeData();
        break;
      // ... etc
    }
  }
}
```

### 7.2 Data Validation

```typescript
// src/migration/DataValidator.ts
export class DataValidator {
  static async validateMigration() {
    const results = {
      users: await this.validateUsers(),
      projects: await this.validateProjects(),
      tasks: await this.validateTasks(),
      reports: await this.validateReports()
    };

    const allValid = Object.values(results).every(r => r.valid);
    
    return {
      valid: allValid,
      results,
      summary: this.generateSummary(results)
    };
  }

  private static async validateUsers() {
    const jsonUsers = await this.loadJsonData('teamMembers.json');
    const dbUsers = await prisma.user.count();
    
    return {
      valid: jsonUsers.length === dbUsers,
      expected: jsonUsers.length,
      actual: dbUsers,
      missing: jsonUsers.length - dbUsers
    };
  }
}
```

## Implementation Examples

### 8.1 Complete API Endpoint Implementation

```typescript
// src/api/routes/projects.ts
import { Router } from 'express';
import { container } from '../../core/container';
import { ProjectController } from '../controllers/ProjectController';
import { AuthMiddleware } from '../../security/AuthMiddleware';
import { ValidationMiddleware } from '../../security/ValidationMiddleware';

const router = Router();
const projectController = container.get(ProjectController);

// List projects (with role-based filtering)
router.get('/',
  AuthMiddleware.authenticate,
  projectController.list.bind(projectController)
);

// Get project details
router.get('/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorizeProjectAccess(),
  projectController.get.bind(projectController)
);

// Create project
router.post('/',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('Admin', 'Co-founder'),
  ValidationMiddleware.validateProject(),
  projectController.create.bind(projectController)
);

// Update project
router.put('/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorizeProjectAccess(),
  ValidationMiddleware.validateProject(),
  projectController.update.bind(projectController)
);

// Delete project
router.delete('/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('Admin'),
  projectController.delete.bind(projectController)
);

// Project team management
router.get('/:id/team',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorizeProjectAccess(),
  projectController.getTeam.bind(projectController)
);

router.post('/:id/team',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('Admin', 'Co-founder', 'Project Manager'),
  ValidationMiddleware.validateTeamMember(),
  projectController.addTeamMember.bind(projectController)
);

export { router as projectRoutes };
```

### 8.2 Repository Pattern Implementation

```typescript
// src/repositories/ProjectRepository.ts
import { injectable } from 'inversify';
import { Prisma, Project } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

@injectable()
export class ProjectRepository extends BaseRepository<Project> {
  async findByIdWithRelations(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        projectManager: true,
        teamMembers: {
          include: {
            user: true
          }
        },
        scopeGroups: {
          include: {
            scopeItems: true
          }
        },
        tasks: {
          where: {
            status: {
              not: 'Completed'
            }
          }
        }
      }
    });
  }

  async findByUser(userId: string, role: string) {
    const where: Prisma.ProjectWhereInput = {};

    if (role === 'Project Manager') {
      where.OR = [
        { projectManagerId: userId },
        {
          teamMembers: {
            some: {
              userId
            }
          }
        }
      ];
    }

    return this.prisma.project.findMany({
      where,
      include: {
        client: true,
        projectManager: true,
        _count: {
          select: {
            tasks: true,
            scopeItems: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async updateProgress(id: string, progress: number) {
    return this.prisma.project.update({
      where: { id },
      data: { 
        progress,
        updatedAt: new Date()
      }
    });
  }

  async getProjectStats(id: string) {
    const [project, taskStats, scopeStats, drawingStats, materialStats] = await Promise.all([
      this.findById(id),
      this.getTaskStats(id),
      this.getScopeStats(id),
      this.getDrawingStats(id),
      this.getMaterialStats(id)
    ]);

    return {
      project,
      stats: {
        tasks: taskStats,
        scope: scopeStats,
        drawings: drawingStats,
        materials: materialStats
      }
    };
  }

  private async getTaskStats(projectId: string) {
    const tasks = await this.prisma.task.groupBy({
      by: ['status'],
      where: { projectId },
      _count: true
    });

    return tasks.reduce((acc, curr) => ({
      ...acc,
      [curr.status]: curr._count
    }), {});
  }
}
```

### 8.3 Service Layer with Business Logic

```typescript
// src/services/WorkflowService.ts
import { injectable, inject } from 'inversify';
import { EventEmitter } from 'events';

@injectable()
export class WorkflowService extends EventEmitter {
  constructor(
    @inject(WorkflowRepository) private workflowRepo: WorkflowRepository,
    @inject(NotificationService) private notifications: NotificationService,
    @inject(CacheService) private cache: CacheService
  ) {
    super();
  }

  async connectEntities(data: ConnectEntitiesDto) {
    const { scopeItemId, shopDrawingId, materialSpecId } = data;

    // Validate entities exist
    const [scopeItem, drawing, material] = await Promise.all([
      this.workflowRepo.getScopeItem(scopeItemId),
      shopDrawingId ? this.workflowRepo.getShopDrawing(shopDrawingId) : null,
      materialSpecId ? this.workflowRepo.getMaterialSpec(materialSpecId) : null
    ]);

    if (!scopeItem) {
      throw new AppError(404, 'Scope item not found');
    }

    // Check for existing connection
    const existing = await this.workflowRepo.findConnection({
      scopeItemId,
      shopDrawingId,
      materialSpecId
    });

    if (existing) {
      throw new AppError(400, 'Connection already exists');
    }

    // Create connection
    const connection = await this.workflowRepo.createConnection(data);

    // Check production readiness
    const isReady = await this.checkProductionReadiness({
      scopeItem,
      drawing,
      material
    });

    if (isReady) {
      // Emit event for production ready
      this.emit('workflow:production-ready', {
        scopeItem,
        connection
      });

      // Send notification
      await this.notifications.notifyProductionReady({
        projectId: scopeItem.projectId,
        scopeItemName: scopeItem.name,
        scopeItemId: scopeItem.id
      });
    }

    // Clear cache
    await this.cache.invalidatePattern(`workflow:${scopeItem.projectId}:*`);

    return {
      connection,
      productionReady: isReady
    };
  }

  private async checkProductionReadiness(entities: {
    scopeItem: ScopeItem;
    drawing?: ShopDrawing | null;
    material?: MaterialSpec | null;
  }): Promise<boolean> {
    const { scopeItem, drawing, material } = entities;

    // Scope item must be at least 80% complete
    if (scopeItem.progress < 80) {
      return false;
    }

    // Both drawing and material must be connected and approved
    if (!drawing || drawing.status !== 'Approved') {
      return false;
    }

    if (!material || material.status !== 'Approved') {
      return false;
    }

    return true;
  }

  async getWorkflowAnalysis(projectId: string): Promise<WorkflowAnalysis> {
    // Check cache first
    const cacheKey = `workflow:analysis:${projectId}`;
    const cached = await this.cache.get<WorkflowAnalysis>(cacheKey);
    if (cached) return cached;

    const [scopeItems, connections] = await Promise.all([
      this.workflowRepo.getProjectScopeItems(projectId),
      this.workflowRepo.getProjectConnections(projectId)
    ]);

    const analysis: WorkflowAnalysis = {
      summary: {
        totalScopeItems: scopeItems.length,
        connectedItems: 0,
        readyForProduction: 0,
        blockedItems: 0
      },
      blockers: [],
      recommendations: [],
      productionReady: []
    };

    // Analyze each scope item
    for (const item of scopeItems) {
      const connection = connections.find(c => c.scopeItemId === item.id);
      
      if (!connection) {
        analysis.recommendations.push({
          type: 'missing_connection',
          severity: 'medium',
          scopeItem: item,
          message: `Connect ${item.name} to shop drawings and material specifications`
        });
        continue;
      }

      analysis.summary.connectedItems++;

      // Check for blockers
      const blockers = await this.identifyBlockers(item, connection);
      
      if (blockers.length > 0) {
        analysis.summary.blockedItems++;
        analysis.blockers.push({
          scopeItem: item,
          issues: blockers
        });
      } else if (item.progress >= 80) {
        analysis.summary.readyForProduction++;
        analysis.productionReady.push(item);
      }
    }

    // Cache for 5 minutes
    await this.cache.set(cacheKey, analysis, 300);

    return analysis;
  }
}
```

## Summary

This enterprise backend architecture provides:

1. **Scalability**: Microservices-ready design with proper separation of concerns
2. **Performance**: Redis caching, connection pooling, and query optimization
3. **Security**: JWT authentication, role-based access control, input validation
4. **Maintainability**: Clean architecture with dependency injection and SOLID principles
5. **Real-time**: Socket.IO integration for collaborative features
6. **Reliability**: Comprehensive error handling, logging, and audit trails
7. **Flexibility**: Easy to extend with new features and integrations

The architecture preserves all 88+ existing Formula PM features while providing a solid foundation for future growth and enterprise requirements.