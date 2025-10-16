import LoadingSpinner from './LoadingSpinner';

interface PageLoadingProps {
  show: boolean;
  message?: string;
  overlay?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * PageLoading Component
 * 
 * Component hiển thị loading state cho toàn bộ trang
 * Hỗ trợ overlay mode và custom message
 */
export default function PageLoading({ 
  show, 
  message = 'Đang tải...',
  overlay = true,
  size = 'lg'
}: PageLoadingProps) {
  if (!show) {return null;}

  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size={size} />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}