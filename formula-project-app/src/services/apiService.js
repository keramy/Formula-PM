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
    return this.request('/team-members');
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
    return this.request('/projects');
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
    return this.request('/clients');
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
    return this.request('/tasks');
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