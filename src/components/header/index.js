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
  FaSignOutAlt,
  FaTimes,
  FaUser
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchProducts } from '../../stores/redux/actions/adminActions.js';
import { SideBar } from '../sidebar';

/* ─────────────────────────────────────────────
   Dữ liệu menu
───────────────────────────────────────────── */
const PRODUCTS_SUBMENU = [
  { label: 'Sắt Thép Xây Dựng', href: '/products?cat=sat-thep' },
  { label: 'Cát Đá Đóng Bao', href: '/products?cat=cat-da-dong-bao' },
  { label: 'Cát Xây Dựng', href: '/products?cat=cat-xay-dung' },
  { label: 'Gạch Tuynel', href: '/products?cat=gach-tuynel' },
  { label: 'Đá Xây Dựng', href: '/products?cat=da-xay-dung' },
  { label: 'Xi Măng', href: '/products?cat=xi-mang' },
  { label: 'Dây Kẽm & Đinh', href: '/products?cat=day-kem-dinh' },
  { label: 'Lưới Thép', href: '/products?cat=luoi-thep' },
  { label: 'Thép Hình', href: '/products?cat=thep-hinh' },
  { label: 'Thép Hộp', href: '/products?cat=thep-hop' },
];

const PRICE_MEGAMENU = [
  {
    title: 'Báo giá Đá',
    href: '/products?cat=da-xay-dung',
    items: [
      { label: 'Đá mi bụi', href: '/products?cat=da-mi-bui' },
      { label: 'Đá mi sàng', href: '/products?cat=da-mi-sang' },
      { label: 'Đá 0x4', href: '/products?cat=da-0x4' },
      { label: 'Đá 1×2', href: '/products?cat=da-1x2' },
      { label: 'Đá 4×6', href: '/products?cat=da-4x6' },
      { label: 'Đá hộc', href: '/products?cat=da-hoc' },
      { label: 'Đá cấp phối dmax 25, dmax 37.5', href: '/products?cat=da-cap-phoi' },
    ],
  },
  {
    title: 'Báo giá Cát',
    href: '/products?cat=cat-xay-dung',
    items: [
      { label: 'Cát san lấp', href: '/products?cat=cat-san-lap' },
      { label: 'Cát xây tô', href: '/products?cat=cat-xay-to' },
      { label: 'Cát bê tông', href: '/products?cat=cat-be-tong' },
    ],
  },
  {
    title: 'Báo giá Xi Măng',
    href: '/products?cat=xi-mang',
    items: [
      { label: 'Xi măng Thăng Long', href: '/products?cat=xi-mang-thang-long' },
      { label: 'Xi măng Nghi Sơn', href: '/products?cat=xi-mang-nghi-son' },
      { label: 'Xi măng INSEE', href: '/products?cat=xi-mang-insee' },
      { label: 'Xi măng Hoàng Thạch', href: '/products?cat=xi-mang-hoang-thach' },
      { label: 'Xi măng Hà Tiên', href: '/products?cat=xi-mang-ha-tien' },
      { label: 'Xi măng Bỉm Sơn', href: '/products?cat=xi-mang-bim-son' },
    ],
  },
  {
    title: 'Báo giá Xà Bần',
    href: '/products?cat=xa-ban',
    items: [
      { label: 'Xà bần sạch', href: '/products?cat=xa-ban-sach' },
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
const SimpleDropdown = ({ label, items, isActive }) => {
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
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1.5 py-1 font-semibold text-sm tracking-wide uppercase transition-all duration-200 border-b-2 ${isActive
          ? 'text-yellow-400 border-yellow-400'
          : 'text-white border-transparent hover:text-yellow-300 hover:border-yellow-300'
          }`}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <FaChevronDown
          className={`text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel — pt-2 làm "cầu nối" ẩn giữa button và panel */}
      <div
        className="absolute left-0 top-full w-52 pt-2 z-50"
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        <div
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0) scaleY(1)' : 'translateY(-6px) scaleY(0.95)',
            transformOrigin: 'top',
            transition: 'opacity 0.18s ease, transform 0.18s ease',
          }}
          className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 border-b border-gray-50 last:border-0"
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
const MegaDropdown = ({ label, columns, isActive }) => {
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
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1.5 py-1 font-semibold text-sm tracking-wide uppercase transition-all duration-200 border-b-2 ${isActive
          ? 'text-yellow-400 border-yellow-400'
          : 'text-white border-transparent hover:text-yellow-300 hover:border-yellow-300'
          }`}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <FaChevronDown
          className={`text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Mega panel — wrapper có pt-2 làm "cầu nối" ẩn giữa button và panel */}
      <div
        className="absolute left-1/2 top-full pt-2 z-50"
        style={{
          transform: 'translateX(-50%)',
          minWidth: '640px',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0) scaleY(1)' : 'translateY(-6px) scaleY(0.95)',
            transformOrigin: 'top',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          <div className="grid grid-cols-4 gap-0 p-6">
            {columns.map((col) => (
              <div key={col.title} className="pr-4 border-r border-gray-100 last:border-0 last:pr-0">
                <Link
                  to={col.href}
                  onClick={() => setOpen(false)}
                  className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 hover:text-blue-900"
                >
                  {col.title}
                </Link>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="block text-sm text-gray-600 hover:text-blue-700 hover:pl-1 transition-all duration-150"
                      >
                        › {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
    className={`py-1 font-semibold text-sm tracking-wide uppercase transition-all duration-200 border-b-2 whitespace-nowrap ${isActive
      ? 'text-yellow-400 border-yellow-400'
      : 'text-white border-transparent hover:text-yellow-300 hover:border-yellow-300'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  useOutsideClick(profileRef, () => setIsProfileDropdownOpen(false));

  const toggleMenu = () => {
    setIsMenuOpen((v) => !v);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchActive((v) => !v);
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
    <div className="hidden lg:flex items-center justify-between bg-blue-900 text-blue-200 text-xs px-8 py-1.5">
      <span>🏗️ Chuyên cung cấp vật liệu xây dựng sỉ & lẻ toàn quốc</span>
      <div className="flex items-center gap-5">
        <a href="tel:0901234567" className="flex items-center gap-1 hover:text-yellow-400 transition">
          <FaPhone className="text-yellow-400" />
          Hotline: 0889 541 507
        </a>
        {!isAuthenticated && (
          <>
            <Link to="/login" className="hover:text-yellow-400 transition">Đăng nhập</Link>
            <span>|</span>
            <Link to="/register" className="hover:text-yellow-400 transition">Đăng ký</Link>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative z-50" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <TopBar />

      {/* ── Main Header ── */}
      {!isSearchActive ? (
        <div
          className="flex items-center justify-between px-4 lg:px-8 py-0 shadow-lg text-white"
          style={{
            background: 'linear-gradient(135deg, #1a3a8f 0%, #1d4ed8 60%, #2563eb 100%)',
            minHeight: '64px',
          }}
        >
          {/* Logo & Mobile hamburger */}
          <div className="flex items-center gap-3">
            <button
              className="text-2xl lg:hidden text-white hover:text-yellow-300 transition p-1 rounded-md"
              onClick={toggleMenu}
              aria-label="Mở menu"
            >
              <FaBars />
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 text-yellow-400 font-extrabold text-xl lg:text-2xl tracking-wide select-none"
            >
              <FaHardHat className="text-yellow-400 text-2xl" />
              <span>VLXD DVN</span>
            </Link>
          </div>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden lg:flex items-center gap-7 h-16">
            <NavLink to="/" isActive={isActive('/')}>Trang Chủ</NavLink>

            <NavLink to="/about" isActive={isActive('/about')}>Giới Thiệu</NavLink>

            <SimpleDropdown
              label="Sản Phẩm VLXD"
              items={PRODUCTS_SUBMENU}
              isActive={isActive('/products')}
            />

            <MegaDropdown
              label="Báo Giá"
              columns={PRICE_MEGAMENU}
              isActive={isActive('/price')}
            />

            <NavLink to="/services" isActive={isActive('/services')}>Dịch Vụ</NavLink>

            <NavLink to="/news" isActive={isActive('/news')}>Tin Tức</NavLink>

            <NavLink to="/contact" isActive={isActive('/contact')}>Liên Hệ</NavLink>
          </nav>

          {/* ── Right: Search + Profile ── */}
          <div className="flex items-center gap-4">
            {/* Search button */}
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              onClick={toggleSearch}
              aria-label="Tìm kiếm"
            >
              <FaSearch className="text-base" />
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 transition"
                onClick={() => setIsProfileDropdownOpen((v) => !v)}
              >
                <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center">
                  <FaUser className="text-blue-800 text-xs" />
                </div>
                {isAuthenticated && (
                  <span className="hidden xl:block text-sm font-medium max-w-[100px] truncate">
                    {user?.name}
                  </span>
                )}
                <FaChevronDown
                  className={`text-xs transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-2xl py-1 z-50 border border-gray-100 overflow-hidden">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-xl">
                        <div className="font-bold truncate">{user?.name || 'Khách hàng'}</div>
                        <div className="text-xs text-blue-200 truncate mt-0.5">{user?.username}</div>
                      </div>
                      <Link
                        to="/account"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaUser className="text-gray-400" /> Tài khoản của tôi
                      </Link>
                      <Link
                        to="/order-history"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaClipboardList className="text-gray-400" /> Lịch sử đơn hàng
                      </Link>

                      {hasRole(['admin', 'manager']) && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition border-t"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FaChartLine className="text-blue-500" /> Trang Quản Trị
                        </Link>
                      )}
                      {hasRole(['staff']) && (
                        <Link
                          to="/staff"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition border-t"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FaShoppingBag className="text-green-500" /> Quản Lý Kho
                        </Link>
                      )}

                      <button
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt /> Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-b transition"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Đăng ký tài khoản
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Search Active Mode ── */
        <div
          className="px-4 lg:px-8 py-3 flex items-center justify-center gap-3"
          style={{
            background: 'linear-gradient(135deg, #1a3a8f 0%, #1d4ed8 60%, #2563eb 100%)',
            minHeight: '64px',
          }}
        >
          <form onSubmit={handleSearch} className="flex items-center w-full max-w-2xl gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm vật liệu (cát, đá, xi măng, sắt thép)..."
                className="w-full rounded-full py-3 pl-11 pr-5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-5 py-3 rounded-full text-sm transition whitespace-nowrap shadow"
            >
              Tìm kiếm
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              onClick={toggleSearch}
            >
              <FaTimes />
            </button>
          </form>
        </div>
      )}

      {/* ── Mobile Sidebar ── */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <SideBar toggleMenu={toggleMenu} currentPath={location.pathname} />
        </div>
      )}
    </div>
  );
};
