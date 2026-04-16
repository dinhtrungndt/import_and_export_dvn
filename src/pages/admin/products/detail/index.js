import { useEffect, useState } from 'react';
import { FaEdit, FaExclamationTriangle, FaEyeSlash, FaSpinner, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { APP_CONFIG } from '../../../../config';
import { fetchProductById, fetchProducts, hideProduct } from '../../../../stores/redux/actions/adminActions.js';
import { FETCH_PRODUCT_BY_ID_ERROR } from '../../../../stores/redux/actions/types.js';
import EditProductDialog from '../update/index.js';

const ProductDetailDialogAdmin = ({ productId, onClose, onProductHidden }) => {
  const dispatch = useDispatch();
  const { productDetails, productDetailsLoading, productDetailsError } = useSelector((state) => state.adminReducer);
  const [confirmHide, setConfirmHide] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, dispatch]);

  const handleHideProduct = async () => {
    if (!confirmHide) {
      setConfirmHide(true);
      setTimeout(() => setConfirmHide(false), 5000);
      return;
    }
    try {
      await dispatch(hideProduct(productId));
      if (onProductHidden) onProductHidden(productId);
      onClose();
    } catch (err) {
      console.error('Error hiding product:', err);
    }
  };

  const handleEdit = () => setShowEditDialog(true);
  const handleCloseEditDialog = () => setShowEditDialog(false);

  const handleProductUpdated = async () => {
    try {
      dispatch(fetchProducts({ page: 1, limit: 10, sort: 'createdAt', order: 'desc' }));
      setShowEditDialog(false);
      onClose();
    } catch (err) {
      dispatch({ type: FETCH_PRODUCT_BY_ID_ERROR, payload: { message: 'Không thể làm mới thông tin sản phẩm.' } });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-40 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-sm mx-auto z-50">
        <div className="absolute top-2 right-2 z-50">
          <button type="button" className="bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200" onClick={onClose}>
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pt-5 pb-6">
          {productDetailsLoading ? (
            <div className="flex justify-center items-center py-10">
              <FaSpinner className="animate-spin text-blue-600 h-8 w-8" />
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : productDetailsError ? (
            <div className="py-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-4 flex items-center">
                <FaExclamationTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{productDetailsError.message || 'Không thể tải thông tin.'}</p>
              </div>
              <button className="w-full bg-gray-200 py-2 rounded-lg text-gray-800 font-medium" onClick={onClose}>Đóng</button>
            </div>
          ) : !productDetails ? (
            <div className="py-6 text-center text-gray-500">Không tìm thấy thông tin vật liệu.</div>
          ) : (
            <>
              <div className="bg-gray-100 flex items-center justify-center rounded-xl overflow-hidden mb-4 h-48">
                <img
                  src={productDetails.image || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&bold=true&name=${encodeURIComponent(productDetails.name)}`}
                  alt={productDetails.name}
                  className="object-cover h-full w-full"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{productDetails.name}</h3>
                <div className="flex items-end mb-3">
                  <p className="text-2xl font-extrabold text-red-600">{formatPrice(productDetails.price)}</p>
                  <p className="text-sm text-gray-500 ml-1 mb-1">/ {productDetails.unit}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800">
                    {APP_CONFIG.PRODUCT_CATEGORIES.find(c => c.value === productDetails.category)?.label || productDetails.category}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${productDetails.stock > 10 ? 'bg-green-100 text-green-800' : productDetails.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    Tồn kho: {productDetails.stock} {productDetails.unit}
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm border border-gray-100">
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="text-gray-500">Giá nhập (Vốn):</div>
                    <div className="font-semibold text-right">{formatPrice(productDetails.import_price)}</div>
                    <div className="text-gray-500">Mã vật liệu:</div>
                    <div className="font-mono text-xs text-right mt-0.5 text-gray-400 truncate">{productDetails.id?.substring(0, 8).toUpperCase()}</div>
                  </div>
                </div>

                <div className="mb-5">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mô tả chi tiết</h4>
                  <p className="text-sm text-gray-700 bg-white border border-gray-100 p-3 rounded-lg leading-relaxed shadow-sm min-h-[60px]">
                    {productDetails.description || 'Không có mô tả cho vật liệu này.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleEdit} className="flex-1 flex justify-center items-center py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg shadow hover:bg-blue-700 transition">
                  <FaEdit className="mr-2" /> Sửa
                </button>
                <button
                  onClick={handleHideProduct}
                  disabled={productDetailsLoading}
                  className={`flex-1 flex justify-center items-center py-2.5 text-sm font-bold rounded-lg shadow transition ${confirmHide ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {confirmHide ? <FaEyeSlash className="mr-2" /> : <FaEyeSlash className="mr-2 text-gray-500" />}
                  {confirmHide ? 'Chắc chắn ẩn?' : 'Ẩn'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showEditDialog && (
        <EditProductDialog productId={productId} onClose={handleCloseEditDialog} onProductUpdated={handleProductUpdated} />
      )}
    </div>
  );
};

export default ProductDetailDialogAdmin;
