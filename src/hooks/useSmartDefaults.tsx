import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';

interface UserPreferences {
  // Search preferences
  searchHistory: string[];
  favoriteCategories: string[];
  recentProducts: string[];
  
  // UI preferences
  defaultTheme: string;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  
  // Shopping preferences
  defaultPaymentMethod: string;
  defaultDeliveryAddress: string;
  autoAddToCart: boolean;
  showPriceWithTax: boolean;
  
  // Notification preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  
  // Accessibility preferences
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  
  // Performance preferences
  imageQuality: 'low' | 'medium' | 'high';
  preloadImages: boolean;
  cacheData: boolean;
  offlineMode: boolean;
}

interface SmartDefaultsState {
  preferences: UserPreferences;
  isFirstVisit: boolean;
  lastActiveTime: string;
  visitCount: number;
  userBehavior: {
    mostVisitedPages: Record<string, number>;
    mostSearchedTerms: Record<string, number>;
    mostPurchasedCategories: Record<string, number>;
    averageSessionDuration: number;
    preferredShoppingTime: string;
  };
}

interface SmartDefaultsActions {
  // Preference management
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  resetPreferences: () => void;
  
  // Search behavior
  addSearchHistory: (query: string) => void;
  addFavoriteCategory: (category: string) => void;
  addRecentProduct: (productId: string) => void;
  
  // User behavior tracking
  trackPageVisit: (page: string) => void;
  trackSearchTerm: (term: string) => void;
  trackPurchaseCategory: (category: string) => void;
  updateSessionDuration: (duration: number) => void;
  
  // Smart suggestions
  getSuggestedCategories: () => string[];
  getSuggestedProducts: () => string[];
  getSuggestedSearchTerms: () => string[];
  getPersonalizedContent: () => any;
  
  // Auto-settings
  applySmartDefaults: () => void;
  detectUserPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  searchHistory: [],
  favoriteCategories: [],
  recentProducts: [],
  defaultTheme: 'highland',
  language: 'vi',
  fontSize: 'medium',
  animations: true,
  defaultPaymentMethod: 'cash',
  defaultDeliveryAddress: '',
  autoAddToCart: false,
  showPriceWithTax: true,
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  marketingEmails: false,
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: false,
  imageQuality: 'medium',
  preloadImages: true,
  cacheData: true,
  offlineMode: false,
};

