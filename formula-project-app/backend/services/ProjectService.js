/**
 * Formula PM Project Service
 * Comprehensive project lifecycle management with team assignments, budget tracking, and status transitions
 */

const { PrismaClient } = require('@prisma/client');
const cacheService = require('./cacheService');
const auditService = require('./auditService');
const _ = require('lodash');

const prisma = new PrismaClient();

class ProjectService {
  constructor() {
    this.config = {
      cacheTTL: 300, // 5 minutes
      maxTeamSize: 50,
      budgetThresholds: {
        warning: 0.8,  // 80% of budget
        critical: 0.95 // 95% of budget
      },
      statusTransitions: {
        draft: ['active', 'cancelled'],
        active: ['on_tender', 'on_hold', 'completed', 'cancelled'],
        on_tender: ['active', 'cancelled'],
        on_hold: ['active', 'cancelled'],
        completed: [],
        cancelled: []
      }
    };
  }

  /**
   * Create a new project with comprehensive setup
   */
  async createProject(projectData, createdBy) {
    try {
      const {
        name,
        description,
        type,
        priority = 'medium',
        budget,
        startDate,
        endDate,
        location,
        clientId,
        projectManagerId,
        teamMembers = [],
        initialScopeGroups = []
      } = projectData;

      // Validate client exists
      const client = await prisma.client.findUnique({
        where: { id: clientId }
      });
      if (!client) {
        throw new Error('Client not found');
      }

      // Validate project manager if provided
      if (projectManagerId) {
        const projectManager = await prisma.user.findUnique({
          where: { id: projectManagerId }
        });
        if (!projectManager || projectManager.role !== 'project_manager') {
          throw new Error('Invalid project manager');
        }
      }

      // Create project with transaction
      const project = await prisma.$transaction(async (tx) => {
        // Create the project
        const newProject = await tx.project.create({
          data: {
            name,
            description,
            type,
            priority,
            budget,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            location,
            clientId,
            projectManagerId,
            createdBy,
            status: 'draft'
          }
        });

        // Add team members
        if (teamMembers.length > 0) {
          await tx.projectTeamMember.createMany({
            data: teamMembers.map(member => ({
              projectId: newProject.id,
              userId: member.userId,
              role: member.role || 'team_member'
            }))
          });
        }

        // Create initial scope groups
        if (initialScopeGroups.length > 0) {
          for (const [index, scopeGroup] of initialScopeGroups.entries()) {
            await tx.scopeGroup.create({
              data: {
                projectId: newProject.id,
                name: scopeGroup.name,
                description: scopeGroup.description,
                orderIndex: index
              }
            });
          }
        }

        return newProject;
      });

      // Log audit event
      await auditService.logDataChange({
        tableName: 'projects',
        recordId: project.id,
        action: 'create',
        newValues: project,
        userId: createdBy
      });

      // Clear related caches
      await this.clearProjectCaches(project.id);

      return await this.getProjectDetails(project.id);
    } catch (error) {
      console.error('❌ Project creation error:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive project details
   */
  async getProjectDetails(projectId) {
    try {
      const cacheKey = cacheService.generateKey('project', projectId, 'details');
      
      // Check cache first
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              companyName: true,
              contactPerson: true,
              email: true,
              phone: true
            }
          },
          projectManager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              position: true
            }
          },
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          },
          teamMembers: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  role: true,
                  position: true,
                  skills: true
                }
              }
            }
          },
          scopeGroups: {
            include: {
              scopeItems: {
                select: {
                  id: true,
                  name: true,
                  status: true,
                  completionPercentage: true,
                  estimatedCost: true,
                  actualCost: true
                }
              }
            },
            orderBy: { orderIndex: 'asc' }
          },
          tasks: {
            select: {
              id: true,
              name: true,
              status: true,
              priority: true,
              progress: true,
              assignee: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          shopDrawings: {
            select: {
              id: true,
              fileName: true,
              status: true,
              version: true,
              uploadDate: true
            }
          },
          materialSpecs: {
            select: {
              id: true,
              description: true,
              status: true,
              quantity: true,
              unitCost: true
            }
          }
        }
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // Calculate enhanced project metrics
      const metrics = await this.calculateProjectMetrics(project);
      
      const enhancedProject = {
        ...project,
        metrics,
        possibleStatusTransitions: this.config.statusTransitions[project.status] || []
      };

      // Cache the result
      await cacheService.set(cacheKey, enhancedProject, this.config.cacheTTL);

      return enhancedProject;
    } catch (error) {
      console.error('❌ Project details error:', error);
      throw error;
    }
  }

  /**
   * Calculate comprehensive project metrics
   */
  async calculateProjectMetrics(project) {
    const scopeItems = project.scopeGroups.flatMap(group => group.scopeItems);
    const tasks = project.tasks || [];
    const drawings = project.shopDrawings || [];
    const materials = project.materialSpecs || [];

    // Progress calculations
    const overallProgress = scopeItems.length > 0 
      ? Math.round(scopeItems.reduce((sum, item) => sum + item.completionPercentage, 0) / scopeItems.length)
      : 0;

    const taskProgress = tasks.length > 0
      ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
      : 0;

    // Budget calculations
    const estimatedCost = scopeItems.reduce((sum, item) => sum + (parseFloat(item.estimatedCost) || 0), 0);
    const actualCost = scopeItems.reduce((sum, item) => sum + (parseFloat(item.actualCost) || 0), 0);
    const budgetUsed = project.budget ? (actualCost / parseFloat(project.budget)) : 0;
    const budgetVariance = estimatedCost - actualCost;

    // Status counts
    const scopeStatusCounts = _.countBy(scopeItems, 'status');
    const taskStatusCounts = _.countBy(tasks, 'status');
    const drawingStatusCounts = _.countBy(drawings, 'status');
    const materialStatusCounts = _.countBy(materials, 'status');

    // Team metrics
    const teamSize = project.teamMembers?.length || 0;
    const skillsCoverage = this.calculateSkillsCoverage(project.teamMembers);

    // Timeline metrics
    const timelineMetrics = this.calculateTimelineMetrics(project);

    return {
      progress: {
        overall: overallProgress,
        tasks: taskProgress,
        scopeItems: scopeItems.length,
        completedScopeItems: scopeStatusCounts.completed || 0
      },
      budget: {
        allocated: parseFloat(project.budget) || 0,
        estimated: estimatedCost,
        actual: actualCost,
        remaining: parseFloat(project.budget) - actualCost,
        variance: budgetVariance,
        percentageUsed: Math.round(budgetUsed * 100),
        status: budgetUsed > this.config.budgetThresholds.critical ? 'critical' :
                budgetUsed > this.config.budgetThresholds.warning ? 'warning' : 'good'
      },
      counts: {
        scopeGroups: project.scopeGroups?.length || 0,
        scopeItems: scopeItems.length,
        tasks: tasks.length,
        drawings: drawings.length,
        materials: materials.length,
        teamMembers: teamSize
      },
      statusBreakdown: {
        scope: scopeStatusCounts,
        tasks: taskStatusCounts,
        drawings: drawingStatusCounts,
        materials: materialStatusCounts
      },
      team: {
        size: teamSize,
        skillsCoverage,
        hasProjectManager: !!project.projectManagerId
      },
      timeline: timelineMetrics
    };
  }

  /**
   * Calculate skills coverage for project team
   */
  calculateSkillsCoverage(teamMembers) {
    if (!teamMembers || teamMembers.length === 0) {
      return { coverage: 0, skills: [] };
    }

    const allSkills = teamMembers.flatMap(member => member.user.skills || []);
    const uniqueSkills = [...new Set(allSkills)];
    const skillCounts = _.countBy(allSkills);

    return {
      coverage: uniqueSkills.length,
      skills: uniqueSkills.map(skill => ({
        name: skill,
        count: skillCounts[skill]
      })).sort((a, b) => b.count - a.count)
    };
  }

  /**
   * Calculate timeline metrics
   */
  calculateTimelineMetrics(project) {
    const now = new Date();
    const startDate = project.startDate ? new Date(project.startDate) : null;
    const endDate = project.endDate ? new Date(project.endDate) : null;

    if (!startDate || !endDate) {
      return {
        duration: null,
        elapsed: null,
        remaining: null,
        percentageComplete: null,
        status: 'no_timeline'
      };
    }

    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const elapsed = Math.max(0, Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)));
    const remaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
    const percentageComplete = Math.min(100, Math.round((elapsed / duration) * 100));

    let status = 'on_track';
    if (now > endDate) {
      status = 'overdue';
    } else if (remaining <= 7) {
      status = 'due_soon';
    } else if (percentageComplete > project.progress + 20) {
      status = 'behind_schedule';
    }

    return {
      duration,
      elapsed,
      remaining,
      percentageComplete,
      status,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  }

  /**
   * Update project status with validation
   */
  async updateProjectStatus(projectId, newStatus, userId, reason = null) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // Validate status transition
      const allowedTransitions = this.config.statusTransitions[project.status];
      if (!allowedTransitions.includes(newStatus)) {
        throw new Error(`Invalid status transition from ${project.status} to ${newStatus}`);
      }

      // Update project status
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { 
          status: newStatus,
          updatedAt: new Date()
        }
      });

      // Log status change
      await auditService.logDataChange({
        tableName: 'projects',
        recordId: projectId,
        action: 'update',
        oldValues: { status: project.status },
        newValues: { status: newStatus, reason },
        userId
      });

      // Clear caches
      await this.clearProjectCaches(projectId);

      return updatedProject;
    } catch (error) {
      console.error('❌ Project status update error:', error);
      throw error;
    }
  }

  /**
   * Assign team member to project
   */
  async assignTeamMember(projectId, userId, role = 'team_member', assignedBy) {
    try {
      // Validate project exists
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      });
      if (!project) {
        throw new Error('Project not found');
      }

      // Validate user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new Error('User not found');
      }

      // Check if already assigned
      const existingAssignment = await prisma.projectTeamMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId
          }
        }
      });

      if (existingAssignment) {
        throw new Error('User already assigned to project');
      }

      // Create assignment
      const assignment = await prisma.projectTeamMember.create({
        data: {
          projectId,
          userId,
          role
        }
      });

      // Log assignment
      await auditService.logDataChange({
        tableName: 'project_team_members',
        recordId: `${projectId}_${userId}`,
        action: 'create',
        newValues: assignment,
        userId: assignedBy
      });

      // Clear caches
      await this.clearProjectCaches(projectId);

      return assignment;
    } catch (error) {
      console.error('❌ Team member assignment error:', error);
      throw error;
    }
  }

  /**
   * Remove team member from project
   */
  async removeTeamMember(projectId, userId, removedBy) {
    try {
      const assignment = await prisma.projectTeamMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId
          }
        }
      });

      if (!assignment) {
        throw new Error('Team member assignment not found');
      }

      // Remove assignment
      await prisma.projectTeamMember.delete({
        where: {
          projectId_userId: {
            projectId,
            userId
          }
        }
      });

      // Log removal
      await auditService.logDataChange({
        tableName: 'project_team_members',
        recordId: `${projectId}_${userId}`,
        action: 'delete',
        oldValues: assignment,
        userId: removedBy
      });

      // Clear caches
      await this.clearProjectCaches(projectId);

      return true;
    } catch (error) {
      console.error('❌ Team member removal error:', error);
      throw error;
    }
  }

  /**
   * Get project team with details
   */
  async getProjectTeam(projectId) {
    try {
      const cacheKey = cacheService.generateKey('project', projectId, 'team');
      
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const teamMembers = await prisma.projectTeamMember.findMany({
        where: { projectId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              position: true,
              department: true,
              skills: true,
              certifications: true,
              avatarUrl: true,
              lastLoginAt: true
            }
          }
        }
      });

      const team = {
        members: teamMembers,
        totalMembers: teamMembers.length,
        roleDistribution: _.countBy(teamMembers, 'role'),
        departmentDistribution: _.countBy(teamMembers.map(m => m.user.department)),
        skillsMatrix: this.buildSkillsMatrix(teamMembers)
      };

      await cacheService.set(cacheKey, team, this.config.cacheTTL);
      return team;
    } catch (error) {
      console.error('❌ Get project team error:', error);
      throw error;
    }
  }

  /**
   * Build skills matrix for team
   */
  buildSkillsMatrix(teamMembers) {
    const skillsMap = new Map();
    
    teamMembers.forEach(member => {
      const skills = member.user.skills || [];
      skills.forEach(skill => {
        if (!skillsMap.has(skill)) {
          skillsMap.set(skill, []);
        }
        skillsMap.get(skill).push({
          userId: member.user.id,
          name: `${member.user.firstName} ${member.user.lastName}`,
          role: member.role
        });
      });
    });

    return Array.from(skillsMap.entries()).map(([skill, members]) => ({
      skill,
      members,
      coverage: members.length
    })).sort((a, b) => b.coverage - a.coverage);
  }

  /**
   * Get projects for user
   */
  async getUserProjects(userId, options = {}) {
    try {
      const {
        status = null,
        role = null,
        limit = 20,
        offset = 0,
        sortBy = 'updatedAt',
        sortOrder = 'desc'
      } = options;

      const where = {
        OR: [
          { createdBy: userId },
          { projectManagerId: userId },
          { teamMembers: { some: { userId } } }
        ]
      };

      if (status) {
        where.status = status;
      }

      const projects = await prisma.project.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              companyName: true
            }
          },
          projectManager: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          teamMembers: {
            where: role ? { role } : undefined,
            select: {
              role: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          _count: {
            select: {
              tasks: true,
              scopeItems: true,
              shopDrawings: true
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        take: limit,
        skip: offset
      });

      const total = await prisma.project.count({ where });

      return {
        projects: projects.map(project => ({
          ...project,
          userRole: this.getUserRoleInProject(project, userId)
        })),
        total,
        hasMore: offset + limit < total
      };
    } catch (error) {
      console.error('❌ Get user projects error:', error);
      throw error;
    }
  }

  /**
   * Get user's role in project
   */
  getUserRoleInProject(project, userId) {
    if (project.createdBy === userId) return 'creator';
    if (project.projectManagerId === userId) return 'project_manager';
    
    const teamMember = project.teamMembers?.find(member => member.user.id === userId);
    return teamMember?.role || null;
  }

  /**
   * Clear project-related caches
   */
  async clearProjectCaches(projectId) {
    const patterns = [
      cacheService.generateKey('project', projectId, '*'),
      cacheService.generateKey('project', 'list_*'),
      cacheService.generateKey('stats', 'project_*')
    ];

    for (const pattern of patterns) {
      await cacheService.deletePattern(pattern);
    }
  }

  /**
   * Get project dashboard data
   */
  async getProjectDashboard(projectId) {
    try {
      const cacheKey = cacheService.generateKey('project', projectId, 'dashboard');
      
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const [project, recentActivity, upcomingDeadlines] = await Promise.all([
        this.getProjectDetails(projectId),
        this.getProjectActivity(projectId, { limit: 10 }),
        this.getUpcomingDeadlines(projectId)
      ]);

      const dashboard = {
        project,
        recentActivity,
        upcomingDeadlines,
        quickStats: {
          tasksInProgress: project.metrics.statusBreakdown.tasks.in_progress || 0,
          drawingsPendingApproval: project.metrics.statusBreakdown.drawings.pending || 0,
          materialsOrdered: project.metrics.statusBreakdown.materials.ordered || 0,
          budgetRemaining: project.metrics.budget.remaining
        }
      };

      await cacheService.set(cacheKey, dashboard, 120); // 2 minutes cache
      return dashboard;
    } catch (error) {
      console.error('❌ Project dashboard error:', error);
      throw error;
    }
  }

  /**
   * Get recent project activity
   */
  async getProjectActivity(projectId, options = {}) {
    try {
      const { limit = 20 } = options;
      
      // Get audit logs for project-related activities
      const activityLogs = await auditService.queryAuditLogs({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        limit
      });

      // Filter and format project-related activities
      const projectActivities = activityLogs.data
        .filter(log => log.newValues?.projectId === projectId || log.recordId === projectId)
        .map(log => ({
          id: log.id,
          type: log.tableName,
          action: log.action,
          description: auditService.getActionDescription(log.action, log.tableName, log.changedFields),
          user: log.user,
          timestamp: log.timestamp,
          details: log.newValues
        }));

      return projectActivities;
    } catch (error) {
      console.error('❌ Project activity error:', error);
      throw error;
    }
  }

  /**
   * Get upcoming project deadlines
   */
  async getUpcomingDeadlines(projectId) {
    try {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const tasks = await prisma.task.findMany({
        where: {
          projectId,
          dueDate: {
            lte: thirtyDaysFromNow
          },
          status: {
            not: 'completed'
          }
        },
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          dueDate: 'asc'
        }
      });

      return tasks.map(task => ({
        id: task.id,
        name: task.name,
        dueDate: task.dueDate,
        assignee: task.assignee,
        priority: task.priority,
        status: task.status,
        daysUntilDue: Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
      }));
    } catch (error) {
      console.error('❌ Upcoming deadlines error:', error);
      throw error;
    }
  }
}

module.exports = new ProjectService();