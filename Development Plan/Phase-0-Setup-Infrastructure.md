# Formula PM - Phase 0: Development Setup & Infrastructure

**Duration**: 3 weeks  
**Priority**: Critical - Must complete before other phases  
**Objective**: Establish enterprise-grade development environment and infrastructure foundation

---

## 📋 **PHASE 0 OVERVIEW**

This phase transforms the current Formula PM prototype development environment into an enterprise-ready infrastructure. We'll migrate from JSON file storage to PostgreSQL while preserving all existing functionality.

### **Success Criteria**
- ✅ PostgreSQL database operational with all Formula PM entities
- ✅ Enterprise development environment configured  
- ✅ Data migration scripts working
- ✅ All existing frontend features functional with new backend
- ✅ Testing infrastructure established
- ✅ Development workflow optimized

---

## 🗓️ **WEEK 1: DEVELOPMENT ENVIRONMENT SETUP**

### **Day 1-2: PostgreSQL Installation & Configuration**

#### **Prerequisites Check**
```bash
# Verify current environment
node --version    # Should be 16+ (currently using Node 18+)
npm --version     # Should be 8+
git --version     # Should be 2.30+

# Check current Formula PM setup
cd /mnt/c/Users/Kerem/Desktop/formula-pm
ls -la            # Verify both formula-backend and formula-project-app exist
```

#### **PostgreSQL Installation (Windows/WSL2)**

**Option 1: Windows Native PostgreSQL**
```bash
# Download PostgreSQL 15+ from https://www.postgresql.org/download/windows/
# During installation:
# - Username: postgres
# - Password: [create secure password]
# - Port: 5432 (default)
# - Locale: English, United States

# Verify installation from WSL2
psql --version
```

**Option 2: WSL2 PostgreSQL (Recommended for Formula PM)**
```bash
# Update WSL2 package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo service postgresql start

# Switch to postgres user and create database user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE USER formula_admin WITH PASSWORD 'Formula2024!';
CREATE DATABASE formula_pm_dev OWNER formula_admin;
CREATE DATABASE formula_pm_test OWNER formula_admin;
ALTER USER formula_admin CREATEDB;
\q
```

#### **Database Connection Testing**
```bash
# Test connection
psql -h localhost -U formula_admin -d formula_pm_dev

# Should connect successfully
# Type \q to exit
```

### **Day 3-4: Development Tools Installation**

#### **Backend Development Tools**
```bash
cd formula-backend

# Core database dependencies
npm install pg pg-hstore sequelize sequelize-cli
npm install --save-dev @types/pg

# Authentication & security
npm install bcrypt jsonwebtoken joi
npm install --save-dev @types/bcrypt @types/jsonwebtoken

# Development tools
npm install --save-dev nodemon jest supertest
npm install --save-dev eslint prettier husky lint-staged

# Additional enterprise dependencies
npm install helmet express-rate-limit xss
npm install winston morgan compression
```

#### **Database Management Tools**
```bash
# Install Sequelize CLI globally
npm install -g sequelize-cli

# Verify installation
sequelize --version
```

#### **Code Quality Setup**
```bash
# ESLint configuration for Formula PM
npx eslint --init
# Choose:
# - To check syntax, find problems, and enforce code style
# - JavaScript modules (import/export)
# - Node.js (not browser)
# - Use a popular style guide
# - Standard
# - JavaScript format

# Prettier configuration
echo '{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}' > .prettierrc

# Husky for git hooks
npx husky install
npx husky add .husky/pre-commit "lint-staged"
```

### **Day 5-7: Environment Configuration**

#### **Environment Files Setup**
```bash
# Create environment files
cd formula-backend
touch .env.development .env.test .env.production .env.example

# Update .gitignore
echo "
# Environment files
.env*
!.env.example

# Database
*.db
*.sqlite

# Logs
logs/
*.log

# Coverage
coverage/
.nyc_output/
" >> .gitignore
```

