import { useEffect, useState } from 'react';
import { FaBars, FaChartLine, FaClipboardList, FaHardHat, FaSearch, FaShoppingBag, FaSignOutAlt, FaTimes, FaUser } from 'react-icons/fa';
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
    if (isSearchActive) setSearchQuery('');
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Kiểm tra active link cho Desktop menu
  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative z-50">
      {!isSearchActive ? (
        <div className="flex items-center justify-between px-4 lg:px-8 py-3 bg-blue-700 shadow-md text-white">

          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center">
            <div className="text-2xl cursor-pointer md:hidden mr-4" onClick={toggleMenu}>
              <FaBars />
            </div>
            <Link to="/" className="text-xl lg:text-2xl font-extrabold flex items-center tracking-wide text-yellow-400">
              <FaHardHat className="mr-2" />
              VLXD DVN
            </Link>
          </div>

          {/* Desktop Navigation Menu (Ẩn trên mobile, hiện trên màn hình md trở lên) */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 font-medium">
            <Link to="/" className={`hover:text-yellow-300 transition ${isActive('/') ? 'text-yellow-400 border-b-2 border-yellow-400 pb-1' : 'text-white'}`}>
              Trang Chủ
            </Link>
            <Link to="/products" className={`hover:text-yellow-300 transition ${isActive('/products') ? 'text-yellow-400 border-b-2 border-yellow-400 pb-1' : 'text-white'}`}>
              Báo Giá VLXD
            </Link>
            {isAuthenticated && (
              <Link to="/order-history" className={`hover:text-yellow-300 transition ${isActive('/order-history') ? 'text-yellow-400 border-b-2 border-yellow-400 pb-1' : 'text-white'}`}>
                Đơn Hàng
              </Link>
            )}
            <Link to="/contact" className={`hover:text-yellow-300 transition ${isActive('/contact') ? 'text-yellow-400 border-b-2 border-yellow-400 pb-1' : 'text-white'}`}>
              Liên Hệ
            </Link>
          </div>

          {/* Right actions: Search & Profile */}
          <div className="flex items-center space-x-5">
            <div className="text-xl cursor-pointer hover:text-yellow-300 transition" onClick={toggleSearch}>
              <FaSearch />
            </div>

            <div className="relative">
              <div className="text-xl cursor-pointer hover:text-yellow-300 transition flex items-center" onClick={toggleProfileDropdown}>
                <FaUser />
                {isAuthenticated && <span className="hidden lg:block ml-2 text-sm font-medium">{user?.name}</span>}
              </div>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-md shadow-xl py-1 z-50 ring-1 ring-black ring-opacity-5">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 text-sm text-gray-700 border-b bg-gray-50 rounded-t-md">
                        <div className="font-bold text-gray-900 truncate">{user?.name || 'Khách hàng'}</div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">{user?.username}</div>
                      </div>
                      <Link to="/account" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition" onClick={() => setIsProfileDropdownOpen(false)}>
                        <FaUser className="inline mr-2 text-gray-400" /> Tài khoản
                      </Link>
                      <Link to="/order-history" className="block md:hidden px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition" onClick={() => setIsProfileDropdownOpen(false)}>
                        <FaClipboardList className="inline mr-2 text-gray-400" /> Lịch sử đơn hàng
                      </Link>

                      {/* Quyền Admin / Manager */}
                      {hasRole(['admin', 'manager']) && (
                        <Link to="/admin" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition border-t" onClick={() => setIsProfileDropdownOpen(false)}>
                          <FaChartLine className="inline mr-2 text-blue-500" /> Trang Quản Trị
                        </Link>
                      )}

                      {/* Quyền Staff */}
                      {hasRole(['staff']) && (
                        <Link to="/staff" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition border-t" onClick={() => setIsProfileDropdownOpen(false)}>
                          <FaShoppingBag className="inline mr-2 text-green-500" /> Quản Lý Kho
                        </Link>
                      )}

                      <button className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t" onClick={handleLogout}>
                        <FaSignOutAlt className="inline mr-2" /> Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium border-b" onClick={() => setIsProfileDropdownOpen(false)}>
                        Đăng nhập
                      </Link>
                      <Link to="/register" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium" onClick={() => setIsProfileDropdownOpen(false)}>
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
        /* Search Active Header */
        <div className="bg-blue-700 shadow-md px-4 lg:px-8 py-3 flex items-center justify-center">
          <form onSubmit={handleSearch} className="flex items-center w-full max-w-3xl relative">
            <input
              type="text"
              placeholder="Tìm kiếm vật liệu (cát, đá, xi măng)..."
              className="w-full rounded-full py-2.5 pl-5 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="absolute right-12 text-blue-600 p-2 hover:text-blue-800">
              <FaSearch />
            </button>
            <button type="button" className="ml-4 text-white hover:text-yellow-300 text-xl transition" onClick={toggleSearch}>
              <FaTimes />
            </button>
          </form>
        </div>
      )}

      {/* Sidebar Menu (chỉ hiện trên Mobile) */}
      {isMenuOpen && (
        <div className="md:hidden">
          <SideBar toggleMenu={toggleMenu} currentPath={location.pathname} />
        </div>
      )}
    </div>
  );
};
