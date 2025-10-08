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
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useOfflineMode } from './hooks/useOfflineStore';
import { useAnalytics } from './hooks/useAdvancedAnalytics';
import { useABTesting } from './hooks/useABTesting';
import OfflineIndicator from './components/shared/OfflineIndicator';

function AppContent() {
  const { announce, announcement } = useAnnouncer();
  
  // Initialize theme system
  useTheme();
  
  // Initialize keyboard shortcuts
  const { HelpModal } = useKeyboardShortcuts({
    enabled: true,
    showHelp: true,
    helpKey: '?',
  });

  // Initialize offline mode
  const { isOnline, syncData } = useOfflineMode();
  
  // Initialize analytics
  const { trackPageView, setUserId } = useAnalytics();
  
  // Initialize A/B testing
  const { setUserId: setABUserId } = useABTesting();

  // Track page view on mount
  React.useEffect(() => {
    trackPageView(window.location.pathname);
  }, [trackPageView]);

  // Set user ID for analytics and A/B testing
  React.useEffect(() => {
    const userId = localStorage.getItem('highland-user-id');
    if (userId) {
      setUserId(userId);
      setABUserId(userId);
    }
  }, [setUserId, setABUserId]);

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
      <SupportChatWidget />
      <ShareModal />
      <AccessibilitySettings />
      <LiveRegion announcement={announcement} />
      <HelpModal />
      <OfflineIndicator />
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
