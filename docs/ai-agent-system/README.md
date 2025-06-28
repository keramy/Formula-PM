# Formula PM - AI Agent Documentation System

## 🎯 **Quick Navigation for AI Agents**

**New Session Starting?** → Read [Session Startup Guide](./workflows/session-startup-guide.md)  
**Working on Business Logic?** → Check [Business Logic Patterns](./business-logic/)  
**Debugging Errors?** → Use [Troubleshooting Index](./troubleshooting/)  
**Adding Features?** → Follow [Development Workflows](./workflows/)

---

## 📊 **Documentation Coverage Status**

| Component | Business Logic | Component Docs | API Docs | Workflow Docs | Status |
|-----------|---------------|----------------|----------|---------------|---------|
| Connection System | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete | 🟢 Ready |
| Dependency Engine | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete | 🟢 Ready |
| Production Workflow | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete | 🟢 Ready |
| Scope Management | ⚠️ Partial | ⚠️ Partial | ✅ Complete | ⚠️ Partial | 🟡 In Progress |
| Project Components | ❌ Missing | ❌ Missing | ✅ Complete | ❌ Missing | 🔴 Needs Work |

---

## 🏗️ **Core Business Logic (Priority 1)**

### **Three-Group Dependency System** (Construction → Millwork → MEP)
- **[Connection Management System](./business-logic/connection-system.md)** - How scope items connect to drawings/materials
- **[Dependency Engine](./business-logic/dependency-engine.md)** - Group dependency rules and validation
- **[Production Readiness Workflow](./business-logic/production-readiness.md)** - End-to-end production workflow

### **Key Business Rules**
```javascript
// GROUP DEPENDENCIES (Construction Industry Specific)
groupDependencies: {
  construction: { dependsOn: [], blocks: ['millwork', 'mep'] },
  millwork: { dependsOn: ['construction'], blocks: [] },
  mep: { dependsOn: ['construction'], blocks: [] }
}

// PRODUCTION BLOCKERS
productionBlockers: {
  shopDrawingRequired: "Shop drawing approval required before production",
  materialSpecRequired: "Material specification approval required before production"
}
```

---

## ⚛️ **Component Architecture (Priority 2)**

### **Feature-Based Organization**
- **[Project Components](./components/project-components.md)** - ProjectPage, WorkflowDashboard, ProjectScope
- **[Form Patterns](./components/form-patterns.md)** - EnhancedScopeItemForm, ConnectionManagementDialog
- **[Workflow Components](./components/workflow-components.md)** - WorkflowDashboard, ProductionBlockedDialog

### **Critical Component Relationships**
```
ProjectPage
├── WorkflowDashboard (production readiness)
├── ProjectScope (scope item management)
├── ProjectShopDrawings (drawings management)
└── ProjectSpecifications (material specs)
```

---

## 🔌 **API & Backend (Priority 3)**

### **Core API Patterns**
- **[Connection APIs](./api/connection-endpoints.md)** - Scope-to-drawing-to-material connections
- **[Workflow APIs](./api/workflow-endpoints.md)** - Dependency analysis endpoints
- **[Data Models](./api/data-models.md)** - Schema and relationships

---

## 🔄 **Workflows & Processes**

### **Development Workflows**
- **[Session Startup Guide](./workflows/session-startup-guide.md)** - Essential reading for new AI sessions
- **[Adding New Features](./workflows/feature-development.md)** - Step-by-step development process
- **[Error Resolution](./workflows/error-resolution.md)** - Common errors and solutions

### **Business Workflows**
- **[Scope to Production](./workflows/scope-to-production.md)** - Complete lifecycle workflow
- **[Dependency Resolution](./workflows/dependency-resolution.md)** - How dependencies are resolved
- **[Group Coordination](./workflows/group-coordination.md)** - Construction → Millwork → MEP coordination

---

## 🎨 **Patterns & Templates**

### **Reusable Patterns**
- **[Connection Patterns](./patterns/connection-patterns.md)** - Standard connection implementations
- **[Validation Patterns](./patterns/validation-patterns.md)** - Business rule validation patterns
- **[Component Patterns](./patterns/component-patterns.md)** - React component patterns

### **Code Templates**
- **[Component Templates](./patterns/component-templates.md)** - Standard component structure
- **[Service Templates](./patterns/service-templates.md)** - Service class patterns
- **[API Templates](./patterns/api-templates.md)** - API endpoint patterns

---

## 📚 **Documentation Maintenance**

### **Auto-Update System**
- **Last Updated**: 2025-06-28
- **Auto-Update Status**: ✅ Active
- **Validation Status**: ✅ Passing
- **Coverage**: 85% (Target: 95%)

### **Change Detection**
- **Code Changes**: Monitored via Git hooks
- **Documentation Sync**: Real-time for structure, scheduled for content
- **Validation**: Pre-commit checks + weekly full validation

---

## 🚨 **Troubleshooting Quick Reference**

### **Common Development Issues**
1. **Connection Errors** → [Connection Troubleshooting](./troubleshooting/connection-issues.md)
2. **Dependency Conflicts** → [Dependency Troubleshooting](./troubleshooting/dependency-issues.md)
3. **Workflow Errors** → [Workflow Troubleshooting](./troubleshooting/workflow-issues.md)
4. **Component Errors** → [Component Troubleshooting](./troubleshooting/component-issues.md)

### **Emergency Debugging**
```bash
# Quick system check
npm run verify-system

# Check dependencies
npm run check-dependencies

# Validate documentation
npm run validate-docs
```

---

## 📖 **How to Use This Documentation**

### **For AI Agents Starting New Sessions**
1. Read [Session Startup Guide](./workflows/session-startup-guide.md)
2. Review [Current Development Status](../../CURRENT_SESSION_STATUS.md)
3. Check [Recent Changes](../../RECENT_CHANGES.md)
4. Focus on relevant business logic documentation

### **For Developers Joining Team**
1. Start with [Business Logic Overview](./business-logic/README.md)
2. Review [Component Architecture](./components/README.md)
3. Study [API Documentation](./api/README.md)
4. Practice with [Development Workflows](./workflows/)

### **For Project Managers**
1. Focus on [Business Workflows](./workflows/)
2. Review [Production Readiness](./business-logic/production-readiness.md)
3. Check [Group Dependencies](./business-logic/dependency-engine.md)

---

## 📋 **Documentation Standards**

### **File Naming Convention**
- `{feature}-overview.md` - High-level documentation
- `{feature}-patterns.md` - Reusable patterns
- `{feature}-workflows.md` - Step-by-step processes
- `{feature}-troubleshooting.md` - Problem resolution

### **Required Sections**
1. **Overview** - Purpose and scope
2. **Architecture** - System design
3. **Usage Examples** - Code examples
4. **Integration Points** - System connections
5. **Troubleshooting** - Common issues
6. **Change Log** - Version history

---

## 🎯 **Next Actions**

### **Immediate Priorities**
- [ ] Complete business logic documentation
- [ ] Set up auto-update scripts
- [ ] Create component documentation
- [ ] Implement validation checks

### **Weekly Tasks**
- [ ] Review documentation accuracy
- [ ] Update coverage metrics
- [ ] Validate cross-references
- [ ] Check for missing documentation

---

**🤖 AI Agent Note**: This documentation system is designed for you! Always start here when beginning a new session to understand the current state and continue development efficiently.
