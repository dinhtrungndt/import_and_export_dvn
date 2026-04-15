import { useEffect, useState } from 'react';
import { FaBuilding, FaEnvelope, FaLock, FaPhone, FaUser } from 'react-icons/fa';
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
      const response = await register({
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <FaBuilding className="mx-auto text-5xl text-blue-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Đăng ký khách hàng mới</h2>
          <p className="mt-2 text-sm text-gray-600">Đã có tài khoản? <Link to="/login" className="text-blue-600 font-medium">Đăng nhập</Link></p>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm text-center">{error}</div>}
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input name="name" type="text" required placeholder="Họ và tên" className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input name="email" type="email" required placeholder="Email liên hệ" className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
          </div>
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input name="username" type="text" required placeholder="Tên đăng nhập" className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
          </div>
          <div className="relative">
            <FaPhone className="absolute top-3 left-3 text-gray-400" />
            <input name="phone" type="tel" placeholder="Số điện thoại" className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input name="password" type="password" required placeholder="Mật khẩu" className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input name="confirmPassword" type="password" required placeholder="Xác nhận mật khẩu" className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-70">
            {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Register;
