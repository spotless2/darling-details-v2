import apiClient from './apiClient';

const storeService = {
  // Get store settings (public)
  getStoreSettings: async () => {
    try {
      const response = await apiClient.get('/store-settings');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch store settings' };
    }
  },
  
  // Update store settings (admin only)
  updateStoreSettings: async (settingsData) => {
    try {
      const response = await apiClient.put('/store-settings', settingsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update store settings' };
    }
  },
  
  // Create store settings (admin only, rarely used)
  createStoreSettings: async (settingsData) => {
    try {
      const response = await apiClient.post('/store-settings', settingsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create store settings' };
    }
  }
};

export default storeService;
