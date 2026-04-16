import { useEffect, useState } from 'react';
import { FaArrowRight, FaBuilding, FaHardHat, FaLeaf, FaPhoneAlt, FaShieldAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const slideImages = [
  "https://vlxdmanhtai.com/wp-content/uploads/2022/06/vat-lieu-xay-dung-manh-tai.jpg.webp",
  "https://vlxdmanhtai.com/wp-content/uploads/2022/06/sat-cuon-xay-dung-vlxd-manh-tai-min.jpg.webp",
  "https://vlxdmanhtai.com/wp-content/uploads/2022/06/gach-xay-dung-vlxd-manh-tai.jpg.webp",
  "https://vlxdmanhtai.com/wp-content/uploads/2022/06/cat-xay-dung-vlxd-manh-tai.jpg.webp"
];

const categoryData = [
  { name: "Cát đóng bao", img: "https://vlxdmanhtai.com/wp-content/uploads/2022/05/cat-dong-bao-tien-loi-xay-dung.jpg", query: "cat-da-dong-bao" },
  { name: "Cát xây dựng", img: "https://vlxdmanhtai.com/wp-content/uploads/2022/05/cat-xay-dung-vlxd-manh-tai.jpg", query: "cat-xay-dung" },
  { name: "Đá xây dựng", img: "https://vlxdmanhtai.com/wp-content/uploads/2022/05/cac-loai-da-xay-dung-chat-luong-cao-vlxd-manh-tai.jpg", query: "da-xay-dung" },
  { name: "Gạch Tuynel", img: "https://vlxdmanhtai.com/wp-content/uploads/2022/05/gach-tuynel-vlxd-manh-tai.jpg", query: "gach-tuynel" },
  { name: "Sắt thép chuẩn", img: "https://vlxdmanhtai.com/wp-content/uploads/2022/05/sat-thep-xay-dung-vlxd-manh-tai.jpg", query: "sat-thep" },
  { name: "Dây Kẽm & Đinh", img: "https://vlxdmanhtai.com/wp-content/uploads/2022/05/day-thep-ma-kem-gia-re-vlxd-manh-tai.jpg", query: "day-kem-dinh" },
  { name: "Lưới thép", img: "https://vlxdmanhtai.com/wp-content/uploads/2022/05/luoi-thep-xay-dung-vlxd-manh-tai.jpg", query: "luoi-thep" },
  { name: "Thép hình", img: "https://vlxdmanhtai.com/wp-content/uploads/2022/05/cac-loai-thep-xay-dung.jpg", query: "thep-hinh" },
  { name: "Thép hộp", img: "https://vlxdmanhtai.com/wp-content/uploads/2022/05/thep-hop-vuong.jpg", query: "thep-hop" },
  { name: "Xi măng", img: "https://vlxdmanhtai.com/wp-content/uploads/2022/05/xi-mang-xay-dung-vlxd-manh-tai.jpg", query: "xi-mang" }
];

const priceHighlights = [
  {
    category: "Xi Măng",
    bg: "bg-gradient-to-r from-blue-700 to-blue-500",
    items: [
      { name: "Hà Tiên Đa Dụng", price: "70.000đ", unit: "Bao" },
      { name: "Insee Sao Mai", price: "72.000đ", unit: "Bao" },
      { name: "Fico / Nghi Sơn", price: "68.000đ", unit: "Bao" },
    ]
  },
  {
    category: "Cát Bê Tông - Xây",
    bg: "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900",
    items: [
      { name: "Cát Bê Tông Rửa", price: "270.000đ", unit: "Khối" },
      { name: "Cát Xây Tô Sàng", price: "170.000đ", unit: "Khối" },
      { name: "Cát San Lấp", price: "140.000đ", unit: "Khối" },
    ]
  },
  {
    category: "Đá Công Trình",
    bg: "bg-gradient-to-r from-slate-800 to-slate-600",
    items: [
      { name: "Đá 1x2 Xanh Đồng Nai", price: "370.000đ", unit: "Khối" },
      { name: "Đá 4x6 Đen Bình Điền", price: "320.000đ", unit: "Khối" },
      { name: "Đá Mi Bụi / Sàng", price: "220.000đ", unit: "Khối" },
    ]
  },
  {
    category: "Gạch - Sắt",
    bg: "bg-gradient-to-r from-rose-600 to-red-500",
    items: [
      { name: "Gạch Ống Tuynel", price: "1.100đ", unit: "Viên" },
      { name: "Thép CB300 D10", price: "Liên hệ", unit: "Cây" },
      { name: "Gạch Không Nung", price: "950đ", unit: "Viên" },
    ]
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-sans text-slate-800 bg-white selection:bg-blue-600 selection:text-white pb-0">

      {/* 1. HERO SECTION - Ultra Compact Height */}
      <section className="relative w-full overflow-hidden bg-white mt-4 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-6">
          {/* Left Block */}
          <div className="w-full lg:w-[45%] xs:text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-3">
              Xây dựng <br className="hidden sm:block" />
              kiến trúc <span className="text-blue-600 inline-block">bền vững</span>
            </h1>
            <p className="text-sm text-slate-600 mb-5 max-w-lg mx-auto lg:mx-0 pr-4 leading-relaxed">
              Đại lý cấp 1 phân phối vật liệu Cát, Đá, Xi măng, Sắt Thép. Năng lực cung ứng linh hoạt cho mọi dự án lớn nhỏ toàn TP.HCM và lân cận.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Link to="/products" className="w-full sm:w-auto text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm text-sm">
                Catalog Kèm Giá
              </Link>
              <a href="tel:0889541507" className="w-full sm:w-auto text-center px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-200 flex items-center justify-center gap-2 text-sm">
                <FaPhoneAlt className="text-blue-600" /> 0889.541.507
              </a>
            </div>

            <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border border-white bg-slate-200" src="https://ui-avatars.com/api/?name=K+H&background=random" alt="Khách" />
                <img className="w-8 h-8 rounded-full border border-white bg-slate-200" src="https://ui-avatars.com/api/?name=Minh&background=random" alt="Khách" />
                <img className="w-8 h-8 rounded-full border border-white bg-slate-200" src="https://ui-avatars.com/api/?name=L&background=random" alt="Khách" />
                <div className="w-8 h-8 rounded-full border border-white bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[9px]">+1K</div>
              </div>
              <div className="text-[11px] font-medium text-slate-500 leading-tight">Đối tác tin tưởng</div>
            </div>
          </div>

          {/* Right Slider Block */}
          <div className="w-full lg:w-[55%] relative">
            <div className="relative aspect-[21/9] lg:aspect-[16/7] rounded-xl overflow-hidden border border-slate-100 shadow-sm">
              {slideImages.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FaShieldAlt size={12} />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-xs uppercase">Nhập Trực Tiếp Từ Mỏ</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHOOSE US - Very Compact */}
      <section className="py-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex gap-4 items-start">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 text-blue-600">
                <FaHardHat size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Đa Dạng Mặt Hàng</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Cát, đá, thép, gạch, xi măng. Có đủ cho móng đến mái.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex gap-4 items-start">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0 text-green-600">
                <FaLeaf size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Chiết Khấu Cao</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Làm việc trực tiếp nhà máy, báo giá sỉ cạnh tranh.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex gap-4 items-start">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0 text-purple-600">
                <FaBuilding size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Giao Hàng Liền</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Xe tải chuyên dụng 2-15T giao đến tận chân công trình.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MODERN RETAIL CATEGORY SHOWCASE (10 Items Compact E-commerce grid) */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-5 border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-900 uppercase">Thư Viện Sản Phẩm</h2>
            <Link to="/products" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
              Xem tất cả <FaArrowRight size={10} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {categoryData.map((cat, idx) => (
              <Link to={`/products?category=${cat.query}`} key={idx} className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center">
                <div className="aspect-[5/4] w-full overflow-hidden bg-slate-50 relative">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2.5 w-full text-center bg-slate-50 border-t border-slate-100 group-hover:bg-blue-50 transition-colors">
                  <h3 className="font-bold text-slate-800 text-xs group-hover:text-blue-700 leading-tight uppercase truncate">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PREMIUM PRICING TICKETS (Compact) */}
      <section className="py-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 uppercase">Báo Giá Khảo Sát</h2>
            <p className="text-slate-500 text-sm mt-1">Liên hệ 0889.541.507 để có giá chiết khấu tại kho.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {priceHighlights.map((block, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                {/* Card Header Minimal */}
                <div className={`${block.bg} px-4 py-3 flex items-center justify-between`}>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide
                                  {block.bg.includes('amber') && 'text-slate-900'}"
                    style={{ color: block.bg.includes('amber') ? '#0f172a' : 'white' }}>
                    {block.category}
                  </h3>
                  <span className="text-white/60 text-xs">Cập nhật</span>
                </div>

                {/* Card Menu Dotted List Minimal */}
                <div className="p-4 flex-grow space-y-3 bg-white">
                  {block.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-dotted border-slate-200 pb-1.5 custom-dotted-leader">
                      <div className="leading-tight">
                        <span className="font-semibold text-slate-700 text-[13px]">{item.name}</span>
                      </div>
                      <div className="text-sm font-bold text-red-600 bg-white pl-2 shrink-0">{item.price} <span className="text-[10px] text-slate-400 font-normal">/{item.unit}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTAs & FOOTER BANNER (Compact) */}
      <section className="py-8 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Nhận Lên Kế Hoạch Báo Giá Vật Tư Dự Án Nhỏ Lớn</h2>
          <p className="text-blue-100 text-sm mb-5">Hỗ trợ chứng từ CO, CQ. Giao hàng chuẩn số lượng, chuẩn tiến độ.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="px-5 py-2.5 bg-white text-blue-600 font-bold rounded-lg shadow-sm text-sm w-full sm:w-auto uppercase">
              Gửi Thông Tin Nhận Báo Giá
            </Link>
            <a href="tel:0889541507" className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg border border-blue-500 text-sm w-full sm:w-auto flex justify-center items-center gap-2 uppercase">
              <FaPhoneAlt size={12} /> 0889.541.507
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
