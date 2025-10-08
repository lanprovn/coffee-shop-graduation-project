import { useEffect, useState, useCallback } from 'react';

// Analytics Types
interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'navigation' | 'resource' | 'paint' | 'measure';
}

interface UserBehavior {
  pageViews: number;
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
}

// Analytics Hook
export const useAnalytics = () => {
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  // Track page view
  const trackPageView = useCallback((page: string, title?: string) => {
    if (!isEnabled) return;

    const event: AnalyticsEvent = {
      event: 'page_view',
      category: 'Navigation',
      action: 'View',
      label: page,
      timestamp: Date.now(),
      sessionId,
    };

    setEvents(prev => [...prev, event]);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Page View:', page);
    }
  }, [isEnabled, sessionId]);

  // Track custom event
  const trackEvent = useCallback((
    category: string,
    action: string,
    label?: string,
    value?: number
  ) => {
    if (!isEnabled) return;

    const event: AnalyticsEvent = {
      event: 'custom_event',
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId,
    };

    setEvents(prev => [...prev, event]);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Event:', { category, action, label, value });
    }
  }, [isEnabled, sessionId]);

  // Track e-commerce events
  const trackPurchase = useCallback((orderId: string, value: number, items: any[]) => {
    trackEvent('E-commerce', 'Purchase', orderId, value);
    
    items.forEach(item => {
      trackEvent('E-commerce', 'Item Purchase', item.name, item.price);
    });
  }, [trackEvent]);

  const trackAddToCart = useCallback((productName: string, price: number) => {
    trackEvent('E-commerce', 'Add to Cart', productName, price);
  }, [trackEvent]);

  const trackRemoveFromCart = useCallback((productName: string) => {
    trackEvent('E-commerce', 'Remove from Cart', productName);
  }, [trackEvent]);

  // Track user engagement
  const trackSearch = useCallback((query: string, results: number) => {
    trackEvent('Search', 'Query', query, results);
  }, [trackEvent]);

  const trackFilter = useCallback((filterType: string, filterValue: string) => {
    trackEvent('Filter', 'Apply', `${filterType}: ${filterValue}`);
  }, [trackEvent]);

  const trackWishlist = useCallback((action: 'add' | 'remove', productName: string) => {
    trackEvent('Wishlist', action === 'add' ? 'Add' : 'Remove', productName);
  }, [trackEvent]);

  // Track errors
  const trackError = useCallback((error: string, errorInfo?: any) => {
    trackEvent('Error', 'JavaScript Error', error);
    
    if (process.env.NODE_ENV === 'development') {
      console.error('📊 Error Tracked:', error, errorInfo);
    }
  }, [trackEvent]);

  // Get analytics data
  const getAnalyticsData = useCallback(() => {
    return {
      sessionId,
      events,
      totalEvents: events.length,
      sessionDuration: events.length > 0 ? 
        Math.max(...events.map(e => e.timestamp)) - Math.min(...events.map(e => e.timestamp)) : 0,
      pageViews: events.filter(e => e.event === 'page_view').length,
      customEvents: events.filter(e => e.event === 'custom_event').length,
    };
  }, [sessionId, events]);

  // Export analytics data
  const exportAnalytics = useCallback(() => {
    const data = getAnalyticsData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${sessionId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getAnalyticsData, sessionId]);

  return {
    trackPageView,
    trackEvent,
    trackPurchase,
    trackAddToCart,
    trackRemoveFromCart,
    trackSearch,
    trackFilter,
    trackWishlist,
    trackError,
    getAnalyticsData,
    exportAnalytics,
    isEnabled,
    setIsEnabled,
  };
};

