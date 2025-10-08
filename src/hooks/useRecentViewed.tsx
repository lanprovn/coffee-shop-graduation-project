/**
 * Recently Viewed Products System - Frontend only
 * Lưu trữ lịch sử xem sản phẩm gần đây
 */

import { useState, useEffect, useCallback } from 'react';
import { CoffeeProduct } from '@/types';
import { ClockIcon, EyeIcon } from '@heroicons/react/24/outline';

const RECENT_VIEWED_KEY = 'coffee-shop-recent-viewed';
const MAX_RECENT_ITEMS = 20;

export interface RecentViewedItem {
  product: CoffeeProduct;
  viewedAt: string;
  viewCount: number;
}

export function useRecentViewed() {
  const [recentItems, setRecentItems] = useState<RecentViewedItem[]>([]);

  // Load recent viewed from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_VIEWED_KEY);
      if (saved) {
        setRecentItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recent viewed:', error);
    }
  }, []);

  // Save recent viewed to localStorage
  const saveRecentViewed = useCallback((items: RecentViewedItem[]) => {
    try {
      localStorage.setItem(RECENT_VIEWED_KEY, JSON.stringify(items));
      setRecentItems(items);
    } catch (error) {
      console.error('Error saving recent viewed:', error);
    }
  }, []);

  // Add product to recent viewed
  const addToRecentViewed = useCallback((product: CoffeeProduct) => {
    const now = new Date().toISOString();
    
    setRecentItems(prev => {
      // Check if product already exists
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      
      let updated: RecentViewedItem[];
      
      if (existingIndex >= 0) {
        // Update existing item
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          viewedAt: now,
          viewCount: updated[existingIndex].viewCount + 1
        };
        // Move to front
        const item = updated.splice(existingIndex, 1)[0];
        updated.unshift(item);
      } else {
        // Add new item
        const newItem: RecentViewedItem = {
          product,
          viewedAt: now,
          viewCount: 1
        };
        updated = [newItem, ...prev];
      }
      
      // Keep only MAX_RECENT_ITEMS
      return updated.slice(0, MAX_RECENT_ITEMS);
    });
  }, []);

  // Clear recent viewed
  const clearRecentViewed = useCallback(() => {
    saveRecentViewed([]);
  }, [saveRecentViewed]);

  // Remove specific item
  const removeFromRecentViewed = useCallback((productId: string) => {
    setRecentItems(prev => {
      const updated = prev.filter(item => item.product.id !== productId);
      saveRecentViewed(updated);
      return updated;
    });
  }, [saveRecentViewed]);

  // Get recent viewed (last 10)
  const getRecentViewed = useCallback(() => {
    return recentItems.slice(0, 10);
  }, [recentItems]);

  // Check if product was recently viewed
  const isRecentlyViewed = useCallback((productId: string) => {
    return recentItems.some(item => item.product.id === productId);
  }, [recentItems]);

  return {
    recentItems,
    addToRecentViewed,
    clearRecentViewed,
    removeFromRecentViewed,
    getRecentViewed,
    isRecentlyViewed,
    recentCount: recentItems.length
  };
}

/**
 * Recently Viewed Component
 */
interface RecentlyViewedProps {
  title?: string;
  maxItems?: number;
  showViewCount?: boolean;
  className?: string;
}

export function RecentlyViewed({ 
  title = 'Sản phẩm đã xem gần đây',
  maxItems = 5,
  showViewCount = false,
  className = ''
}: RecentlyViewedProps) {
  const { getRecentViewed, removeFromRecentViewed } = useRecentViewed();
  const recentItems = getRecentViewed().slice(0, maxItems);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const viewedAt = new Date(dateString);
    const diff = now.getTime() - viewedAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {return 'Vừa xong';}
    if (minutes < 60) {return `${minutes} phút trước`;}
    if (hours < 24) {return `${hours} giờ trước`;}
    return `${days} ngày trước`;
  };

  if (recentItems.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <ClockIcon className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {recentItems.map((item) => (
          <div key={item.product.id} className="group relative">
            <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
              <div className="relative">
                <img
                  src={item.product.image}
                  alt={item.product.displayName}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeFromRecentViewed(item.product.id)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <EyeIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                  {item.product.displayName}
                </h4>
                <p className="text-primary font-semibold text-sm mt-1">
                  {item.product.basePrice.toLocaleString()}đ
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(item.viewedAt)}
                  </p>
                  {showViewCount && (
                    <span className="text-xs text-gray-400">
                      {item.viewCount} lần
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => window.location.href = `/product/${item.product.id}`}
              className="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
          </div>
        ))}
      </div>

      {recentItems.length > maxItems && (
        <div className="mt-4 text-center">
          <button
            onClick={() => window.location.href = '/recent-viewed'}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Xem tất cả ({recentItems.length})
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Recent Viewed Page
 */
export function RecentViewedPage() {
  const { recentItems, clearRecentViewed, removeFromRecentViewed } = useRecentViewed();

  if (recentItems.length === 0) {
    return (
      <div className="max-w-screen-lg mx-auto p-4 mt-20">
        <div className="text-center py-16">
          <div className="text-8xl mb-6">👁️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Chưa có sản phẩm nào được xem
          </h1>
          <p className="text-gray-600 mb-8">
            Hãy khám phá các sản phẩm để xem lịch sử xem gần đây
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

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const viewedAt = new Date(dateString);
    const diff = now.getTime() - viewedAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {return 'Vừa xong';}
    if (minutes < 60) {return `${minutes} phút trước`;}
    if (hours < 24) {return `${hours} giờ trước`;}
    return `${days} ngày trước`;
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4 mt-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Sản phẩm đã xem gần đây
          </h1>
          <p className="text-gray-600">
            {recentItems.length} sản phẩm đã xem
          </p>
        </div>
        <button
          onClick={clearRecentViewed}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentItems.map((item) => (
          <div key={item.product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <img
                src={item.product.image}
                alt={item.product.displayName}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => removeFromRecentViewed(item.product.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              >
                <EyeIcon className="w-4 h-4 text-gray-600" />
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
                <div>
                  <span className="text-lg font-bold text-primary">
                    {item.product.basePrice.toLocaleString()}đ
                  </span>
                  <p className="text-xs text-gray-500">
                    Xem {item.viewCount} lần • {formatTimeAgo(item.viewedAt)}
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = `/product/${item.product.id}`}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Xem lại
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
