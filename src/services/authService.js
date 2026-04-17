import axios from 'axios';
import CryptoJS from 'crypto-js';
import { API_CONFIG, AUTH_CONFIG } from '../config';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

// Tạo instance axios với config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

// Đăng ký tài khoản
export const register = async (userData) => {
  try {
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi kết nối server' };
  }
};

// Đăng nhập
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
      // Lưu token vào localStorage (Mã hóa)
      const encryptedToken = CryptoJS.AES.encrypt(response.data.access_token, SECRET_KEY).toString();
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, encryptedToken);

      // Gọi API lấy thông tin user ngay lập tức
      const userResponse = await api.get('/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${response.data.access_token}` }
      });

      // Lọc thông tin an toàn, chỉ lưu những gì cần hiển thị UI vào localStorage (Clear F12)
      const { username, name, email, phone, role } = userResponse.data;
      const safeUserData = { username, name, email, phone, role };

      // Mã hóa thông tin trước khi lưu (Giấu khỏi F12)
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(safeUserData), SECRET_KEY).toString();
      localStorage.setItem(AUTH_CONFIG.USER_KEY, encryptedData);

      return safeUserData;
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

  // Dữ liệu cũ dạng JSON chưa mã hoá
  if (userStr.startsWith('{')) {
    try { return JSON.parse(userStr); } catch (e) { return null; }
  }

  try {
    // Giải mã AES
    const bytes = CryptoJS.AES.decrypt(userStr, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    return null;
  }
};

// Helper lấy Token đã giải mã
export const getAccessToken = () => {
  const tokenStr = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  if (!tokenStr) return null;

  if (tokenStr.startsWith('eyJ')) return tokenStr;

  try {
    const bytes = CryptoJS.AES.decrypt(tokenStr, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
};

// Kiểm tra token
export const isTokenValid = () => {
  return !!getAccessToken();
};

// Lấy thông tin user profile từ API
export const getUserProfile = async () => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error('Không tìm thấy token xác thực');

    const response = await api.get('/api/v1/auth/me');
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...response.data };

      // Lọc thông tin an toàn
      const { username, name, email, phone, role } = updatedUser;
      const safeUserData = { username, name, email, phone, role };

      // Mã hoá trước khi lưu
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(safeUserData), SECRET_KEY).toString();
      localStorage.setItem(AUTH_CONFIG.USER_KEY, encryptedData);
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
      const token = getAccessToken();
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
