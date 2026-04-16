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
    const response = await apiClient.post('/api/v1/orders', orderData);
    // console.log("response createOrder", response);
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
    const backendParams = {};
    if (params.startDate) backendParams.start_date = params.startDate;
    if (params.endDate) backendParams.end_date = params.endDate;
    if (params.interval) backendParams.interval = params.interval;
    const response = await apiClient.get('/api/v1/reports/revenue', { params: backendParams });
    return response.data;
  },
  getExportReport: async (params = {}) => {
    const backendParams = { type: 'export' };
    if (params.startDate) backendParams.start_date = params.startDate;
    if (params.endDate) backendParams.end_date = params.endDate;
    if (params.category) backendParams.category = params.category;
    const response = await apiClient.get('/api/v1/inventory/transactions', { params: backendParams });
    const transactions = response.data || [];
    const summary = {
      totalExports: transactions.length,
      totalQuantity: transactions.reduce((sum, t) => sum + (t.quantity || 0), 0),
      totalValue: 0
    };
    return { summary, transactions: [], categoryStats: {} };
  },
  getExpenseReport: async (params = {}) => {
    const response = await apiClient.get('/api/v1/expenses/', {});
    const expenses = response.data || [];

    // Filter theo ngày nếu có
    let filtered = expenses;
    if (params.from) {
      const fromDate = new Date(params.from);
      filtered = filtered.filter(e => new Date(e.date) >= fromDate);
    }
    if (params.to) {
      const toDate = new Date(params.to);
      toDate.setHours(23, 59, 59);
      filtered = filtered.filter(e => new Date(e.date) <= toDate);
    }

    // Group by category
    const groupedByCategory = {};
    filtered.forEach(e => {
      const cat = e.category || 'khac';
      if (!groupedByCategory[cat]) groupedByCategory[cat] = { totalAmount: 0, count: 0 };
      groupedByCategory[cat].totalAmount += e.amount;
      groupedByCategory[cat].count += 1;
    });

    // Group by time
    const groupedByTime = {};
    filtered.forEach(e => {
      const d = new Date(e.date);
      const key = params.groupBy === 'day'
        ? d.toISOString().split('T')[0]
        : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!groupedByTime[key]) groupedByTime[key] = { totalAmount: 0, count: 0 };
      groupedByTime[key].totalAmount += e.amount;
      groupedByTime[key].count += 1;
    });

    const totalAmount = filtered.reduce((sum, e) => sum + e.amount, 0);
    return {
      total: { amount: totalAmount, count: filtered.length },
      groupedByCategory,
      groupedByTime
    };
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
    // Backend không có /expenses/hidden, trả về mảng rỗng
    // Chi phí ẩn được xử lý qua PUT /{id}/hide, không có endpoint lấy danh sách
    return [];
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

export const PostService = {
  getPosts: async (params = {}) => {
    const response = await apiClient.get('/api/v1/posts/', { params });
    return response.data;
  },
  getPostBySlug: async (slug) => {
    const response = await apiClient.get(`/api/v1/posts/${slug}`);
    return response.data;
  }
};
