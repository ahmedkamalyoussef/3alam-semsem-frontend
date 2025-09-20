import apiService from './api';

export const categoryService = {
  // Get all categories
  async getCategories() {
    try {
      return await apiService.getCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create new category
  async createCategory(name, description = '') {
    try {
      return await apiService.createCategory(name, description);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update category
  async updateCategory(id, updates) {
    try {
      return await apiService.updateCategory(id, updates);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category
  async deleteCategory(id) {
    try {
      return await apiService.deleteCategory(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};

export default categoryService;
