import { useState, useEffect } from 'react';
import { useProduct } from '@/hooks/useProduct';
import { useProductFilter } from '@/hooks/useProductFilter';
import ProductFilter from '@/components/shared/ProductFilter';
import ProductSort from '@/components/shared/ProductSort';
import ProductCardSmall from '@/components/shared/card/ProductCardSmall';
import Title1 from '@/components/shared/typo/Title1';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

/**
 * ProductListPage: Trang danh sách sản phẩm với filter và sort nâng cao
 * Hiển thị tất cả sản phẩm với khả năng filter theo category, type, price
 */
export default function ProductListPage() {
  const { coffees, loading } = useProduct();
  const {
    filterState,
    sortOption,
    filteredProducts,
    updateCategory,
    updateTemperature,
    updatePriceRange,
    updateSearchQuery,
    setSortOption,
    resetFilters,
    filterStats,
  } = useProductFilter({ products: coffees });

  // Load search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search') || '';
    const category = urlParams.get('category') || 'all';

    if (searchQuery) {
      updateSearchQuery(searchQuery);
    }
    if (category !== 'all') {
      updateCategory(category);
    }
  }, [updateSearchQuery, updateCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="text-center">
            <Title1 className="text-gray-800 mb-2">Danh sách sản phẩm</Title1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá bộ sưu tập cà phê và thức uống đa dạng của chúng tôi
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
        <div className="space-y-8">
          {/* Search Box */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={filterState.searchQuery}
                onChange={(e) => updateSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Filter Component */}
          <ProductFilter
            category={filterState.category}
            temperature={filterState.temperature}
            priceRange={filterState.priceRange}
            onCategoryChange={updateCategory}
            onTemperatureChange={updateTemperature}
            onPriceRangeChange={updatePriceRange}
            onReset={resetFilters}
          />

          {/* Sort Component */}
          <ProductSort
            sortOption={sortOption}
            onSortChange={setSortOption}
            totalProducts={filterStats.filteredCount}
          />

          {/* Products Grid */}
          {filterStats.filteredCount > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCardSmall key={product.id} coffee={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
              </p>
              <button
                onClick={resetFilters}
                className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Filter Stats */}
          {filterStats.hasActiveFilters && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-800">
                  Đang hiển thị {filterStats.filteredCount} trong tổng số {filterStats.totalProducts} sản phẩm
                </div>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Xem tất cả
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
