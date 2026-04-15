import { useEffect, useState } from 'react';
import { FaBars, FaChartLine, FaClipboardList, FaSearch, FaShoppingBag, FaSignOutAlt, FaTimes, FaUser } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchProducts } from '../../stores/redux/actions/adminActions.js';
import { SideBar } from '../sidebar';

export const HeaderPage = () => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery('');
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchActive(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Xác định tiêu đề trang dựa vào đường dẫn hiện tại
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === '/') return 'Trang Chủ';
    if (path === '/products') return 'Báo Giá Vật Liệu';
    if (path.startsWith('/product/')) return 'Chi Tiết Vật Liệu';
    if (path === '/order-history') return 'Lịch Sử Đơn Hàng';
    if (path === '/account') return 'Tài Khoản';
    if (path === '/contact') return 'Liên Hệ';

    // Admin routes
    if (path.startsWith('/admin')) {
      if (path === '/admin') return 'Tổng Quan (Dashboard)';
      if (path === '/admin/inventory') return 'Quản Lý Tồn Kho';
      if (path === '/admin/export') return 'Báo Cáo Xuất Kho';
      if (path === '/admin/revenue') return 'Báo Cáo Doanh Thu';
      if (path === '/admin/expense-report') return 'Báo Cáo Chi Phí';
      if (path === '/admin/list-products') return 'Quản Lý Vật Liệu';
      if (path === '/admin/costs-mana') return 'Quản Lý Khoản Chi';
    }

    // Staff routes
    if (path.startsWith('/staff')) {
      return 'Quản Lý Kho (Staff)';
    }

    return 'Hệ Thống VLXD';
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="relative">
      {/* Header */}
      {!isSearchActive ? (
        <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md">
          <div className="text-xl text-gray-700 cursor-pointer" onClick={toggleMenu}>
            <FaBars />
          </div>
          <div className="text-lg font-bold text-gray-800">
            {getPageTitle()}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xl text-gray-700 cursor-pointer" onClick={toggleSearch}>
              <FaSearch />
            </div>
            <div className="relative">
              <div
                className="text-xl text-gray-700 cursor-pointer"
                onClick={toggleProfileDropdown}
              >
                <FaUser />
              </div>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user?.name || 'Người dùng'}</div>
                        <div className="text-xs text-gray-500">{user?.username}</div>
                      </div>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaUser className="inline mr-2" />
                        Tài khoản
                      </Link>
                      <Link
                        to="/order-history"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaClipboardList className="inline mr-2" />
                        Lịch sử đơn hàng
                      </Link>
                      {/* Cho phép Admin hoặc Manager vào trang quản trị */}
                      {hasRole(['admin', 'manager']) && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FaChartLine className="inline mr-2" />
                          Trang quản trị
                        </Link>
                      )}
                      {/* Nhân viên kho (Staff) */}
                      {hasRole(['staff']) && (
                        <Link
                          to="/staff"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FaShoppingBag className="inline mr-2" />
                          Quản lý kho
                        </Link>
                      )}
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="inline mr-2" />
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Đăng ký
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Search Active Header
        <div className="bg-white shadow-md px-4 py-2">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm vật liệu (cát, đá, xi măng)..."
              className="flex-grow border rounded-l py-2 px-3 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-r"
            >
              <FaSearch />
            </button>
            <button
              type="button"
              className="ml-2 text-gray-700"
              onClick={toggleSearch}
            >
              <FaTimes />
            </button>
          </form>
        </div>
      )}

      {/* Sidebar Menu */}
      {isMenuOpen && (
        <SideBar
          toggleMenu={toggleMenu}
          currentPath={location.pathname}
        />
      )}
    </div>
  );
};
