import { useState, useRef, useEffect } from 'react';
import { classNames } from '@/utils/helper';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallback?: string;
}

/**
 * OptimizedImage Component
 * 
 * Component để optimize image loading với:
 * - Lazy loading
 * - Placeholder while loading
 * - Error fallback
 * - Progressive loading
 * 
 * TODO: Implement WebP support và responsive images
 */
export default function OptimizedImage({
  src,
  alt,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  lazy = true,
  onLoad,
  onError,
  fallback = '/images/app-logo.png'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before image comes into view
        threshold: 0.1
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const imageSrc = hasError ? fallback : (isInView ? src : placeholder);

  return (
    <div className={classNames('relative overflow-hidden', className)}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={classNames(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          'w-full h-full object-cover'
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
      />
      
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Image not available</div>
        </div>
      )}
    </div>
  );
}
