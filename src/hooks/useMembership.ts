import { useState, useEffect, useCallback } from 'react';
import { Membership, UserProfile } from '@/types';
import { memberships, getUserMembership } from '@/data/memberships';
import { useAuth } from './useAuth';

/**
 * Hook quản lý hệ thống thành viên
 * Theo dõi cấp độ thành viên, điểm tích lũy và quyền lợi
 */
export const useMembership = () => {
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

    // Load user profile từ localStorage
    useEffect(() => {
        if (user) {
            const loadUserProfile = () => {
                try {
                    const savedProfile = localStorage.getItem(`user_profile_${user.id}`);
                    if (savedProfile) {
                        setUserProfile(JSON.parse(savedProfile));
                    } else {
                        // Tạo profile mới cho user
                        const newProfile: UserProfile = {
                            ...user,
                            points: 0,
                            totalSpent: 0,
                            joinDate: new Date().toISOString(),
                            membership: getUserMembership(0),
                        };
                        setUserProfile(newProfile);
                        localStorage.setItem(`user_profile_${user.id}`, JSON.stringify(newProfile));
                    }
                } catch (error) {
                    console.error('Error loading user profile:', error);
                }
            };

            loadUserProfile();
        }
    }, [user]);

    // Cập nhật điểm tích lũy
    const updatePoints = useCallback((points: number) => {
        if (!userProfile) return;

        const updatedProfile = {
            ...userProfile,
            points: userProfile.points + points,
        };

        setUserProfile(updatedProfile);
        localStorage.setItem(`user_profile_${user.id}`, JSON.stringify(updatedProfile));
    }, [userProfile, user]);

    // Cập nhật tổng chi tiêu
    const updateTotalSpent = useCallback((amount: number) => {
        if (!userProfile) return;

        const newTotalSpent = userProfile.totalSpent + amount;
        const newMembership = getUserMembership(newTotalSpent);

        const updatedProfile = {
            ...userProfile,
            totalSpent: newTotalSpent,
            membership: newMembership,
        };

        setUserProfile(updatedProfile);
        localStorage.setItem(`user_profile_${user.id}`, JSON.stringify(updatedProfile));
    }, [userProfile, user]);

    // Tính điểm tích lũy cho đơn hàng
    const calculatePoints = useCallback((orderAmount: number) => {
        if (!userProfile?.membership) return 0;

        const basePoints = Math.floor(orderAmount / 1000); // 1 điểm cho mỗi 1000đ
        return Math.floor(basePoints * userProfile.membership.pointsMultiplier);
    }, [userProfile]);

    // Tính giảm giá cho đơn hàng
    const calculateDiscount = useCallback((orderAmount: number) => {
        if (!userProfile?.membership) return 0;

        return Math.floor(orderAmount * userProfile.membership.discountPercentage / 100);
    }, [userProfile]);

    // Kiểm tra quyền lợi miễn phí giao hàng
    const hasFreeShipping = useCallback((orderAmount: number) => {
        if (!userProfile?.membership) return false;

        if (userProfile.membership.level === 'Diamond') {
            return true; // Diamond: miễn phí giao hàng cho mọi đơn
        } else if (userProfile.membership.level === 'Gold') {
            return orderAmount >= 50000; // Gold: miễn phí giao hàng từ 50k
        }

        return false; // Silver: không có miễn phí giao hàng
    }, [userProfile]);

    // Lấy thông tin thành viên hiện tại
    const getCurrentMembership = useCallback(() => {
        return userProfile?.membership || memberships[0];
    }, [userProfile]);

    // Lấy thông tin thành viên tiếp theo
    const getNextMembership = useCallback(() => {
        if (!userProfile?.membership) return memberships[1];

        const currentIndex = memberships.findIndex(m => m.id === userProfile.membership?.id);
        return memberships[currentIndex + 1] || null;
    }, [userProfile]);

    // Tính tiến độ lên cấp tiếp theo
    const getProgressToNextLevel = useCallback(() => {
        const nextMembership = getNextMembership();
        if (!nextMembership || !userProfile) {
            return { progress: 100, remaining: 0 };
        }

        const currentSpent = userProfile.totalSpent;
        const requiredSpent = nextMembership.minSpent;
        const progress = Math.min((currentSpent / requiredSpent) * 100, 100);
        const remaining = Math.max(requiredSpent - currentSpent, 0);

        return { progress, remaining };
    }, [userProfile, getNextMembership]);

    return {
        userProfile,
        loading,
        memberships,
        updatePoints,
        updateTotalSpent,
        calculatePoints,
        calculateDiscount,
        hasFreeShipping,
        getCurrentMembership,
        getNextMembership,
        getProgressToNextLevel,
    };
};
