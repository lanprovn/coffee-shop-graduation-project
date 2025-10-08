import AuthProvider from './hooks/provider/AuthProvider';
import ProductProvider from './hooks/provider/ProductProvider';
import ShoppingCartProvider from './hooks/provider/ShoppingCartProvider';
import ModalProvider from './hooks/provider/ModalProvider/index.tsx';
import UserAddressProvider from './hooks/provider/UserAddressProvider.tsx';
import { NotificationProvider } from './hooks/useNotification';
import ScrollToTop from './components/shared/ScrollToTop.tsx';
import Router from './Router.tsx';
import { SupportChatWidget } from './hooks/useSupportChat';
import { ShareModal } from './hooks/useSocialShare';
import ErrorBoundary from './components/shared/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error for monitoring
        console.error('App Error:', error, errorInfo);

        // In production, send to error reporting service
        if (process.env.NODE_ENV === 'production') {
          // Example: Sentry.captureException(error, { extra: errorInfo });
        }
      }}
    >
      <NotificationProvider>
        <AuthProvider>
          <UserAddressProvider>
            <ProductProvider>
              <ShoppingCartProvider>
                <ModalProvider>
                  <ScrollToTop />
                  <Router />
                  <SupportChatWidget />
                  <ShareModal />
                </ModalProvider>
              </ShoppingCartProvider>
            </ProductProvider>
          </UserAddressProvider>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}
