import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`w-full ${sizeClasses[size]} bg-white rounded-xl shadow-2xl ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                {title && (
                  <h2 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Specialized Modal Components
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'info',
  loading = false
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          confirmClass: 'bg-red-600 hover:bg-red-700 text-white',
          icon: '⚠️'
        };
      case 'warning':
        return {
          confirmClass: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          icon: '⚠️'
        };
      case 'info':
        return {
          confirmClass: 'bg-primary hover:bg-primary-600 text-white',
          icon: 'ℹ️'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      <div className="text-center">
        <div className="text-4xl mb-4">{config.icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${config.confirmClass}`}
          >
            {loading ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface ProductDetailModalProps {
  product: any; // CoffeeProduct
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: any, quantity: number, size: string, customizations: Record<string, string>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [selectedSize, setSelectedSize] = React.useState('M');
  const [quantity, setQuantity] = React.useState(1);
  const [customizations, setCustomizations] = React.useState<Record<string, string>>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getSelectedSizePrice = () => {
    const sizeOption = product.sizes.find((s: any) => s.name === selectedSize);
    return sizeOption ? sizeOption.price : product.price;
  };

  const handleAddToCart = () => {
    onAddToCart?.(product, quantity, selectedSize, customizations);
    onClose();
  };

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={product.name}
    >
      <div className="space-y-6">
        {/* Product Image */}
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(getSelectedSizePrice())}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} đánh giá)
              </span>
            </div>
          </div>

          <p className="text-gray-600">{product.description}</p>

          {/* Size Selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Kích thước</h4>
            <div className="flex gap-2">
              {product.sizes.map((size: any) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size.name)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedSize === size.name
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {size.name} - {formatPrice(size.price)}
                </button>
              ))}
            </div>
          </div>

          {/* Customizations */}
          {product.customizations.map((customization: any) => (
            <div key={customization.name}>
              <h4 className="font-medium text-gray-900 mb-2">{customization.name}</h4>
              <div className="flex flex-wrap gap-2">
                {customization.options.map((option: string) => (
                  <button
                    key={option}
                    onClick={() => setCustomizations(prev => ({
                      ...prev,
                      [customization.name]: option
                    }))}
                    className={`px-3 py-1 rounded-lg border transition-colors ${
                      customizations[customization.name] === option
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Số lượng</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary"
              >
                -
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full btn-primary py-3 text-lg"
          >
            Thêm vào giỏ - {formatPrice(getSelectedSizePrice() * quantity)}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Hook for modal management
export const useModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = React.useCallback(() => setIsOpen(true), []);
  const closeModal = React.useCallback(() => setIsOpen(false), []);
  const toggleModal = React.useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};
