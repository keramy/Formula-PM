/**
 * Formula PM Search Service
 * Advanced global search with full-text search, filtering, and intelligent ranking
 */

const cacheService = require('./cacheService');
const auditService = require('./auditService');
const MentionService = require('./MentionService');
const _ = require('lodash');

// Will be initialized with shared database service
let prisma = null;
class SearchService {
  constructor() {
    this.config = {
      cacheTTL: 300, // 5 minutes
      searchTypes: {
        projects: {
          table: 'project',
          searchFields: ['name', 'description', 'location'],
          include: {
            client: { select: { id: true, name: true, companyName: true } },
            projectManager: { select: { id: true, firstName: true, lastName: true } },
            creator: { select: { id: true, firstName: true, lastName: true } }
          },
          orderBy: [{ updatedAt: 'desc' }]
        },
        tasks: {
          table: 'task',
          searchFields: ['name', 'description'],
          include: {
            project: { select: { id: true, name: true } },
            assignee: { select: { id: true, firstName: true, lastName: true } },
            creator: { select: { id: true, firstName: true, lastName: true } }
          },
          orderBy: [{ updatedAt: 'desc' }]
        },
        users: {
          table: 'user',
          searchFields: ['firstName', 'lastName', 'email', 'position'],
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            position: true,
            department: true,
            avatarUrl: true,
            skills: true
          },
          orderBy: [{ lastName: 'asc' }]
        },
        scopeItems: {
          table: 'scopeItem',
          searchFields: ['name', 'description'],
          include: {
            project: { select: { id: true, name: true } },
            scopeGroup: { select: { id: true, name: true } }
          },
          orderBy: [{ updatedAt: 'desc' }]
        },
        drawings: {
          table: 'shopDrawing',
          searchFields: ['fileName', 'drawingType', 'room', 'comments'],
          include: {
            project: { select: { id: true, name: true } },
            scopeItem: { select: { id: true, name: true } },
            creator: { select: { id: true, firstName: true, lastName: true } }
          },
          orderBy: [{ uploadDate: 'desc' }]
        },
        materials: {
          table: 'materialSpecification',
          searchFields: ['description', 'category', 'material', 'finish', 'supplier'],
          include: {
            project: { select: { id: true, name: true } },
            scopeItem: { select: { id: true, name: true } },
            creator: { select: { id: true, firstName: true, lastName: true } }
          },
          orderBy: [{ updatedAt: 'desc' }]
        },
        clients: {
          table: 'client',
          searchFields: ['name', 'companyName', 'contactPerson', 'email', 'industry'],
          orderBy: [{ updatedAt: 'desc' }]
        }
      },
      defaultLimit: 20,
      maxLimit: 100,
      rankingWeights: {
        exactMatch: 1000,
        startsWith: 500,
        contains: 100,
        recent: 50,
        priority: 25
      },
      searchFilters: {
        projects: {
          status: ['draft', 'active', 'on_tender', 'on_hold', 'completed', 'cancelled'],
          type: ['commercial', 'residential', 'retail', 'hospitality', 'industrial', 'healthcare'],
          priority: ['low', 'medium', 'high', 'urgent']
        },
        tasks: {
          status: ['pending', 'in_progress', 'review', 'completed', 'cancelled'],
          priority: ['low', 'medium', 'high', 'urgent']
        },
        users: {
          role: ['admin', 'project_manager', 'designer', 'craftsman', 'coordinator', 'client'],
          status: ['active', 'inactive']
        },
        drawings: {
          status: ['draft', 'pending', 'approved', 'revision_required', 'rejected']
        },
        materials: {
          status: ['pending', 'pending_approval', 'approved', 'ordered', 'in_stock', 'delivered', 'used']
        }
      }
    };

