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
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <FaChartBar className="mr-3 text-blue-600" />
            Tổng quan kinh doanh
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Theo dõi hoạt động kinh doanh và hiệu suất cửa hàng</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-600">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Doanh thu</p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                {formatCurrency(dashboard.revenue.total)}
              </h3>
            </div>
            <div className="flex-shrink-0 h-14 w-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaMoneyBillWave className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium flex items-center bg-green-50 px-2 py-0.5 rounded-full">
              +{formatCurrency(dashboard.revenue.recent)} 
            </span>
            <span className="text-gray-400 ml-2">gần đây</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Chi phí</p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-red-500 transition-colors">
                {formatCurrency(expenseData.total?.amount || 0)}
              </h3>
            </div>
            <div className="flex-shrink-0 h-14 w-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaMoneyBillTrendUp className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400">Tổng chi phí hoạt động</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Lợi nhuận</p>
              <h3 className={`text-xl md:text-2xl font-bold transition-colors ${profitData.total >= 0 ? 'text-gray-900 group-hover:text-blue-600' : 'text-red-600 group-hover:text-red-700'}`}>
                {formatCurrency(profitData.total)}
              </h3>
            </div>
            <div className="flex-shrink-0 h-14 w-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaReceipt className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
             <span className={`font-medium flex items-center px-2 py-0.5 rounded-full ${profitData.recent >= 0 ? 'text-blue-600 bg-blue-50' : 'text-red-600 bg-red-50'}`}>
              {profitData.recent >= 0 ? '+' : ''}{formatCurrency(profitData.recent)}
            </span>
            <span className="text-gray-400 ml-2">gần đây</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Biên lợi nhuận</p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                {calculateProfitMargin()}%
              </h3>
            </div>
            <div className="flex-shrink-0 h-14 w-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaPercent className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(Math.max(calculateProfitMargin(), 0), 100)}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-sm p-6 text-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-indigo-100">Đơn hàng</h3>
            <div className="bg-white/20 p-2.5 rounded-lg">
              <FaShoppingCart className="h-6 w-6" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{dashboard.orders.total}</p>
          <p className="text-indigo-200 text-sm flex items-center mt-2">
            <span className="bg-indigo-400/30 px-2 py-0.5 rounded-md mr-2">+{dashboard.orders.recent}</span>
            trong 30 ngày
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-sm p-6 text-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-100">Mã vật liệu</h3>
            <div className="bg-white/20 p-2.5 rounded-lg">
              <MdOutlineProductionQuantityLimits className="h-6 w-6" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{dashboard.inventory.totalProducts}</p>
          <p className="text-blue-200 text-sm mt-2">
            {dashboard.inventory.totalStock} đơn vị tồn kho
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-sm p-6 text-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-amber-100">Giá trị tồn kho</h3>
            <div className="bg-white/20 p-2.5 rounded-lg">
              <FaWarehouse className="h-6 w-6" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold mb-1 truncate">{formatCurrency(dashboard.inventory.totalValue)}</p>
          <p className="text-amber-100 text-sm mt-2">Tổng vốn lưu động</p>
        </div>

        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl shadow-sm p-6 text-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-300">Vật liệu đã ẩn</h3>
            <div className="bg-white/20 p-2.5 rounded-lg">
              <FaEyeSlash className="h-6 w-6" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{hiddenProducts?.length || 0}</p>
          <Link to="/admin/inventory" className="text-gray-300 text-sm hover:text-white flex items-center mt-2 group">
            Xem chi tiết quản lý <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">Truy cập nhanh báo cáo</h2>
          </div>
          <div className="p-6 flex-1 flex items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <Link to="/admin/inventory" className="group p-5 rounded-xl border border-gray-200 bg-white hover:border-blue-500 hover:shadow-md transition-all duration-300 flex items-center">
                <div className="bg-blue-50 p-3.5 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-600 mr-4">
                  <FaBoxes className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Báo cáo tồn kho</h4>
                  <p className="text-xs text-gray-500 mt-1">Theo dõi số lượng vật tư</p>
                </div>
              </Link>
              
              <Link to="/admin/export" className="group p-5 rounded-xl border border-gray-200 bg-white hover:border-green-500 hover:shadow-md transition-all duration-300 flex items-center">
                <div className="bg-green-50 p-3.5 rounded-xl group-hover:bg-green-500 group-hover:text-white transition-colors text-green-600 mr-4">
                  <FaShoppingCart className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Báo cáo xuất kho</h4>
                  <p className="text-xs text-gray-500 mt-1">Lịch sử xuất hàng</p>
                </div>
              </Link>
              
              <Link to="/admin/revenue" className="group p-5 rounded-xl border border-gray-200 bg-white hover:border-yellow-500 hover:shadow-md transition-all duration-300 flex items-center">
                <div className="bg-yellow-50 p-3.5 rounded-xl group-hover:bg-yellow-500 group-hover:text-white transition-colors text-yellow-600 mr-4">
                  <FaMoneyBillWave className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">Doanh thu chi tiết</h4>
                  <p className="text-xs text-gray-500 mt-1">Phân tích nguồn thu</p>
                </div>
              </Link>
              
              <Link to="/admin/expense-report" className="group p-5 rounded-xl border border-gray-200 bg-white hover:border-red-500 hover:shadow-md transition-all duration-300 flex items-center">
                <div className="bg-red-50 p-3.5 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors text-red-600 mr-4">
                  <FaMoneyBillTrendUp className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">Quản lý chi phí</h4>
                  <p className="text-xs text-gray-500 mt-1">Kiểm soát dòng tiền ra</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Top bán chạy</h2>
            <span className="text-xs font-semibold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-full">Top 5</span>
          </div>
          <div className="p-0 flex-1 overflow-auto max-h-[400px]">
            <ul className="divide-y divide-gray-100">
              {dashboard.topProducts && dashboard.topProducts.length > 0 ? (
                dashboard.topProducts.map((product, index) => (
                  <li key={product.id} className="p-4 hover:bg-gray-50/80 transition-colors flex items-center justify-between">
                    <div className="flex items-center overflow-hidden mr-3">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-3.5 
                        ${index === 0 ? 'bg-amber-100 text-amber-600 shadow-sm border border-amber-200' : 
                          index === 1 ? 'bg-slate-100 text-slate-600 shadow-sm border border-slate-200' : 
                          index === 2 ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100' : 
                          'bg-indigo-50 text-indigo-500'} font-bold`}>
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate" title={product.name}>
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {getCategoryLabel(product.category)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-blue-600">{product.totalSold} <span className="text-[11px] font-medium text-gray-500">{product.unit}</span></p>
                      <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(product.totalAmount)}</p>
                    </div>
                  </li>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center h-full">
                  <MdOutlineProductionQuantityLimits className="h-12 w-12 mb-3 opacity-20" />
                  <p className="text-sm font-medium">Chưa có dữ liệu bán hàng</p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
