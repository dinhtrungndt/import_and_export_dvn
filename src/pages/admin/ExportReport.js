import { useEffect, useMemo, useState } from 'react';
import { FaBox, FaSearch, FaTruck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { APP_CONFIG } from '../../config';
import { fetchInventoryTransactions } from '../../stores/redux/actions/adminActions.js';

const ExportReport = () => {
  const dispatch = useDispatch();
  const { inventoryTransactions = [], loading } = useSelector((state) => state.adminReducer);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchInventoryTransactions());
  }, [dispatch]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchInventoryTransactions());
  };

  const getCategoryLabel = (catValue) => {
    if (!catValue) return 'Không rõ';
    const category = APP_CONFIG.PRODUCT_CATEGORIES.find(c => c.value === catValue);
    return category ? category.label : catValue;
  };

  const exportTransactions = useMemo(() => {
    let txs = (inventoryTransactions || []).filter(t => t.type === 'export');
    if (startDate) txs = txs.filter(t => new Date(t.created_at) >= new Date(startDate));
    if (endDate) {
      const end = new Date(endDate); end.setHours(23, 59, 59);
      txs = txs.filter(t => new Date(t.created_at) <= end);
    }
    return txs;
  }, [inventoryTransactions, startDate, endDate]);

  const filteredTransactions = useMemo(() =>
    exportTransactions.filter(t => {
      const name = t.product?.name || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    }), [exportTransactions, searchTerm]);

  const summary = useMemo(() => ({
    totalExports: exportTransactions.length,
    totalQuantity: exportTransactions.reduce((s, t) => s + (t.quantity || 0), 0),
  }), [exportTransactions]);

  const productStats = useMemo(() => {
    const stats = {};
    exportTransactions.forEach(t => {
      const pId = t.product_id;
      const name = t.product?.name || `ID: ${pId?.substring(0, 8)}`;
      const category = t.product?.category || '';
      if (!stats[pId]) stats[pId] = { name, category, quantity: 0, count: 0 };
      stats[pId].quantity += t.quantity || 0;
      stats[pId].count += 1;
    });
    return Object.values(stats).sort((a, b) => b.quantity - a.quantity);
  }, [exportTransactions]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="mt-3 text-sm text-gray-500">Đang tải báo cáo...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo Xuất kho</h1>
          <p className="text-sm text-gray-500 mt-1">Lịch sử và thống kê xuất bán vật liệu xây dựng</p>
        </div>
        <div className="text-sm text-gray-500">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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
            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center">
              <FaSearch className="mr-2" /> Lọc báo cáo
            </button>
          </div>
        </form>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-indigo-50 p-3 rounded-lg mr-4 text-indigo-600">
            <FaBox className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Số giao dịch xuất</p>
            <p className="text-xl font-bold text-gray-900">{summary.totalExports}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-emerald-50 p-3 rounded-lg mr-4 text-emerald-600">
            <FaTruck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tổng lượng xuất</p>
            <p className="text-xl font-bold text-gray-900">{summary.totalQuantity.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Product Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-800">Thống kê xuất theo vật liệu</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên vật liệu</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Số lần xuất</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tổng lượng xuất</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {productStats.length > 0 ? productStats.map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900">{p.name}</td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700">
                      {getCategoryLabel(p.category)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-500">{p.count} lần</td>
                  <td className="px-5 py-3 text-sm font-semibold text-indigo-600">{p.quantity.toFixed(2)}</td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="px-5 py-8 text-center text-gray-500 text-sm">Không có dữ liệu xuất kho.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-base font-bold text-gray-800">Chi tiết giao dịch xuất kho</h2>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Tìm kiếm tên vật liệu..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên vật liệu</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Số lượng xuất</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tồn trước</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tồn sau</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày xuất</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center">
                    <FaBox className="mx-auto h-10 w-10 text-gray-200 mb-2" />
                    <p className="text-gray-500 text-sm">Không tìm thấy giao dịch nào</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900">
                      {tx.product?.name || `ID: ${tx.product_id?.substring(0, 8)}`}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
                        {getCategoryLabel(tx.product?.category)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-red-600">
                      -{tx.quantity} <span className="text-xs text-gray-400 font-normal">{tx.product?.unit}</span>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-500">{tx.previous_stock}</td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-500">{tx.new_stock}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 font-medium">
                      {new Date(tx.created_at).toLocaleString('vi-VN', {
                        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
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
