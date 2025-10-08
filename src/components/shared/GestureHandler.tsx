import React, { useRef, useEffect, useCallback } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';

interface GestureConfig {
  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  pinchThreshold?: number;
}

interface GestureCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  onPinchIn?: () => void;
  onPinchOut?: () => void;
  onTap?: () => void;
}

interface GestureHandlerProps {
  children: React.ReactNode;
  config?: GestureConfig;
  callbacks?: GestureCallbacks;
  className?: string;
  disabled?: boolean;
}

const defaultConfig: GestureConfig = {
  swipeThreshold: 50,
  longPressDelay: 500,
  doubleTapDelay: 300,
  pinchThreshold: 0.1,
};

export const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  config = {},
  callbacks = {},
  className = '',
  disabled = false,
}) => {
  const gestureConfig = { ...defaultConfig, ...config };
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTapTime = useRef<number>(0);
  const lastTapPosition = useRef<{ x: number; y: number } | null>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  
  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  // Handle swipe gestures
  const handlePanEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;

    const { offset, velocity } = info;
    const threshold = gestureConfig.swipeThreshold!;

    // Reset position
    x.set(0);
    y.set(0);

    // Check swipe direction
    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      if (offset.x > 0) {
        callbacks.onSwipeRight?.();
      } else {
        callbacks.onSwipeLeft?.();
      }
    }

    if (Math.abs(offset.y) > threshold || Math.abs(velocity.y) > 500) {
      if (offset.y > 0) {
        callbacks.onSwipeDown?.();
      } else {
        callbacks.onSwipeUp?.();
      }
    }
  }, [disabled, gestureConfig.swipeThreshold, callbacks, x, y]);

  // Handle tap gestures
  const handleTap = useCallback((event: MouseEvent | TouchEvent | PointerEvent) => {
    if (disabled) return;

    const currentTime = Date.now();
    const currentPosition = {
      x: 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX,
      y: 'touches' in event ? event.touches[0].clientY : (event as MouseEvent).clientY,
    };

    // Check for double tap
    if (
      currentTime - lastTapTime.current < gestureConfig.doubleTapDelay! &&
      lastTapPosition.current &&
      Math.abs(currentPosition.x - lastTapPosition.current.x) < 30 &&
      Math.abs(currentPosition.y - lastTapPosition.current.y) < 30
    ) {
      callbacks.onDoubleTap?.();
      lastTapTime.current = 0; // Reset to prevent triple tap
    } else {
      callbacks.onTap?.();
      lastTapTime.current = currentTime;
      lastTapPosition.current = currentPosition;
    }
  }, [disabled, gestureConfig.doubleTapDelay, callbacks]);

  // Handle long press
  const handleTapStart = useCallback(() => {
    if (disabled) return;

    longPressTimer.current = setTimeout(() => {
      callbacks.onLongPress?.();
    }, gestureConfig.longPressDelay);
  }, [disabled, gestureConfig.longPressDelay, callbacks]);

  const handleTapCancel = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  // Handle pinch gestures
  const handlePinchStart = useCallback(() => {
    if (disabled) return;
    // Pinch detection will be handled by the motion component
  }, [disabled]);

  const handlePinchEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;

    const currentScale = scale.get();
    const threshold = gestureConfig.pinchThreshold!;

    if (currentScale < 1 - threshold) {
      callbacks.onPinchIn?.();
    } else if (currentScale > 1 + threshold) {
      callbacks.onPinchOut?.();
    }

    // Reset scale
    scale.set(1);
  }, [disabled, gestureConfig.pinchThreshold, callbacks, scale]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={className}
      style={{
        x,
        y,
        scale,
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      onPanEnd={handlePanEnd}
      onTap={handleTap}
      onTapStart={handleTapStart}
      onTapCancel={handleTapCancel}
      onPinchStart={handlePinchStart}
      onPinchEnd={handlePinchEnd}
      drag={false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// Swipeable Card Component
interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
  disabled?: boolean;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className = '',
  disabled = false,
}) => {
  return (
    <GestureHandler
      config={{ swipeThreshold: 50 }}
      callbacks={{
        onSwipeLeft,
        onSwipeRight,
        onSwipeUp,
        onSwipeDown,
      }}
      className={className}
      disabled={disabled}
    >
      {children}
    </GestureHandler>
  );
};

// Long Press Handler
interface LongPressHandlerProps {
  children: React.ReactNode;
  onLongPress?: () => void;
  delay?: number;
  className?: string;
  disabled?: boolean;
}

export const LongPressHandler: React.FC<LongPressHandlerProps> = ({
  children,
  onLongPress,
  delay = 500,
  className = '',
  disabled = false,
}) => {
  return (
    <GestureHandler
      config={{ longPressDelay: delay }}
      callbacks={{ onLongPress }}
      className={className}
      disabled={disabled}
    >
      {children}
    </GestureHandler>
  );
};

// Double Tap Handler
interface DoubleTapHandlerProps {
  children: React.ReactNode;
  onDoubleTap?: () => void;
  onTap?: () => void;
  delay?: number;
  className?: string;
  disabled?: boolean;
}

export const DoubleTapHandler: React.FC<DoubleTapHandlerProps> = ({
  children,
  onDoubleTap,
  onTap,
  delay = 300,
  className = '',
  disabled = false,
}) => {
  return (
    <GestureHandler
      config={{ doubleTapDelay: delay }}
      callbacks={{ onDoubleTap, onTap }}
      className={className}
      disabled={disabled}
    >
      {children}
    </GestureHandler>
  );
};

// Pinch Handler
interface PinchHandlerProps {
  children: React.ReactNode;
  onPinchIn?: () => void;
  onPinchOut?: () => void;
  threshold?: number;
  className?: string;
  disabled?: boolean;
}

export const PinchHandler: React.FC<PinchHandlerProps> = ({
  children,
  onPinchIn,
  onPinchOut,
  threshold = 0.1,
  className = '',
  disabled = false,
}) => {
  return (
    <GestureHandler
      config={{ pinchThreshold: threshold }}
      callbacks={{ onPinchIn, onPinchOut }}
      className={className}
      disabled={disabled}
    >
      {children}
    </GestureHandler>
  );
};

// Hook for gesture detection
export const useGestures = (callbacks: GestureCallbacks, config?: GestureConfig) => {
  const gestureRef = useRef<HTMLDivElement>(null);

  const gestureProps = {
    ref: gestureRef,
    ...callbacks,
    ...config,
  };

  return {
    gestureRef,
    gestureProps,
  };
};

export default GestureHandler;
