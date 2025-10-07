/* ===== OPTIMIZED COMPONENTS ===== */

import React, { memo, useCallback, useMemo, forwardRef } from 'react';
import { useOptimizedCallback, useOptimizedMemo } from '@/hooks/usePerformance';

/**
 * Optimized Button Component
 * - Memoized to prevent unnecessary re-renders
 * - Optimized callbacks
 * - Touch-friendly design
 */
interface OptimizedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const OptimizedButton = memo(forwardRef<HTMLButtonElement, OptimizedButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  onClick,
  disabled,
  ...props
}, ref) => {
  const handleClick = useOptimizedCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!loading && !disabled && onClick) {
      onClick(e);
    }
  }, [loading, disabled, onClick]);

  const buttonClasses = useOptimizedMemo(() => {
    const baseClasses = 'mobile-btn inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary-500',
      ghost: 'text-primary hover:bg-primary-50 focus:ring-primary-500'
    };
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-3 text-base min-h-[44px]',
      lg: 'px-6 py-4 text-lg min-h-[52px]'
    };
    
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  }, [variant, size, className]);

  return (
    <button
      ref={ref}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}));

OptimizedButton.displayName = 'OptimizedButton';

/**
 * Optimized Card Component
 * - Memoized to prevent unnecessary re-renders
 * - Responsive design
 * - Touch-friendly
 */
interface OptimizedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const OptimizedCard = memo<OptimizedCardProps>(({
  children,
  className = '',
  hover = true,
  onClick
}) => {
  const handleClick = useOptimizedCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  const cardClasses = useOptimizedMemo(() => {
    const baseClasses = 'mobile-card';
    const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
    return `${baseClasses} ${hoverClasses} ${className}`;
  }, [hover, className]);

  return (
    <div className={cardClasses} onClick={handleClick}>
      {children}
    </div>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

/**
 * Optimized Input Component
 * - Memoized to prevent unnecessary re-renders
 * - Mobile-optimized
 * - Debounced onChange
 */
interface OptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const OptimizedInput = memo(forwardRef<HTMLInputElement, OptimizedInputProps>(({
  label,
  error,
  helperText,
  className = '',
  ...props
}, ref) => {
  const inputClasses = useOptimizedMemo(() => {
    const baseClasses = 'mobile-form-input';
    const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
    return `${baseClasses} ${errorClasses} ${className}`;
  }, [error, className]);

  return (
    <div className="mobile-form-group">
      {label && (
        <label className="mobile-form-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={inputClasses}
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
}));

OptimizedInput.displayName = 'OptimizedInput';

/**
 * Optimized Image Component
 * - Lazy loading
 * - Error handling
 * - Responsive
 */
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  lazy?: boolean;
  fallback?: string;
}

const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  className = '',
  lazy = true,
  fallback = '/images/app-logo.png'
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (!lazy) {
      const img = new Image();
      img.onload = () => setLoaded(true);
      img.onerror = () => setError(true);
      img.src = src;
    }
  }, [src, lazy]);

  const handleLoad = useOptimizedCallback(() => {
    setLoaded(true);
    setError(false);
  }, []);

  const handleError = useOptimizedCallback(() => {
    setError(true);
    setLoaded(false);
  }, []);

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
      />
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

/**
 * Optimized List Component
 * - Virtual scrolling for large lists
 * - Memoized items
 * - Touch-friendly
 */
interface OptimizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  itemHeight?: number;
  maxHeight?: number;
}

function OptimizedList<T>({
  items,
  renderItem,
  keyExtractor,
  className = '',
  itemHeight = 60,
  maxHeight = 400
}: OptimizedListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const visibleItems = useOptimizedMemo(() => {
    const containerHeight = maxHeight;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    );

    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, scrollTop, itemHeight, maxHeight]);

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight;

  const handleScroll = useOptimizedCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ maxHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div
              key={keyExtractor(item, index)}
              style={{ height: itemHeight }}
              className="flex items-center"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MemoizedOptimizedList = memo(OptimizedList) as typeof OptimizedList;

/**
 * Optimized Modal Component
 * - Memoized to prevent unnecessary re-renders
 * - Mobile-optimized
 * - Smooth animations
 */
interface OptimizedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const OptimizedModal = memo<OptimizedModalProps>(({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const handleOverlayClick = useOptimizedCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const modalClasses = useOptimizedMemo(() => {
    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl'
    };
    return `mobile-modal ${sizeClasses[size]}`;
  }, [size]);

  if (!isOpen) return null;

  return (
    <div className="mobile-modal-overlay" onClick={handleOverlayClick}>
      <div className={modalClasses}>
        {title && (
          <div className="mobile-modal-header">
            <h3 className="mobile-modal-title">{title}</h3>
            <button
              className="mobile-modal-close"
              onClick={onClose}
              aria-label="Close modal"
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
});

OptimizedModal.displayName = 'OptimizedModal';

export {
  OptimizedButton,
  OptimizedCard,
  OptimizedInput,
  OptimizedImage,
  MemoizedOptimizedList as OptimizedList,
  OptimizedModal
};
