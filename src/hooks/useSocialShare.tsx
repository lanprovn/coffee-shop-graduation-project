/**
 * Social Sharing System - Frontend only
 * Chia sẻ sản phẩm và nội dung lên mạng xã hội
 */

import { useState, useCallback } from 'react';
import { 
  ShareIcon, 
  LinkIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export interface ShareData {
  title: string;
  text: string;
  url: string;
  image?: string;
}

export interface SocialPlatform {
  name: string;
  icon: string;
  color: string;
  shareUrl: (data: ShareData) => string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    name: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    shareUrl: (data) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}&quote=${encodeURIComponent(data.text)}`
  },
  {
    name: 'Twitter',
    icon: '🐦',
    color: '#1DA1F2',
    shareUrl: (data) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`
  },
  {
    name: 'WhatsApp',
    icon: '💬',
    color: '#25D366',
    shareUrl: (data) => `https://wa.me/?text=${encodeURIComponent(data.text + ' ' + data.url)}`
  },
  {
    name: 'Telegram',
    icon: '✈️',
    color: '#0088CC',
    shareUrl: (data) => `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.text)}`
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    color: '#0077B5',
    shareUrl: (data) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`
  },
  {
    name: 'Pinterest',
    icon: '📌',
    color: '#BD081C',
    shareUrl: (data) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(data.url)}&description=${encodeURIComponent(data.text)}&media=${encodeURIComponent(data.image || '')}`
  }
];

export function useSocialShare() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [copied, setCopied] = useState(false);

  // Open share modal
  const openShareModal = useCallback((data: ShareData) => {
    setShareData(data);
    setIsShareModalOpen(true);
  }, []);

  // Close share modal
  const closeShareModal = useCallback(() => {
    setIsShareModalOpen(false);
    setShareData(null);
    setCopied(false);
  }, []);

  // Share to specific platform
  const shareToPlatform = useCallback((platform: SocialPlatform, data: ShareData) => {
    const shareUrl = platform.shareUrl(data);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }, []);

  // Copy link to clipboard
  const copyToClipboard = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  // Native share API (for mobile)
  const nativeShare = useCallback(async (data: ShareData) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url
        });
      } catch (error) {
        console.error('Native share failed:', error);
      }
    } else {
      // Fallback to modal
      openShareModal(data);
    }
  }, [openShareModal]);

  return {
    isShareModalOpen,
    shareData,
    copied,
    openShareModal,
    closeShareModal,
    shareToPlatform,
    copyToClipboard,
    nativeShare
  };
}

/**
 * Share Button Component
 */
interface ShareButtonProps {
  data: ShareData;
  variant?: 'icon' | 'text' | 'full';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ShareButton({ 
  data, 
  variant = 'icon', 
  size = 'md',
  className = '' 
}: ShareButtonProps) {
  const { openShareModal, nativeShare } = useSocialShare();

  const handleClick = () => {
    if (navigator.share) {
      nativeShare(data);
    } else {
      openShareModal(data);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`${sizeClasses[size]} bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-lg flex items-center justify-center transition-colors duration-200 ${className}`}
        title="Chia sẻ"
      >
        <ShareIcon className={iconSizes[size]} />
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg transition-colors duration-200 ${className}`}
      >
        <ShareIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Chia sẻ</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors duration-200 ${className}`}
    >
      <ShareIcon className="w-4 h-4" />
      <span className="text-sm font-medium">Chia sẻ</span>
    </button>
  );
}

/**
 * Share Modal Component
 */
export function ShareModal() {
  const { 
    isShareModalOpen, 
    shareData, 
    copied, 
    closeShareModal, 
    shareToPlatform, 
    copyToClipboard 
  } = useSocialShare();

  if (!isShareModalOpen || !shareData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Chia sẻ
            </h3>
            <button
              onClick={closeShareModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Share Content Preview */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-3">
            {shareData.image && (
              <img
                src={shareData.image}
                alt={shareData.title}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">
                {shareData.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {shareData.text}
              </p>
            </div>
          </div>
        </div>

        {/* Social Platforms */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => shareToPlatform(platform, shareData)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">{platform.icon}</span>
                <span className="text-xs font-medium text-gray-700">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>

          {/* Copy Link */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareData.url}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard(shareData.url)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {copied ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Đã copy
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Product Share Component
 */
interface ProductShareProps {
  product: {
    id: string;
    displayName: string;
    description: string;
    image: string;
    basePrice: number;
  };
  className?: string;
}

export function ProductShare({ product, className = '' }: ProductShareProps) {
  const shareData: ShareData = {
    title: `${product.displayName} - Coffee Shop`,
    text: `Khám phá ${product.displayName} tại Coffee Shop! ${product.description}`,
    url: `${window.location.origin}/product/${product.id}`,
    image: product.image
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ShareButton data={shareData} variant="text" />
      <span className="text-sm text-gray-500">
        Chia sẻ sản phẩm này
      </span>
    </div>
  );
}

/**
 * Order Share Component
 */
interface OrderShareProps {
  order: {
    id: string;
    items: Array<{
      productName: string;
      quantity: number;
    }>;
    totalPayment: number;
  };
  className?: string;
}

export function OrderShare({ order, className = '' }: OrderShareProps) {
  const itemsText = order.items
    .map(item => `${item.productName} x${item.quantity}`)
    .join(', ');

  const shareData: ShareData = {
    title: `Đơn hàng #${order.id} - Coffee Shop`,
    text: `Tôi vừa đặt hàng tại Coffee Shop: ${itemsText}. Tổng cộng ${order.totalPayment.toLocaleString()}đ. Rất ngon và chất lượng!`,
    url: `${window.location.origin}/orders/${order.id}`
  };

  return (
    <ShareButton 
      data={shareData} 
      variant="full" 
      className={className}
    />
  );
}
