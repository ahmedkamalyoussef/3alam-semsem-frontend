const API_BASE_URL = 'http://localhost:5001/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || data || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Admin endpoints
  async loginAdmin(email, password) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async registerAdmin(email, password) {
    return this.request('/admin/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // Category endpoints
  async getCategories() {
    return this.request('/category');
  }

  async createCategory(name, description = '') {
    return this.request('/category', {
      method: 'POST',
      body: JSON.stringify({ name, description })
    });
  }

  async updateCategory(id, updates) {
    return this.request(`/category/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async deleteCategory(id) {
    return this.request(`/category/${id}`, {
      method: 'DELETE'
    });
  }

  // Product endpoints
  async getProducts() {
    return this.request('/product');
  }

  async getProductsByCategory(categoryId) {
    return this.request(`/product/category/${categoryId}`);
  }

  async createProduct(name, price, stock, categoryId) {
    return this.request('/product', {
      method: 'POST',
      body: JSON.stringify({ name, price, stock, categoryId })
    });
  }

  async updateProduct(id, updates) {
    return this.request(`/product/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async deleteProduct(id) {
    return this.request(`/product/${id}`, {
      method: 'DELETE'
    });
  }

  // Sale endpoints
  async getSales() {
    return this.request('/sale');
  }

  async getSaleById(id) {
    return this.request(`/sale/${id}`);
  }

  async createSale(items) {
    return this.request('/sale', {
      method: 'POST',
      body: JSON.stringify({ items })
    });
  }

  async deleteSale(id) {
    return this.request(`/sale/${id}`, {
      method: 'DELETE'
    });
  }

  async getSalesMonthlyStats(month, year) {
    return this.request(`/sale/stats/monthly?month=${month}&year=${year}`);
  }

  // Expense endpoints
  async getExpenses() {
    return this.request('/expense');
  }

  async getExpenseById(id) {
    return this.request(`/expense/${id}`);
  }

  async createExpense(description, amount, expenseDate) {
    return this.request('/expense', {
      method: 'POST',
      body: JSON.stringify({ description, amount, expenseDate })
    });
  }

  async updateExpense(id, updates) {
    return this.request(`/expense/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async deleteExpense(id) {
    return this.request(`/expense/${id}`, {
      method: 'DELETE'
    });
  }

  async getExpensesMonthlyStats(month, year) {
    return this.request(`/expense/stats/monthly?month=${month}&year=${year}`);
  }

  // Repair endpoints
  async getRepairs(customer = '') {
    const endpoint = customer ? `/repair?customer=${encodeURIComponent(customer)}` : '/repair';
    return this.request(endpoint);
  }

  async getRepairById(id) {
    return this.request(`/repair/${id}`);
  }

  async createRepair(customerName, deviceName, problemDesc, cost) {
    return this.request('/repair', {
      method: 'POST',
      body: JSON.stringify({ customerName, deviceName, problemDesc, cost })
    });
  }

  async updateRepair(id, updates) {
    return this.request(`/repair/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async markRepairFixed(id) {
    return this.request(`/repair/${id}/fixed`, {
      method: 'PATCH'
    });
  }

  async markRepairNotFixed(id) {
    return this.request(`/repair/${id}/not-fixed`, {
      method: 'PATCH'
    });
  }

  async deliverRepair(id, deliveredAt) {
    return this.request(`/repair/${id}/deliver`, {
      method: 'PATCH',
      body: JSON.stringify({ deliveredAt })
    });
  }

  async deleteRepair(id) {
    return this.request(`/repair/${id}`, {
      method: 'DELETE'
    });
  }

  async getRepairsMonthlyStats(month, year) {
    return this.request(`/repair/stats/monthly?month=${month}&year=${year}`);
  }
}

export default new ApiService();