#### **.env.development Configuration**
```bash
# .env.development
NODE_ENV=development
PORT=5014

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=formula_pm_dev
DB_USER=formula_admin
DB_PASS=Formula2024!
DB_DIALECT=postgres

# JWT Configuration
JWT_SECRET=formula-pm-super-secret-jwt-key-for-development-2024
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=formula-pm-refresh-secret-key-2024
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (for future phases)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# Redis Configuration (for future phases)
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend URL
FRONTEND_URL=http://localhost:3003

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### **.env.test Configuration**
```bash
# .env.test
NODE_ENV=test
PORT=5015

# Test Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=formula_pm_test
DB_USER=formula_admin
DB_PASS=Formula2024!
DB_DIALECT=postgres

# Test JWT (less secure for faster tests)
JWT_SECRET=test-jwt-secret-for-testing-only
JWT_EXPIRES_IN=1h
BCRYPT_ROUNDS=4
```

#### **Database Connection Module**
```javascript
// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = sequelize;
```

---

## 🗓️ **WEEK 2: PROJECT STRUCTURE REORGANIZATION**

### **Day 1-3: Backend Restructure**

#### **New Backend Structure**
```bash
# Create new backend structure
cd formula-backend
mkdir -p src/{config,controllers,middleware,models,routes,services,utils,validators}
mkdir -p tests/{unit,integration,fixtures}
mkdir -p migrations seeders docs
```

#### **Project Structure Layout**
```
formula-backend/
├── src/
│   ├── config/          # Database, environment config
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── email.js
│   ├── controllers/     # Route handlers
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── teamController.js
│   ├── middleware/      # Authentication, validation
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── security.js
│   ├── models/          # Database models (Sequelize)
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── TeamMember.js
│   ├── routes/          # API routes
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── services/        # Business logic
│   │   ├── authService.js
│   │   ├── projectService.js
│   │   ├── emailService.js
│   │   └── migrationService.js
│   ├── utils/           # Helper functions
│   │   ├── logger.js
│   │   ├── validators.js
│   │   └── helpers.js
│   └── validators/      # Input validation schemas
│       ├── authValidators.js
│       ├── projectValidators.js
│       └── taskValidators.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── migrations/          # Database migrations
├── seeders/            # Database seed data
├── docs/               # API documentation
├── uploads/            # File uploads (temporary)
└── server.js           # Main server file
```

#### **Database Configuration Setup**
```javascript
// src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, testConnection };
```

### **Day 4-5: Sequelize Initialization**

#### **Initialize Sequelize**
```bash
cd formula-backend

# Initialize Sequelize (creates config/config.json)
npx sequelize-cli init

# Remove default config and use our custom config
rm config/config.json
```

#### **Custom Sequelize Config**
```javascript
// config/config.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: console.log,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
```

### **Day 6-7: Development Scripts Setup**

#### **Package.json Scripts Update**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    
    "db:create": "npx sequelize-cli db:create",
    "db:drop": "npx sequelize-cli db:drop",
    "db:migrate": "npx sequelize-cli db:migrate",
    "db:migrate:undo": "npx sequelize-cli db:migrate:undo",
    "db:seed": "npx sequelize-cli db:seed:all",
    "db:seed:undo": "npx sequelize-cli db:seed:undo:all",
    "db:reset": "npm run db:migrate:undo:all && npm run db:migrate && npm run db:seed",
    
    "migration:create": "npx sequelize-cli migration:generate --name",
    "seed:create": "npx sequelize-cli seed:generate --name",
    
    "lint": "eslint src/ --ext .js",
    "lint:fix": "eslint src/ --ext .js --fix",
    "format": "prettier --write src/**/*.js",
    
    "dev:full": "concurrently \"npm run dev\" \"cd ../formula-project-app && npm start\"",
    "setup": "npm install && npm run db:create && npm run db:migrate && npm run db:seed"
  }
}
```

---

