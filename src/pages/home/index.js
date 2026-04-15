import { useEffect, useState } from 'react';
import { FaArrowRight, FaBoxOpen, FaBuilding, FaHardHat, FaSearch, FaTools, FaTruck } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts, fetchUserOrders } from '../../stores/redux/actions/adminActions.js';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [categories] = useState([
    { id: 1, name: 'Cát, Đá xây dựng', icon: <FaBuilding size={32} />, path: '/products?category=cat_san_lap', desc: 'Cát san lấp, cát xây tô, đá 1x2, 4x6 chất lượng chuẩn...' },
    { id: 2, name: 'Xi măng & Sắt thép', icon: <FaTools size={32} />, path: '/products?category=xi_mang', desc: 'Xi măng Hà Tiên, Insee, Sắt thép Hòa Phát, Pomina...' },
    { id: 3, name: 'Gạch & Vật tư khác', icon: <FaBoxOpen size={32} />, path: '/products?category=gach_ngoi', desc: 'Gạch ống, gạch đinh, ống nước và các phụ kiện...' },
  ]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleCategoryClick = (path) => navigate(path);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = e.target.search.value.trim();
    if (searchQuery) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="pb-16 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-blue-700 py-16 lg:py-24 px-4 sm:px-6 lg:px-8 mb-12 overflow-hidden">
        {/* Decorative background elements cho Desktop */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 hidden lg:block">
          <FaBuilding className="text-[400px] text-white" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block mb-2">Vật Liệu Xây Dựng</span>
            <span className="block text-yellow-400">Chất lượng - Uy tín - Giá sỉ</span>
          </h1>
          <p className="mt-4 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-6 md:text-xl md:max-w-2xl">
            Hệ thống phân phối đa dạng các loại vật tư: Cát, đá, xi măng, sắt thép... Đáp ứng mọi nhu cầu thi công từ dân dụng đến dự án lớn.
          </p>
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
            <div className="rounded-md shadow">
              <Link
                to="/products"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-lg text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-transform hover:scale-105"
              >
                Nhận Báo Giá Ngay
              </Link>
            </div>
          </div>
        </div>

        {/* Search Box - To hơn trên desktop */}
        <div className="relative z-10 max-w-lg lg:max-w-2xl mx-auto mt-10">
          <form onSubmit={handleSearch} className="flex rounded-xl overflow-hidden shadow-2xl border-4 border-blue-600/30">
            <input
              type="text"
              name="search"
              placeholder="Tìm vật liệu (VD: Cát san lấp, Xi măng)..."
              className="flex-grow px-5 py-4 lg:py-5 text-gray-700 focus:outline-none text-base lg:text-lg"
            />
            <button type="submit" className="bg-yellow-500 text-blue-900 px-8 py-4 lg:py-5 flex items-center hover:bg-yellow-400 font-bold text-lg transition-colors">
              <FaSearch className="mr-2" /> <span className="hidden sm:inline">Tìm Kiếm</span>
            </button>
          </form>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Danh mục cung cấp</h2>
          <div className="mt-2 w-24 h-1 bg-blue-600 mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              onClick={() => handleCategoryClick(category.path)}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-blue-50 text-blue-600 p-5 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {category.icon}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-full group-hover:bg-yellow-100 transition-colors">
                    <FaArrowRight className="text-gray-400 group-hover:text-yellow-600 transition-colors" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 leading-relaxed">{category.desc}</p>
              </div>
              <div className="w-full h-1.5 bg-gray-100 group-hover:bg-blue-600 transition-colors"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Tại sao chọn chúng tôi?</h2>
            <div className="mt-2 w-24 h-1 bg-yellow-500 mx-auto rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            <div className="text-center">
              <div className="bg-blue-50 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <FaHardHat size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Chất lượng đảm bảo</h3>
              <p className="text-gray-600 px-4">Vật tư chính hãng, quy cách chuẩn xác, đáp ứng mọi tiêu chuẩn khắt khe nhất của các công trình lớn nhỏ.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <FaTruck size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Giao hàng tận chân công trình</h3>
              <p className="text-gray-600 px-4">Sở hữu đội xe tải, xe ba gác đa dạng tải trọng. Giao hàng thần tốc trong ngày vào mọi hẻm ngách.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <FaTools size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Báo giá cạnh tranh</h3>
              <p className="text-gray-600 px-4">Lấy hàng trực tiếp từ bãi, không qua trung gian. Chiết khấu siêu ưu đãi cho nhà thầu và khách sỉ.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
