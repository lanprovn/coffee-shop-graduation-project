import { ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/utils/helper';

interface ErrorMessageProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}

/**
 * ErrorMessage Component
 * 
 * Component hiển thị thông báo lỗi, cảnh báo, thông tin hoặc thành công
 * Hỗ trợ dismiss functionality và nhiều variants
 */
export default function ErrorMessage({
  type = 'error',
  title,
  message,
  onDismiss,
  className,
  showIcon = true,
  fullWidth = false
}: ErrorMessageProps) {
  
  const typeConfig = {
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
      titleColor: 'text-red-900'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-900'
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-900'
    },
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
      titleColor: 'text-green-900'
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div className={classNames(
      'rounded-lg border p-4',
      config.bgColor,
      config.borderColor,
      fullWidth ? 'w-full' : '',
      className
    )}>
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            <IconComponent className={classNames('h-5 w-5', config.iconColor)} />
          </div>
        )}
        
        <div className={classNames('ml-3', showIcon ? '' : 'ml-0')}>
          {title && (
            <h3 className={classNames('text-sm font-medium', config.titleColor)}>
              {title}
            </h3>
          )}
          <div className={classNames('text-sm', config.textColor)}>
            <p>{message}</p>
          </div>
        </div>

        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={classNames(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  config.iconColor,
                  'hover:bg-opacity-20'
                )}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
