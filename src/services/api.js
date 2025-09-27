const API_BASE_URL = 'https://3alam-semsem-backend.vercel.app/api/v1';

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
        // If unauthorized, clear token and force logout
        if (response.status === 401 || (data && (data.message?.toLowerCase().includes('jwt') || data.message?.toLowerCase().includes('unauthorized')))) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Optionally, reload or redirect
          window.location.href = '/login';
        }
        throw new Error(data.message || data || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Admin endpoints
  // Registration: step 1 (create admin and send OTP)
  async registerAdmin(email, password, confirmPassword) {
    return this.request('/admin/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, confirmPassword })
    });
  }

  // Registration: step 2 (verify OTP)
  async verifyAdminRegistration(email, otp) {
    return this.request('/admin/register/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    });
  }

  // Login: step 1 (send OTP)
  async loginAdmin(email, password) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // Login: step 2 (verify OTP and get token)
  async verifyAdminLogin(email, otp) {
    return this.request('/admin/login/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    });
  }

  // Resend OTP
  async resendOTP(email, type) {
    return this.request('/admin/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email, type })
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

  async getWholesaleProducts() {
    return this.request('/product/wholesale');
  }

  async getProductsByCategory(categoryId) {
    return this.request(`/product/category/${categoryId}`);
  }

  async createProduct(name, price, stock, categoryId, wholesale_price = null) {
    const body = { name, price, stock, categoryId };
    if (wholesale_price !== null) {
      body.wholesale_price = wholesale_price;
    }
    return this.request('/product', {
      method: 'POST',
      body: JSON.stringify(body)
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
