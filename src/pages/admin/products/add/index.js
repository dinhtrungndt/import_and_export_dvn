import JoditEditor from 'jodit-react';
import { useEffect, useState } from 'react';
import { FaBoxOpen, FaCamera, FaDollarSign, FaLayerGroup, FaPencilAlt, FaSave, FaSpinner, FaTag, FaTimes, FaUpload } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../../../../config';
import { useAuth } from '../../../../contexts/AuthContext';
import { createProduct } from '../../../../stores/redux/actions/adminActions.js';

const AddProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const { productsLoading, productsError, productSuccess } = useSelector((state) => state.adminReducer);

  // Cập nhật State cho VLXD (Thay weight bằng unit, bỏ featured/canBeGift)
  const [formData, setFormData] = useState({
    name: '',
    category: 'cat-san-lap',
    sub_category: '',
    unit: 'Khối',
    importPrice: '',
    price: '',
    description: '',
    stock: '',
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (productSuccess) {
      setTimeout(() => {
        setFormData({
          name: '',
          category: 'cat-san-lap',
          sub_category: '',
          unit: 'Khối',
          importPrice: '',
          price: '',
          description: '',
          stock: '',
          image: null,
        });
        setPreviewImage(null);
        dispatch({ type: 'RESET_PRODUCT_SUCCESS' });
      }, 2000);
    }
  }, [productSuccess, dispatch]);

  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/login', { state: { from: '/admin/list-products' } });
    return null;
  }

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
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      if (formData.image) {
        data.append('image_file', formData.image);
      }

      await dispatch(createProduct(data));
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 px-4 py-6">
      <div className="max-w-lg mx-auto">
        {productsError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md animate-pulse">
            <div className="flex items-start">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi!</h3>
                <p className="text-sm text-red-700 mt-1">{productsError.detail || productsError.message || 'Đã xảy ra lỗi khi thêm sản phẩm'}</p>
              </div>
            </div>
          </div>
        )}
        {productSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md animate-pulse">
            <div className="flex items-start">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Thành công!</h3>
                <p className="text-sm text-green-700 mt-1">Đã thêm vật liệu xây dựng thành công!</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-blue-600 text-white p-4 flex items-center justify-center">
            <FaTag className="mr-2 text-white text-lg" />
            <h2 className="text-lg font-medium">Thêm Vật Liệu Xây Dựng</h2>
          </div>

          <div className="p-5 space-y-5">
            <div className="form-group">
              <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Tên vật liệu
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Cát san lấp, Xi măng Hà Tiên..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaLayerGroup className="mr-2 text-blue-500" /> Danh mục
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  {APP_CONFIG.PRODUCT_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="unit" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Đơn vị tính
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                <label htmlFor="importPrice" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaDollarSign className="mr-2 text-blue-500" /> Giá vốn (VND)
                </label>
                <input
                  type="number"
                  id="importPrice"
                  name="importPrice"
                  value={formData.importPrice}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Giá nhập vào"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaDollarSign className="mr-2 text-blue-500" /> Giá bán (VND)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Giá bán ra"
                  required
                />
              </div>
            </div>

            {formData.importPrice && formData.price && (
              <div className="form-group">
                <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-800 mb-1">Lợi nhuận dự kiến:</p>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">{profit.amount} / {formData.unit}</span>
                    <span className="text-sm font-medium bg-green-100 px-2 py-0.5 rounded-full text-green-800">
                      {profit.percent}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="stock" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaBoxOpen className="mr-2 text-blue-500" /> Tồn kho ban đầu
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Nhập số lượng (${formData.unit})`}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaPencilAlt className="mr-2 text-blue-500" /> Ghi chú / Mô tả
              </label>
              <div className="bg-white rounded-lg pb-4">
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
                    buttons: ['source', '|', 'bold', 'italic', 'underline', 'strikethrough', '|', 'ul', 'ol', '|', 'outdent', 'indent', '|', 'font', 'fontsize', 'brush', 'paragraph', '|', 'image', 'table', 'link', '|', 'align', 'undo', 'redo', '|', 'hr', 'eraser', 'fullsize']
                  }}
                  tabIndex={1}
                  onBlur={newContent => handleInputChange({ target: { name: 'description', value: newContent } })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaCamera className="mr-2 text-blue-500" /> Hình ảnh thực tế
              </label>
              {!previewImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
                  onClick={() => document.getElementById('image').click()}>
                  <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Nhấp để tải ảnh lên</p>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </div>
              ) : (
                <div className="relative border rounded-lg overflow-hidden">
                  <img src={previewImage} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPreviewImage(null); setFormData(prev => ({ ...prev, image: null })); }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/list-products')}
              className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={productsLoading}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 ${productsLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {productsLoading ? <><FaSpinner className="animate-spin mr-2" /> Đang lưu...</> : <><FaSave className="mr-2" /> Lưu sản phẩm</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