## 🗓️ **WEEK 3: BASIC INFRASTRUCTURE SETUP**

### **Day 1-3: Database Schema Design**

#### **Core Entity Models**

**Companies Model**
```bash
# Create migration for companies
npx sequelize-cli migration:generate --name create-companies
```

```javascript
// migrations/001-create-companies.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('companies', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(20),
      },
      address: {
        type: Sequelize.TEXT,
      },
      website: {
        type: Sequelize.STRING(255),
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add indexes
    await queryInterface.addIndex('companies', ['email']);
    await queryInterface.addIndex('companies', ['is_active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('companies');
  },
};
```

**Users Model**
```bash
npx sequelize-cli migration:generate --name create-users
```

```javascript
// migrations/002-create-users.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'co_founder', 'project_manager', 'user'),
        defaultValue: 'user',
      },
      phone: {
        type: Sequelize.STRING(20),
      },
      avatar_url: {
        type: Sequelize.STRING(500),
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      last_login_at: {
        type: Sequelize.DATE,
      },
      email_verified_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add indexes
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['company_id']);
    await queryInterface.addIndex('users', ['role']);
    await queryInterface.addIndex('users', ['is_active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};
```

### **Day 4-5: Data Migration Scripts**

#### **Migration Service for JSON Data**
```javascript
// src/services/migrationService.js
const fs = require('fs').promises;
const path = require('path');
const { sequelize } = require('../config/database');
const models = require('../models');

class MigrationService {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data');
  }

  async readJSONFile(filename) {
    try {
      const filePath = path.join(this.dataPath, filename);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  async migrateCompanies() {
    // Create Formula International company
    const company = await models.Company.findOrCreate({
      where: { email: 'info@formulainternational.com' },
      defaults: {
        name: 'Formula International',
        email: 'info@formulainternational.com',
        phone: '+90 212 XXX XXXX',
        address: 'Istanbul, Turkey',
        website: 'https://formulainternational.com',
        is_active: true,
      },
    });

    return company[0];
  }

  async migrateTeamMembers(company) {
    const teamMembers = await this.readJSONFile('teamMembers.json');
    const users = [];

    for (const member of teamMembers) {
      // Hash password (for demo purposes, use member name + "123")
      const bcrypt = require('bcrypt');
      const password = `${member.firstName.toLowerCase()}123`;
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await models.User.findOrCreate({
        where: { email: member.email },
        defaults: {
          company_id: company.id,
          email: member.email,
          password_hash: passwordHash,
          first_name: member.firstName,
          last_name: member.lastName,
          role: this.mapRole(member.role),
          phone: member.phone || null,
          is_active: member.status === 'active',
        },
      });

      users.push(user[0]);
    }

    return users;
  }

  mapRole(oldRole) {
    const roleMapping = {
      'Admin': 'admin',
      'Co-founder': 'co_founder',
      'Project Manager': 'project_manager',
      'Senior Project Manager': 'project_manager',
      'Design Lead': 'user',
      'MEP Engineer': 'user',
      'Procurement Specialist': 'user',
      'Construction Manager': 'user',
      'Quality Control Specialist': 'user',
      'Site Supervisor': 'user',
      'CAD Specialist': 'user',
      'Business Development': 'user',
    };

    return roleMapping[oldRole] || 'user';
  }

  async migrateAllData() {
    try {
      console.log('🚀 Starting data migration...');

      // Create transaction
      const transaction = await sequelize.transaction();

      try {
        // 1. Migrate company
        console.log('📊 Migrating company data...');
        const company = await this.migrateCompanies();

        // 2. Migrate team members
        console.log('👥 Migrating team members...');
        const users = await this.migrateTeamMembers(company);

        // 3. Migrate projects (placeholder - will be implemented in Phase 1)
        console.log('📁 Projects migration will be implemented in Phase 1...');

        await transaction.commit();
        console.log('✅ Data migration completed successfully!');

        return { company, users };
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('❌ Data migration failed:', error);
      throw error;
    }
  }
}

module.exports = MigrationService;
```

