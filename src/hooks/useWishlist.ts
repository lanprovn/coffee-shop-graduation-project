/**
 * Wishlist System - Frontend only
 * Lưu trữ danh sách sản phẩm yêu thích trong localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { CoffeeProduct } from '@/types';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const WISHLIST_KEY = 'coffee-shop-wishlist';

export interface WishlistItem {
  productId: string;
  addedAt: string;
  product: CoffeeProduct;
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  }, []);

  // Save wishlist to localStorage
  const saveWishlist = useCallback((newWishlist: WishlistItem[]) => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
      setWishlist(newWishlist);
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }, []);

  // Add to wishlist
  const addToWishlist = useCallback((product: CoffeeProduct) => {
    setLoading(true);
    const wishlistItem: WishlistItem = {
      productId: product.id,
      addedAt: new Date().toISOString(),
      product
    };

    const newWishlist = [...wishlist, wishlistItem];
    saveWishlist(newWishlist);
    setLoading(false);
  }, [wishlist, saveWishlist]);

  // Remove from wishlist
  const removeFromWishlist = useCallback((productId: string) => {
    setLoading(true);
    const newWishlist = wishlist.filter(item => item.productId !== productId);
    saveWishlist(newWishlist);
    setLoading(false);
  }, [wishlist, saveWishlist]);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item.productId === productId);
  }, [wishlist]);

  // Toggle wishlist status
  const toggleWishlist = useCallback((product: CoffeeProduct) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  // Clear wishlist
  const clearWishlist = useCallback(() => {
    saveWishlist([]);
  }, [saveWishlist]);

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistCount: wishlist.length
  };
}

/**
 * Wishlist Button Component
 */
interface WishlistButtonProps {
  product: CoffeeProduct;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function WishlistButton({ 
  product, 
  size = 'md', 
  showText = false,
  className = '' 
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, loading } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

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

  return (
    <button
      onClick={() => toggleWishlist(product)}
      disabled={loading}
      className={`
        flex items-center gap-2 p-2 rounded-lg
        transition-colors duration-200
        ${isWishlisted 
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
        }
        ${sizeClasses[size]}
        ${className}
      `}
      title={isWishlisted ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
    >
      {isWishlisted ? (
        <HeartSolidIcon className={`${iconSizes[size]} fill-current`} />
      ) : (
        <HeartIcon className={`${iconSizes[size]}`} />
      )}
      {showText && (
        <span className="text-sm font-medium">
          {isWishlisted ? 'Đã yêu thích' : 'Yêu thích'}
        </span>
      )}
    </button>
  );
}

/**
 * Wishlist Page Component
 */
export function WishlistPage() {
  const { wishlist, clearWishlist, removeFromWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-screen-lg mx-auto p-4 mt-20">
        <div className="text-center py-16">
          <div className="text-8xl mb-6">❤️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Danh sách yêu thích trống
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Bạn chưa có sản phẩm nào trong danh sách yêu thích. 
            Hãy khám phá menu và thêm những món yêu thích!
          </p>
          <button
            onClick={() => window.location.href = '/products'}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Khám phá sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4 mt-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Danh sách yêu thích
          </h1>
          <p className="text-gray-600">
            {wishlist.length} sản phẩm yêu thích
          </p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item.productId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <img
                src={item.product.image}
                alt={item.product.displayName}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => removeFromWishlist(item.productId)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              >
                <HeartSolidIcon className="w-5 h-5 text-red-500 fill-current" />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                {item.product.displayName}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {item.product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {item.product.basePrice.toLocaleString()}đ
                </span>
                <button
                  onClick={() => window.location.href = `/product/${item.productId}`}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
