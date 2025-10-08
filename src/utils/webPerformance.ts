/* ===== WEB PERFORMANCE OPTIMIZATIONS ===== */

// Preload critical resources
const preloadCriticalResources = () => {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/inter-var.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);

    // Preload critical images
    const criticalImages = [
        '/images/app-logo.svg',
        '/images/home-open-graph.png'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
    });
};

// Optimize images with WebP support
const optimizeImages = () => {
    const images = document.querySelectorAll('img[data-src]');

    images.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
            // Check WebP support
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');

            // Create WebP image to test support
            const webpTest = new Image();
            webpTest.onload = () => {
                img.src = webpSrc;
            };
            webpTest.onerror = () => {
                img.src = src;
            };
            webpTest.src = webpSrc;
        }
    });
};

// Service Worker for caching
const registerServiceWorker = () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    }
};

// Critical CSS inlining
const inlineCriticalCSS = () => {
    const criticalCSS = `
    /* Critical above-the-fold styles */
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
    .loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: white; }
  `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
};

// Resource hints
const addResourceHints = () => {
    // DNS prefetch for external domains
    const dnsPrefetchDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.google-analytics.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
    });

    // Preconnect to critical origins
    const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];

    preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
};

// Lazy load non-critical resources
const lazyLoadResources = () => {
    // Lazy load Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.media = 'print';
    fontLink.onload = () => {
        fontLink.media = 'all';
    };
    document.head.appendChild(fontLink);

    // Lazy load non-critical CSS
    const lazyCSS = [
        '/styles/mobile-consolidated.css',
        '/styles/enhanced-consolidated.css'
    ];

    lazyCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = () => {
            link.media = 'all';
        };
        document.head.appendChild(link);
    });
};

// Performance monitoring
const initPerformanceMonitoring = () => {
    // Monitor Core Web Vitals
    if ('web-vitals' in window) {
        // This would require web-vitals library
        // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

        // getCLS(console.log);
        // getFID(console.log);
        // getFCP(console.log);
        // getLCP(console.log);
        // getTTFB(console.log);
    }

    // Monitor page load performance
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        console.log('Performance Metrics:', {
            'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            'Page Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
            'Total Page Load': perfData.loadEventEnd - perfData.fetchStart,
            'First Paint': performance.getEntriesByName('first-paint')[0]?.startTime,
            'First Contentful Paint': performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        });
    });
};

// Optimize scroll performance
const optimizeScrollPerformance = () => {
    let ticking = false;

    const updateScrollPosition = () => {
        // Update scroll-dependent elements
        const scrollY = window.scrollY;

        // Add/remove classes based on scroll position
        document.body.classList.toggle('scrolled', scrollY > 100);

        ticking = false;
    };

    const requestScrollUpdate = () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    };

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
};

// Optimize resize performance
const optimizeResizePerformance = () => {
    let resizeTimeout;

    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle resize logic here
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Update responsive elements
            document.documentElement.style.setProperty('--viewport-width', `${width}px`);
            document.documentElement.style.setProperty('--viewport-height', `${height}px`);
        }, 250);
    };

    window.addEventListener('resize', handleResize, { passive: true });
};

// Memory optimization
const optimizeMemory = () => {
    // Clean up unused event listeners
    const cleanup = () => {
        // Remove unused DOM nodes
        const unusedElements = document.querySelectorAll('.unused');
        unusedElements.forEach(el => el.remove());
    };

    // Run cleanup periodically
    setInterval(cleanup, 30000); // Every 30 seconds

    // Clean up on page unload
    window.addEventListener('beforeunload', cleanup);
};

// Initialize all optimizations
export const initWebPerformanceOptimizations = () => {
    // Run immediately
    preloadCriticalResources();
    addResourceHints();
    inlineCriticalCSS();
    initPerformanceMonitoring();
    optimizeScrollPerformance();
    optimizeResizePerformance();
    optimizeMemory();

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            optimizeImages();
            lazyLoadResources();
        });
    } else {
        optimizeImages();
        lazyLoadResources();
    }

    // Register service worker after a delay
    setTimeout(registerServiceWorker, 1000);
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebPerformanceOptimizations);
} else {
    initWebPerformanceOptimizations();
}
