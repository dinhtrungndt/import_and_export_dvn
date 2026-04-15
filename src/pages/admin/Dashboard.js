import { useEffect, useState } from 'react';
import { FaBoxes, FaChartBar, FaEyeSlash, FaMoneyBillWave, FaPercent, FaReceipt, FaShoppingCart, FaWarehouse } from 'react-icons/fa';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../config';
import { fetchExpenseReport, fetchHiddenProducts, fetchInventoryReport, fetchReportDashboard, fetchRevenueReport } from '../../stores/redux/actions/adminActions.js';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { reports, loading, error, hiddenProducts, hiddenProductsLoading, hiddenProductsError } = useSelector((state) => state.adminReducer);

  const [dateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [profitData, setProfitData] = useState({
    total: 0,
    recent: 0,
  });

  useEffect(() => {
    dispatch(fetchReportDashboard());
    dispatch(fetchInventoryReport());
    dispatch(fetchRevenueReport());
    dispatch(fetchExpenseReport({ from: dateRange.from, to: dateRange.to, groupBy: 'month' }));
    dispatch(fetchHiddenProducts());
  }, [dispatch, dateRange]);

  useEffect(() => {
    if (reports?.dashboard && reports?.expense) {
      const totalProfit = (reports.dashboard.revenue?.total || 0) - (reports.expense.total?.amount || 0);
      const recentProfit = (reports.dashboard.revenue?.recent || 0) -
        (reports.expense.groupedByTime ?
          Object.values(reports.expense.groupedByTime).reduce((sum, item) => {
            return sum + item.totalAmount;
          }, 0) : 0);

      setProfitData({
        total: totalProfit,
        recent: recentProfit,
      });
    }
  }, [reports?.dashboard, reports?.expense]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const calculateProfitMargin = () => {
    if (!reports?.dashboard?.revenue?.total || reports.dashboard.revenue.total === 0) return 0;
    return ((profitData.total / reports.dashboard.revenue.total) * 100).toFixed(1);
  };

  const getCategoryLabel = (catValue) => {
    const category = APP_CONFIG.PRODUCT_CATEGORIES.find(c => c.value === catValue);
    return category ? category.label : catValue;
  };

  if (loading || hiddenProductsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || hiddenProductsError) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p className="font-bold">Lỗi</p>
        <p>{error?.message || hiddenProductsError?.message || 'Có lỗi xảy ra'}</p>
      </div>
    );
  }

  const dashboard = reports?.dashboard || {
    orders: { total: 0, recent: 0 },
    revenue: { total: 0, recent: 0 },
    inventory: { totalProducts: 0, totalStock: 0, totalValue: 0 },
    topProducts: [],
  };

  const expenseData = reports?.expense || {
    total: { amount: 0 },
    groupedByCategory: {},
    groupedByTime: {},
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        <FaChartBar className="inline-block mr-2 text-blue-600" />
        Tổng quan kinh doanh VLXD
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <FaMoneyBillWave className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs text-gray-500">Doanh thu</p>
              <p className="text-sm font-medium text-green-600">{formatCurrency(dashboard.revenue.total)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <FaMoneyBillTrendUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs text-gray-500">Chi phí</p>
              <p className="text-sm font-medium text-red-600">{formatCurrency(expenseData.total?.amount || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <FaReceipt className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs text-gray-500">Lợi nhuận</p>
              <p className={`text-sm font-medium ${profitData.total >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(profitData.total)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <FaPercent className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs text-gray-500">Tỷ suất lợi nhuận</p>
              <p className="text-sm font-medium text-gray-900">{calculateProfitMargin()}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <FaShoppingCart className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">Đơn hàng</p>
              <p className="text-sm font-medium text-gray-900">{dashboard.orders.total}</p>
              <p className="text-xs text-green-600">+{dashboard.orders.recent} trong 30 ngày</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <MdOutlineProductionQuantityLimits className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">Mã vật liệu</p>
              <p className="text-sm font-medium text-gray-900">{dashboard.inventory.totalProducts}</p>
              <p className="text-xs text-blue-600">{dashboard.inventory.totalStock} đơn vị tồn kho</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
              <FaWarehouse className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">Giá trị tồn kho</p>
              <p className="text-sm font-medium text-gray-900">{formatCurrency(dashboard.inventory.totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <FaEyeSlash className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">Vật liệu đã ẩn</p>
              <p className="text-sm font-medium text-gray-900">{hiddenProducts?.length || 0}</p>
              <Link to="/admin/inventory" className="text-xs text-blue-600 hover:underline">Xem chi tiết</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Báo cáo chi tiết</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/admin/inventory" className="bg-blue-50 p-4 rounded-lg flex items-center justify-between hover:bg-blue-100">
                <div className="flex items-center">
                  <FaBoxes className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-800 font-medium">Báo cáo Tồn kho</span>
                </div>
              </Link>
              <Link to="/admin/export" className="bg-green-50 p-4 rounded-lg flex items-center justify-between hover:bg-green-100">
                <div className="flex items-center">
                  <FaShoppingCart className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-800 font-medium">Báo cáo Xuất kho</span>
                </div>
              </Link>
              <Link to="/admin/revenue" className="bg-yellow-50 p-4 rounded-lg flex items-center justify-between hover:bg-yellow-100">
                <div className="flex items-center">
                  <FaMoneyBillWave className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-gray-800 font-medium">Báo cáo Doanh thu</span>
                </div>
              </Link>
              <Link to="/admin/expense-report" className="bg-red-50 p-4 rounded-lg flex items-center justify-between hover:bg-red-100">
                <div className="flex items-center">
                  <FaMoneyBillTrendUp className="h-5 w-5 text-red-600 mr-3" />
                  <span className="text-gray-800 font-medium">Báo cáo Chi phí</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Top vật tư xuất nhiều</h2>
          </div>
          <div className="p-4">
            <ul className="divide-y divide-gray-200">
              {dashboard.topProducts && dashboard.topProducts.length > 0 ? (
                dashboard.topProducts.map((product, index) => (
                  <li key={product._id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`flex-shrink-0 h-8 w-8 rounded-full bg-${index < 3 ? ['blue', 'green', 'yellow'][index] : 'gray'}-100 flex items-center justify-center mr-3`}>
                        <span className={`text-${index < 3 ? ['blue', 'green', 'yellow'][index] : 'gray'}-600 font-medium`}>{index + 1}</span>
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          {getCategoryLabel(product.category)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{product.totalSold} {product.unit}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(product.totalAmount)}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-gray-500">Chưa có dữ liệu</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
