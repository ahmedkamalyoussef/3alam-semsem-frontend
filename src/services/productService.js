import apiService from './api';

export const productService = {
  // Get all products
  async getProducts() {
    try {
      return await apiService.getProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId) {
    try {
      return await apiService.getProductsByCategory(categoryId);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Create new product
  async createProduct(name, price, stock, categoryId) {
    try {
      return await apiService.createProduct(name, price, stock, categoryId);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id, updates) {
    try {
      return await apiService.updateProduct(id, updates);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      return await apiService.deleteProduct(id);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

export default productService;
