import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PageLoading from '@/components/shared/PageLoading';

// Layouts - Keep these synchronous as they're needed immediately
import AppLayout from '@/components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProductListPage = lazy(() => import('./pages/ProductListPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const News = lazy(() => import('./pages/NewsPage'));
const StoresPage = lazy(() => import('./pages/StoresPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const MembershipPage = lazy(() => import('./pages/MembershipPage'));
const DeliveryPage = lazy(() => import('./pages/DeliveryPage'));
const HotDrinkPage = lazy(() => import('@/pages/ProductListPage/HotDrinkPage'));
const ColdDrinkPage = lazy(() => import('@/pages/ProductListPage/ColdDrinkPage'));
const CartPage = lazy(() => import('@/pages/CartPage/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage/CheckoutPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));

// Admin pages - Lazy load as they're less frequently accessed
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const StockManagementPage = lazy(() => import('@/pages/admin/StockManagementPage'));
const VoucherManagementPage = lazy(() => import('@/pages/admin/VoucherManagementPage'));
const AdminMembershipPage = lazy(() => import('@/pages/admin/MembershipPage'));
const RevenueDashboardPage = lazy(() => import('@/pages/admin/RevenueDashboardPage'));

/**
 * Router Component với Lazy Loading
 * 
 * Sử dụng React.lazy() để code splitting và giảm bundle size
 * Mỗi page sẽ được load chỉ khi cần thiết
 * 
 * Performance Benefits:
 * - Giảm initial bundle size
 * - Faster initial page load
 * - Better caching strategy
 * - Improved Core Web Vitals
 */
export default function Router() {
  return (
    <Suspense fallback={<PageLoading show={true} message="Đang tải trang..." />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/menu" element={<ProductListPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/news" element={<News />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/menu/hot" element={<HotDrinkPage />} />
          <Route path="/menu/cold" element={<ColdDrinkPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Admin Routes - Lazy loaded */}
          <Route path="/admin" element={<AdminDashboardPage />}>
            <Route path="stock" element={<StockManagementPage />} />
            <Route path="voucher" element={<VoucherManagementPage />} />
            <Route path="membership" element={<AdminMembershipPage />} />
            <Route path="revenue" element={<RevenueDashboardPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}