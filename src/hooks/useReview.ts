import { useState, useEffect, useCallback } from 'react';
import { ProductReview, ProductRating } from '@/types';
import { mockReviews, mockProductRatings } from '@/data/reviews';

/**
 * Hook quản lý hệ thống đánh giá sản phẩm
 * Lưu trữ và đọc dữ liệu review từ localStorage
 */
export const useReview = () => {
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [ratings, setRatings] = useState<ProductRating[]>([]);
    const [loading, setLoading] = useState(false);

    // Load dữ liệu từ localStorage hoặc mock data
    useEffect(() => {
        const loadReviews = () => {
            try {
                const savedReviews = localStorage.getItem('product_reviews');
                const savedRatings = localStorage.getItem('product_ratings');

                if (savedReviews && savedRatings) {
                    setReviews(JSON.parse(savedReviews));
                    setRatings(JSON.parse(savedRatings));
                } else {
                    // Lần đầu tiên, sử dụng mock data
                    setReviews(mockReviews);
                    setRatings(mockProductRatings);
                    localStorage.setItem('product_reviews', JSON.stringify(mockReviews));
                    localStorage.setItem('product_ratings', JSON.stringify(mockProductRatings));
                }
            } catch (error) {
                console.error('Error loading reviews:', error);
                setReviews(mockReviews);
                setRatings(mockProductRatings);
            }
        };

        loadReviews();
    }, []);

    // Lưu reviews vào localStorage
    const saveReviews = useCallback((newReviews: ProductReview[]) => {
        try {
            localStorage.setItem('product_reviews', JSON.stringify(newReviews));
            setReviews(newReviews);
        } catch (error) {
            console.error('Error saving reviews:', error);
        }
    }, []);

    // Lưu ratings vào localStorage
    const saveRatings = useCallback((newRatings: ProductRating[]) => {
        try {
            localStorage.setItem('product_ratings', JSON.stringify(newRatings));
            setRatings(newRatings);
        } catch (error) {
            console.error('Error saving ratings:', error);
        }
    }, []);

    // Thêm review mới
    const addReview = useCallback((review: Omit<ProductReview, 'id' | 'createdAt'>) => {
        const newReview: ProductReview = {
            ...review,
            id: `review_${Date.now()}`,
            createdAt: new Date().toISOString(),
        };

        const updatedReviews = [...reviews, newReview];
        saveReviews(updatedReviews);

        // Cập nhật rating cho sản phẩm
        updateProductRating(review.productId);
    }, [reviews, saveReviews]);

    // Cập nhật rating cho sản phẩm
    const updateProductRating = useCallback((productId: string) => {
        const productReviews = reviews.filter(r => r.productId === productId);

        if (productReviews.length === 0) return;

        const totalReviews = productReviews.length;
        const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

        const ratingDistribution = {
            5: productReviews.filter(r => r.rating === 5).length,
            4: productReviews.filter(r => r.rating === 4).length,
            3: productReviews.filter(r => r.rating === 3).length,
            2: productReviews.filter(r => r.rating === 2).length,
            1: productReviews.filter(r => r.rating === 1).length,
        };

        const newRating: ProductRating = {
            productId,
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews,
            ratingDistribution,
        };

        const updatedRatings = ratings.filter(r => r.productId !== productId);
        updatedRatings.push(newRating);
        saveRatings(updatedRatings);
    }, [reviews, ratings, saveRatings]);

    // Lấy reviews của một sản phẩm
    const getProductReviews = useCallback((productId: string) => {
        return reviews.filter(r => r.productId === productId).sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [reviews]);

    // Lấy rating của một sản phẩm
    const getProductRating = useCallback((productId: string) => {
        return ratings.find(r => r.productId === productId) || {
            productId,
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        };
    }, [ratings]);

    // Xóa review
    const deleteReview = useCallback((reviewId: string) => {
        const review = reviews.find(r => r.id === reviewId);
        if (!review) return;

        const updatedReviews = reviews.filter(r => r.id !== reviewId);
        saveReviews(updatedReviews);

        // Cập nhật lại rating cho sản phẩm
        updateProductRating(review.productId);
    }, [reviews, saveReviews, updateProductRating]);

    // Kiểm tra xem user đã review sản phẩm chưa
    const hasUserReviewed = useCallback((productId: string, userId: string) => {
        return reviews.some(r => r.productId === productId && r.userId === userId);
    }, [reviews]);

    return {
        reviews,
        ratings,
        loading,
        addReview,
        getProductReviews,
        getProductRating,
        deleteReview,
        hasUserReviewed,
    };
};
