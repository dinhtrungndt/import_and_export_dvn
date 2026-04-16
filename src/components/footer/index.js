import { Link } from 'react-router-dom';
import { FaChevronRight, FaEnvelope, FaHardHat, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const CUSTOMER_SUPPORT = [
  { label: 'Chính sách & Quy định chung', href: '#' },
  { label: 'Quy Định & hình thức thanh toán', href: '#' },
  { label: 'Chính sách vận chuyển, giao nhận', href: '#' },
  { label: 'Chính sách đổi trả hàng', href: '#' },
  { label: 'Chính sách bảo mật thông tin', href: '#' },
  { label: 'Giao hàng tận nơi', href: '#' },
];

const QUICK_QUOTES = [
  { label: 'Báo giá cát xây dựng', href: '/bao-gia/bao-gia-cat-xay-to' },
  { label: 'Báo giá cát san lấp', href: '/bao-gia/bao-gia-cat-san-lap' },
  { label: 'Báo giá đá xây dựng', href: '/bao-gia/bao-gia-da-1x2' },
  { label: 'Báo giá đá 0x4, 1x2, 4x6', href: '/bao-gia/bao-gia-da-0x4' },
  { label: 'Báo giá xi măng', href: '/bao-gia/bao-gia-xi-mang-ha-tien' },
  { label: 'Báo giá gạch tuynel', href: '/products?category=gach-tuynel' },
  { label: 'Báo giá sắt thép', href: '/products?category=sat-thep' },
  { label: 'Báo giá xà bần sạch', href: '/bao-gia/bao-gia-xa-ban-sach' },
];

const FEATURED_SERVICES = [
  { label: 'Cho thuê giàn giáo', href: '/dich-vu' },
  { label: 'Cát đá đóng bao', href: '/products?category=cat-da-dong-bao' },
  { label: 'Đào móng công trình/đào đất', href: '/dich-vu' },
  { label: 'Cung cấp xà bần san lấp', href: '/dich-vu' },
  { label: 'San lấp mặt bằng', href: '/dich-vu' },
  { label: 'Cho thuê xe ben tải chở đất', href: '/dich-vu' },
];

export const Footer = () => {
  return (
    <footer className="relative bg-[#0a192f] text-gray-300 font-sans border-t-4 border-yellow-400 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-luminosity">
        <img
          src="https://vlxdhiepha.com/wp-content/uploads/2022/09/ca%CC%81t-da%CC%81-xay-du%CC%A3ng-tp-hcm.jpg"
          alt="Background Footer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Company Info */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-yellow-400 font-extrabold text-2xl tracking-wide mb-6">
              <FaHardHat className="text-3xl" />
              <span>VLXD DVN</span>
            </Link>
            <div className="space-y-4 text-sm leading-relaxed">
              <p className="font-bold text-white uppercase tracking-wider mb-2 text-xs border-b border-gray-700 pb-2">
                Công Ty TNHH VLXD DVN
              </p>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-yellow-400 shrink-0 text-base" />
                <p>
                  <strong className="text-white block mb-1">Trụ sở chính:</strong>
                  87/231 Lê Văn Duyệt, Phường 3, Quận Bình Thạnh, TP.HCM
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-yellow-400 shrink-0 text-base" />
                <p>
                  <strong className="text-white block mb-1">Hệ thống kho bãi:</strong>
                  - Kho 1: 54/9 Vũ Huy Tấn, Q.Bình Thạnh<br/>
                  - Kho 2: 303 Bến Bình Đông, Q.8<br/>
                  - Kho 3: 57 Mai Văn Vĩnh, Quận 7
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-yellow-400 shrink-0 text-base" />
                <p>
                  <strong className="text-white">Hotline:</strong> <a href="tel:0889541507" className="text-yellow-400 hover:text-white transition font-bold text-lg inline-block pt-1">0889 541 507</a>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-yellow-400 shrink-0 text-base" />
                <p>
                  <strong className="text-white">Email:</strong> lienhe@vlxddvn.com
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Customer Support */}
          <div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-6 pb-3 border-b-2 border-yellow-400 inline-block">
              Hỗ Trợ Khách Hàng
            </h3>
            <ul className="space-y-3">
              {CUSTOMER_SUPPORT.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="flex items-center gap-2 hover:text-yellow-400 hover:translate-x-2 transition-all duration-300 text-sm">
                    <FaChevronRight className="text-[10px] text-gray-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Quotes */}
          <div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-6 pb-3 border-b-2 border-yellow-400 inline-block">
              Báo Giá Nhanh
            </h3>
            <ul className="space-y-3">
              {QUICK_QUOTES.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="flex items-center gap-2 hover:text-yellow-400 hover:translate-x-2 transition-all duration-300 text-sm">
                    <FaChevronRight className="text-[10px] text-gray-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Featured Services */}
          <div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-6 pb-3 border-b-2 border-yellow-400 inline-block">
              Dịch Vụ Nổi Bật
            </h3>
            <ul className="space-y-3">
              {FEATURED_SERVICES.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="flex items-center gap-2 hover:text-yellow-400 hover:translate-x-2 transition-all duration-300 text-sm">
                    <FaChevronRight className="text-[10px] text-gray-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 bg-[#061123] py-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
          <p>
            Copyright © {new Date().getFullYear()} Bản quyền thuộc về <span className="text-yellow-400 font-bold">VLXD DVN</span>.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
               Hotline tư vấn 24/7: <a href="tel:0889541507" className="text-white hover:text-yellow-400 transition font-bold">0889 541 507</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
