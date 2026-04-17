import { useEffect, useState, useRef, useMemo } from 'react';
import { FaBoxOpen, FaCamera, FaDollarSign, FaLayerGroup, FaPencilAlt, FaSave, FaSpinner, FaTag, FaTimes, FaTrash, FaUpload } from 'react-icons/fa';
import JoditEditor from 'jodit-react';
import { useDispatch, useSelector } from 'react-redux';
import { APP_CONFIG } from '../../../../config';
import { fetchProductById, updateProduct } from '../../../../stores/redux/actions/adminActions.js';

const EditProductDialog = ({ productId, onClose, onProductUpdated }) => {
  const dispatch = useDispatch();

  const { productDetails, productDetailsLoading, productDetailsError } = useSelector(
    (state) => state.adminReducer
  );

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sub_category: '',
    unit: 'Khối',
    importPrice: '',
    price: '',
    description: '',
    stock: '',
  });
  const [originalImage, setOriginalImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [deleteImageMode, setDeleteImageMode] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  // Cập nhật form khi dữ liệu sản phẩm được load từ Redux
  useEffect(() => {
    if (productDetails) {
      setFormData({
        name: productDetails.name || '',
        category: productDetails.category || 'cat_san_lap',
        sub_category: productDetails.sub_category || '',
        unit: productDetails.unit || 'Khối',
        importPrice: productDetails.import_price || '',
        price: productDetails.price || '',
        description: productDetails.description || '',
        stock: productDetails.stock || '',
      });

      if (productDetails.image) {
        setOriginalImage(productDetails.image);
        setPreviewImage(productDetails.image);
      }
    }
  }, [productDetails]);

  // Cập nhật error từ Redux store
  useEffect(() => {
    if (productDetailsError) {
      setError(productDetailsError.message || 'Không thể tải thông tin sản phẩm');
    }
  }, [productDetailsError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setDeleteImageMode(false);
    }
  };

  const handleRemoveImage = () => {
    setDeleteImageMode(true);
    setNewImage(null);
    setPreviewImage(null);
  };

  const handleRestoreImage = () => {
    setDeleteImageMode(false);
    setNewImage(null);
    setPreviewImage(originalImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      if (formData.sub_category) data.append('sub_category', formData.sub_category);
      data.append('unit', formData.unit);
      data.append('import_price', parseFloat(formData.importPrice));
      data.append('price', parseFloat(formData.price));
      data.append('description', formData.description);
      data.append('stock', parseFloat(formData.stock));

      if (newImage) {
        data.append('image_file', newImage);
      } else if (deleteImageMode) {
        data.append('delete_image', true);
      }

      await dispatch(updateProduct(productId, data));
      setSuccess(true);
      setTimeout(() => {
        if (onProductUpdated) onProductUpdated();
        onClose();
      }, 500);
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message || 'Đã xảy ra lỗi khi cập nhật sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price);
  };

  // Tính lợi nhuận dự kiến
  const calculateProfit = () => {
    if (formData.importPrice && formData.price) {
      const importPrice = parseFloat(formData.importPrice);
      const salePrice = parseFloat(formData.price);
      if (!isNaN(importPrice) && !isNaN(salePrice)) {
        const profit = salePrice - importPrice;
        const profitPercent = (profit / importPrice) * 100;
        return {
          amount: formatPrice(profit),
          percent: profitPercent.toFixed(2)
        };
      }
    }
    return { amount: '-', percent: '-' };
  };

  const profit = calculateProfit();
  const stopPropagation = (e) => e.stopPropagation();

  if (productDetailsLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-lg mx-3" onClick={stopPropagation}>
          <div className="text-center">
            <FaSpinner className="mx-auto h-6 w-6 text-blue-600 animate-spin" />
            <p className="mt-2 text-xs sm:text-sm text-gray-600">Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto px-2 py-2" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto my-2 max-h-[90vh] overflow-y-auto" onClick={stopPropagation}>
        {error && (
          <div className="m-2 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md animate-pulse">
            <div className="flex items-start">
              <div className="ml-2">
                <h3 className="text-xs font-medium text-red-800">Lỗi!</h3>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        {success && (
          <div className="m-2 p-3 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md animate-pulse">
            <div className="flex items-start">
              <div className="ml-2">
                <h3 className="text-xs font-medium text-green-800">Thành công!</h3>
                <p className="text-xs text-green-700 mt-1">Cập nhật vật liệu xây dựng thành công!</p>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="bg-blue-600 text-white p-3 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center">
              <FaPencilAlt className="mr-1.5 text-white text-sm sm:text-base" />
              <h2 className="text-base sm:text-lg font-medium">Cập nhật Vật liệu</h2>
            </div>
            <button type="button" onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none p-1">
              <FaTimes className="text-sm sm:text-base" />
            </button>
          </div>
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="form-group">
              <label htmlFor="name" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                <FaTag className="mr-1.5 text-blue-500 text-xs" /> Tên vật liệu
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="category" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  <FaLayerGroup className="mr-1.5 text-blue-500 text-xs" /> Danh mục
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  {APP_CONFIG.PRODUCT_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="unit" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Đơn vị tính
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="Khối">Khối (m3)</option>
                  <option value="Bao">Bao</option>
                  <option value="Kg">Kg</option>
                  <option value="Tấn">Tấn</option>
                  <option value="Viên">Viên</option>
                  <option value="Cây">Cây (Sắt thép)</option>
                  <option value="Cuộn">Cuộn</option>
                  <option value="Cái">Cái</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="importPrice" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  <FaDollarSign className="mr-1.5 text-blue-500 text-xs" /> Giá vốn (VND)
                </label>
                <input
                  type="number"
                  id="importPrice"
                  name="importPrice"
                  value={formData.importPrice}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  <FaDollarSign className="mr-1.5 text-blue-500 text-xs" /> Giá bán (VND)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {formData.importPrice && formData.price && (
              <div className="form-group">
                <div className="bg-green-50 border border-green-100 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-medium text-green-800 mb-1">Lợi nhuận dự kiến:</p>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-green-700">{profit.amount} / {formData.unit}</span>
                    <span className="text-xs sm:text-sm font-medium bg-green-100 px-2 py-0.5 rounded-full text-green-800">{profit.percent}%</span>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="stock" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                <FaBoxOpen className="mr-1.5 text-blue-500 text-xs" /> Tồn kho
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="form-group pb-10">
              <label htmlFor="description" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                <FaPencilAlt className="mr-1.5 text-blue-500 text-xs" /> Ghi chú
              </label>
              <div className="bg-white rounded-lg">
                <JoditEditor
                  value={formData.description}
                  config={{
                    readonly: false,
                    placeholder: 'Mô tả chất lượng, nguồn gốc xuất xứ, cấu trúc bảng...',
                    height: 350,
                    toolbarAdaptive: false,
                    askBeforePasteFromWord: false,
                    askBeforePasteHTML: false,
                    defaultActionOnPaste: 'insert_as_html',
                    buttons: ['source', '|', 'bold', 'italic', 'underline', 'strikethrough', '|', 'ul', 'ol', '|', 'outdent', 'indent',  '|', 'font', 'fontsize', 'brush', 'paragraph', '|', 'image', 'table', 'link', '|', 'align', 'undo', 'redo', '|', 'hr', 'eraser', 'fullsize']
                  }}
                  tabIndex={1}
                  onBlur={newContent => handleInputChange({ target: { name: 'description', value: newContent } })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                <FaCamera className="mr-1.5 text-blue-500 text-xs" /> Hình ảnh thực tế
              </label>
              {!previewImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 transition-all"
                  onClick={() => document.getElementById('image').click()}>
                  <FaUpload className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mb-1.5" />
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Nhấp để tải ảnh lên</p>
                  {deleteImageMode && originalImage && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleRestoreImage(); }}
                      className="mt-2 inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                    >
                      Khôi phục ảnh cũ
                    </button>
                  )}
                  <input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                </div>
              ) : (
                <div className="relative border rounded-lg overflow-hidden">
                  <img src={previewImage} alt="Preview" className="w-full h-28 sm:h-36 object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 flex flex-row gap-2 border-t rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 flex items-center justify-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-blue-600 text-white text-xs sm:text-sm font-medium shadow-sm hover:bg-blue-700 focus:outline-none ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? <><FaSpinner className="animate-spin mr-1.5 h-3 w-3 sm:h-4 sm:w-4" /> Đang cập nhật...</> : <><FaSave className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" /> Lưu thay đổi</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductDialog;
