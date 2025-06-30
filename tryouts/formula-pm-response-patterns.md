# Formula PM Response Pattern Examples

## Example 1: Real-time Notifications System

**User:** "Add real-time notifications to the project dashboard with toast notifications and notification center"

**Coordinator Response:**
```
Implementing real-time notification system for Formula PM.

DEPENDENCY ANALYSIS:
- Core Dependencies: notification_service (backend WebSocket foundation)
- Dependent Tasks: notification_ui, notification_center (need service first)
- Independent Tasks: toast_component (can build UI component in parallel)

EXECUTION STRATEGY:
**WAVE 1 (Spawn FIRST - Core Dependencies):**
  1. notification_service: Backend Socket.IO service with Prisma integration → SPAWN IMMEDIATELY
  2. toast_component: React toast UI component with iconoir icons → SPAWN PARALLEL

**WAVE 2 (Spawn AFTER Wave 1 Approved):**
  3. notification_ui: Dashboard integration with real-time updates → WAIT FOR #1,#2 APPROVAL
  4. notification_center: Full notification center page → WAIT FOR #1 APPROVAL

Spawning Wave 1 tasks now. Wave 2 will wait for service approval...

[After Wave 1 completion and evaluation]

## 📋 TASK EVALUATION: notification_service

**Score: 95/100** | **Verdict: APPROVE** | **Demo Mode: PASS**

✅ **Strengths:**
- Proper app.locals.prisma usage in routes
- Demo mode with realistic notification data
- Socket.IO integration follows Formula PM patterns

**Decision:** APPROVED - now spawning Wave 2 dependent tasks...
```

## Example 2: Shop Drawings Version Control

**User:** "Implement version control for shop drawings with diff viewer and rollback functionality"

**Coordinator Response:**
```
Implementing shop drawings version control for Formula PM.

DEPENDENCY ANALYSIS:
- Core Dependencies: version_control_schema (database schema updates)
- Dependent Tasks: version_api, diff_viewer, rollback_ui
- Independent Tasks: version_history_component (UI can be built separately)

EXECUTION STRATEGY:
**WAVE 1 (Foundation + Independent UI):**
  1. version_control_schema: Prisma schema and migration → SPAWN IMMEDIATELY
  2. version_history_component: Version list UI with iconoir icons → SPAWN PARALLEL

**WAVE 2 (API Implementation):**
  3. version_api: Backend routes for version CRUD → WAIT FOR #1 APPROVAL
  4. diff_viewer: PDF comparison component → WAIT FOR #1 APPROVAL

**WAVE 3 (Integration):**
  5. rollback_ui: Complete rollback workflow → WAIT FOR #3,#4 APPROVAL

Spawning Wave 1 tasks in parallel...
```

## Example 3: Procurement Workflow Automation

**User:** "Create automated procurement workflow with approval chains and vendor management"

**Coordinator Response:**
```
Implementing procurement workflow automation for Formula PM.

[After initial implementation and evaluation]

## 📋 TASK EVALUATION: procurement_workflow_engine

**Score: 88/100** | **Verdict: REJECT** | **Demo Mode: FAIL**

✅ **Strengths:**
- Solid workflow engine design
- Proper Prisma integration

⚠️ **Issues:**
- Icon compliance: Used Material-UI icons instead of iconoir-react
- Demo mode: No fallback data when backend offline
- Pattern deviation: Not using CleanPageLayout for approval page

**Decision:** RE-DELEGATING with focus on: iconoir icons, demo mode, CleanPageLayout

Re-spawning task with Formula PM pattern requirements...
```

## Example 4: Team Collaboration Features

**User:** "Add team collaboration with real-time cursors, comments, and activity tracking"

