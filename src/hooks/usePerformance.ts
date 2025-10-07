import React, { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * useOptimizedCallback Hook
 * 
 * Hook để optimize callbacks và tránh unnecessary re-renders
 * Sử dụng useCallback với dependency array được memoized
 */
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = callback;
  });

  return useCallback(
    ((...args: any[]) => ref.current?.(...args)) as T,
    deps
  );
};

/**
 * useDebouncedCallback Hook
 * 
 * Hook để debounce function calls và tránh excessive API calls
 * Hữu ích cho search, form validation, etc.
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay, ...deps]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback as T;
};

/**
 * useMemoizedSelector Hook
 * 
 * Hook để memoize complex selectors và tránh expensive computations
 * Tương tự như reselect library nhưng đơn giản hơn
 */
export const useMemoizedSelector = <T>(
  selector: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(selector, deps);
};

/**
 * usePrevious Hook
 * 
 * Hook để lưu trữ giá trị trước đó của một value
 * Hữu ích để detect changes và optimize effects
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

/**
 * useIsFirstRender Hook
 * 
 * Hook để detect nếu đây là lần render đầu tiên
 * Hữu ích để skip effects trong lần render đầu
 */
export const useIsFirstRender = (): boolean => {
  const isFirstRender = useRef(true);
  
  useEffect(() => {
    isFirstRender.current = false;
  }, []);
  
  return isFirstRender.current;
};

/**
 * useStableCallback Hook
 * 
 * Hook để tạo stable callback reference
 * Tránh re-renders của child components khi pass callbacks
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef<T>(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  });
  
  return useCallback(
    ((...args: any[]) => callbackRef.current(...args)) as T,
    []
  );
};

/**
 * usePerformanceMonitor Hook
 * 
 * Hook để monitor performance của components
 * Chỉ hoạt động trong development mode
 */
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    renderCount.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      const renderTime = Date.now() - startTime.current;
      console.log(`[Performance] ${componentName} rendered ${renderCount.current} times in ${renderTime}ms`);
    }
    
    startTime.current = Date.now();
  });
  
  return {
    renderCount: renderCount.current,
    componentName
  };
};

/**
 * useOptimizedState Hook
 * 
 * Hook để optimize state updates và tránh unnecessary re-renders
 * Sử dụng functional updates khi có thể
 */
export const useOptimizedState = <T>(initialState: T) => {
  const [state, setState] = React.useState(initialState);
  
  const setOptimizedState = useCallback((newState: T | ((prev: T) => T)) => {
    if (typeof newState === 'function') {
      setState(newState);
    } else {
      setState(prevState => {
        // Only update if state actually changed
        if (Object.is(prevState, newState)) {
          return prevState;
        }
        return newState;
      });
    }
  }, []);
  
  return [state, setOptimizedState] as const;
};

/**
 * useLazyInitialState Hook
 * 
 * Hook để lazy initialize state và tránh expensive computations
 * Chỉ tính toán initial state một lần
 */
export const useLazyInitialState = <T>(initializer: () => T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = React.useState(initializer);
  return [state, setState];
};

/**
 * useConditionalEffect Hook
 * 
 * Hook để chạy effects với điều kiện
 * Tránh unnecessary effect executions
 */
export const useConditionalEffect = (
  effect: React.EffectCallback,
  condition: boolean,
  deps?: React.DependencyList
) => {
  useEffect(() => {
    if (condition) {
      return effect();
    }
  }, [condition, ...(deps || [])]);
};
