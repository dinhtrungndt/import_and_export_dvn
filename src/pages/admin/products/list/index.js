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
  const [itemsPerPage] = useState(22);
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
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <FaCube className="mr-3 text-blue-600" />
            Quản lý Vật Liệu
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Quản lý kho hàng, giá bán và tình trạng vật tư</p>
        </div>
        <button
          onClick={() => navigate('/admin/add-products')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <FaPlus className="mr-2" />
          <span>Thêm vật liệu mới</span>
        </button>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-4 md:p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm vật liệu (cát, đá, xi măng...)"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
            <button type="submit" className="hidden">Tìm</button>
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              <FaFilter /> {showFilters ? 'Ẩn bộ lọc' : 'Lọc & Sắp xếp'}
              {(searchTerm || selectedCategory !== 'all' || sortField !== 'createdAt' || sortOrder !== 'desc') && (
                <span className="flex h-2.5 w-2.5 relative ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
              )}
            </button>
            {(searchTerm || selectedCategory !== 'all' || sortField !== 'createdAt' || sortOrder !== 'desc') && (
               <button onClick={resetFilters} className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors px-2">
                 Xóa lọc
               </button>
            )}
          </div>
        </div>

        {/* Enhanced Filter Panel */}
        {showFilters && (
          <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Danh mục sản phẩm</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'all' ? 'bg-gray-800 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Tất cả
                </button>
                {APP_CONFIG.PRODUCT_CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === category.value ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6 pt-5 lg:pt-0">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sắp xếp theo</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { field: 'createdAt', label: 'Ngày tạo' },
                  { field: 'name', label: 'Tên vật liệu' },
                  { field: 'price', label: 'Giá bán' },
                  { field: 'stock', label: 'Tồn kho' }
                ].map(item => (
                  <button 
                    key={item.field}
                    onClick={() => handleSort(item.field)} 
                    className={`px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-all ${sortField === item.field ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {item.label}
                    {sortField === item.field && (
                      <span className="text-blue-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-b-blue-600"></div>
          <span className="mt-4 text-gray-500 font-medium">Đang tải dữ liệu...</span>
        </div>
      )}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-gray-50 rounded-full p-4 mb-4">
                <FaCube className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Không tìm thấy vật liệu nào</h3>
              <p className="text-gray-500 max-w-sm">Không có dữ liệu khớp với bộ lọc hiện tại của bạn. Hãy thử thay đổi từ khóa hoặc thêm sản phẩm mới.</p>
              <button onClick={resetFilters} className="mt-4 text-blue-600 font-medium hover:underline">Xóa tất cả bộ lọc</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {currentItems.map((product) => (
                <div key={product.id} onClick={(e) => handleEditProduct(product.id, e)} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible cursor-pointer hover:shadow-lg transition-all duration-300 group flex flex-col relative">
                  
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-t-2xl">
                    <img
                      src={product.image || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&bold=true&name=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Status badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.stock <= 0 ? (
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-red-500 rounded-md shadow-sm">Hết hàng</span>
                      ) : product.stock < 10 ? (
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-400 rounded-md shadow-sm">Sắp hết ({product.stock})</span>
                      ) : (
                         <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-green-800 bg-green-400 rounded-md shadow-sm">Sẵn sàng</span>
                      )}
                    </div>

                    <button onClick={(e) => toggleActionMenu(product.id, e)} className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-700 bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <FaEllipsisV size={14} />
                    </button>
                  </div>

                  {/* Action Dropdown - outside overflow-hidden to avoid clipping */}
                  {activeActionMenu === product.id && (
                    <div className="absolute right-3 top-10 w-44 bg-white rounded-xl shadow-2xl z-50 py-1.5 border border-gray-100" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => handleViewProduct(product.id, e)} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors">
                        <FaEye className="mr-2 text-blue-500" /> Xem chi tiết
                      </button>
                      <button onClick={(e) => handleEditProduct(product.id, e)} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center transition-colors">
                        <FaEdit className="mr-2 text-indigo-500" /> Chỉnh sửa
                      </button>
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button onClick={(e) => handleHideProduct(product.id, e)} className={`w-full px-4 py-2.5 text-left text-sm flex items-center transition-colors ${confirmHide === product.id ? 'text-red-700 bg-red-50 font-medium' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'}`}>
                        {isProcessing && confirmHide === product.id ? <FaSpinner className="animate-spin mr-2 text-red-500" /> : <FaEyeSlash className="mr-2 text-red-400" />}
                        {confirmHide === product.id ? 'Xác nhận ẩn?' : 'Ẩn vật liệu'}
                      </button>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1 line-clamp-1">
                      {APP_CONFIG.PRODUCT_CATEGORIES.find((c) => c.value === product.category)?.label || product.category}
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                    
                    <div className="mt-auto pt-2 border-t border-gray-50 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium mb-0.5">GIÁ BÁN</p>
                        <p className="text-lg font-bold text-red-600 leading-none">{formatPrice(product.price)} <span className="text-xs font-medium text-gray-500">/{product.unit}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Elegant Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-sm font-medium text-gray-500">
                Hiển thị <span className="text-gray-900 font-bold">{indexOfFirstItem + 1}</span> - <span className="text-gray-900 font-bold">{Math.min(indexOfLastItem, products.length)}</span> trong số <span className="text-gray-900 font-bold">{products.length}</span> vật liệu
              </span>
              
              <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button 
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} 
                  disabled={currentPage === 1} 
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed hidden sm:block' : 'text-gray-700 bg-white shadow-sm hover:text-blue-600 hover:shadow'}`}
                >
                  Trước
                </button>
                
                <div className="flex items-center justify-center min-w-[4rem] px-2 bg-white rounded-lg py-1.5 shadow-sm border border-gray-100 mx-1">
                  <span className="text-sm font-bold text-blue-600">{currentPage}</span>
                  <span className="text-sm text-gray-400 mx-1.5">/</span>
                  <span className="text-sm font-medium text-gray-600">{totalPages}</span>
                </div>

                <button 
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} 
                  disabled={currentPage === totalPages} 
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed hidden sm:block' : 'text-gray-700 bg-white shadow-sm hover:text-blue-600 hover:shadow'}`}
                >
                  Sau
                </button>
              </div>
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
