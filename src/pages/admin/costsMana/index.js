import { useEffect, useState } from 'react';
import { FaFileInvoiceDollar, FaFilter, FaInfoCircle, FaPlus, FaSave, FaSpinner, FaTimes, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthContext';
import { createExpense, fetchExpenses, fetchHiddenExpenses, updateExpense } from '../../../stores/redux/actions/adminActions.js';

// Danh mục chi phí chuẩn cho cửa hàng VLXD
const EXPENSE_CATEGORIES = [
  { value: 'nhap_hang', label: 'Nhập vật tư' },
  { value: 'van_chuyen', label: 'Vận chuyển/Xăng xe' },
  { value: 'nhan_cong', label: 'Nhân công/Bốc vác' },
  { value: 'dien_nuoc', label: 'Điện nước/Mặt bằng' },
  { value: 'khac', label: 'Chi phí khác' },
];

const formatDateToYYYYMMDD = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CostsMana = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const {
    expenses, hiddenExpenses, totalAmount, totalHiddenAmount,
    expensesLoading, expensesError
  } = useSelector((state) => state.adminReducer);

  const [viewMode, setViewMode] = useState('active');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', amount: '', category: 'khac',
    date: formatDateToYYYYMMDD(new Date()),
    attachments: [],
  });

  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailExpense, setDetailExpense] = useState(null);

  const [filters, setFilters] = useState({
    search: '', category: 'all', dateFrom: '', dateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'manager')) {
      const params = {};
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.dateFrom) params.from = filters.dateFrom;
      if (filters.dateTo) params.to = filters.dateTo;
      if (filters.search) params.search = filters.search;

      dispatch(fetchExpenses(params));
      dispatch(fetchHiddenExpenses(params));
    }
  }, [isAuthenticated, user, filters, dispatch]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setFilters({
      search: fd.get('search') || '', category: fd.get('category') || 'all',
      dateFrom: fd.get('dateFrom') || '', dateTo: fd.get('dateTo') || '',
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ search: '', category: 'all', dateFrom: '', dateTo: '' });
    setCurrentPage(1);
  };

  const handleAddExpense = () => {
    setFormData({
      title: '', description: '', amount: '', category: 'khac',
      date: formatDateToYYYYMMDD(new Date()), attachments: [],
    });
    setAttachmentFiles([]); setFormMode('add'); setShowForm(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setFormData({
      title: expense.title, description: expense.description || '',
      amount: expense.amount.toString(), category: expense.category,
      date: formatDateToYYYYMMDD(new Date(expense.date)),
      attachments: expense.attachments || [],
    });
    setAttachmentFiles([]); setFormMode('edit'); setShowForm(true);
  };

  const handleViewDetail = (expense) => { setDetailExpense(expense); setShowDetail(true); };
  const handleCloseForm = () => { setShowForm(false); setSelectedExpense(null); };
  const handleCloseDetail = () => { setShowDetail(false); setDetailExpense(null); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length) toast.error('Có file vượt quá 5MB');
    setAttachmentFiles((prev) => [...prev, ...validFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('amount', formData.amount);
      data.append('category', formData.category);
      data.append('date', formData.date);
      attachmentFiles.forEach((file) => data.append('files', file));

      if (formMode === 'add') {
        await dispatch(createExpense(data));
        toast.success('Thêm khoản chi thành công!');
      } else {
        await dispatch(updateExpense(selectedExpense.id, data));
        toast.success('Cập nhật thành công!');
      }
      handleCloseForm();
    } catch (err) {
      toast.error(err.detail || 'Đã xảy ra lỗi khi lưu chi phí');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');
  const getCategoryLabel = (val) => EXPENSE_CATEGORIES.find(c => c.value === val)?.label || val;

  const currentItems = viewMode === 'active'
    ? expenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : hiddenExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil((viewMode === 'active' ? expenses.length : hiddenExpenses.length) / itemsPerPage);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <FaFileInvoiceDollar className="mr-3 text-blue-600" />
            Quản lý Chi phí
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Theo dõi, kiểm soát và thống kê các khoản chi tiêu</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center justify-center transition-all border ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'}`}
          >
            <FaFilter className="mr-2" /> {showFilters ? 'Đang mở bộ lọc' : 'Bộ lọc tìm kiếm'}
          </button>
          <button 
            onClick={handleAddExpense} 
            className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center hover:bg-blue-700 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <FaPlus className="mr-2" /> Thêm phiếu chi
          </button>
        </div>
      </div>

      {/* Summary Highlight */}
      <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-sm p-6 mb-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all">
        <div>
          <h2 className="text-lg font-semibold text-red-100 mb-1">Tổng chi phí đang hiển thị</h2>
          <p className="text-red-50 text-sm opacity-90">Dựa theo kết quả đã lọc: {expenses.length} khoản chi phí được liệt kê</p>
        </div>
        <div className="bg-white/20 px-6 py-4 rounded-xl border border-white/30 backdrop-blur-sm min-w-[200px] flex items-center justify-center">
          <span className="block text-white font-bold text-3xl tracking-tight">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Filters Form */}
      <div className={`transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-[500px] mb-8 opacity-100' : 'max-h-0 opacity-0 mb-0 pointer-events-none'}`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleApplyFilters} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tìm kiếm lý do chi</label>
              <input type="text" name="search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700" placeholder="VD: Tiền nhân công bốc vác..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Danh mục chi phí</label>
              <select name="category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700 appearance-none bg-white" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3e%3cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3e%3c/svg%3e")`, backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}>
                <option value="all">Tất cả danh mục</option>
                {EXPENSE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Từ ngày</label>
              <input type="date" name="dateFrom" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Đến ngày</label>
              <input type="date" name="dateTo" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700" />
            </div>
            <div className="md:col-span-4 flex justify-end gap-3 mt-2 border-t border-gray-100 pt-5">
              <button type="button" onClick={handleResetFilters} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all">Đặt lại bộ lọc</button>
              <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center hover:bg-blue-700 shadow-sm transition-all"><FaSearch className="mr-2" /> Xong</button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Danh sách khoản chi</h2>
        </div>
        <div className="overflow-x-auto">
          {expensesLoading ? (
            <div className="py-16 text-center">
              <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Đang tải biểu mẫu chi phí...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày ghi nhận</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lý do chi</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Số tiền xuất</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <FaFileInvoiceDollar className="mx-auto text-4xl mb-3 text-gray-300" />    
                      <p className="font-medium text-sm">Chưa có khoản chi nào phù hợp với bộ lọc</p>
                    </td>
                  </tr>
                ) : currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-red-50/40 transition-colors">
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{formatDate(item.date)}</td>
                     <td className="px-6 py-4 text-sm font-bold text-gray-900 line-clamp-2 md:line-clamp-none max-w-[20rem]" title={item.title}>{item.title}</td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className="px-2.5 py-1 inline-flex text-xs font-medium rounded-lg bg-gray-100 text-gray-700 border border-gray-200">
                         {getCategoryLabel(item.category)}
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600 text-right">{formatCurrency(item.amount)}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button 
                          onClick={() => handleViewDetail(item)} 
                          className="px-3 py-1.5 text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all mx-auto shadow-sm flex items-center justify-center gap-1 w-full max-w-[8rem]"
                          title="Xem chi tiết"
                        >
                          <FaInfoCircle size={16} />
                          <span className="text-xs font-bold">Chi tiết</span>
                        </button>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center"><FaFileInvoiceDollar className="mr-2" /> {formMode === 'add' ? 'Tạo phiếu chi mới' : 'Cập nhật phiếu chi'}</h3>
              <button onClick={handleCloseForm} className="text-white hover:text-red-200 transition-colors bg-white/10 p-1.5 rounded-full"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Lý do chi tiền <span className="text-red-500">*</span></label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all" placeholder="VD: Trả tiền mâm xôi..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Số tiền thanh toán (VND) <span className="text-red-500">*</span></label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all font-bold text-red-600" placeholder="VD: 500000" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Nhóm chi phí <span className="text-red-500">*</span></label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3e%3cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3e%3c/svg%3e")`, backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em" }}>
                      {EXPENSE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-6 mt-6 border-t border-gray-100 gap-3">
                <button type="button" onClick={handleCloseForm} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Hủy thao tác</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center hover:bg-blue-700 shadow-sm transition-all shadow-blue-500/30">
                  {submitting ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />} Lưu Phiếu Chi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && detailExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-5 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center text-lg"><FaInfoCircle className="mr-2 text-blue-400" /> Chi tiết phiếu chi xuất</h3>
              <button onClick={handleCloseDetail} className="text-gray-400 hover:text-white transition-colors bg-white/10 rounded-full p-2"><FaTimes /></button>
            </div>
            <div className="p-6 space-y-5 text-sm text-gray-800">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Mục đích chi</p>
                <p className="font-bold text-gray-900 text-lg">{detailExpense.title}</p>
              </div>
              
              <div className="flex justify-between items-center p-5 bg-red-50 rounded-xl border border-red-100 shadow-sm">
                <p className="text-xs text-red-500 font-bold uppercase tracking-wider">Tổng tiền thanh toán</p>
                <p className="text-red-700 font-black text-2xl">{formatCurrency(detailExpense.amount)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Nhóm danh mục</p>
                  <p className="font-bold text-gray-700">{getCategoryLabel(detailExpense.category)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Thời gian ghi nhận</p>
                  <p className="font-bold text-gray-700">{formatDate(detailExpense.date)}</p>
                </div>
              </div>
              
              {detailExpense.description && (
                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 shadow-sm mt-2">
                  <p className="text-xs text-amber-600 font-bold uppercase mb-1">Ghi chú cụ thể</p>
                  <p className="font-medium text-amber-900 italic leading-relaxed">{detailExpense.description}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={handleCloseDetail} className="w-full sm:w-auto px-10 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 shadow-sm hover:bg-gray-100 transition-colors">Đóng báo cáo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostsMana;
