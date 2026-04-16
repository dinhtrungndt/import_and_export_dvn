import { useEffect, useState } from 'react';
import { FaHardHat, FaLock, FaUser, FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { login } from '../../../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) { setError('Vui lòng nhập đầy đủ thông tin'); return; }
    try {
      setLoading(true); setError('');
      const userData = await login(username, password);
      authLogin(userData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.detail || 'Tài khoản hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888081699-015ba6a05d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-12 w-full text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-400 rounded-xl shadow-lg">
              <FaHardHat className="text-3xl text-gray-900" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">VLXD DVN</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-display leading-tight mb-4 text-white">
            Nền tảng cung cấp <br /> Vật liệu xây dựng hàng đầu
          </h2>
          <p className="text-blue-100 text-lg max-w-md font-medium leading-relaxed">
            Đăng nhập để quản lý đơn hàng, theo dõi báo giá và nhận các ưu đãi hấp dẫn dành riêng cho doanh nghiệp của bạn.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden justify-center">
            <div className="p-3 bg-yellow-400 rounded-xl shadow-md">
              <FaHardHat className="text-2xl text-gray-900" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-blue-900">VLXD DVN</span>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Chào mừng trở lại!</h1>
            <p className="text-gray-500 font-medium">Vui lòng đăng nhập để tiếp tục</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center shadow-sm">
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">Tên đăng nhập</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                    <FaUser className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input 
                    id="username"
                    type="text" 
                    required 
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 outline-none sm:text-sm font-medium shadow-sm hover:border-gray-300" 
                    placeholder="Nhập tên đăng nhập" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700" htmlFor="password">Mật khẩu</label>
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Quên mật khẩu?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input 
                    id="password"
                    type="password" 
                    required 
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 outline-none sm:text-sm font-medium shadow-sm hover:border-gray-300" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 mt-6 text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-70 transition-all shadow-md hover:shadow-xl disabled:shadow-none"
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}
              {!loading && <FaArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-600 text-sm font-medium">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all hidden sm:inline">
                Đăng ký ngay bây giờ
              </Link>
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-all sm:hidden block mt-1">
                Đăng ký ngay bây giờ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
