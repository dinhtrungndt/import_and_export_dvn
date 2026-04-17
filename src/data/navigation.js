/**
 * navigation.js — Dữ liệu điều hướng dùng chung cho Header & Sidebar
 * Chỉnh sửa tại đây sẽ tự động áp dụng cho cả 2 component.
 */

/** Danh mục sản phẩm VLXD (dùng cho dropdown Sản Phẩm trong Header & Sidebar) */
export const PRODUCTS_SUBMENU = [
  { label: 'Sắt Thép Xây Dựng',  href: '/products?category=sat-thep' },
  { label: 'Cát Đá Đóng Bao',    href: '/products?category=cat-da-dong-bao' },
  { label: 'Cát Xây Dựng',        href: '/products?category=cat-xay-dung' },
  { label: 'Gạch Tuynel',          href: '/products?category=gach-tuynel' },
  { label: 'Đá Xây Dựng',         href: '/products?category=da-xay-dung' },
  { label: 'Xi Măng',              href: '/products?category=xi-mang' },
  { label: 'Dây Kẽm & Đinh',      href: '/products?category=day-kem-dinh' },
  { label: 'Lưới Thép',            href: '/products?category=luoi-thep' },
  { label: 'Thép Hình',            href: '/products?category=thep-hinh' },
  { label: 'Thép Hộp',             href: '/products?category=thep-hop' },
];

/** Mega-menu Báo Giá (dùng cho Header desktop) */
export const PRICE_MEGAMENU = [
  {
    title: 'Báo giá Đá',
    href: '/bao-gia',
    items: [
      { label: 'Đá mi bụi',             href: '/bao-gia/bao-gia-da-mi-bui' },
      { label: 'Đá mi sàng',            href: '/bao-gia/bao-gia-da-mi-sang' },
      { label: 'Đá 0x4',                href: '/bao-gia/bao-gia-da-0x4' },
      { label: 'Đá 1×2',               href: '/bao-gia/bao-gia-da-1x2' },
      { label: 'Đá 4×6',               href: '/bao-gia/bao-gia-da-4x6' },
      { label: 'Đá hộc',               href: '/bao-gia/bao-gia-da-hoc' },
      { label: 'Đá cấp phối dmax 25',  href: '/bao-gia/bao-gia-da-cap-phoi' },
    ],
  },
  {
    title: 'Báo giá Cát',
    href: '/bao-gia/bao-gia-cat-da-dong-bao-quan-11',
    items: [
      { label: 'Cát san lấp',  href: '/bao-gia/bao-gia-cat-san-lap' },
      { label: 'Cát xây tô',   href: '/bao-gia/bao-gia-cat-xay-to' },
      { label: 'Cát bê tông',  href: '/bao-gia/bao-gia-cat-be-tong' },
    ],
  },
  {
    title: 'Báo giá Xi Măng',
    href: '/bao-gia/bao-gia-xi-mang-xay-dung-moi-nhat',
    items: [
      { label: 'Xi măng Thăng Long',  href: '/bao-gia/bao-gia-xi-mang-thang-long' },
      { label: 'Xi măng Nghi Sơn',   href: '/bao-gia/bao-gia-xi-mang-nghi-son' },
      { label: 'Xi măng INSEE',       href: '/bao-gia/bao-gia-xi-mang-insee' },
      { label: 'Xi măng Hoàng Thạch', href: '/bao-gia/bao-gia-xi-mang-hoang-thach' },
      { label: 'Xi măng Hà Tiên',     href: '/bao-gia/bao-gia-xi-mang-ha-tien' },
    ],
  },
  {
    title: 'Báo giá VLXD Khác',
    href: '/bao-gia',
    items: [
      { label: 'Xà bần sạch',  href: '/bao-gia/bao-gia-xa-ban-sach' },
      { label: 'Sắt hộp',      href: '/bao-gia/bao-gia-sat-hop-quan-tan-binh-uy-tin' },
      { label: 'Vữa trộn sẵn', href: '/bao-gia/bao-gia-vua-tron-san-2026' },
    ],
  },
];

/** Submenu Báo Giá đơn giản (dùng cho Sidebar mobile) */
export const PRICE_SUBMENU_MOBILE = [
  { label: 'Đá mi bụi',           href: '/products?search=Đá mi bụi' },
  { label: 'Đá mi sàng',          href: '/products?search=Đá mi sàng' },
  { label: 'Đá 0x4',              href: '/products?search=Đá 0x4' },
  { label: 'Đá 1×2',             href: '/products?search=Đá 1x2' },
  { label: 'Cát san lấp',         href: '/products?search=Cát san lấp' },
  { label: 'Cát xây tô',          href: '/products?search=Cát xây tô' },
  { label: 'Cát bê tông',         href: '/products?search=Cát bê tông' },
  { label: 'Xi măng Thăng Long',  href: '/products?search=Xi măng Thăng Long' },
  { label: 'Xi măng Nghi Sơn',    href: '/products?search=Xi măng Nghi Sơn' },
  { label: 'Xà bần sạch',         href: '/products?search=Xà bần sạch' },
];
