import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { SunIcon, MoonIcon, SwatchIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'button' | 'dropdown' | 'floating';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  variant = 'button',
}) => {
  const { currentTheme, setTheme, themes, customThemes, autoTheme, toggleAutoTheme } = useTheme();
  
  const allThemes = { ...themes, ...customThemes };
  const [isOpen, setIsOpen] = React.useState(false);

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return <SunIcon className="w-5 h-5" />;
      case 'dark':
        return <MoonIcon className="w-5 h-5" />;
      default:
        return <SwatchIcon className="w-5 h-5" />;
    }
  };

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
    setIsOpen(false);
  };

  if (variant === 'floating') {
    return (
      <motion.div
        className={`fixed bottom-6 right-6 z-50 ${className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative">
          <motion.button
            className="bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getThemeIcon(currentTheme)}
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 min-w-[200px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    Choose Theme
                  </div>
                  
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                      autoTheme ? 'bg-primary/10 text-primary' : ''
                    }`}
                    onClick={toggleAutoTheme}
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                      {autoTheme && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                    Auto Theme
                  </button>

                  {Object.entries(allThemes).map(([name, theme]) => (
                    <button
                      key={name}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                        currentTheme === name ? 'bg-primary/10 text-primary' : ''
                      }`}
                      onClick={() => handleThemeChange(name)}
                    >
                      {getThemeIcon(name)}
                      {theme.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {getThemeIcon(currentTheme)}
          {showLabel && <span className="text-sm">{allThemes[currentTheme]?.name}</span>}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 min-w-[200px] z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-1">
                <button
                  className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                    autoTheme ? 'bg-primary/10 text-primary' : ''
                  }`}
                  onClick={toggleAutoTheme}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                    {autoTheme && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  Auto Theme
                </button>

                {Object.entries(allThemes).map(([name, theme]) => (
                  <button
                    key={name}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                      currentTheme === name ? 'bg-primary/10 text-primary' : ''
                    }`}
                    onClick={() => handleThemeChange(name)}
                  >
                    {getThemeIcon(name)}
                    {theme.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default button variant
  return (
    <motion.button
      className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
      onClick={() => {
        const themeNames = Object.keys(allThemes);
        const currentIndex = themeNames.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        setTheme(themeNames[nextIndex]);
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {getThemeIcon(currentTheme)}
      {showLabel && <span className="text-sm">{allThemes[currentTheme]?.name}</span>}
    </motion.button>
  );
};

export default ThemeToggle;
