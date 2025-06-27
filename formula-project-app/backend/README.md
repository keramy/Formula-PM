# Formula PM Backend - Database Architecture & Setup

## Overview

This document provides comprehensive setup instructions and documentation for the Formula PM enterprise-grade PostgreSQL database with Prisma ORM, Redis caching, and audit logging.

## Architecture

### Database Stack
- **PostgreSQL 14+** - Primary database with advanced features
- **Prisma ORM** - Type-safe database access and migrations
- **Redis** - High-performance caching and session storage
- **Node.js Express** - RESTful API server

### Key Features
- ✅ Enterprise-grade PostgreSQL schema with 15+ tables
- ✅ Full audit logging for compliance and data integrity
- ✅ Redis caching for performance optimization
- ✅ Row-level security (RLS) for multi-tenant data access
- ✅ Full-text search capabilities
- ✅ Automated data migration from existing JSON data
- ✅ Comprehensive indexing for optimal query performance

## Quick Start

### Prerequisites
- PostgreSQL 14+ installed and running
- Redis server installed and running
- Node.js 18+ and npm

### 1. Database Setup

#### Install PostgreSQL (if not already installed)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### Create Database and User
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE formula_pm_dev;
CREATE DATABASE formula_pm_test;

-- Create user
CREATE USER formula_pm_user WITH PASSWORD 'formula_pm_dev_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE formula_pm_dev TO formula_pm_user;
GRANT ALL PRIVILEGES ON DATABASE formula_pm_test TO formula_pm_user;

-- Grant schema privileges
\c formula_pm_dev
GRANT ALL PRIVILEGES ON SCHEMA public TO formula_pm_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO formula_pm_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO formula_pm_user;

\c formula_pm_test
GRANT ALL PRIVILEGES ON SCHEMA public TO formula_pm_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO formula_pm_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO formula_pm_user;
```

### 2. Redis Setup

#### Install Redis (if not already installed)
```bash
# Ubuntu/Debian
sudo apt install redis-server

# macOS
brew install redis
brew services start redis

# Windows
# Download from https://redis.io/download
```

#### Verify Redis is running
```bash
redis-cli ping
# Should return: PONG
```

### 3. Backend Installation

```bash
# Navigate to backend directory
cd /path/to/formula-pm/formula-project-app/backend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.development

# Edit environment variables
nano .env.development
```

### 4. Environment Configuration

Update `.env.development` with your database credentials:

```env
# Database Configuration
DATABASE_URL="postgresql://formula_pm_user:formula_pm_dev_password@localhost:5432/formula_pm_dev"
DATABASE_URL_TEST="postgresql://formula_pm_user:formula_pm_dev_password@localhost:5432/formula_pm_test"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="your-secure-jwt-secret-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=5014
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3003"
```

### 5. Database Migration and Seeding

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run initial migration and seeding
npm run db:seed
```

### 6. Start Development Server

```bash
# Start backend server
npm run dev

# Server will start on http://localhost:5014
```

## Database Schema

### Core Tables

#### Users Table
- **Purpose**: Core user management with roles and authentication
- **Key Fields**: email, passwordHash, role, firstName, lastName
- **Relationships**: One-to-many with projects, tasks, notifications

#### Clients Table
- **Purpose**: Customer and client information management
- **Key Fields**: name, contactPerson, email, type, industry
- **Relationships**: One-to-many with projects

#### Projects Table
- **Purpose**: Main project entities with status tracking
- **Key Fields**: name, status, priority, budget, startDate, endDate
- **Relationships**: Belongs to client, has many tasks, scope items

#### Tasks Table
- **Purpose**: Project tasks and activities with assignment tracking
- **Key Fields**: name, status, priority, assignedTo, dueDate
- **Relationships**: Belongs to project, assigned to user

#### Scope Groups & Items
- **Purpose**: Hierarchical breakdown of project deliverables
- **Key Fields**: name, description, status, completionPercentage
- **Relationships**: Groups contain items, items belong to projects

#### Shop Drawings Table
- **Purpose**: Technical drawings with approval workflow
- **Key Fields**: fileName, status, version, approvedBy
- **Relationships**: Belongs to project, linked to scope items

