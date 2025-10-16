import React from 'react';
import ProductProvider from './hooks/provider/ProductProvider';
import ShoppingCartProvider from './hooks/provider/ShoppingCartProvider';
import { KioskProvider } from './hooks/context/KioskContext';
import { ToastProvider } from './components/shared/Toast';
import { PWAProvider } from './components/shared/PWA';
import ScrollToTop from './components/shared/ScrollToTop.tsx';
import Router from './Router.tsx';
import { ErrorBoundary } from './components/shared/LoadingStates';
import { AccessibilitySettings, LiveRegion } from './components/shared/Accessibility';
import { useAnnouncer } from './components/shared/Accessibility';
import { useOfflineMode } from './hooks/useOfflineStore';
import OfflineIndicator from './components/shared/OfflineIndicator';

function AppContent() {
  const { announce, announcement } = useAnnouncer();
  
  // Initialize offline mode
  const { isOnline, syncData } = useOfflineMode();

  // Sync data when online
  React.useEffect(() => {
    if (isOnline) {
      syncData();
    }
  }, [isOnline, syncData]);

  return (
    <>
      <ScrollToTop />
      <Router />
      <AccessibilitySettings />
      <LiveRegion announcement={announcement} />
      <OfflineIndicator />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PWAProvider>
        <ToastProvider>
          <ProductProvider>
            <ShoppingCartProvider>
              <KioskProvider>
                <AppContent />
              </KioskProvider>
            </ShoppingCartProvider>
          </ProductProvider>
        </ToastProvider>
      </PWAProvider>
    </ErrorBoundary>
  );
}