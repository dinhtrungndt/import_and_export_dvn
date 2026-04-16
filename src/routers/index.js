import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AccountPage } from '../pages/account';
import { CartPage } from '../pages/cart';
import { ContactPage } from '../pages/contact';
import OrderHistoryPage from '../pages/history';
import HomePage from '../pages/home';
import ProductsPage from '../pages/products';
import ProductDetailPage from '../pages/products/detail';

export const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
};
