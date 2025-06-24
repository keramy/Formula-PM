# Formula PM - Phase 1: Core Backend Systems

**Duration**: 2-3 months  
**Priority**: Critical  
**Objective**: Build enterprise-grade backend with PostgreSQL, proper models, and comprehensive API

---

## 📋 **PHASE 1 OVERVIEW**

This phase transforms the current JSON file-based backend into a production-ready system with PostgreSQL database, proper ORM models, and a comprehensive REST API. All 88+ existing features will be preserved while gaining enterprise-level data management capabilities.

### **Success Criteria**
- ✅ Complete PostgreSQL database with all Formula PM entities
- ✅ Full CRUD API operations for all features
- ✅ Data migration from JSON files completed
- ✅ Frontend integration working with new backend
- ✅ Real-time features (Socket.IO) operational
- ✅ Basic testing infrastructure established

---

## 🗓️ **MONTH 1: DATABASE & MODELS**

### **Week 1-2: Database Models Implementation**

#### **Day 1-3: Core Models Setup**

**Sequelize Models Structure**
```javascript
// src/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import all model definitions
const Company = require('./Company')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes);
const Project = require('./Project')(sequelize, DataTypes);
const Client = require('./Client')(sequelize, DataTypes);
const ScopeItem = require('./ScopeItem')(sequelize, DataTypes);
const ShopDrawing = require('./ShopDrawing')(sequelize, DataTypes);
const MaterialSpecification = require('./MaterialSpecification')(sequelize, DataTypes);
const Task = require('./Task')(sequelize, DataTypes);
const Report = require('./Report')(sequelize, DataTypes);
const ReportSection = require('./ReportSection')(sequelize, DataTypes);
const ReportLine = require('./ReportLine')(sequelize, DataTypes);
const ReportImage = require('./ReportImage')(sequelize, DataTypes);
const AuditLog = require('./AuditLog')(sequelize, DataTypes);

// Define models object
const models = {
  Company,
  User,
  Project,
  Client,
  ScopeItem,
  ShopDrawing,
  MaterialSpecification,
  Task,
  Report,
  ReportSection,
  ReportLine,
  ReportImage,
  AuditLog,
  sequelize,
  Sequelize
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
```

**User Model (Team Members)**
```javascript
// src/models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    company_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'co_founder', 'project_manager', 'user'),
      defaultValue: 'user'
    },
    phone: {
      type: DataTypes.STRING(20),
      validate: {
        isNumeric: false // Allow + and - characters
      }
    },
    avatar_url: {
      type: DataTypes.STRING(500)
    },
    initials: {
      type: DataTypes.STRING(5)
    },
    role_color: {
      type: DataTypes.STRING(7), // Hex color
      validate: {
        is: /^#[0-9A-F]{6}$/i
      }
    },
    specialties: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    last_login_at: {
      type: DataTypes.DATE
    },
    email_verified_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'users',
    underscored: true,
    hooks: {
      beforeCreate: (user) => {
        // Generate initials if not provided
        if (!user.initials) {
          user.initials = (user.first_name.charAt(0) + user.last_name.charAt(0)).toUpperCase();
        }
        
        // Generate role color if not provided
        if (!user.role_color) {
          const colors = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2'];
          user.role_color = colors[Math.floor(Math.random() * colors.length)];
        }
      }
    }
  });

  User.associate = function(models) {
    User.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });

    User.hasMany(models.Project, {
      foreignKey: 'project_manager_id',
      as: 'managed_projects'
    });

    User.hasMany(models.Task, {
      foreignKey: 'assigned_to',
      as: 'assigned_tasks'
    });

    User.hasMany(models.Task, {
      foreignKey: 'created_by',
      as: 'created_tasks'
    });

    User.hasMany(models.Report, {
      foreignKey: 'created_by',
      as: 'created_reports'
    });

    User.hasMany(models.AuditLog, {
      foreignKey: 'user_id',
      as: 'audit_logs'
    });
  };

  // Instance methods
  User.prototype.getFullName = function() {
    return `${this.first_name} ${this.last_name}`;
  };

  User.prototype.toSafeJSON = function() {
    const user = this.toJSON();
    delete user.password_hash;
    return user;
  };

  return User;
};
```

