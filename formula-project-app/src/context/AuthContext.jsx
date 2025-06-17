import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// User roles enum
export const USER_ROLES = {
  ADMIN: 'admin',
  CO_FOUNDER: 'co_founder',
  PROJECT_MANAGER: 'project_manager'
};

// Demo users for development
const DEMO_USERS = [
  {
    id: 'USER001',
    email: 'admin@formulapm.com',
    password: 'admin123',
    name: 'Formula Admin',
    role: USER_ROLES.ADMIN,
    avatar: '/avatars/admin.jpg',
    department: 'Management'
  },
  {
    id: 'USER002',
    email: 'cofounder@formulapm.com',
    password: 'cofounder123',
    name: 'John Co-founder',
    role: USER_ROLES.CO_FOUNDER,
    avatar: '/avatars/cofounder.jpg',
    department: 'Executive'
  },
  {
    id: 'USER003',
    email: 'pm1@formulapm.com',
    password: 'pm123',
    name: 'Sarah Wilson',
    role: USER_ROLES.PROJECT_MANAGER,
    avatar: '/avatars/pm1.jpg',
    department: 'Projects',
    assignedProjects: ['P001', 'P002']
  },
  {
    id: 'USER004',
    email: 'pm2@formulapm.com',
    password: 'pm123',
    name: 'Mike Johnson',
    role: USER_ROLES.PROJECT_MANAGER,
    avatar: '/avatars/pm2.jpg',
    department: 'Projects',
    assignedProjects: ['P003']
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('formulapm_token');
    const userData = localStorage.getItem('formulapm_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('formulapm_token');
        localStorage.removeItem('formulapm_user');
      }
    }
    
    // Auto-login as admin for development
    if (process.env.NODE_ENV === 'development') {
      try {
        console.log('Auto-logging in as admin for development...');
        const adminUser = DEMO_USERS[0]; // Admin user
        const { password: _, ...userSession } = adminUser;
        
        // Generate demo JWT token
        const autoToken = btoa(JSON.stringify({ 
          userId: userSession.id, 
          email: userSession.email,
          role: userSession.role,
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));

        // Store in localStorage
        localStorage.setItem('formulapm_token', autoToken);
        localStorage.setItem('formulapm_user', JSON.stringify(userSession));
        
        setUser(userSession);
      } catch (error) {
        console.error('Failed to auto-login in development:', error);
        setError('Development auto-login failed');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // Find user in demo users
      const foundUser = DEMO_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Create user session (exclude password)
      const { password: _, ...userSession } = foundUser;
      
      // Generate demo JWT token
      const token = btoa(JSON.stringify({ 
        userId: userSession.id, 
        email: userSession.email,
        role: userSession.role,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));

      // Store in localStorage
      localStorage.setItem('formulapm_token', token);
      localStorage.setItem('formulapm_user', JSON.stringify(userSession));

      setUser(userSession);
      return { success: true, user: userSession };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('formulapm_token');
    localStorage.removeItem('formulapm_user');
    setUser(null);
    setError(null);
  };

  const hasPermission = (permission) => {
    if (!user) return false;

    const permissions = {
      [USER_ROLES.ADMIN]: [
        'view_all_projects',
        'edit_all_projects',
        'delete_all_projects',
        'manage_users',
        'view_admin_dashboard',
        'export_data'
      ],
      [USER_ROLES.CO_FOUNDER]: [
        'view_all_projects',
        'view_executive_dashboard'
      ],
      [USER_ROLES.PROJECT_MANAGER]: [
        'view_assigned_projects',
        'edit_assigned_projects',
        'create_projects',
        'manage_scope',
        'manage_drawings',
        'manage_specifications',
        'view_pm_dashboard'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const canAccessProject = (projectId) => {
    if (!user) return false;

    // Admin can access all projects
    if (user.role === USER_ROLES.ADMIN) return true;

    // Co-founders can view all projects (read-only)
    if (user.role === USER_ROLES.CO_FOUNDER) return true;

    // Project managers can only access assigned projects
    if (user.role === USER_ROLES.PROJECT_MANAGER) {
      return user.assignedProjects?.includes(projectId) || false;
    }

    return false;
  };

  const canEditProject = (projectId) => {
    if (!user) return false;

    // Admin can edit all projects
    if (user.role === USER_ROLES.ADMIN) return true;

    // Co-founders cannot edit projects
    if (user.role === USER_ROLES.CO_FOUNDER) return false;

    // Project managers can edit assigned projects
    if (user.role === USER_ROLES.PROJECT_MANAGER) {
      return user.assignedProjects?.includes(projectId) || false;
    }

    return false;
  };

  const getAccessibleProjects = (allProjects) => {
    if (!user || !allProjects) return [];

    // Admin and co-founders see all projects
    if (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.CO_FOUNDER) {
      return allProjects;
    }

    // Project managers see only assigned projects
    if (user.role === USER_ROLES.PROJECT_MANAGER && user.assignedProjects) {
      return allProjects.filter(project => user.assignedProjects.includes(project.id));
    }

    return [];
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    canAccessProject,
    canEditProject,
    getAccessibleProjects,
    USER_ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};