// Performance Monitoring Hook
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Measure performance
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    if (!isMonitoring) {
      fn();
      return;
    }

    const start = performance.now();
    fn();
    const end = performance.now();

    const metric: PerformanceMetric = {
      name,
      value: end - start,
      timestamp: Date.now(),
      type: 'measure',
    };

    setMetrics(prev => [...prev, metric]);
  }, [isMonitoring]);

  // Track Core Web Vitals
  useEffect(() => {
    if (!isMonitoring) return;

    // Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      setMetrics(prev => [...prev, {
        name: 'LCP',
        value: lastEntry.startTime,
        timestamp: Date.now(),
        type: 'paint',
      }]);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        setMetrics(prev => [...prev, {
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          timestamp: Date.now(),
          type: 'measure',
        }]);
      });
    });

    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      setMetrics(prev => [...prev, {
        name: 'CLS',
        value: clsValue,
        timestamp: Date.now(),
        type: 'measure',
      }]);
    });

    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      observer.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [isMonitoring]);

  // Track resource loading times
  useEffect(() => {
    if (!isMonitoring) return;

    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.duration > 100) { // Only track resources that take more than 100ms
          setMetrics(prev => [...prev, {
            name: `Resource: ${entry.name}`,
            value: entry.duration,
            timestamp: Date.now(),
            type: 'resource',
          }]);
        }
      });
    });

    resourceObserver.observe({ entryTypes: ['resource'] });

    return () => resourceObserver.disconnect();
  }, [isMonitoring]);

  // Get performance summary
  const getPerformanceSummary = useCallback(() => {
    const lcp = metrics.find(m => m.name === 'LCP')?.value || 0;
    const fid = metrics.find(m => m.name === 'FID')?.value || 0;
    const cls = metrics.find(m => m.name === 'CLS')?.value || 0;
    
    const avgResourceTime = metrics
      .filter(m => m.type === 'resource')
      .reduce((sum, m) => sum + m.value, 0) / 
      Math.max(metrics.filter(m => m.type === 'resource').length, 1);

    return {
      lcp: Math.round(lcp),
      fid: Math.round(fid),
      cls: Math.round(cls * 1000) / 1000,
      avgResourceTime: Math.round(avgResourceTime),
      totalMetrics: metrics.length,
      score: calculatePerformanceScore(lcp, fid, cls),
    };
  }, [metrics]);

  // Calculate performance score
  const calculatePerformanceScore = (lcp: number, fid: number, cls: number) => {
    let score = 100;
    
    // LCP scoring (good: <2.5s, needs improvement: 2.5-4s, poor: >4s)
    if (lcp > 4000) score -= 30;
    else if (lcp > 2500) score -= 15;
    
    // FID scoring (good: <100ms, needs improvement: 100-300ms, poor: >300ms)
    if (fid > 300) score -= 30;
    else if (fid > 100) score -= 15;
    
    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (cls > 0.25) score -= 30;
    else if (cls > 0.1) score -= 15;
    
    return Math.max(0, score);
  };

  // Export performance data
  const exportPerformanceData = useCallback(() => {
    const summary = getPerformanceSummary();
    const data = { summary, metrics };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getPerformanceSummary, metrics]);

  return {
    metrics,
    measurePerformance,
    getPerformanceSummary,
    exportPerformanceData,
    isMonitoring,
    setIsMonitoring,
  };
};

// User Behavior Analytics
export const useUserBehavior = () => {
  const [behavior, setBehavior] = useState<UserBehavior>({
    pageViews: 0,
    sessionDuration: 0,
    bounceRate: 0,
    conversionRate: 0,
  });

  const trackUserBehavior = useCallback((action: keyof UserBehavior, value: number) => {
    setBehavior(prev => ({
      ...prev,
      [action]: value,
    }));
  }, []);

  const getBehaviorInsights = useCallback(() => {
    const { pageViews, sessionDuration, bounceRate, conversionRate } = behavior;
    
    return {
      engagement: sessionDuration > 300 ? 'High' : sessionDuration > 120 ? 'Medium' : 'Low',
      retention: bounceRate < 30 ? 'Good' : bounceRate < 60 ? 'Average' : 'Poor',
      conversion: conversionRate > 5 ? 'Excellent' : conversionRate > 2 ? 'Good' : 'Needs Improvement',
      recommendations: generateRecommendations(behavior),
    };
  }, [behavior]);

  const generateRecommendations = (behavior: UserBehavior) => {
    const recommendations = [];
    
    if (behavior.bounceRate > 60) {
      recommendations.push('Improve page loading speed and content relevance');
    }
    
    if (behavior.sessionDuration < 120) {
      recommendations.push('Add more engaging content and interactive features');
    }
    
    if (behavior.conversionRate < 2) {
      recommendations.push('Optimize checkout process and add trust signals');
    }
    
    return recommendations;
  };

  return {
    behavior,
    trackUserBehavior,
    getBehaviorInsights,
  };
};

// Analytics Dashboard Component
export const AnalyticsDashboard: React.FC = () => {
  const analytics = useAnalytics();
  const performance = usePerformanceMonitoring();
  const behavior = useUserBehavior();

  const analyticsData = analytics.getAnalyticsData();
  const performanceSummary = performance.getPerformanceSummary();
  const behaviorInsights = behavior.getBehaviorInsights();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
      
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.totalEvents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Page Views</h3>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.pageViews}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Session Duration</h3>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(analyticsData.sessionDuration / 1000)}s
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Performance Score</h3>
          <p className="text-2xl font-bold text-gray-900">{performanceSummary.score}/100</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">LCP</h4>
            <p className="text-xl font-bold text-gray-900">{performanceSummary.lcp}ms</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">FID</h4>
            <p className="text-xl font-bold text-gray-900">{performanceSummary.fid}ms</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">CLS</h4>
            <p className="text-xl font-bold text-gray-900">{performanceSummary.cls}</p>
          </div>
        </div>
      </div>

      {/* Behavior Insights */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">User Behavior Insights</h3>
        <div className="space-y-2">
          <p><strong>Engagement:</strong> {behaviorInsights.engagement}</p>
          <p><strong>Retention:</strong> {behaviorInsights.retention}</p>
          <p><strong>Conversion:</strong> {behaviorInsights.conversion}</p>
          {behaviorInsights.recommendations.length > 0 && (
            <div>
              <strong>Recommendations:</strong>
              <ul className="list-disc list-inside mt-2">
                {behaviorInsights.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4">
        <button
          onClick={analytics.exportAnalytics}
          className="btn-primary"
        >
          Export Analytics
        </button>
        <button
          onClick={performance.exportPerformanceData}
          className="btn-outline"
        >
          Export Performance Data
        </button>
      </div>
    </div>
  );
};
