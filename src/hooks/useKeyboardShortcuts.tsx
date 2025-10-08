import { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category: 'navigation' | 'actions' | 'theme' | 'search';
}

interface KeyboardShortcutsConfig {
  enabled: boolean;
  showHelp: boolean;
  helpKey: string;
}

export const useKeyboardShortcuts = (config: KeyboardShortcutsConfig = {
  enabled: true,
  showHelp: true,
  helpKey: '?',
}) => {
  const navigate = useNavigate();
  const { openCartModal } = useShoppingCart();
  const { user, logout } = useAuth();
  const { setTheme, currentTheme, themes } = useTheme();
  const helpModalRef = useRef<HTMLDivElement>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Define all shortcuts
  const shortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    {
      key: 'h',
      action: () => navigate('/'),
      description: 'Trang chủ',
      category: 'navigation',
    },
    {
      key: 'p',
      action: () => navigate('/products'),
      description: 'Sản phẩm',
      category: 'navigation',
    },
    {
      key: 's',
      action: () => navigate('/stores'),
      description: 'Cửa hàng',
      category: 'navigation',
    },
    {
      key: 'c',
      action: () => navigate('/cart'),
      description: 'Giỏ hàng',
      category: 'navigation',
    },
    {
      key: 'o',
      action: () => navigate('/orders'),
      description: 'Đơn hàng',
      category: 'navigation',
    },
    {
      key: 'm',
      action: () => navigate('/membership'),
      description: 'Thành viên',
      category: 'navigation',
    },
    {
      key: 'n',
      action: () => navigate('/news'),
      description: 'Tin tức',
      category: 'navigation',
    },
    {
      key: 't',
      action: () => navigate('/contact'),
      description: 'Liên hệ',
      category: 'navigation',
    },

    // Action shortcuts
    {
      key: 'c',
      ctrlKey: true,
      action: openCartModal,
      description: 'Mở giỏ hàng',
      category: 'actions',
    },
    {
      key: 'f',
      ctrlKey: true,
      action: () => {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="Tìm kiếm"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: 'Tìm kiếm',
      category: 'actions',
    },
    {
      key: 'Escape',
      action: () => {
        // Close any open modals
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
          const closeButton = modal.querySelector('[aria-label="Close"], [data-dismiss="modal"]') as HTMLButtonElement;
          if (closeButton) {
            closeButton.click();
          }
        });
      },
      description: 'Đóng modal',
      category: 'actions',
    },

    // Theme shortcuts
    {
      key: 'd',
      ctrlKey: true,
      action: () => {
        const themeNames = Object.keys(themes);
        const currentIndex = themeNames.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        setTheme(themeNames[nextIndex]);
      },
      description: 'Chuyển theme',
      category: 'theme',
    },
    {
      key: 'l',
      ctrlKey: true,
      action: () => setTheme('light'),
      description: 'Theme sáng',
      category: 'theme',
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => setTheme('dark'),
      description: 'Theme tối',
      category: 'theme',
    },

    // Help shortcut
    {
      key: config.helpKey,
      action: () => setShowHelp(true),
      description: 'Hiển thị phím tắt',
      category: 'actions',
    },
  ];

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!config.enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    // Find matching shortcut
    const matchingShortcut = shortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.metaKey === event.metaKey
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [config.enabled, shortcuts]);

  // Register keyboard event listener
  useEffect(() => {
    if (!config.enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, config.enabled]);

  // Help modal component
  const HelpModal = () => {
    if (!showHelp) return null;

    const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    }, {} as Record<string, KeyboardShortcut[]>);

    const categoryNames = {
      navigation: 'Điều hướng',
      actions: 'Hành động',
      theme: 'Giao diện',
      search: 'Tìm kiếm',
    };

    return (
      <div
        ref={helpModalRef}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={(e) => {
          if (e.target === helpModalRef.current) {
            setShowHelp(false);
          }
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Phím tắt bàn phím
            </h2>
            <button
              onClick={() => setShowHelp(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  {categoryNames[category as keyof typeof categoryNames]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <div className="flex gap-1">
                        {shortcut.ctrlKey && (
                          <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded">
                            Ctrl
                          </kbd>
                        )}
                        {shortcut.altKey && (
                          <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded">
                            Alt
                          </kbd>
                        )}
                        {shortcut.shiftKey && (
                          <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded">
                            Shift
                          </kbd>
                        )}
                        {shortcut.metaKey && (
                          <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded">
                            Cmd
                          </kbd>
                        )}
                        <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded">
                          {shortcut.key}
                        </kbd>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhấn <kbd className="px-1 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded">
                {config.helpKey}
              </kbd> để hiển thị lại bảng phím tắt này.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return {
    shortcuts,
    showHelp,
    setShowHelp,
    HelpModal,
  };
};

// Hook for specific shortcuts
export const useNavigationShortcuts = () => {
  const navigate = useNavigate();
  
  const shortcuts = [
    { key: 'h', action: () => navigate('/'), description: 'Trang chủ' },
    { key: 'p', action: () => navigate('/products'), description: 'Sản phẩm' },
    { key: 's', action: () => navigate('/stores'), description: 'Cửa hàng' },
    { key: 'c', action: () => navigate('/cart'), description: 'Giỏ hàng' },
  ];

  return shortcuts;
};

// Hook for theme shortcuts
export const useThemeShortcuts = () => {
  const { setTheme, themes, currentTheme } = useTheme();
  
  const shortcuts = [
    {
      key: 'd',
      ctrlKey: true,
      action: () => {
        const themeNames = Object.keys(themes);
        const currentIndex = themeNames.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        setTheme(themeNames[nextIndex]);
      },
      description: 'Chuyển theme',
    },
    {
      key: 'l',
      ctrlKey: true,
      action: () => setTheme('light'),
      description: 'Theme sáng',
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => setTheme('dark'),
      description: 'Theme tối',
    },
  ];

  return shortcuts;
};

export default useKeyboardShortcuts;