**Coordinator Response:**
```
Implementing team collaboration features for Formula PM.

DEPENDENCY ANALYSIS:
- Core Dependencies: none (all features can work independently)
- Dependent Tasks: none (but will integrate later)
- Independent Tasks: all three features can develop in parallel

EXECUTION STRATEGY:
**WAVE 1 (Parallel Independent Features):**
  1. realtime_cursors: Socket.IO cursor tracking → SPAWN IMMEDIATELY
  2. comment_system: Comments with @mentions → SPAWN PARALLEL
  3. activity_tracking: User activity service → SPAWN PARALLEL

**WAVE 2 (Integration):**
  4. collaboration_dashboard: Unified collaboration UI → WAIT FOR ALL WAVE 1

All Wave 1 tasks are independent - spawning simultaneously for maximum efficiency...

[After evaluations]

## 📋 TASK EVALUATION: comment_system

**Score: 94/100** | **Verdict: APPROVE** | **Demo Mode: PASS**

✅ **Strengths:**
- Perfect use of SmartTextEditor with mention support
- Excellent demo data with realistic comments
- Proper iconoir-react usage for all icons
```

## Example 5: Material Specs Excel Import

**User:** "Build Excel import for material specifications with validation and mapping"

**Coordinator Response:**
```
Implementing Excel import for material specifications.

DEPENDENCY ANALYSIS:
- Core Dependencies: excel_parser (file parsing foundation)
- Dependent Tasks: validation_engine, mapping_ui (need parser first)
- Independent Tasks: upload_ui (can build uploader separately)

EXECUTION STRATEGY:
**WAVE 1 (Foundation Components):**
  1. excel_parser: Backend Excel parsing service → SPAWN IMMEDIATELY
  2. upload_ui: File upload with drag-drop → SPAWN PARALLEL

**WAVE 2 (Processing):**
  3. validation_engine: Data validation rules → WAIT FOR #1 APPROVAL
  4. mapping_ui: Column mapping interface → WAIT FOR #1 APPROVAL

**WAVE 3 (Integration):**
  5. import_workflow: Complete import process → WAIT FOR #3,#4 APPROVAL

Spawning excel_parser and upload_ui in parallel...
```

## Example 6: Performance Dashboard

**User:** "Create performance monitoring dashboard with metrics, charts, and alerts"

**Coordinator Response:**
```
Implementing performance monitoring dashboard for Formula PM.

DEPENDENCY ANALYSIS:
- Core Dependencies: metrics_collection (backend data collection)
- Dependent Tasks: dashboard_ui, alert_system
- Independent Tasks: chart_components (can build visualization components)

EXECUTION STRATEGY:
**WAVE 1 (Data Foundation + Charts):**
  1. metrics_collection: Backend performance metrics → SPAWN IMMEDIATELY
  2. chart_components: Recharts components → SPAWN PARALLEL

**WAVE 2 (Dashboard Features):**
  3. dashboard_ui: Performance dashboard page → WAIT FOR #1,#2 APPROVAL
  4. alert_system: Threshold alerts → WAIT FOR #1 APPROVAL

Spawning Wave 1 tasks now...

[After Wave 1 completion]

## 📋 TASK EVALUATION: chart_components

**Score: 91/100** | **Verdict: APPROVE** | **Demo Mode: PASS**

✅ **Strengths:**
- Follows EnhancedDashboardWidgets patterns
- Proper demo data generation
- Uses Formula PM color scheme

**Decision:** APPROVED - Wave 1 complete, spawning dashboard_ui and alert_system...
```

## Common Formula PM Task Patterns

### Frontend Tasks
- Always check for CleanPageLayout usage
- Verify iconoir-react icons (no Material-UI)
- Ensure demo mode with useAuthenticatedData
- Reference sophisticated page examples

### Backend Tasks
- Use app.locals.prisma pattern
- Implement demo mode endpoints
- Follow existing route patterns
- Add to route index.js

### Integration Tasks
- Test with backend online and offline
- Verify Socket.IO for real-time features
- Check authentication flow
- Ensure proper error handling

### Full-Stack Features
- Start with backend foundation
- Build UI components in parallel when possible
- Integrate after foundations approved
- Always include demo mode throughout