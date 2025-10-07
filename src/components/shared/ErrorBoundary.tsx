import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ButtonFilled from '@/components/shared/button/ButtonFilled';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * ErrorBoundary Component
 * 
 * Component để bắt và xử lý lỗi JavaScript trong React component tree
 * Hiển thị fallback UI khi có lỗi xảy ra thay vì crash toàn bộ app
 * 
 * TODO: Tích hợp với error reporting service (Sentry, LogRocket, etc.)
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state để render fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send error to monitoring service
    // this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Implement error reporting
    // Example: Sentry.captureException(error, { extra: errorInfo });
    console.log('Error reported to monitoring service:', { error, errorInfo });
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Đã xảy ra lỗi
            </h1>
            
            <p className="text-gray-600 mb-6">
              Xin lỗi, có vẻ như đã xảy ra lỗi không mong muốn. 
              Chúng tôi đang khắc phục sự cố này.
            </p>

            {/* Error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Chi tiết lỗi (Development):
                </h3>
                <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}

            <div className="space-y-3">
              <ButtonFilled
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Thử lại
              </ButtonFilled>
              
              <button
                onClick={this.handleReload}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Tải lại trang
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ hỗ trợ.</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
