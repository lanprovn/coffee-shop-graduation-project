import { useState } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ProductCategory } from '@/types';

interface ProductFilterProps {
    category: string;
    temperature: string; // Changed from 'type' to 'temperature'
    priceRange: { min: number; max: number };
    onCategoryChange: (category: string) => void;
    onTemperatureChange: (temperature: string) => void; // Changed from onTypeChange
    onPriceRangeChange: (range: { min: number; max: number }) => void;
    onReset: () => void;
}

/**
 * ProductFilter: Component filter nâng cao cho danh sách sản phẩm
 * Bao gồm filter theo category, temperature, price range
 */
export default function ProductFilter({
  category,
  temperature, // Changed from 'type' to 'temperature'
  priceRange,
  onCategoryChange,
  onTemperatureChange, // Changed from onTypeChange
  onPriceRangeChange,
  onReset,
}: ProductFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { value: 'all', label: 'Tất cả', icon: '☕' },
    { value: ProductCategory.Coffee, label: 'Cà phê', icon: '☕' },
    { value: ProductCategory.Tea, label: 'Trà', icon: '🍵' },
    { value: ProductCategory.Freeze, label: 'Đá xay', icon: '🧊' },
    { value: ProductCategory.Cake, label: 'Bánh ngọt', icon: '🍰' },
  ];

  const temperatures = [ // Changed from 'types' to 'temperatures'
    { value: 'all', label: 'Tất cả' },
    { value: 'hot', label: 'Nóng' },
    { value: 'cold', label: 'Đá' },
  ];

  const priceRanges = [
    { min: 0, max: 50000, label: 'Dưới 50k' },
    { min: 50000, max: 100000, label: '50k - 100k' },
    { min: 100000, max: 200000, label: '100k - 200k' },
    { min: 200000, max: 1000000, label: 'Trên 200k' },
  ];

  const hasActiveFilters = category !== 'all' || temperature !== 'all' || priceRange.min > 0 || priceRange.max < 1000000;

  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Bộ lọc sản phẩm</h3>
          {hasActiveFilters && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                            Đang lọc
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <XMarkIcon className="w-4 h-4" />
                            Xóa bộ lọc
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary hover:text-primary-600"
          >
            {isExpanded ? 'Thu gọn' : 'Mở rộng'}
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${category === cat.value
              ? 'bg-primary text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t pt-4 space-y-4">
          {/* Temperature Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhiệt độ
            </label>
            <div className="flex gap-2">
              {temperatures.map((temp) => (
                <button
                  key={temp.value}
                  onClick={() => onTemperatureChange(temp.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${temperature === temp.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {temp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Khoảng giá
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => onPriceRangeChange(range)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${priceRange.min === range.min && priceRange.max === range.max
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tùy chỉnh giá
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Từ"
                value={priceRange.min || ''}
                onChange={(e) => onPriceRangeChange({
                  min: parseInt(e.target.value) || 0,
                  max: priceRange.max
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Đến"
                value={priceRange.max || ''}
                onChange={(e) => onPriceRangeChange({
                  min: priceRange.min,
                  max: parseInt(e.target.value) || 1000000
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
