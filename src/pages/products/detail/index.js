import { FaMinus, FaPlus, FaShoppingCart, FaTimes } from 'react-icons/fa';

const ProductDetailPage = ({ product, onClose, quantity, setQuantity, onBuy }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-40 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto z-50 overflow-hidden">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:bg-gray-100 p-2 rounded-full z-10">
          <FaTimes />
        </button>

        <div className="p-5">
          <div className="bg-gray-100 rounded-lg mb-4 flex justify-center h-48 overflow-hidden">
            <img src={product.image || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&name=${encodeURIComponent(product.name)}`} alt={product.name} className="object-cover h-full w-full" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h2>
          <div className="flex items-end mb-3">
            <span className="text-2xl font-bold text-red-600">{formatPrice(product.price)}</span>
            <span className="text-gray-500 ml-1 mb-1">/ {product.unit}</span>
          </div>

          <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded">
            <p><strong>Danh mục:</strong> {product.category}</p>
            <p><strong>Tồn kho:</strong> {product.stock > 0 ? `${product.stock} ${product.unit}` : <span className="text-red-500">Đang tạm hết</span>}</p>
          </div>

          {product.description && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-1">Mô tả vật liệu:</h4>
              <p className="text-sm text-gray-600 border p-2 rounded max-h-24 overflow-y-auto">{product.description}</p>
            </div>
          )}

          {product.stock > 0 && (
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium">Khối lượng / Số lượng:</span>
              <div className="flex items-center border rounded">
                <button type="button" className="p-2 hover:bg-gray-100 text-gray-600" onClick={() => setQuantity(q => Math.max(1, q - 1))}><FaMinus size={12} /></button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))} className="w-16 text-center focus:outline-none border-x font-medium" />
                <button type="button" className="p-2 hover:bg-gray-100 text-gray-600" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}><FaPlus size={12} /></button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {product.stock > 0 ? (
              <button onClick={onBuy} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex justify-center items-center">
                <FaShoppingCart className="mr-2" /> Đặt Hàng Ngay
              </button>
            ) : (
              <button disabled className="flex-1 bg-gray-300 text-gray-500 py-3 rounded-lg font-bold cursor-not-allowed">
                Tạm Hết Hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
