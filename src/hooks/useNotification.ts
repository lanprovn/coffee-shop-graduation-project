import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import type { Notification } from '@/types';

/**
 * Hook quản lý hệ thống thông báo real-time
 * Lưu trữ và hiển thị thông báo cho user với tính năng real-time
 */
export const useNotification = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(true);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Simulate WebSocket connection for real-time notifications
    useEffect(() => {
        if (!user) return;

        // Simulate connection status
        const simulateConnection = () => {
            setIsConnected(true);

            // Simulate occasional disconnections
            if (Math.random() < 0.1) {
                setIsConnected(false);
                setTimeout(() => setIsConnected(true), 2000);
            }
        };

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(simulateConnection, 10000);

        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [user]);

    // Load notifications từ localStorage
    useEffect(() => {
        if (user) {
            const loadNotifications = () => {
                try {
                    const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
                    if (savedNotifications) {
                        const parsedNotifications = JSON.parse(savedNotifications);
                        setNotifications(parsedNotifications);
                        setUnreadCount(parsedNotifications.filter((n: Notification) => !n.isRead).length);
                    }
                } catch (error) {
                    console.error('Error loading notifications:', error);
                }
            };

            loadNotifications();
        }
    }, [user]);

    // Lưu notifications vào localStorage
    const saveNotifications = useCallback((newNotifications: Notification[]) => {
        if (!user) return;

        try {
            localStorage.setItem(`notifications_${user.id}`, JSON.stringify(newNotifications));
            setNotifications(newNotifications);
            setUnreadCount(newNotifications.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    }, [user]);

    // Thêm thông báo mới với animation
    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
        if (!user) return;

        const newNotification: Notification = {
            ...notification,
            id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            isRead: false,
        };

        const updatedNotifications = [newNotification, ...notifications];
        saveNotifications(updatedNotifications);

        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(newNotification.title, {
                body: newNotification.message,
                icon: '/favicon.ico',
                tag: newNotification.id,
            });
        }

        return newNotification.id;
    }, [user, notifications, saveNotifications]);

    // Đánh dấu thông báo đã đọc
    const markAsRead = useCallback((notificationId: string) => {
        const updatedNotifications = notifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
        );
        saveNotifications(updatedNotifications);
    }, [notifications, saveNotifications]);

    // Đánh dấu tất cả đã đọc
    const markAllAsRead = useCallback(() => {
        const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
        saveNotifications(updatedNotifications);
    }, [notifications, saveNotifications]);

    // Xóa thông báo
    const deleteNotification = useCallback((notificationId: string) => {
        const updatedNotifications = notifications.filter(n => n.id !== notificationId);
        saveNotifications(updatedNotifications);
    }, [notifications, saveNotifications]);

    // Xóa tất cả thông báo
    const clearAllNotifications = useCallback(() => {
        saveNotifications([]);
    }, [saveNotifications]);

    // Request notification permission
    const requestNotificationPermission = useCallback(async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return Notification.permission === 'granted';
    }, []);

    // Thông báo đặt hàng thành công
    const notifyOrderSuccess = useCallback((orderId: string, totalAmount?: number) => {
        const message = totalAmount
            ? `Đơn hàng #${orderId} đã được đặt thành công với tổng giá trị ${totalAmount.toLocaleString('vi-VN')}đ`
            : `Đơn hàng #${orderId} đã được đặt thành công!`;

        return addNotification({
            userId: user?.id || '',
            title: '🎉 Đặt hàng thành công!',
            message,
            type: 'success',
            actionUrl: `/order-status/${orderId}`,
            priority: 'high',
        });
    }, [addNotification, user]);

    // Thông báo cập nhật trạng thái đơn hàng
    const notifyOrderStatusUpdate = useCallback((orderId: string, status: string) => {
        const statusConfig: Record<string, { message: string; emoji: string; type: 'success' | 'info' | 'warning' | 'error' }> = {
            'confirmed': { message: 'Đơn hàng đã được xác nhận', emoji: '✅', type: 'success' },
            'preparing': { message: 'Đơn hàng đang được chuẩn bị', emoji: '👨‍🍳', type: 'info' },
            'ready': { message: 'Đơn hàng đã sẵn sàng để giao', emoji: '📦', type: 'success' },
            'delivered': { message: 'Đơn hàng đã được giao thành công', emoji: '🚚', type: 'success' },
            'cancelled': { message: 'Đơn hàng đã bị hủy', emoji: '❌', type: 'error' },
        };

        const config = statusConfig[status] || { message: 'Trạng thái đơn hàng đã được cập nhật', emoji: '📋', type: 'info' };

        return addNotification({
            userId: user?.id || '',
            title: `${config.emoji} Cập nhật đơn hàng`,
            message: `${config.message} - Đơn hàng #${orderId}`,
            type: config.type,
            actionUrl: `/order-status/${orderId}`,
            priority: 'high',
        });
    }, [addNotification, user]);

    // Thông báo khuyến mãi
    const notifyPromotion = useCallback((title: string, message: string, actionUrl?: string) => {
        return addNotification({
            userId: user?.id || '',
            title: `🎁 ${title}`,
            message,
            type: 'info',
            actionUrl: actionUrl || '/promotions',
            priority: 'medium',
        });
    }, [addNotification, user]);

    // Thông báo hệ thống
    const notifySystem = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', priority: 'low' | 'medium' | 'high' = 'medium') => {
        const emojiMap: Record<string, string> = {
            'success': '✅',
            'info': 'ℹ️',
            'warning': '⚠️',
            'error': '❌',
        };

        return addNotification({
            userId: user?.id || '',
            title: `${emojiMap[type]} ${title}`,
            message,
            type,
            priority,
        });
    }, [addNotification, user]);

    // Thông báo điểm tích lũy
    const notifyPointsEarned = useCallback((points: number, reason: string) => {
        return addNotification({
            userId: user?.id || '',
            title: '⭐ Điểm tích lũy',
            message: `Bạn đã nhận được ${points} điểm từ ${reason}`,
            type: 'success',
            actionUrl: '/membership',
            priority: 'medium',
        });
    }, [addNotification, user]);

    // Thông báo lên cấp thành viên
    const notifyMembershipUpgrade = useCallback((newLevel: string) => {
        return addNotification({
            userId: user?.id || '',
            title: '🎊 Chúc mừng!',
            message: `Bạn đã lên cấp thành viên ${newLevel}! Hãy khám phá những ưu đãi mới.`,
            type: 'success',
            actionUrl: '/membership',
            priority: 'high',
        });
    }, [addNotification, user]);

    // Thông báo voucher mới
    const notifyNewVoucher = useCallback((voucherCode: string, discountValue: string) => {
        return addNotification({
            userId: user?.id || '',
            title: '🎫 Voucher mới',
            message: `Bạn có voucher mới: ${voucherCode} - Giảm ${discountValue}`,
            type: 'info',
            actionUrl: '/checkout',
            priority: 'medium',
        });
    }, [addNotification, user]);

    // Thông báo cửa hàng gần bạn
    const notifyNearbyStore = useCallback((storeName: string, distance: string) => {
        return addNotification({
            userId: user?.id || '',
            title: '📍 Cửa hàng gần bạn',
            message: `${storeName} chỉ cách bạn ${distance}. Hãy ghé thăm!`,
            type: 'info',
            actionUrl: '/stores',
            priority: 'low',
        });
    }, [addNotification, user]);

    // Simulate real-time notifications
    const simulateRealTimeNotifications = useCallback(() => {
        if (!user || !isConnected) return;

        const notifications = [
            () => notifyPromotion('Khuyến mãi cuối tuần', 'Giảm giá 20% cho tất cả đồ uống đá xay', '/products?category=freeze'),
            () => notifyNewVoucher('WEEKEND20', '20%'),
            () => notifyPointsEarned(50, 'đánh giá sản phẩm'),
            () => notifyNearbyStore('Coffee Shop Vincom', '500m'),
        ];

        // Randomly trigger notifications
        if (Math.random() < 0.3) {
            const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
            randomNotification();
        }
    }, [user, isConnected, notifyPromotion, notifyNewVoucher, notifyPointsEarned, notifyNearbyStore]);

    // Start real-time simulation
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(simulateRealTimeNotifications, 30000); // Every 30 seconds
        return () => clearInterval(interval);
    }, [simulateRealTimeNotifications, user]);

    // Get notifications by type
    const getNotificationsByType = useCallback((type: string) => {
        return notifications.filter(n => n.type === type);
    }, [notifications]);

    // Get recent notifications (last 24 hours)
    const getRecentNotifications = useCallback(() => {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return notifications.filter(n => new Date(n.createdAt) > oneDayAgo);
    }, [notifications]);

    // Get unread notifications
    const getUnreadNotifications = useCallback(() => {
        return notifications.filter(n => !n.isRead);
    }, [notifications]);

    return {
        notifications,
        unreadCount,
        isConnected,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        requestNotificationPermission,
        notifyOrderSuccess,
        notifyOrderStatusUpdate,
        notifyPromotion,
        notifySystem,
        notifyPointsEarned,
        notifyMembershipUpgrade,
        notifyNewVoucher,
        notifyNearbyStore,
        getNotificationsByType,
        getRecentNotifications,
        getUnreadNotifications,
    };
};