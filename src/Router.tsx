import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PageLoading from '@/components/shared/PageLoading';

// POS Kiosk - Lazy load for better performance
const POSKioskApp = lazy(() => import('@/pages/POSKioskApp'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));

/**
 * POS Kiosk Router - POS and Checkout routes
 * 
 * Chứa route POS Kiosk và Checkout
 */
export default function Router() {
  return (
    <Suspense fallback={<PageLoading show={true} message="Đang khởi động POS..." />}>
      <Routes>
        {/* POS Kiosk - Main route */}
        <Route path="/" element={<POSKioskApp />} />
        <Route path="/pos" element={<POSKioskApp />} />
        
        {/* Checkout Page */}
        <Route path="/checkout" element={<CheckoutPage />} />
        
        {/* Redirect all other routes to POS */}
        <Route path="*" element={<POSKioskApp />} />
      </Routes>
    </Suspense>
  );
}