import AuthProvider from './hooks/provider/AuthProvider';
import ProductProvider from './hooks/provider/ProductProvider';
import ShoppingCartProvider from './hooks/provider/ShoppingCartProvider';
import ModalProvider from './hooks/provider/ModalProvider/index.tsx';
import UserAddressProvider from './hooks/provider/UserAddressProvider.tsx';
import { NotificationProvider } from './hooks/useNotification';
import { ToastProvider } from './components/shared/Toast';
import { PWAProvider } from './components/shared/PWA';
import ScrollToTop from './components/shared/ScrollToTop.tsx';
import Router from './Router.tsx';
import { SupportChatWidget } from './hooks/useSupportChat';
import { ShareModal } from './hooks/useSocialShare';
import { ErrorBoundary } from './components/shared/LoadingStates';
import { AccessibilitySettings, LiveRegion } from './components/shared/Accessibility';
import { useAnnouncer } from './components/shared/Accessibility';

function AppContent() {
  const { announce, announcement } = useAnnouncer();

  return (
    <>
      <ScrollToTop />
      <Router />
      <SupportChatWidget />
      <ShareModal />
      <AccessibilitySettings />
      <LiveRegion announcement={announcement} />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PWAProvider>
        <ToastProvider>
          <NotificationProvider>
            <AuthProvider>
              <UserAddressProvider>
                <ProductProvider>
                  <ShoppingCartProvider>
                    <ModalProvider>
                      <AppContent />
                    </ModalProvider>
                  </ShoppingCartProvider>
                </ProductProvider>
              </UserAddressProvider>
            </AuthProvider>
          </NotificationProvider>
        </ToastProvider>
      </PWAProvider>
    </ErrorBoundary>
  );
}
