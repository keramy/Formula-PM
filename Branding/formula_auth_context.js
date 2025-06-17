// context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial auth state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  token: null,
};

// Auth action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
  UPDATE_USER: 'UPDATE_USER',
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const token = localStorage.getItem('formula_auth_token');
      const userData = localStorage.getItem('formula_user_data');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        
        // Validate token with backend (simulate API call)
        const isValid = await validateToken(token);
        
        if (isValid) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user, token },
          });
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('formula_auth_token');
          localStorage.removeItem('formula_user_data');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      // Simulate API call
      const response = await mockLoginAPI(credentials);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('formula_auth_token', token);
        localStorage.setItem('formula_user_data', JSON.stringify(user));
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });
        
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_ERROR,
          payload: response.error,
        });
        
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('formula_auth_token');
      localStorage.removeItem('formula_user_data');
      
      // Call logout API if needed
      if (state.token) {
        await mockLogoutAPI(state.token);
      }
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if API call fails
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const updateUser = (updates) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: updates,
    });
    
    // Update localStorage
    const updatedUser = { ...state.user, ...updates };
    localStorage.setItem('formula_user_data', JSON.stringify(updatedUser));
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock API functions (replace with real API calls)
const mockLoginAPI = async (credentials) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const { email, password } = credentials;
  
  // Mock user database
  const mockUsers = [
    {
      id: 1,
      email: 'admin@formula-international.com',
      password: 'admin123',
      name: 'John Administrator',
      role: 'admin',
      company: 'Formula International',
      avatar: null,
      permissions: ['all'],
    },
    {
      id: 2,
      email: 'manager@formula-international.com',
      password: 'manager123',
      name: 'Sarah Project Manager',
      role: 'manager',
      company: 'Formula International',
      avatar: null,
      permissions: ['projects', 'tasks', 'team'],
    },
    {
      id: 3,
      email: 'user@formula-international.com',
      password: 'user123',
      name: 'Mike Team Member',
      role: 'user',
      company: 'Formula International',
      avatar: null,
      permissions: ['tasks'],
    },
  ];
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    };
  } else {
    return {
      success: false,
      error: 'Invalid email or password',
    };
  }
};

const mockLogoutAPI = async (token) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Logout API called with token:', token);
  return { success: true };
};

const validateToken = async (token) => {
  // Simulate token validation
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple validation - check if token is not expired
  // In real app, you'd call your backend to validate
  return token && token.startsWith('mock_token_');
};

export default AuthContext;