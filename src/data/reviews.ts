import { ProductReview, ProductRating } from '@/types';

/**
 * Mock data cho hệ thống đánh giá sản phẩm
 * Lưu trữ reviews và ratings tạm thời trong localStorage
 */

export const mockReviews: ProductReview[] = [
    {
        id: 'review_1',
        productId: 'hot-americano',
        userId: 'user_1',
        userName: 'Nguyễn Văn A',
        userAvatar: '/images/male-avatar.png',
        rating: 5,
        comment: 'Cà phê rất ngon, đậm đà và thơm. Nhân viên phục vụ nhiệt tình!',
        createdAt: '2024-01-15T10:30:00Z',
        isVerified: true,
    },
    {
        id: 'review_2',
        productId: 'hot-americano',
        userId: 'user_2',
        userName: 'Trần Thị B',
        userAvatar: '/images/male-avatar.png',
        rating: 4,
        comment: 'Vị cà phê ổn, giá cả hợp lý. Sẽ quay lại lần sau.',
        createdAt: '2024-01-14T15:45:00Z',
        isVerified: true,
    },
    {
        id: 'review_3',
        productId: 'hot-latte',
        userId: 'user_3',
        userName: 'Lê Văn C',
        userAvatar: '/images/male-avatar.png',
        rating: 5,
        comment: 'Latte mịn màng, vị ngọt nhẹ rất dễ uống. Highly recommend!',
        createdAt: '2024-01-13T09:20:00Z',
        isVerified: true,
    },
    {
        id: 'review_4',
        productId: 'iced-mocha',
        userId: 'user_4',
        userName: 'Phạm Thị D',
        userAvatar: '/images/male-avatar.png',
        rating: 3,
        comment: 'Mocha đá ngon nhưng hơi ngọt. Có thể giảm đường một chút.',
        createdAt: '2024-01-12T14:10:00Z',
        isVerified: true,
    },
    {
        id: 'review_5',
        productId: 'hot-cappuccino',
        userId: 'user_5',
        userName: 'Hoàng Văn E',
        userAvatar: '/images/male-avatar.png',
        rating: 4,
        comment: 'Cappuccino có lớp bọt đẹp, vị cân bằng. Phục vụ nhanh.',
        createdAt: '2024-01-11T11:30:00Z',
        isVerified: true,
    },
    {
        id: 'review_6',
        productId: 'iced-latte',
        userId: 'user_6',
        userName: 'Vũ Thị F',
        userAvatar: '/images/male-avatar.png',
        rating: 5,
        comment: 'Latte đá hoàn hảo cho ngày hè! Sẽ order thường xuyên.',
        createdAt: '2024-01-10T16:45:00Z',
        isVerified: true,
    },
];

export const mockProductRatings: ProductRating[] = [
    {
        productId: 'hot-americano',
        averageRating: 4.5,
        totalReviews: 2,
        ratingDistribution: {
            5: 1,
            4: 1,
            3: 0,
            2: 0,
            1: 0,
        },
    },
    {
        productId: 'hot-latte',
        averageRating: 5.0,
        totalReviews: 1,
        ratingDistribution: {
            5: 1,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
        },
    },
    {
        productId: 'iced-mocha',
        averageRating: 3.0,
        totalReviews: 1,
        ratingDistribution: {
            5: 0,
            4: 0,
            3: 1,
            2: 0,
            1: 0,
        },
    },
    {
        productId: 'hot-cappuccino',
        averageRating: 4.0,
        totalReviews: 1,
        ratingDistribution: {
            5: 0,
            4: 1,
            3: 0,
            2: 0,
            1: 0,
        },
    },
    {
        productId: 'iced-latte',
        averageRating: 5.0,
        totalReviews: 1,
        ratingDistribution: {
            5: 1,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
        },
    },
];
