# AI Agent Session Startup Guide

## 🚀 Essential Reading for New AI Sessions

**CRITICAL**: Always read this guide when starting a new Formula PM development session to avoid errors and understand the current system state.

## Quick System Overview

Formula PM is an **enterprise construction/millwork project management system** with unique business logic:

### **Key Differentiators**
1. **Three-Group Dependency System**: Construction → Millwork → MEP
2. **Connection Management**: Scope Items ↔ Shop Drawings ↔ Material Specifications  
3. **Production Readiness Engine**: Industry-specific approval workflows

### **Technology Stack**
- **Frontend**: React 19 + Material-UI v6 (Port 3000)
- **Backend**: Node.js + Express (Port 5001) 
- **Architecture**: Feature-based organization
- **State**: React Context + custom hooks

## 📂 Critical File Locations

### **Core Business Logic** (READ FIRST)
```
src/services/connectionService.js          # Core connection/dependency logic
src/features/projects/components/
├── WorkflowDashboard.jsx                  # Production readiness UI
├── ProjectScope.jsx                       # Scope management
├── ConnectionManagementDialog.jsx         # Connection UI
└── EnhancedProjectDetailPage.jsx          # Main project page
```

### **Backend Services**
```
formula-backend/
├── server.js                             # Main server
├── routes/                               # API endpoints  
├── data/                                 # JSON data storage
└── database.js                          # Database service
```

### **Documentation System** (NEW)
```
docs/ai-agent-system/
├── README.md                             # Master index
├── business-logic/                       # Business rules documentation
├── workflows/                            # Development processes
└── troubleshooting/                      # Error resolution
```

## 🔧 Development Setup Verification

### **1. Check Server Status**
```bash
# Quick verification
cd formula-pm
npm run verify-system

# Manual check
cd formula-backend && npm start  # Port 5001
cd formula-project-app && npm start  # Port 3000
```

### **2. Test Core Functionality**
```bash
# API health check
curl http://localhost:5001/api/health

# Test connection service
node quick-verification.js
```

### **3. Check Current Session Status**
```bash
# Review current development status
cat CURRENT_SESSION_STATUS.md
cat RECENT_CHANGES.md
```

## 🏗️ Understanding the Business Logic

### **Connection System** (CRITICAL)
The connection system is what makes Formula PM unique. Always understand these patterns:

```javascript
// Core pattern: Scope Item connections
scopeItem ←→ shopDrawing ←→ materialSpecification

// Production readiness depends on:
1. Required connections exist
2. Connected items are approved
3. Group dependencies satisfied
```

### **Three-Group Dependencies** (CRITICAL)
```javascript
// Industry-standard workflow
Construction (Foundation) → Millwork + MEP (Parallel)

// Code implementation:
groupDependencies: {
  construction: { dependsOn: [], blocks: ['millwork', 'mep'] },
  millwork: { dependsOn: ['construction'], blocks: [] },
  mep: { dependsOn: ['construction'], blocks: [] }
}
```

### **Production Blockers** (CRITICAL)
```javascript
// What blocks production:
1. Missing shop drawing (for millwork/custom items)
2. Unapproved shop drawing  
3. Missing material specification
4. Unapproved material specification
5. Group dependency violations
```

## 🎯 Common Development Tasks

### **Adding New Features**
1. **Read relevant business logic docs first**
2. **Check component patterns** in `/docs/ai-agent-system/components/`
3. **Follow existing patterns** - don't reinvent
4. **Test connection/dependency logic** thoroughly

### **Debugging Workflow Issues**
1. **Check connection service state**: `connectionService.connections`
2. **Verify dependency analysis**: Call `analyzeDependencies()`
3. **Review component integration**: Check props/state flow
4. **Validate business rules**: Ensure rules match industry standards

### **Component Development**
1. **Follow feature-based organization**: Place in correct `/features/` folder
2. **Use existing patterns**: Check similar components first
3. **Integration testing**: Test with connection system
4. **Material-UI consistency**: Follow existing design patterns

## ⚠️ Critical Errors to Avoid

### **Business Logic Errors**
```javascript
// DON'T: Bypass dependency checking
scopeItem.canStartProduction = true; // Wrong!

// DO: Use dependency engine
const analysis = connectionService.analyzeScopeItemDependencies(scopeItem);
scopeItem.canStartProduction = !analysis.isBlocked;
```

### **Connection System Errors**
```javascript
// DON'T: Direct state manipulation
connections[scopeId] = drawingId; // Wrong!

// DO: Use connection service
connectionService.connectScopeToDrawing(scopeId, drawingId, notes);
```

