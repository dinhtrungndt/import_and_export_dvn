import { useEffect, useState } from 'react';
import { FaBookOpen, FaChartLine, FaMoneyBillWave, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { APP_CONFIG } from '../../config';
import { fetchRevenueReport } from '../../stores/redux/actions/adminActions.js';

const RevenueReport = () => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state) => state.adminReducer);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interval, setInterval] = useState('daily');

  useEffect(() => {
    dispatch(fetchRevenueReport({ startDate, endDate, interval }));
  }, [dispatch, startDate, endDate, interval]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchRevenueReport({ startDate, endDate, interval }));
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const getCategoryLabel = (catValue) => {
    const category = APP_CONFIG.PRODUCT_CATEGORIES.find(c => c.value === catValue);
    return category ? category.label : catValue;
  };

  const revenueReport = reports.revenue || {
    summary: { totalRevenue: 0, totalOrders: 0, totalProfit: 0 },
    timeSeries: [], categoryStats: {}, productStats: [], timeSeriesProducts: []
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="mt-3 text-sm text-gray-500">Đang tải báo cáo...</span>
      </div>
    );
  }

  const categoryStatsArray = Object.entries(revenueReport.categoryStats || {}).map(([category, stats]) => ({ category, ...stats }));
  const hasProductDetails = revenueReport.productStats && revenueReport.productStats.length > 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo Doanh thu</h1>
          <p className="text-sm text-gray-500 mt-1">Phân tích hiệu quả kinh doanh và lợi nhuận</p>
        </div>
        <div className="text-sm text-gray-500">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 uppercase tracking-wide text-xs">Từ ngày</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 uppercase tracking-wide text-xs">Đến ngày</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 uppercase tracking-wide text-xs">Theo chu kỳ</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white" 
              value={interval} 
              onChange={(e) => setInterval(e.target.value)}
            >
              <option value="daily">Theo ngày</option>
              <option value="monthly">Theo tháng</option>
            </select>
          </div>
          <div>
            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center">
              <FaSearch className="mr-2" /> Áp dụng
            </button>
          </div>
        </form>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-blue-50 p-3 rounded-lg mr-4 text-blue-600">
            <FaChartLine className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{formatCurrency(revenueReport.summary.totalRevenue)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-emerald-50 p-3 rounded-lg mr-4 text-emerald-600">
            <FaBookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Số lượng đơn hàng</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{revenueReport.summary.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-amber-50 p-3 rounded-lg mr-4 text-amber-600">
            <FaMoneyBillWave className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Lợi nhuận gộp</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{formatCurrency(revenueReport.summary.totalProfit || 0)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-800">Biểu đồ doanh thu {interval === 'daily' ? 'theo ngày' : 'theo tháng'}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{interval === 'daily' ? 'Ngày' : 'Tháng'}</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Đơn hàng</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doanh thu</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lợi nhuận</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {revenueReport.timeSeries && revenueReport.timeSeries.length > 0 ? (
                revenueReport.timeSeries.map((item) => (
                  <tr key={interval === 'daily' ? item.date : item.month} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{interval === 'daily' ? item.date : item.month}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-500">{item.orders}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">{formatCurrency(item.revenue)}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-green-600">{formatCurrency(item.profit)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-5 py-8 text-center text-gray-500 text-sm">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-800">{hasProductDetails ? 'Doanh thu theo vật liệu' : 'Doanh thu theo danh mục'}</h2>
        </div>
        <div className="overflow-x-auto">
          {hasProductDetails ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên vật liệu</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Số lượng bán</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doanh thu</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lợi nhuận</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {revenueReport.productStats.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900">{product.name}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-500">{product.quantity}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">{formatCurrency(product.revenue)}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-green-600">{formatCurrency(product.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sản lượng bán</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doanh thu</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lợi nhuận</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {categoryStatsArray.map((stats, index) => (
                  <tr key={stats.category} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700">
                        {getCategoryLabel(stats.category)}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-500">{stats.quantity}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">{formatCurrency(stats.revenue)}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-green-600">{formatCurrency(stats.profit || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;
