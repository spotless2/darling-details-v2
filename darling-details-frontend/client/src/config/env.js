// Centralized environment configuration

// Extract relevant environment variables
const env = {
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_PROD: import.meta.env.MODE === 'production',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:3000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Darling Details',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Decorations and accessories for special events',
};

// Only log in development environment
if (env.NODE_ENV === 'development') {
  console.log('Environment configuration:', env);
}

// Helper function to determine API URL with fallbacks
const getApiUrl = () => {
  // First priority: environment variable
  if (env.API_URL) {
    return env.API_URL;
  }
  
  // Second priority: production hardcoded URL
  if (env.IS_PROD) {
    return 'http://138.199.228.241:3000/api';
  }
  
  // Last resort: derive from current location
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:3000/api`;
};

env.EFFECTIVE_API_URL = getApiUrl();

export default env;
