import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DevicePhoneMobileIcon, ComputerDesktopIcon, ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PWAInstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  onInstall,
  onDismiss
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      // Check if running on iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
        if (isInStandaloneMode) {
          setIsInstalled(true);
          return;
        }
      }
    };

    checkIfInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      onInstall?.();
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    onDismiss?.();
    
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || showPrompt === false) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Cài đặt Highland Coffee
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                  Cài đặt ứng dụng để truy cập nhanh hơn và có trải nghiệm tốt nhất
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleInstall}
                    className="flex-1 bg-primary text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowDownTrayIcon className="w-3 h-3" />
                    Cài đặt
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// PWA Update Available Component
export const PWAUpdateAvailable: React.FC<{
  onUpdate?: () => void;
  onDismiss?: () => void;
}> = ({ onUpdate, onDismiss }) => {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          setShowUpdate(true);
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    window.location.reload();
    onUpdate?.();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    onDismiss?.();
  };

  if (!showUpdate) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <ArrowDownTrayIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Cập nhật có sẵn
              </h3>
              <p className="text-xs text-blue-700 mb-3">
                Phiên bản mới của ứng dụng đã sẵn sàng
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cập nhật ngay
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-2 text-blue-400 hover:text-blue-600 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Offline Indicator
export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm font-medium"
    >
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        Bạn đang offline. Một số tính năng có thể không khả dụng.
      </div>
    </motion.div>
  );
};

// PWA Status Hook
export const usePWAStatus = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check installation status
    const checkInstallation = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;
      
      setIsStandalone(isStandaloneMode || isIOSStandalone);
      setIsInstalled(isStandaloneMode || isIOSStandalone);
    };

    checkInstallation();

    // Listen for online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isInstalled,
    isStandalone,
    isOnline,
    canInstall: !isInstalled && 'serviceWorker' in navigator
  };
};

// PWA Provider Component
export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <PWAInstallPrompt />
      <PWAUpdateAvailable />
      <OfflineIndicator />
    </>
  );
};
