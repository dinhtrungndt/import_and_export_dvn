import { useEffect, useRef, useState } from 'react';
import {
  FaBars,
  FaChartLine,
  FaChevronDown,
  FaClipboardList,
  FaHardHat,
  FaPhone,
  FaSearch,
  FaShoppingBag,
  FaShoppingCart,
  FaSignOutAlt,
  FaTimes,
  FaTrashAlt,
  FaUser,
  FaEnvelope
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { fetchProducts } from '../../stores/redux/actions/adminActions.js';
import { SideBar } from '../sidebar';

/* ─────────────────────────────────────────────
   Dữ liệu menu
───────────────────────────────────────────── */
const PRODUCTS_SUBMENU = [
  { label: 'Sắt Thép Xây Dựng', href: '/products?category=sat-thep' },
  { label: 'Cát Đá Đóng Bao', href: '/products?category=cat-da-dong-bao' },
  { label: 'Cát Xây Dựng', href: '/products?category=cat-xay-dung' },
  { label: 'Gạch Tuynel', href: '/products?category=gach-tuynel' },
  { label: 'Đá Xây Dựng', href: '/products?category=da-xay-dung' },
  { label: 'Xi Măng', href: '/products?category=xi-mang' },
  { label: 'Dây Kẽm & Đinh', href: '/products?category=day-kem-dinh' },
  { label: 'Lưới Thép', href: '/products?category=luoi-thep' },
  { label: 'Thép Hình', href: '/products?category=thep-hinh' },
  { label: 'Thép Hộp', href: '/products?category=thep-hop' },
];

const PRICE_MEGAMENU = [
  {
    title: 'Báo giá Đá',
    href: '/bao-gia',
    items: [
      { label: 'Đá mi bụi', href: '/bao-gia/bao-gia-da-mi-bui' },
      { label: 'Đá mi sàng', href: '/bao-gia/bao-gia-da-mi-sang' },
      { label: 'Đá 0x4', href: '/bao-gia/bao-gia-da-0x4' },
      { label: 'Đá 1×2', href: '/bao-gia/bao-gia-da-1x2' },
      { label: 'Đá 4×6', href: '/bao-gia/bao-gia-da-4x6' },
      { label: 'Đá hộc', href: '/bao-gia/bao-gia-da-hoc' },
      { label: 'Đá cấp phối dmax 25', href: '/bao-gia/bao-gia-da-cap-phoi' },
    ],
  },
  {
    title: 'Báo giá Cát',
    href: '/bao-gia/bao-gia-cat-da-dong-bao-quan-11',
    items: [
      { label: 'Cát san lấp', href: '/bao-gia/bao-gia-cat-san-lap' },
      { label: 'Cát xây tô', href: '/bao-gia/bao-gia-cat-xay-to' },
      { label: 'Cát bê tông', href: '/bao-gia/bao-gia-cat-be-tong' },
    ],
  },
  {
    title: 'Báo giá Xi Măng',
    href: '/bao-gia/bao-gia-xi-mang-xay-dung-moi-nhat',
    items: [
      { label: 'Xi măng Thăng Long', href: '/bao-gia/bao-gia-xi-mang-thang-long' },
      { label: 'Xi măng Nghi Sơn', href: '/bao-gia/bao-gia-xi-mang-nghi-son' },
      { label: 'Xi măng INSEE', href: '/bao-gia/bao-gia-xi-mang-insee' },
      { label: 'Xi măng Hoàng Thạch', href: '/bao-gia/bao-gia-xi-mang-hoang-thach' },
      { label: 'Xi măng Hà Tiên', href: '/bao-gia/bao-gia-xi-mang-ha-tien' },
    ],
  },
  {
    title: 'Báo giá VLXD Khác',
    href: '/bao-gia',
    items: [
      { label: 'Xà bần sạch', href: '/bao-gia/bao-gia-xa-ban-sach' },
      { label: 'Sắt hộp', href: '/bao-gia/bao-gia-sat-hop-quan-tan-binh-uy-tin' },
      { label: 'Vữa trộn sẵn', href: '/bao-gia/bao-gia-vua-tron-san-2026' }
    ],
  },
];

/* ─────────────────────────────────────────────
   Hook: đóng dropdown khi click ra ngoài
───────────────────────────────────────────── */
function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

/* ─────────────────────────────────────────────
   Dropdown đơn giản (Sản phẩm VLXD)
───────────────────────────────────────────── */
const SimpleDropdown = ({ label, items, isActive, href }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const closeTimer = useRef(null);
  useOutsideClick(ref, () => setOpen(false));

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      ref={ref}
      className="relative group h-full flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={href}
        className={`flex items-center gap-1.5 py-1 font-bold text-[13px] tracking-wider uppercase transition-all duration-300 border-b-2 ${isActive
            ? 'text-blue-700 border-blue-700'
            : 'text-slate-600 border-transparent hover:text-blue-600 hover:border-blue-600'
          }`}
        onClick={() => setOpen(false)}
      >
        {label}
        <FaChevronDown
          className={`text-[10px] transition-transform duration-300 ${open ? 'rotate-180 text-blue-600' : ''}`}
        />
      </Link>

      <div
        className="absolute left-0 top-[100%] w-56 pt-2 z-50"
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        <div
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0) scaleY(1)' : 'translateY(-10px) scaleY(0.95)',
            transformOrigin: 'top',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
          className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="block px-5 py-3 text-sm text-slate-700 font-semibold hover:bg-blue-50 hover:text-blue-700 hover:pl-6 transition-all duration-200 border-b border-slate-50 last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Mega Dropdown (Báo Giá)
───────────────────────────────────────────── */
const MegaDropdown = ({ label, columns, isActive, href }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const closeTimer = useRef(null);
  useOutsideClick(ref, () => setOpen(false));

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      ref={ref}
      className="relative group h-full flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={href}
        className={`flex items-center gap-1.5 py-1 font-bold text-[13px] tracking-wider uppercase transition-all duration-300 border-b-2 ${isActive
            ? 'text-blue-700 border-blue-700'
            : 'text-slate-600 border-transparent hover:text-blue-600 hover:border-blue-600'
          }`}
        onClick={() => setOpen(false)}
      >
        {label}
        <FaChevronDown
          className={`text-[10px] transition-transform duration-300 ${open ? 'rotate-180 text-blue-600' : ''}`}
        />
      </Link>

      <div
        className="absolute left-1/2 top-[100%] pt-2 z-50"
        style={{
          transform: 'translateX(-50%)',
          minWidth: '700px',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0) scaleY(1)' : 'translateY(-10px) scaleY(0.95)',
            transformOrigin: 'top',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
          className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden"
        >
          <div className="grid grid-cols-4 gap-0 p-6 relative">
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-slate-50/50 -z-10 border-l border-slate-100"></div>
            {columns.map((col) => (
              <div key={col.title} className="px-4 border-r border-slate-100 last:border-0">
                <Link
                  to={col.href}
                  onClick={() => setOpen(false)}
                  className="block text-xs font-extrabold text-slate-800 uppercase tracking-widest mb-4 hover:text-blue-700"
                >
                  {col.title}
                </Link>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="block text-sm text-slate-600 font-medium hover:text-blue-700 hover:pl-1 transition-all duration-200"
                      >
                        › {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Báo giá theo khối lượng dự án lớn?</span>
            <Link to="/contact" className="text-blue-700 font-bold hover:underline" onClick={() => setOpen(false)}>Liên hệ ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Link đơn giản cho nav
───────────────────────────────────────────── */
const NavLink = ({ to, children, isActive }) => (
  <Link
    to={to}
    className={`h-full flex items-center py-1 font-bold text-[13px] tracking-wider uppercase transition-all duration-300 border-b-2 whitespace-nowrap ${isActive
        ? 'text-blue-700 border-blue-700'
        : 'text-slate-600 border-transparent hover:text-blue-600 hover:border-blue-600'
      }`}
  >
    {children}
  </Link>
);

/* ─────────────────────────────────────────────
   Header chính
───────────────────────────────────────────── */
export const HeaderPage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.adminReducer || {});
  const [searchResults, setSearchResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);

  const profileRef = useRef(null);
  const searchInputRef = useRef(null);
  const cartRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  // Cart Hook
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  useEffect(() => {
    if (searchQuery.trim().length >= 2 && products?.length > 0) {
      const query = searchQuery.toLowerCase();
      const removeAccents = (str) =>
        str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
      const noAccentQuery = removeAccents(query);

      const matched = products
        .filter((p) => {
          const nameLower = p.name ? p.name.toLowerCase() : '';
          return nameLower.includes(query) || removeAccents(nameLower).includes(noAccentQuery);
        })
        .slice(0, 6);
      setSearchResults(matched);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  const HighlightText = ({ text, highlight }) => {
    if (!highlight.trim() || !text) return <>{text}</>;
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 text-blue-700 font-bold px-0.5 rounded-sm">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  useOutsideClick(profileRef, () => setIsProfileDropdownOpen(false));
  useOutsideClick(cartRef, () => setIsCartDropdownOpen(false));

  const toggleMenu = () => {
    setIsMenuOpen((v) => !v);
    setIsProfileDropdownOpen(false);
    setIsCartDropdownOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchActive((v) => {
      if (!v) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      return !v;
    });
    if (isSearchActive) setSearchQuery('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchActive(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileDropdownOpen(false);
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  /* ── Top bar thông tin ── */
  const TopBar = () => (
    <div className="hidden lg:flex items-center justify-between bg-blue-700 text-blue-100 text-xs px-8 py-1.5 border-b border-blue-800">
      <span className="flex items-center gap-2 font-medium tracking-wide">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        Hệ thống phân phối sỉ & lẻ Vật Liệu Xây Dựng toàn quốc
      </span>
      <div className="flex items-center gap-4">
        <a href="mailto:nguyendinhtrung.it@gmail.com" className="flex items-center gap-1.5 hover:text-white transition font-medium">
          <FaEnvelope className="text-yellow-400" />
          Email: <span className="text-white tracking-wider">nguyendinhtrung.it@gmail.com</span>
        </a>
        <div className="h-3 w-px bg-blue-500/50"></div>
        <a href="tel:0889541507" className="flex items-center gap-1.5 hover:text-white transition font-medium">
          <FaPhone className="text-yellow-400" />
          Hotline 24/7: <span className="text-white font-bold tracking-wider">0889 541 507</span>
        </a>
        <div className="h-3 w-px bg-blue-500/50"></div>
        {!isAuthenticated ? (
          <div className="flex items-center gap-3 font-medium">
            <Link to="/login" className="hover:text-white transition">Đăng nhập</Link>
            <span className="text-blue-300">/</span>
            <Link to="/register" className="hover:text-white transition">Đăng ký</Link>
          </div>
        ) : (
          <div className="text-blue-200 font-medium">Xin chào, {user?.name || 'Thành viên'}</div>
        )}
      </div>
    </div>
  );

  return (
    <header className="relative z-50 sticky top-0 w-full shadow-sm" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <TopBar />

      {/* Main Header Container - Lighter/Compact */}
      <div className="relative bg-white border-b border-slate-200 min-h-[60px] lg:min-h-[64px] flex items-center transition-all duration-300">

        {/* Navigation Content Wrapper */}
        <div className="w-full px-4 lg:px-8 flex items-center justify-between h-full">

          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              className="text-2xl lg:hidden text-slate-500 hover:text-blue-600 transition p-1 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200"
              onClick={toggleMenu}
              aria-label="Mở menu"
            >
              <FaBars />
            </button>
            <Link
              to="/"
              className="flex items-center gap-2.5 group select-none"
            >
              <div className="w-8 h-8 lg:w-9 lg:h-9 bg-blue-600 rounded-lg flex items-center justify-center transform -rotate-3 shadow-sm group-hover:rotate-0 transition-transform duration-300">
                <FaHardHat className="text-white text-xl lg:text-2xl" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-blue-700 font-black text-lg lg:text-xl tracking-tight leading-none uppercase drop-shadow-sm">
                  VLXD DVN
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Center Component */}
          <nav className="hidden lg:flex items-center gap-8 h-full min-h-[64px]">
            <NavLink to="/" isActive={isActive('/')}>Trang Chủ</NavLink>
            <NavLink to="/about" isActive={isActive('/about')}>Giới Thiệu</NavLink>
            <SimpleDropdown
              label="Sản Phẩm"
              items={PRODUCTS_SUBMENU}
              isActive={isActive('/products')}
              href="/products"
            />
            <MegaDropdown
              label="Báo Giá"
              columns={PRICE_MEGAMENU}
              isActive={isActive('/bao-gia')}
              href="/bao-gia"
            />
            <NavLink to="/dich-vu" isActive={isActive('/dich-vu')}>Dịch Vụ</NavLink>
            <NavLink to="/tin-tuc" isActive={isActive('/tin-tuc')}>Tin Tức</NavLink>
            <NavLink to="/contact" isActive={isActive('/contact')}>Liên Hệ</NavLink>
          </nav>

          {/* Right End: Search, Cart, Profile */}
          <div className="flex items-center gap-2 sm:gap-2">

            {/* Search Icon */}
            <button
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all duration-300 group border border-slate-200 hover:border-blue-200 shadow-sm"
              onClick={toggleSearch}
              aria-label="Tìm kiếm"
            >
              <FaSearch className="text-[15px] relative z-10 group-hover:scale-110 transition-transform" />
            </button>

            {/* Profile Dropdown Component */}
            <div className="relative" ref={profileRef}>
              <button
                className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all duration-300 group border border-slate-200 hover:border-blue-200 shadow-sm"
                onClick={() => { setIsProfileDropdownOpen((v) => !v); setIsCartDropdownOpen(false); }}
              >
                <FaUser className="text-[15px] relative z-10 group-hover:scale-110 transition-transform" />
              </button>

              {/* Profile Menu Flyout */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.15)] py-2 z-50 border border-slate-100 overflow-hidden transform origin-top-right animate-in fade-in zoom-in duration-200">
                  {isAuthenticated ? (
                    <>
                      <div className="px-5 py-4 bg-blue-600 text-white">
                        <div className="font-bold truncate text-sm">{user?.name || 'Khách hàng'}</div>
                        <div className="text-xs text-blue-100 truncate mt-0.5">{user?.username}</div>
                      </div>
                      <div className="py-1 relative">
                        <Link
                          to="/account"
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 font-medium hover:bg-slate-50 hover:text-blue-600 transition"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><FaUser size={12} /></div> Tài khoản riêng
                        </Link>
                        <Link
                          to="/order-history"
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 font-medium hover:bg-slate-50 hover:text-blue-600 transition"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><FaClipboardList size={12} /></div> Lịch sử đơn hàng
                        </Link>

                        {hasRole(['admin', 'manager']) && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 font-medium hover:bg-slate-50 hover:text-blue-600 transition border-t border-slate-100 mt-1"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><FaChartLine size={12} /></div> Trang Quản Trị
                          </Link>
                        )}
                        {hasRole(['staff']) && (
                          <Link
                            to="/staff"
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 font-medium hover:bg-slate-50 hover:text-blue-600 transition border-t border-slate-100 mt-1"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center text-orange-500"><FaShoppingBag size={12} /></div> Quản Lý Kho
                          </Link>
                        )}
                        <button
                          className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-rose-600 font-bold hover:bg-rose-50 transition border-t border-slate-100 mt-1"
                          onClick={handleLogout}
                        >
                          <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center"><FaSignOutAlt size={12} /></div> Đăng xuất
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2 space-y-1 relative">
                      <Link
                        to="/login"
                        className="block px-4 py-2.5 text-sm font-bold text-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Đăng Nhập
                      </Link>
                      <div className="text-center py-1.5 text-[11px] text-slate-400">Chưa có tài khoản?</div>
                      <Link
                        to="/register"
                        className="block px-4 py-2.5 text-sm font-bold text-center bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Đăng Ký Thành Viên
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Icon & Dropdown */}
            <div className="relative" ref={cartRef}>
              <button
                className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all duration-300 group shadow-sm border border-slate-200 hover:border-blue-200"
                onClick={() => { setIsCartDropdownOpen(v => !v); setIsProfileDropdownOpen(false); }}
              >
                <FaShoppingCart className="text-[15px] relative z-10 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-0.5 bg-rose-500 text-white text-[9px] leading-none font-bold min-w-[18px] px-1 h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-sm transform group-hover:scale-110 transition-transform z-20">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {isCartDropdownOpen && (
                <div className="absolute right-0 mt-3 w-[340px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] py-0 z-50 border border-slate-100 overflow-hidden transform origin-top-right animate-in fade-in zoom-in duration-200 flex flex-col">

                  {/* Cart Header */}
                  <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm tracking-wide flex items-center gap-2">
                      <FaShoppingCart className="text-slate-400" /> Giỏ hàng của bạn
                    </span>
                    <span className="bg-rose-100 text-rose-600 text-xs font-black px-2.5 py-0.5 rounded-full border border-rose-200">
                      {cartCount} món
                    </span>
                  </div>

                  {/* Cart Body */}
                  <div className="max-h-[300px] overflow-y-auto w-full custom-scrollbar">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-10 px-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FaShoppingCart className="text-2xl text-slate-300" />
                        </div>
                        <p className="text-sm font-semibold text-slate-600">Giỏ hàng trống</p>
                        <p className="text-xs text-slate-400 mt-1">Lựa chọn vật liệu với giá tốt nhất cùng DVN!</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {cartItems.map((item, index) => (
                          <div key={index} className="flex gap-3 items-center p-4 hover:bg-slate-50/80 transition group">

                            {/* Product Thumbnail */}
                            <div className="w-14 h-14 bg-white rounded-lg border border-slate-200 shrink-0 shadow-sm flex items-center justify-center overflow-hidden">
                              <img src={item.image || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&name=${encodeURIComponent(item.name)}`} alt={item.name} className="w-full h-full object-cover" />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="text-sm font-bold text-slate-800 truncate mb-0.5 group-hover:text-blue-600 transition-colors w-full">{item.name}</div>
                              <div className="text-xs text-slate-500 flex items-center justify-between mt-1">
                                <span>{formatPrice(item.price)} <span className="text-[10px] text-slate-400">/ {item.unit}</span></span>
                                <div className="flex items-center border border-slate-200 rounded min-w-[60px] bg-white text-slate-800">
                                   <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(item.id, Math.max(1, item.quantity - 1)); }} className="w-5 h-5 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition">-</button>
                                   <input title="Số lượng" type="number" onClick={(e) => e.stopPropagation()} onChange={(e) => updateQuantity(item.id, Math.max(1, Number(e.target.value)))} value={item.quantity} className="w-8 text-center font-bold text-slate-700 text-[11px] focus:outline-none appearance-none" style={{MozAppearance: 'textfield'}} />
                                   <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(item.id, item.quantity + 1); }} className="w-5 h-5 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition">+</button>
                                </div>
                              </div>
                              <div className="text-[13px] font-black text-rose-600 mt-1">{formatPrice((item.price || 0) * item.quantity)}</div>
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromCart(item.id); }}
                              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded bg-white border border-transparent hover:border-rose-200 transition shrink-0"
                              title="Xóa"
                            >
                              <FaTrashAlt className="text-[11px]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Footer / Checkout */}
                  {cartItems.length > 0 && (
                    <div className="px-5 py-4 bg-slate-50/90 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wide">Tổng Mua:</span>
                        <span className="text-lg font-black text-rose-600 drop-shadow-sm">{formatPrice(cartTotal)}</span>
                      </div>
                      <Link
                        to="/checkout"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm hover:shadow-lg text-sm"
                        onClick={() => setIsCartDropdownOpen(false)}
                      >
                        Tiến Hành Đặt Hàng <FaChartLine className="text-emerald-300" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── Search Active Overlay (Light Theme) ── */}
        <div
          className={`absolute inset-0 bg-white/95 backdrop-blur-md z-[60] flex items-center px-4 lg:px-8 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top border-b border-slate-200 shadow-sm ${isSearchActive ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-90 invisible'
            }`}
        >
          <div className="absolute inset-0 bg-slate-50/50 pointer-events-none"></div>

          <form onSubmit={handleSearch} className="relative w-full max-w-4xl mx-auto flex items-center gap-2 lg:gap-4 z-10 h-full py-2">
            
            <div className="relative w-full h-full flex-1">
              <FaSearch className="hidden sm:block text-slate-400 text-xl absolute top-1/2 -translate-y-1/2 left-4 lg:left-5 pointer-events-none z-20" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Nhập tên vật liệu, danh mục (VD: Cát xây tô, Thép hộp)..."
                className="w-full h-full bg-slate-50 border border-slate-200 focus:border-blue-400 text-slate-800 placeholder-slate-400 rounded-xl py-0 pl-4 sm:pl-12 pr-4 text-sm sm:text-base focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {/* Auto suggest Dropdown Kết quả */}
              {searchQuery.trim().length >= 2 && isSearchActive && (
                 <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[70]">
                    {searchResults.length > 0 ? (
                       <ul className="divide-y divide-slate-50">
                         {searchResults.map((item) => (
                           <li key={item.id} className="hover:bg-blue-50/50 transition">
                             <Link 
                               to={`/product/${item.id}`} 
                               onClick={() => { setIsSearchActive(false); setSearchQuery(''); }}
                               className="flex items-center gap-3 p-3 sm:p-4"
                             >
                                <div className="w-12 h-12 bg-white rounded border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                   <img src={item.image || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&name=${encodeURIComponent(item.name)}`} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                   <div className="text-sm font-bold text-slate-800 truncate">
                                      <HighlightText text={item.name} highlight={searchQuery} />
                                   </div>
                                   <div className="text-rose-600 text-[13px] font-bold mt-0.5">
                                      {formatPrice(item.price)} <span className="text-slate-400 font-normal text-[11px] ml-0.5">/ {item.unit}</span>
                                   </div>
                                </div>
                             </Link>
                           </li>
                         ))}
                       </ul>
                    ) : (
                       <div className="p-6 text-center text-slate-500 text-sm">
                          Không tìm thấy sản phẩm nào phù hợp với <strong className="text-slate-800">"{searchQuery}"</strong>
                       </div>
                    )}
                 </div>
              )}
            </div>

            <button
              type="submit"
              className="h-full px-5 lg:px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-transform hover:scale-[1.02] whitespace-nowrap hidden sm:block shadow-sm shrink-0"
            >
              Tìm Kiếm
            </button>
            <button
              type="submit"
              className="h-full px-4 bg-blue-600 rounded-xl flex items-center justify-center text-white sm:hidden shrink-0 shadow-sm"
            >
              <FaSearch className="text-sm" />
            </button>

            <button
              type="button"
              className="h-full px-3 lg:px-4 flex items-center justify-center rounded-xl bg-transparent hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all shrink-0 ml-1"
              onClick={toggleSearch}
            >
              <FaTimes className="text-xl lg:text-2xl" />
            </button>
          </form>
        </div>
      </div>

      {true && (
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f8fafc;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
      )}

      {/* ── Mobile Sidebar ── */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <SideBar toggleMenu={toggleMenu} currentPath={location.pathname} />
        </div>
      )}
    </header>
  );
};