**Project Model**
```javascript
// src/models/Project.js
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    company_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [3, 200]
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.ENUM('Commercial', 'Residential', 'Industrial', 'Technology', 'Retail', 'Corporate', 'Office'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled'),
      defaultValue: 'planning'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    start_date: {
      type: DataTypes.DATEONLY
    },
    end_date: {
      type: DataTypes.DATEONLY,
      validate: {
        isAfterStartDate(value) {
          if (value && this.start_date && value <= this.start_date) {
            throw new Error('End date must be after start date');
          }
        }
      }
    },
    actual_start_date: {
      type: DataTypes.DATEONLY
    },
    actual_end_date: {
      type: DataTypes.DATEONLY
    },
    budget: {
      type: DataTypes.DECIMAL(15, 2),
      validate: {
        min: 0
      }
    },
    actual_cost: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD'
    },
    project_manager_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    client_id: {
      type: DataTypes.UUID,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    location: {
      type: DataTypes.TEXT
    },
    square_footage: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'projects',
    underscored: true,
    hooks: {
      beforeUpdate: async (project) => {
        // Automatically calculate progress if not provided
        if (!project.changed('progress')) {
          const scopeItems = await project.getScopeItems();
          if (scopeItems.length > 0) {
            const totalProgress = scopeItems.reduce((sum, item) => sum + item.progress, 0);
            project.progress = Math.round(totalProgress / scopeItems.length);
          }
        }
      }
    }
  });

  Project.associate = function(models) {
    Project.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });

    Project.belongsTo(models.User, {
      foreignKey: 'project_manager_id',
      as: 'project_manager'
    });

    Project.belongsTo(models.Client, {
      foreignKey: 'client_id',
      as: 'client'
    });

    Project.hasMany(models.ScopeItem, {
      foreignKey: 'project_id',
      as: 'scope_items'
    });

    Project.hasMany(models.ShopDrawing, {
      foreignKey: 'project_id',
      as: 'shop_drawings'
    });

    Project.hasMany(models.MaterialSpecification, {
      foreignKey: 'project_id',
      as: 'material_specifications'
    });

    Project.hasMany(models.Task, {
      foreignKey: 'project_id',
      as: 'tasks'
    });

    Project.hasMany(models.Report, {
      foreignKey: 'project_id',
      as: 'reports'
    });
  };

  // Instance methods
  Project.prototype.calculateProgress = async function() {
    const scopeItems = await this.getScopeItems();
    if (scopeItems.length === 0) return 0;
    
    const totalProgress = scopeItems.reduce((sum, item) => sum + item.progress, 0);
    return Math.round(totalProgress / scopeItems.length);
  };

  Project.prototype.getProjectSummary = async function() {
    const [scopeItems, tasks, drawings, materials] = await Promise.all([
      this.getScopeItems(),
      this.getTasks(),
      this.getShopDrawings(),
      this.getMaterialSpecifications()
    ]);

    return {
      totalScopeItems: scopeItems.length,
      completedScopeItems: scopeItems.filter(item => item.status === 'completed').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.status === 'completed').length,
      totalDrawings: drawings.length,
      approvedDrawings: drawings.filter(drawing => drawing.approval_status === 'approved').length,
      totalMaterials: materials.length,
      deliveredMaterials: materials.filter(material => material.procurement_status === 'delivered').length
    };
  };

  return Project;
};
```

#### **Day 4-7: Scope Items and Workflow Models**

**ScopeItem Model (4 Groups)**
```javascript
// src/models/ScopeItem.js
module.exports = (sequelize, DataTypes) => {
  const ScopeItem = sequelize.define('ScopeItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    group_type: {
      type: DataTypes.ENUM('construction', 'millwork', 'electric', 'mep'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'on_hold'),
      defaultValue: 'pending'
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    estimated_duration: {
      type: DataTypes.INTEGER, // days
      validate: {
        min: 0
      }
    },
    start_date: {
      type: DataTypes.DATEONLY
    },
    end_date: {
      type: DataTypes.DATEONLY
    },
    assigned_to: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    depends_on: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    },
    connected_drawings: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    },
    connected_materials: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    cost_estimate: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0
      }
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'scope_items',
    underscored: true,
    indexes: [
      {
        fields: ['project_id', 'group_type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['assigned_to']
      },
      {
        fields: ['code']
      }
    ]
  });

  ScopeItem.associate = function(models) {
    ScopeItem.belongsTo(models.Project, {
      foreignKey: 'project_id',
      as: 'project'
    });

    ScopeItem.belongsTo(models.User, {
      foreignKey: 'assigned_to',
      as: 'assignee'
    });
  };

  // Instance methods
  ScopeItem.prototype.getGroupIcon = function() {
    const iconMap = {
      construction: '🏗️',
      millwork: '🪵',
      electric: '⚡',
      mep: '🔧'
    };
    return iconMap[this.group_type] || '🔧';
  };

  ScopeItem.prototype.canStartProduction = async function() {
    const models = sequelize.models;
    
    // Check dependencies
    if (this.depends_on && this.depends_on.length > 0) {
      const dependencies = await models.ScopeItem.findAll({
        where: {
          id: this.depends_on
        }
      });
      
      const incompleteDeps = dependencies.filter(dep => dep.status !== 'completed');
      if (incompleteDeps.length > 0) {
        return {
          canStart: false,
          blockers: [`Depends on incomplete items: ${incompleteDeps.map(d => d.code).join(', ')}`]
        };
      }
    }

    const blockers = [];

    // Check connected drawings
    if (this.connected_drawings && this.connected_drawings.length > 0) {
      const drawings = await models.ShopDrawing.findAll({
        where: {
          id: this.connected_drawings
        }
      });
      
      const unapprovedDrawings = drawings.filter(d => d.approval_status !== 'approved');
      if (unapprovedDrawings.length > 0) {
        blockers.push(`Unapproved drawings: ${unapprovedDrawings.map(d => d.code).join(', ')}`);
      }
    }

    // Check connected materials
    if (this.connected_materials && this.connected_materials.length > 0) {
      const materials = await models.MaterialSpecification.findAll({
        where: {
          id: this.connected_materials
        }
      });
      
      const unavailableMaterials = materials.filter(m => m.procurement_status !== 'delivered');
      if (unavailableMaterials.length > 0) {
        blockers.push(`Materials not delivered: ${unavailableMaterials.map(m => m.code).join(', ')}`);
      }
    }

    return {
      canStart: blockers.length === 0,
      blockers
    };
  };

  return ScopeItem;
};
```

