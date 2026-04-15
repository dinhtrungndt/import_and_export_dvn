import { useEffect, useState } from 'react';
import { FaFileInvoiceDollar, FaFilter, FaInfoCircle, FaPlus, FaSave, FaSpinner, FaTimes } from 'react-icons/fa';
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
        await dispatch(updateExpense(selectedExpense._id, data));
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
          <FaFileInvoiceDollar className="mr-2 text-blue-600" /> Quản lý Chi phí
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={handleAddExpense} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
            <FaPlus className="mr-2" /> Thêm phiếu chi
          </button>
          <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2 rounded-lg flex items-center justify-center ${showFilters ? 'bg-gray-200' : 'bg-gray-100'}`}>
            <FaFilter className="mr-2" /> {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg font-semibold text-gray-700">Tổng chi phí đang hiển thị</h2>
            <p className="text-gray-500 text-sm">Tổng số: {expenses.length} khoản chi</p>
          </div>
          <div className="bg-red-50 px-6 py-3 rounded-lg border border-red-100">
            <span className="block text-red-600 font-bold text-lg md:text-2xl">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <form onSubmit={handleApplyFilters} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Tìm kiếm</label>
              <input type="text" name="search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="Lý do chi..." />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Danh mục</label>
              <select name="category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full px-3 py-2 border rounded">
                <option value="all">Tất cả</option>
                {EXPENSE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Từ ngày</label>
              <input type="date" name="dateFrom" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Đến ngày</label>
              <input type="date" name="dateTo" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="md:col-span-4 flex justify-end gap-2 mt-2">
              <button type="button" onClick={handleResetFilters} className="px-4 py-2 bg-gray-200 rounded">Đặt lại</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lọc</button>
            </div>
          </form>
        </div>
      )}

      {/* Danh sách List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {expensesLoading ? <div className="p-8 text-center"><FaSpinner className="animate-spin text-blue-600 text-2xl mx-auto" /></div> :
          <table className="min-w-full divide-y divide-gray-200 hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lý do chi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.date)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{getCategoryLabel(item.category)}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600 text-right">{formatCurrency(item.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button onClick={() => handleViewDetail(item)} className="text-blue-600 hover:text-blue-900 mr-3"><FaInfoCircle size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            <div className="bg-blue-600 px-4 py-3 flex justify-between items-center text-white">
              <h3 className="font-medium">{formMode === 'add' ? 'Thêm phiếu chi' : 'Sửa phiếu chi'}</h3>
              <button onClick={handleCloseForm}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lý do chi <span className="text-red-500">*</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="VD: Trả tiền bốc xếp cát" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền <span className="text-red-500">*</span></label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border rounded p-2 outline-none bg-white">
                    {EXPENSE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <button type="button" onClick={handleCloseForm} className="px-4 py-2 bg-gray-200 mr-2 rounded text-gray-800">Hủy</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center">
                  {submitting ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />} Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && detailExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
            <div className="bg-blue-600 px-4 py-3 flex justify-between items-center text-white">
              <h3 className="font-medium">Chi tiết phiếu chi</h3>
              <button onClick={handleCloseDetail}><FaTimes /></button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <p><strong>Lý do:</strong> {detailExpense.title}</p>
              <p><strong>Số tiền:</strong> <span className="text-red-600 font-bold text-lg">{formatCurrency(detailExpense.amount)}</span></p>
              <p><strong>Danh mục:</strong> {getCategoryLabel(detailExpense.category)}</p>
              <p><strong>Ngày chi:</strong> {formatDate(detailExpense.date)}</p>
              {detailExpense.description && <p><strong>Ghi chú:</strong> {detailExpense.description}</p>}
            </div>
            <div className="bg-gray-50 px-4 py-3 border-t">
              <button onClick={handleCloseDetail} className="w-full py-2 bg-gray-200 rounded font-medium">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostsMana;
