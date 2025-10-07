import { classNames } from '@/utils/helper';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray' | 'green' | 'red' | 'blue';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * LoadingSpinner Component
 * 
 * Component hiển thị loading state với nhiều variants và sizes
 * Hỗ trợ spinner, dots, pulse, và bars animations
 */
export default function LoadingSpinner({ 
  size = 'md',
  color = 'primary',
  variant = 'spinner',
  text,
  fullScreen = false,
  className
}: LoadingSpinnerProps) {
  
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-gray-500',
    green: 'text-green-500',
    red: 'text-red-500',
    blue: 'text-blue-500'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const renderSpinner = () => (
    <svg
      className={classNames(
        sizeClasses[size],
        colorClasses[color],
        'animate-spin',
        className
      )}
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );

  const renderDots = () => (
    <div className={classNames('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={classNames(
            'rounded-full animate-pulse',
            size === 'xs' ? 'w-1 h-1' :
            size === 'sm' ? 'w-2 h-2' :
            size === 'md' ? 'w-3 h-3' :
            size === 'lg' ? 'w-4 h-4' : 'w-5 h-5',
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={classNames(
        'rounded-full animate-pulse',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );

  const renderBars = () => (
    <div className={classNames('flex space-x-1', className)}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={classNames(
            'animate-pulse',
            size === 'xs' ? 'w-1 h-3' :
            size === 'sm' ? 'w-1 h-4' :
            size === 'md' ? 'w-1 h-6' :
            size === 'lg' ? 'w-1 h-8' : 'w-1 h-10',
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );

  const renderLoadingIcon = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoadingIcon()}
      {text && (
        <p className={classNames(
          textSizeClasses[size],
          colorClasses[color],
          'font-medium'
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}