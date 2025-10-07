/* ===== NATIVE-LIKE UX COMPONENTS ===== */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Native-like Page Transition
 * Simulates native app page transitions
 */
interface NativePageTransitionProps {
  children: React.ReactNode;
  direction?: 'forward' | 'back' | 'none';
  duration?: number;
}

export const NativePageTransition: React.FC<NativePageTransitionProps> = ({
  children,
  direction = 'forward',
  duration = 300
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState(direction);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTransitioning(true);
    setTransitionDirection(direction);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [direction, duration]);

  const getTransitionClass = () => {
    if (!isTransitioning) return '';
    
    switch (transitionDirection) {
      case 'forward':
        return 'animate-slide-in-right';
      case 'back':
        return 'animate-slide-in-left';
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`native-page-transition ${getTransitionClass()}`}
      style={{
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        transition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        WebkitTransition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
      }}
    >
      {children}
    </div>
  );
};

/**
 * Native-like Stack Navigation
 * Simulates native stack navigation behavior
 */
interface NativeStackNavigationProps {
  children: React.ReactNode;
}

export const NativeStackNavigation: React.FC<NativeStackNavigationProps> = ({
  children
}) => {
  const [navigationStack, setNavigationStack] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pathname = location.pathname;
    
    if (pathname !== currentPage) {
      setNavigationStack(prev => [...prev, currentPage].filter(Boolean));
      setCurrentPage(pathname);
    }
  }, [location.pathname, currentPage]);

  const goBack = useCallback(() => {
    if (navigationStack.length > 0) {
      const previousPage = navigationStack[navigationStack.length - 1];
      setNavigationStack(prev => prev.slice(0, -1));
      navigate(previousPage);
    } else {
      navigate(-1);
    }
  }, [navigationStack, navigate]);

  const canGoBack = navigationStack.length > 0;

  return (
    <div className="native-stack-navigation">
      {canGoBack && (
        <button
          onClick={goBack}
          className="native-back-button"
          style={{
            position: 'fixed',
            top: '60px',
            left: '20px',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            transition: 'all 0.2s ease',
            WebkitTransition: 'all 0.2s ease'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      )}
      <NativePageTransition>
        {children}
      </NativePageTransition>
    </div>
  );
};

/**
 * Native-like Swipe Gestures
 * Handles swipe gestures like native apps
 */
interface NativeSwipeGestureProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  className?: string;
}

export const NativeSwipeGesture: React.FC<NativeSwipeGestureProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = ''
}) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > threshold) {
        if (deltaX > 0) {
          onSwipeLeft?.();
        } else {
          onSwipeRight?.();
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > threshold) {
        if (deltaY > 0) {
          onSwipeUp?.();
        } else {
          onSwipeDown?.();
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`native-swipe-gesture ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: 'pan-x pan-y',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {children}
    </div>
  );
};

/**
 * Native-like Pull to Refresh
 * Implements pull-to-refresh functionality
 */
interface NativePullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  className?: string;
}

export const NativePullToRefresh: React.FC<NativePullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 80,
  className = ''
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;

    if (deltaY > 0) {
      e.preventDefault();
      const distance = Math.min(deltaY * 0.5, threshold * 1.5);
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  };

  const refreshIndicatorStyle = {
    transform: `translateY(${Math.max(0, pullDistance - threshold)}px)`,
    WebkitTransform: `translateY(${Math.max(0, pullDistance - threshold)}px)`,
    opacity: Math.min(1, pullDistance / threshold)
  };

  return (
    <div
      ref={containerRef}
      className={`native-pull-to-refresh ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}
    >
      {/* Refresh Indicator */}
      <div
        className="refresh-indicator"
        style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          WebkitTransform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          background: 'white',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          WebkitTransition: 'all 0.3s ease',
          ...refreshIndicatorStyle
        }}
      >
        {isRefreshing ? (
          <div
            className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"
            style={{
              animation: 'spin 1s linear infinite',
              WebkitAnimation: 'spin 1s linear infinite'
            }}
          />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16M21 8v8M3 16v-8"/>
          </svg>
        )}
      </div>

      {children}
    </div>
  );
};

/**
 * Native-like Haptic Feedback
 * Provides haptic feedback for touch interactions
 */
export const useNativeHaptic = () => {
  const lightHaptic = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  const mediumHaptic = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, []);

  const heavyHaptic = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  }, []);

  const successHaptic = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
  }, []);

  const errorHaptic = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }, []);

  return {
    lightHaptic,
    mediumHaptic,
    heavyHaptic,
    successHaptic,
    errorHaptic
  };
};

/**
 * Native-like Loading States
 * Provides native-like loading animations
 */
interface NativeLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const NativeLoading: React.FC<NativeLoadingProps> = ({
  size = 'md',
  color = '#3b82f6',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin`}
        style={{
          color,
          animation: 'spin 1s linear infinite',
          WebkitAnimation: 'spin 1s linear infinite'
        }}
      />
    </div>
  );
};

/**
 * Native-like Toast Notifications
 * Provides native-like toast notifications
 */
interface NativeToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const NativeToast: React.FC<NativeToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div
      className={`fixed top-4 left-4 right-4 z-50 ${typeStyles[type]} px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="ml-2 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};
