import apiClient from './apiClient';

const getImageBaseUrl = () => {
  // First, check for the environment variable
  if (import.meta.env.VITE_IMAGE_BASE_URL) {
    console.debug('Using env IMAGE_BASE_URL:', import.meta.env.VITE_IMAGE_BASE_URL);
    return import.meta.env.VITE_IMAGE_BASE_URL;
  }
  
  // If not available, determine dynamically from current location
  const { protocol, hostname } = window.location;
  const baseUrl = `${protocol}//${hostname}`;
  console.debug('Using dynamic IMAGE_BASE_URL:', baseUrl);
  return baseUrl;
};

const IMAGE_BASE_URL = getImageBaseUrl();

// Helper to format product data and fix image URLs
const formatProduct = (product) => {
  if (!product) return product;
  
  const getFullImagePath = (path) => {
    if (!path) {
      console.debug('Empty image path provided');
      return '';
    }
    
    if (path.startsWith('http')) {
      console.debug('Using absolute URL:', path);
      return path;
    }
    
    // Ensure clean path without duplicate /uploads
    const cleanPath = path.replace(/^\/?(uploads\/?)?/, '');
    const fullPath = `${IMAGE_BASE_URL}/uploads/${cleanPath}`;
    
    // Verify image URL
    fetch(fullPath)
      .then(response => {
        console.debug('Image URL verification:', {
          url: fullPath,
          status: response.status,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length'),
          ok: response.ok
        });
        
        // Check if response is actually an image
        if (!response.headers.get('content-type')?.startsWith('image/')) {
          console.error('Invalid content type for image:', response.headers.get('content-type'));
        }
        
        // Log the response body for debugging
        response.blob().then(blob => {
          console.debug('Image blob:', {
            size: blob.size,
            type: blob.type
          });
        });
      })
      .catch(error => {
        console.error('Image URL verification failed:', error);
      });
    
    console.debug('Generated image path:', {
      original: path,
      cleaned: cleanPath,
      final: fullPath
    });
    
    return fullPath;
  };
  
  const formatted = {
    ...product,
    imageUrl: getFullImagePath(product.imageUrl),
    thumbnailUrl: getFullImagePath(product.thumbnailUrl),
    images: [getFullImagePath(product.imageUrl)]
  };
  
  console.debug('Formatted product:', {
    id: product.id,
    originalImage: product.imageUrl,
    formattedImage: formatted.imageUrl
  });
  
  return formatted;
};

// Format an array of products
const formatProducts = (products) => {
  if (!products) return [];
  return products.map(formatProduct);
};

const productService = {
  // Get all products with optional filters
  getProducts: async (filters = {}) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.inStock) queryParams.append('inStock', filters.inStock);
      if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
      
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
      throw error.response?.data || { message: 'Failed to fetch product' };
    }
  },
  
  // Create a new product (admin only)
  createProduct: async (productData) => {
    try {
      // Check if productData is a FormData object (for handling images)
      if (productData instanceof FormData) {
        const response = await apiClient.postFormData('/products', productData);
        return {
          ...response.data,
          data: formatProduct(response.data.data)
        };
      } else {
        const response = await apiClient.post('/products', productData);
        return {
          ...response.data,
          data: formatProduct(response.data.data)
        };
      }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create product' };
    }
  },
  
  // Update an existing product (admin only)
  updateProduct: async (id, productData) => {
    try {
      // Check if productData is a FormData object (for handling images)
      if (productData instanceof FormData) {
        const response = await apiClient.putFormData(`/products/${id}`, productData);
        return {
          ...response.data,
          data: formatProduct(response.data.data)
        };
      } else {
        const response = await apiClient.put(`/products/${id}`, productData);
        return {
          ...response.data,
          data: formatProduct(response.data.data)
        };
      }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product' };
    }
  },
  
  // Delete a product (admin only)
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  },
  
  // Get the complete image URL
  getImageUrl: (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${IMAGE_BASE_URL}${path}`;
  }
};

export default productService;