### **Week 3-4: Migrations & Seeds Implementation**

#### **Day 1-4: Database Migrations**

**Complete Migration for All Tables**
```bash
# Generate all migrations
npx sequelize-cli migration:generate --name create-companies
npx sequelize-cli migration:generate --name create-users
npx sequelize-cli migration:generate --name create-clients
npx sequelize-cli migration:generate --name create-projects
npx sequelize-cli migration:generate --name create-scope-items
npx sequelize-cli migration:generate --name create-shop-drawings
npx sequelize-cli migration:generate --name create-material-specifications
npx sequelize-cli migration:generate --name create-tasks
npx sequelize-cli migration:generate --name create-reports
npx sequelize-cli migration:generate --name create-report-sections
npx sequelize-cli migration:generate --name create-report-lines
npx sequelize-cli migration:generate --name create-report-images
npx sequelize-cli migration:generate --name create-audit-logs
```

**Example: Complete Projects Migration**
```javascript
// migrations/004-create-projects.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ENUM types first
    await queryInterface.sequelize.query(`
      CREATE TYPE "project_type_enum" AS ENUM (
        'Commercial', 'Residential', 'Industrial', 'Technology', 'Retail', 'Corporate', 'Office'
      );
    `);

    await queryInterface.sequelize.query(`
      CREATE TYPE "project_status_enum" AS ENUM (
        'planning', 'active', 'on_hold', 'completed', 'cancelled'
      );
    `);

    await queryInterface.sequelize.query(`
      CREATE TYPE "priority_enum" AS ENUM (
        'low', 'medium', 'high', 'urgent'
      );
    `);

    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      type: {
        type: 'project_type_enum',
        allowNull: false
      },
      status: {
        type: 'project_status_enum',
        defaultValue: 'planning'
      },
      priority: {
        type: 'priority_enum',
        defaultValue: 'medium'
      },
      start_date: {
        type: Sequelize.DATEONLY
      },
      end_date: {
        type: Sequelize.DATEONLY
      },
      actual_start_date: {
        type: Sequelize.DATEONLY
      },
      actual_end_date: {
        type: Sequelize.DATEONLY
      },
      budget: {
        type: Sequelize.DECIMAL(15, 2)
      },
      actual_cost: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'USD'
      },
      project_manager_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      client_id: {
        type: Sequelize.UUID,
        references: {
          model: 'clients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      location: {
        type: Sequelize.TEXT
      },
      square_footage: {
        type: Sequelize.INTEGER
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      settings: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('projects', ['company_id', 'status']);
    await queryInterface.addIndex('projects', ['project_manager_id']);
    await queryInterface.addIndex('projects', ['client_id']);
    await queryInterface.addIndex('projects', ['type']);
    await queryInterface.addIndex('projects', ['created_at']);
    
    // Add full-text search index
    await queryInterface.sequelize.query(`
      CREATE INDEX idx_projects_search 
      ON projects USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('projects');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "project_type_enum";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "project_status_enum";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "priority_enum";');
  }
};
```

#### **Day 5-7: Data Seeding**

**Comprehensive Seeder for Formula International**
```javascript
// seeders/001-seed-formula-international.js
'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Create Formula International Company
      const companyId = uuidv4();
      await queryInterface.bulkInsert('companies', [{
        id: companyId,
        name: 'Formula International',
        email: 'info@formulainternational.com',
        phone: '+90 212 XXX XXXX',
        address: 'Istanbul, Turkey',
        website: 'https://formulainternational.com',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }], { transaction });

      // 2. Create Team Members
      const teamMembers = [
        {
          email: 'admin@formulainternational.com',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          phone: '+90 212 XXX 0001'
        },
        {
          email: 'kubilay.ilgin@formulainternational.com',
          password: 'kubilay123',
          firstName: 'Kubilay',
          lastName: 'Ilgın',
          role: 'co_founder',
          phone: '+90 212 XXX 0002'
        },
        {
          email: 'hande.karaman@formulainternational.com',
          password: 'hande123',
          firstName: 'Hande Selen',
          lastName: 'Karaman',
          role: 'project_manager',
          phone: '+90 212 XXX 0003'
        },
        {
          email: 'emre.koc@formulainternational.com',
          password: 'emre123',
          firstName: 'Emre',
          lastName: 'Koc',
          role: 'user',
          phone: '+90 212 XXX 0004',
          specialties: ['MEP Engineering', 'HVAC Systems']
        },
        {
          email: 'serra.uluveren@formulainternational.com',
          password: 'serra123',
          firstName: 'Serra',
          lastName: 'Uluveren',
          role: 'user',
          phone: '+90 212 XXX 0005',
          specialties: ['Procurement', 'Cost Management']
        },
        {
          email: 'omer.onan@formulainternational.com',
          password: 'omer123',
          firstName: 'Ömer',
          lastName: 'Onan',
          role: 'user',
          phone: '+90 212 XXX 0006',
          specialties: ['Construction Management', 'Quality Control']
        }
        // Add remaining 8 team members...
      ];

      const users = [];
      for (const member of teamMembers) {
        const userId = uuidv4();
        const passwordHash = await bcrypt.hash(member.password, 12);
        const initials = (member.firstName.charAt(0) + member.lastName.charAt(0)).toUpperCase();
        
        users.push({
          id: userId,
          company_id: companyId,
          email: member.email,
          password_hash: passwordHash,
          first_name: member.firstName,
          last_name: member.lastName,
          role: member.role,
          phone: member.phone,
          initials: initials,
          role_color: this.generateRoleColor(member.role),
          specialties: member.specialties || [],
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        });
      }

      await queryInterface.bulkInsert('users', users, { transaction });

      // 3. Create Sample Clients
      const clients = [
        {
          id: uuidv4(),
          company_id: companyId,
          name: 'Akbank',
          contact_person: 'Mehmet Yılmaz',
          email: 'mehmet.yilmaz@akbank.com.tr',
          phone: '+90 212 385 5555',
          address: 'Sabancı Center, Levent, Istanbul',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          company_id: companyId,
          name: 'Garanti BBVA',
          contact_person: 'Ayşe Demir',
          email: 'ayse.demir@garantibbva.com.tr',
          phone: '+90 212 318 1818',
          address: 'Garanti BBVA Tower, Levent, Istanbul',
          created_at: new Date(),
          updated_at: new Date()
        }
        // Add more clients...
      ];

      await queryInterface.bulkInsert('clients', clients, { transaction });

      await transaction.commit();
      console.log('✅ Formula International seed data created successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('clients', null, {});
    await queryInterface.bulkDelete('companies', null, {});
  },

  generateRoleColor(role) {
    const roleColors = {
      admin: '#e74c3c',
      co_founder: '#9b59b6',
      project_manager: '#3498db',
      user: '#95a5a6'
    };
    return roleColors[role] || '#95a5a6';
  }
};
```

---

## 🗓️ **MONTH 2: CONTROLLERS & SERVICES**

### **Week 1-2: Service Layer Implementation**

#### **Service Architecture Setup**
```javascript
// src/services/BaseService.js
class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll(filters = {}, pagination = {}) {
    return await this.repository.findAll(filters, pagination);
  }

  async findById(id) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }

  async create(data) {
    this.validateData(data);
    return await this.repository.create(data);
  }

  async update(id, data) {
    await this.findById(id); // Ensure exists
    this.validateData(data, true);
    return await this.repository.update(id, data);
  }

  async delete(id) {
    await this.findById(id); // Ensure exists
    return await this.repository.delete(id);
  }

  validateData(data, isUpdate = false) {
    // Override in child classes
  }
}

