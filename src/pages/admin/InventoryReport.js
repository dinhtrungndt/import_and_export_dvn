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
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-3"><FaBoxOpen className="text-blue-500" /></div>
            <div>
              <p className="text-sm text-gray-500">Mã vật liệu</p>
              <p className="text-lg font-semibold">{inventoryReport.summary.totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-3"><FaBoxOpen className="text-green-500" /></div>
            <div>
              <p className="text-sm text-gray-500">Giá trị tồn kho</p>
              <p className="text-lg font-semibold">{formatCurrency(inventoryReport.summary.totalValue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-3"><FaExclamationTriangle className="text-yellow-500" /></div>
            <div>
              <p className="text-sm text-gray-500">Sắp hết hàng</p>
              <p className="text-lg font-semibold">{inventoryReport.summary.lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-3"><FaExclamationTriangle className="text-red-500" /></div>
            <div>
              <p className="text-sm text-gray-500">Hết hàng</p>
              <p className="text-lg font-semibold">{inventoryReport.summary.outOfStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Tồn kho theo danh mục</h2>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng mã</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng số lượng tồn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá trị tồn</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(inventoryReport.categoryStats).map(([category, stats]) => (
                <tr key={category}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getCategoryLabel(category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.count} mã</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{stats.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(stats.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-lg font-semibold">Danh sách vật liệu tồn kho</h2>
          <div className="flex flex-wrap space-x-2 items-center">
            <div className="relative">
              <input
                type="text" placeholder="Tìm kiếm vật liệu..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <select
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[150px]"
              value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {APP_CONFIG.PRODUCT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowHiddenProducts(!showHiddenProducts)}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${showHiddenProducts ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {showHiddenProducts ? <FaEye className="mr-1" /> : <FaEyeSlash className="mr-1" />}
              {showHiddenProducts ? 'Đang hiện kho ẩn' : 'Kho ẩn'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vật liệu</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá vốn</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá trị</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                {showHiddenProducts && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {showHiddenProducts ? (
                hiddenProductsLoading ? (
                  <tr><td colSpan="7" className="text-center py-4"><FaSpinner className="animate-spin inline mr-2 text-blue-500" /> Đang tải...</td></tr>
                ) : filteredHiddenProducts.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-4 text-gray-500">Không có vật liệu nào bị ẩn</td></tr>
                ) : (
                  filteredHiddenProducts.map((product) => (
                    <tr key={product._id} className="bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{getCategoryLabel(product.category)}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatCurrency(product.import_price || product.price)}</td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-700">{product.stock} {product.unit}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatCurrency((product.import_price || product.price) * product.stock)}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Đã ẩn</span></td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleRestoreProduct(product._id)} disabled={restoringProductId === product._id} className="text-green-600 flex items-center hover:underline">
                          {restoringProductId === product._id ? <FaSpinner className="animate-spin mr-1" /> : <FaEye className="mr-1" />} Khôi phục
                        </button>
                      </td>
                    </tr>
                  ))
                )
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-gray-500">Không tìm thấy vật liệu nào</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">{getCategoryLabel(product.category)}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatCurrency(product.import_price || product.price)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-700">{product.stock} {product.unit}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatCurrency((product.import_price || product.price) * product.stock)}</td>
                    <td className="px-4 py-3">
                      {product.stock <= 0 ? <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Hết hàng</span> :
                        product.stock < 10 ? <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">Sắp hết</span> :
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Còn hàng</span>}
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
