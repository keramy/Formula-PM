const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Team Members API
  async getTeamMembers() {
    try {
      return await this.request('/team-members');
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
  async getProjects() {
    try {
      return await this.request('/projects');
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
  async getClients() {
    try {
      return await this.request('/clients');
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
  async getTasks() {
    try {
      return await this.request('/tasks');
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
}

export default new ApiService();