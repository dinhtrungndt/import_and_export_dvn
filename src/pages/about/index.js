import { useEffect } from 'react';
import {
  FaAward,
  FaCheckCircle,
  FaCog,
  FaDollarSign,
  FaHardHat,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaTools,
  FaTruck,
  FaUsers
} from 'react-icons/fa';

// ─── GALLERY IMAGES ───────────────────────────────────────────────
const galleryImages = [
  "https://vlxdmanhtai.com/wp-content/uploads/2022/06/gioi-thieu-vlxd-manh-tai-008-min.jpg.webp",
  "https://vlxdmanhtai.com/wp-content/uploads/2022/06/gioi-thieu-vlxd-manh-tai-001-min.jpg.webp",
  "https://vlxdmanhtai.com/wp-content/uploads/2022/06/gioi-thieu-vlxd-manh-tai-003-min.jpg.webp",
  "https://vlxdmanhtai.com/wp-content/uploads/2022/06/gioi-thieu-vlxd-manh-tai-002-min.jpg.webp",
  "https://vlxdmanhtai.com/wp-content/uploads/2022/06/gioi-thieu-vlxd-manh-tai-005-min.jpg.webp",
  "https://vlxdhiepha.com/wp-content/uploads/2022/09/ca%CC%81t-xay-du%CC%A3ng-4.jpg",
  "https://vlxdhiepha.com/wp-content/uploads/2022/09/kha%CC%81ch-la%CC%81y-ma%CC%83u-da%CC%81-0x4-ta%CC%A3i-mo%CC%89.jpg",
  "https://vlxdhiepha.com/wp-content/uploads/2022/09/khai-tha%CC%81c-da%CC%81-xay-du%CC%A3ng.jpg",
  "https://vlxdhiepha.com/wp-content/uploads/2022/09/khai-tha%CC%81c-ca%CC%81t-tu%CC%A3-nhien.jpg",
  "https://vlxdsaigongiare.com/upload/filemanager/files/S%E1%BA%AET%20TH%C3%89P%20ANH%20QU%C3%82N.jpg",
  "https://vlxdhiepha.com/wp-content/uploads/2022/09/ba%CC%83i-da%CC%81-xay-du%CC%A3ng.jpg",
  "https://vlxdhiepha.com/wp-content/uploads/2022/09/sat-thep-xay-dung-2.jpg",
  "https://vlxdhiepha.com/wp-content/uploads/2022/09/cung-cap-gach-tuynel-va-gach-khong-nung.jpg"
];