#### Material Specifications Table
- **Purpose**: Project materials, costs, and supplier information
- **Key Fields**: description, quantity, unitCost, supplier, status
- **Relationships**: Belongs to project, linked to scope items

#### Audit Logs Table
- **Purpose**: Comprehensive audit trail for compliance
- **Key Fields**: tableName, recordId, action, oldValues, newValues
- **Relationships**: Linked to users for accountability

### Performance Features

#### Indexes
- **Primary indexes** on all foreign keys
- **Composite indexes** for common query patterns
- **Full-text search indexes** for projects, tasks, and materials
- **Trigram indexes** for fuzzy string matching

#### Triggers
- **Automatic timestamp updates** on all relevant tables
- **Audit logging triggers** for data change tracking
- **Data validation triggers** for business rules

#### Views
- **project_summary** - Aggregated project information with metrics
- **performance_stats** - Database performance and usage statistics

## Caching Strategy

### Redis Configuration
- **Connection pooling** for high concurrency
- **Automatic failover** to continue without cache if Redis unavailable
- **TTL-based expiration** with configurable timeouts
- **Batch operations** for efficient multi-key operations

### Cache Patterns
```javascript
// User data caching
const userKey = cacheService.generateKey('user', userId);
await cacheService.set(userKey, userData, 3600); // 1 hour TTL

// Project list caching
const projectsKey = cacheService.generateKey('project', 'list', 'active');
await cacheService.set(projectsKey, projects, 1800); // 30 minutes TTL

// Search results caching
const searchKey = cacheService.generateKey('search', queryHash);
await cacheService.set(searchKey, results, 600); // 10 minutes TTL
```

## Audit Logging

### Automatic Logging
- **Data changes** - All create, update, delete operations
- **User actions** - Login, logout, view, export operations
- **System events** - Startup, shutdown, errors, backups

### Manual Logging
```javascript
// Log user action
await auditService.logUserAction({
  action: 'project_export',
  entityType: 'project',
  entityId: projectId,
  userId: req.user.id,
  userEmail: req.user.email,
  ipAddress: req.ip,
  details: { format: 'pdf', includeDrawings: true }
});

// Log system event
await auditService.logSystemEvent({
  event: 'backup_completed',
  severity: 'info',
  description: 'Daily database backup completed successfully',
  metadata: { backupSize: '2.4GB', duration: '45 minutes' }
});
```

### Audit Queries
```javascript
// Get record history
const history = await auditService.getRecordHistory('projects', projectId);

// Query audit logs with filters
const logs = await auditService.queryAuditLogs({
  tableName: 'projects',
  action: 'update',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  limit: 100
});
```

## API Contracts for Other Subagents

### For Subagent D (API Engineer)

#### Database Connection
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Available in all route handlers
app.locals.prisma = prisma;
```

#### Standard Query Patterns
```javascript
// Get projects with related data
const projects = await prisma.project.findMany({
  include: {
    client: true,
    projectManager: true,
    tasks: true,
    teamMembers: {
      include: { user: true }
    }
  }
});

// Create project with audit logging
const project = await prisma.project.create({
  data: projectData
});
await auditService.logDataChange({
  tableName: 'projects',
  recordId: project.id,
  action: 'create',
  newValues: project,
  userId: req.user.id
});
```

#### Caching Integration
```javascript
// Check cache first, then database
const cacheKey = cacheService.generateKey('project', projectId);
let project = await cacheService.get(cacheKey);

if (!project) {
  project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { client: true, tasks: true }
  });
  
  if (project) {
    await cacheService.set(cacheKey, project, 3600);
  }
}
```

### For Subagent F (Real-time Features)

#### Database Change Notifications
```javascript
// Set up database change triggers for real-time updates
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.query('LISTEN project_changes');
client.query('LISTEN task_changes');

client.on('notification', (msg) => {
  const data = JSON.parse(msg.payload);
  // Emit to WebSocket clients
  io.emit('data_change', data);
});
```

#### Real-time Cache Invalidation
```javascript
// Invalidate cache when data changes
await cacheService.deletePattern(`${cacheService.config.keyPrefix}project:${projectId}*`);
```

## Production Deployment

### Environment Setup
```bash
# Production environment file
cp .env.example .env.production

