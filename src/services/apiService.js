import { apiClient } from './authService';

export const ProductService = {
  getAllProducts: async (params = {}) => {
    const response = await apiClient.get('/api/v1/products/', { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await apiClient.get(`/api/v1/products/${id}`);
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await apiClient.post('/api/v1/products/', productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/api/v1/products/${id}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  hideProduct: async (id) => {
    const response = await apiClient.put(`/api/v1/products/${id}/hide`);
    return response.data;
  },
  restoreProduct: async (id) => {
    const response = await apiClient.put(`/api/v1/products/${id}/restore`);
    return response.data;
  },
  getHiddenProducts: async () => {
    const response = await apiClient.get('/api/v1/products/hidden');
    return response.data;
  }
};

export const OrderService = {
  createOrder: async (orderData) => {
    const response = await apiClient.post('/api/v1/orders/', orderData);
    return response.data;
  },
  getUserOrders: async () => {
    const response = await apiClient.get('/api/v1/orders/me');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await apiClient.get(`/api/v1/orders/${id}`);
    return response.data;
  },
  getAllOrders: async (params = {}) => {
    const response = await apiClient.get('/api/v1/orders/', { params });
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await apiClient.put(`/api/v1/orders/${id}/status`, { status });
    return response.data;
  }
};

export const InventoryService = {
  importStock: async (importData) => {
    const response = await apiClient.post('/api/v1/inventory/import', importData);
    return response.data;
  },
  adjustStock: async (adjustData) => {
    const response = await apiClient.post('/api/v1/inventory/adjust', adjustData);
    return response.data;
  },
  getInventoryTransactions: async (params = {}) => {
    const response = await apiClient.get('/api/v1/inventory/transactions', { params });
    return response.data;
  }
};

export const ReportService = {
  getDashboardReport: async () => {
    const response = await apiClient.get('/api/v1/reports/dashboard');
    return response.data;
  },
  getInventoryReport: async (params = {}) => {
    const response = await apiClient.get('/api/v1/reports/inventory', { params });
    return response.data;
  },
  getRevenueReport: async (params = {}) => {
    const response = await apiClient.get('/api/v1/reports/revenue', { params });
    return response.data;
  },
  getExportReport: async (params = {}) => {
    const response = await apiClient.get('/api/v1/reports/export', { params });
    return response.data;
  },
  getExpenseReport: async (params = {}) => {
    const response = await apiClient.get('/api/v1/reports/expenses', { params });
    return response.data;
  }
};

export const ExpenseService = {
  createExpense: async (expenseData) => {
    const response = await apiClient.post('/api/v1/expenses/', expenseData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getExpenses: async (params = {}) => {
    const response = await apiClient.get('/api/v1/expenses/', { params });
    return response.data;
  },
  getHiddenExpenses: async (params = {}) => {
    const response = await apiClient.get('/api/v1/expenses/hidden', { params });
    return response.data;
  },
  updateExpense: async (id, data) => {
    const response = await apiClient.put(`/api/v1/expenses/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  deleteExpense: async (id) => {
    const response = await apiClient.delete(`/api/v1/expenses/${id}`);
    return response.data;
  },
  hideExpense: async (id) => {
    const response = await apiClient.put(`/api/v1/expenses/${id}/hide`);
    return response.data;
  },
  restoreExpense: async (id) => {
    const response = await apiClient.put(`/api/v1/expenses/${id}/restore`);
    return response.data;
  }
};
