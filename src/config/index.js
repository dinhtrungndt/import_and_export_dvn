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

  // Phân loại chi tiết (sub_category) theo từng danh mục chính
  SUB_CATEGORIES: {
    'sat-thep': ['Sắt D6', 'Sắt D8', 'Sắt D10', 'Sắt D12', 'Sắt D14', 'Sắt D16', 'Sắt D18', 'Sắt D20', 'Sắt D22', 'Sắt D25', 'Thép cuộn', 'Khác'],
    'cat-da-dong-bao': ['Cát đóng bao 25kg', 'Cát đóng bao 50kg', 'Đá đóng bao 0x4', 'Đá đóng bao 1x2', 'Khác'],
    'cat-xay-dung': ['Cát san lấp', 'Cát xây tô', 'Cát bê tông', 'Cát mịn', 'Cát lấp hố', 'Khác'],
    'gach-tuynel': ['Gạch 4 lỗ', 'Gạch 6 lỗ', 'Gạch đặc', 'Gạch ngói', 'Gạch chỉ', 'Hourdis', 'Khác'],
    'da-xay-dung': ['Đá mi bụi', 'Đá mi sàng', 'Đá 0x4', 'Đá 1x2', 'Đá 4x6', 'Đá hộc', 'Đá cấp phối dmax 25', 'Xà bần sạch', 'Khác'],
    'xi-mang': ['Xi măng Thăng Long', 'Xi măng Nghi Sơn', 'Xi măng INSEE', 'Xi măng Hoàng Thạch', 'Xi măng Hà Tiên', 'Xi măng SCG', 'Khác'],
    'day-kem-dinh': ['Dây kẽm buộc', 'Dây kẽm B40', "Đinh 1'", "Đinh 2'", "Đinh 3'", "Đinh 4'", 'Đinh tán', 'Khác'],
    'luoi-thep': ['Lưới thép hàn', 'Lưới thép D4', 'Lưới thép D6', 'Lưới B40', 'Lưới rào', 'Khác'],
    'thep-hinh': ['Thép I', 'Thép H', 'Thép U', 'Thép L', 'Thép V', 'Thép T', 'Khác'],
    'thep-hop': ['Thép hộp 20x20', 'Thép hộp 25x25', 'Thép hộp 30x30', 'Thép hộp 40x40', 'Thép hộp 50x50', 'Thép hộp dẹt', 'Khác'],
    'khac': ['Vữa trộn sẵn', 'Phụ gia xây dựng', 'Chất chống thấm', 'Sơn lót', 'Khác'],
  },

  // Đơn vị tính phổ biến
  PRODUCT_UNITS: ['Khối', 'Bao', 'Kg', 'Tấn', 'Viên', 'Cây', 'Cuộn', 'Cái'],

  // Trạng thái đơn hàng (Khớp chính xác với model Order trong FastAPI)
  ORDER_STATUSES: [
    { value: 'Chờ duyệt', label: 'Chờ duyệt' },
    { value: 'Đang giao', label: 'Đang giao' },
    { value: 'Hoàn thành', label: 'Hoàn thành' },
    { value: 'Đã hủy', label: 'Đã hủy' }
  ]
};

export { API_CONFIG, AUTH_CONFIG, APP_CONFIG };
