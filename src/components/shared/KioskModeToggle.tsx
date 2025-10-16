import React, { useEffect, useState } from 'react';
import { 
  ArrowsPointingOutIcon, 
  ArrowsPointingInIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface KioskModeToggleProps {
  onToggle: (isKiosk: boolean) => void;
}

export default function KioskModeToggle({ onToggle }: KioskModeToggleProps) {
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Check if we're in fullscreen
    const checkFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', checkFullscreen);
    return () => document.removeEventListener('fullscreenchange', checkFullscreen);
  }, []);

  const toggleKioskMode = async () => {
    if (!isKioskMode) {
      // Enter kiosk mode
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
        
        // Hide browser UI (if supported)
        if ('navigator' in window && 'keyboard' in navigator) {
          try {
            await (navigator as any).keyboard.lock(['Escape']);
          } catch (e) {
            console.log('Keyboard lock not supported');
          }
        }

        // Disable context menu
        document.addEventListener('contextmenu', preventContextMenu);
        
        // Disable text selection
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        
        setIsKioskMode(true);
        onToggle(true);
      } catch (error) {
        console.error('Failed to enter kiosk mode:', error);
        alert('Không thể vào chế độ kiosk. Vui lòng thử lại.');
      }
    } else {
      // Exit kiosk mode
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        
        // Re-enable context menu
        document.removeEventListener('contextmenu', preventContextMenu);
        
        // Re-enable text selection
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        
        setIsKioskMode(false);
        onToggle(false);
      } catch (error) {
        console.error('Failed to exit kiosk mode:', error);
      }
    }
  };

  const preventContextMenu = (e: Event) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isKioskMode) {
      // Disable certain keys in kiosk mode
      const disabledKeys = ['F11', 'F12', 'Escape'];
      if (disabledKeys.includes(e.key)) {
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isKioskMode]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleKioskMode}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
              isKioskMode
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            title={isKioskMode ? 'Thoát chế độ kiosk' : 'Vào chế độ kiosk'}
          >
            {isKioskMode ? (
              <>
                <ArrowsPointingInIcon className="w-4 h-4" />
                <span>Thoát Kiosk</span>
              </>
            ) : (
              <>
                <ArrowsPointingOutIcon className="w-4 h-4" />
                <span>Kiosk Mode</span>
              </>
            )}
          </button>
          
          {isKioskMode && (
            <div className="flex items-center space-x-1 text-green-600">
              <ComputerDesktopIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Kiosk Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook to detect if we're in kiosk mode
export const useKioskMode = () => {
  const [isKioskMode, setIsKioskMode] = useState(false);

  useEffect(() => {
    const checkKioskMode = () => {
      const isFullscreen = !!document.fullscreenElement;
      const hasKioskStyles = document.body.style.userSelect === 'none';
      setIsKioskMode(isFullscreen && hasKioskStyles);
    };

    checkKioskMode();
    document.addEventListener('fullscreenchange', checkKioskMode);
    
    return () => document.removeEventListener('fullscreenchange', checkKioskMode);
  }, []);

  return isKioskMode;
};
