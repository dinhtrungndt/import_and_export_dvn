import { useState } from 'react';
import { FaEnvelope, FaHardHat, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Yêu cầu báo giá vật liệu',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Giả lập gửi tin nhắn thành công
    setTimeout(() => {
      toast.success('Đã gửi yêu cầu thành công! Chúng tôi sẽ liên hệ báo giá sớm nhất.');
      setFormData({
        name: '', phone: '', email: '', subject: 'Yêu cầu báo giá vật liệu', message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <FaHardHat className="mx-auto text-5xl text-yellow-500 mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Liên Hệ Với VLXD DVN</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Nhận báo giá sỉ, tư vấn khối lượng vật tư cho công trình, hoặc phản hồi về chất lượng dịch vụ giao hàng.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">

            {/* Thông tin liên hệ (Cột trái) */}
            <div className="bg-blue-800 text-white lg:col-span-2 p-8 md:p-12 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-yellow-400">Thông Tin Kho Bãi</h3>
                <p className="text-blue-100 mb-8 leading-relaxed">
                  Hệ thống phân phối VLXD DVN cam kết mang đến nguồn vật tư chất lượng, đầy đủ quy cách, giao hàng nhanh chóng bằng đội xe tải và ba gác chuyên nghiệp.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-2xl text-yellow-400 mt-1 mr-4" />
                    <div>
                      <h4 className="font-semibold text-lg">Tổng Kho Trung Tâm</h4>
                      <p className="text-blue-100 mt-1">Số 123 Đường Điện Biên Phủ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaPhoneAlt className="text-xl text-yellow-400 mt-1 mr-4" />
                    <div>
                      <h4 className="font-semibold text-lg">Hotline Điều Xe / Báo Giá</h4>
                      <p className="text-blue-100 mt-1">0909 123 456 (Zalo hỗ trợ 24/7)</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaEnvelope className="text-xl text-yellow-400 mt-1 mr-4" />
                    <div>
                      <h4 className="font-semibold text-lg">Email Nhận Hồ Sơ / Hợp Đồng</h4>
                      <p className="text-blue-100 mt-1">baogia@vlxdthanhdat.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-sm text-blue-200">Giờ làm việc: 6:00 Sáng - 18:00 Tối (Thứ 2 - Chủ Nhật)</p>
              </div>
            </div>

            {/* Form liên hệ (Cột phải) */}
            <div className="lg:col-span-3 p-8 md:p-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Gửi Yêu Cầu Báo Giá</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên Nhà thầu / Cá nhân <span className="text-red-500">*</span></label>
                    <input
                      type="text" name="name" required value={formData.name} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                      placeholder="VD: Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại <span className="text-red-500">*</span></label>
                    <input
                      type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                      placeholder="Nhập số Zalo để nhận báo giá"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                      placeholder="vd: congty@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chủ đề <span className="text-red-500">*</span></label>
                    <select
                      name="subject" required value={formData.subject} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="Yêu cầu báo giá vật liệu">Yêu cầu báo giá vật liệu sỉ</option>
                      <option value="Hỏi về chi phí vận chuyển">Tư vấn chi phí xe tải, ba gác</option>
                      <option value="Hợp tác cung cấp vật tư">Hợp tác làm nhà phân phối</option>
                      <option value="Phản ánh dịch vụ">Phản ánh chất lượng vật tư/giao hàng</option>
                      <option value="Khác">Vấn đề khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung chi tiết / Khối lượng vật tư cần báo giá <span className="text-red-500">*</span></label>
                  <textarea
                    name="message" required rows="5" value={formData.message} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-none"
                    placeholder="VD: Tôi cần báo giá 10 khối cát san lấp và 20 bao xi măng Hà Tiên giao đến Quận 2..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit" disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <><div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div> Đang gửi...</>
                    ) : (
                      <><FaPaperPlane className="mr-2" /> Gửi Yêu Cầu</>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
