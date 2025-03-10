// Base API URL - adjust based on environment
console.log('Environment variables:', import.meta.env);

// Create a function to determine the base URL
const getBaseUrl = () => {
  // First, check for the environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // If not available, determine dynamically from current location
  // This helps in production when env vars might not be available
  const { protocol, hostname, port } = window.location;
  // If we're on the production server, use its API endpoint
  return `${protocol}//${hostname}:${port}/api`;
};

const API_URL = getBaseUrl();
console.log('Using API URL:', API_URL);

// Create a fetch-based API client
const apiClient = {
  // Basic request method
  request: async (method, url, data = null, options = {}) => {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }

    // Add body for non-GET requests with data
    if (data && method !== 'GET') {
      if (data instanceof FormData) {
        // Don't set Content-Type for FormData, browser will set it with boundary
        delete config.headers['Content-Type'];
        config.body = data;
      } else {
        config.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(`${API_URL}${url}`, config);
      
      // Handle 401 errors (unauthorized)
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        throw new Error('Unauthorized');
      }

      // Parse JSON response
      const responseData = response.status !== 204 ? await response.json() : {};
      
      if (!response.ok) {
        throw { response: { status: response.status, data: responseData } };
      }

      return { data: responseData, status: response.status };
    } catch (error) {
      // Rethrow with similar structure to axios errors for compatibility
      if (!error.response) {
        error.response = { 
          data: { message: error.message || 'Network error' },
          status: 0
        };
      }
      throw error;
    }
  },

  // Convenience methods
  get: (url, options = {}) => apiClient.request('GET', url, null, options),
  
  post: (url, data, options = {}) => apiClient.request('POST', url, data, options),
  
  put: (url, data, options = {}) => apiClient.request('PUT', url, data, options),
  
  delete: (url, options = {}) => apiClient.request('DELETE', url, null, options),
  
  // Helper methods for FormData
  postFormData: (url, formData, options = {}) => apiClient.request('POST', url, formData, options),
  
  putFormData: (url, formData, options = {}) => apiClient.request('PUT', url, formData, options)
};

export default apiClient;
