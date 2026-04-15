import { useEffect, useState } from 'react';
import { FaChartBar, FaChartPie, FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchExpenseReport } from '../../../stores/redux/actions/adminActions.js';

// Danh mục chuẩn cho Báo cáo VLXD
const EXPENSE_CATEGORIES = [
  { value: 'nhap_hang', label: 'Nhập vật tư', color: '#3B82F6' },
  { value: 'van_chuyen', label: 'Vận chuyển/Xăng xe', color: '#F59E0B' },
  { value: 'nhan_cong', label: 'Nhân công/Bốc vác', color: '#10B981' },
  { value: 'dien_nuoc', label: 'Điện nước/Mặt bằng', color: '#EF4444' },
  { value: 'khac', label: 'Khác', color: '#6B7280' }
];

const ExpenseReport = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const { reports, expensesLoading } = useSelector((state) => state.adminReducer);
  const reportData = reports?.expense;

  const [filters, setFilters] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    groupBy: 'month'
  });

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'manager')) {
      dispatch(fetchExpenseReport({ from: filters.from, to: filters.to, groupBy: filters.groupBy }));
    }
  }, [isAuthenticated, user, filters.from, filters.to, filters.groupBy, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const getCategoryChartData = () => {
    if (!reportData || !reportData.groupedByCategory) return [];
    return Object.entries(reportData.groupedByCategory).map(([category, data]) => {
      const info = EXPENSE_CATEGORIES.find(c => c.value === category) || { label: category, color: '#6B7280' };
      return { category: info.label, value: data.totalAmount, count: data.count, color: info.color };
    }).sort((a, b) => b.value - a.value);
  };

  const getTimeChartData = () => {
    if (!reportData || !reportData.groupedByTime) return [];
    return Object.entries(reportData.groupedByTime).map(([key, data]) => ({
      time: key, value: data.totalAmount, count: data.count, rawKey: key
    })).sort((a, b) => a.rawKey.localeCompare(b.rawKey));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800"><FaChartBar className="inline-block mr-2 text-blue-600" /> Báo cáo Chi phí</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm text-gray-700 mb-1">Từ ngày</label><input type="date" name="from" value={filters.from} onChange={handleFilterChange} className="w-full border p-2 rounded" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">Đến ngày</label><input type="date" name="to" value={filters.to} onChange={handleFilterChange} className="w-full border p-2 rounded" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">Nhóm theo</label>
            <select name="groupBy" value={filters.groupBy} onChange={handleFilterChange} className="w-full border p-2 rounded bg-white">
              <option value="day">Theo ngày</option><option value="month">Theo tháng</option>
            </select>
          </div>
        </div>
      </div>

      {expensesLoading ? <div className="text-center py-10"><FaSpinner className="animate-spin text-blue-600 text-3xl mx-auto" /></div> : reportData && (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tổng quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-red-600 text-sm font-medium">Tổng chi phí</div>
                <div className="text-gray-800 text-2xl font-bold">{formatCurrency(reportData.total?.amount || 0)}</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-blue-600 text-sm font-medium">Số phiếu chi</div>
                <div className="text-gray-800 text-2xl font-bold">{reportData.total?.count || 0} Phiếu</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4"><FaChartPie className="inline mr-2 text-blue-600" /> Phân bổ theo danh mục</h2>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr><th className="p-3">Danh mục</th><th className="p-3 text-right">Số lượng</th><th className="p-3 text-right">Tổng tiền</th></tr>
              </thead>
              <tbody className="divide-y">
                {getCategoryChartData().map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>{item.category}</td>
                    <td className="p-3 text-right">{item.count}</td>
                    <td className="p-3 text-right font-bold text-gray-800">{formatCurrency(item.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
export default ExpenseReport;
