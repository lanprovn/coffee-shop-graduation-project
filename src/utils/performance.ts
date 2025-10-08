/* ===== PERFORMANCE & SMOOTHNESS OPTIMIZATION ===== */

// Performance Monitoring
class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.isMonitoring = false;
  }

  start() {
    this.isMonitoring = true;
    this.measureFPS();
  }

  stop() {
    this.isMonitoring = false;
  }

  measureFPS() {
    if (!this.isMonitoring) { return; }

    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;

      // Update FPS display if exists
      const fpsDisplay = document.getElementById('fps-counter');
      if (fpsDisplay) {
        fpsDisplay.textContent = `FPS: ${this.fps}`;
      }
    }

    requestAnimationFrame(() => this.measureFPS());
  }
}

// Smooth Scrolling Utility
class SmoothScroller {
  constructor() {
    this.isScrolling = false;
    this.scrollTarget = null;
    this.scrollDuration = 300;
  }

  scrollTo(element, duration = 300) {
    if (this.isScrolling) { return; }

    this.isScrolling = true;
    this.scrollDuration = duration;

    const target = typeof element === 'string' ? document.querySelector(element) : element;
    if (!target) { return; }

    const startPosition = window.pageYOffset;
    const targetPosition = target.offsetTop;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        this.isScrolling = false;
      }
    };

    requestAnimationFrame(animateScroll);
  }
}

// Touch Gesture Handler
class TouchGestureHandler {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 50;
    this.maxSwipeTime = 300;
    this.swipeStartTime = 0;
  }

  handleTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.swipeStartTime = performance.now();
  }

  handleTouchEnd(event) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.touchEndY = event.changedTouches[0].clientY;

    const swipeTime = performance.now() - this.swipeStartTime;
    const swipeDistanceX = this.touchEndX - this.touchStartX;
    const swipeDistanceY = this.touchEndY - this.touchStartY;

    if (swipeTime <= this.maxSwipeTime) {
      if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
        if (Math.abs(swipeDistanceX) > this.minSwipeDistance) {
          if (swipeDistanceX > 0) {
            this.onSwipeRight();
          } else {
            this.onSwipeLeft();
          }
        }
      } else {
        if (Math.abs(swipeDistanceY) > this.minSwipeDistance) {
          if (swipeDistanceY > 0) {
            this.onSwipeDown();
          } else {
            this.onSwipeUp();
          }
        }
      }
    }
  }

  onSwipeLeft() {
    // Swipe Left logged for development
    // console.log('Swipe Left');
    // Implement swipe left logic
  }

  onSwipeRight() {
    // Swipe Right logged for development
    // console.log('Swipe Right');
    // Implement swipe right logic
  }

  onSwipeUp() {
    // Swipe Up logged for development
    // console.log('Swipe Up');
    // Implement swipe up logic
  }

  onSwipeDown() {
    // Swipe Down logged for development
    // console.log('Swipe Down');
    // Implement swipe down logic
  }
}

// Lazy Loading Images
class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            this.imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
    }
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.classList.add('loaded');
    }
  }

  observe(img) {
    if (this.imageObserver) {
      this.imageObserver.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(img);
    }
  }
}

// Debounce Utility
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) { func(...args); }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) { func(...args); }
  };
}

// Throttle Utility
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Smooth Animation Utility
class SmoothAnimator {
  constructor() {
    this.animations = new Map();
  }

  animate(element, properties, duration = 300, easing = 'ease-out') {
    const startTime = performance.now();
    const startValues = {};

    // Get initial values
    Object.keys(properties).forEach(prop => {
      startValues[prop] = this.getComputedValue(element, prop);
    });

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing === 'ease-out' ? easeOutCubic(progress) : progress;

      Object.keys(properties).forEach(prop => {
        const startValue = startValues[prop];
        const endValue = properties[prop];
        const currentValue = startValue + (endValue - startValue) * easedProgress;

        this.setStyle(element, prop, currentValue);
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  getComputedValue(element, property) {
    const computed = window.getComputedStyle(element);
    const value = computed.getPropertyValue(property);
    return parseFloat(value) || 0;
  }

  setStyle(element, property, value) {
    if (property === 'opacity') {
      element.style.opacity = value;
    } else if (property === 'transform') {
      element.style.transform = value;
    } else {
      element.style[property] = value + 'px';
    }
  }
}

// Performance Optimized Event Listeners
class OptimizedEventListeners {
  constructor() {
    this.listeners = new Map();
    this.throttledResize = throttle(this.handleResize.bind(this), 16);
    this.throttledScroll = throttle(this.handleScroll.bind(this), 16);
  }

  init() {
    window.addEventListener('resize', this.throttledResize, { passive: true });
    window.addEventListener('scroll', this.throttledScroll, { passive: true });

    // Touch events for mobile
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
      document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    }
  }

  handleResize() {
    // Handle resize events
    this.dispatchEvent('resize', { width: window.innerWidth, height: window.innerHeight });
  }

  handleScroll() {
    // Handle scroll events
    this.dispatchEvent('scroll', {
      scrollX: window.scrollX,
      scrollY: window.scrollY
    });
  }

  handleTouchStart(event) {
    this.dispatchEvent('touchstart', event);
  }

  handleTouchEnd(event) {
    this.dispatchEvent('touchend', event);
  }

  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  dispatchEvent(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}

// Initialize Performance Optimizations
function initPerformanceOptimizations() {
  // Initialize performance monitor
  const performanceMonitor = new PerformanceMonitor();

  // Initialize smooth scroller
  const smoothScroller = new SmoothScroller();

  // Initialize touch gesture handler
  const touchHandler = new TouchGestureHandler();

  // Initialize lazy image loader
  const lazyLoader = new LazyImageLoader();

  // Initialize smooth animator
  const smoothAnimator = new SmoothAnimator();

  // Initialize optimized event listeners
  const eventListeners = new OptimizedEventListeners();
  eventListeners.init();

  // Add smooth scrolling to all anchor links
  document.addEventListener('click', (event) => {
    const target = event.target.closest('a[href^="#"]');
    if (target) {
      event.preventDefault();
      const targetId = target.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        smoothScroller.scrollTo(targetElement);
      }
    }
  });

  // Add touch event listeners
  document.addEventListener('touchstart', touchHandler.handleTouchStart.bind(touchHandler), { passive: true });
  document.addEventListener('touchend', touchHandler.handleTouchEnd.bind(touchHandler), { passive: true });

  // Initialize lazy loading for all images with data-src
  document.querySelectorAll('img[data-src]').forEach(img => {
    lazyLoader.observe(img);
  });

  // Add performance classes to elements
  document.querySelectorAll('.btn, .card, .nav-item').forEach(element => {
    element.classList.add('smooth-transition', 'gpu-layer');
  });

  // Add touch feedback to interactive elements
  document.querySelectorAll('button, .btn, .card').forEach(element => {
    element.classList.add('touch-feedback', 'no-tap-highlight');
  });

  // Start performance monitoring in development
  if (process.env.NODE_ENV === 'development') {
    performanceMonitor.start();
  }

  return {
    performanceMonitor,
    smoothScroller,
    touchHandler,
    lazyLoader,
    smoothAnimator,
    eventListeners
  };
}

// Export for use in React components
export {
  PerformanceMonitor,
  SmoothScroller,
  TouchGestureHandler,
  LazyImageLoader,
  SmoothAnimator,
  OptimizedEventListeners,
  debounce,
  throttle,
  initPerformanceOptimizations
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
} else {
  initPerformanceOptimizations();
}
