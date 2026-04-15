import { useState } from 'react';
import { FaBookOpen, FaCreditCard, FaMapMarkerAlt, FaMoneyBill, FaSpinner, FaTimes } from 'react-icons/fa';

const PayMent = ({ product, quantity, onClose, onCheckout, ordering }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [addressError, setAddressError] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const totalAmount = product.price * quantity;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setAddressError('Vui lòng nhập địa chỉ giao hàng (công trình)');
      return;
    }

    // Đẩy data lên page cha để gọi API
    onCheckout({
      paymentMethod,
      address,
      notes
    });
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white rounded-xl w-full max-w-md mx-auto shadow-2xl z-50">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h3 className="text-lg font-bold text-gray-900">Thông tin đặt hàng</h3>
          <button type="button" className="text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-sm" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {/* Tóm tắt đơn */}
          <div className="bg-blue-50 p-3 rounded-lg mb-5 border border-blue-100">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{product.name}</span>
              <span>{quantity} {product.unit}</span>
            </div>
            <div className="flex justify-between items-end mt-2 pt-2 border-t border-blue-200">
              <span className="text-sm font-medium">Tổng thanh toán:</span>
              <span className="text-xl font-bold text-red-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaMapMarkerAlt className="mr-1 text-gray-400" /> Địa chỉ nhận hàng (Công trình) <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none ${addressError ? 'border-red-500' : 'border-gray-300'}`}
              rows="2"
              placeholder="Nhập địa chỉ công trình hoặc nơi nhận vật liệu..."
              value={address}
              onChange={(e) => { setAddress(e.target.value); setAddressError(''); }}
            />
            {addressError && <p className="text-xs text-red-500 mt-1">{addressError}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú cho tài xế (Tùy chọn)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="VD: Xe tải 5 tấn vào được..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
            <div className="space-y-2">
              <div
                className={`flex items-center p-3 border rounded-lg cursor-pointer ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <FaMoneyBill className={`h-5 w-5 ${paymentMethod === 'cash' ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="ml-3"><p className="text-sm font-medium">Tiền mặt (Giao hàng thu tiền)</p></div>
              </div>

              <div
                className={`flex items-center p-3 border rounded-lg cursor-pointer ${paymentMethod === 'transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setPaymentMethod('transfer')}
              >
                <FaCreditCard className={`h-5 w-5 ${paymentMethod === 'transfer' ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="ml-3"><p className="text-sm font-medium">Chuyển khoản</p></div>
              </div>

              {/* Công nợ cho dân xây dựng */}
              <div
                className={`flex items-center p-3 border rounded-lg cursor-pointer ${paymentMethod === 'debt' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setPaymentMethod('debt')}
              >
                <FaBookOpen className={`h-5 w-5 ${paymentMethod === 'debt' ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="ml-3"><p className="text-sm font-medium">Ghi sổ (Công nợ)</p></div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={ordering}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-70"
          >
            {ordering ? <><FaSpinner className="animate-spin mr-2" /> Đang tạo đơn...</> : 'Xác Nhận Đặt Hàng'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PayMent;
