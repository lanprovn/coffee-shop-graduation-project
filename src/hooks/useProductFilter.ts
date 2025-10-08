import { useState, useMemo, useCallback } from 'react';
import { CoffeeProduct, ProductCategory } from '@/types';
import { SortOption } from '@/components/shared/ProductSort';

interface FilterState {
    category: string;
    temperature: string; // Changed from 'type' to 'temperature'
    priceRange: { min: number; max: number };
    searchQuery: string;
}

interface UseProductFilterProps {
    products: CoffeeProduct[];
}

/**
 * Hook quản lý logic filter và sort sản phẩm
 * Cung cấp các function để filter, sort và tìm kiếm sản phẩm
 */
export const useProductFilter = ({ products }: UseProductFilterProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    category: 'all',
    temperature: 'all', // Changed from 'type' to 'temperature'
    priceRange: { min: 0, max: 1000000 },
    searchQuery: '',
  });

  const [sortOption, setSortOption] = useState<SortOption>('default');

  // Filter products based on current filter state
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (filterState.category !== 'all') {
      filtered = filtered.filter(product => product.category === filterState.category);
    }

    // Temperature filter (hot/cold based on product name)
    if (filterState.temperature !== 'all') {
      if (filterState.temperature === 'hot') {
        filtered = filtered.filter(product =>
          product.displayName.toLowerCase().includes('nóng') ||
                    product.displayName.toLowerCase().includes('hot')
        );
      } else if (filterState.temperature === 'cold') {
        filtered = filtered.filter(product =>
          product.displayName.toLowerCase().includes('đá') ||
                    product.displayName.toLowerCase().includes('iced')
        );
      }
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const minPrice = Math.min(...product.sizes.map(s => s.price));
      const maxPrice = Math.max(...product.sizes.map(s => s.price));
      return minPrice >= filterState.priceRange.min && maxPrice <= filterState.priceRange.max;
    });

    // Search query filter
    if (filterState.searchQuery.trim()) {
      const query = filterState.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.displayName.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, filterState]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortOption) {
    case 'price_asc':
      return sorted.sort((a, b) => {
        const aMinPrice = Math.min(...a.sizes.map(s => s.price));
        const bMinPrice = Math.min(...b.sizes.map(s => s.price));
        return aMinPrice - bMinPrice;
      });

    case 'price_desc':
      return sorted.sort((a, b) => {
        const aMaxPrice = Math.max(...a.sizes.map(s => s.price));
        const bMaxPrice = Math.max(...b.sizes.map(s => s.price));
        return bMaxPrice - aMaxPrice;
      });

    case 'name_asc':
      return sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));

    case 'name_desc':
      return sorted.sort((a, b) => b.displayName.localeCompare(a.displayName));

    case 'rating_desc':
      // Mock rating sort - trong thực tế sẽ lấy từ review system
      return sorted.sort((a, b) => {
        const aRating = Math.random() * 5; // Mock rating
        const bRating = Math.random() * 5; // Mock rating
        return bRating - aRating;
      });

    default:
      return sorted;
    }
  }, [filteredProducts, sortOption]);

  // Filter actions
  const updateCategory = useCallback((category: string) => {
    setFilterState(prev => ({ ...prev, category }));
  }, []);

  const updateTemperature = useCallback((temperature: string) => { // Changed from updateType
    setFilterState(prev => ({ ...prev, temperature }));
  }, []);

  const updatePriceRange = useCallback((priceRange: { min: number; max: number }) => {
    setFilterState(prev => ({ ...prev, priceRange }));
  }, []);

  const updateSearchQuery = useCallback((searchQuery: string) => {
    setFilterState(prev => ({ ...prev, searchQuery }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState({
      category: 'all',
      temperature: 'all', // Changed from 'type' to 'temperature'
      priceRange: { min: 0, max: 1000000 },
      searchQuery: '',
    });
    setSortOption('default');
  }, []);

  // Get filter statistics
  const filterStats = useMemo(() => {
    const totalProducts = products.length;
    const filteredCount = filteredProducts.length;
    const hasActiveFilters =
            filterState.category !== 'all' ||
            filterState.temperature !== 'all' || // Changed from 'type' to 'temperature'
            filterState.priceRange.min > 0 ||
            filterState.priceRange.max < 1000000 ||
            filterState.searchQuery.trim() !== '';

    return {
      totalProducts,
      filteredCount,
      hasActiveFilters,
      isFiltered: filteredCount < totalProducts,
    };
  }, [products.length, filteredProducts.length, filterState]);

  return {
    // State
    filterState,
    sortOption,
    filteredProducts: sortedProducts,

    // Actions
    updateCategory,
    updateTemperature, // Changed from updateType
    updatePriceRange,
    updateSearchQuery,
    setSortOption,
    resetFilters,

    // Stats
    filterStats,
  };
};
