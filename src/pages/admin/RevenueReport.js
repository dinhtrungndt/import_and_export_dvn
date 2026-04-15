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
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  }

  const categoryStatsArray = Object.entries(revenueReport.categoryStats || {}).map(([category, stats]) => ({ category, ...stats }));
  const hasProductDetails = revenueReport.productStats && revenueReport.productStats.length > 0;

  return (
    <div className="container mx-auto px-2 sm:px-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Bộ lọc báo cáo doanh thu</h2>
        </div>
        <div className="p-4">
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
              <input type="date" className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
              <input type="date" className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theo chu kỳ</label>
              <select className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500" value={interval} onChange={(e) => setInterval(e.target.value)}>
                <option value="daily">Theo ngày</option>
                <option value="monthly">Theo tháng</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex justify-center items-center font-medium">
                <FaSearch className="mr-2" /> Áp dụng
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-3"><FaChartLine className="text-green-600 h-6 w-6" /></div>
          <div>
            <p className="text-sm text-gray-500">Tổng doanh thu</p>
            <p className="text-xl font-bold text-gray-800">{formatCurrency(revenueReport.summary.totalRevenue)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-3"><FaBookOpen className="text-blue-600 h-6 w-6" /></div>
          <div>
            <p className="text-sm text-gray-500">Số lượng đơn hàng</p>
            <p className="text-xl font-bold text-gray-800">{revenueReport.summary.totalOrders}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-3"><FaMoneyBillWave className="text-purple-600 h-6 w-6" /></div>
          <div>
            <p className="text-sm text-gray-500">Lợi nhuận gộp</p>
            <p className="text-xl font-bold text-gray-800">{formatCurrency(revenueReport.summary.totalProfit || 0)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Biểu đồ doanh thu {interval === 'daily' ? 'theo ngày' : 'theo tháng'}</h2>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{interval === 'daily' ? 'Ngày' : 'Tháng'}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đơn hàng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doanh thu</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lợi nhuận</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueReport.timeSeries && revenueReport.timeSeries.length > 0 ? (
                revenueReport.timeSeries.map((item) => (
                  <tr key={interval === 'daily' ? item.date : item.month}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{interval === 'daily' ? item.date : item.month}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.orders}</td>
                    <td className="px-4 py-4 text-sm text-gray-800 font-semibold">{formatCurrency(item.revenue)}</td>
                    <td className="px-4 py-4 text-sm text-green-600 font-semibold">{formatCurrency(item.profit)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-4 text-gray-500">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">{hasProductDetails ? 'Doanh thu theo vật liệu' : 'Doanh thu theo danh mục'}</h2>
        </div>
        <div className="p-4 overflow-x-auto">
          {hasProductDetails ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên vật liệu</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng bán</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doanh thu</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lợi nhuận</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revenueReport.productStats.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-gray-100 px-2 py-1 rounded">{getCategoryLabel(product.category)}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{product.quantity}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{formatCurrency(product.revenue)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">{formatCurrency(product.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SL bán</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doanh thu</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lợi nhuận</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryStatsArray.map((stats) => (
                  <tr key={stats.category}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{getCategoryLabel(stats.category)}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{stats.quantity}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{formatCurrency(stats.revenue)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">{formatCurrency(stats.profit || 0)}</td>
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
