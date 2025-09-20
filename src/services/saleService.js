import apiService from './api';

export const saleService = {
  // Get all sales
  async getSales() {
    try {
      return await apiService.getSales();
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  },

  // Get sale by ID
  async getSaleById(id) {
    try {
      return await apiService.getSaleById(id);
    } catch (error) {
      console.error('Error fetching sale:', error);
      throw error;
    }
  },

  // Create new sale
  async createSale(items) {
    try {
      return await apiService.createSale(items);
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  },

  // Delete sale
  async deleteSale(id) {
    try {
      return await apiService.deleteSale(id);
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  },

  // Get monthly stats
  async getMonthlyStats(month, year) {
    try {
      return await apiService.getSalesMonthlyStats(month, year);
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      throw error;
    }
  }
};

export default saleService;
