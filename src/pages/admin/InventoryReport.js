import { useEffect, useState } from 'react';
import { FaBoxOpen, FaExclamationTriangle, FaEye, FaEyeSlash, FaSearch, FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { APP_CONFIG } from '../../config';
import { fetchHiddenProducts, fetchInventoryReport, fetchRestoreProducts } from '../../stores/redux/actions/adminActions.js';

const InventoryReport = () => {
  const dispatch = useDispatch();
  const { reports, loading, error, hiddenProducts, hiddenProductsLoading, restoringProductId } = useSelector((state) => state.adminReducer);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showHiddenProducts, setShowHiddenProducts] = useState(false);

  useEffect(() => {
    dispatch(fetchInventoryReport({
      category: filterCategory !== 'all' ? filterCategory : undefined,
      isActive: true
    }));
  }, [dispatch, filterCategory]);

  useEffect(() => {
    if (showHiddenProducts) dispatch(fetchHiddenProducts());
  }, [dispatch, showHiddenProducts]);

  const handleRestoreProduct = (productId) => {
    dispatch(fetchRestoreProducts(productId)).then(() => {
      toast.success('Đã khôi phục vật liệu thành công');
    }).catch(() => {
      toast.error('Không thể khôi phục vật liệu');
    });
  };

  const inventoryReport = reports?.inventory || {
    products: [],
    summary: { totalProducts: 0, totalValue: 0, lowStockCount: 0, outOfStockCount: 0 },
    categoryStats: {},
  };

  const filteredProducts = inventoryReport.products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) && product.isActive !== false
  );

  const filteredHiddenProducts = (hiddenProducts || []).filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const getCategoryLabel = (catValue) => {
    const category = APP_CONFIG.PRODUCT_CATEGORIES.find(c => c.value === catValue);
    return category ? category.label : catValue;
  };

  if (loading && !showHiddenProducts) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="mt-3 text-sm text-gray-500">Đang tải báo cáo...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo Tồn kho</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi tình trạng và giá trị vật tư trong kho</p>
        </div>
        <div className="text-sm text-gray-500">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-indigo-50 p-3 rounded-lg mr-4 text-indigo-600">
             <FaBoxOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Mã vật liệu</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{inventoryReport.summary.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-blue-50 p-3 rounded-lg mr-4 text-blue-600">
             <FaBoxOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Giá trị tồn kho</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{formatCurrency(inventoryReport.summary.totalValue)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-amber-50 p-3 rounded-lg mr-4 text-amber-600">
             <FaExclamationTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Sắp hết hàng</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{inventoryReport.summary.lowStockCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow flex items-center">
          <div className="bg-red-50 p-3 rounded-lg mr-4 text-red-600">
             <FaExclamationTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Hết hàng</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{inventoryReport.summary.outOfStockCount}</p>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-800">Tồn kho theo danh mục</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Số lượng mã</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tổng số lượng tồn</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá trị tồn</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {Object.entries(inventoryReport.categoryStats).map(([category, stats]) => (
                <tr key={category} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700">
                      {getCategoryLabel(category)}
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-500">{stats.count} mã</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{stats.stock}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">{formatCurrency(stats.value)}</td>
                </tr>
              ))}
              {Object.keys(inventoryReport.categoryStats).length === 0 && (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-gray-500 text-sm">Chưa có dữ liệu thống kê.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-base font-bold text-gray-800">Chi tiết sản phẩm</h2>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text" 
                placeholder="Tìm tên vật liệu..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <select
              className="w-full sm:w-48 border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow"
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {APP_CONFIG.PRODUCT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowHiddenProducts(!showHiddenProducts)}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${showHiddenProducts ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              {showHiddenProducts ? <FaEye className="mr-2" /> : <FaEyeSlash className="mr-2 text-red-500" />}
              {showHiddenProducts ? 'Đang hiện Kho Ẩn' : 'Kho vật liệu ẩn'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vật liệu</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá nhập/vốn</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tồn kho</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá trị</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                {showHiddenProducts && <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {showHiddenProducts ? (
                hiddenProductsLoading ? (
                  <tr><td colSpan="7" className="text-center py-8"><FaSpinner className="animate-spin inline mr-2 text-blue-500 h-5 w-5" /> <span className="text-sm text-gray-500">Đang tải...</span></td></tr>
                ) : filteredHiddenProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-sm text-gray-500">Không có vật liệu nào bị ẩn</td>
                  </tr>
                ) : (
                  filteredHiddenProducts.map((product) => (
                    <tr key={product.id} className="bg-red-50/50 hover:bg-red-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-semibold text-gray-900">{product.name}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 border border-gray-200">
                          {getCategoryLabel(product.category)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">{formatCurrency(product.import_price || product.price)}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-900">{product.stock} <span className="text-xs text-gray-400 font-normal">{product.unit}</span></td>
                      <td className="px-5 py-3 text-sm text-gray-500">{formatCurrency((product.import_price || product.price) * product.stock)}</td>
                      <td className="px-5 py-3"><span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">Đã ẩn</span></td>
                      <td className="px-5 py-3">
                        <button 
                          onClick={() => handleRestoreProduct(product.id)} 
                          disabled={restoringProductId === product.id} 
                          className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-green-600 hover:text-white hover:bg-green-600 hover:border-green-600 flex items-center transition-colors"
                        >
                          {restoringProductId === product.id ? <FaSpinner className="animate-spin mr-1.5" /> : <FaEye className="mr-1.5" />} 
                          Khôi phục
                        </button>
                      </td>
                    </tr>
                  ))
                )
              ) : filteredProducts.length === 0 ? (
                <tr>
                   <td colSpan="6" className="text-center py-12 text-sm text-gray-500">Không tìm thấy vật liệu nào</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900">{product.name}</td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700">
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500 font-medium">{formatCurrency(product.import_price || product.price)}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900">{product.stock} <span className="text-xs text-gray-400 font-normal">{product.unit}</span></td>
                    <td className="px-5 py-3 text-sm font-semibold text-blue-600">{formatCurrency((product.import_price || product.price) * product.stock)}</td>
                    <td className="px-5 py-3">
                      {product.stock <= 0 ? 
                        <span className="px-2.5 py-1 text-xs font-medium rounded bg-red-100 text-red-700">Hết hàng</span> :
                        product.stock < 10 ? 
                        <span className="px-2.5 py-1 text-xs font-medium rounded bg-amber-100 text-amber-800">Sắp hết</span> :
                        <span className="px-2.5 py-1 text-xs font-medium rounded bg-green-100 text-green-700">Còn hàng</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;
