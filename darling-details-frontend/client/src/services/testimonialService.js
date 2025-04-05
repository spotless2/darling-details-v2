import apiClient from './apiClient';

export const testimonialService = {
  async getTestimonials() {
    // Remove .json() call since apiClient likely already returns parsed data
    return await apiClient.get('/testimonials');
  },
  
  async getTestimonialById(id) {
    // Remove .json() call
    return await apiClient.get(`/testimonials/${id}`);
  },
  
  async createTestimonial(testimonial) {
    // Remove .json() call
    return await apiClient.post('/testimonials', testimonial);
  },
  
  async updateTestimonial(id, testimonial) {
    // Remove .json() call
    return await apiClient.put(`/testimonials/${id}`, testimonial);
  },
  
  async deleteTestimonial(id) {
    // Remove .json() call
    return await apiClient.delete(`/testimonials/${id}`);
  }
};

export default testimonialService;