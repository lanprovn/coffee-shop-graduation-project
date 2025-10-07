/**
 * Product Recommendations System - Frontend only
 * AI-powered recommendations dựa trên behavior và preferences
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CoffeeProduct, ProductCategory } from '@/types';
import { useProduct } from '@/hooks/useProduct';
import { useRecentViewed } from './useRecentViewed';
import { useWishlist } from './useWishlist';
import { StarIcon, SparklesIcon, TrendingUpIcon } from '@heroicons/react/24/outline';

const RECOMMENDATION_KEY = 'coffee-shop-recommendations';

export interface Recommendation {
  product: CoffeeProduct;
  reason: string;
  score: number;
  type: 'trending' | 'similar' | 'personalized' | 'category' | 'price';
}

export function useProductRecommendations() {
  const { getAllProducts } = useProduct();
  const { recentItems } = useRecentViewed();
  const { wishlist } = useWishlist();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const allProducts = getAllProducts();

  // Generate recommendations based on user behavior
  const generateRecommendations = useCallback(() => {
    const recs: Recommendation[] = [];

    // 1. Trending products (most popular)
    const trendingProducts = allProducts
      .map(product => ({
        product,
        score: Math.random() * 100 // Mock popularity score
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => ({
        product: item.product,
        reason: 'Sản phẩm đang hot',
        score: item.score,
        type: 'trending' as const
      }));

    recs.push(...trendingProducts);

    // 2. Similar to recently viewed
    if (recentItems.length > 0) {
      const recentCategories = recentItems.map(item => item.product.category);
      const categoryCounts = recentCategories.reduce((acc, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const favoriteCategory = Object.keys(categoryCounts).reduce((a, b) => 
        categoryCounts[a] > categoryCounts[b] ? a : b
      );

      const similarProducts = allProducts
        .filter(product => 
          product.category === favoriteCategory && 
          !recentItems.some(item => item.product.id === product.id)
        )
        .slice(0, 3)
        .map(product => ({
          product,
          reason: `Tương tự ${favoriteCategory} bạn đã xem`,
          score: 85,
          type: 'similar' as const
        }));

      recs.push(...similarProducts);
    }

    // 3. Personalized based on wishlist
    if (wishlist.length > 0) {
      const wishlistCategories = wishlist.map(item => item.product.category);
      const categoryCounts = wishlistCategories.reduce((acc, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const favoriteCategory = Object.keys(categoryCounts).reduce((a, b) => 
        categoryCounts[a] > categoryCounts[b] ? a : b
      );

      const personalizedProducts = allProducts
        .filter(product => 
          product.category === favoriteCategory && 
          !wishlist.some(item => item.product.id === product.id)
        )
        .slice(0, 3)
        .map(product => ({
          product,
          reason: `Dựa trên sở thích của bạn`,
          score: 90,
          type: 'personalized' as const
        }));

      recs.push(...personalizedProducts);
    }

    // 4. Price-based recommendations
    if (recentItems.length > 0) {
      const avgPrice = recentItems.reduce((sum, item) => 
        sum + item.product.basePrice, 0
      ) / recentItems.length;

      const priceRangeProducts = allProducts
        .filter(product => {
          const priceDiff = Math.abs(product.basePrice - avgPrice);
          return priceDiff <= avgPrice * 0.3 && // Within 30% of average
                 !recentItems.some(item => item.product.id === product.id);
        })
        .slice(0, 2)
        .map(product => ({
          product,
          reason: `Tương đương giá ${avgPrice.toLocaleString()}đ`,
          score: 75,
          type: 'price' as const
        }));

      recs.push(...priceRangeProducts);
    }

    // 5. Category-based recommendations
    const categoryRecs = Object.values(ProductCategory).map(category => {
      const categoryProducts = allProducts.filter(p => p.category === category);
      if (categoryProducts.length > 0) {
        const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
        return {
          product: randomProduct,
          reason: `Khám phá ${category}`,
          score: 70,
          type: 'category' as const
        };
      }
      return null;
    }).filter(Boolean).slice(0, 2);

    recs.push(...categoryRecs as Recommendation[]);

    // Remove duplicates and sort by score
    const uniqueRecs = recs.filter((rec, index, self) => 
      index === self.findIndex(r => r.product.id === rec.product.id)
    );

    return uniqueRecs.sort((a, b) => b.score - a.score);
  }, [allProducts, recentItems, wishlist]);

  // Update recommendations
  useEffect(() => {
    const newRecs = generateRecommendations();
    setRecommendations(newRecs);
    
    // Save to localStorage
    try {
      localStorage.setItem(RECOMMENDATION_KEY, JSON.stringify(newRecs));
    } catch (error) {
      console.error('Error saving recommendations:', error);
    }
  }, [generateRecommendations]);

  // Load recommendations from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECOMMENDATION_KEY);
      if (saved) {
        setRecommendations(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  }, []);

  const refreshRecommendations = useCallback(() => {
    const newRecs = generateRecommendations();
    setRecommendations(newRecs);
  }, [generateRecommendations]);

  return {
    recommendations,
    refreshRecommendations,
    isLoading: false
  };
}

/**
 * Recommendation Card Component
 */
