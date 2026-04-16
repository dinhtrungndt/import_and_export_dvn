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
    { value: 'sat-thep', label: 'Sắt Thép Xây Dựng' },
    { value: 'cat-da-dong-bao', label: 'Cát Đá Đóng Bao' },
    { value: 'cat-xay-dung', label: 'Cát Xây Dựng / Cát San Lấp' },
    { value: 'gach-tuynel', label: 'Gạch Tuynel / Gạch Ngói' },
    { value: 'da-xay-dung', label: 'Đá Xây Dựng' },
    { value: 'xi-mang', label: 'Xi Măng' },
    { value: 'day-kem-dinh', label: 'Dây Kẽm & Đinh' },
    { value: 'luoi-thep', label: 'Lưới Thép' },
    { value: 'thep-hinh', label: 'Thép Hình' },
    { value: 'thep-hop', label: 'Thép Hộp' },
    { value: 'khac', label: 'Vật Liệu Khác' }
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
