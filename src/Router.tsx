import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PageLoading from '@/components/shared/PageLoading';

// POS Kiosk - Lazy load for better performance
const POSKioskApp = lazy(() => import('@/pages/POSKioskApp'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));

/**
 * POS Kiosk Router - POS, Checkout and Product Detail routes
 * 
 * Chứa route POS Kiosk, Checkout và Product Detail
 */
export default function Router() {
  return (
    <Suspense fallback={<PageLoading show={true} message="Đang khởi động POS..." />}>
      <Routes>
        {/* POS Kiosk - Main route */}
        <Route path="/" element={<POSKioskApp />} />
        <Route path="/pos" element={<POSKioskApp />} />
        
        {/* Product Detail Page */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
        
        {/* Checkout Page */}
        <Route path="/checkout" element={<CheckoutPage />} />
        
        {/* Redirect all other routes to POS */}
        <Route path="*" element={<POSKioskApp />} />
      </Routes>
    </Suspense>
  );
}