interface RecommendationCardProps {
  recommendation: Recommendation;
  className?: string;
}

export function RecommendationCard({ recommendation, className = '' }: RecommendationCardProps) {
  const getIcon = () => {
    switch (recommendation.type) {
      case 'trending':
        return <TrendingUpIcon className="w-4 h-4 text-orange-500" />;
      case 'similar':
        return <StarIcon className="w-4 h-4 text-blue-500" />;
      case 'personalized':
        return <SparklesIcon className="w-4 h-4 text-purple-500" />;
      case 'category':
        return <StarIcon className="w-4 h-4 text-green-500" />;
      case 'price':
        return <StarIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return <StarIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBadgeColor = () => {
    switch (recommendation.type) {
      case 'trending':
        return 'bg-orange-100 text-orange-800';
      case 'similar':
        return 'bg-blue-100 text-blue-800';
      case 'personalized':
        return 'bg-purple-100 text-purple-800';
      case 'category':
        return 'bg-green-100 text-green-800';
      case 'price':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <div className="relative">
        <img
          src={recommendation.product.image}
          alt={recommendation.product.displayName}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
            {getIcon()}
            {recommendation.type}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {Math.round(recommendation.score)}%
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {recommendation.product.displayName}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {recommendation.reason}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {recommendation.product.basePrice.toLocaleString()}đ
          </span>
          <button
            onClick={() => window.location.href = `/product/${recommendation.product.id}`}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            Xem ngay
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Recommendations Section Component
 */
interface RecommendationsSectionProps {
  title?: string;
  maxItems?: number;
  showReason?: boolean;
  className?: string;
}

export function RecommendationsSection({ 
  title = "Gợi ý cho bạn",
  maxItems = 6,
  showReason = true,
  className = ''
}: RecommendationsSectionProps) {
  const { recommendations, refreshRecommendations } = useProductRecommendations();
  const displayRecs = recommendations.slice(0, maxItems);

  if (displayRecs.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
        <button
          onClick={refreshRecommendations}
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayRecs.map((recommendation) => (
          <RecommendationCard
            key={recommendation.product.id}
            recommendation={recommendation}
          />
        ))}
      </div>

      {recommendations.length > maxItems && (
        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/recommendations'}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Xem tất cả gợi ý ({recommendations.length})
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Recommendations Page
 */
export function RecommendationsPage() {
  const { recommendations, refreshRecommendations } = useProductRecommendations();

  const groupedRecs = recommendations.reduce((acc, rec) => {
    if (!acc[rec.type]) {
      acc[rec.type] = [];
    }
    acc[rec.type].push(rec);
    return acc;
  }, {} as Record<string, Recommendation[]>);

  const typeLabels = {
    trending: 'Đang hot',
    similar: 'Tương tự',
    personalized: 'Cá nhân hóa',
    category: 'Theo danh mục',
    price: 'Theo giá'
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-4 mt-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Gợi ý sản phẩm
          </h1>
          <p className="text-gray-600">
            {recommendations.length} sản phẩm được gợi ý dựa trên sở thích của bạn
          </p>
        </div>
        <button
          onClick={refreshRecommendations}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Làm mới gợi ý
        </button>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedRecs).map(([type, recs]) => (
          <div key={type}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {typeLabels[type as keyof typeof typeLabels]} ({recs.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recs.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.product.id}
                  recommendation={recommendation}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