module.exports = BaseService;
```

**ProjectService (Business Logic)**
```javascript
// src/services/ProjectService.js
const BaseService = require('./BaseService');
const { Project, ScopeItem, ShopDrawing, MaterialSpecification, Task } = require('../models');
const WorkflowService = require('./WorkflowService');
const NotificationService = require('./NotificationService');

class ProjectService extends BaseService {
  constructor() {
    super(Project);
    this.workflowService = new WorkflowService();
    this.notificationService = new NotificationService();
  }

  async createProject(projectData, userId) {
    // Validate business rules
    this.validateProjectData(projectData);
    
    const transaction = await this.repository.sequelize.transaction();
    
    try {
      // Create project
      const project = await this.repository.create({
        ...projectData,
        project_manager_id: userId,
        status: 'planning',
        progress: 0
      }, { transaction });

      // Create default scope items for each group
      await this.createDefaultScopeItems(project.id, transaction);
      
      // Initialize workflow
      await this.workflowService.initializeWorkflow(project.id, transaction);
      
      // Log activity
      await this.logActivity(userId, 'project_created', project.id, {
        project_name: project.name
      });
      
      await transaction.commit();

      // Send notifications
      await this.notificationService.notifyProjectCreated(project, userId);
      
      return project;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async createDefaultScopeItems(projectId, transaction) {
    const defaultScopeGroups = [
      {
        group_type: 'construction',
        items: [
          { name: 'Foundation Work', code: 'CONST001' },
          { name: 'Structural Work', code: 'CONST002' },
          { name: 'Roofing', code: 'CONST003' }
        ]
      },
      {
        group_type: 'millwork',
        items: [
          { name: 'Kitchen Cabinets', code: 'MILL001' },
          { name: 'Built-in Furniture', code: 'MILL002' },
          { name: 'Custom Shelving', code: 'MILL003' }
        ]
      },
      {
        group_type: 'electric',
        items: [
          { name: 'Main Panel Installation', code: 'ELEC001' },
          { name: 'Outlet Installation', code: 'ELEC002' },
          { name: 'Lighting Systems', code: 'ELEC003' }
        ]
      },
      {
        group_type: 'mep',
        items: [
          { name: 'HVAC Installation', code: 'MEP001' },
          { name: 'Plumbing Systems', code: 'MEP002' },
          { name: 'Fire Safety Systems', code: 'MEP003' }
        ]
      }
    ];

    for (const group of defaultScopeGroups) {
      for (let i = 0; i < group.items.length; i++) {
        await ScopeItem.create({
          project_id: projectId,
          group_type: group.group_type,
          name: group.items[i].name,
          code: group.items[i].code,
          status: 'pending',
          progress: 0,
          priority: 'medium'
        }, { transaction });
      }
    }
  }

  async getProjectDashboard(projectId) {
    const project = await this.repository.findById(projectId, {
      include: [
        'project_manager',
        'client',
        'scope_items',
        'shop_drawings',
        'material_specifications',
        'tasks'
      ]
    });

    // Calculate project metrics
    const metrics = this.calculateProjectMetrics(project);
    
    // Get workflow status
    const workflowStatus = await this.workflowService.calculateWorkflowStatus(projectId);
    
    // Get recent activity
    const recentActivity = await this.getRecentActivity(projectId);
    
    return {
      project,
      metrics,
      workflowStatus,
      recentActivity
    };
  }

  calculateProjectMetrics(project) {
    const scopeItems = project.scope_items || [];
    const tasks = project.tasks || [];
    const drawings = project.shop_drawings || [];
    const materials = project.material_specifications || [];

    return {
      // Scope metrics
      totalScopeItems: scopeItems.length,
      completedScopeItems: scopeItems.filter(item => item.status === 'completed').length,
      scopeProgress: scopeItems.length > 0 
        ? Math.round(scopeItems.reduce((sum, item) => sum + item.progress, 0) / scopeItems.length)
        : 0,

      // Task metrics
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.status === 'completed').length,
      overdueTasks: tasks.filter(task => 
        task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
      ).length,

      // Drawing metrics
      totalDrawings: drawings.length,
      approvedDrawings: drawings.filter(drawing => drawing.approval_status === 'approved').length,
      pendingDrawings: drawings.filter(drawing => drawing.approval_status === 'pending').length,

      // Material metrics
      totalMaterials: materials.length,
      deliveredMaterials: materials.filter(material => material.procurement_status === 'delivered').length,
      pendingMaterials: materials.filter(material => material.procurement_status === 'pending').length,

      // Financial metrics
      budgetUtilization: project.budget && project.actual_cost 
        ? Math.round((project.actual_cost / project.budget) * 100)
        : 0
    };
  }

  async updateProjectProgress(projectId) {
    const project = await this.repository.findById(projectId, {
      include: ['scope_items']
    });

    if (project.scope_items && project.scope_items.length > 0) {
      const totalProgress = project.scope_items.reduce((sum, item) => sum + item.progress, 0);
      const averageProgress = Math.round(totalProgress / project.scope_items.length);
      
      await this.repository.update(projectId, {
        progress: averageProgress
      });

      // Check for milestone completion
      await this.checkMilestones(project, averageProgress);
      
      return averageProgress;
    }

    return project.progress;
  }

  validateProjectData(data, isUpdate = false) {
    const required = ['name', 'type'];
    
    if (!isUpdate) {
      for (const field of required) {
        if (!data[field]) {
          throw new Error(`${field} is required`);
        }
      }
    }

    if (data.end_date && data.start_date && data.end_date <= data.start_date) {
      throw new Error('End date must be after start date');
    }

    if (data.budget && data.budget < 0) {
      throw new Error('Budget must be positive');
    }
  }
}

module.exports = ProjectService;
```

### **Week 3-4: API Controllers Implementation**

#### **Authentication Controller**
```javascript
// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');

class AuthController {
  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: errors.array()
          }
        });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({
        where: { email: email.toLowerCase() },
        include: ['company']
      });

      if (!user || !user.is_active) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { 
          userId: user.id,
          role: user.role,
          companyId: user.company_id
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
      );

      // Update last login
      await user.update({ last_login_at: new Date() });

      res.json({
        success: true,
        data: {
          user: user.toSafeJSON(),
          accessToken,
          refreshToken
        }
      });

    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'NO_REFRESH_TOKEN',
            message: 'Refresh token required'
          }
        });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findByPk(decoded.userId, {
        include: ['company']
      });

      if (!user || !user.is_active) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_REFRESH_TOKEN',
            message: 'Invalid refresh token'
          }
        });
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { 
          userId: user.id,
          role: user.role,
          companyId: user.company_id
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.json({
        success: true,
        data: {
          accessToken,
          user: user.toSafeJSON()
        }
      });

    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_REFRESH_TOKEN',
            message: 'Invalid or expired refresh token'
          }
        });
      }
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: ['company']
      });

      res.json({
        success: true,
        data: user.toSafeJSON()
      });

    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      // In a more sophisticated implementation, you might:
      // - Add token to blacklist
      // - Clear refresh token from database
      // - Log the logout activity

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
```

#### **Projects Controller**
```javascript
// src/controllers/projectController.js
const ProjectService = require('../services/ProjectService');
const { validationResult } = require('express-validator');

