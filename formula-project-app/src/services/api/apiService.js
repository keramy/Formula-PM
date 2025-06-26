import { PerformanceMonitor } from '../../utils/performance';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5014/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const startTime = performance.now();
    const method = options.method || 'GET';
    
    // API Request to base URL
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const duration = performance.now() - startTime;
      
      // Response received
      
      // Check if request was aborted
      if (config.signal?.aborted) {
        throw new Error('Request was aborted');
      }
      
      if (!response.ok) {
        // Track failed API requests
        PerformanceMonitor.trackApiRequest(endpoint, duration, false, method);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Track successful API requests
      PerformanceMonitor.trackApiRequest(endpoint, duration, true, method);
      
      // Data received from endpoint
      return data;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      // Don't log aborted requests as errors
      if (error.name !== 'AbortError' && !config.signal?.aborted) {
        // Track failed API requests
        PerformanceMonitor.trackApiRequest(endpoint, duration, false, method);
        console.error(`🚨 API request failed: ${endpoint}`, error);
        console.error('🚨 Full URL was:', url);
        console.error('🚨 Error details:', error.message, error.status);
      }
      throw error;
    }
  }

  // Team Members API
  async getTeamMembers(signal) {
    try {
      return await this.request('/team-members', { signal });
    } catch (error) {
      console.warn('Backend unavailable, using demo data');
      // Demo data for GitHub Pages
      return [
        {
          id: 1001,
          firstName: "Kubilay",
          lastName: "Ilgın", 
          fullName: "Kubilay Ilgın",
          initials: "KI",
          email: "kubilay.ilgin@formulaint.com",
          phone: "+90 212 555 0101",
          department: "Management",
          position: "Managing Partner",
          role: "admin"
        },
        {
          id: 1002,
          firstName: "Demo",
          lastName: "User",
          fullName: "Demo User", 
          initials: "DU",
          email: "demo@formulaint.com",
          phone: "+90 212 555 0102",
          department: "Engineering",
          position: "Project Manager",
          role: "manager"
        }
      ];
    }
  }

  async createTeamMember(memberData) {
    return this.request('/team-members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async updateTeamMember(id, memberData) {
    return this.request(`/team-members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  }

  async deleteTeamMember(id) {
    return this.request(`/team-members/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects API
  async getProjects(signal) {
    try {
      return await this.request('/projects', { signal });
    } catch (error) {
      console.warn('Backend unavailable, using demo data');
      // Demo data for GitHub Pages
      return [
        {
          id: 2001,
          name: "Akbank Head Office Renovation",
          description: "Complete renovation of Akbank headquarters building",
          status: "active",
          type: "general-contractor",
          clientId: 3001,
          startDate: "2024-01-15",
          endDate: "2024-12-31",
          budget: 5000000,
          projectManager: 1001
        },
        {
          id: 2002,
          name: "Garanti BBVA Branch Fit-out",
          description: "Interior fit-out for new Garanti BBVA branch",
          status: "on-tender", 
          type: "fit-out",
          clientId: 3002,
          startDate: "2024-03-01",
          endDate: "2024-08-15", 
          budget: 1200000,
          projectManager: 1002
        }
      ];
    }
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id, projectData) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Clients API
  async getClients(signal) {
    try {
      return await this.request('/clients', { signal });
    } catch (error) {
      console.warn('Backend unavailable, using demo data');
      // Demo data for GitHub Pages
      return [
        {
          id: 3001,
          name: "Akbank",
          industry: "Banking",
          contactPerson: "Mehmet Öztürk",
          email: "mehmet.ozturk@akbank.com",
          phone: "+90 212 555 1000",
          address: "Levent, Istanbul",
          status: "active"
        },
        {
          id: 3002,
          name: "Garanti BBVA",
          industry: "Banking",
          contactPerson: "Ayşe Demir", 
          email: "ayse.demir@garantibbva.com",
          phone: "+90 212 555 2000",
          address: "Beşiktaş, Istanbul",
          status: "active"
        }
      ];
    }
  }

  async createClient(clientData) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(id, clientData) {
    return this.request(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  }

  async deleteClient(id) {
    return this.request(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  // Tasks API
  async getTasks(signal) {
    try {
      return await this.request('/tasks', { signal });
    } catch (error) {
      console.warn('Backend unavailable, using demo data');
      // Demo data for GitHub Pages
      return [
        {
          id: 4001,
          title: "Review architectural plans",
          description: "Complete review of updated architectural drawings",
          status: "in-progress",
          priority: "high",
          projectId: 2001,
          assignedTo: 1001,
          dueDate: "2024-12-20",
          createdAt: "2024-12-01"
        },
        {
          id: 4002,
          title: "Coordinate with MEP contractors",
          description: "Schedule meeting with MEP team for system integration",
          status: "pending",
          priority: "medium", 
          projectId: 2001,
          assignedTo: 1002,
          dueDate: "2024-12-25",
          createdAt: "2024-12-05"
        },
        {
          id: 4003,
          title: "Finalize material specifications",
          description: "Complete material selection for fit-out project",
          status: "completed",
          priority: "low",
          projectId: 2002,
          assignedTo: 1001,
          dueDate: "2024-12-10",
          createdAt: "2024-11-20"
        }
      ];
    }
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Email notifications
  async sendNotification(notificationData) {
    return this.request('/send-notification', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  // Scope Items API methods
  async getScopeItems(projectId) {
    try {
      const response = await this.request(`/scope-items/${projectId}`);
      return response;
    } catch (error) {
      console.error('Error fetching scope items:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem(`scope_items_${projectId}`);
      return stored ? JSON.parse(stored) : [];
    }
  }

  async createScopeItem(scopeItem) {
    try {
      const response = await this.request('/scope-items', {
        method: 'POST',
        body: JSON.stringify(scopeItem)
      });
      
      // Also save to localStorage as backup
      const projectId = scopeItem.projectId;
      const existing = await this.getScopeItems(projectId);
      const updated = [...existing, response];
      localStorage.setItem(`scope_items_${projectId}`, JSON.stringify(updated));
      
      return response;
    } catch (error) {
      console.error('Error creating scope item:', error);
      
      // Fallback to localStorage
      const projectId = scopeItem.projectId;
      const existing = await this.getScopeItems(projectId);
      const newItem = { ...scopeItem, id: Date.now() };
      const updated = [...existing, newItem];
      localStorage.setItem(`scope_items_${projectId}`, JSON.stringify(updated));
      
      return newItem;
    }
  }

  async updateScopeItem(scopeItemId, updates) {
    try {
      const response = await this.request(`/scope-items/${scopeItemId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return response;
    } catch (error) {
      console.error('Error updating scope item:', error);
      
      // Fallback to localStorage
      const projectId = updates.projectId;
      if (projectId) {
        const existing = await this.getScopeItems(projectId);
        const updated = existing.map(item => 
          item.id === scopeItemId ? { ...item, ...updates } : item
        );
        localStorage.setItem(`scope_items_${projectId}`, JSON.stringify(updated));
        return { ...updates, id: scopeItemId };
      }
      
      throw error;
    }
  }

  async deleteScopeItem(scopeItemId) {
    try {
      await this.request(`/scope-items/${scopeItemId}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting scope item:', error);
      
      // Fallback to localStorage - we need to find which project this belongs to
      // This is a limitation of the localStorage fallback approach
      const projects = await this.getProjects();
      for (const project of projects) {
        const items = await this.getScopeItems(project.id);
        const filtered = items.filter(item => item.id !== scopeItemId);
        if (filtered.length !== items.length) {
          localStorage.setItem(`scope_items_${project.id}`, JSON.stringify(filtered));
          return true;
        }
      }
      
      throw error;
    }
  }

  // Material Specifications API
  async getMaterialSpecifications(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = `/specifications${queryParams ? `?${queryParams}` : ''}`;
      const response = await this.request(endpoint);
      const specifications = response.data || response;
      
      // Format the specifications to match frontend expectations
      return specifications.map(spec => ({
        ...spec,
        unitCost: typeof spec.unitPrice === 'number' ? `$${spec.unitPrice.toFixed(2)}` : 
                  typeof spec.unitCost === 'number' ? `$${spec.unitCost.toFixed(2)}` : 
                  spec.unitCost || '$0.00',
        totalCost: typeof spec.totalCost === 'number' ? `$${spec.totalCost.toFixed(2)}` : 
                   spec.totalCost || '$0.00',
        quantity: spec.quantity?.toString() || '1',
        leadTime: spec.leadTime?.toString() || '',
        supplier: spec.supplierName || spec.supplier || '',
        projectName: spec.projectName || 'Unknown Project',
        linkedDrawings: spec.shopDrawingIds || spec.linkedDrawings || []
      }));
    } catch (error) {
      console.warn('Backend unavailable, using demo data for specifications');
      // Return demo data for GitHub Pages
      return [
        {
          id: 'SPEC001',
          itemId: 'SPEC001',
          description: 'Upper Cabinet - 30" Wide',
          category: 'Kitchen Cabinets',
          material: 'Maple Hardwood',
          finish: 'Natural Stain',
          hardware: 'Soft-close hinges, adjustable shelves',
          dimensions: '30" x 12" x 36"',
          quantity: '4',
          unit: 'EA',
          unitCost: '$450.00',
          totalCost: '$1,800.00',
          supplier: 'Cabinet Works Inc',
          partNumber: 'UC-30-NAT',
          leadTime: '14 days',
          notes: 'Pre-finished, ready to install',
          drawingReference: 'Kitchen_Cabinets_Rev_C.pdf',
          roomLocation: 'Kitchen',
          installationPhase: 'Phase 2',
          projectId: 2001,
          projectName: 'Downtown Office Renovation',
          linkedDrawings: ['SD001'],
          status: 'approved'
        }
      ];
    }
  }

  async getMaterialSpecificationById(id) {
    try {
      const response = await this.request(`/specifications/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching specification:', error);
      throw error;
    }
  }

  async getMaterialSpecificationsByProject(projectId) {
    try {
      const response = await this.request(`/specifications/project/${projectId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching project specifications:', error);
      return [];
    }
  }

  async createMaterialSpecification(specData) {
    try {
      const response = await this.request('/specifications', {
        method: 'POST',
        body: JSON.stringify(specData)
      });
      const spec = response.data || response;
      
      // Format the response to match frontend expectations
      return {
        ...spec,
        unitCost: typeof spec.unitPrice === 'number' ? `$${spec.unitPrice.toFixed(2)}` : 
                  typeof spec.unitCost === 'number' ? `$${spec.unitCost.toFixed(2)}` : 
                  spec.unitCost || '$0.00',
        totalCost: typeof spec.totalCost === 'number' ? `$${spec.totalCost.toFixed(2)}` : 
                   spec.totalCost || '$0.00',
        quantity: spec.quantity?.toString() || '1',
        leadTime: spec.leadTime?.toString() || '',
        supplier: spec.supplierName || spec.supplier || '',
        projectName: spec.projectName || 'Unknown Project',
        linkedDrawings: spec.shopDrawingIds || spec.linkedDrawings || []
      };
    } catch (error) {
      console.error('Error creating specification:', error);
      throw error;
    }
  }

  async updateMaterialSpecification(id, specData) {
    try {
      const response = await this.request(`/specifications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(specData)
      });
      return response.data || response;
    } catch (error) {
      console.error('Error updating specification:', error);
      throw error;
    }
  }

  async updateMaterialSpecificationStatus(id, status, notes) {
    try {
      const response = await this.request(`/specifications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes })
      });
      return response.data || response;
    } catch (error) {
      console.error('Error updating specification status:', error);
      throw error;
    }
  }

  async updateMaterialSpecificationLinks(id, linkedDrawings, linkedTasks) {
    try {
      const response = await this.request(`/specifications/${id}/links`, {
        method: 'PATCH',
        body: JSON.stringify({ linkedDrawings, linkedTasks })
      });
      return response.data || response;
    } catch (error) {
      console.error('Error updating specification links:', error);
      throw error;
    }
  }

  async deleteMaterialSpecification(id) {
    try {
      await this.request(`/specifications/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting specification:', error);
      throw error;
    }
  }

  async getMaterialSpecificationStats() {
    try {
      const response = await this.request('/specifications/stats');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching specification stats:', error);
      return {
        total: 0,
        byStatus: {
          pending: 0,
          approved: 0,
          revision_required: 0,
          rejected: 0
        },
        byCategory: {},
        totalCost: 0,
        approvedCost: 0,
        avgCostPerItem: 0
      };
    }
  }

  // Shop Drawings API (for linking)
  async getShopDrawings(projectId) {
    try {
      const response = await this.request(`/shop-drawings/project/${projectId}`);
      return response.data || response;
    } catch (error) {
      console.warn('Backend unavailable, using demo data for shop drawings');
      return [
        {
          id: 'SD001',
          name: 'Kitchen Cabinet Details',
          projectId: projectId,
          status: 'approved'
        },
        {
          id: 'SD002',
          name: 'Reception Desk Assembly',
          projectId: projectId,
          status: 'pending'
        }
      ];
    }
  }
}

export default new ApiService();