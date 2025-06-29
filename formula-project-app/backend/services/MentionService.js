/**
 * Formula PM Mention Service
 * Advanced @mention system with project, user, and scope-item references
 */

const cacheService = require('./cacheService');
const auditService = require('./auditService');
const NotificationService = require('./NotificationService');
const _ = require('lodash');

// Will be initialized with shared database service
let prisma = null;
class MentionService {
  constructor() {
    this.config = {
      cacheTTL: 600, // 10 minutes
      mentionTypes: {
        user: {
          prefix: '@',
          pattern: /(@)([a-zA-Z0-9._-]+)/g,
          searchFields: ['firstName', 'lastName', 'email']
        },
        project: {
          prefix: '#',
          pattern: /(#project:)([a-zA-Z0-9._-]+)/g,
          searchFields: ['name']
        },
        scopeItem: {
          prefix: '#',
          pattern: /(#scope:)([a-zA-Z0-9._-]+)/g,
          searchFields: ['name']
        },
        task: {
          prefix: '#',
          pattern: /(#task:)([a-zA-Z0-9._-]+)/g,
          searchFields: ['name']
        }
      },
      searchLimit: 20,
      notificationSettings: {
        userMention: true,
        projectMention: false,
        scopeMention: false,
        taskMention: false
      }
    };
  }

  /**
   * Set the shared Prisma client
   */
  setPrismaClient(prismaClient) {
    prisma = prismaClient;
  }

  /**
   * Parse mentions from text content
   */
  async parseMentions(content, contextProjectId = null) {
    try {
      const mentions = {
        users: [],
        projects: [],
        scopeItems: [],
        tasks: [],
        rawMentions: []
      };

      // Extract all mention patterns
      for (const [type, config] of Object.entries(this.config.mentionTypes)) {
        const matches = content.matchAll(config.pattern);
        
        for (const match of matches) {
          const fullMatch = match[0];
          const identifier = match[2];
          
          mentions.rawMentions.push({
            type,
            identifier,
            fullMatch,
            index: match.index
          });
        }
      }

      // Resolve mentions to actual entities
      if (mentions.rawMentions.length > 0) {
        await this.resolveMentions(mentions, contextProjectId);
      }

      return mentions;
    } catch (error) {
      console.error('❌ Parse mentions error:', error);
      throw error;
    }
  }

  /**
   * Resolve raw mentions to actual database entities
   */
  async resolveMentions(mentions, contextProjectId = null) {
    try {
      // Group mentions by type for efficient querying
      const mentionsByType = _.groupBy(mentions.rawMentions, 'type');

      // Resolve user mentions
      if (mentionsByType.user) {
        const userIdentifiers = mentionsByType.user.map(m => m.identifier);
        const users = await this.findUsersByIdentifiers(userIdentifiers);
        mentions.users = users;
      }

      // Resolve project mentions
      if (mentionsByType.project) {
        const projectIdentifiers = mentionsByType.project.map(m => m.identifier);
        const projects = await this.findProjectsByIdentifiers(projectIdentifiers, contextProjectId);
        mentions.projects = projects;
      }

      // Resolve scope item mentions
      if (mentionsByType.scopeItem) {
        const scopeIdentifiers = mentionsByType.scopeItem.map(m => m.identifier);
        const scopeItems = await this.findScopeItemsByIdentifiers(scopeIdentifiers, contextProjectId);
        mentions.scopeItems = scopeItems;
      }

      // Resolve task mentions
      if (mentionsByType.task) {
        const taskIdentifiers = mentionsByType.task.map(m => m.identifier);
        const tasks = await this.findTasksByIdentifiers(taskIdentifiers, contextProjectId);
        mentions.tasks = tasks;
      }

      return mentions;
    } catch (error) {
      console.error('❌ Resolve mentions error:', error);
      throw error;
    }
  }

  /**
   * Find users by mention identifiers (first name, last name, or email prefix)
   */
  async findUsersByIdentifiers(identifiers) {
    try {
      const users = await prisma.user.findMany({
        where: {
          OR: identifiers.flatMap(identifier => [
            { firstName: { contains: identifier, mode: 'insensitive' } },
            { lastName: { contains: identifier, mode: 'insensitive' } },
            { email: { startsWith: identifier.toLowerCase() } },
            { 
              AND: [
                { firstName: { startsWith: identifier.split('.')[0] || '', mode: 'insensitive' } },
                { lastName: { startsWith: identifier.split('.')[1] || '', mode: 'insensitive' } }
              ]
            }
          ]),
          status: 'active'
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          position: true,
          avatarUrl: true
        },
        take: this.config.searchLimit
      });

      return users.map(user => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
        mentionText: `@${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}`
      }));
    } catch (error) {
      console.error('❌ Find users by identifiers error:', error);
      return [];
    }
  }

  /**
   * Find projects by mention identifiers
   */
  async findProjectsByIdentifiers(identifiers, contextProjectId = null) {
    try {
      const projects = await prisma.project.findMany({
        where: {
          OR: identifiers.map(identifier => ({
            name: { contains: identifier, mode: 'insensitive' }
          })),
          status: {
            not: 'cancelled'
          }
        },
        include: {
          client: {
            select: { name: true }
          }
        },
        take: this.config.searchLimit
      });

      return projects.map(project => ({
        ...project,
        mentionText: `#project:${project.name.toLowerCase().replace(/\s+/g, '-')}`
      }));
    } catch (error) {
      console.error('❌ Find projects by identifiers error:', error);
      return [];
    }
  }

  /**
   * Find scope items by mention identifiers
   */
  async findScopeItemsByIdentifiers(identifiers, contextProjectId = null) {
    try {
      const where = {
        OR: identifiers.map(identifier => ({
          name: { contains: identifier, mode: 'insensitive' }
        }))
      };

      // If context project provided, prioritize items from that project
      if (contextProjectId) {
        where.projectId = contextProjectId;
      }

      const scopeItems = await prisma.scopeItem.findMany({
        where,
        include: {
          project: {
            select: { id: true, name: true }
          },
          scopeGroup: {
            select: { name: true }
          }
        },
        take: this.config.searchLimit,
        orderBy: contextProjectId ? [{ projectId: 'desc' }] : undefined
      });

      return scopeItems.map(item => ({
        ...item,
        mentionText: `#scope:${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        contextInfo: `${item.project.name} > ${item.scopeGroup.name}`
      }));
    } catch (error) {
      console.error('❌ Find scope items by identifiers error:', error);
      return [];
    }
  }

  /**
   * Find tasks by mention identifiers
   */
  async findTasksByIdentifiers(identifiers, contextProjectId = null) {
    try {
      const where = {
        OR: identifiers.map(identifier => ({
          name: { contains: identifier, mode: 'insensitive' }
        })),
        status: {
          not: 'completed'
        }
      };

      if (contextProjectId) {
        where.projectId = contextProjectId;
      }

      const tasks = await prisma.task.findMany({
        where,
        include: {
          project: {
            select: { id: true, name: true }
          },
          assignee: {
            select: { firstName: true, lastName: true }
          }
        },
        take: this.config.searchLimit,
        orderBy: contextProjectId ? [{ projectId: 'desc' }] : undefined
      });

      return tasks.map(task => ({
        ...task,
        mentionText: `#task:${task.name.toLowerCase().replace(/\s+/g, '-')}`,
        contextInfo: `${task.project.name}${task.assignee ? ` (${task.assignee.firstName} ${task.assignee.lastName})` : ''}`
      }));
    } catch (error) {
      console.error('❌ Find tasks by identifiers error:', error);
      return [];
    }
  }

  /**
   * Search for mentionable entities by query
   */
  async searchMentionableEntities(query, options = {}) {
    try {
      const {
        types = ['user', 'project', 'scopeItem', 'task'],
        projectId = null,
        limit = 10
      } = options;

      const cacheKey = cacheService.generateKey('mention', 'search', 
        `${query}_${types.join('_')}_${projectId}_${limit}`);
      
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const results = {
        users: [],
        projects: [],
        scopeItems: [],
        tasks: []
      };

      // Search users
      if (types.includes('user')) {
        results.users = await prisma.user.findMany({
          where: {
            OR: [
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } }
            ],
            status: 'active'
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            position: true,
            avatarUrl: true
          },
          take: Math.floor(limit / types.length) + 1
        });

        results.users = results.users.map(user => ({
          ...user,
          type: 'user',
          fullName: `${user.firstName} ${user.lastName}`,
          mentionText: `@${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}`,
          description: `${user.role} - ${user.email}`
        }));
      }

      // Search projects
      if (types.includes('project')) {
        results.projects = await prisma.project.findMany({
          where: {
            name: { contains: query, mode: 'insensitive' },
            status: { not: 'cancelled' }
          },
          include: {
            client: {
              select: { name: true }
            }
          },
          take: Math.floor(limit / types.length) + 1
        });

        results.projects = results.projects.map(project => ({
          ...project,
          type: 'project',
          mentionText: `#project:${project.name.toLowerCase().replace(/\s+/g, '-')}`,
          description: `${project.client.name} - ${project.status}`
        }));
      }

      // Search scope items
      if (types.includes('scopeItem')) {
        const scopeWhere = {
          name: { contains: query, mode: 'insensitive' }
        };
        if (projectId) {
          scopeWhere.projectId = projectId;
        }

        results.scopeItems = await prisma.scopeItem.findMany({
          where: scopeWhere,
          include: {
            project: {
              select: { id: true, name: true }
            },
            scopeGroup: {
              select: { name: true }
            }
          },
          take: Math.floor(limit / types.length) + 1,
          orderBy: projectId ? [{ projectId: 'desc' }] : undefined
        });

        results.scopeItems = results.scopeItems.map(item => ({
          ...item,
          type: 'scopeItem',
          mentionText: `#scope:${item.name.toLowerCase().replace(/\s+/g, '-')}`,
          description: `${item.project.name} > ${item.scopeGroup.name}`
        }));
      }

      // Search tasks
      if (types.includes('task')) {
        const taskWhere = {
          name: { contains: query, mode: 'insensitive' },
          status: { not: 'completed' }
        };
        if (projectId) {
          taskWhere.projectId = projectId;
        }

        results.tasks = await prisma.task.findMany({
          where: taskWhere,
          include: {
            project: {
              select: { id: true, name: true }
            },
            assignee: {
              select: { firstName: true, lastName: true }
            }
          },
          take: Math.floor(limit / types.length) + 1,
          orderBy: projectId ? [{ projectId: 'desc' }] : undefined
        });

        results.tasks = results.tasks.map(task => ({
          ...task,
          type: 'task',
          mentionText: `#task:${task.name.toLowerCase().replace(/\s+/g, '-')}`,
          description: `${task.project.name}${task.assignee ? ` (${task.assignee.firstName} ${task.assignee.lastName})` : ''}`
        }));
      }

      // Flatten and sort results by relevance
      const allResults = [
        ...results.users,
        ...results.projects,
        ...results.scopeItems,
        ...results.tasks
      ].slice(0, limit);

      // Cache results
      await cacheService.set(cacheKey, allResults, this.config.cacheTTL);

      return allResults;
    } catch (error) {
      console.error('❌ Search mentionable entities error:', error);
      throw error;
    }
  }

  /**
   * Process mentions in content and send notifications
   */
  async processMentions(content, entityType, entityId, mentionedBy, options = {}) {
    try {
      const {
        projectId = null,
        sendNotifications = true
      } = options;

      const mentions = await this.parseMentions(content, projectId);

      if (sendNotifications && mentions.users.length > 0) {
        await this.sendMentionNotifications(mentions.users, entityType, entityId, mentionedBy);
      }

      // Log mention activity
      await auditService.logSystemEvent({
        event: 'mentions_processed',
        description: `Processed ${mentions.users.length} user mentions in ${entityType}`,
        metadata: {
          entityType,
          entityId,
          mentionedBy,
          userMentions: mentions.users.length,
          projectMentions: mentions.projects.length,
          scopeMentions: mentions.scopeItems.length,
          taskMentions: mentions.tasks.length
        }
      });

      return mentions;
    } catch (error) {
      console.error('❌ Process mentions error:', error);
      throw error;
    }
  }

  /**
   * Send notifications for user mentions
   */
  async sendMentionNotifications(mentionedUsers, entityType, entityId, mentionedBy) {
    try {
      // Get entity details for context
      const entityDetails = await this.getEntityDetails(entityType, entityId);
      const mentioner = await prisma.user.findUnique({
        where: { id: mentionedBy },
        select: { firstName: true, lastName: true }
      });

      const mentionerName = mentioner ? 
        `${mentioner.firstName} ${mentioner.lastName}` : 'Someone';

      // Create notifications for each mentioned user
      const notifications = mentionedUsers
        .filter(user => user.id !== mentionedBy) // Don't notify self
        .map(user => ({
          userId: user.id,
          type: 'system_alert',
          title: `You were mentioned in ${entityType}`,
          message: `${mentionerName} mentioned you in ${entityDetails.name || entityType}`,
          data: {
            entityType,
            entityId,
            entityName: entityDetails.name,
            mentionedBy,
            mentionerName,
            projectId: entityDetails.projectId,
            projectName: entityDetails.projectName
          }
        }));

      if (notifications.length > 0) {
        await NotificationService.createBulkNotifications(notifications);
      }

      return notifications.length;
    } catch (error) {
      console.error('❌ Send mention notifications error:', error);
      throw error;
    }
  }

  /**
   * Get entity details for mention context
   */
  async getEntityDetails(entityType, entityId) {
    try {
      switch (entityType) {
        case 'project':
          const project = await prisma.project.findUnique({
            where: { id: entityId },
            select: {
              id: true,
              name: true,
              projectId: true
            }
          });
          return {
            name: project?.name,
            projectId: project?.id,
            projectName: project?.name
          };

        case 'task':
          const task = await prisma.task.findUnique({
            where: { id: entityId },
            include: {
              project: {
                select: { id: true, name: true }
              }
            }
          });
          return {
            name: task?.name,
            projectId: task?.project?.id,
            projectName: task?.project?.name
          };

        case 'scope_item':
          const scopeItem = await prisma.scopeItem.findUnique({
            where: { id: entityId },
            include: {
              project: {
                select: { id: true, name: true }
              }
            }
          });
          return {
            name: scopeItem?.name,
            projectId: scopeItem?.project?.id,
            projectName: scopeItem?.project?.name
          };

        case 'comment':
          // For comments, we need to find the parent entity
          const comment = await prisma.comment.findUnique({
            where: { id: entityId }
          });
          if (comment) {
            return await this.getEntityDetails(comment.entityType, comment.entityId);
          }
          return { name: 'Comment' };

        default:
          return { name: entityType };
      }
    } catch (error) {
      console.error('❌ Get entity details error:', error);
      return { name: entityType };
    }
  }

  /**
   * Replace mention text with formatted mentions
   */
  formatMentions(content, mentions) {
    try {
      let formattedContent = content;

      // Replace user mentions
      mentions.users.forEach(user => {
        const mentionRegex = new RegExp(`@${user.firstName.toLowerCase()}\\.${user.lastName.toLowerCase()}`, 'gi');
        formattedContent = formattedContent.replace(
          mentionRegex,
          `<span class="mention mention-user" data-user-id="${user.id}">@${user.firstName} ${user.lastName}</span>`
        );
      });

      // Replace project mentions
      mentions.projects.forEach(project => {
        const projectSlug = project.name.toLowerCase().replace(/\s+/g, '-');
        const mentionRegex = new RegExp(`#project:${projectSlug}`, 'gi');
        formattedContent = formattedContent.replace(
          mentionRegex,
          `<span class="mention mention-project" data-project-id="${project.id}">#${project.name}</span>`
        );
      });

      // Replace scope item mentions
      mentions.scopeItems.forEach(item => {
        const itemSlug = item.name.toLowerCase().replace(/\s+/g, '-');
        const mentionRegex = new RegExp(`#scope:${itemSlug}`, 'gi');
        formattedContent = formattedContent.replace(
          mentionRegex,
          `<span class="mention mention-scope" data-scope-id="${item.id}">#${item.name}</span>`
        );
      });

      // Replace task mentions
      mentions.tasks.forEach(task => {
        const taskSlug = task.name.toLowerCase().replace(/\s+/g, '-');
        const mentionRegex = new RegExp(`#task:${taskSlug}`, 'gi');
        formattedContent = formattedContent.replace(
          mentionRegex,
          `<span class="mention mention-task" data-task-id="${task.id}">#${task.name}</span>`
        );
      });

      return formattedContent;
    } catch (error) {
      console.error('❌ Format mentions error:', error);
      return content;
    }
  }

  /**
   * Get mention analytics for a project
   */
  async getMentionAnalytics(projectId, options = {}) {
    try {
      const {
        startDate = null,
        endDate = null
      } = options;

      // This would require analyzing comments and other text fields
      // For now, return a basic structure
      const analytics = {
        totalMentions: 0,
        userMentions: 0,
        projectMentions: 0,
        scopeMentions: 0,
        taskMentions: 0,
        topMentionedUsers: [],
        mentionTrends: [],
        engagementScore: 0
      };

      // Get comments for the project to analyze mentions
      const comments = await prisma.comment.findMany({
        where: {
          entityType: 'project',
          entityId: projectId,
          ...(startDate || endDate) && {
            createdAt: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) })
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      // Analyze mentions in comments
      for (const comment of comments) {
        const mentions = await this.parseMentions(comment.content, projectId);
        analytics.totalMentions += mentions.rawMentions.length;
        analytics.userMentions += mentions.users.length;
        analytics.projectMentions += mentions.projects.length;
        analytics.scopeMentions += mentions.scopeItems.length;
        analytics.taskMentions += mentions.tasks.length;
      }

      return analytics;
    } catch (error) {
      console.error('❌ Get mention analytics error:', error);
      throw error;
    }
  }

  /**
   * Get mention suggestions for user
   */
  async getMentionSuggestions(userId, projectId = null) {
    try {
      const cacheKey = cacheService.generateKey('mention', 'suggestions', `${userId}_${projectId}`);
      
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const suggestions = {
        recentCollaborators: [],
        projectTeam: [],
        frequentMentions: []
      };

      // Get recent collaborators (users who worked on same projects)
      if (projectId) {
        suggestions.projectTeam = await prisma.projectTeamMember.findMany({
          where: {
            projectId,
            userId: { not: userId }
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                position: true,
                avatarUrl: true
              }
            }
          },
          take: 10
        });

        suggestions.projectTeam = suggestions.projectTeam.map(member => ({
          ...member.user,
          type: 'user',
          mentionText: `@${member.user.firstName.toLowerCase()}.${member.user.lastName.toLowerCase()}`,
          context: 'Project Team Member'
        }));
      }

      // Get recent collaborators from user's projects
      const userProjects = await prisma.projectTeamMember.findMany({
        where: { userId },
        select: { projectId: true }
      });

      if (userProjects.length > 0) {
        suggestions.recentCollaborators = await prisma.projectTeamMember.findMany({
          where: {
            projectId: { in: userProjects.map(p => p.projectId) },
            userId: { not: userId }
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                position: true,
                avatarUrl: true
              }
            }
          },
          distinct: ['userId'],
          take: 10
        });

        suggestions.recentCollaborators = suggestions.recentCollaborators.map(member => ({
          ...member.user,
          type: 'user',
          mentionText: `@${member.user.firstName.toLowerCase()}.${member.user.lastName.toLowerCase()}`,
          context: 'Recent Collaborator'
        }));
      }

      await cacheService.set(cacheKey, suggestions, this.config.cacheTTL);
      return suggestions;
    } catch (error) {
      console.error('❌ Get mention suggestions error:', error);
      throw error;
    }
  }
}

module.exports = new MentionService();