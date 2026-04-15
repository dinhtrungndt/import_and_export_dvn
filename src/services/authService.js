import axios from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '../config';

// Tạo instance axios với config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

// Đăng ký tài khoản (Dùng /api/v1/auth/register)
export const register = async (userData) => {
  try {
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi kết nối server' };
  }
};

// Đăng nhập (LƯU Ý: FastAPI yêu cầu URLSearchParams cho OAuth2)
export const login = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (response.data && response.data.access_token) {
      // Lưu token vào localStorage
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.data.access_token);

      // Gọi API lấy thông tin user ngay lập tức
      const userResponse = await api.get('/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${response.data.access_token}` }
      });

      // Lưu thông tin user
      localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(userResponse.data));
      return userResponse.data;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi kết nối server' };
  }
};

// Đăng xuất
export const logout = () => {
  localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  localStorage.removeItem(AUTH_CONFIG.USER_KEY);
};

// Lấy thông tin người dùng hiện tại từ localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(AUTH_CONFIG.USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    return null;
  }
};

// Kiểm tra token
export const isTokenValid = () => {
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  return !!token;
};

// Lấy thông tin user profile từ API
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (!token) throw new Error('Không tìm thấy token xác thực');

    const response = await api.get('/api/v1/auth/me');
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(updatedUser));
    }
    return response.data;
  } catch (error) {
    logout();
    throw error.response?.data || { detail: 'Lỗi kết nối server' };
  }
};

// Interceptors để gắn Token vào tất cả Request
export const setupAxiosInterceptors = () => {
  api.interceptors.request.use(
    config => {
      const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Xử lý lỗi 401 Unauthorized
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

export const apiClient = api;
