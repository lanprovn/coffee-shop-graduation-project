import { Membership } from '@/types';

/**
 * Mock data cho hệ thống thành viên
 * Định nghĩa các cấp độ thành viên với quyền lợi tương ứng
 */
export const memberships: Membership[] = [
    {
        id: 'silver',
        name: 'Silver Member',
        level: 'Silver',
        benefits: [
            'Giảm giá 5% cho tất cả sản phẩm',
            'Tích điểm 1.2x cho mỗi đơn hàng',
            'Ưu tiên phục vụ',
            'Nhận thông báo khuyến mãi sớm nhất',
        ],
        discountPercentage: 5,
        pointsMultiplier: 1.2,
        minSpent: 0,
        color: '#C0C0C0',
        icon: '🥈',
    },
    {
        id: 'gold',
        name: 'Gold Member',
        level: 'Gold',
        benefits: [
            'Giảm giá 10% cho tất cả sản phẩm',
            'Tích điểm 1.5x cho mỗi đơn hàng',
            'Miễn phí giao hàng cho đơn từ 50.000đ',
            'Quà tặng sinh nhật đặc biệt',
            'Ưu tiên phục vụ và hỗ trợ khách hàng',
        ],
        discountPercentage: 10,
        pointsMultiplier: 1.5,
        minSpent: 500000,
        color: '#FFD700',
        icon: '🥇',
    },
    {
        id: 'diamond',
        name: 'Diamond Member',
        level: 'Diamond',
        benefits: [
            'Giảm giá 15% cho tất cả sản phẩm',
            'Tích điểm 2x cho mỗi đơn hàng',
            'Miễn phí giao hàng cho mọi đơn hàng',
            'Quà tặng sinh nhật cao cấp',
            'Ưu tiên phục vụ VIP',
            'Tham gia sự kiện đặc biệt',
            'Tư vấn cà phê cá nhân hóa',
        ],
        discountPercentage: 15,
        pointsMultiplier: 2.0,
        minSpent: 2000000,
        color: '#B9F2FF',
        icon: '💎',
    },
];

export const getUserMembership = (totalSpent: number): Membership => {
    if (totalSpent >= 2000000) {
        return memberships[2]; // Diamond
    } else if (totalSpent >= 500000) {
        return memberships[1]; // Gold
    } else {
        return memberships[0]; // Silver
    }
};
