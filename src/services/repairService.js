import apiService from './api';

export const repairService = {
  // Get all repairs
  async getRepairs(customer = '') {
    try {
      return await apiService.getRepairs(customer);
    } catch (error) {
      console.error('Error fetching repairs:', error);
      throw error;
    }
  },

  // Get repair by ID
  async getRepairById(id) {
    try {
      return await apiService.getRepairById(id);
    } catch (error) {
      console.error('Error fetching repair:', error);
      throw error;
    }
  },

  // Create new repair
  async createRepair(customerName, deviceName, problemDesc, cost) {
    try {
      return await apiService.createRepair(customerName, deviceName, problemDesc, cost);
    } catch (error) {
      console.error('Error creating repair:', error);
      throw error;
    }
  },

  // Update repair
  async updateRepair(id, updates) {
    try {
      return await apiService.updateRepair(id, updates);
    } catch (error) {
      console.error('Error updating repair:', error);
      throw error;
    }
  },

  // Mark repair as fixed
  async markFixed(id) {
    try {
      return await apiService.markRepairFixed(id);
    } catch (error) {
      console.error('Error marking repair as fixed:', error);
      throw error;
    }
  },

  // Mark repair as not fixed
  async markNotFixed(id) {
    try {
      return await apiService.markRepairNotFixed(id);
    } catch (error) {
      console.error('Error marking repair as not fixed:', error);
      throw error;
    }
  },

  // Deliver repair
  async deliver(id, deliveredAt) {
    try {
      return await apiService.deliverRepair(id, deliveredAt);
    } catch (error) {
      console.error('Error delivering repair:', error);
      throw error;
    }
  },

  // Delete repair
  async deleteRepair(id) {
    try {
      return await apiService.deleteRepair(id);
    } catch (error) {
      console.error('Error deleting repair:', error);
      throw error;
    }
  },

  // Get monthly stats
  async getMonthlyStats(month, year) {
    try {
      return await apiService.getRepairsMonthlyStats(month, year);
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      throw error;
    }
  }
};

export default repairService;
