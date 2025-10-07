/* ===== APK COMPATIBLE COMPONENTS ===== */

import React, { useEffect, useRef, useState } from 'react';

/**
 * APK-Compatible Scroll Container
 * Fixes scroll issues in WebView/Capacitor
 */
interface APKScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

export const APKScrollContainer: React.FC<APKScrollContainerProps> = ({
  children,
  className = '',
  onScroll
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onScroll) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      onScroll(target.scrollTop);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onScroll]);

  return (
    <div
      ref={containerRef}
      className={`webview-scroll scroll-container ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
        overflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}
    >
      {children}
    </div>
  );
};

/**
 * APK-Compatible Modal
 * Fixes overlay and z-index issues in WebView
 */
interface APKModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const APKModal: React.FC<APKModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus management
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div
      className="modal-overlay webview-container"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <div
        ref={modalRef}
        className={`modal ${sizeClasses[size]} webview-container`}
        style={{
          position: 'relative',
          zIndex: 10000,
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          background: 'white',
          borderRadius: '1rem',
          maxWidth: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        {title && (
          <div className="mobile-modal-header">
            <h3 className="mobile-modal-title">{title}</h3>
            <button
              className="mobile-modal-close"
              onClick={onClose}
              aria-label="Close modal"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '0.25rem',
                minHeight: '44px',
                minWidth: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        )}
        <div className="mobile-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * APK-Compatible Input
 * Fixes input issues in WebView (zoom, focus, keyboard)
 */
interface APKInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const APKInput: React.FC<APKInputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    // Fix iOS zoom issue
    input.style.fontSize = '16px';
    
    // Fix WebView focus issues
    const handleFocus = () => {
      input.style.outline = 'none';
      input.style.webkitTapHighlightColor = 'transparent';
    };

    input.addEventListener('focus', handleFocus);
    return () => input.removeEventListener('focus', handleFocus);
  }, []);

  const inputClasses = `mobile-form-input ${error ? 'border-red-500' : ''} ${className}`;

  return (
    <div className="mobile-form-group">
      {label && (
        <label className="mobile-form-label">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        className={inputClasses}
        style={{
          fontSize: '16px',
          WebkitAppearance: 'none',
          appearance: 'none',
          borderRadius: '8px',
          border: '2px solid #e5e7eb',
          padding: '12px',
          background: 'white',
          minHeight: '44px',
          WebkitTapHighlightColor: 'transparent'
        }}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};

/**
 * APK-Compatible Button
 * Fixes touch and animation issues in WebView
 */
interface APKButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const APKButton: React.FC<APKButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Fix WebView touch issues
    button.style.webkitTapHighlightColor = 'transparent';
    button.style.webkitTouchCallout = 'none';
    button.style.webkitUserSelect = 'none';
    button.style.userSelect = 'none';

    // Fix WebView animation
    button.style.transform = 'translateZ(0)';
    button.style.webkitTransform = 'translateZ(0)';
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!loading && !disabled && onClick) {
      // Add haptic feedback for WebView
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onClick(e);
    }
  };

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-600',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-primary-50'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]'
  };

  const buttonClasses = `mobile-btn touchable ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      ref={buttonRef}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      style={{
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        transition: 'all 0.2s ease',
        WebkitTransition: 'all 0.2s ease'
      }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            style={{
              animation: 'spin 1s linear infinite',
              WebkitAnimation: 'spin 1s linear infinite'
            }}
          />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

/**
 * APK-Compatible Image
 * Fixes image loading and display issues in WebView
 */
interface APKImageProps {
  src: string;
  alt: string;
  className?: string;
  lazy?: boolean;
  fallback?: string;
}

export const APKImage: React.FC<APKImageProps> = ({
  src,
  alt,
  className = '',
  lazy = true,
  fallback = '/images/app-logo.png'
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lazy) {
      const img = new Image();
      img.onload = () => setLoaded(true);
      img.onerror = () => setError(true);
      img.src = src;
    }
  }, [src, lazy]);

  const handleLoad = () => {
    setLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setLoaded(false);
  };

  const imageSrc = error ? fallback : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        style={{
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          imageRendering: '-webkit-optimize-contrast',
          imageRendering: 'optimize-contrast'
        }}
      />
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
};

/**
 * APK-Compatible Safe Area Container
 * Handles safe areas for notched devices
 */
interface APKSafeAreaProps {
  children: React.ReactNode;
  className?: string;
  sides?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const APKSafeArea: React.FC<APKSafeAreaProps> = ({
  children,
  className = '',
  sides = ['top', 'bottom', 'left', 'right']
}) => {
  const safeAreaStyles: React.CSSProperties = {};

  if (sides.includes('top')) {
    safeAreaStyles.paddingTop = 'env(safe-area-inset-top, 0px)';
  }
  if (sides.includes('bottom')) {
    safeAreaStyles.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
  }
  if (sides.includes('left')) {
    safeAreaStyles.paddingLeft = 'env(safe-area-inset-left, 0px)';
  }
  if (sides.includes('right')) {
    safeAreaStyles.paddingRight = 'env(safe-area-inset-right, 0px)';
  }

  return (
    <div className={`safe-area-all ${className}`} style={safeAreaStyles}>
      {children}
    </div>
  );
};

/**
 * APK-Compatible Keyboard Aware Container
 * Handles keyboard appearance in WebView
 */
interface APKKeyboardAwareProps {
  children: React.ReactNode;
  className?: string;
}

export const APKKeyboardAware: React.FC<APKKeyboardAwareProps> = ({
  children,
  className = ''
}) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      // Detect keyboard height in WebView
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      const keyboardHeight = windowHeight - viewportHeight;
      setKeyboardHeight(Math.max(0, keyboardHeight));
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport?.removeEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div
      className={`keyboard-aware ${className}`}
      style={{
        paddingBottom: `${keyboardHeight}px`,
        transition: 'padding-bottom 0.3s ease',
        WebkitTransition: 'padding-bottom 0.3s ease'
      }}
    >
      {children}
    </div>
  );
};
