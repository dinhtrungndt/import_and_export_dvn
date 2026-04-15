import { useEffect, useMemo, useState } from 'react';
import { FaBuilding, FaFilter, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { APP_CONFIG } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { createOrder, fetchProducts } from '../../stores/redux/actions/adminActions.js';
import ProductDetailPage from './detail/index.js';
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

  useEffect(() => {
    const apiParams = {};
    if (selectedCategory !== 'all') apiParams.category = selectedCategory;
    if (searchTerm) apiParams.search = searchTerm;
    apiParams.sortOption = sortOption;

    const queryParams = new URLSearchParams();
    if (selectedCategory !== 'all') queryParams.set('category', selectedCategory);
    if (searchTerm) queryParams.set('search', searchTerm);
    if (sortOption !== 'createdAt_desc') queryParams.set('sort', sortOption);

    navigate({ pathname: '/products', search: queryParams.toString() }, { replace: true });
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
      const orderData = {
        items: [{ product_id: selectedProduct._id, quantity }],
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

  const sortedProducts = useMemo(() => {
    if (!products.length) return [];
    const productsCopy = [...products];
    const [field, order] = sortOption.split('_');
    return productsCopy.sort((a, b) => {
      if (order === 'asc') return a[field] > b[field] ? 1 : -1;
      return a[field] < b[field] ? 1 : -1;
    });
  }, [products, sortOption]);

  const currentItems = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar Bộ Lọc */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FaFilter className="mr-2 text-blue-600" /> Bộ lọc sản phẩm
            </h2>

            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text" name="search" placeholder="Tìm tên vật liệu..." defaultValue={searchTerm}
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                />
                <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 text-gray-500 hover:text-blue-600">
                  <FaSearch />
                </button>
              </div>
            </form>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Danh Mục</h3>
              <div className="space-y-2 flex flex-col">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'all' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Tất cả vật liệu
                </button>
                {APP_CONFIG.PRODUCT_CATEGORIES.map(cat => (
                  <button
                    key={cat.value} onClick={() => handleCategoryChange(cat.value)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.value ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Sắp xếp</h3>
              <select
                value={sortOption} onChange={handleSortChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt_desc">Mới cập nhật</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lưới Sản Phẩm */}
        <div className="flex-1">
          <div className="mb-4 pb-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Bảng Giá Vật Liệu</h1>
            <span className="text-sm text-gray-500">Hiển thị {currentItems.length} / {sortedProducts.length} kết quả</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <FaBuilding className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Không tìm thấy vật tư</h3>
              <p className="mt-1 text-gray-500">Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
              <button onClick={resetFilters} className="mt-4 text-blue-600 font-medium hover:underline">Xóa tất cả bộ lọc</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {currentItems.map(product => (
                <div key={product._id} onClick={() => openProductModal(product)} className="bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                  <div className="relative aspect-w-4 aspect-h-3 bg-gray-100 overflow-hidden rounded-t-xl">
                    <img
                      src={product.image || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&bold=true&name=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      className="w-full h-48 object-cover object-center"
                    />
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <span className="bg-red-600 text-white font-bold py-1 px-3 rounded text-sm">Hết Hàng</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                    <div className="mt-auto pt-3">
                      <p className="text-lg lg:text-xl font-extrabold text-red-600">
                        {formatPrice(product.price)}
                        <span className="text-xs font-normal text-gray-500 ml-1">/ {product.unit}</span>
                      </p>
                      <div className="mt-2 text-xs flex justify-between items-center">
                        <span className="text-gray-500 truncate pr-2">
                          {APP_CONFIG.PRODUCT_CATEGORIES.find((c) => c.value === product.category)?.label || product.category}
                        </span>
                        {product.stock > 0 && <span className="font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Kho: {product.stock}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded font-medium text-sm transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {showProductModal && selectedProduct && (
        <ProductDetailPage product={selectedProduct} onClose={closeProductModal} quantity={quantity} setQuantity={setQuantity} onBuy={handleBuyNow} />
      )}

      {showPaymentModal && selectedProduct && (
        <PayMent product={selectedProduct} quantity={quantity} onClose={() => setShowPaymentModal(false)} onCheckout={handleCheckout} ordering={ordering} />
      )}
    </div>
  );
};

export default ProductsPage;