### **Day 6-7: Testing Infrastructure**

#### **Jest Configuration**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/migrations/**',
    '!src/seeders/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
```

#### **Test Setup File**
```javascript
// tests/setup.js
const { sequelize } = require('../src/config/database');

beforeAll(async () => {
  // Connect to test database
  await sequelize.authenticate();
  
  // Run migrations
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
});

// Global test helpers
global.createTestUser = async (overrides = {}) => {
  const User = require('../src/models/User');
  return await User.create({
    email: 'test@example.com',
    password_hash: 'hashedpassword',
    first_name: 'Test',
    last_name: 'User',
    company_id: 'test-company-id',
    ...overrides,
  });
};
```

---

## 🔧 **VALIDATION & TESTING**

### **Week 3 Validation Checklist**

#### **Database Validation**
```bash
# Test database connection
npm run test:db

# Run migrations
npm run db:migrate

# Verify tables were created
psql -U formula_admin -d formula_pm_dev -c "\dt"

# Should show: companies, users, and SequelizeMeta tables
```

#### **Development Environment Validation**
```bash
# Start development server
npm run dev

# Should see:
# ✅ Database connection established
# 🚀 Server running on port 5014
# 📊 Environment: development
```

#### **Data Migration Validation**
```bash
# Run migration script
node scripts/migrate-data.js

# Check data was migrated
psql -U formula_admin -d formula_pm_dev
SELECT COUNT(*) FROM companies;  -- Should return 1
SELECT COUNT(*) FROM users;      -- Should return 14 (Formula team)
```

#### **Frontend Integration Test**
```bash
# Start both servers
npm run dev:full

# Frontend should load on http://localhost:3003
# Backend API should respond on http://localhost:5014/api/health
```

---

## 🚨 **TROUBLESHOOTING GUIDE**

### **Common Issues & Solutions**

#### **PostgreSQL Connection Issues**
```bash
# Issue: Connection refused
# Solution: Start PostgreSQL service
sudo service postgresql start

# Issue: Authentication failed
# Solution: Reset password
sudo -u postgres psql
ALTER USER formula_admin PASSWORD 'Formula2024!';
```

#### **Migration Errors**
```bash
# Issue: Migration already exists
# Solution: Reset migrations
npm run db:migrate:undo:all
npm run db:migrate

# Issue: Sequelize Meta table errors
# Solution: Drop and recreate database
npm run db:drop
npm run db:create
npm run db:migrate
```

#### **Node.js Module Issues**
```bash
# Issue: Module not found
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Issue: Permission errors
# Solution: Fix npm permissions
npm config set unsafe-perm true
```

---

## 🎯 **PHASE 0 COMPLETION CRITERIA**

### **Must-Have Deliverables**
- ✅ PostgreSQL database running with all tables created
- ✅ Environment configuration working (.env files)
- ✅ Basic authentication model structure in place
- ✅ Data migration scripts functional
- ✅ Development workflow scripts operational
- ✅ Basic testing infrastructure established

### **Success Validation**
```bash
# Run complete validation
npm run setup
npm run test
npm run dev

# All should complete without errors
```

### **Documentation Requirements**
- ✅ Environment setup documented
- ✅ Database schema documented
- ✅ Development workflow documented
- ✅ Troubleshooting guide created

---

## 🚀 **NEXT STEPS: PREPARING FOR PHASE 1**

With Phase 0 complete, you'll have:
- Enterprise-grade development environment
- PostgreSQL database with proper schema
- Data migration capability
- Testing infrastructure foundation
- Development workflow optimization

**Phase 1 will focus on:**
- Complete backend API rebuild with Sequelize
- Authentication system implementation
- Frontend integration with new backend
- Comprehensive testing implementation

The foundation established in Phase 0 ensures Phase 1 development can proceed smoothly with enterprise-grade infrastructure supporting all development activities.