export const useSmartDefaults = create<SmartDefaultsState & SmartDefaultsActions>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      isFirstVisit: true,
      lastActiveTime: new Date().toISOString(),
      visitCount: 0,
      userBehavior: {
        mostVisitedPages: {},
        mostSearchedTerms: {},
        mostPurchasedCategories: {},
        averageSessionDuration: 0,
        preferredShoppingTime: 'morning',
      },

      // Preference management
      updatePreference: (key, value) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          },
        }));
      },

      resetPreferences: () => {
        set({
          preferences: defaultPreferences,
          userBehavior: {
            mostVisitedPages: {},
            mostSearchedTerms: {},
            mostPurchasedCategories: {},
            averageSessionDuration: 0,
            preferredShoppingTime: 'morning',
          },
        });
      },

      // Search behavior
      addSearchHistory: (query) => {
        set((state) => {
          const newHistory = [query, ...state.preferences.searchHistory.filter(q => q !== query)].slice(0, 10);
          return {
            preferences: {
              ...state.preferences,
              searchHistory: newHistory,
            },
          };
        });
      },

      addFavoriteCategory: (category) => {
        set((state) => {
          const favorites = state.preferences.favoriteCategories.includes(category)
            ? state.preferences.favoriteCategories
            : [...state.preferences.favoriteCategories, category];
          
          return {
            preferences: {
              ...state.preferences,
              favoriteCategories: favorites.slice(0, 5),
            },
          };
        });
      },

      addRecentProduct: (productId) => {
        set((state) => {
          const recent = [productId, ...state.preferences.recentProducts.filter(id => id !== productId)].slice(0, 10);
          return {
            preferences: {
              ...state.preferences,
              recentProducts: recent,
            },
          };
        });
      },

      // User behavior tracking
      trackPageVisit: (page) => {
        set((state) => ({
          userBehavior: {
            ...state.userBehavior,
            mostVisitedPages: {
              ...state.userBehavior.mostVisitedPages,
              [page]: (state.userBehavior.mostVisitedPages[page] || 0) + 1,
            },
          },
        }));
      },

      trackSearchTerm: (term) => {
        set((state) => ({
          userBehavior: {
            ...state.userBehavior,
            mostSearchedTerms: {
              ...state.userBehavior.mostSearchedTerms,
              [term]: (state.userBehavior.mostSearchedTerms[term] || 0) + 1,
            },
          },
        }));
      },

      trackPurchaseCategory: (category) => {
        set((state) => ({
          userBehavior: {
            ...state.userBehavior,
            mostPurchasedCategories: {
              ...state.userBehavior.mostPurchasedCategories,
              [category]: (state.userBehavior.mostPurchasedCategories[category] || 0) + 1,
            },
          },
        }));
      },

      updateSessionDuration: (duration) => {
        set((state) => {
          const currentAvg = state.userBehavior.averageSessionDuration;
          const newAvg = currentAvg === 0 ? duration : (currentAvg + duration) / 2;
          
          return {
            userBehavior: {
              ...state.userBehavior,
              averageSessionDuration: newAvg,
            },
          };
        });
      },

      // Smart suggestions
      getSuggestedCategories: () => {
        const { userBehavior, preferences } = get();
        const categories = Object.entries(userBehavior.mostPurchasedCategories)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([category]) => category);
        
        return [...categories, ...preferences.favoriteCategories].slice(0, 5);
      },

      getSuggestedProducts: () => {
        const { preferences } = get();
        return preferences.recentProducts.slice(0, 5);
      },

      getSuggestedSearchTerms: () => {
        const { userBehavior, preferences } = get();
        const popularTerms = Object.entries(userBehavior.mostSearchedTerms)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([term]) => term);
        
        return [...popularTerms, ...preferences.searchHistory].slice(0, 5);
      },

      getPersonalizedContent: () => {
        const { preferences, userBehavior } = get();
        
        return {
          recommendedTheme: preferences.defaultTheme,
          suggestedLanguage: preferences.language,
          optimalImageQuality: preferences.imageQuality,
          recommendedFontSize: preferences.fontSize,
          suggestedShoppingTime: userBehavior.preferredShoppingTime,
          personalizedGreeting: getPersonalizedGreeting(),
        };
      },

      // Auto-settings
      applySmartDefaults: () => {
        const { preferences, isFirstVisit } = get();
        
        if (isFirstVisit) {
          // Detect system preferences
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
          
          set((state) => ({
            preferences: {
              ...state.preferences,
              defaultTheme: prefersDark ? 'dark' : 'highland',
              reducedMotion: prefersReducedMotion,
              highContrast: prefersHighContrast,
              animations: !prefersReducedMotion,
            },
            isFirstVisit: false,
            visitCount: 1,
          }));
        }
      },

      detectUserPreferences: () => {
        const { userBehavior } = get();
        
        // Detect preferred shopping time based on visit patterns
        const now = new Date();
        const hour = now.getHours();
        let timeOfDay = 'morning';
        
        if (hour >= 6 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
        else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
        else timeOfDay = 'night';
        
        set((state) => ({
          userBehavior: {
            ...state.userBehavior,
            preferredShoppingTime: timeOfDay,
          },
        }));
      },
    }),
    {
      name: 'highland-smart-defaults',
      partialize: (state) => ({
        preferences: state.preferences,
        isFirstVisit: state.isFirstVisit,
        visitCount: state.visitCount,
        userBehavior: state.userBehavior,
      }),
    }
  )
);

// Helper function for personalized greeting
function getPersonalizedGreeting(): string {
  const hour = new Date().getHours();
  const greetings = {
    morning: ['Chào buổi sáng!', 'Sáng tốt lành!', 'Buổi sáng vui vẻ!'],
    afternoon: ['Chào buổi chiều!', 'Chiều tốt lành!', 'Buổi chiều vui vẻ!'],
    evening: ['Chào buổi tối!', 'Tối tốt lành!', 'Buổi tối vui vẻ!'],
    night: ['Chào đêm!', 'Đêm tốt lành!', 'Buổi đêm vui vẻ!'],
  };
  
  let timeOfDay = 'morning';
  if (hour >= 6 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
  else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
  else timeOfDay = 'night';
  
  const timeGreetings = greetings[timeOfDay as keyof typeof greetings];
  return timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
}

// Hook for easy access to smart defaults
export const usePersonalizedExperience = () => {
  const {
    preferences,
    getSuggestedCategories,
    getSuggestedProducts,
    getSuggestedSearchTerms,
    getPersonalizedContent,
    applySmartDefaults,
    detectUserPreferences,
  } = useSmartDefaults();

  // Apply smart defaults on first load
  React.useEffect(() => {
    applySmartDefaults();
    detectUserPreferences();
  }, [applySmartDefaults, detectUserPreferences]);

  return {
    preferences,
    suggestedCategories: getSuggestedCategories(),
    suggestedProducts: getSuggestedProducts(),
    suggestedSearchTerms: getSuggestedSearchTerms(),
    personalizedContent: getPersonalizedContent(),
  };
};

export default useSmartDefaults;
