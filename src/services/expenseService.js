import apiService from './api';

export const expenseService = {
  // Get all expenses
  async getExpenses() {
    try {
      return await apiService.getExpenses();
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  // Get expense by ID
  async getExpenseById(id) {
    try {
      return await apiService.getExpenseById(id);
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  },

  // Create new expense
  async createExpense(description, amount, expenseDate) {
    try {
      return await apiService.createExpense(description, amount, expenseDate);
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  // Update expense
  async updateExpense(id, updates) {
    try {
      return await apiService.updateExpense(id, updates);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  // Delete expense
  async deleteExpense(id) {
    try {
      return await apiService.deleteExpense(id);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  // Get monthly stats
  async getMonthlyStats(month, year) {
    try {
      return await apiService.getExpensesMonthlyStats(month, year);
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      throw error;
    }
  }
};

export default expenseService;
