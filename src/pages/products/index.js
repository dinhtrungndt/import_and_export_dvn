import { useEffect, useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
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
  const [itemsPerPage] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [ordering, setOrdering] = useState(false);

  const { products = [], loading = false, error = null } = useSelector((state) => state.adminReducer || {});

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products` } });
      return;
    }
    if (!selectedProduct || selectedProduct.stock < quantity) {
      toast.error(`Sản phẩm không đủ số lượng. Hiện có ${selectedProduct?.stock || 0} sản phẩm.`);
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
        shipping_fee: 0 // Có thể tùy biến sau
      };

      await dispatch(createOrder(orderData));
      toast.success('Đặt hàng thành công!');
      setShowPaymentModal(false);
      closeProductModal();
      dispatch(fetchProducts()); // Refresh kho
    } catch (err) {
      toast.error(err.response?.data?.detail || err.message || 'Lỗi đặt hàng!');
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Báo Giá Vật Liệu Xây Dựng</h1>

      {/* Tìm kiếm & Lọc */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <form onSubmit={handleSearch} className="flex mb-4">
          <input
            type="text"
            name="search"
            placeholder="Tìm theo tên vật liệu..."
            className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            defaultValue={searchTerm}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
            <FaSearch />
          </button>
        </form>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Danh mục:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Tất cả
              </button>
              {APP_CONFIG.PRODUCT_CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategory === cat.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sắp xếp:</label>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border rounded-md py-1.5 px-3 text-sm focus:outline-none"
            >
              <option value="createdAt_desc">Mới nhất</option>
              <option value="price_asc">Giá: Thấp đến cao</option>
              <option value="price_desc">Giá: Cao đến thấp</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentItems.map(product => (
            <div key={product._id} onClick={() => openProductModal(product)} className="bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition p-3">
              <img
                src={product.image || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&bold=true&name=${encodeURIComponent(product.name)}`}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-3 text-sm font-medium text-gray-900 line-clamp-2 h-10">{product.name}</h3>
              <p className="text-lg font-bold text-red-600 mt-1">{formatPrice(product.price)}<span className="text-xs text-gray-500 font-normal">/{product.unit}</span></p>
              <div className="mt-2 text-xs">
                {product.stock <= 0 ? (
                  <span className="text-red-600 font-medium">Hết hàng</span>
                ) : (
                  <span className="text-green-600 font-medium">Còn {product.stock} {product.unit}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Trước</button>
          <span className="px-3 py-1">Trang {currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Sau</button>
        </div>
      )}

      {showProductModal && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          onClose={closeProductModal}
          quantity={quantity}
          setQuantity={setQuantity}
          onBuy={handleBuyNow}
        />
      )}

      {showPaymentModal && selectedProduct && (
        <PayMent
          product={selectedProduct}
          quantity={quantity}
          onClose={() => setShowPaymentModal(false)}
          onCheckout={handleCheckout}
          ordering={ordering}
        />
      )}
    </div>
  );
};

export default ProductsPage;
