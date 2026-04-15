import { useState } from 'react';
import {
  FaBars, FaBoxes, FaChartLine, FaClipboardList, FaSignOutAlt, FaTachometerAlt, FaTimes, FaTools, FaUser
} from 'react-icons/fa';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { GiReceiveMoney } from 'react-icons/gi';
import { IoReturnUpBack } from 'react-icons/io5';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
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

  // Kiểm tra path hiện tại để highlight menu item
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-800">
          <div className="flex items-center justify-center h-16 bg-gray-900 shadow-md">
            <span className="text-white font-bold text-lg flex items-center">
              <FaTools className="mr-2 text-yellow-500" /> VLXD Admin
            </span>
          </div>
          <div className="flex flex-col flex-grow overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              <Link
                to="/admin"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <FaTachometerAlt className="mr-3 h-4 w-4" />
                Tổng Quan
              </Link>
              <Link
                to="/admin/list-products"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin/list-products') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <MdOutlineProductionQuantityLimits className="mr-3 h-4 w-4" />
                Quản lý Vật Liệu
              </Link>
              <Link
                to="/admin/inventory"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin/inventory') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <FaBoxes className="mr-3 h-4 w-4" />
                Báo Cáo Tồn Kho
              </Link>
              <Link
                to="/admin/export"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin/export') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <FaClipboardList className="mr-3 h-4 w-4" />
                Lịch Sử Xuất Kho
              </Link>
              <Link
                to="/admin/revenue"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin/revenue') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <FaChartLine className="mr-3 h-4 w-4" />
                Báo Cáo Doanh Thu
              </Link>
              <Link
                to="/admin/costs-mana"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin/costs-mana') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <FaMoneyBillTrendUp className="mr-3 h-4 w-4" />
                Quản Lý Chi Phí
              </Link>
              <Link
                to="/admin/expense-report"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin/expense-report') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <GiReceiveMoney className="mr-3 h-4 w-4" />
                Báo Cáo Chi Phí
              </Link>

              <div className="pt-4 mt-4 border-t border-gray-700">
                <Link
                  to="/products"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700"
                >
                  <IoReturnUpBack className="mr-3 h-4 w-4" />
                  Về trang khách hàng
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 mt-2 text-sm font-medium text-red-400 rounded-md hover:bg-gray-700 hover:text-red-300"
                >
                  <FaSignOutAlt className="mr-3 h-4 w-4" />
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
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
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
                <FaTools className="mr-2 text-yellow-500" />
                <span className="text-white font-bold text-lg">VLXD Admin</span>
              </div>
              <nav className="px-2 space-y-1">
                {/* Giữ nguyên các Link như phần Desktop ở trên */}
                <Link
                  to="/admin"
                  onClick={toggleSidebar}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin') ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                >
                  <FaTachometerAlt className="mr-3 h-4 w-4" /> Tổng Quan
                </Link>
                <Link
                  to="/admin/list-products"
                  onClick={toggleSidebar}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin/list-products') ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                >
                  <MdOutlineProductionQuantityLimits className="mr-3 h-4 w-4" /> Quản lý Vật Liệu
                </Link>
                <Link
                  to="/admin/inventory"
                  onClick={toggleSidebar}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin/inventory') ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                >
                  <FaBoxes className="mr-3 h-4 w-4" /> Báo Cáo Tồn Kho
                </Link>
                <Link
                  to="/admin/export"
                  onClick={toggleSidebar}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin/export') ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                >
                  <FaClipboardList className="mr-3 h-4 w-4" /> Xuất Kho
                </Link>
                <Link
                  to="/admin/revenue"
                  onClick={toggleSidebar}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin/revenue') ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                >
                  <FaChartLine className="mr-3 h-4 w-4" /> Báo Cáo Doanh Thu
                </Link>
                <Link
                  to="/admin/costs-mana"
                  onClick={toggleSidebar}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/admin/costs-mana') ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                >
                  <FaMoneyBillTrendUp className="mr-3 h-4 w-4" /> Quản Lý Chi Phí
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none md:hidden"
            onClick={toggleSidebar}
          >
            <FaBars className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800">
              {location.pathname === '/admin' ? 'Tổng quan Hệ Thống' :
                location.pathname.includes('inventory') ? 'Quản Lý Tồn Kho' :
                  location.pathname.includes('list-products') ? 'Quản Lý Vật Liệu' :
                    location.pathname.includes('costs-mana') ? 'Quản Lý Thu Chi' : 'Báo Cáo'}
            </h1>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <FaUser className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{user?.name || 'Quản trị viên'}</span>
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

export default AdminLayout;
