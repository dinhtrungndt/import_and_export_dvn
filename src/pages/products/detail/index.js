import { FaMinus, FaPlus, FaShieldAlt, FaShoppingCart, FaTimes, FaTruck } from 'react-icons/fa';

const ProductDetailPage = ({ product, onClose, quantity, setQuantity, onBuy }) => {
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Nền xám mờ */}
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Box Modal Responsive (Max rộng trên màn hình to) */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto z-50 flex flex-col md:flex-row overflow-hidden animate-fade-in-up my-auto">

        {/* Nút Đóng */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-gray-200 text-gray-700 p-2 rounded-full shadow-sm transition">
          <FaTimes size={18} />
        </button>

        {/* Cột Trái: Ảnh (Chiếm 50% width trên desktop) */}
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative min-h-[250px] md:min-h-full">
          <img
            src={product.image || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&name=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {product.stock <= 0 && (
            <div className="absolute top-4 left-4 bg-red-600 text-white font-bold px-3 py-1 rounded shadow-lg text-sm">Hết Hàng</div>
          )}
        </div>

        {/* Cột Phải: Thông tin (Chiếm 50% width trên desktop) */}
        <div className="w-full md:w-1/2 p-6 lg:p-8 flex flex-col">
          <div className="mb-2 flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
              Mã: {product._id?.substring(0, 6)}
            </span>
            <span className="text-sm text-gray-500 font-medium">{product.category}</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{product.name}</h2>

          <div className="flex items-end mb-6">
            <span className="text-3xl lg:text-4xl font-black text-red-600 tracking-tight">{formatPrice(product.price)}</span>
            <span className="text-gray-500 font-medium ml-2 mb-1 lg:mb-2 text-lg">/ {product.unit}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
              <FaShieldAlt className="text-blue-500 mt-1 mr-2" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Tình trạng</p>
                <p className="text-sm font-bold text-gray-900">Mới 100%</p>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
              <FaTruck className="text-blue-500 mt-1 mr-2" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Giao hàng</p>
                <p className="text-sm font-bold text-gray-900">Tận công trình</p>
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div className="mb-6 flex-grow">
            <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Thông tin chi tiết</h4>
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 h-32 overflow-y-auto leading-relaxed">
              {product.description || 'Sản phẩm đảm bảo chất lượng, đúng quy cách tiêu chuẩn xây dựng hiện hành.'}
            </div>
          </div>

          {/* Cụm mua hàng */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Bộ chọn số lượng */}
                <div className="flex items-center border-2 border-gray-200 rounded-lg w-full sm:w-1/3 justify-between p-1">
                  <button type="button" className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded" onClick={() => setQuantity(q => Math.max(1, q - 1))}><FaMinus size={14} /></button>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))} className="w-12 text-center text-lg font-bold focus:outline-none" />
                  <button type="button" className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}><FaPlus size={14} /></button>
                </div>

                {/* Nút đặt hàng */}
                <button onClick={onBuy} className="w-full sm:w-2/3 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-bold text-lg flex justify-center items-center transition-colors shadow-md hover:shadow-lg">
                  <FaShoppingCart className="mr-2" /> Đặt Hàng ({formatPrice(product.price * quantity)})
                </button>
              </div>
            ) : (
              <button disabled className="w-full bg-gray-200 text-gray-500 py-4 rounded-lg font-bold text-lg cursor-not-allowed uppercase tracking-wider">
                Vật Tư Tạm Hết
              </button>
            )}
            {product.stock > 0 && (
              <p className="text-center text-xs text-green-600 mt-3 font-medium">
                Kho hiện còn sẵn {product.stock} {product.unit}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
