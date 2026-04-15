import { useEffect, useState } from 'react';
import { FaArrowRight, FaBoxOpen, FaBuilding, FaHardHat, FaSearch, FaTools, FaTruck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchExportReport, fetchInventoryReport, fetchProducts, fetchReportDashboard, fetchRevenueReport, fetchUserOrders } from '../../stores/redux/actions/adminActions.js';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [categories] = useState([
    { id: 1, name: 'Cát, Đá xây dựng', icon: <FaBuilding size={24} />, path: '/products?category=cat_san_lap' },
    { id: 2, name: 'Xi măng & Sắt thép', icon: <FaTools size={24} />, path: '/products?category=xi_mang' },
  ]);

  const { products, loading, error } = useSelector((state) => state.adminReducer);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchUserOrders());
    dispatch(fetchReportDashboard());
    dispatch(fetchInventoryReport());
    dispatch(fetchExportReport());
    dispatch(fetchRevenueReport());
  }, [dispatch]);

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = e.target.search.value.trim();
    if (searchQuery) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <div className="relative bg-blue-700 py-12 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Vật Liệu Xây Dựng</span>
            <span className="block text-yellow-400">Chất lượng - Uy tín - Giá tốt</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Cung cấp đa dạng các loại vật tư xây dựng: Cát, đá, xi măng, sắt thép... Đáp ứng mọi nhu cầu thi công của công trình.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/products"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
              >
                Đặt hàng ngay
              </Link>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="max-w-lg mx-auto mt-8">
          <form onSubmit={handleSearch} className="flex rounded-lg overflow-hidden shadow-lg">
            <input
              type="text"
              name="search"
              placeholder="Tìm kiếm vật liệu (VD: Cát san lấp, Xi măng Hà Tiên)..."
              className="flex-grow px-4 py-3 text-gray-700 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-white px-6 py-3 flex items-center hover:bg-yellow-600 font-medium"
            >
              <FaSearch className="mr-2" />
              <span>Tìm</span>
            </button>
          </form>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Danh mục nổi bật
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-3xl lg:mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleCategoryClick(category.path)}
            >
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
                    {category.icon}
                  </div>
                  <FaArrowRight className="text-blue-500 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{category.name}</h3>
                <p className="mt-1 text-gray-500">
                  {category.id === 1
                    ? 'Cát san lấp, cát xây tô, đá 1x2, 4x6 chất lượng chuẩn...'
                    : 'Xi măng Hà Tiên, Insee, Sắt thép Hòa Phát, Pomina...'}
                </p>
              </div>
              <div className="absolute bottom-0 w-full h-1 bg-blue-600"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Tại sao chọn VLXD của chúng tôi?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full inline-block mb-4">
                <FaHardHat size={28} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chất lượng đảm bảo</h3>
              <p className="text-gray-500">
                Vật tư chính hãng, quy cách chuẩn, đáp ứng mọi tiêu chuẩn khắt khe nhất của công trình.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full inline-block mb-4">
                <FaTruck size={28} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Giao hàng tận nơi</h3>
              <p className="text-gray-500">
                Đội xe tải, ba gác đa dạng. Giao hàng nhanh chóng tới tận chân công trình trong ngày.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full inline-block mb-4">
                <FaBoxOpen size={28} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Báo giá cạnh tranh</h3>
              <p className="text-gray-500">
                Báo giá trực tiếp từ kho bãi, chiết khấu cao cho nhà thầu và khách hàng mua số lượng lớn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
