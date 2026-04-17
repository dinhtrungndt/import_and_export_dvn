import { useEffect, useState } from 'react';
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClipboardList,
  FaInfoCircle,
  FaSearch,
  FaShippingFast,
  FaTimes,
  FaTimesCircle,
  FaTruck,
  FaUndoAlt,
} from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../../stores/redux/actions/adminActions.js';

const STATUS_CONFIG = {
  'Chờ duyệt': {
    label: 'Chờ duyệt',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dot: 'bg-yellow-500',
    icon: <MdPendingActions className="h-3.5 w-3.5" />,
  },
  'Đang giao': {
    label: 'Đang giao',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    dot: 'bg-blue-500',
    icon: <FaTruck className="h-3.5 w-3.5" />,
  },
  'Hoàn thành': {
    label: 'Hoàn thành',
    color: 'bg-green-100 text-green-800 border-green-200',
    dot: 'bg-green-500',
    icon: <FaCheckCircle className="h-3.5 w-3.5" />,
  },
  'Đã hủy': {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800 border-red-200',
    dot: 'bg-red-400',
    icon: <FaTimesCircle className="h-3.5 w-3.5" />,
  },
};

const PAYMENT_LABELS = {
  cash: 'Tiền mặt',
  transfer: 'Chuyển khoản',
  debt: 'Công nợ',
};

