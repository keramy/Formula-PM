// Shop Drawing Service - API integration for shop drawings
import apiService from '../../../services/api/apiService';

class ShopDrawingService {
  constructor() {
    this.baseUrl = '/api/shop-drawings';
  }

  // Get all shop drawings
  async getAllDrawings() {
    try {
      const response = await apiService.get(`${this.baseUrl}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shop drawings:', error);
      // Return mock data for development
      return this.getMockDrawings();
    }
  }

  // Get drawings by project
  async getDrawingsByProject(projectId) {
    try {
      const response = await apiService.get(`${this.baseUrl}/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project drawings:', error);
      return this.getMockDrawings().filter(d => d.projectId === projectId);
    }
  }

  // Get single drawing
  async getDrawing(drawingId) {
    try {
      const response = await apiService.get(`${this.baseUrl}/${drawingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching drawing:', error);
      return this.getMockDrawings().find(d => d.id === drawingId);
    }
  }

  // Upload new drawing
  async uploadDrawing(formData) {
    try {
      const response = await apiService.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading drawing:', error);
      throw error;
    }
  }

  // Update drawing details
  async updateDrawing(drawingId, updates) {
    try {
      const response = await apiService.put(`${this.baseUrl}/${drawingId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating drawing:', error);
      throw error;
    }
  }

  // Update drawing status
  async updateDrawingStatus(drawingId, status, notes = '') {
    try {
      const response = await apiService.patch(`${this.baseUrl}/${drawingId}/status`, {
        status,
        notes,
        approvedBy: 'Current User', // This should come from auth context
        approvalDate: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating drawing status:', error);
      throw error;
    }
  }

  // Add new revision
  async addRevision(drawingId, revisionData) {
    try {
      const response = await apiService.post(`${this.baseUrl}/${drawingId}/revisions`, revisionData);
      return response.data;
    } catch (error) {
      console.error('Error adding revision:', error);
      throw error;
    }
  }

  // Delete drawing
  async deleteDrawing(drawingId) {
    try {
      const response = await apiService.delete(`${this.baseUrl}/${drawingId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting drawing:', error);
      throw error;
    }
  }

  // Get drawing file URL
  getDrawingFileUrl(drawingId, version = 'latest') {
    return `${this.baseUrl}/${drawingId}/file/${version}`;
  }

  // Mock data for development
  getMockDrawings() {
    return [
      {
        id: 'SD001',
        fileName: 'Kitchen_Cabinets_Rev_C.pdf',
        projectId: 'P001',
        projectName: 'Downtown Office Renovation',
        drawingType: 'Kitchen Cabinets',
        room: 'Kitchen',
        version: 'Rev C',
        status: 'approved',
        uploadDate: '2025-06-15',
        uploadedBy: 'John Smith',
        approvedBy: 'Mike Johnson',
        approvalDate: '2025-06-16',
        fileSize: '2.4 MB',
        pdfUrl: '/mock-pdfs/kitchen-cabinets-rev-c.pdf',
        revisions: [
          { 
            version: 'Rev A', 
            date: '2025-06-10', 
            status: 'rejected', 
            notes: 'Dimensions incorrect',
            uploadedBy: 'John Smith'
          },
          { 
            version: 'Rev B', 
            date: '2025-06-12', 
            status: 'pending', 
            notes: 'Under review',
            uploadedBy: 'John Smith'
          },
          { 
            version: 'Rev C', 
            date: '2025-06-15', 
            status: 'approved', 
            notes: 'Approved for production',
            uploadedBy: 'John Smith',
            approvedBy: 'Mike Johnson'
          }
        ]
      },
      {
        id: 'SD002',
        fileName: 'Bathroom_Vanity_Rev_A.pdf',
        projectId: 'P001',
        projectName: 'Downtown Office Renovation',
        drawingType: 'Bathroom Vanity',
        room: 'Bathroom',
        version: 'Rev A',
        status: 'pending',
        uploadDate: '2025-06-14',
        uploadedBy: 'Sarah Wilson',
        fileSize: '1.8 MB',
        pdfUrl: '/mock-pdfs/bathroom-vanity-rev-a.pdf',
        revisions: [
          { 
            version: 'Rev A', 
            date: '2025-06-14', 
            status: 'pending', 
            notes: 'Initial submission',
            uploadedBy: 'Sarah Wilson'
          }
        ]
      },
      {
        id: 'SD003',
        fileName: 'Reception_Desk_Rev_B.pdf',
        projectId: 'P002',
        projectName: 'Medical Office Fit-out',
        drawingType: 'Reception Desk',
        room: 'Reception',
        version: 'Rev B',
        status: 'revision_required',
        uploadDate: '2025-06-13',
        uploadedBy: 'Tom Anderson',
        fileSize: '3.1 MB',
        pdfUrl: '/mock-pdfs/reception-desk-rev-b.pdf',
        revisions: [
          { 
            version: 'Rev A', 
            date: '2025-06-10', 
            status: 'rejected', 
            notes: 'Height specifications need adjustment',
            uploadedBy: 'Tom Anderson'
          },
          { 
            version: 'Rev B', 
            date: '2025-06-13', 
            status: 'revision_required', 
            notes: 'Material specifications unclear',
            uploadedBy: 'Tom Anderson'
          }
        ]
      },
      {
        id: 'SD004',
        fileName: 'Conference_Table_Rev_A.pdf',
        projectId: 'P001',
        projectName: 'Downtown Office Renovation',
        drawingType: 'Conference Table',
        room: 'Conference Room',
        version: 'Rev A',
        status: 'approved',
        uploadDate: '2025-06-12',
        uploadedBy: 'Lisa Chen',
        approvedBy: 'Mike Johnson',
        approvalDate: '2025-06-14',
        fileSize: '2.1 MB',
        pdfUrl: '/mock-pdfs/conference-table-rev-a.pdf',
        revisions: [
          { 
            version: 'Rev A', 
            date: '2025-06-12', 
            status: 'approved', 
            notes: 'Approved for production',
            uploadedBy: 'Lisa Chen',
            approvedBy: 'Mike Johnson'
          }
        ]
      }
    ];
  }

  // Utility methods
  getStatusIcon(status) {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'revision_required': return '🔄';
      case 'rejected': return '❌';
      default: return '❓';
    }
  }

  getStatusColor(status) {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'revision_required': return '#F44336';
      case 'rejected': return '#9E9E9E';
      default: return '#2196F3';
    }
  }

  generateNextVersion(revisions) {
    if (!revisions || revisions.length === 0) return 'Rev A';
    
    const versions = revisions
      .map(r => r.version)
      .filter(v => v.startsWith('Rev '))
      .map(v => v.replace('Rev ', ''))
      .sort();
    
    if (versions.length === 0) return 'Rev A';
    
    const lastLetter = versions[versions.length - 1];
    const nextLetter = String.fromCharCode(lastLetter.charCodeAt(0) + 1);
    return `Rev ${nextLetter}`;
  }
}

// Export singleton instance
const shopDrawingService = new ShopDrawingService();
export default shopDrawingService;