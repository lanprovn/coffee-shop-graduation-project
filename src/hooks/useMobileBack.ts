/**
 * Custom hook để handle back navigation trên mobile
 * Frontend-only, không có API calls
 */

import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseMobileBackOptions {
  onBack?: () => void;
  fallbackPath?: string;
}

export function useMobileBack(options: UseMobileBackOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { onBack, fallbackPath = '/' } = options;

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }

    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to home page
      navigate(fallbackPath);
    }
  }, [navigate, onBack, fallbackPath]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // Browser back button was pressed
      // React Router will handle this automatically
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handle Android hardware back button (for APK)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        handleBack();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleBack]);

  return {
    handleBack,
    canGoBack: window.history.length > 1,
    currentPath: location.pathname
  };
}

/**
 * Hook để detect mobile device
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
}
