import { Outlet } from 'react-router-dom';
import { Footer } from '../footer/index.js';
import { HeaderPage } from '../header';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderPage />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
