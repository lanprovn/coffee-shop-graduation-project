/**
 * Product Comparison System - Frontend only
 * So sánh nhiều sản phẩm với nhau
 */

import { useState, useEffect, useCallback } from 'react';
import { CoffeeProduct } from '@/types';
import { XMarkIcon, PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';

const COMPARISON_KEY = 'coffee-shop-comparison';

export interface ComparisonItem {
  product: CoffeeProduct;
  addedAt: string;
}

export function useProductComparison() {
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load comparison from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COMPARISON_KEY);
      if (saved) {
        setComparisonItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading comparison:', error);
    }
  }, []);

  // Save comparison to localStorage
  const saveComparison = useCallback((items: ComparisonItem[]) => {
    try {
      localStorage.setItem(COMPARISON_KEY, JSON.stringify(items));
      setComparisonItems(items);
    } catch (error) {
      console.error('Error saving comparison:', error);
    }
  }, []);

  // Add product to comparison
  const addToComparison = useCallback((product: CoffeeProduct) => {
    if (comparisonItems.length >= 4) {
      alert('Chỉ có thể so sánh tối đa 4 sản phẩm');
      return;
    }

    if (comparisonItems.some(item => item.product.id === product.id)) {
      alert('Sản phẩm đã có trong danh sách so sánh');
      return;
    }

    const newItem: ComparisonItem = {
      product,
      addedAt: new Date().toISOString()
    };

    const updated = [...comparisonItems, newItem];
    saveComparison(updated);
  }, [comparisonItems, saveComparison]);

  // Remove product from comparison
  const removeFromComparison = useCallback((productId: string) => {
    const updated = comparisonItems.filter(item => item.product.id !== productId);
    saveComparison(updated);
  }, [comparisonItems, saveComparison]);

  // Clear all comparison
  const clearComparison = useCallback(() => {
    saveComparison([]);
  }, [saveComparison]);

  // Check if product is in comparison
  const isInComparison = useCallback((productId: string) => {
    return comparisonItems.some(item => item.product.id === productId);
  }, [comparisonItems]);

  // Toggle comparison status
  const toggleComparison = useCallback((product: CoffeeProduct) => {
    if (isInComparison(product.id)) {
      removeFromComparison(product.id);
    } else {
      addToComparison(product);
    }
  }, [isInComparison, addToComparison, removeFromComparison]);

  return {
    comparisonItems,
    isOpen,
    setIsOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    toggleComparison,
    comparisonCount: comparisonItems.length
  };
}

/**
 * Comparison Button Component
 */
interface ComparisonButtonProps {
  product: CoffeeProduct;
  className?: string;
}

export function ComparisonButton({ product, className = '' }: ComparisonButtonProps) {
  const { isInComparison, toggleComparison, comparisonCount } = useProductComparison();
  const isCompared = isInComparison(product.id);

  return (
    <button
      onClick={() => toggleComparison(product)}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
        transition-colors duration-200
        ${isCompared 
      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
        ${className}
      `}
      title={isCompared ? 'Xóa khỏi so sánh' : 'Thêm vào so sánh'}
    >
      <PlusIcon className="w-4 h-4" />
      {isCompared ? 'Đã so sánh' : 'So sánh'}
      {comparisonCount > 0 && (
        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {comparisonCount}
        </span>
      )}
    </button>
  );
}

/**
 * Comparison Sidebar Component
 */
export function ComparisonSidebar() {
  const { 
    comparisonItems, 
    isOpen, 
    setIsOpen, 
    removeFromComparison, 
    clearComparison 
  } = useProductComparison();

  if (!isOpen || comparisonItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 z-50 transform transition-transform duration-300">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            So sánh sản phẩm ({comparisonItems.length}/4)
          </h3>
          <div className="flex gap-2">
            <button
              onClick={clearComparison}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Xóa tất cả
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {comparisonItems.map((item) => (
          <div key={item.product.id} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <img
                src={item.product.image}
                alt={item.product.displayName}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">
                  {item.product.displayName}
                </h4>
                <p className="text-sm text-primary font-semibold">
                  {item.product.basePrice.toLocaleString()}đ
                </p>
                <p className="text-xs text-gray-500">
                  {item.product.category}
                </p>
              </div>
              <button
                onClick={() => removeFromComparison(item.product.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {comparisonItems.length >= 2 && (
          <ButtonFilled
            onClick={() => {
              setIsOpen(false);
              window.location.href = '/compare';
            }}
            className="w-full"
          >
            <ArrowRightIcon className="w-4 h-4 mr-2" />
            So sánh ngay
          </ButtonFilled>
        )}
      </div>
    </div>
  );
}

/**
 * Product Comparison Page
 */
export function ProductComparisonPage() {
  const { comparisonItems, clearComparison } = useProductComparison();

  if (comparisonItems.length < 2) {
    return (
      <div className="max-w-screen-lg mx-auto p-4 mt-20">
        <div className="text-center py-16">
          <div className="text-8xl mb-6">⚖️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Cần ít nhất 2 sản phẩm để so sánh
          </h1>
          <p className="text-gray-600 mb-8">
            Hãy thêm thêm sản phẩm vào danh sách so sánh
          </p>
          <ButtonFilled onClick={() => window.location.href = '/products'}>
            Khám phá sản phẩm
          </ButtonFilled>
        </div>
      </div>
    );
  }

  const comparisonData = [
    { label: 'Tên sản phẩm', key: 'displayName' },
    { label: 'Giá', key: 'basePrice', format: (value: number) => `${value.toLocaleString()}đ` },
    { label: 'Danh mục', key: 'category' },
    { label: 'Mô tả', key: 'description' },
    { label: 'Số size', key: 'sizes', format: (value: any[]) => `${value.length} size` },
    { label: 'Số topping', key: 'toppings', format: (value: any[]) => `${value.length} topping` }
  ];

  return (
    <div className="max-w-screen-2xl mx-auto p-4 mt-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          So sánh sản phẩm
        </h1>
        <ButtonOutline onClick={clearComparison}>
          Xóa tất cả
        </ButtonOutline>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 w-48">
                  Thuộc tính
                </th>
                {comparisonItems.map((item) => (
                  <th key={item.product.id} className="px-6 py-4 text-center text-sm font-medium text-gray-900 min-w-64">
                    <div className="flex flex-col items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.displayName}
                        className="w-20 h-20 object-cover rounded mb-2"
                      />
                      <span className="font-semibold">{item.product.displayName}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comparisonData.map((data) => (
                <tr key={data.key}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {data.label}
                  </td>
                  {comparisonItems.map((item) => (
                    <td key={item.product.id} className="px-6 py-4 text-sm text-gray-600 text-center">
                      {data.format 
                        ? data.format((item.product as any)[data.key])
                        : (item.product as any)[data.key]
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 justify-center">
        {comparisonItems.map((item) => (
          <ButtonFilled
            key={item.product.id}
            onClick={() => window.location.href = `/product/${item.product.id}`}
            className="flex-1 max-w-48"
          >
            Xem chi tiết {item.product.displayName}
          </ButtonFilled>
        ))}
      </div>
    </div>
  );
}
