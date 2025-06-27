-- Formula PM PostgreSQL Database Schema
-- Enterprise-grade project management database for custom millwork projects

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search extension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types for better data integrity
CREATE TYPE user_role AS ENUM ('admin', 'project_manager', 'designer', 'craftsman', 'coordinator', 'client');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'on-tender', 'on-hold', 'completed', 'cancelled');
CREATE TYPE project_type AS ENUM ('commercial', 'residential', 'retail', 'hospitality', 'industrial', 'healthcare');
CREATE TYPE project_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status AS ENUM ('pending', 'in-progress', 'review', 'completed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE client_status AS ENUM ('active', 'inactive', 'archived');
CREATE TYPE drawing_status AS ENUM ('draft', 'pending', 'approved', 'revision_required', 'rejected');
CREATE TYPE material_status AS ENUM ('pending', 'pending_approval', 'approved', 'ordered', 'in_stock', 'delivered', 'used');
CREATE TYPE notification_type AS ENUM ('task_assigned', 'task_completed', 'project_update', 'deadline_reminder', 'drawing_approved', 'material_delivered', 'system_alert');
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'view', 'approve', 'reject');

-- Users table - Core user management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    initials VARCHAR(10) GENERATED ALWAYS AS (LEFT(first_name, 1) || LEFT(last_name, 1)) STORED,
    role user_role NOT NULL DEFAULT 'craftsman',
    position VARCHAR(100),
    department VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    join_date DATE DEFAULT CURRENT_DATE,
    skills TEXT[], -- Array of skills
    certifications TEXT[], -- Array of certifications
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients table - Customer information
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    company_name VARCHAR(200),
    contact_person VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    type project_type,
    industry VARCHAR(100),
    status client_status DEFAULT 'active',
    total_project_value DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table - Main project entities
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type project_type NOT NULL,
    status project_status DEFAULT 'draft',
    priority project_priority DEFAULT 'medium',
    budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    location VARCHAR(200),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project team members junction table
CREATE TABLE project_team_members (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id)
);

-- Tasks table - Project tasks and activities
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    title VARCHAR(200), -- For backward compatibility
    description TEXT,
    status task_status DEFAULT 'pending',
    priority task_priority DEFAULT 'medium',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date DATE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scope groups - Organize scope items into logical groups
