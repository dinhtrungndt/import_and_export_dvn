import { useEffect, useState } from 'react';
import { FaBox, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { APP_CONFIG } from '../../config';
import { fetchExportReport } from '../../stores/redux/actions/adminActions.js';

const ExportReport = () => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state) => state.adminReducer);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchExportReport({ startDate, endDate, category: filterCategory !== 'all' ? filterCategory : undefined }));
  }, [dispatch, startDate, endDate, filterCategory]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchExportReport({ startDate, endDate, category: filterCategory !== 'all' ? filterCategory : undefined }));
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const getCategoryLabel = (catValue) => {
    const category = APP_CONFIG.PRODUCT_CATEGORIES.find(c => c.value === catValue);
    return category ? category.label : catValue;
  };

  const exportReport = reports.export || { summary: { totalExports: 0, totalQuantity: 0, totalValue: 0 }, transactions: [], categoryStats: {} };

  const filteredTransactions = exportReport.transactions.filter((transaction) => {
    const productName = transaction?.productName;
    if (typeof productName !== 'string') return false;
    return productName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Bộ lọc báo cáo xuất kho</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">Tất cả</option>
                {APP_CONFIG.PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex justify-center items-center font-medium">
                <FaSearch className="mr-2" /> Lọc dữ liệu
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-3"><FaBox className="text-blue-500" /></div>
          <div><p className="text-sm text-gray-500">Số đơn xuất kho</p><p className="text-lg font-semibold">{exportReport.summary.totalExports}</p></div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-3"><FaBox className="text-green-500" /></div>
          <div><p className="text-sm text-gray-500">Tổng SL xuất</p><p className="text-lg font-semibold">{exportReport.summary.totalQuantity}</p></div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full mr-3"><FaBox className="text-yellow-500" /></div>
          <div><p className="text-sm text-gray-500">Giá trị xuất kho</p><p className="text-lg font-semibold">{formatCurrency(exportReport.summary.totalValue)}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Thống kê xuất kho theo danh mục</h2>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lần xuất</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá trị</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(exportReport.categoryStats).length > 0 ? (
                Object.entries(exportReport.categoryStats).map(([category, stats]) => (
                  <tr key={category}>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-md bg-blue-50 border border-blue-100 text-blue-700">{getCategoryLabel(category)}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{stats.count}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{stats.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(stats.value)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-4 text-gray-500">Không có dữ liệu xuất kho</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Chi tiết giao dịch</h2>
          <div className="relative">
            <input type="text" placeholder="Tìm vật liệu..." className="pl-8 pr-3 py-1.5 border rounded-md text-sm focus:ring-1 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên vật liệu</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày xuất</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-gray-500">Không tìm thấy giao dịch nào</td></tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{tx.productName}</td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{getCategoryLabel(tx.category)}</span></td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-700">{tx.quantity} {tx.unit}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatCurrency(tx.value)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(tx.date).toLocaleString('vi-VN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExportReport;
