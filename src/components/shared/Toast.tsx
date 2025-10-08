import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = {
            ...toast,
            id,
            duration: toast.duration ?? 5000,
        };

        setToasts(prev => [...prev, newToast]);

        // Auto remove toast after duration
        if (newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
                ))}
            </AnimatePresence>
        </div>
    );
};

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
    const getToastConfig = (type: ToastType) => {
        switch (type) {
            case 'success':
                return {
                    icon: CheckCircleIcon,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    iconColor: 'text-green-400',
                    titleColor: 'text-green-800',
                    messageColor: 'text-green-700',
                };
            case 'error':
                return {
                    icon: XCircleIcon,
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    iconColor: 'text-red-400',
                    titleColor: 'text-red-800',
                    messageColor: 'text-red-700',
                };
            case 'warning':
                return {
                    icon: ExclamationTriangleIcon,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    iconColor: 'text-yellow-400',
                    titleColor: 'text-yellow-800',
                    messageColor: 'text-yellow-700',
                };
            case 'info':
                return {
                    icon: InformationCircleIcon,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    iconColor: 'text-blue-400',
                    titleColor: 'text-blue-800',
                    messageColor: 'text-blue-700',
                };
        }
    };

    const config = getToastConfig(toast.type);
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.5 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4 relative overflow-hidden`}
        >
            {/* Progress Bar */}
            {toast.duration && toast.duration > 0 && (
                <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-current opacity-30"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                />
            )}

            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <div className="ml-3 flex-1">
                    <h4 className={`text-sm font-medium ${config.titleColor}`}>
                        {toast.title}
                    </h4>
                    {toast.message && (
                        <p className={`mt-1 text-sm ${config.messageColor}`}>
                            {toast.message}
                        </p>
                    )}
                    {toast.action && (
                        <div className="mt-3">
                            <button
                                onClick={toast.action.onClick}
                                className={`text-sm font-medium ${config.titleColor} hover:underline`}
                            >
                                {toast.action.label}
                            </button>
                        </div>
                    )}
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={() => onRemove(toast.id)}
                        className={`${config.iconColor} hover:opacity-70 transition-opacity`}
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Hook for easy toast usage
export const useToastNotifications = () => {
    const { addToast } = useToast();

    const showSuccess = useCallback((title: string, message?: string, action?: Toast['action']) => {
        addToast({ type: 'success', title, message, action });
    }, [addToast]);

    const showError = useCallback((title: string, message?: string, action?: Toast['action']) => {
        addToast({ type: 'error', title, message, action });
    }, [addToast]);

    const showWarning = useCallback((title: string, message?: string, action?: Toast['action']) => {
        addToast({ type: 'warning', title, message, action });
    }, [addToast]);

    const showInfo = useCallback((title: string, message?: string, action?: Toast['action']) => {
        addToast({ type: 'info', title, message, action });
    }, [addToast]);

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
};

// Toast variants for different use cases
export const toastVariants = {
    productAdded: (productName: string) => ({
        type: 'success' as ToastType,
        title: 'Đã thêm vào giỏ hàng',
        message: `${productName} đã được thêm vào giỏ hàng của bạn`,
        duration: 3000,
    }),

    productRemoved: (productName: string) => ({
        type: 'info' as ToastType,
        title: 'Đã xóa khỏi giỏ hàng',
        message: `${productName} đã được xóa khỏi giỏ hàng`,
        duration: 3000,
    }),

    wishlistAdded: (productName: string) => ({
        type: 'success' as ToastType,
        title: 'Đã thêm vào yêu thích',
        message: `${productName} đã được thêm vào danh sách yêu thích`,
        duration: 3000,
    }),

    wishlistRemoved: (productName: string) => ({
        type: 'info' as ToastType,
        title: 'Đã xóa khỏi yêu thích',
        message: `${productName} đã được xóa khỏi danh sách yêu thích`,
        duration: 3000,
    }),

    orderPlaced: (orderId: string) => ({
        type: 'success' as ToastType,
        title: 'Đặt hàng thành công',
        message: `Đơn hàng ${orderId} đã được đặt thành công`,
        duration: 5000,
        action: {
            label: 'Xem chi tiết',
            onClick: () => {
                // Navigate to order details
                console.log('Navigate to order details');
            },
        },
    }),

    networkError: () => ({
        type: 'error' as ToastType,
        title: 'Lỗi kết nối',
        message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.',
        duration: 0, // Don't auto-dismiss
    }),

    loginRequired: () => ({
        type: 'warning' as ToastType,
        title: 'Cần đăng nhập',
        message: 'Vui lòng đăng nhập để tiếp tục',
        duration: 0,
        action: {
            label: 'Đăng nhập',
            onClick: () => {
                // Navigate to login
                console.log('Navigate to login');
            },
        },
    }),
};
