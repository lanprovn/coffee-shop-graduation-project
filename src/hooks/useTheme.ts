import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  animations: {
    duration: number;
    easing: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const themes: Record<string, ThemeConfig> = {
  light: {
    name: 'Light Mode',
    colors: {
      primary: '#C41E3A',
      secondary: '#8B4513',
      accent: '#D4AF37',
      background: '#F5F5DC',
      surface: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    animations: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
  },
  dark: {
    name: 'Dark Mode',
    colors: {
      primary: '#DC2626',
      secondary: '#A16207',
      accent: '#F59E0B',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      textSecondary: '#CBD5E1',
      border: '#334155',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    animations: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
    },
  },
  highland: {
    name: 'Highland Classic',
    colors: {
      primary: '#C41E3A',
      secondary: '#8B4513',
      accent: '#D4AF37',
      background: '#F5F5DC',
      surface: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    animations: {
      duration: 400,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    shadows: {
      sm: '0 2px 4px 0 rgb(196 30 58 / 0.1)',
      md: '0 4px 8px 0 rgb(196 30 58 / 0.15), 0 2px 4px 0 rgb(196 30 58 / 0.1)',
      lg: '0 8px 16px 0 rgb(196 30 58 / 0.2), 0 4px 8px 0 rgb(196 30 58 / 0.15)',
      xl: '0 16px 32px 0 rgb(196 30 58 / 0.25), 0 8px 16px 0 rgb(196 30 58 / 0.2)',
    },
  },
};

interface ThemeState {
  currentTheme: string;
  customThemes: Record<string, ThemeConfig>;
  systemTheme: 'light' | 'dark';
  autoTheme: boolean;
}

interface ThemeActions {
  setTheme: (themeName: string) => void;
  createCustomTheme: (name: string, config: ThemeConfig) => void;
  updateCustomTheme: (name: string, config: Partial<ThemeConfig>) => void;
  deleteCustomTheme: (name: string) => void;
  toggleAutoTheme: () => void;
  detectSystemTheme: () => void;
}

export const useTheme = create<ThemeState & ThemeActions>()(
  persist(
    (set, get) => ({
      currentTheme: 'highland',
      customThemes: {},
      systemTheme: 'light',
      autoTheme: false,

      setTheme: (themeName) => {
        set({ currentTheme: themeName });
        applyThemeToDocument(themeName);
      },

      createCustomTheme: (name, config) => {
        set((state) => ({
          customThemes: {
            ...state.customThemes,
            [name]: config,
          },
        }));
      },

      updateCustomTheme: (name, config) => {
        set((state) => ({
          customThemes: {
            ...state.customThemes,
            [name]: {
              ...state.customThemes[name],
              ...config,
            },
          },
        }));
      },

      deleteCustomTheme: (name) => {
        set((state) => {
          const newCustomThemes = { ...state.customThemes };
          delete newCustomThemes[name];
          return { customThemes: newCustomThemes };
        });
      },

      toggleAutoTheme: () => {
        const { autoTheme } = get();
        set({ autoTheme: !autoTheme });
        if (!autoTheme) {
          get().detectSystemTheme();
        }
      },

      detectSystemTheme: () => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        set({ systemTheme: isDark ? 'dark' : 'light' });
        
        if (get().autoTheme) {
          const themeName = isDark ? 'dark' : 'light';
          get().setTheme(themeName);
        }
      },
    }),
    {
      name: 'highland-theme-storage',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        customThemes: state.customThemes,
        autoTheme: state.autoTheme,
      }),
    }
  )
);

// Apply theme to document
function applyThemeToDocument(themeName: string) {
  const allThemes = { ...themes, ...useTheme.getState().customThemes };
  const theme = allThemes[themeName];
  
  if (!theme) return;

  const root = document.documentElement;
  
  // Apply CSS custom properties
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });

  root.style.setProperty('--animation-duration', `${theme.animations.duration}ms`);
  root.style.setProperty('--animation-easing', theme.animations.easing);

  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme.colors.primary);
  }
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    useTheme.getState().detectSystemTheme();
  });

  // Apply initial theme
  const { currentTheme } = useTheme.getState();
  applyThemeToDocument(currentTheme);
}
