import { useEffect, useState } from 'react';
import { FaEnvelope, FaLock, FaPhone, FaUser, FaArrowRight, FaHardHat } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { register } from '../../../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', username: '', password: '', confirmPassword: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated } = useAuth();

  useEffect(() => { if (isAuthenticated) navigate('/', { replace: true }); }, [isAuthenticated, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError('Mật khẩu xác nhận không khớp'); return; }
    if (formData.password.length < 6) { setError('Mật khẩu phải từ 6 ký tự'); return; }

    try {
      setLoading(true); setError('');
      await register({
        name: formData.name, username: formData.username, email: formData.email,
        password: formData.password, phone: formData.phone
      });
      navigate('/login');
    } catch (err) {
      setError(err.detail || 'Đăng ký thất bại. Tên đăng nhập hoặc email có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* Left side - Register Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-xl">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
            <div className="p-3 bg-yellow-400 rounded-xl shadow-md">
              <FaHardHat className="text-2xl text-gray-900" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-blue-900">VLXD DVN</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight text-center lg:text-left">Tạo tài khoản mới</h1>
            <p className="text-gray-500 font-medium text-center lg:text-left">Đăng ký để tận hưởng các dịch vụ tốt nhất từ DVN</p>
          </div>

          <form className="space-y-6 bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center shadow-sm">
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">Họ và tên</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input name="name" id="name" type="text" required className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 outline-none text-sm font-medium hover:border-gray-300" placeholder="Nguyễn Văn A" onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">Tên đăng nhập</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input name="username" id="username" type="text" required className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 outline-none text-sm font-medium hover:border-gray-300" placeholder="nguyenvana" onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input name="email" id="email" type="email" required className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 outline-none text-sm font-medium hover:border-gray-300" placeholder="email@domain.com" onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="phone">Số điện thoại</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaPhone className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input name="phone" id="phone" type="tel" className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 outline-none text-sm font-medium hover:border-gray-300" placeholder="0901234567" onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">Mật khẩu</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input name="password" id="password" type="password" required className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 outline-none text-sm font-medium hover:border-gray-300" placeholder="••••••••" onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input name="confirmPassword" id="confirmPassword" type="password" required className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 outline-none text-sm font-medium hover:border-gray-300" placeholder="••••••••" onChange={handleChange} />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 mt-8 text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-70 transition-all shadow-md hover:shadow-xl disabled:shadow-none"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
              {!loading && <FaArrowRight className="h-4 w-4" />}
            </button>
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm font-medium">
                Đã có tài khoản?{' '}
                <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all hidden sm:inline">
                  Đăng nhập ngay
                </Link>
                <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-all sm:hidden block mt-1">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-12 w-full text-white h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-400 rounded-xl shadow-lg">
              <FaHardHat className="text-3xl text-gray-900" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">VLXD DVN</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-display leading-tight mb-4 text-white">
            Đối tác tin cậy cho <br /> mọi công trình
          </h2>
          <p className="text-gray-300 text-lg max-w-md font-medium leading-relaxed">
            Cung cấp sắt thép, xi măng, gạch ngói và các vật liệu xây dựng với chất lượng đảm bảo và giá cả tốt nhất thị trường.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
