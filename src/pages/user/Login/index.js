import { useEffect, useState } from 'react';
import { FaHardHat, FaLock, FaUser } from 'react-icons/fa';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <div className="flex justify-center"><FaHardHat className="text-6xl text-yellow-500" /></div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-blue-900">VLXD DVN</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Chưa có tài khoản? <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Đăng ký ngay</Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm text-center">{error}</div>}
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUser className="h-5 w-5 text-gray-400" /></div>
              <input type="text" required className="appearance-none rounded-lg block w-full px-3 py-3 pl-10 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="h-5 w-5 text-gray-400" /></div>
              <input type="password" required className="appearance-none rounded-lg block w-full px-3 py-3 pl-10 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70">
            {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
