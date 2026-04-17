import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

// Pages
import AboutPage from '../pages/about/index.js';
import AccountPage from '../pages/account/index.js';
import CheckoutPage from '../pages/checkout/index.js';
import ContactPage from '../pages/contact/index.js';
import OrderHistoryPage from '../pages/history/index.js';
import HomePage from '../pages/home';
import ProductDetailPage from '../pages/products/detail/index.js';
import ProductsPage from '../pages/products/index.js';
import Login from '../pages/user/Login/index.js';
import Register from '../pages/user/Register/index.js';
import Unauthorized from '../pages/user/Unauthorized/index.js';
import PostsPage from '../pages/posts/index.js';
import PostDetailPage from '../pages/posts/detail/index.js';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ExportReport from '../pages/admin/ExportReport';
import InventoryReport from '../pages/admin/InventoryReport';
import AddProducts from '../pages/admin/products/add/index.js';
import ProductDetailDialogAdmin from '../pages/admin/products/detail/index.js';
import AdminProductsPage from '../pages/admin/products/list/index.js';
import EditProductPage from '../pages/admin/products/update/index.js';
import RevenueReport from '../pages/admin/RevenueReport';

// Components & Layouts
import AdminLayout from '../components/layouts/AdminLayout';
import MainLayout from '../components/layouts/MainLayout.js';
import StaffLayout from '../components/layouts/StaffLayout';
import PrivateRoute from '../components/route/PrivateRoute.js';
import { useAuth } from '../contexts/AuthContext.js';
import CostsMana from '../pages/admin/costsMana/index.js';
import ExpenseReport from '../pages/admin/ExpenseReport/index.js';
import OrderManagement from '../pages/admin/orders/index.js';

// Điều hướng dựa trên Role từ Backend (admin, manager, staff, customer)
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (user?.role === 'admin' || user?.role === 'manager') {
    return <Navigate to="/admin" replace />;
  } else if (user?.role === 'staff') {
    return <Navigate to="/staff" replace />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export const Routers = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Role-based redirect */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route index element={<RoleBasedRedirect />} />
        </Route>

        {/* Customer Routes with MainLayout */}
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Posts routes (Public) */}
          <Route path="/bao-gia">
            <Route index element={<PostsPage />} />
            <Route path=":slug" element={<PostDetailPage />} />
          </Route>
          
          <Route path="/tin-tuc">
            <Route index element={<PostsPage />} />
            <Route path=":slug" element={<PostDetailPage />} />
          </Route>
          
          <Route path="/dich-vu">
            <Route index element={<PostsPage />} />
            <Route path=":slug" element={<PostDetailPage />} />
          </Route>

          {/* Private Routes (Require Login) */}
          <Route path="/order-history" element={<PrivateRoute />}>
            <Route index element={<OrderHistoryPage />} />
          </Route>

          <Route path="/account" element={<PrivateRoute />}>
            <Route index element={<AccountPage />} />
          </Route>

          <Route path="/checkout" element={<PrivateRoute />}>
            <Route index element={<CheckoutPage />} />
          </Route>
        </Route>

        {/* Admin Routes with AdminLayout (Cho Admin và Manager) */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<PrivateRoute roles={['admin', 'manager']} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="inventory" element={<InventoryReport />} />
            <Route path="export" element={<ExportReport />} />
            <Route path="revenue" element={<RevenueReport />} />
            <Route path="list-products" element={<AdminProductsPage />} />
            <Route path="add-products" element={<AddProducts />} />
            <Route path="expense-report" element={<ExpenseReport />} />
            <Route path="costs-mana" element={<CostsMana />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="edit-product/:id" element={<EditProductPage />} />
            <Route path="product/:id" element={<ProductDetailDialogAdmin />} />
          </Route>
        </Route>

        {/* Staff Routes with StaffLayout (Cho Staff - Thủ kho) */}
        <Route element={<StaffLayout />}>
          <Route path="/staff" element={<PrivateRoute roles={['admin', 'manager', 'staff']} />}>
            <Route index element={<InventoryReport />} />
          </Route>
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
