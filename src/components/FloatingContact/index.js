import { useState } from 'react';
import { BsChatSquareDotsFill } from 'react-icons/bs';
import { FaFacebookF, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import LiveChat from './LiveChat';

const FloatingContactWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Phone number config
  const phoneNumber = '0889541507';

  const ZaloIcon = () => (
    <svg fill="#0068FF" className="w-8 h-8" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Zalo</title><path d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9436 0 1.0746.8697 1.9453 1.945 1.9453z"/></svg>
  );

  return (
    <>
      {/* Cột các nút thao tác nhanh (FAB) */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-4 z-40">

        {/* Nút Bản đồ (Map) */}
        <a
          href="https://maps.google.com/?q=Đại+Lý+VLXD+DVN"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group cursor-pointer"
        >
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg z-10 relative">
            <FaMapMarkerAlt size={20} />
          </div>
          {/* Vòng lan tỏa (Ripple Pulse) */}
          <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-40 group-hover:hidden"></div>
          <div className="absolute -inset-1.5 bg-red-500 rounded-full animate-pulse opacity-20 group-hover:hidden"></div>
        </a>

        {/* Nút Facebook */}
        <a
          href="https://facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group cursor-pointer"
        >
          <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-lg z-10 relative">
            <FaFacebookF size={20} />
          </div>
          <div className="absolute inset-0 bg-[#1877F2] rounded-full animate-ping opacity-40 group-hover:hidden"></div>
          <div className="absolute -inset-1.5 bg-[#1877F2] rounded-full animate-pulse opacity-20 group-hover:hidden"></div>
        </a>

        {/* Nút Zalo */}
        <a
          href="https://zalo.me/0889541507"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group cursor-pointer"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-white shadow-lg z-10 relative border-2 border-blue-100">
            <ZaloIcon />
          </div>
          <div className="absolute inset-0 bg-[#0068FF] rounded-full animate-ping opacity-40 group-hover:hidden scale-110"></div>
          <div className="absolute -inset-1.5 bg-[#0068FF] rounded-full animate-pulse opacity-20 group-hover:hidden"></div>
        </a>

        {/* Nút Gọi Điện (Phone) */}
        <a
          href={`tel:${phoneNumber}`}
          className="relative group cursor-pointer"
        >
          <div className="w-12 h-12 bg-[#E11D48] rounded-full flex items-center justify-center text-white shadow-lg z-10 relative">
            <FaPhoneAlt size={20} className="animate-pulse" />
          </div>
          <div className="absolute inset-0 bg-[#E11D48] rounded-full animate-ping opacity-40 group-hover:hidden scale-150 duration-1000"></div>
          <div className="absolute -inset-2 bg-[#E11D48] rounded-full animate-pulse opacity-20 group-hover:hidden duration-1000 delay-150"></div>
        </a>

        {/* Nút Mở Live Chat Trực Tiếp */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative group cursor-pointer mt-2"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl z-10 relative transition-transform duration-300 hover:scale-110 ${isChatOpen ? 'bg-slate-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
            <BsChatSquareDotsFill size={26} />
          </div>
          {!isChatOpen && (
            <div className="absolute -top-3 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-bounce">
              Hỗ trợ
            </div>
          )}
        </button>

      </div>

      {/* Render Component Chat Mini */}
      <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default FloatingContactWidget;
