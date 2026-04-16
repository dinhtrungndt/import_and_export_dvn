import { useEffect, useState } from 'react';
import { FaBuilding, FaFilter, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductQuickViewModal from '../../components/ProductQuickViewModal/index.js';
import { APP_CONFIG } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { createOrder, fetchProducts } from '../../stores/redux/actions/adminActions.js';
import PayMent from './payment/index.js';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const getInitialParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      category: searchParams.get('category') || 'all',
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || 'createdAt_desc',
    };
  };

  const initialParams = getInitialParams();
  const [searchTerm, setSearchTerm] = useState(initialParams.search);
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category);
  const [sortOption, setSortOption] = useState(initialParams.sort);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [ordering, setOrdering] = useState(false);

  const { products = [], loading = false } = useSelector((state) => state.adminReducer || {});

  console.log(products.filter(item => item.id === '0c3da9c3-3c9d-4104-b59b-a0abc6a78503'));

  // Sync state if URL changes externally (e.g. from header nav links)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlCategory = searchParams.get('category') || 'all';
    const urlSearch = searchParams.get('search') || '';
    const urlSort = searchParams.get('sort') || 'createdAt_desc';

    let shouldUpdatePage = false;

    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
      shouldUpdatePage = true;
    }
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
      shouldUpdatePage = true;
    }
    if (urlSort !== sortOption) {
      setSortOption(urlSort);
      shouldUpdatePage = true;
    }

    if (shouldUpdatePage) {
      setCurrentPage(1);
    }
  }, [location.search]);

  useEffect(() => {
    const apiParams = {};

    if (selectedCategory !== 'all') apiParams.category = selectedCategory;
    if (searchTerm) apiParams.search = searchTerm;

    apiParams.sort = sortOption;

    const queryParams = new URLSearchParams();
    if (selectedCategory !== 'all') queryParams.set('category', selectedCategory);
    if (searchTerm) queryParams.set('search', searchTerm);
    if (sortOption !== 'createdAt_desc') queryParams.set('sort', sortOption);

    navigate(
      { pathname: '/products', search: queryParams.toString() },
      { replace: true }
    );

    dispatch(fetchProducts(apiParams));

  }, [selectedCategory, searchTerm, sortOption, dispatch, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.search.value.trim());
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortOption('createdAt_desc');
    setCurrentPage(1);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowProductModal(true);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products` } });
      return;
    }
    if (!selectedProduct || selectedProduct.stock < quantity) {
      toast.error(`Không đủ số lượng. Kho còn ${selectedProduct?.stock || 0}.`);
      return;
    }
    setShowPaymentModal(true);
  };

  const handleCheckout = async (checkoutData) => {
    try {
      setOrdering(true);
      // console.log("selectedProduct", selectedProduct);
      const orderData = {
        items: [{ product_id: selectedProduct.id, quantity }],
        payment_method: checkoutData.paymentMethod,
        delivery_address: checkoutData.address,
        notes: checkoutData.notes,
        shipping_fee: 0
      };

      await dispatch(createOrder(orderData));
      toast.success('Đặt hàng thành công!');
      setShowPaymentModal(false);
      setShowProductModal(false);
      dispatch(fetchProducts());
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Lỗi đặt hàng!');
    } finally {
      setOrdering(false);
    }
  };

  const currentItems = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
            Sản Phẩm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Vật Liệu Xây Dựng</span>
          </h1>
          <p className="text-slate-500 text-base lg:text-lg max-w-2xl">
            Cung cấp đa dạng các loại vật tư, thiết bị xây dựng chính hãng với giá cả cạnh tranh. Lựa chọn giải pháp hoàn hảo cho công trình của bạn.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* Sidebar Bộ Lọc */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 sticky top-24 ring-1 ring-slate-900/5">
              <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FaFilter className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Bộ lọc tìm kiếm</h2>
              </div>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative group">
                  <input
                    type="text" name="search" placeholder="Tìm tên vật liệu..." defaultValue={searchTerm}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 hover:border-blue-400 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-sm transition-all duration-300 text-slate-700 placeholder-slate-400"
                  />
                  <button type="submit" className="absolute left-3.5 top-0 bottom-0 text-slate-400 group-hover:text-blue-500 transition-colors flex items-center justify-center">
                    <FaSearch className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Danh Mục Sản Phẩm</h3>
                <div className="space-y-2 flex flex-col">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200/60'}`}
                  >
                    Tất cả vật liệu
                  </button>
                  {APP_CONFIG.PRODUCT_CATEGORIES.map(cat => (
                    <button
                      key={cat.value} onClick={() => handleCategoryChange(cat.value)}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${selectedCategory === cat.value ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200/60'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Lưới Sản Phẩm */}
          <div className="flex-1 min-w-0">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  Danh sách sản phẩm
                  {products.length > 0 && (
                    <span className="ml-3 inline-flex items-center justify-center bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {currentItems.length} / {products.length}
                    </span>
                  )}
                </h2>
                {searchTerm && (
                  <div className="flex items-center text-sm text-slate-500 mt-1.5">
                    Kết quả cho: <span className="font-bold text-slate-800 ml-1">"{searchTerm}"</span>
                    <button onClick={resetFilters} className="ml-3 text-blue-600 hover:text-blue-800 text-xs font-semibold hover:underline">Xóa bộ lọc</button>
                  </div>
                )}
              </div>

              {/* Sort by Option Right Top */}
              <div className="flex items-center gap-3 self-start sm:self-center z-10 w-full sm:w-auto mt-1 sm:mt-0">
                <span className="text-sm font-semibold text-slate-500 whitespace-nowrap hidden lg:inline-block">Sắp xếp:</span>
                <div className="relative w-full sm:w-56 shrink-0">
                  <select
                    value={sortOption} onChange={handleSortChange}
                    className="w-full bg-white border border-slate-200 text-slate-700 py-2.5 px-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 appearance-none cursor-pointer transition-all duration-300 hover:border-blue-400 shadow-sm"
                  >
                    <option value="createdAt_desc">✨ Mới cập nhật</option>
                    <option value="price_asc">📈 Giá: Thấp đến cao</option>
                    <option value="price_desc">📉 Giá: Cao đến thấp</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-32">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                  <div className="absolute w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100/50 ring-1 ring-slate-900/5 text-center px-4">
                <div className="w-24 h-24 bg-slate-50 flex items-center justify-center rounded-full mb-6 text-slate-300">
                  <FaBuilding className="text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">Chúng tôi không thể tìm thấy sản phẩm nào khớp với bộ lọc hiện tại của bạn. Vui lòng thử lại với tiêu chí khác.</p>
                <button onClick={resetFilters} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-md shadow-slate-900/10">
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {currentItems.map(product => (
                  <div key={product.id} className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 transform hover:-translate-y-1 flex flex-col h-full ring-1 ring-transparent hover:ring-blue-500/5">

                    {/* Image Box */}
                    <div onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer relative w-full aspect-[4/3] bg-slate-50 overflow-hidden">
                      <img
                        src={product.image || `https://ui-avatars.com/api/?background=f8fafc&color=3b82f6&bold=true&name=${encodeURIComponent(product.name)}`}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Overlays & Badges */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="absolute top-3 inset-x-3 flex justify-between items-start">
                        <span className="bg-white/95 backdrop-blur-sm text-slate-600 text-[11px] font-bold px-2.5 py-1.5 rounded border border-slate-100 shadow-sm leading-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[70%]">
                          {APP_CONFIG.PRODUCT_CATEGORIES.find((c) => c.value === product.category)?.label || product.category}
                        </span>
                        {product.stock <= 0 ? (
                          <span className="bg-rose-500/95 backdrop-blur-sm text-white font-bold py-1.5 px-2.5 rounded text-[11px] shadow-sm tracking-wide leading-none whitespace-nowrap ml-2">Hết</span>
                        ) : null}
                      </div>

                      {/* Hover Quick Action */}
                      <div className="absolute bottom-3 inset-x-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); openProductModal(product); }} className="flex-1 bg-white hover:bg-slate-50 shadow-sm rounded-lg py-2 text-center text-[13px] font-bold text-blue-600 flex items-center justify-center gap-1.5 transition-colors">
                          <FaShoppingCart className="w-3.5 h-3.5" /> Mua Nhanh
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm rounded-lg py-2 text-center text-[13px] font-bold text-white flex items-center justify-center gap-1.5 transition-colors border border-transparent">
                          <FaSearch className="w-3.5 h-3.5" /> Chi Tiết
                        </button>
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className="p-4 lg:p-5 flex flex-col flex-grow bg-white cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                      <h3 className="text-[15px] font-bold text-slate-800 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                        {product.name}
                      </h3>

                      <div className="mt-auto pt-3 flex flex-col gap-2 border-t border-slate-100/80">
                        <div className="flex items-end gap-1.5 break-words">
                          <span className="text-lg lg:text-xl font-extrabold text-blue-600 tracking-tight leading-none">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-xs font-semibold text-slate-400 shrink-0 leading-none mb-0.5">
                            / {product.unit}
                          </span>
                        </div>
                        {product.stock > 0 ? (
                          <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Kho: <span className="font-bold text-slate-700">{product.stock}</span>
                          </div>
                        ) : (
                          <div className="text-xs font-medium text-rose-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Tạm hết hàng
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 mb-4">
                <nav className="inline-flex items-center p-1.5 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="flex items-center px-2 space-x-1 border-x border-slate-100 mx-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>

        {showProductModal && selectedProduct && (
          <ProductQuickViewModal product={selectedProduct} onClose={closeProductModal} quantity={quantity} setQuantity={setQuantity} onBuy={handleBuyNow} />
        )}

        {showPaymentModal && selectedProduct && (
          <PayMent product={selectedProduct} quantity={quantity} onClose={() => setShowPaymentModal(false)} onCheckout={handleCheckout} ordering={ordering} />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
