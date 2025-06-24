/**
 * Mention Service - Handles @ mentions, entity resolution, and navigation
 * Provides autocomplete data and navigation routing for smart text features
 */

import { generateUniqueId } from '../utils/generators/idGenerator';

class MentionService {
  constructor() {
    this.entityCache = new Map();
    this.searchHistory = [];
  }

  /**
   * Get all available entities for autocomplete based on context
   */
  async getEntitiesForAutocomplete(query = '', projectId = null, categories = ['all']) {
    try {
      const entities = [];

      // Get entities from different sources
      if (categories.includes('all') || categories.includes('scope')) {
        entities.push(...await this.getScopeEntities(projectId, query));
      }
      
      if (categories.includes('all') || categories.includes('drawing')) {
        entities.push(...await this.getDrawingEntities(projectId, query));
      }
      
      // Only include other projects if no specific project is selected
      if ((categories.includes('all') || categories.includes('project')) && !projectId) {
        entities.push(...await this.getProjectEntities(query));
      }
      
      if (categories.includes('all') || categories.includes('report')) {
        entities.push(...await this.getReportEntities(projectId, query));
      }
      
      if (categories.includes('all') || categories.includes('task')) {
        entities.push(...await this.getTaskEntities(projectId, query));
      }
      
      if (categories.includes('all') || categories.includes('member')) {
        entities.push(...await this.getMemberEntities(query));
      }
      
      if (categories.includes('all') || categories.includes('spec')) {
        entities.push(...await this.getSpecEntities(projectId, query));
      }

      // Filter and sort by relevance
      return this.filterAndSortEntities(entities, query);
    } catch (error) {
      console.error('Error getting entities for autocomplete:', error);
      return [];
    }
  }

  /**
   * Get scope entities from project data
   */
  async getScopeEntities(projectId, query = '') {
    // Return empty if no project context
    if (!projectId) return [];
    
    // Mock scope data - in real implementation, fetch from API based on projectId
    const mockScopeItems = [
      { id: 'SCOPE001', name: 'Kitchen Upper Cabinets', description: 'Maple hardwood with LED lighting' },
      { id: 'SCOPE002', name: 'Bathroom Vanity Units', description: 'Custom marble countertops' },
      { id: 'SCOPE003', name: 'Executive Reception Desk', description: 'Technology integration' },
      { id: 'SCOPE004', name: 'Conference Room Built-ins', description: 'AV system integration' },
      { id: 'SCOPE005', name: 'Electric Panel Installation', description: 'Main distribution panel' }
    ];

    return mockScopeItems
      .filter(item => !query || item.name.toLowerCase().includes(query.toLowerCase()))
      .map(item => ({
        id: item.id,
        type: 'scope',
        name: item.name,
        description: item.description,
        projectId: projectId,
        icon: '🔧',
        category: 'Scope Items',
        searchText: `${item.name} ${item.description}`.toLowerCase()
      }));
  }

  /**
   * Get drawing entities from project data
   */
  async getDrawingEntities(projectId, query = '') {
    // Return empty if no project context
    if (!projectId) return [];
    
    // Mock drawing data - in real implementation, fetch from API based on projectId
    const mockDrawings = [
      { id: 'SD001', name: 'Kitchen_Upper_Cabinets_Rev_C.pdf', type: 'Shop Drawing' },
      { id: 'SD002', name: 'Executive_Reception_Desk_Rev_B.pdf', type: 'Shop Drawing' },
      { id: 'SD003', name: 'Data_Center_HVAC_System_Rev_A.pdf', type: 'Technical Drawing' },
      { id: 'SD004', name: 'Main_Electrical_Distribution_Rev_A.pdf', type: 'Electrical Drawing' },
      { id: 'SD005', name: 'Bathroom_Vanity_Details_Rev_A.pdf', type: 'Detail Drawing' }
    ];

    return mockDrawings
      .filter(item => !query || item.name.toLowerCase().includes(query.toLowerCase()))
      .map(item => ({
        id: item.id,
        type: 'drawing',
        name: item.name,
        description: item.type,
        projectId: projectId,
        icon: '📋',
        category: 'Shop Drawings',
        searchText: `${item.name} ${item.type}`.toLowerCase()
      }));
  }

