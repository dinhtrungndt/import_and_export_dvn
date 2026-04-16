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
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-b-blue-600"></div>
        <span className="mt-4 text-gray-500 font-medium">Đang tải báo cáo...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <FaBox className="mr-3 text-blue-600" />
            Báo cáo Xuất kho
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Lịch sử và thống kê xuất bán vật liệu xây dựng</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-600">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 mb-8">
        <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Từ ngày</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Đến ngày</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Danh mục</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700 appearance-none bg-white"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3e%3cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3e%3c/svg%3e")`, backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {APP_CONFIG.PRODUCT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-auto">
            <button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex justify-center items-center font-bold shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5">
              <FaSearch className="mr-2" /> Lọc báo cáo
            </button>
          </div>
        </form>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-sm p-6 text-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-indigo-100">Số đơn xuất</h3>
            <div className="bg-white/20 p-2.5 rounded-lg">
              <FaBox className="h-6 w-6" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{exportReport.summary.totalExports}</p>
          <p className="text-indigo-200 text-sm mt-2">Tổng số phiếu giao dịch</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-sm p-6 text-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-emerald-100">Tổng lượng xuất</h3>
            <div className="bg-white/20 p-2.5 rounded-lg">
              <FaBox className="h-6 w-6" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{exportReport.summary.totalQuantity}</p>
          <p className="text-emerald-100 text-sm mt-2">Đơn vị vật tư đã bán</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-sm p-6 text-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-amber-100">Giá trị xuất kho</h3>
            <div className="bg-white/20 p-2.5 rounded-lg">
              <FaBox className="h-6 w-6" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold mb-1 truncate">{formatCurrency(exportReport.summary.totalValue)}</p>
          <p className="text-amber-100 text-sm mt-2">Tổng giá trị thu về</p>
        </div>
      </div>

      {/* Category Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Thống kê theo danh mục</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Số lần xuất</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng xuất</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Giá trị</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {Object.entries(exportReport.categoryStats).length > 0 ? (
                Object.entries(exportReport.categoryStats).map(([category, stats], index) => (
                  <tr key={category} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-lg
                        ${index % 4 === 0 ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          index % 4 === 1 ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                            index % 4 === 2 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                        {getCategoryLabel(category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{stats.count} lần</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{stats.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{formatCurrency(stats.value)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm font-medium">Không có dữ liệu xuất kho.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
          <h2 className="text-lg font-bold text-gray-800">Chi tiết giao dịch</h2>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Tìm kiếm vật liệu..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto border-t border-gray-50">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tên vật liệu</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Thành tiền</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày xuất</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <FaBox className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium text-sm">Không tìm thấy giao dịch nào</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{tx.productName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 border border-gray-200">
                        {getCategoryLabel(tx.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{tx.quantity} <span className="text-xs text-gray-500 font-normal">{tx.unit}</span></td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">{formatCurrency(tx.value)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {new Date(tx.date).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
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