    this.searchHistory = new Map();
  }

  /**
   * Set the shared Prisma client
   */
  setPrismaClient(prismaClient) {
    prisma = prismaClient;
  }

  /**
   * Perform global search across all entity types
   */
  async globalSearch(query, options = {}) {
    try {
      const {
        types = Object.keys(this.config.searchTypes),
        limit = this.config.defaultLimit,
        filters = {},
        userId = null,
        projectContext = null,
        sortBy = 'relevance',
        includeHighlights = true
      } = options;

      if (!query || query.trim().length < 2) {
        return {
          query,
          results: [],
          total: 0,
          searchTime: 0,
          suggestions: await this.getSearchSuggestions(userId, projectContext)
        };
      }

      const startTime = Date.now();
      const cleanQuery = query.trim().toLowerCase();

      // Generate cache key
      const cacheKey = cacheService.generateKey('search', 'global', 
        `${cleanQuery}_${types.join('_')}_${JSON.stringify(filters)}_${limit}_${projectContext}`);

      // Check cache
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        // Update search history
        await this.recordSearchQuery(cleanQuery, userId, cached.total);
        return {
          ...cached,
          searchTime: Date.now() - startTime,
          fromCache: true
        };
      }

      console.log(`🔍 Performing global search for: "${query}"`);

      // Perform search across specified types
      const searchPromises = types.map(type => 
        this.searchEntityType(type, cleanQuery, filters[type] || {}, Math.ceil(limit / types.length))
      );

      const typeResults = await Promise.all(searchPromises);

      // Combine and rank results
      const combinedResults = this.combineAndRankResults(typeResults, cleanQuery, sortBy);

      // Add highlights if requested
      if (includeHighlights) {
        combinedResults.forEach(result => {
          result.highlights = this.generateHighlights(result, cleanQuery);
        });
      }

      // Limit final results
      const finalResults = combinedResults.slice(0, limit);

      const searchResults = {
        query,
        results: finalResults,
        total: combinedResults.length,
        searchTime: Date.now() - startTime,
        typeBreakdown: this.getTypeBreakdown(typeResults),
        fromCache: false
      };

      // Cache results
      await cacheService.set(cacheKey, searchResults, this.config.cacheTTL);

      // Record search query
      await this.recordSearchQuery(cleanQuery, userId, searchResults.total);

      return searchResults;
    } catch (error) {
      console.error('❌ Global search error:', error);
      throw error;
    }
  }

  /**
   * Search within a specific entity type
   */
  async searchEntityType(type, query, filters = {}, limit = this.config.defaultLimit) {
    try {
      const typeConfig = this.config.searchTypes[type];
      if (!typeConfig) {
        throw new Error(`Invalid search type: ${type}`);
      }

      // Build search conditions
      const searchConditions = this.buildSearchConditions(typeConfig.searchFields, query);
      
      // Apply filters
      const filterConditions = this.buildFilterConditions(type, filters);

      // Combine conditions
      const whereClause = {
        AND: [
          { OR: searchConditions },
          ...filterConditions
        ]
      };

      // Special handling for users (exclude inactive by default)
      if (type === 'users' && !filters.status) {
        whereClause.AND.push({ status: 'active' });
      }

      // Perform search
      const results = await prisma[typeConfig.table].findMany({
        where: whereClause,
        include: typeConfig.include,
        select: typeConfig.select,
        orderBy: typeConfig.orderBy,
        take: Math.min(limit, this.config.maxLimit)
      });

      // Add metadata to results
      return results.map(result => ({
        ...result,
        searchType: type,
        relevanceScore: this.calculateRelevanceScore(result, query, typeConfig.searchFields)
      }));
    } catch (error) {
      console.error(`❌ Search ${type} error:`, error);
      return [];
    }
  }

  /**
   * Advanced project search with complex filters
   */
  async searchProjects(options = {}) {
    try {
      const {
        query = '',
        status = null,
        type = null,
        priority = null,
        clientId = null,
        projectManagerId = null,
        teamMemberId = null,
        dateRange = null,
        budgetRange = null,
        limit = this.config.defaultLimit,
        offset = 0,
        sortBy = 'relevance'
      } = options;

      const where = { AND: [] };

      // Text search
      if (query && query.trim().length > 0) {
        const searchConditions = this.buildSearchConditions(['name', 'description', 'location'], query);
        where.AND.push({ OR: searchConditions });
      }

      // Status filter
      if (status) {
        if (Array.isArray(status)) {
          where.AND.push({ status: { in: status } });
        } else {
          where.AND.push({ status });
        }
      }

      // Type filter
      if (type) {
        where.AND.push({ type });
      }

      // Priority filter
      if (priority) {
        where.AND.push({ priority });
      }

      // Client filter
      if (clientId) {
        where.AND.push({ clientId });
      }

      // Project manager filter
      if (projectManagerId) {
        where.AND.push({ projectManagerId });
      }

      // Team member filter
      if (teamMemberId) {
        where.AND.push({
          teamMembers: {
            some: { userId: teamMemberId }
          }
        });
      }

      // Date range filter
      if (dateRange && dateRange.start && dateRange.end) {
        where.AND.push({
          createdAt: {
            gte: new Date(dateRange.start),
            lte: new Date(dateRange.end)
          }
        });
      }

      // Budget range filter
      if (budgetRange && (budgetRange.min || budgetRange.max)) {
        const budgetFilter = {};
        if (budgetRange.min) budgetFilter.gte = budgetRange.min;
        if (budgetRange.max) budgetFilter.lte = budgetRange.max;
        where.AND.push({ budget: budgetFilter });
      }

      // Remove empty AND clause
      if (where.AND.length === 0) {
        delete where.AND;
      }

      // Determine order
      let orderBy;
      switch (sortBy) {
        case 'name':
          orderBy = [{ name: 'asc' }];
          break;
        case 'created':
          orderBy = [{ createdAt: 'desc' }];
          break;
        case 'updated':
          orderBy = [{ updatedAt: 'desc' }];
          break;
        case 'budget':
          orderBy = [{ budget: 'desc' }];
          break;
        default:
          orderBy = [{ updatedAt: 'desc' }];
      }

      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where,
          include: {
            client: { select: { id: true, name: true, companyName: true } },
            projectManager: { select: { id: true, firstName: true, lastName: true } },
            creator: { select: { id: true, firstName: true, lastName: true } },
            teamMembers: {
              include: {
                user: { select: { id: true, firstName: true, lastName: true, role: true } }
              }
            },
            _count: {
              select: {
                tasks: true,
                scopeItems: true,
                shopDrawings: true,
                materialSpecs: true
              }
            }
          },
          orderBy,
          take: limit,
          skip: offset
        }),
        prisma.project.count({ where })
      ]);

      return {
        projects,
        total,
        hasMore: offset + limit < total,
        filters: {
          status,
          type,
          priority,
          clientId,
          projectManagerId,
          teamMemberId,
          dateRange,
          budgetRange
        }
      };
    } catch (error) {
      console.error('❌ Advanced project search error:', error);
      throw error;
    }
  }

  /**
   * Smart search with auto-complete and suggestions
   */
  async smartSearch(query, options = {}) {
    try {
      const {
        limit = 10,
        userId = null,
        projectContext = null,
        includeHistory = true
      } = options;

      if (!query || query.trim().length < 1) {
        return {
          suggestions: await this.getSearchSuggestions(userId, projectContext),
          history: includeHistory ? await this.getSearchHistory(userId) : []
        };
      }

      const cleanQuery = query.trim().toLowerCase();

      // Get auto-complete suggestions
      const suggestions = await this.getAutoCompleteSuggestions(cleanQuery, projectContext, limit);

      // Get search history matches
      const historyMatches = includeHistory ? 
        await this.getSearchHistoryMatches(cleanQuery, userId, limit) : [];

      // Check for mention patterns
      const mentionSuggestions = await MentionService.searchMentionableEntities(cleanQuery, {
        types: ['user', 'project', 'scopeItem', 'task'],
        projectId: projectContext,
        limit: 5
      });

      return {
        query,
        suggestions,
        history: historyMatches,
        mentions: mentionSuggestions,
        hasMore: suggestions.length === limit
      };
    } catch (error) {
      console.error('❌ Smart search error:', error);
      throw error;
    }
  }

  /**
   * Build search conditions for PostgreSQL full-text search
   */
  buildSearchConditions(searchFields, query) {
    const conditions = [];

    searchFields.forEach(field => {
      // Exact match (highest priority)
      conditions.push({
        [field]: {
          equals: query,
          mode: 'insensitive'
        }
      });

      // Starts with
      conditions.push({
        [field]: {
          startsWith: query,
          mode: 'insensitive'
        }
      });

      // Contains
      conditions.push({
        [field]: {
          contains: query,
          mode: 'insensitive'
        }
      });
    });

    return conditions;
  }

  /**
   * Build filter conditions based on entity type
   */
  buildFilterConditions(type, filters) {
    const conditions = [];
    const availableFilters = this.config.searchFilters[type] || {};

    Object.entries(filters).forEach(([key, value]) => {
      if (availableFilters[key] && value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          conditions.push({ [key]: { in: value } });
        } else {
          conditions.push({ [key]: value });
        }
      }
    });

    return conditions;
  }

  /**
   * Calculate relevance score for search results
   */
  calculateRelevanceScore(result, query, searchFields) {
    let score = 0;
    const weights = this.config.rankingWeights;

    searchFields.forEach(field => {
      const fieldValue = result[field];
      if (fieldValue && typeof fieldValue === 'string') {
        const lowerValue = fieldValue.toLowerCase();
        const lowerQuery = query.toLowerCase();

        // Exact match
        if (lowerValue === lowerQuery) {
          score += weights.exactMatch;
        }
        // Starts with
        else if (lowerValue.startsWith(lowerQuery)) {
          score += weights.startsWith;
        }
        // Contains
        else if (lowerValue.includes(lowerQuery)) {
          score += weights.contains;
        }
      }
    });

    // Recency bonus
    if (result.updatedAt) {
      const daysSinceUpdate = (Date.now() - new Date(result.updatedAt)) / (1000 * 60 * 60 * 24);
      score += Math.max(0, weights.recent - daysSinceUpdate);
    }

    // Priority bonus for projects and tasks
    if (result.priority) {
      const priorityScores = { urgent: 30, high: 20, medium: 10, low: 5 };
      score += priorityScores[result.priority] || 0;
    }

    return Math.round(score);
  }

  /**
   * Combine and rank results from different entity types
   */
  combineAndRankResults(typeResults, query, sortBy) {
    const combined = typeResults.flat();

    switch (sortBy) {
      case 'relevance':
        return combined.sort((a, b) => b.relevanceScore - a.relevanceScore);
      case 'date':
        return combined.sort((a, b) => {
          const aDate = new Date(a.updatedAt || a.createdAt || 0);
          const bDate = new Date(b.updatedAt || b.createdAt || 0);
          return bDate - aDate;
        });
      case 'name':
        return combined.sort((a, b) => {
          const aName = a.name || a.firstName || a.fileName || '';
          const bName = b.name || b.firstName || b.fileName || '';
          return aName.localeCompare(bName);
        });
      default:
        return combined;
    }
  }

  /**
   * Generate highlights for search results
   */
  generateHighlights(result, query) {
    const highlights = {};
    const searchFields = this.config.searchTypes[result.searchType]?.searchFields || [];

    searchFields.forEach(field => {
      const fieldValue = result[field];
      if (fieldValue && typeof fieldValue === 'string') {
        const highlighted = this.highlightText(fieldValue, query);
        if (highlighted !== fieldValue) {
          highlights[field] = highlighted;
        }
      }
    });

    return highlights;
  }

  /**
   * Highlight query terms in text
   */
  highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Get type breakdown from search results
   */
  getTypeBreakdown(typeResults) {
    const breakdown = {};
    
    typeResults.forEach((results, index) => {
      const type = Object.keys(this.config.searchTypes)[index];
      breakdown[type] = results.length;
    });

    return breakdown;
  }

  /**
   * Get auto-complete suggestions
   */
  async getAutoCompleteSuggestions(query, projectContext, limit) {
    try {
      const suggestions = [];

      // Get project name suggestions
      const projects = await prisma.project.findMany({
        where: {
          name: {
            startsWith: query,
            mode: 'insensitive'
          },
          ...(projectContext && { id: { not: projectContext } })
        },
        select: { id: true, name: true, type: true },
        take: Math.floor(limit / 3)
      });

      projects.forEach(project => {
        suggestions.push({
          type: 'project',
          text: project.name,
          description: `${project.type} project`,
          id: project.id
        });
      });

      // Get user name suggestions
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { firstName: { startsWith: query, mode: 'insensitive' } },
            { lastName: { startsWith: query, mode: 'insensitive' } }
          ],
          status: 'active'
        },
        select: { id: true, firstName: true, lastName: true, role: true },
        take: Math.floor(limit / 3)
      });

      users.forEach(user => {
        suggestions.push({
          type: 'user',
          text: `${user.firstName} ${user.lastName}`,
          description: user.role,
          id: user.id
        });
      });

      // Get task name suggestions
      const tasks = await prisma.task.findMany({
        where: {
          name: {
            startsWith: query,
            mode: 'insensitive'
          },
          status: { not: 'completed' },
          ...(projectContext && { projectId: projectContext })
        },
        select: { id: true, name: true, status: true },
        take: Math.floor(limit / 3)
      });

      tasks.forEach(task => {
        suggestions.push({
          type: 'task',
          text: task.name,
          description: `${task.status} task`,
          id: task.id
        });
      });

      return suggestions.slice(0, limit);
    } catch (error) {
      console.error('❌ Get auto-complete suggestions error:', error);
      return [];
    }
  }

  /**
   * Record search query for analytics and suggestions
   */
  async recordSearchQuery(query, userId, resultCount) {
    try {
      // Store in memory for quick access
      if (!this.searchHistory.has(userId)) {
        this.searchHistory.set(userId, []);
      }

      const userHistory = this.searchHistory.get(userId);
      userHistory.unshift({
        query,
        timestamp: new Date(),
        resultCount
      });

      // Keep only last 50 searches per user
      if (userHistory.length > 50) {
        userHistory.splice(50);
      }

      // Log for analytics
      await auditService.logSystemEvent({
        event: 'search_performed',
        description: `Search performed: "${query}"`,
        metadata: {
          query,
          userId,
          resultCount,
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('❌ Record search query error:', error);
    }
  }

  /**
   * Get search suggestions based on user history and context
   */
  async getSearchSuggestions(userId, projectContext) {
    try {
      const suggestions = [];

      // Recent searches
      if (userId && this.searchHistory.has(userId)) {
        const recentSearches = this.searchHistory.get(userId)
          .slice(0, 5)
          .map(s => ({
            type: 'recent',
            text: s.query,
            description: `${s.resultCount} results`
          }));
        suggestions.push(...recentSearches);
      }

      // Project-specific suggestions
      if (projectContext) {
        const project = await prisma.project.findUnique({
          where: { id: projectContext },
          select: { name: true, type: true }
        });

        if (project) {
          suggestions.push({
            type: 'context',
            text: project.name,
            description: `Current ${project.type} project`
          });
        }
      }

      return suggestions;
    } catch (error) {
      console.error('❌ Get search suggestions error:', error);
      return [];
    }
  }

  /**
   * Get search history for user
   */
  async getSearchHistory(userId, limit = 10) {
    try {
      if (!userId || !this.searchHistory.has(userId)) {
        return [];
      }

      return this.searchHistory.get(userId).slice(0, limit);
    } catch (error) {
      console.error('❌ Get search history error:', error);
      return [];
    }
  }

  /**
   * Get search history matches
   */
  async getSearchHistoryMatches(query, userId, limit = 5) {
    try {
      if (!userId || !this.searchHistory.has(userId)) {
        return [];
      }

      const userHistory = this.searchHistory.get(userId);
      return userHistory
        .filter(item => item.query.toLowerCase().includes(query))
        .slice(0, limit)
        .map(item => ({
          type: 'history',
          text: item.query,
          description: `${item.resultCount} results`,
          timestamp: item.timestamp
        }));
    } catch (error) {
      console.error('❌ Get search history matches error:', error);
      return [];
    }
  }

  /**
   * Get search analytics
   */
  async getSearchAnalytics(options = {}) {
    try {
      const {
        startDate = null,
        endDate = null,
        userId = null
      } = options;

      // This would analyze search patterns, popular queries, etc.
      // For now, return basic statistics
      const totalSearches = Array.from(this.searchHistory.values())
        .flat()
        .filter(search => {
          if (!startDate && !endDate) return true;
          const searchDate = new Date(search.timestamp);
          if (startDate && searchDate < new Date(startDate)) return false;
          if (endDate && searchDate > new Date(endDate)) return false;
          return true;
        }).length;

      const topQueries = this.getTopQueries(startDate, endDate, userId);

      return {
        totalSearches,
        topQueries,
        averageResults: totalSearches > 0 ? 
          Array.from(this.searchHistory.values()).flat().reduce((sum, s) => sum + s.resultCount, 0) / totalSearches : 0
      };
    } catch (error) {
      console.error('❌ Get search analytics error:', error);
      throw error;
    }
  }

  /**
   * Get top search queries
   */
  getTopQueries(startDate, endDate, userId, limit = 10) {
    try {
      const allSearches = userId && this.searchHistory.has(userId) ?
        this.searchHistory.get(userId) :
        Array.from(this.searchHistory.values()).flat();

      const filteredSearches = allSearches.filter(search => {
        if (!startDate && !endDate) return true;
        const searchDate = new Date(search.timestamp);
        if (startDate && searchDate < new Date(startDate)) return false;
        if (endDate && searchDate > new Date(endDate)) return false;
        return true;
      });

      const queryCounts = _.countBy(filteredSearches, 'query');
      
      return Object.entries(queryCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([query, count]) => ({ query, count }));
    } catch (error) {
      console.error('❌ Get top queries error:', error);
      return [];
    }
  }

  /**
   * Clear search cache
   */
  async clearSearchCache() {
    try {
      const patterns = [
        cacheService.generateKey('search', '*'),
        cacheService.generateKey('mention', 'search', '*')
      ];

      for (const pattern of patterns) {
        await cacheService.deletePattern(pattern);
      }

      console.log('✅ Search cache cleared');
    } catch (error) {
      console.error('❌ Clear search cache error:', error);
      throw error;
    }
  }
}

module.exports = new SearchService();