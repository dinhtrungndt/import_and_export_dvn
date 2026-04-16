import { useEffect, useState } from 'react';
import { FaClock, FaEnvelope, FaHardHat, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BRANCHES = [
  "Trụ sở chính: 87/231 Lê Văn Duyệt, P.3, Q.Bình Thạnh, TP.HCM",
  "Kho 1: 54/9 Vũ Huy Tấn, P.3, Q.Bình Thạnh",
  "Kho 2: 303 Bến Bình Đông, P.14, Quận 8",
  "Kho 3: 57 Mai Văn Vĩnh, P.Tân Quy, Quận 7",
  "Kho 4: 155 Ngô Chí Quốc, P.Bình Chiểu, TP.Thủ Đức",
  "Kho 5: 159 Tân Hoà Đông, P.14, Quận 6"
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Đã gửi thông tin liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.');
      setFormData({ name: '', phone: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans border-t border-gray-200">
      {/* Header Banner */}
      <div className="relative pt-24 pb-20 bg-blue-900 border-b-4 border-yellow-400">
        <div className="absolute inset-0 z-0">
          <img
            src="https://vlxdhiepha.com/wp-content/uploads/2022/09/ca%CC%81t-da%CC%81-xay-du%CC%A3ng-tp-hcm.jpg"
            alt="Contact Background"
            className="w-full h-full object-cover object-center filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/80 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-5">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
            Liên Hệ Báo Giá & Tư Vấn
          </h1>
          <p className="text-lg text-blue-100 mb-0 font-medium max-w-2xl mx-auto">
            Gửi yêu cầu báo giá cát đá xây dựng, sắt thép. Hệ thống kho bãi phân bố khắp TPHCM đảm bảo giao hàng nhanh nhất!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-5">

            {/* Left Column: Contact Info */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white lg:col-span-2 p-8 md:p-12 flex flex-col relative overflow-hidden">
              <div className="relative z-10">
                <FaHardHat className="text-5xl text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-white">VLXD DVN</h3>
                <p className="text-blue-100 mb-8 leading-relaxed text-sm md:text-base border-l-4 border-yellow-400 pl-4 bg-blue-800/30 py-2">
                  Chúng tôi xin gửi lời cảm ơn chân thành tới quý khách hàng đã quan tâm tới sản phẩm. Để nhận báo giá sỉ, thắc mắc về vật liệu, vui lòng liên hệ trực tiếp hoặc để lại lời nhắn.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mr-4 shrink-0 shadow-inner">
                      <FaPhoneAlt className="text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-blue-200 uppercase tracking-wide">Hotline 24/7</h4>
                      <p className="text-white text-xl font-bold mt-1">0889 541 507</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mr-4 shrink-0 shadow-inner">
                      <FaEnvelope className="text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-blue-200 uppercase tracking-wide">Email Nhận Báo Giá</h4>
                      <p className="text-white mt-1 font-medium">lienhe@vlxddvn.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mr-4 shrink-0 shadow-inner">
                      <FaMapMarkerAlt className="text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-blue-200 uppercase tracking-wide">Trụ Sở Chính</h4>
                      <p className="text-white mt-1 leading-relaxed">87/231 Lê Văn Duyệt, Phường 3, Quận Bình Thạnh, TP.HCM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mr-4 shrink-0 shadow-inner">
                      <FaClock className="text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-blue-200 uppercase tracking-wide">Giờ Làm Việc</h4>
                      <p className="text-white mt-1 leading-relaxed">8:00 - 18:00 (Thứ 2 - CN)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Shapes */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-400/10 rounded-full mix-blend-overlay"></div>
              <div className="absolute top-10 -right-10 w-32 h-32 bg-blue-400/20 rounded-full mix-blend-overlay"></div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-3 p-8 md:p-12 bg-white">
              <div className="mb-8">
                <span className="text-blue-600 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                  <FaPaperPlane /> Để lại lời nhắn
                </span>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-2">Liên Hệ Tư Vấn</h3>
                <p className="text-gray-500 mt-2">Vui lòng hoàn tất biểu mẫu bên dưới để nhận được thông tin phản hồi từ đội ngũ DVN.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tên của bạn <span className="text-red-500">*</span></label>
                    <input
                      type="text" name="name" required value={formData.name} onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      placeholder="VD: Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                    <input
                      type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      placeholder="Số để liên hệ..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ email</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="vd: email@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung liên hệ <span className="text-red-500">*</span></label>
                  <textarea
                    name="message" required rows="5" value={formData.message} onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                    placeholder="VD: Cần báo giá 10 khối cát san lấp giao tới Quận 1..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit" disabled={isSubmitting}
                    className="w-full md:w-auto inline-flex justify-center items-center px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <><div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div> Đang xử lý...</>
                    ) : (
                      <><FaPaperPlane className="mr-2" /> Gửi Yêu Cầu Báo Giá</>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Warehouse Section */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Hệ Thống Phân Phối</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-4">Mạng Lưới Kho Bãi Quy Mô</h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Đặc biệt chúng tôi có hệ thống kho, bãi quy mô tại TPHCM. Kho bãi vật liệu xây dựng điển hình là bãi cát đá xây dựng phân bố rộng khắp. Cùng theo đó là hệ thống kho sắt thép xây dựng phân bố trên toàn quốc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 bg-gray-50 p-8 rounded-3xl border border-gray-100">
            {BRANCHES.map((branch, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 border border-blue-100">
                  <FaMapMarkerAlt />
                </div>
                <div className="text-gray-700 text-sm font-medium mt-1 leading-relaxed">
                  {branch}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="h-96 w-full bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2393375819777!2d106.69747971480088!3d10.79296599231013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528cb3e7bd5b3%3A0xe54e1a0b38038ab3!2zODcvMjMxIEzDqiBWxINuIER1eeG7h3QsIFBoxrDhu51uZyAzLCBCw6xuaCBUaOG6oW5oLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1684534825902!5m2!1svi!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Google Map VLXD DVN"
        ></iframe>
      </section>
    </div>
  );
};

export default ContactPage;
