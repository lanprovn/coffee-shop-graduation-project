// Declare global gtag function
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 Measurement ID

// Initialize Google Analytics
export const initGoogleAnalytics = () => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
            window.dataLayer.push(args);
        }
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            page_title: document.title,
            page_location: window.location.href,
        });
    }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
            page_title: title || document.title,
        });
    }
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
        window.gtag('event', eventName, parameters);
    }
};

// Track e-commerce events
export const trackPurchase = (transactionId: string, value: number, currency: string = 'VND', items: any[] = []) => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
        window.gtag('event', 'purchase', {
            transaction_id: transactionId,
            value: value,
            currency: currency,
            items: items,
        });
    }
};

export const trackAddToCart = (itemId: string, itemName: string, category: string, quantity: number, price: number) => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
        window.gtag('event', 'add_to_cart', {
            currency: 'VND',
            value: price * quantity,
            items: [{
                item_id: itemId,
                item_name: itemName,
                item_category: category,
                quantity: quantity,
                price: price,
            }],
        });
    }
};

export const trackRemoveFromCart = (itemId: string, itemName: string, category: string, quantity: number, price: number) => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
        window.gtag('event', 'remove_from_cart', {
            currency: 'VND',
            value: price * quantity,
            items: [{
                item_id: itemId,
                item_name: itemName,
                item_category: category,
                quantity: quantity,
                price: price,
            }],
        });
    }
};

export const trackViewItem = (itemId: string, itemName: string, category: string, price: number) => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
        window.gtag('event', 'view_item', {
            currency: 'VND',
            value: price,
            items: [{
                item_id: itemId,
                item_name: itemName,
                item_category: category,
                price: price,
            }],
        });
    }
};

export const trackBeginCheckout = (value: number, items: any[]) => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
        window.gtag('event', 'begin_checkout', {
            currency: 'VND',
            value: value,
            items: items,
        });
    }
};

// Custom hook for automatic page tracking
export const useAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location]);

    return {
        trackEvent,
        trackPurchase,
        trackAddToCart,
        trackRemoveFromCart,
        trackViewItem,
        trackBeginCheckout,
    };
};

// Performance tracking
export const trackPerformance = () => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
        // Track Core Web Vitals
        if ('web-vital' in window) {
            // This would require web-vitals library
            // getCLS(trackEvent);
            // getFID(trackEvent);
            // getFCP(trackEvent);
            // getLCP(trackEvent);
            // getTTFB(trackEvent);
        }

        // Track page load time
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            trackEvent('page_load_time', {
                load_time: loadTime,
                page: window.location.pathname,
            });
        });
    }
};

// Error tracking
export const trackError = (error: Error, errorInfo?: any) => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
        trackEvent('exception', {
            description: error.message,
            fatal: false,
            error_info: errorInfo,
        });
    }
};

// User engagement tracking
export const trackUserEngagement = (action: string, element: string, value?: any) => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
        trackEvent('user_engagement', {
            action: action,
            element: element,
            value: value,
            page: window.location.pathname,
        });
    }
};
