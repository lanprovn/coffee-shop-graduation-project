import { useState, useEffect } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { Notification } from '@/types';
import { XMarkIcon, CheckIcon, InformationCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface NotificationPopupProps {
    show: boolean;
    onClose: () => void;
    notification: Notification | null;
}

/**
 * Component hiển thị popup thông báo
 * Tự động ẩn sau 5 giây hoặc khi user click đóng
 */
export default function NotificationPopup({ show, onClose, notification }: NotificationPopupProps) {
  const { markAsRead } = useNotification();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show && notification) {
      setIsVisible(true);

      // Tự động ẩn sau 5 giây
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, notification]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleClick = () => {
    if (notification) {
      markAsRead(notification.id);
      if (notification.actionUrl) {
        window.location.href = notification.actionUrl;
      }
    }
    handleClose();
  };

  if (!show || !notification) {return null;}

  const getIcon = () => {
    switch (notification.type) {
    case 'success':
      return <CheckIcon className="w-6 h-6 text-green-500" />;
    case 'info':
      return <InformationCircleIcon className="w-6 h-6 text-blue-500" />;
    case 'warning':
      return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
    case 'error':
      return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />;
    default:
      return <InformationCircleIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'info':
      return 'bg-blue-50 border-blue-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    default:
      return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`max-w-sm w-full p-4 rounded-lg border shadow-lg cursor-pointer ${getBgColor()}`}
        onClick={handleClick}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600">
              {notification.message}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(notification.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
