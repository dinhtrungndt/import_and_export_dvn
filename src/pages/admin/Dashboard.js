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
          Object.values(reports.expense.groupedByTime).reduce((sum, item) => sum + item.totalAmount, 0) : 0);

      setProfitData({ total: totalProfit, recent: recentProfit });
    }
  }, [reports?.dashboard, reports?.expense]);

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

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
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="mt-3 text-sm text-gray-500">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error || hiddenProductsError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md text-sm">
        <p className="font-bold">Lỗi tải dữ liệu</p>
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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan kinh doanh</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi hoạt động kinh doanh và hiệu suất cửa hàng</p>
        </div>
        <div className="text-sm text-gray-500">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow transition-shadow">
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-lg mr-4 text-blue-600">
              <FaMoneyBillWave className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Doanh thu</p>
              <h3 className="text-xl font-bold text-gray-900">{formatCurrency(dashboard.revenue.total)}</h3>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-500">
            <span className="text-green-600 font-medium">+{formatCurrency(dashboard.revenue.recent)}</span> gần đây
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow transition-shadow">
          <div className="flex items-center">
            <div className="bg-red-50 p-3 rounded-lg mr-4 text-red-600">
              <FaMoneyBillTrendUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Chi phí</p>
              <h3 className="text-xl font-bold text-gray-900">{formatCurrency(expenseData.total?.amount || 0)}</h3>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-500">Tổng chi phí hoạt động</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow transition-shadow">
          <div className="flex items-center">
            <div className="bg-green-50 p-3 rounded-lg mr-4 text-green-600">
              <FaReceipt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lợi nhuận</p>
              <h3 className={`text-xl font-bold ${profitData.total >= 0 ? 'text-gray-900' : 'text-red-600'}`}>{formatCurrency(profitData.total)}</h3>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-500">
            <span className={profitData.recent >= 0 ? 'text-blue-600 font-medium' : 'text-red-600 font-medium'}>
              {profitData.recent >= 0 ? '+' : ''}{formatCurrency(profitData.recent)}
            </span> gần đây
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow transition-shadow">
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-lg mr-4 text-purple-600">
              <FaPercent className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Biên lợi nhuận</p>
              <h3 className="text-xl font-bold text-gray-900">{calculateProfitMargin()}%</h3>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(Math.max(calculateProfitMargin(), 0), 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow transition-shadow">
          <div className="flex items-center">
            <div className="bg-indigo-50 p-3 rounded-lg mr-4 text-indigo-600">
              <FaShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Đơn hàng</p>
              <h3 className="text-lg font-bold text-gray-900">{dashboard.orders.total}</h3>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">+{dashboard.orders.recent} trong tháng</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow transition-shadow">
          <div className="flex items-center">
            <div className="bg-cyan-50 p-3 rounded-lg mr-4 text-cyan-600">
              <MdOutlineProductionQuantityLimits className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mã vật liệu</p>
              <h3 className="text-lg font-bold text-gray-900">{dashboard.inventory.totalProducts}</h3>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{dashboard.inventory.totalStock} đơn vị tồn kho</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow transition-shadow">
          <div className="flex items-center">
            <div className="bg-amber-50 p-3 rounded-lg mr-4 text-amber-600">
              <FaWarehouse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Giá trị tồn kho</p>
              <h3 className="text-lg font-bold text-gray-900">{formatCurrency(dashboard.inventory.totalValue)}</h3>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Tổng vốn lưu động</p>
        </div>

        <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow transition-shadow">
          <div className="flex items-center">
            <div className="bg-slate-200 p-3 rounded-lg mr-4 text-slate-600">
              <FaEyeSlash className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Vật liệu đã ẩn</p>
              <h3 className="text-lg font-bold text-slate-900">{hiddenProducts?.length || 0}</h3>
            </div>
          </div>
          <Link to="/admin/inventory" className="text-xs text-blue-600 hover:underline mt-2 inline-block">Xem chi tiết &rarr;</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-base font-bold text-gray-800">Truy cập nhanh báo cáo</h2>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/inventory" className="flex items-center p-4 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
              <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600 mr-3"><FaBoxes className="h-5 w-5" /></div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Báo cáo tồn kho</h4>
                <p className="text-xs text-gray-500 mt-0.5">Theo dõi số lượng vật tư</p>
              </div>
            </Link>
            <Link to="/admin/export" className="flex items-center p-4 rounded-lg border border-gray-100 hover:border-green-300 hover:bg-green-50/50 transition-colors">
              <div className="bg-green-100 p-2.5 rounded-lg text-green-600 mr-3"><FaShoppingCart className="h-5 w-5" /></div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Báo cáo xuất kho</h4>
                <p className="text-xs text-gray-500 mt-0.5">Lịch sử xuất hàng</p>
              </div>
            </Link>
            <Link to="/admin/revenue" className="flex items-center p-4 rounded-lg border border-gray-100 hover:border-amber-300 hover:bg-amber-50/50 transition-colors">
              <div className="bg-amber-100 p-2.5 rounded-lg text-amber-600 mr-3"><FaMoneyBillWave className="h-5 w-5" /></div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Doanh thu chi tiết</h4>
                <p className="text-xs text-gray-500 mt-0.5">Phân tích nguồn thu</p>
              </div>
            </Link>
            <Link to="/admin/expense-report" className="flex items-center p-4 rounded-lg border border-gray-100 hover:border-red-300 hover:bg-red-50/50 transition-colors">
              <div className="bg-red-100 p-2.5 rounded-lg text-red-600 mr-3"><FaMoneyBillTrendUp className="h-5 w-5" /></div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Quản lý chi phí</h4>
                <p className="text-xs text-gray-500 mt-0.5">Kiểm soát dòng tiền ra</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-800">Top bán chạy</h2>
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">Top 5</span>
          </div>
          <div className="flex-1 overflow-auto max-h-[320px]">
            <ul className="divide-y divide-gray-100">
              {dashboard.topProducts && dashboard.topProducts.length > 0 ? (
                dashboard.topProducts.map((product, index) => (
                  <li key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center min-w-0 mr-3">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold
                        ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-100 text-slate-600' : index === 2 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate" title={product.name}>{product.name}</p>
                        <p className="text-xs text-gray-500 truncate">{getCategoryLabel(product.category)}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-blue-600">{product.totalSold} <span className="text-[10px] text-gray-500">{product.unit}</span></p>
                      <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(product.totalAmount)}</p>
                    </div>
                  </li>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">Chưa có dữ liệu bán hàng</div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