  /**
   * Get project entities
   */
  async getProjectEntities(query = '') {
    // Mock project data
    const mockProjects = [
      { id: '2001', name: 'Akbank Head Office Renovation', type: 'Commercial' },
      { id: '2002', name: 'Garanti BBVA Tech Center MEP', type: 'Technology' },
      { id: '2003', name: 'Zorlu Center Luxury Retail Fit-out', type: 'Retail' },
      { id: '2004', name: 'Formula HQ Showroom & Office', type: 'Corporate' },
      { id: '2005', name: 'Tekfen Plaza Office Modernization', type: 'Office' }
    ];

    return mockProjects
      .filter(item => !query || item.name.toLowerCase().includes(query.toLowerCase()))
      .map(item => ({
        id: item.id,
        type: 'project',
        name: item.name,
        description: item.type,
        icon: '🏢',
        category: 'Projects',
        searchText: `${item.name} ${item.type}`.toLowerCase()
      }));
  }

  /**
   * Get report entities from project data
   */
  async getReportEntities(projectId, query = '') {
    // Return empty if no project context
    if (!projectId) return [];
    
    // Mock report data - in real implementation, fetch from API based on projectId
    const mockReports = [
      { id: 'RPT-001', title: 'Weekly Progress Report - Week 12', type: 'Progress Report' },
      { id: 'RPT-002', title: 'Quality Inspection Report - Kitchen Cabinets', type: 'Quality Report' },
      { id: 'RPT-003', title: 'Issue Report - Electrical Systems', type: 'Issue Report' },
      { id: 'RPT-004', title: 'Material Delivery Report - Week 11', type: 'Progress Report' }
    ];

    return mockReports
      .filter(item => !query || item.title.toLowerCase().includes(query.toLowerCase()))
      .map(item => ({
        id: item.id,
        type: 'report',
        name: item.title,
        description: item.type,
        projectId: projectId,
        icon: '📄',
        category: 'Reports',
        searchText: `${item.title} ${item.type}`.toLowerCase()
      }));
  }

  /**
   * Get task entities from project data
   */
  async getTaskEntities(projectId, query = '') {
    // Return empty if no project context
    if (!projectId) return [];
    
    // Mock task data - in real implementation, fetch from API based on projectId
    const mockTasks = [
      { id: 'TASK001', name: 'Foundation inspection', status: 'completed' },
      { id: 'TASK002', name: 'Executive Kitchen Cabinet Design Review', status: 'in_progress' },
      { id: 'TASK003', name: 'Material Procurement - Kitchen Cabinets', status: 'completed' },
      { id: 'TASK004', name: 'HVAC System Design - Data Center', status: 'pending' }
    ];

    return mockTasks
      .filter(item => !query || item.name.toLowerCase().includes(query.toLowerCase()))
      .map(item => ({
        id: item.id,
        type: 'task',
        name: item.name,
        description: `Status: ${item.status}`,
        projectId: projectId,
        icon: '✅',
        category: 'Tasks',
        searchText: `${item.name} ${item.status}`.toLowerCase()
      }));
  }

  /**
   * Get team member entities
   */
  async getMemberEntities(query = '') {
    // Mock team member data
    const mockMembers = [
      { id: 'TM001', name: 'Kubilay Ilgın', role: 'Project Manager' },
      { id: 'TM002', name: 'Hande Selen Karaman', role: 'Design Lead' },
      { id: 'TM003', name: 'Emre Koc', role: 'MEP Engineer' },
      { id: 'TM004', name: 'Serra Uluveren', role: 'Procurement Specialist' },
      { id: 'TM005', name: 'Ömer Onan', role: 'Construction Manager' }
    ];

    return mockMembers
      .filter(item => !query || item.name.toLowerCase().includes(query.toLowerCase()))
      .map(item => ({
        id: item.id,
        type: 'member',
        name: item.name,
        description: item.role,
        icon: '👤',
        category: 'Team Members',
        searchText: `${item.name} ${item.role}`.toLowerCase()
      }));
  }

