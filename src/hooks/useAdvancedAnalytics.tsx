import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnalyticsEvent {
  id: string;
  type: string;
  category: 'user' | 'product' | 'cart' | 'order' | 'navigation' | 'performance' | 'error';
  action: string;
  label?: string;
  value?: number;
  properties: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

interface UserBehavior {
  pageViews: Record<string, number>;
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  averageOrderValue: number;
  lastActivity: string;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

interface AnalyticsState {
  events: AnalyticsEvent[];
  userBehavior: UserBehavior;
  performanceMetrics: PerformanceMetrics;
  sessionId: string;
  userId?: string;
  isTrackingEnabled: boolean;
  lastSyncTime: string | null;
}

interface AnalyticsActions {
  // Event tracking
  trackEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId'>) => void;
  trackPageView: (page: string, properties?: Record<string, any>) => void;
  trackUserAction: (action: string, category: string, properties?: Record<string, any>) => void;
  trackError: (error: Error, context?: Record<string, any>) => void;
  
  // Performance tracking
  trackPerformance: (metrics: Partial<PerformanceMetrics>) => void;
  trackPageLoad: (loadTime: number) => void;
  
  // User behavior
  updateUserBehavior: (behavior: Partial<UserBehavior>) => void;
  trackConversion: (value: number, category: string) => void;
  
  // Session management
  startSession: () => void;
  endSession: () => void;
  setUserId: (userId: string) => void;
  
  // Data management
  clearAnalytics: () => void;
  exportAnalytics: () => AnalyticsEvent[];
  syncAnalytics: () => Promise<void>;
  
  // Settings
  setTrackingEnabled: (enabled: boolean) => void;
}

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useAnalyticsStore = create<AnalyticsState & AnalyticsActions>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      userBehavior: {
        pageViews: {},
        sessionDuration: 0,
        bounceRate: 0,
        conversionRate: 0,
        averageOrderValue: 0,
        lastActivity: new Date().toISOString(),
      },
      performanceMetrics: {
        pageLoadTime: 0,
        timeToInteractive: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
      },
      sessionId: generateSessionId(),
      userId: undefined,
      isTrackingEnabled: true,
      lastSyncTime: null,

      // Event tracking
      trackEvent: (eventData) => {
        const { isTrackingEnabled, sessionId, userId } = get();
        
        if (!isTrackingEnabled) return;

        const event: AnalyticsEvent = {
          id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...eventData,
          timestamp: new Date().toISOString(),
          sessionId,
          userId,
        };

        set((state) => ({
          events: [...state.events, event].slice(-1000), // Keep last 1000 events
        }));

        // Update user behavior
        get().updateUserBehavior({
          lastActivity: new Date().toISOString(),
        });
      },

      trackPageView: (page, properties = {}) => {
        get().trackEvent({
          type: 'page_view',
          category: 'navigation',
          action: 'view',
          label: page,
          properties: {
            page,
            ...properties,
          },
        });

        // Update page views count
        set((state) => ({
          userBehavior: {
            ...state.userBehavior,
            pageViews: {
              ...state.userBehavior.pageViews,
              [page]: (state.userBehavior.pageViews[page] || 0) + 1,
            },
          },
        }));
      },

      trackUserAction: (action, category, properties = {}) => {
        get().trackEvent({
          type: 'user_action',
          category: category as any,
          action,
          properties,
        });
      },

      trackError: (error, context = {}) => {
        get().trackEvent({
          type: 'error',
          category: 'error',
          action: 'error_occurred',
          label: error.message,
          properties: {
            errorMessage: error.message,
            errorStack: error.stack,
            errorName: error.name,
            ...context,
          },
        });
      },

      // Performance tracking
      trackPerformance: (metrics) => {
        set((state) => ({
          performanceMetrics: {
            ...state.performanceMetrics,
            ...metrics,
          },
        }));

        get().trackEvent({
          type: 'performance',
          category: 'performance',
          action: 'metrics_updated',
          properties: metrics,
        });
      },

      trackPageLoad: (loadTime) => {
        get().trackPerformance({ pageLoadTime: loadTime });
        
        get().trackEvent({
          type: 'performance',
          category: 'performance',
          action: 'page_load',
          value: loadTime,
          properties: { loadTime },
        });
      },

      // User behavior
      updateUserBehavior: (behavior) => {
        set((state) => ({
          userBehavior: {
            ...state.userBehavior,
            ...behavior,
          },
        }));
      },

      trackConversion: (value, category) => {
        get().trackEvent({
          type: 'conversion',
          category: 'order',
          action: 'purchase',
          value,
          properties: { category },
        });

        // Update conversion metrics
        set((state) => {
          const currentAOV = state.userBehavior.averageOrderValue;
          const newAOV = currentAOV === 0 ? value : (currentAOV + value) / 2;
          
          return {
            userBehavior: {
              ...state.userBehavior,
              averageOrderValue: newAOV,
              conversionRate: state.userBehavior.conversionRate + 1,
            },
          };
        });
      },

      // Session management
      startSession: () => {
        const sessionId = generateSessionId();
        set({ sessionId });
        
        get().trackEvent({
          type: 'session',
          category: 'user',
          action: 'session_start',
          properties: { sessionId },
        });
      },

      endSession: () => {
        get().trackEvent({
          type: 'session',
          category: 'user',
          action: 'session_end',
          properties: { sessionId: get().sessionId },
        });
      },

      setUserId: (userId) => {
        set({ userId });
        
        get().trackEvent({
          type: 'user',
          category: 'user',
          action: 'user_identified',
          properties: { userId },
        });
      },

      // Data management
      clearAnalytics: () => {
        set({
          events: [],
          userBehavior: {
            pageViews: {},
            sessionDuration: 0,
            bounceRate: 0,
            conversionRate: 0,
            averageOrderValue: 0,
            lastActivity: new Date().toISOString(),
          },
          performanceMetrics: {
            pageLoadTime: 0,
            timeToInteractive: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
          },
        });
      },

      exportAnalytics: () => {
        return get().events;
      },

      syncAnalytics: async () => {
        const { events, lastSyncTime } = get();
        
        if (events.length === 0) return;

        try {
          // Simulate API call to sync analytics
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ lastSyncTime: new Date().toISOString() });
          
          console.log(`Synced ${events.length} analytics events`);
        } catch (error) {
          console.error('Failed to sync analytics:', error);
        }
      },

      // Settings
      setTrackingEnabled: (enabled) => {
        set({ isTrackingEnabled: enabled });
        
        if (enabled) {
          get().trackEvent({
            type: 'settings',
            category: 'user',
            action: 'tracking_enabled',
            properties: { enabled },
          });
        }
      },
    }),
    {
      name: 'highland-analytics-store',
      partialize: (state) => ({
        events: state.events.slice(-100), // Keep last 100 events in storage
        userBehavior: state.userBehavior,
        performanceMetrics: state.performanceMetrics,
        sessionId: state.sessionId,
        userId: state.userId,
        isTrackingEnabled: state.isTrackingEnabled,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);

// Hook for easy analytics usage
export const useAnalytics = () => {
  const {
    trackEvent,
    trackPageView,
    trackUserAction,
    trackError,
    trackPerformance,
    trackPageLoad,
    trackConversion,
    startSession,
    endSession,
    setUserId,
    clearAnalytics,
    exportAnalytics,
    syncAnalytics,
    setTrackingEnabled,
    events,
    userBehavior,
    performanceMetrics,
    isTrackingEnabled,
  } = useAnalyticsStore();

  // Auto-start session on mount
  React.useEffect(() => {
    startSession();
    
    // Track page load performance
    const loadTime = performance.now();
    trackPageLoad(loadTime);

    // Track Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with web-vitals library
      trackPerformance({
        pageLoadTime: loadTime,
      });
    }

    return () => {
      endSession();
    };
  }, [startSession, endSession, trackPageLoad, trackPerformance]);

  // Auto-sync analytics periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      syncAnalytics();
    }, 60000); // Sync every minute

    return () => clearInterval(interval);
  }, [syncAnalytics]);

  return {
    // Tracking methods
    trackEvent,
    trackPageView,
    trackUserAction,
    trackError,
    trackPerformance,
    trackConversion,
    
    // Session management
    setUserId,
    clearAnalytics,
    exportAnalytics,
    syncAnalytics,
    setTrackingEnabled,
    
    // Data
    events,
    userBehavior,
    performanceMetrics,
    isTrackingEnabled,
  };
};

export default useAnalyticsStore;