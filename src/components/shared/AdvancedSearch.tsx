/**
 * Advanced Search Component với filters nâng cao
 * Frontend-only implementation
 */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useProduct } from '@/hooks/useProduct';
import { ProductCategory, CoffeeProduct } from '@/types';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';

interface SearchFilters {
  query: string;
  category: ProductCategory | 'all';
  priceRange: [number, number];
  rating: number;
  sortBy: 'name' | 'price' | 'rating' | 'popularity';
  sortOrder: 'asc' | 'desc';
  inStock: boolean;
  hasDiscount: boolean;
}

export default function AdvancedSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getAllProducts } = useProduct();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    category: (searchParams.get('category') as ProductCategory) || 'all',
    priceRange: [0, 200000],
    rating: 0,
    sortBy: 'popularity',
    sortOrder: 'desc',
    inStock: true,
    hasDiscount: false
  });

  const allProducts = getAllProducts();

  // Advanced filtering logic
  const filteredProducts = useMemo(() => {
    let results = [...allProducts];

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(product => 
        product.displayName.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      results = results.filter(product => product.category === filters.category);
    }

    // Price range filter
    results = results.filter(product => {
      const minPrice = Math.min(...product.sizes.map(s => s.price));
      const maxPrice = Math.max(...product.sizes.map(s => s.price));
      return minPrice >= filters.priceRange[0] && maxPrice <= filters.priceRange[1];
    });

    // Rating filter
    if (filters.rating > 0) {
      results = results.filter(product => {
        // Mock rating - trong thực tế sẽ lấy từ API
        const mockRating = Math.random() * 5;
        return mockRating >= filters.rating;
      });
    }

    // Stock filter
    if (filters.inStock) {
      results = results.filter(product => {
        // Mock stock - trong thực tế sẽ lấy từ API
        const mockStock = Math.floor(Math.random() * 50);
        return mockStock > 0;
      });
    }

    // Discount filter
    if (filters.hasDiscount) {
      results = results.filter(product => {
        // Mock discount - trong thực tế sẽ lấy từ API
        return Math.random() > 0.7; // 30% products có discount
      });
    }

    // Sorting
    results.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
      case 'name':
        aValue = a.displayName;
        bValue = b.displayName;
        break;
      case 'price':
        aValue = Math.min(...a.sizes.map(s => s.price));
        bValue = Math.min(...b.sizes.map(s => s.price));
        break;
      case 'rating':
        aValue = Math.random() * 5; // Mock rating
        bValue = Math.random() * 5;
        break;
      case 'popularity':
      default:
        aValue = Math.random() * 100; // Mock popularity
        bValue = Math.random() * 100;
        break;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return results;
  }, [allProducts, filters]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    
    // Update URL params
    const params = new URLSearchParams();
    if (updated.query) {params.set('q', updated.query);}
    if (updated.category !== 'all') {params.set('category', updated.category);}
    if (updated.priceRange[0] > 0) {params.set('minPrice', updated.priceRange[0].toString());}
    if (updated.priceRange[1] < 200000) {params.set('maxPrice', updated.priceRange[1].toString());}
    if (updated.rating > 0) {params.set('rating', updated.rating.toString());}
    params.set('sortBy', updated.sortBy);
    params.set('sortOrder', updated.sortOrder);
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      priceRange: [0, 200000],
      rating: 0,
      sortBy: 'popularity',
      sortOrder: 'desc',
      inStock: true,
      hasDiscount: false
    });
    setSearchParams({});
  };

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: ProductCategory.Coffee, label: 'Cà phê' },
    { value: ProductCategory.Tea, label: 'Trà' },
    { value: ProductCategory.Freeze, label: 'Đá xay' },
    { value: ProductCategory.Cake, label: 'Bánh ngọt' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <ButtonOutline onClick={() => setShowFilters(!showFilters)}>
          <FunnelIcon className="w-5 h-5 mr-2" />
          Bộ lọc
        </ButtonOutline>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => updateFilters({ category: cat.value as any })}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.category === cat.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng giá: {filters.priceRange[0].toLocaleString()}đ - {filters.priceRange[1].toLocaleString()}đ
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={filters.priceRange[0]}
                onChange={(e) => updateFilters({ 
                  priceRange: [parseInt(e.target.value), filters.priceRange[1]] 
                })}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={filters.priceRange[1]}
                onChange={(e) => updateFilters({ 
                  priceRange: [filters.priceRange[0], parseInt(e.target.value)] 
                })}
                className="flex-1"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá tối thiểu
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => updateFilters({ rating })}
                  className={`p-1 ${
                    filters.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <StarIcon className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Sắp xếp theo:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="border border-gray-300 rounded px-3 py-1"
            >
              <option value="popularity">Độ phổ biến</option>
              <option value="name">Tên sản phẩm</option>
              <option value="price">Giá</option>
              <option value="rating">Đánh giá</option>
            </select>
            <button
              onClick={() => updateFilters({ 
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
              })}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* Additional Filters */}
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => updateFilters({ inStock: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">Còn hàng</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasDiscount}
                onChange={(e) => updateFilters({ hasDiscount: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">Có khuyến mãi</span>
            </label>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <ButtonOutline onClick={clearFilters}>
              <XMarkIcon className="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </ButtonOutline>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-600">
        Tìm thấy {filteredProducts.length} sản phẩm
      </div>
    </div>
  );
}