CREATE TABLE scope_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scope items - Detailed project scope breakdown
CREATE TABLE scope_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_group_id UUID NOT NULL REFERENCES scope_groups(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'pending',
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    order_index INTEGER DEFAULT 0,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shop drawings - Technical drawings and specifications
CREATE TABLE shop_drawings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    scope_item_id UUID REFERENCES scope_items(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    drawing_type VARCHAR(100),
    room VARCHAR(100),
    status drawing_status DEFAULT 'draft',
    version VARCHAR(20) DEFAULT 'Rev A',
    file_path TEXT,
    file_size BIGINT,
    upload_date DATE DEFAULT CURRENT_DATE,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_date DATE,
    comments TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Material specifications - Project materials and costs
CREATE TABLE material_specifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    scope_item_id UUID REFERENCES scope_items(id) ON DELETE SET NULL,
    item_id VARCHAR(50), -- Internal SKU/item identifier
    description TEXT NOT NULL,
    category VARCHAR(100),
    material VARCHAR(100),
    finish VARCHAR(100),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    unit_cost DECIMAL(8,2) NOT NULL,
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    supplier VARCHAR(200),
    lead_time VARCHAR(50),
    status material_status DEFAULT 'pending',
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflow connections - Link scope items, drawings, and materials
CREATE TABLE workflow_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_item_id UUID REFERENCES scope_items(id) ON DELETE CASCADE,
    shop_drawing_id UUID REFERENCES shop_drawings(id) ON DELETE CASCADE,
    material_spec_id UUID REFERENCES material_specifications(id) ON DELETE CASCADE,
    connection_type VARCHAR(50), -- 'scope_to_drawing', 'drawing_to_material', etc.
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications - System and user notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    data JSONB, -- Additional structured data
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs - Track all data changes for compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action audit_action NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for authentication
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments system for collaboration
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL, -- 'project', 'task', 'drawing', etc.
    entity_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For nested comments
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File attachments
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance indexes for optimal query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_type ON clients(type);
CREATE INDEX idx_clients_name_trgm ON clients USING gin (name gin_trgm_ops);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_priority ON projects(priority);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_project_manager_id ON projects(project_manager_id);
CREATE INDEX idx_projects_start_date ON projects(start_date);
CREATE INDEX idx_projects_end_date ON projects(end_date);
CREATE INDEX idx_projects_name_trgm ON projects USING gin (name gin_trgm_ops);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

CREATE INDEX idx_scope_groups_project_id ON scope_groups(project_id);
CREATE INDEX idx_scope_items_scope_group_id ON scope_items(scope_group_id);
CREATE INDEX idx_scope_items_project_id ON scope_items(project_id);
CREATE INDEX idx_scope_items_status ON scope_items(status);

CREATE INDEX idx_shop_drawings_project_id ON shop_drawings(project_id);
CREATE INDEX idx_shop_drawings_scope_item_id ON shop_drawings(scope_item_id);
CREATE INDEX idx_shop_drawings_status ON shop_drawings(status);

CREATE INDEX idx_material_specs_project_id ON material_specifications(project_id);
CREATE INDEX idx_material_specs_scope_item_id ON material_specifications(scope_item_id);
CREATE INDEX idx_material_specs_status ON material_specifications(status);
CREATE INDEX idx_material_specs_category ON material_specifications(category);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_status ON notifications(read_status);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

CREATE INDEX idx_attachments_entity ON attachments(entity_type, entity_id);

-- Full-text search indexes for improved search performance
CREATE INDEX idx_projects_fts ON projects USING gin (to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_tasks_fts ON tasks USING gin (to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_scope_items_fts ON scope_items USING gin (to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_material_specs_fts ON material_specifications USING gin (to_tsvector('english', description || ' ' || COALESCE(category, '') || ' ' || COALESCE(material, '')));

-- Triggers to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scope_groups_updated_at BEFORE UPDATE ON scope_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scope_items_updated_at BEFORE UPDATE ON scope_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shop_drawings_updated_at BEFORE UPDATE ON shop_drawings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_material_specifications_updated_at BEFORE UPDATE ON material_specifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflow_connections_updated_at BEFORE UPDATE ON workflow_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies for multi-tenant security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE scope_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE scope_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Sample RLS policy (can be extended based on requirements)
CREATE POLICY project_access_policy ON projects
    USING (
        EXISTS (
            SELECT 1 FROM project_team_members ptm 
            WHERE ptm.project_id = projects.id 
            AND ptm.user_id = current_setting('app.current_user_id')::UUID
        )
        OR projects.created_by = current_setting('app.current_user_id')::UUID
        OR EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = current_setting('app.current_user_id')::UUID 
            AND u.role IN ('admin', 'project_manager')
        )
    );

-- Create database views for common queries
CREATE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.status,
    p.priority,
    p.progress,
    p.budget,
    p.start_date,
    p.end_date,
    c.name as client_name,
    pm.full_name as project_manager_name,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks,
    COUNT(DISTINCT sd.id) as total_drawings,
    COUNT(DISTINCT ms.id) as total_materials,
    SUM(ms.total_cost) as total_material_cost
FROM projects p
LEFT JOIN clients c ON p.client_id = c.id
LEFT JOIN users pm ON p.project_manager_id = pm.id
LEFT JOIN tasks t ON p.id = t.project_id
LEFT JOIN shop_drawings sd ON p.id = sd.project_id
LEFT JOIN material_specifications ms ON p.id = ms.project_id
GROUP BY p.id, p.name, p.status, p.priority, p.progress, p.budget, p.start_date, p.end_date, c.name, pm.full_name;

-- Performance statistics view
CREATE VIEW performance_stats AS
SELECT 
    'projects' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as recent_records
FROM projects
UNION ALL
SELECT 
    'tasks' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as recent_records
FROM tasks
UNION ALL
SELECT 
    'users' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as recent_records
FROM users;

-- Add comments to tables for documentation
COMMENT ON TABLE users IS 'Core user management with roles and authentication';
COMMENT ON TABLE clients IS 'Customer and client information management';
COMMENT ON TABLE projects IS 'Main project entities with status tracking';
COMMENT ON TABLE tasks IS 'Project tasks and activities with assignment tracking';
COMMENT ON TABLE scope_groups IS 'Logical grouping of project scope items';
COMMENT ON TABLE scope_items IS 'Detailed breakdown of project scope and deliverables';
COMMENT ON TABLE shop_drawings IS 'Technical drawings and specifications with approval workflow';
COMMENT ON TABLE material_specifications IS 'Project materials, costs, and supplier information';
COMMENT ON TABLE workflow_connections IS 'Links between scope items, drawings, and materials';
COMMENT ON TABLE notifications IS 'System and user notifications with read tracking';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for compliance and tracking';