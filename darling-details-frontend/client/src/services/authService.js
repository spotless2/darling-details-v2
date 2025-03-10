import apiClient from './apiClient';

const authService = {
  // Login user and store token
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Verify if token is valid
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/users/verify-token');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token verification failed' };
    }
  },

  // Logout user by removing token
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get current logged in user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return localStorage.getItem('authToken') !== null;
  },
};

export default authService;
