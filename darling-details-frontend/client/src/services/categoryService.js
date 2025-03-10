import apiClient from './apiClient';

const categoryService = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  },
  
  // Get single category by ID or slug
  getCategory: async (idOrSlug) => {
    try {
      const response = await apiClient.get(`/categories/${idOrSlug}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch category' };
    }
  },
  
  // Create a new category (admin only)
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create category' };
    }
  },
  
  // Update an existing category (admin only)
  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update category' };
    }
  },
  
  // Delete a category (admin only)
  deleteCategory: async (id) => {
    try {
      const response = await apiClient.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete category' };
    }
  }
};

export default categoryService;
