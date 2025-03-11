import apiClient from './apiClient';

// More robust image base URL determination with fallbacks
const getImageBaseUrl = () => {
  // First priority: Environment variable
  if (import.meta.env.VITE_IMAGE_BASE_URL) {
    return import.meta.env.VITE_IMAGE_BASE_URL.replace(/\/$/, ''); // Remove trailing slash if present
  }
  
  // Second priority: API base URL if available (assuming apiClient has a baseURL)
  if (apiClient.defaults && apiClient.defaults.baseURL) {
    return apiClient.defaults.baseURL.replace(/\/api\/?$/, ''); // Remove /api suffix if present
  }
  
  // Last resort: Window location
  const { protocol, host } = window.location;
  return `${protocol}//${host}`;
};

// Image URL formatter with robust error handling and content type hints
const createImageUrlFormatter = () => {
  const baseUrl = getImageBaseUrl();
  console.debug('Image base URL configured as:', baseUrl);
  
  return (path, options = {}) => {
    if (!path) return null;
    
    // If it's already a full URL, just return it
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Clean the path of any leading slashes or 'uploads' directories
    const cleanPath = path.replace(/^\/?(uploads\/?)?/, '');
    
    // Add timestamp to prevent caching if needed
    const cacheBuster = options.noCache ? `?t=${Date.now()}` : '';
    
    // Build the URL with proper format
    const fullUrl = `${baseUrl}/uploads/${cleanPath}${cacheBuster}`;
    
    return fullUrl;
  };
};

// Create the image URL formatter once
const formatImageUrl = createImageUrlFormatter();

// Test if an image URL is valid before returning it
const validateImageUrl = async (url) => {
  if (!url) return null;
  
  try {
    // Send a HEAD request to validate the URL without downloading the full image
    await fetch(url, { 
      method: 'HEAD',
      headers: {
        'Accept': 'image/*'  // Hint to the server we want an image
      }
    });
    return url;
  } catch (error) {
    console.warn(`Image validation failed for URL: ${url}`, error);
    return null;
  }
};

// Process product data to include proper image URLs
const formatProduct = (product) => {
  if (!product) return null;
  
  // Create a copy to avoid modifying the original
  const formatted = { ...product };
  
  // Set image URLs
  if (product.imageUrl) {
    formatted.imageUrl = formatImageUrl(product.imageUrl);
  }
  
  if (product.thumbnailUrl) {
    formatted.thumbnailUrl = formatImageUrl(product.thumbnailUrl);
  }
  
  // Handle image arrays
  if (Array.isArray(product.images) && product.images.length > 0) {
    formatted.images = product.images.map(img => formatImageUrl(img));
  } else {
    // Fallback to main image if no images array exists
    formatted.images = product.imageUrl ? [formatImageUrl(product.imageUrl)] : [];
  }
  
  return formatted;
};

// Format an array of products
const formatProducts = (products) => {
  if (!products || !Array.isArray(products)) return [];
  return products.map(formatProduct);
};

const productService = {
  // Get all products with optional filters
  getProducts: async (filters = {}) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      const url = `/products${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(url);
      
      // Format the product data to ensure images work
      const formattedData = {
        ...response.data,
        data: formatProducts(response.data.data)
      };
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },
  
  // Get single product by ID
  getProduct: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return {
        ...response.data,
        data: formatProduct(response.data.data)
      };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error.response?.data || { message: 'Failed to fetch product' };
    }
  },
  
  // Create a new product (admin only)
  createProduct: async (productData) => {
    try {
      let response;
      
      if (productData instanceof FormData) {
        response = await apiClient.post('/products', productData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await apiClient.post('/products', productData);
      }
      
      return {
        ...response.data,
        data: formatProduct(response.data.data)
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error.response?.data || { message: 'Failed to create product' };
    }
  },
  
  // Update an existing product (admin only)
  updateProduct: async (id, productData) => {
    try {
      let response;
      
      if (productData instanceof FormData) {
        response = await apiClient.put(`/products/${id}`, productData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await apiClient.put(`/products/${id}`, productData);
      }
      
      return {
        ...response.data,
        data: formatProduct(response.data.data)
      };
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error.response?.data || { message: 'Failed to update product' };
    }
  },
  
  // Delete a product (admin only)
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  },
  
  // Verify an image URL is valid (can be used to proactively check images)
  verifyImageUrl: async (url) => {
    return await validateImageUrl(formatImageUrl(url));
  },
  
  // Get a complete image URL with various options
  getImageUrl: (path, options = {}) => {
    return formatImageUrl(path, options);
  },
  
  // Preload an image to ensure it's in the browser cache
  preloadImage: (url) => {
    if (!url) return Promise.resolve(false);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = formatImageUrl(url);
    });
  }
};

export default productService;