import { useEffect, useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaMinus, FaPhoneAlt, FaPlus, FaShieldAlt, FaShoppingCart, FaTruck, FaComments, FaInfoCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { APP_CONFIG } from '../../../config';
import { useAuth } from '../../../contexts/AuthContext';
import { createOrder, fetchProductById, fetchProducts } from '../../../stores/redux/actions/adminActions.js';
import PayMent from '../payment/index.js';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [contactPhone, setContactPhone] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  // Lấy dữ liệu từ Redux
  const { productDetails: productDetail, loading, products } = useSelector((state) => state.adminReducer || {});

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      setQuantity(1); // Reset quantity when product changes
    }
  }, [id, dispatch]);

  // Lấy thêm sản phẩm cùng danh mục nếu danh sách products rỗng
  useEffect(() => {
    if (products?.length === 0) {
      dispatch(fetchProducts());
    }
  }, [products?.length, dispatch]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F8FAFC] flex justify-center items-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-12 h-12 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!productDetail) {
    return (
      <div className="min-h-[70vh] bg-[#F8FAFC] flex flex-col justify-center items-center px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-sm text-slate-500 mb-6">Sản phẩm này có thể đã bị xóa hoặc đường dẫn không chính xác.</p>
        <button onClick={() => navigate('/products')} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition">
          Quay lại danh sách sản phẩm
        </button>
      </div>
    );
  }

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const categoryLabel = APP_CONFIG.PRODUCT_CATEGORIES.find((c) => c.value === productDetail.category)?.label || productDetail.category;

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    if (productDetail.stock < quantity) {
      toast.error(`Không đủ số lượng. Kho còn ${productDetail.stock || 0}.`);
      return;
    }
    setShowPaymentModal(true);
  };

  const handleCheckout = async (checkoutData) => {
    try {
      setOrdering(true);
      const orderData = {
        items: [{ product_id: productDetail.id || productDetail.id, quantity }],
        payment_method: checkoutData.paymentMethod,
        delivery_address: checkoutData.address,
        notes: checkoutData.notes,
        shipping_fee: 0
      };

      await dispatch(createOrder(orderData));
      toast.success('Đặt hàng thành công!');
      setShowPaymentModal(false);
      // Refresh detail
      dispatch(fetchProductById(id));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Lỗi đặt hàng!');
    } finally {
      setOrdering(false);
    }
  };

  const submitContactPhone = (e) => {
    e.preventDefault();
    if (!contactPhone || contactPhone.length < 9) {
      toast.warning('Vui lòng nhập số điện thoại hợp lệ!');
      return;
    }
    toast.success('Gửi yêu cầu thành công! Chuyên viên sẽ gọi lại cho bạn sớm nhất.');
    setContactPhone('');
  };

  const relatedProducts = products?.filter(p => p.category === productDetail.category && p.id !== productDetail.id).slice(0, 4);

  return (
    <div className="bg-[#F8FAFC] py-4 lg:py-6">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">

        {/* Breadcrumb & Nút quay lại */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <nav className="flex text-xs text-slate-500 font-medium whitespace-nowrap">
            <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-blue-600 transition-colors">Sản phẩm</Link>
            <span className="mx-2">/</span>
            <Link to={`/products?category=${productDetail.category}`} className="hover:text-blue-600 transition-colors">{categoryLabel}</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800 truncate max-w-[150px] sm:max-w-[200px]">{productDetail.name}</span>
          </nav>

          <button onClick={() => navigate(-1)} className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors self-start">
            <FaArrowLeft className="mr-1.5" /> Quay lại
          </button>
        </div>

        {/* Khối chính hiển thị sản phẩm */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 ring-1 ring-slate-900/5 overflow-hidden mb-6">
          <div className="flex flex-col lg:flex-row">

            {/* Cột Trái: Ảnh Sản Phẩm */}
            <div className="w-full lg:w-[45%] bg-slate-50 p-5 lg:p-8 flex items-center justify-center relative">
              <div className="relative w-full pb-[85%] md:pb-[75%] rounded-xl overflow-hidden shadow-sm border border-slate-200/50 bg-white">
                <img
                  src={productDetail.image || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&name=${encodeURIComponent(productDetail.name)}`}
                  alt={productDetail.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-xl cursor-crosshair hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              {productDetail.stock <= 0 && (
                <div className="absolute top-6 left-6 bg-rose-600 text-white font-bold px-3 py-1 rounded-md shadow-lg text-xs tracking-wide">
                  TẠM HẾT HÀNG
                </div>
              )}
            </div>

            {/* Cột Phải: Thông tin chi tiết */}
            <div className="w-full lg:w-[55%] p-5 lg:p-8 flex flex-col">

              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-100">
                  {categoryLabel}
                </span>
                <span className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                  Mã SP: {productDetail.id?.substring(0, 6)}
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-3 leading-tight tracking-tight">
                {productDetail.name}
              </h1>

              <div className="flex items-end mb-4 pb-4 border-b border-slate-100">
                <span className="text-3xl lg:text-4xl font-black text-rose-600 tracking-tighter">
                  {formatPrice(productDetail.price)}
                </span>
                <span className="text-slate-500 font-bold ml-1.5 mb-1 text-lg">/ {productDetail.unit}</span>
              </div>

              {/* Box Tính Năng Rút Gọn */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="text-emerald-500"><FaShieldAlt size={18} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Chất lượng cao</h4>
                    <p className="text-[10px] text-slate-500">Hàng chính hãng</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="text-blue-500"><FaTruck size={18} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Miễn phí ship</h4>
                    <p className="text-[10px] text-slate-500">Nội thành HCM</p>
                  </div>
                </div>
              </div>

              {/* Box Đặt hàng Nhỏ Gọn */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 mt-auto">
                <div className="flex items-center gap-3">
                  {/* Selector Số lượng gọn hơn */}
                  <div className="flex items-center border-2 border-slate-200 bg-white rounded-lg justify-between p-1 w-28 md:w-32">
                    <button type="button" className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded transition-colors" onClick={() => setQuantity(q => Math.max(1, q - 1))}><FaMinus size={12} /></button>
                    <input type="number" min="1" max={productDetail.stock} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(productDetail.stock, Number(e.target.value))))} className="w-10 text-center text-base font-bold focus:outline-none text-slate-800 p-0" />
                    <button type="button" className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded transition-colors" onClick={() => setQuantity(q => Math.min(productDetail.stock, q + 1))}><FaPlus size={12} /></button>
                  </div>

                  <div className="flex-1">
                    <button
                      onClick={handleBuyNow}
                      disabled={productDetail.stock <= 0}
                      className="w-full py-3 disabled:bg-slate-300 disabled:shadow-none bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm sm:text-base flex justify-center items-center gap-2 transition-all shadow-md hover:shadow-lg"
                    >
                      {productDetail.stock > 0 ? (
                        <><FaShoppingCart size={16} /> MUA NGAY</>
                      ) : (
                        'TẠM HẾT HÀNG'
                      )}
                    </button>
                  </div>
                </div>

                {productDetail.stock > 0 && (
                  <div className="mt-2.5 text-center text-[11px] font-semibold text-emerald-600 flex items-center justify-center gap-1.5">
                    Kho hiện có sẵn {productDetail.stock} {productDetail.unit}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Khối Tư vấn */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 lg:p-6 mb-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3 md:gap-4 justify-center md:justify-start">
            <FaPhoneAlt className="text-blue-400 rotate-12 text-2xl hidden md:block" />
            <div className="text-center md:text-left">
              <h3 className="text-base sm:text-lg font-bold mb-0.5">Cần tư vấn thêm về vật liệu?</h3>
              <p className="text-slate-300 text-[11px] sm:text-xs">Để lại SĐT, chuyên viên sẽ liên hệ sau 5 phút.</p>
            </div>
          </div>
          <div className="w-full md:w-[350px]">
            <form onSubmit={submitContactPhone} className="relative flex items-center">
              <input
                type="tel"
                placeholder="Nhập số điện thoại..."
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full pl-4 pr-24 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 focus:border-blue-400 rounded-xl text-white text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium"
              />
              <button type="submit" className="absolute right-1 top-1 bottom-1 bg-blue-500 hover:bg-blue-600 px-4 text-xs font-bold text-white rounded-lg transition-colors">
                GỌI LẠI
              </button>
            </form>
          </div>
        </div>

        {/* Hai cột dưới: Tabs Nội dung & Cột Tương Tự */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Cột Nội dung Tabs */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100/50 ring-1 ring-slate-900/5 overflow-hidden">
              
              {/* Header Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'info' ? 'text-blue-600 border-blue-600 bg-blue-50/30' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'}`}
                >
                  <FaInfoCircle /> Thông tin chi tiết
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'comments' ? 'text-blue-600 border-blue-600 bg-blue-50/30' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'}`}
                >
                  <FaComments /> Đánh giá & Bình luận
                </button>
              </div>

              {/* Nội dung Tabs */}
              <div className="p-5 lg:p-6 min-h-[300px]">
                {activeTab === 'info' && (
                  <div className="prose prose-sm md:prose-base max-w-none text-slate-600 leading-relaxed text-[13px] md:text-sm">
                    {productDetail.description ? (
                      <p className="whitespace-pre-wrap">{productDetail.description}</p>
                    ) : (
                      <>
                        <h4 className="font-bold text-slate-800 mb-2">Mô tả cơ bản:</h4>
                        <p>
                          <strong>{productDetail.name}</strong> là vật liệu xây dựng chất lượng cao thiết yếu. Được kiểm định nghiêm ngặt trước khi xuất xưởng, đảm bảo độ hao hụt thấp và quy cách tiêu chuẩn hiện hành.
                        </p>
                        <h4 className="font-bold text-slate-800 mt-4 mb-2">Đặc điểm nổi bật:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Phù hợp điều kiện khí hậu miền Nam.</li>
                          <li>Khả năng chịu áp lực và độ bền cực cao trong thi công nền móng.</li>
                          <li>Có xuất đầy đủ hóa đơn VAT cho dự án lớn.</li>
                        </ul>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div>
                    <h4 className="font-bold text-slate-800 mb-4 text-sm">Giao lưu & Đánh giá</h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 focus-within:ring-2 ring-blue-500/20 transition-all">
                      <div className="flex gap-3 relative">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">KH</div>
                        <div className="flex-1">
                           <textarea
                             placeholder="Bạn có câu hỏi gì về sản phẩm này?"
                             className="w-full bg-transparent text-sm focus:outline-none resize-none min-h-[60px]"
                           ></textarea>
                           <div className="flex justify-end mt-2">
                             <button className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">Bình luận</button>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Fake comment items */}
                      <div className="flex gap-3 pb-4 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">TV</div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-slate-800 text-xs">Trần Văn Thiện</span>
                            <span className="text-[10px] text-slate-400">2 ngày trước</span>
                          </div>
                          <p className="text-slate-600 text-sm">Hàng đúng mô tả. Đội xe giao tận công trình rất nhiệt tình!</p>
                        </div>
                      </div>
                      <div className="flex gap-3 pb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">AN</div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-slate-800 text-xs">Anh Ngân (Nhà Thầu)</span>
                            <span className="text-[10px] text-slate-400">1 tuần trước</span>
                          </div>
                          <p className="text-slate-600 text-sm">Chất lượng đồng đều, xuất hóa đơn VAT nhanh. Rất hài lòng ạ, sẽ tiếp tục hợp tác với DVN.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cột Sản Phẩm Tương Tự */}
          <div className="w-full lg:w-1/3">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block"></span>
              Gợi ý cho bạn
            </h3>

            <div className="space-y-3">
              {relatedProducts?.length > 0 ? relatedProducts.map(related => (
                <div key={related.id} onClick={() => navigate(`/product/${related.id}`)} className="bg-white rounded-xl p-3 flex gap-3 cursor-pointer group hover:shadow-md hover:border-blue-200 border border-slate-100/60 shadow-sm transition-all">
                  <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-lg overflow-hidden relative border border-slate-100">
                    <img src={related.image || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&name=${encodeURIComponent(related.name)}`} alt={related.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-[13px] font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors leading-snug">{related.name}</h4>
                    <p className="text-rose-600 text-sm font-extrabold">{formatPrice(related.price)} <span className="text-[10px] text-slate-400 font-normal">/ {related.unit}</span></p>
                  </div>
                </div>
              )) : (
                <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  Đang tải thêm sản phẩm...
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {showPaymentModal && (
        <PayMent product={productDetail} quantity={quantity} onClose={() => setShowPaymentModal(false)} onCheckout={handleCheckout} ordering={ordering} />
      )}
    </div>
  );
};

export default ProductDetailPage;
