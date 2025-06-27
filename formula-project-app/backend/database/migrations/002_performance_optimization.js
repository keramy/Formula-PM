/**
 * Performance Optimization Migration
 * Adds indexes and optimizations for better query performance
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Apply performance optimizations
 */
async function up() {
  console.log('🚀 Applying performance optimizations...');

  try {
    // User table optimizations
    console.log('📊 Optimizing User table...');
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_users_email ON "User"(email);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_users_status ON "User"(status);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_users_role ON "User"(role);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_users_department ON "User"(department);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_users_created_at ON "User"("createdAt");`;

    // Project table optimizations
    console.log('📊 Optimizing Project table...');
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_projects_status ON "Project"(status);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_projects_priority ON "Project"(priority);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_projects_type ON "Project"(type);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_projects_client_id ON "Project"("clientId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_projects_manager_id ON "Project"("projectManagerId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_projects_start_date ON "Project"("startDate");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_projects_end_date ON "Project"("endDate");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_projects_created_at ON "Project"("createdAt");`;

    // Task table optimizations
    console.log('📊 Optimizing Task table...');
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON "Task"("projectId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON "Task"("assignedTo");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_tasks_status ON "Task"(status);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_tasks_priority ON "Task"(priority);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON "Task"("dueDate");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON "Task"("createdAt");`;
    
    // Composite index for common task queries
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_tasks_project_status ON "Task"("projectId", status);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_tasks_assignee_status ON "Task"("assignedTo", status);`;

    // ProjectMember table optimizations
    console.log('📊 Optimizing ProjectMember table...');
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON "ProjectMember"("projectId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON "ProjectMember"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_project_members_role ON "ProjectMember"(role);`;
    
    // Composite index for user's projects
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_project_members_user_project ON "ProjectMember"("userId", "projectId");`;

    // Client table optimizations
    console.log('📊 Optimizing Client table...');
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_clients_email ON "Client"(email);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_clients_status ON "Client"(status);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_clients_type ON "Client"(type);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_clients_created_at ON "Client"("createdAt");`;

    // ScopeItem table optimizations
    console.log('📊 Optimizing ScopeItem table...');
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_scope_items_project_id ON "ScopeItem"("projectId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_scope_items_category ON "ScopeItem"(category);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_scope_items_status ON "ScopeItem"(status);`;

    // ShopDrawing table optimizations
    console.log('📊 Optimizing ShopDrawing table...');
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_shop_drawings_project_id ON "ShopDrawing"("projectId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_shop_drawings_status ON "ShopDrawing"(status);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_shop_drawings_created_at ON "ShopDrawing"("createdAt");`;

    // MaterialSpecification table optimizations
    console.log('📊 Optimizing MaterialSpecification table...');
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_material_specs_project_id ON "MaterialSpecification"("projectId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_material_specs_category ON "MaterialSpecification"(category);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_material_specs_supplier ON "MaterialSpecification"(supplier);`;

    // AuditLog table optimizations
    console.log('📊 Optimizing AuditLog table...');
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON "AuditLog"("tableName");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON "AuditLog"("recordId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON "AuditLog"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON "AuditLog"(action);`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON "AuditLog"(timestamp);`;
    
    // Composite index for audit queries
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON "AuditLog"("tableName", "recordId");`;

    // Add any missing foreign key indexes that PostgreSQL didn't auto-create
    console.log('📊 Adding foreign key indexes...');
    
    // These might already exist, but we'll create them if not
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_tasks_project_fk ON "Task"("projectId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_tasks_assignee_fk ON "Task"("assignedTo");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_projects_client_fk ON "Project"("clientId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_projects_manager_fk ON "Project"("projectManagerId");`;

    // Performance optimization settings for PostgreSQL
    console.log('📊 Applying PostgreSQL optimizations...');
    
    // Update table statistics
    await prisma.$executeRaw`ANALYZE "User";`;
    await prisma.$executeRaw`ANALYZE "Project";`;
    await prisma.$executeRaw`ANALYZE "Task";`;
    await prisma.$executeRaw`ANALYZE "ProjectMember";`;
    await prisma.$executeRaw`ANALYZE "Client";`;
    await prisma.$executeRaw`ANALYZE "ScopeItem";`;
    await prisma.$executeRaw`ANALYZE "ShopDrawing";`;
    await prisma.$executeRaw`ANALYZE "MaterialSpecification";`;
    await prisma.$executeRaw`ANALYZE "AuditLog";`;

    console.log('✅ Performance optimizations applied successfully');

  } catch (error) {
    console.error('❌ Performance optimization failed:', error);
    throw error;
  }
}

/**
 * Rollback performance optimizations
 */
async function down() {
  console.log('🔄 Rolling back performance optimizations...');

  try {
    // Drop indexes (keep this simple - only drop custom indexes)
    const customIndexes = [
      'idx_users_email', 'idx_users_status', 'idx_users_role', 'idx_users_department', 'idx_users_created_at',
      'idx_projects_status', 'idx_projects_priority', 'idx_projects_type', 'idx_projects_client_id',
      'idx_projects_manager_id', 'idx_projects_start_date', 'idx_projects_end_date', 'idx_projects_created_at',
      'idx_tasks_project_id', 'idx_tasks_assigned_to', 'idx_tasks_status', 'idx_tasks_priority',
      'idx_tasks_due_date', 'idx_tasks_created_at', 'idx_tasks_project_status', 'idx_tasks_assignee_status',
      'idx_project_members_project_id', 'idx_project_members_user_id', 'idx_project_members_role',
      'idx_project_members_user_project',
      'idx_clients_email', 'idx_clients_status', 'idx_clients_type', 'idx_clients_created_at',
      'idx_scope_items_project_id', 'idx_scope_items_category', 'idx_scope_items_status',
      'idx_shop_drawings_project_id', 'idx_shop_drawings_status', 'idx_shop_drawings_created_at',
      'idx_material_specs_project_id', 'idx_material_specs_category', 'idx_material_specs_supplier',
      'idx_audit_logs_table_name', 'idx_audit_logs_record_id', 'idx_audit_logs_user_id',
      'idx_audit_logs_action', 'idx_audit_logs_timestamp', 'idx_audit_logs_table_record'
    ];

    for (const indexName of customIndexes) {
      try {
        await prisma.$executeRaw`DROP INDEX IF EXISTS ${indexName};`;
      } catch (error) {
        console.warn(`⚠️ Could not drop index ${indexName}:`, error.message);
      }
    }

    console.log('✅ Performance optimization rollback completed');

  } catch (error) {
    console.error('❌ Performance optimization rollback failed:', error);
    throw error;
  }
}

/**
 * Run migration if called directly
 */
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'down') {
    down()
      .then(() => {
        console.log('✅ Migration rollback completed');
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ Migration rollback failed:', error);
        process.exit(1);
      })
      .finally(() => {
        prisma.$disconnect();
      });
  } else {
    up()
      .then(() => {
        console.log('✅ Migration completed');
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
      })
      .finally(() => {
        prisma.$disconnect();
      });
  }
}

module.exports = { up, down };