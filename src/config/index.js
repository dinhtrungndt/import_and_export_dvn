const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  TIMEOUT: 600000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

const AUTH_CONFIG = {
  TOKEN_KEY: 'vlxd_token',
  USER_KEY: 'vlxd_user',
  TOKEN_EXPIRATION: 30 * 24 * 60 * 60 * 1000
};

// App Configuration
const APP_CONFIG = {
  APP_NAME: 'Hệ thống Quản lý VLXD',
  DEFAULT_PAGE_SIZE: 10,

  // Các loại sản phẩm VLXD (Khớp với dữ liệu bạn sẽ nhập)
  PRODUCT_CATEGORIES: [
    { value: 'cat_san_lap', label: 'Cát xây dựng / Cát san lấp' },
    { value: 'da_xay_dung', label: 'Đá xây dựng (1x2, 4x6, mi...)' },
    { value: 'xi_mang', label: 'Xi măng' },
    { value: 'sat_thep', label: 'Sắt thép các loại' },
    { value: 'gach_ngoi', label: 'Gạch, ngói' },
    { value: 'khac', label: 'Vật liệu khác' }
  ],

  // Trạng thái đơn hàng (Khớp chính xác với model Order trong FastAPI)
  ORDER_STATUSES: [
    { value: 'Chờ duyệt', label: 'Chờ duyệt' },
    { value: 'Đang giao', label: 'Đang giao' },
    { value: 'Hoàn thành', label: 'Hoàn thành' },
    { value: 'Đã hủy', label: 'Đã hủy' }
  ]
};

export { API_CONFIG, AUTH_CONFIG, APP_CONFIG };
