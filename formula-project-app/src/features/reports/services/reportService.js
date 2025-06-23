/**
 * Report Service - Handles all report-related API operations
 * Advanced reporting system for Formula PM
 */

import { generateUniqueId } from '../../../utils/generators/idGenerator';

class ReportService {
  constructor() {
    this.reports = new Map();
    this.initialized = false;
    this.init();
  }

  init() {
    // Initialize with demo data
    const demoReports = this.generateDemoReports();
    demoReports.forEach(report => {
      this.reports.set(report.id, report);
    });
    this.initialized = true;
  }

  // Get all reports for a project
  async getReportsByProject(projectId) {
    const projectReports = Array.from(this.reports.values())
      .filter(report => report.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return Promise.resolve(projectReports);
  }

  // Get a specific report by ID
  async getReport(reportId) {
    const report = this.reports.get(reportId);
    return Promise.resolve(report || null);
  }

  // Create a new report
  async createReport(reportData, projectData = null) {
    const newReport = {
      id: generateUniqueId('RPT'),
      ...reportData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: 'draft',
      sections: reportData.sections || [this.createDefaultSection()],
      metadata: {
        reportNumber: await this.generateReportNumber(reportData.projectId, projectData),
        reportDate: new Date().toISOString().split('T')[0],
        ...reportData.metadata
      },
      exportSettings: {
        includeProjectDetails: true,
        includeCoverPage: true,
        includeTableOfContents: true,
        imageQuality: 'high',
        pageSize: 'A4',
        orientation: 'portrait',
        ...reportData.exportSettings
      }
    };

    this.reports.set(newReport.id, newReport);
    return Promise.resolve(newReport);
  }

  // Update an existing report
  async updateReport(reportId, updates) {
    const existingReport = this.reports.get(reportId);
    if (!existingReport) {
      throw new Error('Report not found');
    }

    const updatedReport = {
      ...existingReport,
      ...updates,
      lastModified: new Date().toISOString()
    };

    this.reports.set(reportId, updatedReport);
    return Promise.resolve(updatedReport);
  }

  // Delete a report
  async deleteReport(reportId) {
    const deleted = this.reports.delete(reportId);
    return Promise.resolve(deleted);
  }

  // Add a new section to a report
  async addSection(reportId, sectionData) {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    const newSection = {
      id: generateUniqueId('SEC'),
      order: report.sections.length + 1,
      lines: [],
      ...sectionData
    };

    report.sections.push(newSection);
    report.lastModified = new Date().toISOString();
    
    this.reports.set(reportId, report);
    return Promise.resolve(newSection);
  }

  // Add a new line to a section
  async addLine(reportId, sectionId, lineData) {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    const section = report.sections.find(s => s.id === sectionId);
    if (!section) {
      throw new Error('Section not found');
    }

    const newLine = {
      id: generateUniqueId('LINE'),
      order: section.lines.length + 1,
      title: '',
      description: '',
      images: [],
      tags: [],
      category: 'general',
      ...lineData
    };

    section.lines.push(newLine);
    report.lastModified = new Date().toISOString();
    
    this.reports.set(reportId, report);
    return Promise.resolve(newLine);
  }

  // Update a specific line
  async updateLine(reportId, sectionId, lineId, updates) {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    const section = report.sections.find(s => s.id === sectionId);
    if (!section) {
      throw new Error('Section not found');
    }

    const lineIndex = section.lines.findIndex(l => l.id === lineId);
    if (lineIndex === -1) {
      throw new Error('Line not found');
    }

    section.lines[lineIndex] = {
      ...section.lines[lineIndex],
      ...updates
    };

    report.lastModified = new Date().toISOString();
    this.reports.set(reportId, report);
    
    return Promise.resolve(section.lines[lineIndex]);
  }

  // Upload image for a specific line
  async uploadImage(reportId, sectionId, lineId, imageFile, caption = '') {
    // Simulate image upload
    const imageData = {
      id: generateUniqueId('IMG'),
      fileName: `${Date.now()}_${imageFile.name}`,
      originalName: imageFile.name,
      fileSize: imageFile.size,
      mimeType: imageFile.type,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(imageFile), // For demo purposes
      thumbnail: URL.createObjectURL(imageFile), // For demo purposes
      caption: caption,
      metadata: {
        width: 1920, // Would be extracted from actual image
        height: 1080,
        timestamp: new Date().toISOString()
      }
    };

    const report = this.reports.get(reportId);
    const section = report.sections.find(s => s.id === sectionId);
    const line = section.lines.find(l => l.id === lineId);
    
    line.images.push(imageData);
    report.lastModified = new Date().toISOString();
    
    this.reports.set(reportId, report);
    return Promise.resolve(imageData);
  }

  // Generate report templates
  getReportTemplates() {
    return [
      {
        id: 'progress-weekly',
        name: 'Weekly Progress Report',
        description: 'Standard weekly progress report template',
        type: 'progress',
        sections: [
          { title: 'Executive Summary', type: 'summary' },
          { title: 'Work Completed', type: 'progress' },
          { title: 'Upcoming Work', type: 'planning' },
          { title: 'Issues & Concerns', type: 'issues' },
          { title: 'Photos & Documentation', type: 'media' }
        ]
      },
      {
        id: 'quality-inspection',
        name: 'Quality Inspection Report',
        description: 'Quality control inspection template',
        type: 'quality',
        sections: [
          { title: 'Inspection Overview', type: 'summary' },
          { title: 'Quality Checkpoints', type: 'checklist' },
          { title: 'Non-Conformances', type: 'issues' },
          { title: 'Corrective Actions', type: 'actions' },
          { title: 'Evidence Photos', type: 'media' }
        ]
      },
      {
        id: 'issue-report',
        name: 'Issue/Problem Report',
        description: 'Document and track project issues',
        type: 'issue',
        sections: [
          { title: 'Issue Description', type: 'summary' },
          { title: 'Root Cause Analysis', type: 'analysis' },
          { title: 'Impact Assessment', type: 'impact' },
          { title: 'Resolution Plan', type: 'actions' },
          { title: 'Supporting Documentation', type: 'media' }
        ]
      }
    ];
  }

  // Helper methods
  createDefaultSection() {
    return {
      id: generateUniqueId('SEC'),
      title: 'New Section',
      type: 'general',
      order: 1,
      lines: [
        {
          id: generateUniqueId('LINE'),
          order: 1,
          description: '',
          images: [],
          tags: [],
          category: 'general'
        }
      ]
    };
  }

  async generateReportNumber(projectId, projectData = null) {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      
      // Get project data if not provided
      let project = projectData;
      if (!project && projectId) {
        // Try to fetch project data (fallback to demo data for now)
        project = await this.getProjectData(projectId);
      }
      
      // Generate project initials
      const projectInitials = this.generateProjectInitials(project?.name || 'Unknown Project');
      
      // Get sequence number for this project
      const projectReports = Array.from(this.reports.values())
        .filter(report => report.projectId === projectId);
      const sequence = projectReports.length + 1;
      
      return `${projectInitials}-RPT-${year}-${month}-${String(sequence).padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating report number:', error);
      // Fallback to old format
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const sequence = Array.from(this.reports.values()).length + 1;
      return `RPT-${year}-${month}-${String(sequence).padStart(3, '0')}`;
    }
  }

  generateProjectInitials(projectName) {
    if (!projectName || projectName === 'Unknown Project') {
      return 'PRJ';
    }

    // Clean the project name and split into words
    const cleanName = projectName
      .replace(/[^\w\s]/g, '') // Remove special characters
      .trim();
    
    const words = cleanName.split(/\s+/)
      .filter(word => word.length > 0)
      .filter(word => !['the', 'and', 'of', 'at', 'in', 'on', 'to', 'for', 'a', 'an'].includes(word.toLowerCase()));

    if (words.length === 0) {
      return 'PRJ';
    }

    let initials = '';
    
    if (words.length === 1) {
      // Single word: take first 3 characters
      initials = words[0].substring(0, 3).toUpperCase();
    } else if (words.length === 2) {
      // Two words: take first 2 chars of first, 1 char of second
      initials = (words[0].substring(0, 2) + words[1].substring(0, 1)).toUpperCase();
    } else {
      // Multiple words: take first character of first 3 words
      initials = words.slice(0, 3)
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();
    }

    // Ensure we have at least 2 characters and max 4
    initials = initials.substring(0, 4);
    if (initials.length < 2) {
      initials = (initials + 'XX').substring(0, 3);
    }

    return initials;
  }

  async getProjectData(projectId) {
    // For demo purposes, return mock project data
    // In real implementation, this would fetch from API
    const mockProjects = {
      '2001': { name: 'One Sixty Sixth Street Residential' },
      '2002': { name: 'Sophisticated Hotel Manhattan' },
      '2003': { name: 'Corporate Office Building Brooklyn' },
      '2004': { name: 'Luxury Apartment Complex Queens' },
      '2005': { name: 'Modern Shopping Center Bronx' }
    };

    return mockProjects[projectId] || { name: 'Unknown Project' };
  }

  generateDemoReports() {
    return [
      {
        id: 'RPT001',
        projectId: '2001',
        title: 'Weekly Progress Report - Week 3',
        type: 'progress',
        status: 'published',
        createdBy: '1001',
        createdAt: '2025-01-21T09:00:00Z',
        lastModified: '2025-01-21T15:30:00Z',
        metadata: {
          reportNumber: 'OSS-RPT-2025-01-001',
          reportDate: '2025-01-21',
          reportPeriod: { from: '2025-01-15', to: '2025-01-21' },
          projectPhase: 'construction',
          weather: 'Sunny, 22°C',
          workingHours: '7:00 AM - 4:00 PM'
        },
        sections: [
          {
            id: 'SEC001',
            title: 'Executive Summary',
            type: 'summary',
            order: 1,
            lines: [
              {
                id: 'LINE001',
                order: 1,
                description: 'Project is progressing well with 75% completion achieved. All major milestones are on track and within budget constraints.',
                images: [],
                tags: ['milestone', 'on-track'],
                category: 'progress'
              }
            ]
          },
          {
            id: 'SEC002',
            title: 'Work Completed This Week',
            type: 'progress',
            order: 2,
            lines: [
              {
                id: 'LINE002',
                order: 1,
                description: 'Completed installation of executive kitchen upper cabinets with LED lighting system. All electrical connections tested and verified.',
                images: [],
                tags: ['completed', 'electrical'],
                category: 'milestone'
              },
              {
                id: 'LINE003',
                order: 2,
                description: 'Finished marble countertop installation in executive kitchen area. Quality inspection passed with no defects noted.',
                images: [],
                tags: ['completed', 'quality'],
                category: 'milestone'
              }
            ]
          }
        ],
        exportSettings: {
          includeProjectDetails: true,
          includeCoverPage: true,
          includeTableOfContents: true,
          imageQuality: 'high',
          pageSize: 'A4',
          orientation: 'portrait'
        }
      }
    ];
  }
}

export default new ReportService();