// ─── DATA PREPARATION ──────────────────────────────────────────────
const WHY_CHOOSE_US = [
  {
    icon: FaAward,
    title: "Chất Lượng Hàng Đầu",
    desc: "Vật liệu khai thác tận mỏ, sắt thép chính hãng kiểm định chặt chẽ từ Pomina, Hòa Phát, Việt Nhật.",
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  {
    icon: FaDollarSign,
    title: "Giá Cả Cạnh Tranh",
    desc: "Lấy cái lợi của khách hàng là trọng tâm. Chúng tôi phân phối trực tiếp tận gốc, giảm thiểu chi phí.",
    color: "text-green-600",
    bg: "bg-green-100"
  },
  {
    icon: FaTruck,
    title: "Giao Hành Thần Tốc",
    desc: "Đội ngũ xe ben, sà lan hùng hậu đảm bảo đúng khối lượng, tiến độ, giao tận chân công trình.",
    color: "text-orange-600",
    bg: "bg-orange-100"
  },
  {
    icon: FaUsers,
    title: "Tận Tâm & Chuyên Nghiệp",
    desc: "Tư vấn kỹ thuật chu đáo, hỗ trợ 24/7 với phương châm 'Khách hàng là trọng tâm'.",
    color: "text-purple-600",
    bg: "bg-purple-100"
  }
];

const CORE_PRODUCTS = [
  {
    title: "Sắt Thép Xây Dựng",
    image: "https://vlxdsaigongiare.com/upload/filemanager/files/Thep-hinh.png",
    items: ["Thép Pomina, Việt Nhật, Hòa Phát", "Thép hình H, I, U, V", "Thép hộp, ống mạ kẽm", "Lưới thép B40, kẽm gai"]
  },
  {
    title: "Cát Đá Khai Thác",
    image: "https://vlxdhiepha.com/wp-content/uploads/2022/09/ca%CC%81t-xay-to-vlxd-hiep-ha.jpg",
    items: ["Cát xây tô, cát bê tông, san lấp", "Đá hóa an, xanh, mi sàng", "Đá 1x2, 4x6, 0x4, đá chẻ", "Khai thác trực tiếp từ mỏ uy tín"]
  },
  {
    title: "Gạch & Xi Măng",
    image: "https://vlxdhiepha.com/wp-content/uploads/2022/09/cung-cap-gach-tuynel-va-gach-khong-nung.jpg",
    items: ["Gạch Tuynel, không nung", "Xi măng Hà Tiên, INSEE", "Xi măng Thăng Long, Nghi Sơn", "Cam kết từ đại lý cấp 1"]
  }
];

const SERVICES = [
  { icon: FaCog, title: "Gia công đai thép, cắt sắt theo quy cách" },
  { icon: FaTools, title: "Cho thuê giàn giáo, máy móc công trình" },
  { icon: FaHardHat, title: "San lấp mặt bằng, xe vận chuyển đất" },
  { icon: FaShieldAlt, title: "Bảo hành tiêu chuẩn, đổi trả minh bạch" }
];

const BRANCHES = [
  "Trụ sở chính: 87/231 Lê Văn Duyệt, P.3, Q.Bình Thạnh, TP.HCM",
  "Kho 1: 54/9 Vũ Huy Tấn, P.3, Q.Bình Thạnh",
  "Kho 2: 303 Bến Bình Đông, P.14, Quận 8",
  "Kho 3: 57 Mai Văn Vĩnh, P.Tân Quy, Quận 7",
  "Kho 4: 155 Ngô Chí Quốc, P.Bình Chiểu, TP.Thủ Đức",
  "Kho 5: 159 Tân Hoà Đông, P.14, Quận 6"
];

export const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white flex flex-col font-sans">

      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden flex items-center justify-center">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://vlxdhiepha.com/wp-content/uploads/2022/09/ca%CC%81t-da%CC%81-xay-du%CC%A3ng-tp-hcm.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover object-center filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/70 mix-blend-multiply"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-yellow-400/20 border border-yellow-400/50 backdrop-blur-md">
            <span className="text-yellow-400 font-bold tracking-wider text-sm uppercase flex items-center gap-2">
              <FaHardHat /> Uy Tín - Chất Lượng - Tận Tâm
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-md">
            CÔNG TY VLXD DVN <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
              VỮNG TIÊN PHONG, DỰNG CƠ ĐỒ
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto font-medium mb-10 leading-relaxed">
            Nhà phân phối hàng đầu về sắt thép, cát đá, gạch và xi măng tại khu vực Tp.Hồ Chí Minh và các tỉnh lân cận. Chúng tôi mang đến giải pháp vật liệu xây dựng toàn diện với mức giá tận nhà máy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full sm:w-auto"
            >
              Nhận Báo Giá Ngay
            </a>
            <a
              href="#about-story"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 backdrop-blur-sm transition-all transform hover:-translate-y-1 w-full sm:w-auto"
            >
              Tìm Hiểu Thêm
            </a>
          </div>
        </div>

        {/* Bottom Curve */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block h-16 w-[calc(100%+1.3px)]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </section>

      {/* 2. CHẶNG ĐƯỜNG PHÁT TRIỂN / OUR STORY */}
      <section id="about-story" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-dots text-blue-200"></div>
              <img
                src="https://vlxdmanhtai.com/wp-content/uploads/2022/06/gioi-thieu-vlxd-manh-tai-007-min.jpg.webp"
                alt="Story"
                className="w-full h-auto rounded-2xl shadow-2xl relative z-10 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 p-6 bg-white rounded-2xl shadow-xl z-20 hidden md:block border-t-4 border-blue-600">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">10+</div>
                  <div>
                    <p className="text-gray-900 font-bold">Năm Kinh Nghiệm</p>
                    <p className="text-gray-500 text-sm">Trong Ngành VLXD</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Câu Chuyện Của Chúng Tôi</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-6">Lửa thử vàng, gian nan thử sức</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4 text-justify">
                  <strong>CÔNG TY VLXD DVN</strong> được thành lập vào thời kỳ ngành xây dựng Việt Nam đối mặt với nhiều biến động, khó khăn. Trong suốt những thời điểm thử thách nhất, tập thể công nhân viên của chúng tôi đã luôn sát cánh cùng nhau với một niềm tin vững chắc.
                </p>
                <p className="mb-4 text-justify">
                  Khởi đầu từ việc phân phối sắt thép xây dựng khu vực Sài Gòn, chúng tôi đã vội vàng mở rộng danh mục sản phẩm: cát, đá (từ các mỏ Tân Cang, Hóa An uy tín), vật liệu hoàn thiện. Hiện nay, <strong>DVN</strong> đã trở thành một biểu tượng đáng tin cậy cung cấp các giải pháp vật liệu xây dựng cho hàng loạt đại dự án như chung cư, cầu đường, khu đô thị.
                </p>
                <p className="font-semibold text-gray-800 italic border-l-4 border-yellow-400 pl-4 py-2 mt-6 bg-yellow-50/50">
                  "Với phương châm lấy khách hàng là trọng tâm, sự phát triển vững chắc của DVN luôn dựa trên mối quan hệ bền vững, lâu dài và trung thực với Quý Khách hàng."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LÝ DO NÊN CHỌN CHÚNG TÔI (WHY CHOOSE US) */}
      <section className="py-20 bg-white items-center">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Ưu Điểm Vượt Trội</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4">Vì sao nên chọn VLXD DVN?</h2>
            <p className="text-gray-600">Những cam kết tạo nên uy tín và thương hiệu để trở thành đơn vị đi đầu lĩnh vực VLXD tại TPHCM.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_US.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
                <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                  <item.icon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SẢN PHẨM CỐT LÕI (CORE PRODUCTS) */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Danh Mục</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Hệ Sinh Thái Sản Phẩm</h2>
            </div>
            <a href="/products" className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-2 group">
              Xem tất cả <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {CORE_PRODUCTS.map((prod, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full">
                <div className="h-48 overflow-hidden relative group">
                  <img src={prod.image} alt={prod.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex items-end p-6">
                    <h3 className="text-2xl font-bold text-white">{prod.title}</h3>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-3 mb-6 flex-1">
                    {prod.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="/products" className="w-full py-3 text-center rounded-xl bg-gray-50 text-blue-700 font-bold uppercase text-sm hover:bg-blue-600 hover:text-white transition-colors">
                    Mua Ngay
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NĂNG LỰC & DỊCH VỤ NỔI BẬT */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Giải Pháp Toàn Diện</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-12">Dịch Vụ & Năng Lực Nổi Bật</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((srv, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center text-blue-600 text-2xl mb-4 border border-blue-50">
                  <srv.icon />
                </div>
                <h4 className="font-bold text-gray-800">{srv.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. THƯ VIỆN HÌNH ẢNH (MASONRY GALLERY) */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <span className="text-yellow-400 font-bold uppercase tracking-wider text-sm">Góc Nhìn Thực Tế</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-4">Hình Ảnh Hoạt Động</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Mạng lưới kho bãi, bến bãi khai thác và hoạt động vận tải tấp nập khẳng định quy mô năng lực của DVN.</p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {galleryImages.map((src, idx) => (
              <div key={idx} className="break-inside-avoid relative group rounded-lg overflow-hidden group-hover:scale-[1.01] transition-transform">
                <img
                  src={src}
                  alt={`Hoat dong DVN ${idx}`}
                  loading="lazy"
                  className="w-full rounded-lg object-cover bg-gray-800 min-h-[150px] transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold tracking-wider uppercase text-xs border border-white px-3 py-1 rounded">DVN</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA & FOOTER / LIÊN HỆ */}
      <section id="contact" className="py-20 bg-blue-700 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform scale-150 preserveAspectRatio-none">
            <path fill="#ffffff" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46C87.4,-32.9,90.1,-16.4,89.5,-0.3C88.9,15.8,85,31.5,76.5,44.5C68,57.5,54.8,67.7,40.7,75.3C26.6,82.9,11.7,87.9,-2.8,92.7C-17.3,97.5,-34.5,102.1,-48.5,95.5C-62.5,88.9,-73.2,71.2,-81.1,53.5C-89,35.8,-94,17.9,-93.6,0.3C-93.1,-17.4,-87.3,-34.7,-78.4,-50.2C-69.5,-65.7,-57.5,-79.3,-43,-86C-28.5,-92.7,-14.2,-92.5,0.1,-92.7C14.5,-92.8,29,-93.2,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-5 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">

          <div className="lg:w-1/2 text-white text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">Sẵn Sàng Hợp Tác <br /> Phát Triển Cùng DVN?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Liên hệ ngay để nhận báo giá chi tiết, các chính sách ưu đãi cũng như chiết khấu vận chuyển hấp dẫn nhất khu vực.
            </p>

            {/* Quick Contact Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="font-bold text-xl mb-4">Gửi Yêu Cầu Báo Giá Nhanh</h3>
              <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn! Báo giá sẽ được gửi sớm nhất.'); }}>
                <input type="text" placeholder="Tên / Đơn vị của bạn" className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 border-none outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500" required />
                <div className="flex gap-3">
                  <input type="tel" placeholder="Số điện thoại Zalo" className="w-2/3 px-4 py-3 rounded-lg bg-white/90 text-gray-900 border-none outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500" required />
                  <button type="submit" className="w-1/3 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-md transition-colors">
                    Gửi!
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:w-5/12 w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 text-gray-800">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100 border-dashed">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl shrink-0">
                  <FaPhoneAlt />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Hotline Bộ Phận Kinh Doanh</p>
                  <a href="tel:0906710999" className="text-3xl font-black text-gray-900 hover:text-blue-700 transition">0889 541 507</a>
                  <p className="text-gray-500 mt-1">Hỗ trợ Zalo 24/7</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-4 text-gray-900">Mạng Lưới Kho Hàng / Chi Nhánh</h3>
              <ul className="space-y-4 text-sm text-gray-600">
                {BRANCHES.map((branch, i) => (
                  <li key={i} className="flex gap-3">
                    <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0" />
                    <span>{branch}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Mini custom styles for dots background */}
      <style>{`
        .bg-dots {
          background-image: radial-gradient(currentColor 2px, transparent 2px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
