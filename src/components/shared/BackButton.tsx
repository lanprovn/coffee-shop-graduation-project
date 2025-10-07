/**
 * Back Button Component cho Mobile
 * Frontend-only component
 */

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useMobileBack, useIsMobile } from '@/hooks/useMobileBack';

interface BackButtonProps {
  className?: string;
  onBack?: () => void;
  fallbackPath?: string;
  showOnDesktop?: boolean;
}

export default function BackButton({ 
  className = '', 
  onBack, 
  fallbackPath = '/',
  showOnDesktop = false 
}: BackButtonProps) {
  const { handleBack, canGoBack } = useMobileBack({ onBack, fallbackPath });
  const isMobile = useIsMobile();

  // Chỉ hiển thị trên mobile hoặc khi được yêu cầu
  if (!isMobile && !showOnDesktop) {
    return null;
  }

  return (
    <button
      onClick={handleBack}
      className={`
        inline-flex items-center justify-center
        p-2 rounded-lg
        text-gray-600 hover:text-gray-900
        hover:bg-gray-100 active:bg-gray-200
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${className}
      `}
      aria-label="Quay lại"
      title="Quay lại"
    >
      <ArrowLeftIcon className="w-5 h-5" />
    </button>
  );
}

/**
 * Back Button với text
 */
export function BackButtonWithText({ 
  className = '', 
  onBack, 
  fallbackPath = '/',
  text = 'Quay lại'
}: BackButtonProps & { text?: string }) {
  const { handleBack } = useMobileBack({ onBack, fallbackPath });
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <button
      onClick={handleBack}
      className={`
        inline-flex items-center gap-2
        px-3 py-2 rounded-lg
        text-gray-600 hover:text-gray-900
        hover:bg-gray-100 active:bg-gray-200
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${className}
      `}
      aria-label={text}
    >
      <ArrowLeftIcon className="w-4 h-4" />
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
}
