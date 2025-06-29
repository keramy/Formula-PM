# Formula PM Development Guide

## Quick Reference

**Project Status**: Production-ready as of 2025-06-28
- Backend: Express + PostgreSQL + Redis + Socket.IO
- Frontend: React + Material-UI (migrated from iconoir-react)
- Ports: Backend (3001), Frontend (3003)

## Development Approach

### Core Principles
1. **Make reasonable inferences** for standard patterns (CRUD, UI layouts, common workflows)
2. **Ask for clarification** on business logic, workflows, or architectural decisions
3. **Follow existing patterns** - check similar components before implementing
4. **Document as you go** when it adds value

### When to Ask vs When to Act

**Just do it:**
- Standard CRUD operations
- Basic form validation
- Common UI patterns
- Error handling
- Loading states

**Ask first:**
- Business workflow rules
- Permission/authorization logic
- Data relationships
- Integration with external systems
- UX decisions that affect user workflow

## Essential Commands

```bash
# Development
npm run dev          # Start frontend or backend
npm run typecheck    # Type checking
npm run lint         # Linting

# System verification
npm run verify-system
cat CURRENT_SESSION_STATUS.md
```

## Code Patterns

See [PATTERNS.md](./PATTERNS.md) for:
- Component structure
- Service integration
- Material-UI patterns
- State management

## Project-Specific Notes

See [PROJECT-SPECIFICS.md](./PROJECT-SPECIFICS.md) for:
- Formula PM business logic
- Known gotchas
- Architecture decisions

## Getting Started

1. Check current session status
2. Review the specific area you're working on
3. Look for similar existing implementations
4. Implement following established patterns
5. Test your changes
6. Run lint and typecheck before considering complete