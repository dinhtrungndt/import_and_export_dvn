import { Outlet } from 'react-router-dom';
import { HeaderPage } from '../header';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderPage />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-slate-300 mt-auto py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Hệ Thống Phân Phối VLXD DVN</h3>
          <p className="text-sm mb-4">Chuyên cung cấp Cát, Đá, Xi măng, Sắt thép sỉ và lẻ toàn quốc.</p>
          <div className="text-sm border-t border-slate-700 pt-4 mt-4">
            <p>© {new Date().getFullYear()} VLXD DVN. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
