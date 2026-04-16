import { useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaMoneyBillWave, FaShieldAlt, FaShoppingCart, FaTruck } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { createOrder } from '../../stores/redux/actions/adminActions.js';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, cartTotal, cartCount, clearCart, updateQuantity, removeFromCart } = useCart();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isOrdering, setIsOrdering] = useState(false);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

  // Nếu chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] bg-[#F8FAFC] flex flex-col justify-center items-center px-4 md:px-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Bạn cần đăng nhập</h2>
        <p className="text-slate-500 mb-6 text-center">Vui lòng đăng nhập để tiến hành đặt hàng và quản lý đơn.</p>
        <button
          onClick={() => navigate('/login', { state: { from: '/checkout' } })}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
        >
          Đăng Nhập Ngay
        </button>
      </div>
    );
  }

  // Nếu giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#F8FAFC] flex flex-col justify-center items-center px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
          <FaShoppingCart className="text-4xl text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Giỏ hàng trống</h2>
        <p className="text-slate-500 mb-6 text-center max-w-sm">Có vẻ như bạn chưa chọn sản phẩm nào. Hãy quay lại danh sách sản phẩm để thêm vào giỏ.</p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
        >
          Tiếp Tục Mua Sắm
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) {
      toast.warning('Vui lòng nhập đầy đủ địa chỉ giao hàng và số điện thoại liên lạc!');
      return;
    }

    try {
      setIsOrdering(true);

      const items = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const orderData = {
        items: items,
        payment_method: paymentMethod,
        delivery_address: `SĐT: ${phone} - Địa chỉ: ${address}`,
        notes: notes,
        shipping_fee: 0 // Free ship khu vực nội thành
      };

      await dispatch(createOrder(orderData));

      toast.success('🎉 Đặt hàng thành công!');
      clearCart();
      navigate('/order-history');

    } catch (err) {
      toast.error(err.response?.data?.detail || 'Lỗi đặt hàng! Vui lòng thử lại.');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Nút quay lại */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-blue-600 transition">
            <FaArrowLeft className="mr-2" /> Quay lại giỏ hàng
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-4 tracking-tight">Thanh Toán Đơn Hàng</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cột Trái: Danh Sách Sản Phẩm */}
          <div className="w-full lg:w-[60%] flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Sản phẩm đã chọn ({cartCount})</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
                      <div className="w-20 h-20 bg-white rounded-lg border border-slate-200 overflow-hidden shrink-0 shadow-sm p-1">
                        <img
                          src={item.image || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&name=${encodeURIComponent(item.name)}`}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 leading-snug">{item.name}</h3>
                          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">SKU: {item.id?.substring(0, 8)}</div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-rose-600 font-bold">{formatPrice(item.price)} <span className="text-slate-400 font-normal text-[11px] uppercase">/ {item.unit}</span></div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                               <button type="button" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition">-</button>
                               <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, Math.max(1, Number(e.target.value)))} className="w-12 text-center text-sm font-bold text-slate-800 focus:outline-none focus:bg-blue-50" />
                               <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition">+</button>
                            </div>
                            <button type="button" onClick={() => removeFromCart(item.id)} className="text-[13px] font-medium text-slate-400 hover:text-rose-500 underline ml-2 transition-colors">Xóa bỏ</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tính năng cam kết */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-start gap-3">
                <FaShieldAlt className="text-emerald-500 text-xl shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Cam Kết Chất Lượng</h4>
                  <p className="text-emerald-700/80 text-xs mt-1">Đảm bảo vật liệu chính hãng 100%, chuẩn quy cách nhà máy.</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
                <FaTruck className="text-blue-500 text-xl shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Giao Hàng Tận Nơi</h4>
                  <p className="text-blue-700/80 text-xs mt-1">Đội xe chuyên dụng hỗ trợ vận chuyển đến chân công trình.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cột Phải: Form Thông Tin & Tóm Tắt */}
          <div className="w-full lg:w-[40%]">
            <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100">Thông Tin Giao Hàng</h2>

                <div className="space-y-4">
                  {/* Tên khách hàng (readonly) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Tên Khách Hàng</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 text-slate-600 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed"
                    />
                  </div>

                  {/* SĐT */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Số Điện Thoại Nhận Hàng <span className="text-rose-500">*</span></label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập SĐT người nhận..."
                      className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 rounded-lg px-4 py-2.5 text-sm transition font-medium"
                      required
                    />
                  </div>

                  {/* Địa chỉ */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Nơi Giao Hàng (Công trình) <span className="text-rose-500">*</span></label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Đường Vành Đai, Khu dân cư X, Phường Y..."
                      className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 rounded-lg px-4 py-2.5 text-sm transition font-medium min-h-[80px] resize-none"
                      required
                    ></textarea>
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Lưu ý cho đội xe</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Đường hẻm khu nội bộ cấm tải 2T..."
                      className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 rounded-lg px-4 py-2.5 text-sm transition font-medium min-h-[60px] resize-none"
                    ></textarea>
                  </div>

                  {/* Phương thức thanh toán */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Thanh Toán</label>
                    <div className="flex gap-3">
                      <label className={`flex-1 border rounded-xl p-3 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-2">
                          <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                          <FaTruck className={paymentMethod === 'cod' ? 'text-blue-600' : 'text-slate-400'} />
                          <span className={`text-sm font-bold ${paymentMethod === 'cod' ? 'text-blue-700' : 'text-slate-600'}`}>Giao hàng COD</span>
                        </div>
                      </label>
                      <label className={`flex-1 border rounded-xl p-3 cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-2">
                          <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} className="hidden" />
                          <FaMoneyBillWave className={paymentMethod === 'bank' ? 'text-blue-600' : 'text-slate-400'} />
                          <span className={`text-sm font-bold ${paymentMethod === 'bank' ? 'text-blue-700' : 'text-slate-600'}`}>Chuyển khoản</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box Tổng Tiền */}
              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-600 text-sm">Tạm tính ({cartCount} món)</span>
                  <span className="font-bold text-slate-800">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-600 text-sm">Khoản phí vận chuyển</span>
                  <span className="font-bold text-emerald-600">Miễn phí (Nội thành)</span>
                </div>

                <div className="pt-4 border-t border-slate-200 mb-6 flex justify-between items-end">
                  <span className="text-slate-800 font-bold uppercase text-sm">Tổng thanh toán</span>
                  <span className="text-2xl font-black text-rose-600">{formatPrice(cartTotal)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isOrdering}
                  className="w-full flex justify-center items-center gap-2 py-3.5 bg-[#0a192f] hover:bg-blue-900 focus:ring-4 focus:ring-blue-900/20 text-white font-bold rounded-xl text-base transition-all shadow-md disabled:bg-slate-400"
                >
                  {isOrdering ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <><FaCheckCircle /> XÁC NHẬN ĐẶT HÀNG</>
                  )}
                </button>
                <div className="text-center mt-3 text-[11px] text-slate-500">
                  Nhân viên DVN sẽ gọi xác nhận ngay khi bạn đặt hàng thành công.
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

// Khai báo một export default trống để tuân thủ quy tắc React Router lazy load hoặc dynamic imp
export default CheckoutPage;
