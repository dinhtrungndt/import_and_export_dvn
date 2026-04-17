import { useState } from 'react';
import {
  FaBox,
  FaChartLine,
  FaChevronDown,
  FaClipboardList,
  FaHandshake,
  FaHardHat,
  FaHome,
  FaInfoCircle,
  FaNewspaper,
  FaPhone,
  FaShoppingBag,
  FaSignOutAlt,
  FaTags,
  FaTimes,
  FaUser
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PRICE_SUBMENU_MOBILE, PRODUCTS_SUBMENU } from '../../data/navigation';

/* ── Accordion Item ── */
const AccordionItem = ({ icon: Icon, label, children, isChildActive, onClose, href }) => {
  const [open, setOpen] = useState(isChildActive);

  return (
    <div className="border-b border-gray-100">
      <div
        className={`flex items-center justify-between w-full text-sm font-semibold transition-colors ${isChildActive ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
          }`}
      >
        <Link
          to={href}
          onClick={onClose}
          className="flex items-center gap-3 flex-1 px-5 py-3.5 hover:text-blue-600 transition-colors"
        >
          <Icon className={isChildActive ? 'text-blue-600' : 'text-gray-400'} />
          {label}
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-3.5 border-l border-gray-100 hover:bg-gray-100"
          aria-label="Toggle submenu"
        >
          <FaChevronDown
            className={`text-xs text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      {open && (
        <div className="bg-gray-50 pb-2">
          {children.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className="flex items-center gap-2 pl-12 pr-5 py-2 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <span className="text-blue-400">›</span> {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Simple Nav Item ── */
const NavItem = ({ icon: Icon, label, href, isActive, onClose }) => (
  <Link
    to={href}
    onClick={onClose}
    className={`flex items-center gap-3 px-5 py-3.5 text-sm font-semibold border-b border-gray-100 transition-colors ${isActive
        ? 'text-blue-700 bg-blue-50 border-l-4 border-l-blue-600'
        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-l-transparent'
      }`}
  >
    <Icon className={isActive ? 'text-blue-600' : 'text-gray-400'} />
    {label}
  </Link>
);

/* ─────────────────────────────────────────────
   SideBar
───────────────────────────────────────────── */
export const SideBar = ({ toggleMenu, currentPath }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  const isActive = (path) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toggleMenu();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        style={{ backdropFilter: 'blur(2px)' }}
        onClick={toggleMenu}
      />

      {/* Sidebar Panel */}
      <div
        className="fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-2xl"
        style={{ width: 'min(320px, 85vw)', animation: 'slideInLeft 0.25s ease' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: 'linear-gradient(135deg, #1a3a8f 0%, #2563eb 100%)' }}
        >
          <Link to="/" onClick={toggleMenu} className="flex items-center gap-2 text-yellow-400 font-extrabold text-lg">
            <FaHardHat /> VLXD DVN
          </Link>
          <button
            onClick={toggleMenu}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* User Info */}
        {isAuthenticated && user && (
          <div className="px-5 py-4 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-bold">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-gray-800 truncate text-sm">{user.name}</div>
                <div className="text-xs text-gray-500 truncate">{user.username}</div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {hasRole('admin') && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
              )}
              {hasRole('manager') && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Quản Lý</span>
              )}
              {hasRole('staff') && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Nhân viên</span>
              )}
            </div>
          </div>
        )}

        {/* Nav links (scrollable) */}
        <nav className="flex-1 overflow-y-auto">
          <NavItem icon={FaHome} label="Trang Chủ" href="/" isActive={isActive('/')} onClose={toggleMenu} />
          <NavItem icon={FaInfoCircle} label="Giới Thiệu" href="/about" isActive={isActive('/about')} onClose={toggleMenu} />

          <AccordionItem
            icon={FaBox}
            label="Sản Phẩm VLXD"
            isChildActive={isActive('/products')}
            onClose={toggleMenu}
            href="/products"
          >
            {PRODUCTS_SUBMENU}
          </AccordionItem>

          <AccordionItem
            icon={FaTags}
            label="Báo Giá"
            isChildActive={isActive('/price') || isActive('/products?category=0')}
            onClose={toggleMenu}
            href="/price"
          >
            {PRICE_SUBMENU_MOBILE}
          </AccordionItem>

          <NavItem icon={FaHandshake} label="Dịch Vụ" href="/services" isActive={isActive('/services')} onClose={toggleMenu} />
          <NavItem icon={FaNewspaper} label="Tin Tức" href="/news" isActive={isActive('/news')} onClose={toggleMenu} />
          <NavItem icon={FaPhone} label="Liên Hệ" href="/contact" isActive={isActive('/contact')} onClose={toggleMenu} />

          {/* Divider */}
          <div className="my-2 mx-5 border-t border-gray-200" />

          {isAuthenticated ? (
            <>
              <NavItem icon={FaUser} label="Tài Khoản" href="/account" isActive={isActive('/account')} onClose={toggleMenu} />
              <NavItem icon={FaClipboardList} label="Lịch Sử Đơn Hàng" href="/order-history" isActive={isActive('/order-history')} onClose={toggleMenu} />
              {hasRole(['admin', 'manager']) && (
                <NavItem icon={FaChartLine} label="Trang Quản Trị" href="/admin" isActive={isActive('/admin')} onClose={toggleMenu} />
              )}
              {hasRole('staff') && (
                <NavItem icon={FaShoppingBag} label="Quản Lý Kho" href="/staff" isActive={isActive('/staff')} onClose={toggleMenu} />
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition border-b border-gray-100 border-l-4 border-l-transparent"
              >
                <FaSignOutAlt className="text-red-400" /> Đăng Xuất
              </button>
            </>
          ) : (
            <>
              <NavItem icon={FaUser} label="Đăng Nhập" href="/login" isActive={false} onClose={toggleMenu} />
              <NavItem icon={FaUser} label="Đăng Ký" href="/register" isActive={false} onClose={toggleMenu} />
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} VLXD DVN — Hotline:{' '}
          <a href="tel:0901234567" className="text-blue-600 font-medium">090 123 4567</a>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};
