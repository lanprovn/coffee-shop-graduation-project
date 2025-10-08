import { useState, useEffect } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { useNavigate } from 'react-router-dom';
import { 
  BellIcon, 
  XMarkIcon, 
  CheckIcon, 
  InformationCircleIcon, 
  ExclamationTriangleIcon, 
  ExclamationCircleIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  WifiIcon,
  SignalSlashIcon
} from '@heroicons/react/24/outline';
import ButtonOutline from './button/ButtonOutline';
import ButtonFilled from './button/ButtonFilled';

/**
 * NotificationCenter: Component hiển thị trung tâm thông báo với UI/UX cải thiện
 * Bao gồm real-time status, filtering, và quản lý thông báo nâng cao
 */
export default function NotificationCenter() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    requestNotificationPermission,
    getNotificationsByType,
    getRecentNotifications,
    getUnreadNotifications,
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'recent'>('all');
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      setShowPermissionRequest(true);
    }
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
    case 'success':
      return <CheckIcon className="w-5 h-5 text-green-500" />;
    case 'info':
      return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    case 'warning':
      return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
    case 'error':
      return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
    default:
      return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Vừa xong';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setShowPermissionRequest(false);
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
    case 'unread':
      return getUnreadNotifications();
    case 'recent':
      return getRecentNotifications();
    default:
      return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
    case 'high':
      return 'border-l-red-500 bg-red-50';
    case 'medium':
      return 'border-l-yellow-500 bg-yellow-50';
    case 'low':
      return 'border-l-green-500 bg-green-50';
    default:
      return 'border-l-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon with Connection Status */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary transition-colors group"
      >
        <BellIcon className="w-6 h-6" />
                
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Connection Status */}
        <div className="absolute -bottom-1 -right-1">
          {isConnected ? (
            <WifiIcon className="w-3 h-3 text-green-500" />
          ) : (
            <SignalSlashIcon className="w-3 h-3 text-red-500" />
          )}
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800">Thông báo</h3>
                {!isConnected && (
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                        Mất kết nối
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <ButtonOutline
                    onClick={markAllAsRead}
                    className="text-xs px-2 py-1"
                  >
                    <EyeIcon className="w-3 h-3 mr-1" />
                                        Đã đọc
                  </ButtonOutline>
                )}
                <ButtonOutline
                  onClick={clearAllNotifications}
                  className="text-xs px-2 py-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <TrashIcon className="w-3 h-3 mr-1" />
                                    Xóa
                </ButtonOutline>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'Tất cả', count: notifications.length },
                { key: 'unread', label: 'Chưa đọc', count: unreadCount },
                { key: 'recent', label: 'Gần đây', count: getRecentNotifications().length },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === key
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Permission Request */}
          {showPermissionRequest && (
            <div className="p-4 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                                            Bật thông báo để không bỏ lỡ ưu đãi
                    </p>
                    <p className="text-xs text-blue-600">
                                            Nhận thông báo về đơn hàng và khuyến mãi
                    </p>
                  </div>
                </div>
                <ButtonFilled
                  onClick={handleRequestPermission}
                  className="text-xs px-3 py-1"
                >
                                    Bật ngay
                </ButtonFilled>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BellIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium mb-1">
                  {filter === 'unread' ? 'Không có thông báo chưa đọc' :
                    filter === 'recent' ? 'Không có thông báo gần đây' :
                      'Chưa có thông báo nào'}
                </p>
                <p className="text-sm">
                  {filter === 'unread' ? 'Tất cả thông báo đã được đọc' :
                    filter === 'recent' ? 'Không có thông báo trong 24h qua' :
                      'Thông báo mới sẽ xuất hiện ở đây'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  } ${getPriorityColor(notification.priority || 'low')}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`font-medium text-sm ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </p>
                        {notification.actionUrl && (
                          <span className="text-xs text-primary-600 font-medium">
                                                        Xem chi tiết →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>
                  {filteredNotifications.length} thông báo
                </span>
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <WifiIcon className="w-3 h-3" />
                      <span>Đã kết nối</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <SignalSlashIcon className="w-3 h-3" />
                      <span>Mất kết nối</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}