class ProjectController {
  constructor() {
    this.projectService = new ProjectService();
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 20, status, search, manager } = req.query;
      
      const filters = {
        company_id: req.user.company_id
      };

      // Add filters based on user role
      if (req.user.role === 'project_manager') {
        filters.project_manager_id = req.user.id;
      }

      if (status) filters.status = status;
      if (search) filters.search = search;
      if (manager) filters.project_manager_id = manager;

      const result = await this.projectService.findAll(filters, {
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });

    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      
      const project = await this.projectService.findById(id);
      
      // Check access permissions
      if (project.company_id !== req.user.company_id) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'Access denied to this project'
          }
        });
      }

      // Project managers can only access their own projects
      if (req.user.role === 'project_manager' && project.project_manager_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'Access denied to this project'
          }
        });
      }

      res.json({
        success: true,
        data: project
      });

    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: errors.array()
          }
        });
      }

      const projectData = {
        ...req.body,
        company_id: req.user.company_id
      };

      const project = await this.projectService.createProject(projectData, req.user.id);

      res.status(201).json({
        success: true,
        data: project
      });

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: errors.array()
          }
        });
      }

      const { id } = req.params;
      
      // Check access permissions
      const existingProject = await this.projectService.findById(id);
      if (existingProject.company_id !== req.user.company_id) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'Access denied to this project'
          }
        });
      }

      const project = await this.projectService.update(id, req.body);

      res.json({
        success: true,
        data: project
      });

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      // Check access permissions
      const existingProject = await this.projectService.findById(id);
      if (existingProject.company_id !== req.user.company_id) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'Access denied to this project'
          }
        });
      }

      // Only admins and co-founders can delete projects
      if (!['admin', 'co_founder'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_PERMISSIONS',
            message: 'Insufficient permissions to delete projects'
          }
        });
      }

      await this.projectService.delete(id);

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req, res, next) {
    try {
      const { id } = req.params;
      
      // Check access permissions
      const project = await this.projectService.findById(id);
      if (project.company_id !== req.user.company_id) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'Access denied to this project'
          }
        });
      }

      const dashboard = await this.projectService.getProjectDashboard(id);

      res.json({
        success: true,
        data: dashboard
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
```

---

## 🗓️ **MONTH 3: API COMPLETION & TESTING**

### **Week 1-2: Complete All CRUD Operations**

#### **Scope Items API**
```javascript
// src/routes/scopeItems.js
const express = require('express');
const router = express.Router();
const ScopeItemController = require('../controllers/scopeItemController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateScopeItem } = require('../validators/scopeItemValidators');

// All routes require authentication
router.use(authenticate);

// GET /api/v1/scope - List scope items with filtering
router.get('/', ScopeItemController.getAll);

// GET /api/v1/scope/:id - Get scope item details
router.get('/:id', ScopeItemController.getById);

// POST /api/v1/scope - Create new scope item
router.post('/', 
  authorize('admin', 'co_founder', 'project_manager'),
  validateScopeItem,
  ScopeItemController.create
);

// PUT /api/v1/scope/:id - Update scope item
router.put('/:id',
  authorize('admin', 'co_founder', 'project_manager'),
  validateScopeItem,
  ScopeItemController.update
);

// DELETE /api/v1/scope/:id - Delete scope item
router.delete('/:id',
  authorize('admin', 'co_founder'),
  ScopeItemController.delete
);

// PUT /api/v1/scope/:id/progress - Update progress
router.put('/:id/progress',
  authorize('admin', 'co_founder', 'project_manager'),
  ScopeItemController.updateProgress
);

// PUT /api/v1/scope/:id/connections - Update connections
router.put('/:id/connections',
  authorize('admin', 'co_founder', 'project_manager'),
  ScopeItemController.updateConnections
);

// GET /api/v1/scope/:id/workflow - Get workflow status
router.get('/:id/workflow', ScopeItemController.getWorkflowStatus);

module.exports = router;
```

### **Week 3-4: Testing Implementation**

#### **Integration Tests Setup**
```javascript
// tests/integration/projects.test.js
const request = require('supertest');
const app = require('../../server');
const { sequelize, Project, User, Company } = require('../../src/models');

describe('Projects API Integration Tests', () => {
  let authToken;
  let testUser;
  let testCompany;
  let testProject;

  beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: true });

    // Create test company
    testCompany = await Company.create({
      name: 'Test Company',
      email: 'test@company.com'
    });

    // Create test user
    testUser = await User.create({
      company_id: testCompany.id,
      email: 'test@example.com',
      password_hash: '$2b$12$hashedpassword',
      first_name: 'Test',
      last_name: 'User',
      role: 'project_manager'
    });

    // Get auth token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clean up projects before each test
    await Project.destroy({ where: {} });
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project successfully', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'Test Description',
        type: 'Commercial',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        budget: 100000
      };

      const response = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(projectData.name);
      expect(response.body.data.status).toBe('planning');
      expect(response.body.data.progress).toBe(0);
      expect(response.body.data.project_manager_id).toBe(testUser.id);

      // Verify default scope items were created
      const project = await Project.findByPk(response.body.data.id, {
        include: ['scope_items']
      });
      expect(project.scope_items.length).toBeGreaterThan(0);
    });

    it('should return validation errors for invalid data', async () => {
      const invalidData = {
        name: '', // Empty name
        type: 'InvalidType',
        start_date: '2024-12-31',
        end_date: '2024-01-01' // End date before start date
      };

      const response = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toBeDefined();
    });

    it('should require authentication', async () => {
      const projectData = {
        name: 'Test Project',
        type: 'Commercial'
      };

      await request(app)
        .post('/api/v1/projects')
        .send(projectData)
        .expect(401);
    });
  });

  describe('GET /api/v1/projects', () => {
    beforeEach(async () => {
      // Create test projects
      await Project.bulkCreate([
        {
          company_id: testCompany.id,
          name: 'Project 1',
          type: 'Commercial',
          status: 'active',
          project_manager_id: testUser.id
        },
        {
          company_id: testCompany.id,
          name: 'Project 2',
          type: 'Residential',
          status: 'planning',
          project_manager_id: testUser.id
        }
      ]);
    });

    it('should return paginated projects', async () => {
      const response = await request(app)
        .get('/api/v1/projects?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should filter projects by status', async () => {
      const response = await request(app)
        .get('/api/v1/projects?status=active')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('active');
    });

    it('should search projects by name', async () => {
      const response = await request(app)
        .get('/api/v1/projects?search=Project 1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Project 1');
    });
  });

  describe('PUT /api/v1/projects/:id', () => {
    let projectId;

    beforeEach(async () => {
      const project = await Project.create({
        company_id: testCompany.id,
        name: 'Original Project',
        type: 'Commercial',
        project_manager_id: testUser.id
      });
      projectId = project.id;
    });

    it('should update project successfully', async () => {
      const updateData = {
        name: 'Updated Project',
        description: 'Updated Description',
        status: 'active'
      };

      const response = await request(app)
        .put(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.status).toBe(updateData.status);
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await request(app)
        .put(`/api/v1/projects/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('GET /api/v1/projects/:id/dashboard', () => {
    let projectId;

    beforeEach(async () => {
      const project = await Project.create({
        company_id: testCompany.id,
        name: 'Dashboard Test Project',
        type: 'Commercial',
        project_manager_id: testUser.id
      });
      projectId = project.id;
    });

    it('should return project dashboard data', async () => {
      const response = await request(app)
        .get(`/api/v1/projects/${projectId}/dashboard`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.project).toBeDefined();
      expect(response.body.data.metrics).toBeDefined();
      expect(response.body.data.workflowStatus).toBeDefined();
      expect(response.body.data.recentActivity).toBeDefined();

      // Check metrics structure
      const metrics = response.body.data.metrics;
      expect(metrics.totalScopeItems).toBeDefined();
      expect(metrics.completedScopeItems).toBeDefined();
      expect(metrics.totalTasks).toBeDefined();
      expect(metrics.totalDrawings).toBeDefined();
    });
  });
});
```

#### **Unit Tests for Services**
```javascript
// tests/unit/services/ProjectService.test.js
const ProjectService = require('../../../src/services/ProjectService');
const { Project, ScopeItem } = require('../../../src/models');

// Mock the models
jest.mock('../../../src/models');

describe('ProjectService', () => {
  let projectService;
  let mockProject;

  beforeEach(() => {
    projectService = new ProjectService();
    
    mockProject = {
      id: 'project-id',
      name: 'Test Project',
      type: 'Commercial',
      status: 'planning',
      progress: 0,
      scope_items: []
    };

    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a project with default scope items', async () => {
      const projectData = {
        name: 'New Project',
        type: 'Commercial',
        description: 'Test project'
      };
      const userId = 'user-id';

      // Mock database transaction
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
      };

      Project.sequelize = {
        transaction: jest.fn().mockResolvedValue(mockTransaction)
      };

      Project.create = jest.fn().mockResolvedValue(mockProject);
      ScopeItem.create = jest.fn().mockResolvedValue({});

      const result = await projectService.createProject(projectData, userId);

      expect(Project.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...projectData,
          project_manager_id: userId,
          status: 'planning',
          progress: 0
        }),
        { transaction: mockTransaction }
      );

      expect(ScopeItem.create).toHaveBeenCalledTimes(12); // 4 groups * 3 items each
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(result).toEqual(mockProject);
    });

    it('should rollback transaction on error', async () => {
      const projectData = {
        name: 'New Project',
        type: 'Commercial'
      };
      const userId = 'user-id';

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
      };

      Project.sequelize = {
        transaction: jest.fn().mockResolvedValue(mockTransaction)
      };

      Project.create = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(projectService.createProject(projectData, userId))
        .rejects.toThrow('Database error');

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
    });
  });

  describe('calculateProjectMetrics', () => {
    it('should calculate correct metrics for project with data', () => {
      const projectWithData = {
        ...mockProject,
        scope_items: [
          { status: 'completed', progress: 100 },
          { status: 'in_progress', progress: 50 },
          { status: 'pending', progress: 0 }
        ],
        tasks: [
          { status: 'completed', due_date: '2024-01-01' },
          { status: 'pending', due_date: '2023-12-01' } // Overdue
        ],
        shop_drawings: [
          { approval_status: 'approved' },
          { approval_status: 'pending' }
        ],
        material_specifications: [
          { procurement_status: 'delivered' },
          { procurement_status: 'pending' }
        ]
      };

      const metrics = projectService.calculateProjectMetrics(projectWithData);

      expect(metrics.totalScopeItems).toBe(3);
      expect(metrics.completedScopeItems).toBe(1);
      expect(metrics.scopeProgress).toBe(50); // (100 + 50 + 0) / 3 = 50
      expect(metrics.totalTasks).toBe(2);
      expect(metrics.completedTasks).toBe(1);
      expect(metrics.overdueTasks).toBe(1);
      expect(metrics.totalDrawings).toBe(2);
      expect(metrics.approvedDrawings).toBe(1);
      expect(metrics.totalMaterials).toBe(2);
      expect(metrics.deliveredMaterials).toBe(1);
    });

    it('should handle empty project data', () => {
      const metrics = projectService.calculateProjectMetrics(mockProject);

      expect(metrics.totalScopeItems).toBe(0);
      expect(metrics.completedScopeItems).toBe(0);
      expect(metrics.scopeProgress).toBe(0);
      expect(metrics.totalTasks).toBe(0);
      expect(metrics.completedTasks).toBe(0);
    });
  });

  describe('validateProjectData', () => {
    it('should pass validation for valid data', () => {
      const validData = {
        name: 'Valid Project',
        type: 'Commercial',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        budget: 100000
      };

      expect(() => {
        projectService.validateProjectData(validData);
      }).not.toThrow();
    });

    it('should throw error for missing required fields', () => {
      const invalidData = {
        description: 'Missing name and type'
      };

      expect(() => {
        projectService.validateProjectData(invalidData);
      }).toThrow('name is required');
    });

    it('should throw error for invalid date range', () => {
      const invalidData = {
        name: 'Test Project',
        type: 'Commercial',
        start_date: '2024-12-31',
        end_date: '2024-01-01'
      };

      expect(() => {
        projectService.validateProjectData(invalidData);
      }).toThrow('End date must be after start date');
    });

    it('should throw error for negative budget', () => {
      const invalidData = {
        name: 'Test Project',
        type: 'Commercial',
        budget: -1000
      };

      expect(() => {
        projectService.validateProjectData(invalidData);
      }).toThrow('Budget must be positive');
    });
  });
});
```

---

## 🔧 **VALIDATION & TESTING**

### **Phase 1 Completion Checklist**

#### **Database & Models ✅**
```bash
# Verify all models are working
npm run db:migrate
npm run db:seed
npm run test:models

# Check database structure
psql -U formula_admin -d formula_pm_dev -c "\dt"
# Should show: companies, users, clients, projects, scope_items, shop_drawings, material_specifications, tasks, reports, report_sections, report_lines, report_images, audit_logs
```

#### **API Endpoints ✅**
```bash
# Test all API endpoints
npm run test:integration

# Manual API testing
curl -X GET http://localhost:5014/api/v1/health
curl -X POST http://localhost:5014/api/v1/auth/login -d '{"email":"test@example.com","password":"password123"}'
```

#### **Frontend Integration ✅**
```bash
# Start both servers and test integration
npm run dev:full

# Verify frontend can:
# - Login with new authentication system
# - Load projects from PostgreSQL
# - Create/edit projects with new API
# - Display scope items, drawings, materials, tasks
# - Show real-time updates via Socket.IO
```

#### **Data Migration ✅**
```bash
# Run complete data migration
node scripts/migrate-json-to-postgres.js

# Verify data integrity
npm run test:migration
```

---

## 🎯 **PHASE 1 SUCCESS CRITERIA**

### **Technical Deliverables**
- ✅ PostgreSQL database with 13+ tables and proper relationships
- ✅ Complete Sequelize models with associations and validations
- ✅ Comprehensive REST API with 40+ endpoints
- ✅ JWT authentication with role-based authorization
- ✅ Data migration scripts that preserve all existing data
- ✅ Integration tests with >70% coverage
- ✅ Socket.IO real-time features operational

### **Business Deliverables**
- ✅ All 88+ Formula PM features preserved and functional
- ✅ Smart @ Mentions system working with database
- ✅ Advanced reporting system with line-by-line architecture
- ✅ Workflow engine (scope → drawings → materials) operational
- ✅ Real-time collaboration features maintained
- ✅ Multi-role access control implemented

### **Performance Improvements**
- ✅ 80% faster data loading (vs JSON file system)
- ✅ Concurrent user support (vs single file access)
- ✅ Advanced search capabilities with full-text search
- ✅ Pagination for large datasets
- ✅ Database indexes for optimal query performance

---

## 🚀 **NEXT STEPS: PREPARING FOR PHASE 2**

With Phase 1 complete, Formula PM will have:
- Enterprise-grade PostgreSQL database
- Production-ready REST API
- Preserved functionality with enhanced performance
- Foundation for advanced enterprise features

**Phase 2 will focus on:**
- Enhanced authentication with MFA and SSO
- Advanced security hardening
- Comprehensive audit trails
- Production deployment preparation
- Advanced caching with Redis

The solid foundation established in Phase 1 ensures Phase 2 development can proceed smoothly with enterprise-grade security and scalability features.