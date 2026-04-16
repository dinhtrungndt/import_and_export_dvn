import { useEffect, useState } from 'react';
import { FaBuilding, FaEdit, FaEnvelope, FaMapMarkerAlt, FaPhone, FaSave, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
// Giả định bạn có một hàm updateProfile trong authService. Nếu chưa có, bạn có thể tự thêm vào authService.js
// import { updateProfile } from '../../services/authService';

const AccountPage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '', // Thêm địa chỉ công ty/công trình mặc định
    companyName: '' // Thêm tên công ty/nhà thầu
  });

  // Khởi tạo dữ liệu khi có user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        companyName: user.companyName || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // NOTE: Bạn cần tạo API endpoint trong FastAPI để update user profile
      // await updateProfile(user.id, formData);

      // Tạm thời giả lập thành công và update local state
      updateUser(formData);
      toast.success('Cập nhật thông tin tài khoản thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi cập nhật profile:', error);
      toast.error(error.message || 'Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-blue-700 px-6 py-8 text-white flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center text-blue-700 text-3xl font-bold shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
            </div>
            <div className="ml-5">
              <h1 className="text-2xl font-bold">{user.name || 'Người Dùng'}</h1>
              <p className="text-blue-100 flex items-center mt-1">
                <FaBuilding className="mr-2" />
                {formData.companyName || 'Khách hàng cá nhân / Nhà thầu'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${isEditing
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
              : 'bg-white text-blue-700 hover:bg-blue-50 shadow-md'
              }`}
          >
            {isEditing ? (
              <>Hủy chỉnh sửa</>
            ) : (
              <><FaEdit className="mr-2" /> Chỉnh sửa hồ sơ</>
            )}
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Thông tin liên hệ & Giao hàng</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaUser className="mr-2 text-gray-400" /> Họ và tên (Người đại diện)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isEditing ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-500'
                    } transition-colors`}
                  required
                />
              </div>

              {/* Tên công ty / Cửa hàng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaBuilding className="mr-2 text-gray-400" /> Tên Công ty / Nhà thầu
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="VD: Công ty XD DVN"
                  className={`w-full px-4 py-2.5 rounded-lg border ${isEditing ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-500'
                    } transition-colors`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaEnvelope className="mr-2 text-gray-400" /> Email liên hệ
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isEditing ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-500'
                    } transition-colors`}
                  required
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaPhone className="mr-2 text-gray-400" /> Số điện thoại (Nhận báo giá)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isEditing ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-500'
                    } transition-colors`}
                  required
                />
              </div>

              {/* Địa chỉ giao hàng mặc định */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" /> Địa chỉ công trình mặc định
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  placeholder="Nhập địa chỉ công trình thường xuyên nhận hàng để thuận tiện khi đặt mua..."
                  className={`w-full px-4 py-2.5 rounded-lg border resize-none ${isEditing ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-500'
                    } transition-colors`}
                />
              </div>
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md flex items-center transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div> Đang lưu...</>
                  ) : (
                    <><FaSave className="mr-2" /> Lưu Thông Tin</>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
