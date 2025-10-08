import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'white' | 'gray';
    text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color = 'primary',
    text
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const colorClasses = {
        primary: 'text-primary',
        white: 'text-white',
        gray: 'text-gray-500'
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            <motion.div
                className={`${sizeClasses[size]} ${colorClasses[color]}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            </motion.div>
            {text && (
                <p className={`text-sm ${colorClasses[color]}`}>
                    {text}
                </p>
            )}
        </div>
    );
};

interface LoadingSkeletonProps {
    className?: string;
    lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    className = '',
    lines = 1
}) => {
    return (
        <div className={`animate-pulse ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className="h-4 bg-gray-200 rounded mb-2"
                    style={{
                        width: `${Math.random() * 40 + 60}%`
                    }}
                />
            ))}
        </div>
    );
};

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback;
            return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
        }

        return this.props.children;
    }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({
    error,
    resetError
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cream">
            <div className="max-w-md w-full mx-auto p-6">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="text-6xl mb-4">😵</div>
                    <h2 className="text-2xl font-bold text-neutral-800 mb-4">
                        Oops! Có lỗi xảy ra
                    </h2>
                    <p className="text-neutral-600 mb-6">
                        Xin lỗi, có vẻ như đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.
                    </p>
                    {error && (
                        <details className="mb-6 text-left">
                            <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                                Chi tiết lỗi
                            </summary>
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                                {error.message}
                            </pre>
                        </details>
                    )}
                    <div className="space-y-3">
                        <button
                            onClick={resetError}
                            className="w-full btn-primary"
                        >
                            Thử lại
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full btn-outline"
                        >
                            Tải lại trang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    title = 'Có lỗi xảy ra',
    message,
    onRetry,
    className = ''
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                        {message}
                    </p>
                    {onRetry && (
                        <div className="mt-3">
                            <button
                                onClick={onRetry}
                                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    className = ''
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center py-12 ${className}`}
        >
            {icon && (
                <div className="text-6xl mb-4 text-gray-400">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-medium text-neutral-800 mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-neutral-600 mb-6 max-w-sm mx-auto">
                    {description}
                </p>
            )}
            {action && (
                <div className="flex justify-center">
                    {action}
                </div>
            )}
        </motion.div>
    );
};

interface LoadingOverlayProps {
    isLoading: boolean;
    children: React.ReactNode;
    text?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isLoading,
    children,
    text = 'Đang tải...'
}) => {
    return (
        <div className="relative">
            {children}
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <LoadingSpinner text={text} />
                </motion.div>
            )}
        </div>
    );
};