  /**
   * Get material specification entities
   */
  async getSpecEntities(projectId, query = '') {
    // Return empty if no project context
    if (!projectId) return [];
    
    // Mock specification data - in real implementation, fetch from API based on projectId
    const mockSpecs = [
      { id: 'SPEC001', name: 'Maple Wood Grade A', category: 'Wood Materials' },
      { id: 'SPEC002', name: 'LED Strip Lighting - Warm White', category: 'Electrical' },
      { id: 'SPEC003', name: 'Marble Countertop - Carrara White', category: 'Stone Materials' },
      { id: 'SPEC004', name: 'HVAC Unit - 20 Ton Precision Air', category: 'Mechanical' }
    ];

    return mockSpecs
      .filter(item => !query || item.name.toLowerCase().includes(query.toLowerCase()))
      .map(item => ({
        id: item.id,
        type: 'spec',
        name: item.name,
        description: item.category,
        projectId: projectId,
        icon: '📋',
        category: 'Material Specs',
        searchText: `${item.name} ${item.category}`.toLowerCase()
      }));
  }

  /**
   * Filter and sort entities by relevance to query
   */
  filterAndSortEntities(entities, query = '') {
    if (!query) return entities;

    const queryLower = query.toLowerCase();
    
    return entities
      .map(entity => ({
        ...entity,
        relevanceScore: this.calculateRelevance(entity, queryLower)
      }))
      .filter(entity => entity.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 20); // Limit to top 20 results
  }

  /**
   * Calculate relevance score for sorting
   */
  calculateRelevance(entity, query) {
    const name = entity.name.toLowerCase();
    const searchText = entity.searchText || name;
    
    // Exact match gets highest score
    if (name === query) return 100;
    
    // Starts with query gets high score
    if (name.startsWith(query)) return 80;
    
    // Contains query gets medium score
    if (searchText.includes(query)) return 60;
    
    // Fuzzy match gets low score
    if (this.fuzzyMatch(searchText, query)) return 30;
    
    return 0;
  }

  /**
   * Simple fuzzy matching
   */
  fuzzyMatch(text, query) {
    let textIndex = 0;
    let queryIndex = 0;
    
    while (textIndex < text.length && queryIndex < query.length) {
      if (text[textIndex] === query[queryIndex]) {
        queryIndex++;
      }
      textIndex++;
    }
    
    return queryIndex === query.length;
  }

  /**
   * Parse text and extract mentions
   */
  parseMentions(text) {
    const mentionRegex = /@(\w+):([^@\s]+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push({
        type: match[1],
        name: match[2],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        fullMatch: match[0]
      });
    }

    return mentions;
  }

  /**
   * Create mention string
   */
  createMention(type, name) {
    return `@${type}:${name}`;
  }

  /**
   * Get navigation info for entity
   */
  getNavigationInfo(type, entityId, projectId = null) {
    const routes = {
      scope: `/projects/${projectId}/scope/${entityId}`,
      drawing: `/projects/${projectId}/drawings/${entityId}`,
      project: `/projects/${entityId}`,
      report: `/projects/${projectId}/reports/${entityId}`,
      task: `/projects/${projectId}/tasks/${entityId}`,
      member: `/team/${entityId}`,
      spec: `/projects/${projectId}/specifications/${entityId}`
    };

    return {
      path: routes[type] || '/',
      type: type,
      entityId: entityId,
      projectId: projectId
    };
  }

  /**
   * Add to search history
   */
  addToSearchHistory(entity) {
    this.searchHistory.unshift(entity);
    this.searchHistory = this.searchHistory.slice(0, 10); // Keep last 10 searches
  }

  /**
   * Get recent searches
   */
  getRecentSearches() {
    return this.searchHistory;
  }
}

// Create and export singleton instance
const mentionService = new MentionService();
export default mentionService;