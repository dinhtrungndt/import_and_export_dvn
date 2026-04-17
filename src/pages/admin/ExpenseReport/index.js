import { useEffect, useState } from 'react';
import { FaChartBar, FaChartPie, FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import { EXPENSE_CATEGORIES } from '../../../config';
import { fetchExpenseReport } from '../../../stores/redux/actions/adminActions.js';

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
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <FaChartBar className="mr-3 text-blue-600" /> 
            Báo cáo Chi phí
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Phân tích chuyên sâu về các khoản tiền đã chi ra</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-600">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Từ ngày</label>
            <input type="date" name="from" value={filters.from} onChange={handleFilterChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Đến ngày</label>
            <input type="date" name="to" value={filters.to} onChange={handleFilterChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nhóm theo</label>
            <select name="groupBy" value={filters.groupBy} onChange={handleFilterChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700 appearance-none bg-white" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3e%3cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3e%3c/svg%3e")`, backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}>
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
            </select>
          </div>
        </form>
      </div>

      {expensesLoading ? <div className="text-center py-16"><FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" /><p className="text-gray-500 font-medium">Đang tải biểu mẫu báo cáo...</p></div> : reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-sm p-6 text-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-100">Tổng chi phí</h3>
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <FaChartBar className="h-6 w-6" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1 tracking-tight">{formatCurrency(reportData.total?.amount || 0)}</p>
              <p className="text-red-100 text-sm mt-2">Tổng số tiền chi ra</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-sm p-6 text-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-100">Số lượng phiếu chi</h3>
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <FaChartPie className="h-6 w-6" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1 tracking-tight">{reportData.total?.count || 0}</p>
              <p className="text-blue-100 text-sm mt-2">Phiếu đã lập</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 flex items-center"><FaChartPie className="text-blue-600 mr-2" /> Phân bổ theo danh mục</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Số lượng phiếu</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {getCategoryChartData().map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 flex items-center font-bold text-gray-900 text-base">
                        <div className="w-4 h-4 rounded-full mr-3 shadow-sm border border-black/5" style={{ backgroundColor: item.color }}></div>
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-600 text-base">{item.count}</td>
                      <td className="px-6 py-4 text-right font-black text-red-600 text-base lg:text-lg">{formatCurrency(item.value)}</td>
                    </tr>
                  ))}
                  {getCategoryChartData().length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-gray-500 font-medium text-sm">Chưa có số liệu danh mục nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default ExpenseReport;