const STATUS_TRANSITIONS = {
  'Chờ duyệt': ['Đang giao', 'Đã hủy'],
  'Đang giao': ['Hoàn thành', 'Đã hủy'],
  'Hoàn thành': [],
  'Đã hủy': ['Chờ duyệt'],
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// ─── StatusBadge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
    icon: null,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── OrderDetailModal ─────────────────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose, onStatusChange, updating }) => {
  if (!order) return null;

  const nextStatuses = STATUS_TRANSITIONS[order.status] || [];

  const statusBtnStyle = (s) => {
    if (s === 'Đã hủy') return 'bg-red-600 hover:bg-red-700 text-white';
    if (s === 'Đang giao') return 'bg-blue-600 hover:bg-blue-700 text-white';
    if (s === 'Hoàn thành') return 'bg-green-600 hover:bg-green-700 text-white';
    if (s === 'Chờ duyệt') return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    return 'bg-gray-600 hover:bg-gray-700 text-white';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Chi tiết Đơn hàng</h2>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status & Meta */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <StatusBadge status={order.status} />
            <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">Địa chỉ giao hàng</p>
              <p className="text-sm font-semibold text-gray-900">{order.delivery_address}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">Thanh toán</p>
              <p className="text-sm font-semibold text-gray-900">{PAYMENT_LABELS[order.payment_method] || order.payment_method}</p>
            </div>
            {order.notes && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 sm:col-span-2">
                <p className="text-xs text-amber-700 font-medium mb-1">Ghi chú</p>
                <p className="text-sm text-amber-900">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <FaBoxOpen className="text-blue-500" /> Danh sách sản phẩm
            </h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Sản phẩm</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-600">SL</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Đơn giá</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items?.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.unit}</p>
                      </td>
                      <td className="px-3 py-3 text-center font-semibold text-gray-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tiền hàng</span>
                <span>{formatCurrency(order.sub_total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>{formatCurrency(order.shipping_fee)}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-base text-blue-900">
                <span>Tổng cộng</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {nextStatuses.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 font-medium mb-3">Cập nhật trạng thái đơn hàng:</p>
              <div className="flex flex-wrap gap-2">
                {nextStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => onStatusChange(order.id, s)}
                    disabled={updating}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${statusBtnStyle(s)}`}
                  >
                    {updating ? (
                      <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      STATUS_CONFIG[s]?.icon
                    )}
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminReducer);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await dispatch(updateOrderStatus(orderId, newStatus));
      setSuccessMsg(`Đã cập nhật trạng thái thành "${newStatus}"`);
      setTimeout(() => setSuccessMsg(''), 3000);
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    } catch {
      // error handled by reducer
    } finally {
      setUpdating(false);
    }
  };

  // Filter + Search
  const filtered = (orders || []).filter((o) => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q
      || o.id.toLowerCase().includes(q)
      || o.delivery_address.toLowerCase().includes(q)
      || o.user_id?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const tabCounts = {
    all: orders?.length || 0,
    'Chờ duyệt': orders?.filter((o) => o.status === 'Chờ duyệt').length || 0,
    'Đang giao': orders?.filter((o) => o.status === 'Đang giao').length || 0,
    'Hoàn thành': orders?.filter((o) => o.status === 'Hoàn thành').length || 0,
    'Đã hủy': orders?.filter((o) => o.status === 'Đã hủy').length || 0,
  };

  const tabs = [
    { key: 'all', label: 'Tất cả', icon: <FaClipboardList /> },
    { key: 'Chờ duyệt', label: 'Chờ duyệt', icon: <MdPendingActions /> },
    { key: 'Đang giao', label: 'Đang giao', icon: <FaShippingFast /> },
    { key: 'Hoàn thành', label: 'Hoàn thành', icon: <FaCheckCircle /> },
    { key: 'Đã hủy', label: 'Đã hủy', icon: <FaTimesCircle /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        <span className="mt-3 text-sm text-gray-500">Đang tải đơn hàng...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm">
        <p className="font-bold">Lỗi tải dữ liệu</p>
        <p>{error?.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="text-sm text-gray-500 mt-0.5">Xem & cập nhật trạng thái tất cả đơn đặt hàng</p>
        </div>
        <button
          onClick={() => dispatch(fetchAllOrders())}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-sm"
        >
          <FaUndoAlt className="h-3.5 w-3.5" /> Làm mới
        </button>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <FaCheckCircle className="text-green-500 flex-shrink-0" /> {successMsg}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Chờ duyệt', count: tabCounts['Chờ duyệt'], color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
          { label: 'Đang giao', count: tabCounts['Đang giao'], color: 'text-blue-600 bg-blue-50 border-blue-200' },
          { label: 'Hoàn thành', count: tabCounts['Hoàn thành'], color: 'text-green-600 bg-green-50 border-green-200' },
          { label: 'Đã hủy', count: tabCounts['Đã hủy'], color: 'text-red-600 bg-red-50 border-red-200' },
        ].map((s) => (
          <div
            key={s.label}
            onClick={() => setFilterStatus(s.label)}
            className={`border rounded-xl p-4 cursor-pointer hover:shadow-sm transition-all ${s.color} ${filterStatus === s.label ? 'ring-2 ring-offset-1 ring-current' : ''}`}
          >
            <p className="text-xs font-medium opacity-80">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Tab bar */}
        <div className="border-b border-gray-100 px-4 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilterStatus(t.key)}
              className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${filterStatus === t.key
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {t.icon}
              {t.label}
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-semibold ${filterStatus === t.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                {tabCounts[t.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative max-w-sm">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã đơn, địa chỉ..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <FaClipboardList className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">Không có đơn hàng nào</p>
            <p className="text-gray-400 text-xs mt-1">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Mã đơn</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wide hidden md:table-cell">Địa chỉ giao</th>
                  <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Trạng thái</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wide hidden sm:table-cell">Tổng tiền</th>
                  <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wide hidden lg:table-cell">T.Toán</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wide hidden lg:table-cell">Ngày đặt</th>
                  <th className="px-4 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-5 py-4">
                      <p className="font-mono font-semibold text-gray-800 text-xs">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.items?.length || 0} sản phẩm</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-gray-700 max-w-[200px] truncate" title={order.delivery_address}>{order.delivery_address}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4 text-right hidden sm:table-cell">
                      <p className="font-bold text-gray-900">{formatCurrency(order.total_amount)}</p>
                      {order.shipping_fee > 0 && (
                        <p className="text-xs text-gray-400">Ship: {formatCurrency(order.shipping_fee)}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center hidden lg:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        {PAYMENT_LABELS[order.payment_method] || order.payment_method}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right hidden lg:table-cell">
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <FaInfoCircle className="h-3 w-3" /> Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
            Hiển thị <span className="font-semibold">{filtered.length}</span> / {orders?.length || 0} đơn hàng
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  );
};

export default OrderManagement;
