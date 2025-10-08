import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CoffeeProduct } from '@/types';
import { StarIcon, HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAppStore, useIsInWishlist, useIsInCart } from '@/store';
import { LoadingSpinner } from './LoadingStates';

interface ProductCardProps {
    product: CoffeeProduct;
    onViewDetails?: (product: CoffeeProduct) => void;
    className?: string;
    showQuickActions?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onViewDetails,
    className = '',
    showQuickActions = true
}) => {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const { addToCart, addToWishlist, removeFromWishlist, addToRecentViewed } = useAppStore();
    const isInWishlist = useIsInWishlist(product.id);
    const isInCart = useIsInCart(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product, 1, 'M');
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isInWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const handleViewDetails = () => {
        addToRecentViewed(product);
        onViewDetails?.(product);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <StarIcon
                key={index}
                className={`w-4 h-4 ${index < Math.floor(rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
            />
        ));
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className={`card-highland overflow-hidden group ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleViewDetails}
        >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden">
                {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <LoadingSpinner size="md" color="gray" />
                    </div>
                )}
                <motion.img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'
                        }`}
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full"
                        >
                            Mới
                        </motion.span>
                    )}
                    {product.isBestSeller && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full"
                        >
                            Bán chạy
                        </motion.span>
                    )}
                </div>

                {/* Quick Actions */}
                {showQuickActions && (
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-3 right-3 flex flex-col gap-2"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleToggleWishlist}
                                    className={`p-2 rounded-full shadow-lg transition-colors ${isInWishlist
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white text-gray-600 hover:text-red-500'
                                        }`}
                                >
                                    {isInWishlist ? (
                                        <HeartSolidIcon className="w-4 h-4" />
                                    ) : (
                                        <HeartIcon className="w-4 h-4" />
                                    )}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleAddToCart}
                                    className={`p-2 rounded-full shadow-lg transition-colors ${isInCart
                                            ? 'bg-primary text-white'
                                            : 'bg-white text-gray-600 hover:text-primary'
                                        }`}
                                >
                                    <ShoppingCartIcon className="w-4 h-4" />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* Preparation Time */}
                <div className="absolute bottom-3 left-3">
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {product.preparationTime} phút
                    </span>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Category */}
                <div className="text-xs text-primary font-medium mb-1 uppercase tracking-wide">
                    {product.category}
                </div>

                {/* Product Name */}
                <h3 className="font-semibold text-neutral-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                    {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                        {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-neutral-600">
                        ({product.reviewCount})
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                            {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-neutral-500 line-through">
                                {formatPrice(product.originalPrice)}
                            </span>
                        )}
                    </div>

                    {/* Nutrition Info */}
                    <div className="text-xs text-neutral-500">
                        {product.nutrition.calories} cal
                    </div>
                </div>

                {/* Tags */}
                {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {product.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Add to Cart Button */}
            <motion.div
                className="px-4 pb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${isInCart
                            ? 'bg-primary text-white'
                            : 'btn-primary'
                        }`}
                >
                    {isInCart ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

// Clock Icon component (since it's not in heroicons)
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Product Grid Component
interface ProductGridProps {
    products: CoffeeProduct[];
    onProductClick?: (product: CoffeeProduct) => void;
    loading?: boolean;
    emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    onProductClick,
    loading = false,
    emptyMessage = 'Không có sản phẩm nào'
}) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="card-highland animate-pulse">
                        <div className="aspect-square bg-gray-200 rounded-t-xl" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-full" />
                            <div className="h-3 bg-gray-200 rounded w-2/3" />
                            <div className="h-6 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">☕</div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">
                    {emptyMessage}
                </h3>
                <p className="text-neutral-600">
                    Hãy thử tìm kiếm với từ khóa khác
                </p>
            </div>
        );
    }

    return (
        <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            <AnimatePresence>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetails={onProductClick}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};
