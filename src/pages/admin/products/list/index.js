import { useEffect, useState } from 'react';
import { FaCube, FaEdit, FaEllipsisV, FaEye, FaEyeSlash, FaFilter, FaPlus, FaSearch, FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../../../../config/index.js';
import { useAuth } from '../../../../contexts/AuthContext.js';
import { fetchProducts, hideProduct } from '../../../../stores/redux/actions/adminActions.js';
import ProductDetailDialogAdmin from '../detail/index.js';
import EditProductDialog from '../update/index.js';

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [confirmHide, setConfirmHide] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState(null);

  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const { products = [], loading = false, error = null } = useSelector((state) => state.adminReducer || {});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/admin/list-products' } });
      return;
    }
    if (user?.role !== 'admin' && user?.role !== 'manager') {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const params = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (searchTerm) params.search = searchTerm;
    params.sort = sortField;
    params.order = sortOrder;

    dispatch(fetchProducts(params));
  }, [dispatch, selectedCategory, searchTerm, sortField, sortOrder]);

  useEffect(() => {
    const handleClickOutside = () => setActiveActionMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.search.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleViewProduct = (productId, e) => {
    e.stopPropagation();
    setSelectedProductId(productId);
    setShowProductDetail(true);
    setActiveActionMenu(null);
  };

  const handleEditProduct = (productId, e) => {
    e.stopPropagation();
    setEditProductId(productId);
    setShowEditProduct(true);
    setActiveActionMenu(null);
  };

  const handleCloseProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProductId(null);
  };

  const handleCloseEditProduct = () => {
    setShowEditProduct(false);
    setEditProductId(null);
  };

  // HÀM NÀY ĐÃ ĐƯỢC BỔ SUNG ĐỂ KHẮC PHỤC LỖI NOT DEFINED
  const handleProductHidden = () => {
    const params = {
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      search: searchTerm || undefined,
      sort: sortField,
      order: sortOrder,
    };
    dispatch(fetchProducts(params));
  };

  const handleProductUpdated = () => {
    handleProductHidden();
    setShowEditProduct(false);
    setEditProductId(null);
  };

  const handleHideProduct = async (id, e) => {
    e.stopPropagation();
    if (confirmHide === id) {
      try {
        setIsProcessing(true);
        await dispatch(hideProduct(id));
        handleProductHidden();
        setConfirmHide(null);
      } catch (error) {
        console.error('Failed to hide product:', error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      setConfirmHide(id);
      setTimeout(() => setConfirmHide(null), 3000);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortField('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const toggleActionMenu = (productId, e) => {
    e.stopPropagation();
    setActiveActionMenu(activeActionMenu === productId ? null : productId);
  };

  return (
    <div className="px-2 py-4">
      <div className="flex flex-col mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900">Quản lý VLXD</h1>
          <button
            onClick={() => navigate('/admin/add-products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 text-sm rounded-lg flex items-center"
          >
            <FaPlus className="mr-1" />
            <span className="hidden sm:inline">Thêm vật liệu mới</span>
            <span className="sm:hidden">Thêm</span>
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-3 mb-3">
          <form onSubmit={handleSearch} className="flex mb-2">
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm vật liệu (cát, đá, xi măng...)"
              className="w-full rounded-l-lg border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white rounded-r-lg px-3 py-2 hover:bg-blue-700">
              <FaSearch />
            </button>
          </form>

          <div className="flex justify-between items-center">
            <button onClick={() => setShowFilters(!showFilters)} className="text-blue-600 text-sm flex items-center">
              <FaFilter className="mr-1" /> {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </button>
            {(searchTerm || selectedCategory !== 'all' || sortField !== 'createdAt' || sortOrder !== 'desc') && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Đang lọc</span>
            )}
          </div>

          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Danh mục:</label>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Tất cả
                  </button>
                  {APP_CONFIG.PRODUCT_CATEGORIES.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleCategoryChange(category.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${selectedCategory === category.value ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Sắp xếp theo:</label>
                <div className="grid grid-cols-2 gap-1">
                  <button onClick={() => handleSort('name')} className={`px-2 py-1 text-xs rounded flex items-center justify-center ${sortField === 'name' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
                    Tên {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button onClick={() => handleSort('price')} className={`px-2 py-1 text-xs rounded flex items-center justify-center ${sortField === 'price' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
                    Giá {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button onClick={() => handleSort('stock')} className={`px-2 py-1 text-xs rounded flex items-center justify-center ${sortField === 'stock' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
                    Tồn kho {sortField === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button onClick={() => handleSort('createdAt')} className={`px-2 py-1 text-xs rounded flex items-center justify-center ${sortField === 'createdAt' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
                    Ngày tạo {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>
              <button onClick={resetFilters} className="mt-1 text-blue-600 text-xs underline">Xóa bộ lọc</button>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-sm text-gray-600 font-medium">Đang tải...</span>
        </div>
      )}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto">
                <FaCube className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-3 text-base font-medium text-gray-900">Không tìm thấy vật liệu</h3>
              <p className="mt-2 text-sm text-gray-500">Hãy thử thay đổi bộ lọc hoặc thêm vật liệu mới.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {currentItems.map((product) => (
                <div key={product._id} onClick={(e) => handleEditProduct(product._id, e)} className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-all relative">
                  <div className="relative">
                    <img
                      src={product.image || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&bold=true&name=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      className="w-full h-36 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">{product.name}</h3>
                    <p className="text-base font-bold text-red-600 mt-1.5">{formatPrice(product.price)} <span className="text-xs font-normal text-gray-500">/ {product.unit}</span></p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md truncate max-w-[80px]">
                        {APP_CONFIG.PRODUCT_CATEGORIES.find((c) => c.value === product.category)?.label || product.category}
                      </span>
                      {product.stock <= 0 ? (
                        <span className="text-xs text-white bg-red-500 px-1.5 py-0.5 rounded-md font-medium">Hết hàng</span>
                      ) : product.stock < 10 ? (
                        <span className="text-xs text-white bg-amber-500 px-1.5 py-0.5 rounded-md font-medium flex items-center">Còn {product.stock}</span>
                      ) : (
                        <span className="text-xs text-white bg-green-500 px-1.5 py-0.5 rounded-md font-medium">Còn hàng</span>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <button onClick={(e) => toggleActionMenu(product._id, e)} className="absolute bottom-2 right-2 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 bg-white shadow-sm">
                      <FaEllipsisV size={14} />
                    </button>
                    {activeActionMenu === product._id && (
                      <div className="absolute right-2 bottom-full mb-1 w-36 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-100">
                        <button onClick={(e) => handleViewProduct(product._id, e)} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <FaEye className="mr-2 text-blue-500" /> Xem chi tiết
                        </button>
                        <button onClick={(e) => handleEditProduct(product._id, e)} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <FaEdit className="mr-2 text-indigo-500" /> Chỉnh sửa
                        </button>
                        <button onClick={(e) => handleHideProduct(product._id, e)} className={`w-full px-3 py-2 text-left text-sm flex items-center ${confirmHide === product._id ? 'text-red-700 bg-red-50' : 'text-gray-700 hover:bg-gray-100'}`}>
                          {isProcessing && confirmHide === product._id ? <FaSpinner className="animate-spin mr-2 text-red-500" /> : <FaEyeSlash className="mr-2 text-red-500" />}
                          {confirmHide === product._id ? 'Xác nhận ẩn?' : 'Ẩn VLXD'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 bg-white p-3 rounded-lg shadow">
              <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'}`}>
                Trước
              </button>
              <span className="text-sm text-gray-600">Trang {currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className={`px-3 py-1 rounded text-sm ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'}`}>
                Sau
              </button>
            </div>
          )}
        </>
      )}

      {showProductDetail && selectedProductId && (
        <ProductDetailDialogAdmin productId={selectedProductId} onClose={handleCloseProductDetail} onProductHidden={handleProductHidden} />
      )}
      {showEditProduct && editProductId && (
        <EditProductDialog productId={editProductId} onClose={handleCloseEditProduct} onProductUpdated={handleProductUpdated} />
      )}
    </div>
  );
};

export default AdminProductsPage;
