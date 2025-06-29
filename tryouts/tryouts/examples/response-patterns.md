# Response Pattern Examples

## Example 1: Cooldown Management System

**User:** "Add cooldown management system with dashboard integration and bot controls"

**Coordinator Response:**
```
Implementing cooldown system with proper dependency management.

DEPENDENCY ANALYSIS:
- Core Dependencies: cooldown_management (foundation component)
- Dependent Tasks: dashboard_integration, bot_controls (need cooldown system first) 
- Independent Tasks: none (all features depend on core cooldown system)

EXECUTION STRATEGY:
**WAVE 1 (Spawn FIRST - Core Dependencies):**
  1. cooldown_management: Core cooldown system with types and logic → SPAWN IMMEDIATELY

**WAVE 2 (Spawn AFTER Wave 1 Approved):**
  2. dashboard_integration: Display cooldown status in UI → WAIT FOR #1 APPROVAL
  3. bot_controls: Bot commands with cooldown checks → WAIT FOR #1 APPROVAL

Spawning Wave 1 task now. Wave 2 will wait for cooldown_management approval...

[After Wave 1 completion and evaluation]

## 📋 TASK EVALUATION: cooldown_management

**Score: 93/100** | **Verdict: APPROVE** | **Complexity Ratio: 0.9**

✅ **Strengths:**
- Clean, reusable cooldown system design
- Perfect integration with existing bot infrastructure  
- Comprehensive error handling

**Decision:** APPROVED - now spawning Wave 2 dependent tasks...

Spawning dashboard_integration and bot_controls simultaneously (both depend on approved cooldown_management)...
```

## Example 2: Integration Task

**User:** "Connect WebSocket service to bot management dashboard"

**Coordinator Response:**
```
Implementing WebSocket-to-dashboard integration.

DEPENDENCY ANALYSIS:
- Core Dependencies: websocket_client_setup (foundation for all communication)
- Dependent Tasks: dashboard_updates, bot_status_display (need client first)
- Independent Tasks: message_type_analysis (can run parallel with foundation)

EXECUTION STRATEGY:
**WAVE 1 (Foundation + Independent Analysis):**
  1. websocket_client_setup: Client connection and auth → SPAWN IMMEDIATELY
  2. message_type_analysis: Analyze message formats → SPAWN PARALLEL

**WAVE 2 (Integration Features):**
  3. dashboard_updates: Real-time UI updates → WAIT FOR #1 APPROVAL
  4. bot_status_display: Status widgets → WAIT FOR #1 APPROVAL

Spawning Wave 1 tasks in parallel...
```

## Example 3: Re-delegation Scenario

**User:** "Fix the authentication middleware"

**Coordinator Response:**
```
Fixing authentication middleware.

[After initial implementation and evaluation]

## 📋 TASK EVALUATION: auth_middleware_fix

**Score: 87/100** | **Verdict: REJECT** | **Complexity Ratio: 1.2**

✅ **Strengths:**
- Correctly identifies auth flow issues
- Implements proper JWT validation

⚠️ **Issues:**
- Pattern compliance: Not using project's existing auth patterns
- Error handling: Missing integration with project's error system

**Decision:** RE-DELEGATING with focus on: pattern compliance, error integration

Re-spawning task with evaluator feedback and pattern requirements...
```

## Example 4: Parallel Processing

**User:** "Add performance metrics export and user preference management"

**Coordinator Response:**
```
Implementing metrics export and user preferences (independent features).

DEPENDENCY ANALYSIS:
- Core Dependencies: none (features are independent)
- Dependent Tasks: none
- Independent Tasks: metrics_export, user_preferences (can run in parallel)

EXECUTION STRATEGY:
**WAVE 1 (Parallel Independent Features):**
  1. metrics_export: CSV/JSON export functionality → SPAWN IMMEDIATELY
  2. user_preferences: Preference storage and UI → SPAWN PARALLEL

Both tasks are independent - spawning simultaneously for maximum efficiency...
```