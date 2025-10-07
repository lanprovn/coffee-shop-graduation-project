/* ===== PERFORMANCE OPTIMIZATION HOOKS ===== */

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

/**
 * Hook để tối ưu re-render với useCallback
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

/**
 * Hook để tối ưu computed values với useMemo
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

/**
 * Hook để debounce function calls
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

/**
 * Hook để throttle function calls
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    }
  }, [callback, delay]) as T;
}

/**
 * Hook để lazy load components
 */
export function useLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    importFunc()
      .then((module) => {
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [importFunc]);
  
  if (loading) {
    return fallback ? fallback : null;
  }
  
  if (error) {
    console.error('Lazy loading error:', error);
    return null;
  }
  
  return Component;
}

/**
 * Hook để optimize scroll events
 */
export function useOptimizedScroll(
  callback: (scrollY: number, scrollX: number) => void,
  throttleDelay: number = 16
) {
  const throttledCallback = useThrottle(callback, throttleDelay);
  
  useEffect(() => {
    const handleScroll = () => {
      throttledCallback(window.scrollY, window.scrollX);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [throttledCallback]);
}

/**
 * Hook để optimize resize events
 */
export function useOptimizedResize(
  callback: (width: number, height: number) => void,
  throttleDelay: number = 100
) {
  const throttledCallback = useThrottle(callback, throttleDelay);
  
  useEffect(() => {
    const handleResize = () => {
      throttledCallback(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [throttledCallback]);
}

/**
 * Hook để optimize intersection observer
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options, hasIntersected]);
  
  return { isIntersecting, hasIntersected };
}

/**
 * Hook để optimize image loading
 */
export function useOptimizedImage(src: string, lazy: boolean = true) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { isIntersecting } = useIntersectionObserver(imgRef, {
    rootMargin: '50px'
  });
  
  useEffect(() => {
    if (!lazy || isIntersecting) {
      const img = new Image();
      img.onload = () => setLoaded(true);
      img.onerror = () => setError(true);
      img.src = src;
    }
  }, [src, lazy, isIntersecting]);
  
  return {
    loaded,
    error,
    imgRef,
    shouldLoad: !lazy || isIntersecting
  };
}

/**
 * Hook để optimize list rendering với virtualization
 */
export function useVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  useOptimizedScroll(
    useCallback((scrollY) => {
      setScrollTop(scrollY);
    }, []),
    16
  );
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex
  };
}

/**
 * Hook để optimize form inputs
 */
export function useOptimizedForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: (values: T) => Partial<Record<keyof T, string>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    if (validationSchema) {
      const fieldErrors = validationSchema({ ...values, [field]: value });
      setErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  }, [values, validationSchema]);
  
  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);
  
  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    reset,
    isValid
  };
}

/**
 * Hook để optimize API calls với caching
 */
export function useOptimizedAPI<T>(
  apiCall: () => Promise<T>,
  cacheKey: string,
  cacheTime: number = 5 * 60 * 1000 // 5 minutes
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  
  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = cacheRef.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      
      // Cache the result
      cacheRef.current.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [apiCall, cacheKey, cacheTime]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook để optimize component mounting/unmounting
 */
export function useOptimizedMount() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  return mounted;
}

/**
 * Hook để optimize expensive calculations
 */
export function useOptimizedCalculation<T>(
  calculation: () => T,
  deps: React.DependencyList,
  cacheKey?: string
) {
  const cacheRef = useRef<Map<string, T>>(new Map());
  
  return useMemo(() => {
    if (cacheKey) {
      const cached = cacheRef.current.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }
    }
    
    const result = calculation();
    
    if (cacheKey) {
      cacheRef.current.set(cacheKey, result);
    }
    
    return result;
  }, deps);
}

/**
 * Hook để optimize event listeners
 */
export function useOptimizedEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
) {
  const handlerRef = useRef(handler);
  
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);
  
  useEffect(() => {
    const eventHandler = (event: WindowEventMap[K]) => {
      handlerRef.current(event);
    };
    
    window.addEventListener(event, eventHandler, options);
    
    return () => {
      window.removeEventListener(event, eventHandler);
    };
  }, [event, options]);
}

/**
 * Hook để optimize component visibility
 */
export function useOptimizedVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return isVisible;
}