### **Group Dependency Errors**
```javascript
// DON'T: Allow millwork to start before construction
if (millworkGroup.progress > 0 && constructionGroup.progress < 75) {
  // This violates industry standards!
}

// DO: Check group dependencies
const groupAnalysis = connectionService.analyzeGroupDependencies(scopeItems);
if (!groupAnalysis.millwork.canStart) {
  // Handle dependency violation
}
```

## 🔍 Debugging Commands

### **Connection System Debug**
```javascript
// In browser console
console.log('Connections:', connectionService.connections);
console.log('Connection for scope 123:', connectionService.getConnections('scope', '123'));

// Check dependency analysis
const analysis = connectionService.analyzeScopeItemDependencies(scopeItem, drawings, specs);
console.log('Analysis:', analysis);
```

### **Component State Debug**
```javascript
// Check React component state
console.log('Component state:', component.state);
console.log('Props:', component.props);

// Check context values
console.log('Auth context:', useAuth());
console.log('Data context:', useData());
```

### **Backend Debug**
```bash
# Check server logs
tail -f formula-backend/server.log

# Test API endpoints
curl -X GET http://localhost:5001/api/projects/123/scope
curl -X GET http://localhost:5001/api/projects/123/workflow
```

## 📋 Session Checklist

### **Before Starting Development**
- [ ] Read this startup guide
- [ ] Check `CURRENT_SESSION_STATUS.md`
- [ ] Review `RECENT_CHANGES.md`
- [ ] Verify servers are running
- [ ] Test core functionality
- [ ] Review relevant business logic docs

### **During Development**
- [ ] Follow existing patterns
- [ ] Test connection system integration
- [ ] Validate dependency rules
- [ ] Check component integration
- [ ] Update documentation if needed

### **Before Ending Session**
- [ ] Update `CURRENT_SESSION_STATUS.md`
- [ ] Document any new patterns
- [ ] Test full workflow
- [ ] Generate documentation: `npm run docs:generate`
- [ ] Tell user: "Documentation updated - please review and commit manually"
- [ ] Update `RECENT_CHANGES.md`

## 🎨 Development Patterns

### **Component Pattern**
```javascript
// Standard Formula PM component structure
import React, { useState, useEffect } from 'react';
import { Material-UI components } from '@mui/material';
import connectionService from '../../../services/connectionService';

const ComponentName = ({ project, scopeItems, onUpdate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load data with error handling
  useEffect(() => {
    loadData();
  }, [project.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await connectionService.getWorkflowStatusAsync(project.id);
      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user actions
  const handleAction = async () => {
    try {
      // Perform action using connection service
      await connectionService.performAction();
      // Update parent component
      onUpdate();
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  return (
    // Material-UI JSX
  );
};

export default ComponentName;
```

### **Service Integration Pattern**
```javascript
// Always use connection service for business logic
import connectionService from '../services/connectionService';

// Check dependencies before actions
const canProceed = async (scopeItem) => {
  const analysis = connectionService.analyzeScopeItemDependencies(
    scopeItem, shopDrawings, materialSpecs
  );
  
  if (analysis.isBlocked) {
    throw new Error(`Cannot proceed: ${analysis.blockers.map(b => b.message).join(', ')}`);
  }
  
  return true;
};
```

## 📚 Quick Reference Links

### **Documentation**
- [Master Index](../README.md)
- [Connection System](../business-logic/connection-system.md)
- [Dependency Engine](../business-logic/dependency-engine.md)
- [Production Workflow](../business-logic/production-readiness.md)

### **Component Patterns**
- [Project Components](../components/project-components.md)
- [Workflow Components](../components/workflow-components.md)
- [Form Patterns](../components/form-patterns.md)

### **API Reference**
- [Connection APIs](../api/connection-endpoints.md)
- [Workflow APIs](../api/workflow-endpoints.md)
- [Data Models](../api/data-models.md)

## 🚨 Emergency Contacts

### **If System is Broken**
1. Check server status: `npm run verify-system`
2. Review error logs: `tail -f formula-backend/server.log`
3. Reset to last working state: Check git history
4. Consult troubleshooting docs: `/docs/ai-agent-system/troubleshooting/`

### **If Business Logic is Unclear**
1. Read business logic documentation first
2. Check existing code patterns
3. Test with small examples
4. Validate against industry standards

---

**🤖 AI Agent Note**: This guide is your starting point for every session. Formula PM's uniqueness lies in its construction industry business logic - always understand the connection system and group dependencies before making changes!

**IMPORTANT**: This project uses MANUAL Git control. Generate documentation with `npm run docs:generate` but let the user review and commit manually. See [Manual Git Workflow](./manual-git-workflow.md) for details.

**Next Steps**: After reading this guide, proceed to the specific documentation relevant to your current task.