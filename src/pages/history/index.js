import { useEffect } from 'react';
import { FaBookOpen, FaCreditCard, FaMoneyBill, FaSync, FaTruck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserOrders } from '../../stores/redux/actions/adminActions.js';

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { orders = [], loading, error } = useSelector((state) => state.adminReducer);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isAuthenticated]);

  const handleRefresh = () => {
    if (isAuthenticated) dispatch(fetchUserOrders());
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getPaymentMethodInfo = (method) => {
    if (method === 'transfer') return { icon: <FaCreditCard />, label: 'Chuyển khoản', color: 'bg-blue-100 text-blue-700' };
    if (method === 'debt') return { icon: <FaBookOpen />, label: 'Công nợ', color: 'bg-purple-100 text-purple-700' };
    return { icon: <FaMoneyBill />, label: 'Tiền mặt', color: 'bg-green-100 text-green-700' };
  };

  const getStatusColor = (status) => {
    if (status === 'Chờ duyệt') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (status === 'Đang giao') return 'text-blue-600 bg-blue-50 border-blue-200';
    if (status === 'Đã hủy') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-green-600 bg-green-50 border-green-200'; // Hoàn thành
  };

  if (!isAuthenticated) return null;

  if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lịch sử mua hàng</h1>
        <button onClick={handleRefresh} className="flex items-center px-3 py-2 bg-white border rounded shadow-sm hover:bg-gray-50 text-sm">
          <FaSync className="mr-2" /> Làm mới
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error.message || error.detail || 'Lỗi tải lịch sử.'}</p>}

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
          <FaTruck className="mx-auto text-4xl text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Chưa có đơn hàng</h3>
          <p className="text-gray-500 mb-4">Bạn chưa đặt mua vật liệu nào.</p>
          <Link to="/products" className="bg-blue-600 text-white px-5 py-2 rounded font-medium hover:bg-blue-700">Xem Báo Giá VLXD</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const paymentInfo = getPaymentMethodInfo(order.payment_method);
            return (
              <div key={order.id} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <span className="font-bold text-blue-700">Mã ĐH: {order.id.substring(0, 8).toUpperCase()}</span>
                    <span className="text-xs text-gray-500 ml-3">Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="p-4">
                  <div className="mb-3 border-b pb-3 text-sm">
                    <p><strong>Giao đến:</strong> {order.delivery_address}</p>
                    {order.notes && <p className="text-gray-500 mt-1">Ghi chú: {order.notes}</p>}
                  </div>

                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 items-center">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} {item.unit} x {formatPrice(item.price)}</p>
                      </div>
                      <p className="font-medium">{formatPrice(item.quantity * item.price)}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 flex justify-between items-center border-t">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${paymentInfo.color}`}>
                    {paymentInfo.icon} <span className="ml-1">{paymentInfo.label}</span>
                  </span>
                  <div>
                    <span className="text-sm text-gray-600 mr-2">Tổng cộng:</span>
                    <span className="text-lg font-bold text-red-600">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
