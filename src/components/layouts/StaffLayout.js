import { useState } from 'react';
import { FaBars, FaBoxes, FaHardHat, FaSignOutAlt, FaTimes, FaUser } from 'react-icons/fa';
import { IoReturnUpBack } from 'react-icons/io5';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StaffLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-slate-800">
          <div className="flex items-center justify-center h-16 bg-slate-900">
            <FaHardHat className="text-yellow-500 mr-2 text-xl" />
            <span className="text-white font-bold text-lg">Thủ Kho VLXD</span>
          </div>
          <div className="flex flex-col flex-grow overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-2">
              <Link
                to="/staff"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive('/staff') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                <FaBoxes className="mr-3 h-5 w-5" />
                Kiểm Kê Tồn Kho
              </Link>

              <div className="pt-6 mt-6 border-t border-slate-700">
                <Link
                  to="/products"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-400 hover:text-white hover:bg-slate-700"
                >
                  <IoReturnUpBack className="mr-3 h-5 w-5" />
                  Về trang Báo giá
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 mt-2 text-sm font-medium text-red-400 rounded-md hover:bg-slate-700 hover:text-red-300"
                >
                  <FaSignOutAlt className="mr-3 h-5 w-5" />
                  Đăng Xuất
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-800">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                onClick={toggleSidebar}
              >
                <FaTimes className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 mb-4">
                <FaHardHat className="text-yellow-500 mr-2 text-xl" />
                <span className="text-white font-bold text-lg">Thủ Kho VLXD</span>
              </div>
              <nav className="px-2 space-y-1">
                <Link
                  to="/staff"
                  onClick={toggleSidebar}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive('/staff') ? 'bg-blue-600 text-white' : 'text-gray-300'
                    }`}
                >
                  <FaBoxes className="mr-3 h-5 w-5" />
                  Kiểm Kê Tồn Kho
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none md:hidden"
            onClick={toggleSidebar}
          >
            <FaBars className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800">Quản Lý Nhập/Xuất/Tồn</h1>
            <div className="ml-4 flex items-center">
              <div className="flex items-center bg-slate-100 rounded-full px-3 py-1">
                <FaUser className="h-4 w-4 text-slate-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{user?.name || 'Nhân viên Kho'}</span>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