# Update with production values
DATABASE_URL="postgresql://prod_user:secure_password@prod-db:5432/formula_pm_prod"
REDIS_URL="redis://prod-redis:6379"
JWT_SECRET="production-grade-secret-key"
NODE_ENV="production"
```

### Database Migration
```bash
# Run production migrations
NODE_ENV=production npm run db:migrate:deploy

# Create production data (optional)
NODE_ENV=production npm run db:seed
```

### Performance Optimization
```sql
-- Additional production indexes
CREATE INDEX CONCURRENTLY idx_projects_client_status ON projects(client_id, status);
CREATE INDEX CONCURRENTLY idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX CONCURRENTLY idx_audit_logs_timestamp_desc ON audit_logs(timestamp DESC);

-- Update table statistics
ANALYZE;

-- Enable auto-vacuum
ALTER TABLE audit_logs SET (autovacuum_enabled = true);
```

## Monitoring and Maintenance

### Health Checks
```javascript
// Database health check endpoint
app.get('/health/database', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const cacheHealth = await cacheService.healthCheck();
    
    res.json({
      database: 'healthy',
      cache: cacheHealth,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      database: 'unhealthy',
      error: error.message
    });
  }
});
```

### Backup Strategy
```bash
# Daily database backup
pg_dump $DATABASE_URL > "backup_$(date +%Y%m%d_%H%M%S).sql"

# Redis backup
redis-cli SAVE
cp /var/lib/redis/dump.rdb "redis_backup_$(date +%Y%m%d_%H%M%S).rdb"
```

### Performance Monitoring
```sql
-- Query performance analysis
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Index usage analysis
SELECT schemaname, tablename, indexname, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_tup_read DESC;
```

## Troubleshooting

### Common Issues

#### Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check Redis status
redis-cli ping

# Test database connection
psql $DATABASE_URL -c "SELECT version();"
```

#### Performance Issues
```sql
-- Check slow queries
SELECT query, total_time, calls, mean_time
FROM pg_stat_statements
WHERE mean_time > 1000
ORDER BY total_time DESC;

-- Check table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Cache Issues
```javascript
// Clear all cache
await cacheService.flush();

// Check cache statistics
const stats = await cacheService.getStats();
console.log('Cache hit rate:', stats.hitRate);
```

### Support Commands

```bash
# Reset database (development only)
npm run db:migrate:reset

# View database in browser
npm run db:studio

# Run database tests
npm test

# Check database migrations status
npx prisma migrate status
```

## Security Considerations

### Database Security
- ✅ Row-level security (RLS) policies implemented
- ✅ Encrypted passwords with bcrypt
- ✅ SQL injection prevention via Prisma
- ✅ Connection pooling with timeouts
- ✅ Audit logging for all data changes

### Cache Security
- ✅ Redis password protection
- ✅ TTL expiration for sensitive data
- ✅ Sanitized data in cache (no passwords)
- ✅ Cache isolation per environment

### Recommendations
1. **Use SSL/TLS** for database connections in production
2. **Rotate JWT secrets** regularly
3. **Monitor audit logs** for suspicious activity
4. **Backup encryption** for sensitive data
5. **Regular security updates** for all dependencies

---

## Next Steps for Subagents

### Subagent D (API Engineer)
1. Use the Prisma client instance available in `app.locals.prisma`
2. Implement audit logging in all data-modifying endpoints
3. Integrate caching for frequently accessed data
4. Follow the query patterns documented above

### Subagent E (Authentication)
1. Use the `users` table for authentication
2. Leverage `user_sessions` table for session management
3. Implement JWT tokens with the configured secrets
4. Use audit logging for authentication events

### Subagent F (Real-time Features)
1. Set up database change listeners for real-time updates
2. Integrate with Redis for real-time data distribution
3. Use cache invalidation patterns for live data
4. Implement WebSocket connections with session validation

The database foundation is now complete and ready for the next phases of development!