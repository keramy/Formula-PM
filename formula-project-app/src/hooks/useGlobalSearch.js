import { useState, useEffect, useMemo } from 'react';
import { useEnhancedSearch } from './useEnhancedSearch';

export const useGlobalSearch = (searchTerm, options = {}) => {
  const [searchResults, setSearchResults] = useState({
    projects: [],
    tasks: [],
    teamMembers: [],
    shopDrawings: [],
    specifications: [],
    clients: [],
    complianceDocuments: []
  });
  
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const {
    debounceDelay = 300,
    includeModules = ['all'],
    maxResults = 50
  } = options;

  // Mock data for new modules - this will be replaced with actual API calls
  const mockShopDrawings = [
    {
      id: 'SD001',
      fileName: 'Kitchen_Cabinets_Rev_C.pdf',
      drawingType: 'Kitchen Cabinets',
      room: 'Kitchen',
      projectName: 'Downtown Office Renovation',
      status: 'approved',
      version: 'Rev C',
      uploadDate: '2025-06-15'
    },
    {
      id: 'SD002', 
      fileName: 'Bathroom_Vanity_Rev_A.pdf',
      drawingType: 'Bathroom Vanity',
      room: 'Bathroom',
      projectName: 'Downtown Office Renovation',
      status: 'pending',
      version: 'Rev A',
      uploadDate: '2025-06-14'
    },
    {
      id: 'SD003',
      fileName: 'Reception_Desk_Rev_B.pdf',
      drawingType: 'Reception Desk',
      room: 'Reception',
      projectName: 'Medical Office Fit-out',
      status: 'revision_required',
      version: 'Rev B',
      uploadDate: '2025-06-13'
    }
  ];

  const mockSpecifications = [
    {
      id: 'SPEC001',
      itemId: 'SPEC001',
      description: 'Upper Cabinet - 30" Wide',
      category: 'Kitchen Cabinets',
      material: 'Maple Hardwood',
      finish: 'Natural Stain',
      projectName: 'Downtown Office Renovation',
      totalCost: '$1,800.00',
      status: 'approved'
    },
    {
      id: 'SPEC002',
      itemId: 'SPEC002',
      description: 'Base Cabinet with Drawers',
      category: 'Kitchen Cabinets',
      material: 'Maple Hardwood',
      finish: 'Natural Stain',
      projectName: 'Downtown Office Renovation',
      totalCost: '$3,900.00',
      status: 'approved'
    },
    {
      id: 'SPEC003',
      itemId: 'SPEC003',
      description: 'Reception Desk - Custom',
      category: 'Reception Furniture',
      material: 'White Oak Veneer',
      finish: 'Clear Lacquer',
      projectName: 'Medical Office Fit-out',
      totalCost: '$2,800.00',
      status: 'pending'
    }
  ];

  const mockComplianceDocuments = [
    {
      id: 'COMP001',
      name: 'Building Permit',
      type: 'permit',
      status: 'approved',
      projectName: 'Downtown Office Renovation',
      issuingAuthority: 'City Building Department',
      permitNumber: 'BP-2025-0542',
      issueDate: '2025-05-15'
    },
    {
      id: 'COMP002',
      name: 'Fire Safety Compliance',
      type: 'permit',
      status: 'pending',
      projectName: 'Downtown Office Renovation',
      issuingAuthority: 'Fire Department',
      applicationNumber: 'FS-2025-0123',
      submitDate: '2025-06-10'
    },
    {
      id: 'COMP003',
      name: 'Framing Inspection',
      type: 'inspection',
      status: 'completed',
      projectName: 'Downtown Office Renovation',
      inspector: 'John Mitchell',
      completedDate: '2025-05-20'
    }
  ];

  // Use the existing enhanced search for basic modules
  const { 
    searchResults: basicResults, 
    isSearching: basicLoading 
  } = useEnhancedSearch(searchTerm, debounceDelay);

  // Debounced search function
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults({
        projects: [],
        tasks: [],
        teamMembers: [],
        shopDrawings: [],
        specifications: [],
        clients: [],
        complianceDocuments: []
      });
      setTotalResults(0);
      setLoading(false);
      return;
    }

    setLoading(true);

    const searchTimeout = setTimeout(() => {
      const term = searchTerm.toLowerCase();
      
      // Search shop drawings
      const filteredDrawings = mockShopDrawings.filter(drawing =>
        drawing.fileName.toLowerCase().includes(term) ||
        drawing.drawingType.toLowerCase().includes(term) ||
        drawing.room.toLowerCase().includes(term) ||
        drawing.projectName.toLowerCase().includes(term)
      );

      // Search specifications
      const filteredSpecs = mockSpecifications.filter(spec =>
        spec.itemId.toLowerCase().includes(term) ||
        spec.description.toLowerCase().includes(term) ||
        spec.category.toLowerCase().includes(term) ||
        spec.material.toLowerCase().includes(term) ||
        spec.projectName.toLowerCase().includes(term)
      );

      // Search compliance documents
      const filteredCompliance = mockComplianceDocuments.filter(doc =>
        doc.name.toLowerCase().includes(term) ||
        doc.type.toLowerCase().includes(term) ||
        doc.projectName.toLowerCase().includes(term) ||
        doc.issuingAuthority?.toLowerCase().includes(term) ||
        doc.permitNumber?.toLowerCase().includes(term)
      );

      // Combine with basic search results
      const results = {
        projects: basicResults.projects || [],
        tasks: basicResults.tasks || [],
        teamMembers: basicResults.teamMembers || [],
        clients: basicResults.clients || [],
        shopDrawings: filteredDrawings.slice(0, maxResults),
        specifications: filteredSpecs.slice(0, maxResults),
        complianceDocuments: filteredCompliance.slice(0, maxResults)
      };

      // Filter by included modules
      if (includeModules[0] !== 'all') {
        Object.keys(results).forEach(key => {
          if (!includeModules.includes(key)) {
            results[key] = [];
          }
        });
      }

      setSearchResults(results);
      
      // Calculate total results
      const total = Object.values(results).reduce((sum, items) => sum + items.length, 0);
      setTotalResults(total);
      setLoading(false);
    }, debounceDelay);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, debounceDelay, includeModules, maxResults, basicResults]);

  // Group results by category with metadata
  const groupedResults = useMemo(() => {
    const groups = [];

    if (searchResults.projects.length > 0) {
      groups.push({
        category: 'Projects',
        icon: 'FolderOpen',
        color: '#1976d2',
        items: searchResults.projects.map(item => ({
          ...item,
          type: 'project',
          primaryText: item.name,
          secondaryText: `${item.type || 'Project'} • ${item.status || 'Active'}`,
          metadata: item.description
        }))
      });
    }

    if (searchResults.shopDrawings.length > 0) {
      groups.push({
        category: 'Shop Drawings',
        icon: 'Architecture',
        color: '#1976d2',
        items: searchResults.shopDrawings.map(item => ({
          ...item,
          type: 'shop-drawing',
          primaryText: item.fileName,
          secondaryText: `${item.drawingType} • ${item.room} • ${item.version}`,
          metadata: `${item.projectName} • ${item.status}`
        }))
      });
    }

    if (searchResults.specifications.length > 0) {
      groups.push({
        category: 'Material Specifications',
        icon: 'Inventory',
        color: '#388e3c',
        items: searchResults.specifications.map(item => ({
          ...item,
          type: 'specification',
          primaryText: `${item.itemId} - ${item.description}`,
          secondaryText: `${item.category} • ${item.material}`,
          metadata: `${item.projectName} • ${item.totalCost}`
        }))
      });
    }

    if (searchResults.tasks.length > 0) {
      groups.push({
        category: 'Tasks',
        icon: 'Assignment',
        color: '#f57c00',
        items: searchResults.tasks.map(item => ({
          ...item,
          type: 'task',
          primaryText: item.name,
          secondaryText: `${item.projectName || 'No Project'} • ${item.status}`,
          metadata: item.dueDate ? `Due: ${item.dueDate}` : 'No due date'
        }))
      });
    }

    if (searchResults.teamMembers.length > 0) {
      groups.push({
        category: 'Team Members',
        icon: 'People',
        color: '#7b1fa2',
        items: searchResults.teamMembers.map(item => ({
          ...item,
          type: 'team-member',
          primaryText: item.name,
          secondaryText: `${item.role || 'Team Member'} • ${item.department || 'General'}`,
          metadata: item.email
        }))
      });
    }

    if (searchResults.clients.length > 0) {
      groups.push({
        category: 'Clients',
        icon: 'Business',
        color: '#5d4037',
        items: searchResults.clients.map(item => ({
          ...item,
          type: 'client',
          primaryText: item.name,
          secondaryText: `${item.company || 'Individual'} • ${item.type || 'Client'}`,
          metadata: item.email
        }))
      });
    }

    if (searchResults.complianceDocuments.length > 0) {
      groups.push({
        category: 'Compliance Documents',
        icon: 'Description',
        color: '#d32f2f',
        items: searchResults.complianceDocuments.map(item => ({
          ...item,
          type: 'compliance',
          primaryText: item.name,
          secondaryText: `${item.type} • ${item.status}`,
          metadata: `${item.projectName} • ${item.issuingAuthority || item.inspector || 'Authority'}`
        }))
      });
    }

    return groups;
  }, [searchResults]);

  // Get quick stats
  const searchStats = useMemo(() => ({
    totalResults,
    byCategory: {
      projects: searchResults.projects.length,
      shopDrawings: searchResults.shopDrawings.length,
      specifications: searchResults.specifications.length,
      tasks: searchResults.tasks.length,
      teamMembers: searchResults.teamMembers.length,
      clients: searchResults.clients.length,
      compliance: searchResults.complianceDocuments.length
    },
    hasResults: totalResults > 0,
    isSearching: loading || basicLoading
  }), [searchResults, totalResults, loading, basicLoading]);

  // Navigation helpers
  const navigateToResult = (result) => {
    switch (result.type) {
      case 'project':
        return `/projects/${result.id}`;
      case 'shop-drawing':
        return `/shop-drawings?project=${result.projectId}&drawing=${result.id}`;
      case 'specification':
        return `/specifications?project=${result.projectId}&spec=${result.id}`;
      case 'task':
        return `/tasks/${result.id}`;
      case 'team-member':
        return `/team/${result.id}`;
      case 'client':
        return `/clients/${result.id}`;
      case 'compliance':
        return `/projects/${result.projectId}/compliance#${result.id}`;
      default:
        return '/';
    }
  };

  const getResultIcon = (result) => {
    switch (result.type) {
      case 'project': return 'FolderOpen';
      case 'shop-drawing': return 'Architecture';
      case 'specification': return 'Inventory';
      case 'task': return 'Assignment';
      case 'team-member': return 'Person';
      case 'client': return 'Business';
      case 'compliance': return 'Description';
      default: return 'Search';
    }
  };

  return {
    searchResults,
    groupedResults,
    searchStats,
    loading: loading || basicLoading,
    navigateToResult,
    getResultIcon,
    
    // Helper functions
    clearResults: () => {
      setSearchResults({
        projects: [],
        tasks: [],
        teamMembers: [],
        shopDrawings: [],
        specifications: [],
        clients: [],
        complianceDocuments: []
      });
      setTotalResults(0);
    },
    
    getResultsByType: (type) => searchResults[type] || [],
    
    getTopResults: (limit = 5) => {
      const allResults = Object.values(searchResults).flat();
      return allResults.slice(0, limit);
    }
  };
};

export default useGlobalSearch;