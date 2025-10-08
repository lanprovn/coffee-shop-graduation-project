import { CoffeeProduct, ProductCategory, ProductReview, UserProfile, Membership, DeliveryOrder, Notification, Store } from '@/types';

// Enhanced Product Data with Highland Coffee style
export const coffeeProducts: CoffeeProduct[] = [
    // Coffee Category
    {
        id: 'highland-coffee-1',
        name: 'Highland Coffee Đặc Biệt',
        description: 'Cà phê đặc biệt với hương vị đậm đà, được pha chế từ hạt cà phê Arabica cao cấp',
        price: 45000,
        originalPrice: 50000,
        image: '/images/coffee/highland-special.webp',
        category: ProductCategory.Coffee,
        rating: 4.8,
        reviewCount: 1250,
        isNew: false,
        isBestSeller: true,
        isAvailable: true,
        sizes: [
            { name: 'S', price: 35000, volume: '8oz' },
            { name: 'M', price: 45000, volume: '12oz' },
            { name: 'L', price: 55000, volume: '16oz' }
        ],
        customizations: [
            { name: 'Đường', options: ['Không đường', 'Ít đường', 'Vừa', 'Nhiều đường'] },
            { name: 'Sữa', options: ['Không sữa', 'Sữa tươi', 'Sữa đặc', 'Sữa hạt'] },
            { name: 'Đá', options: ['Nóng', 'Đá ít', 'Đá vừa', 'Đá nhiều'] }
        ],
        nutrition: {
            calories: 120,
            protein: 3,
            carbs: 15,
            fat: 5
        },
        allergens: ['Sữa'],
        preparationTime: 3,
        tags: ['Đặc biệt', 'Arabica', 'Hương vị đậm đà']
    },
    {
        id: 'highland-coffee-2',
        name: 'Highland Cappuccino',
        description: 'Cappuccino truyền thống với lớp foam mịn màng và hương vị cà phê cân bằng',
        price: 55000,
        originalPrice: 60000,
        image: '/images/coffee/highland-cappuccino.webp',
        category: ProductCategory.Coffee,
        rating: 4.7,
        reviewCount: 980,
        isNew: false,
        isBestSeller: true,
        isAvailable: true,
        sizes: [
            { name: 'S', price: 45000, volume: '8oz' },
            { name: 'M', price: 55000, volume: '12oz' },
            { name: 'L', price: 65000, volume: '16oz' }
        ],
        customizations: [
            { name: 'Đường', options: ['Không đường', 'Ít đường', 'Vừa', 'Nhiều đường'] },
            { name: 'Sữa', options: ['Sữa tươi', 'Sữa đặc', 'Sữa hạt', 'Sữa không béo'] },
            { name: 'Foam', options: ['Foam ít', 'Foam vừa', 'Foam nhiều'] }
        ],
        nutrition: {
            calories: 150,
            protein: 8,
            carbs: 12,
            fat: 8
        },
        allergens: ['Sữa'],
        preparationTime: 4,
        tags: ['Truyền thống', 'Foam', 'Cân bằng']
    },
    {
        id: 'highland-coffee-3',
        name: 'Highland Latte',
        description: 'Latte mềm mại với tỷ lệ sữa và cà phê hoàn hảo, tạo nên hương vị ngọt ngào',
        price: 50000,
        originalPrice: 55000,
        image: '/images/coffee/highland-latte.webp',
        category: ProductCategory.Coffee,
        rating: 4.6,
        reviewCount: 1100,
        isNew: false,
        isBestSeller: false,
        isAvailable: true,
        sizes: [
            { name: 'S', price: 40000, volume: '8oz' },
            { name: 'M', price: 50000, volume: '12oz' },
            { name: 'L', price: 60000, volume: '16oz' }
        ],
        customizations: [
            { name: 'Đường', options: ['Không đường', 'Ít đường', 'Vừa', 'Nhiều đường'] },
            { name: 'Sữa', options: ['Sữa tươi', 'Sữa đặc', 'Sữa hạt', 'Sữa không béo'] },
            { name: 'Nhiệt độ', options: ['Nóng', 'Ấm', 'Mát'] }
        ],
        nutrition: {
            calories: 180,
            protein: 10,
            carbs: 15,
            fat: 10
        },
        allergens: ['Sữa'],
        preparationTime: 3,
        tags: ['Mềm mại', 'Ngọt ngào', 'Cân bằng']
    },
    {
        id: 'highland-coffee-4',
        name: 'Highland Espresso',
        description: 'Espresso đậm đặc với hương vị cà phê nguyên chất, dành cho những ai yêu thích cà phê mạnh',
        price: 35000,
        originalPrice: 40000,
        image: '/images/coffee/highland-espresso.webp',
        category: ProductCategory.Coffee,
        rating: 4.5,
        reviewCount: 750,
        isNew: false,
        isBestSeller: false,
        isAvailable: true,
        sizes: [
            { name: 'S', price: 35000, volume: '2oz' },
            { name: 'D', price: 45000, volume: '4oz' }
        ],
        customizations: [
            { name: 'Đường', options: ['Không đường', 'Ít đường', 'Vừa'] },
            { name: 'Sữa', options: ['Không sữa', 'Sữa tươi', 'Sữa đặc'] }
        ],
        nutrition: {
            calories: 5,
            protein: 0,
            carbs: 1,
            fat: 0
        },
        allergens: [],
        preparationTime: 2,
        tags: ['Đậm đặc', 'Nguyên chất', 'Mạnh']
    },

    // Tea Category
    {
        id: 'highland-tea-1',
        name: 'Trà Sữa Highland',
        description: 'Trà sữa truyền thống với hương vị trà đen đậm đà và sữa tươi thơm ngon',
        price: 40000,
        originalPrice: 45000,
        image: '/images/coffee/highland-milk-tea.webp',
        category: ProductCategory.Tea,
        rating: 4.7,
        reviewCount: 890,
        isNew: false,
        isBestSeller: true,
        isAvailable: true,
        sizes: [
            { name: 'S', price: 30000, volume: '8oz' },
            { name: 'M', price: 40000, volume: '12oz' },
            { name: 'L', price: 50000, volume: '16oz' }
        ],
        customizations: [
            { name: 'Đường', options: ['Không đường', 'Ít đường', 'Vừa', 'Nhiều đường'] },
            { name: 'Sữa', options: ['Sữa tươi', 'Sữa đặc', 'Sữa hạt'] },
            { name: 'Đá', options: ['Nóng', 'Đá ít', 'Đá vừa', 'Đá nhiều'] },
            { name: 'Topping', options: ['Không topping', 'Trân châu', 'Thạch', 'Pudding'] }
        ],
        nutrition: {
            calories: 200,
            protein: 5,
            carbs: 35,
            fat: 6
        },
        allergens: ['Sữa'],
        preparationTime: 3,
        tags: ['Truyền thống', 'Trà đen', 'Sữa tươi']
    },
    {
        id: 'highland-tea-2',
        name: 'Trà Đào Cam Sả',
        description: 'Trà đào tươi mát với hương cam sả thơm nồng, giải nhiệt hoàn hảo',
        price: 45000,
        originalPrice: 50000,
        image: '/images/coffee/highland-peach-tea.webp',
        category: ProductCategory.Tea,
        rating: 4.6,
        reviewCount: 650,
        isNew: true,
        isBestSeller: false,
        isAvailable: true,
        sizes: [
            { name: 'S', price: 35000, volume: '8oz' },
            { name: 'M', price: 45000, volume: '12oz' },
            { name: 'L', price: 55000, volume: '16oz' }
        ],
        customizations: [
            { name: 'Đường', options: ['Không đường', 'Ít đường', 'Vừa', 'Nhiều đường'] },
            { name: 'Đá', options: ['Đá ít', 'Đá vừa', 'Đá nhiều'] },
            { name: 'Topping', options: ['Không topping', 'Thạch đào', 'Trân châu', 'Pudding'] }
        ],
        nutrition: {
            calories: 80,
            protein: 1,
            carbs: 20,
            fat: 0
        },
        allergens: [],
        preparationTime: 2,
        tags: ['Tươi mát', 'Đào', 'Cam sả', 'Giải nhiệt']
    },

    // Freeze Category
    {
        id: 'highland-freeze-1',
        name: 'Highland Freeze Chocolate',
        description: 'Freeze chocolate đậm đà với kem tươi và sô cô la cao cấp',
        price: 55000,
        originalPrice: 60000,
        image: '/images/coffee/highland-chocolate-freeze.webp',
        category: ProductCategory.Freeze,
        rating: 4.8,
        reviewCount: 1200,
        isNew: false,
        isBestSeller: true,
        isAvailable: true,
        sizes: [
            { name: 'S', price: 45000, volume: '8oz' },
            { name: 'M', price: 55000, volume: '12oz' },
            { name: 'L', price: 65000, volume: '16oz' }
        ],
        customizations: [
            { name: 'Đường', options: ['Không đường', 'Ít đường', 'Vừa', 'Nhiều đường'] },
            { name: 'Kem', options: ['Kem ít', 'Kem vừa', 'Kem nhiều'] },
            { name: 'Topping', options: ['Không topping', 'Kem tươi', 'Sô cô la chip', 'Bánh quy'] }
        ],
        nutrition: {
            calories: 350,
            protein: 8,
            carbs: 45,
            fat: 15
        },
        allergens: ['Sữa', 'Sô cô la'],
        preparationTime: 4,
        tags: ['Chocolate', 'Kem tươi', 'Đậm đà']
    },
    {
        id: 'highland-freeze-2',
        name: 'Highland Freeze Matcha',
        description: 'Freeze matcha tươi mát với hương vị trà xanh Nhật Bản đặc trưng',
        price: 50000,
        originalPrice: 55000,
        image: '/images/coffee/highland-matcha-freeze.webp',
        category: ProductCategory.Freeze,
        rating: 4.7,
        reviewCount: 950,
        isNew: false,
        isBestSeller: false,
        isAvailable: true,
        sizes: [
            { name: 'S', price: 40000, volume: '8oz' },
            { name: 'M', price: 50000, volume: '12oz' },
            { name: 'L', price: 60000, volume: '16oz' }
        ],
        customizations: [
            { name: 'Đường', options: ['Không đường', 'Ít đường', 'Vừa', 'Nhiều đường'] },
            { name: 'Kem', options: ['Kem ít', 'Kem vừa', 'Kem nhiều'] },
            { name: 'Topping', options: ['Không topping', 'Kem tươi', 'Matcha powder', 'Red bean'] }
        ],
        nutrition: {
            calories: 280,
            protein: 6,
            carbs: 40,
            fat: 10
        },
        allergens: ['Sữa'],
        preparationTime: 4,
        tags: ['Matcha', 'Trà xanh', 'Tươi mát']
    },

    // Cake Category
    {
        id: 'highland-cake-1',
        name: 'Bánh Tiramisu Highland',
        description: 'Tiramisu truyền thống với lớp kem mascarpone mịn màng và cà phê espresso',
        price: 65000,
        originalPrice: 70000,
        image: '/images/coffee/highland-tiramisu.webp',
        category: ProductCategory.Cake,
        rating: 4.9,
        reviewCount: 580,
        isNew: false,
        isBestSeller: true,
        isAvailable: true,
        sizes: [
            { name: 'S', price: 45000, volume: '1 slice' },
            { name: 'M', price: 65000, volume: '2 slices' },
            { name: 'L', price: 120000, volume: 'Whole cake' }
        ],
        customizations: [
            { name: 'Đường', options: ['Vừa', 'Ít đường', 'Nhiều đường'] },
            { name: 'Topping', options: ['Không topping', 'Cocoa powder', 'Coffee beans', 'Whipped cream'] }
        ],
        nutrition: {
            calories: 420,
            protein: 12,
            carbs: 35,
            fat: 25
        },
        allergens: ['Sữa', 'Trứng', 'Gluten'],
        preparationTime: 5,
        tags: ['Tiramisu', 'Mascarpone', 'Espresso', 'Truyền thống']
    },
    {
        id: 'highland-cake-2',
        name: 'Bánh Cheesecake Dâu',
        description: 'Cheesecake mềm mại với lớp dâu tươi ngọt ngào và kem cheese béo ngậy',
        price: 55000,
        originalPrice: 60000,
        image: '/images/coffee/highland-strawberry-cheesecake.webp',
        category: ProductCategory.Cake,
        rating: 4.8,
        reviewCount: 720,
        isNew: false,
        isBestSeller: false,
        isAvailable: true,
        sizes: [
            { name: 'S', price: 35000, volume: '1 slice' },
            { name: 'M', price: 55000, volume: '2 slices' },
            { name: 'L', price: 100000, volume: 'Whole cake' }
        ],
        customizations: [
            { name: 'Đường', options: ['Vừa', 'Ít đường', 'Nhiều đường'] },
            { name: 'Topping', options: ['Không topping', 'Dâu tươi', 'Whipped cream', 'Mint leaves'] }
        ],
        nutrition: {
            calories: 380,
            protein: 10,
            carbs: 30,
            fat: 22
        },
        allergens: ['Sữa', 'Trứng', 'Gluten'],
        preparationTime: 4,
        tags: ['Cheesecake', 'Dâu tươi', 'Kem cheese', 'Ngọt ngào']
    }
];

// Enhanced Reviews Data
export const productReviews: ProductReview[] = [
    {
        id: 'review-1',
        productId: 'highland-coffee-1',
        userId: 'user-1',
        userName: 'Nguyễn Văn An',
        userAvatar: '/images/male-avatar.png',
        rating: 5,
        comment: 'Cà phê Highland đặc biệt thật sự tuyệt vời! Hương vị đậm đà và thơm ngon. Nhân viên phục vụ rất nhiệt tình.',
        images: ['/images/coffee/review-1.webp'],
        createdAt: '2024-01-15T10:30:00Z',
        helpful: 25,
        verified: true
    },
    {
        id: 'review-2',
        productId: 'highland-coffee-1',
        userId: 'user-2',
        userName: 'Trần Thị Bình',
        userAvatar: '/images/female-avatar.png',
        rating: 4,
        comment: 'Cà phê ngon nhưng giá hơi cao. Không gian quán rất đẹp và thoải mái.',
        images: [],
        createdAt: '2024-01-14T15:45:00Z',
        helpful: 12,
        verified: true
    },
    {
        id: 'review-3',
        productId: 'highland-cappuccino',
        userId: 'user-3',
        userName: 'Lê Minh Cường',
        userAvatar: '/images/male-avatar.png',
        rating: 5,
        comment: 'Cappuccino Highland có lớp foam hoàn hảo! Hương vị cân bằng giữa cà phê và sữa.',
        images: ['/images/coffee/review-2.webp'],
        createdAt: '2024-01-13T09:20:00Z',
        helpful: 18,
        verified: true
    }
];

// Enhanced User Profiles
export const userProfiles: UserProfile[] = [
    {
        id: 'user-1',
        name: 'Nguyễn Văn An',
        email: 'nguyenvanan@email.com',
        image: '/images/male-avatar.png',
        phone: '0123456789',
        points: 1250,
        totalSpent: 2500000,
        joinDate: '2023-06-15T00:00:00Z',
        membership: {
            level: 'Gold',
            benefits: ['Giảm giá 15%', 'Tích điểm x2', 'Ưu tiên giao hàng'],
            nextLevel: 'Platinum',
            pointsToNext: 750
        },
        preferences: {
            favoriteCategories: ['Coffee', 'Tea'],
            favoriteProducts: ['highland-coffee-1', 'highland-cappuccino'],
            dietaryRestrictions: [],
            notifications: {
                email: true,
                sms: true,
                push: true
            }
        },
        addresses: [
            {
                id: 'addr-1',
                name: 'Nhà riêng',
                address: '123 Đường ABC, Quận 1, TP.HCM',
                phone: '0123456789',
                isDefault: true,
                coordinates: { lat: 10.7769, lng: 106.7009 }
            }
        ]
    }
];

// Enhanced Memberships
export const memberships: Membership[] = [
    {
        level: 'Bronze',
        minPoints: 0,
        maxPoints: 499,
        benefits: ['Giảm giá 5%', 'Tích điểm x1'],
        color: '#CD7F32',
        icon: '🥉'
    },
    {
        level: 'Silver',
        minPoints: 500,
        maxPoints: 999,
        benefits: ['Giảm giá 10%', 'Tích điểm x1.5', 'Miễn phí giao hàng'],
        color: '#C0C0C0',
        icon: '🥈'
    },
    {
        level: 'Gold',
        minPoints: 1000,
        maxPoints: 1999,
        benefits: ['Giảm giá 15%', 'Tích điểm x2', 'Ưu tiên giao hàng', 'Quà sinh nhật'],
        color: '#FFD700',
        icon: '🥇'
    },
    {
        level: 'Platinum',
        minPoints: 2000,
        maxPoints: 4999,
        benefits: ['Giảm giá 20%', 'Tích điểm x2.5', 'VIP service', 'Sản phẩm độc quyền'],
        color: '#E5E4E2',
        icon: '💎'
    },
    {
        level: 'Diamond',
        minPoints: 5000,
        maxPoints: Infinity,
        benefits: ['Giảm giá 25%', 'Tích điểm x3', 'Personal barista', 'Sự kiện đặc biệt'],
        color: '#B9F2FF',
        icon: '💠'
    }
];

// Enhanced Stores Data
export const stores: Store[] = [
    {
        id: 'store-1',
        name: 'Highland Coffee Nguyễn Huệ',
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        phone: '028 3822 1234',
        email: 'nguyenhue@highlandcoffee.com',
        coordinates: { lat: 10.7769, lng: 106.7009 },
        hours: {
            monday: '06:00-22:00',
            tuesday: '06:00-22:00',
            wednesday: '06:00-22:00',
            thursday: '06:00-22:00',
            friday: '06:00-23:00',
            saturday: '06:00-23:00',
            sunday: '07:00-22:00'
        },
        services: ['Dine-in', 'Takeaway', 'Delivery', 'WiFi', 'Parking'],
        rating: 4.8,
        reviewCount: 1250,
        images: ['/images/stores/store-1.webp'],
        isOpen: true,
        deliveryRadius: 5,
        deliveryFee: 15000,
        minOrderAmount: 50000
    },
    {
        id: 'store-2',
        name: 'Highland Coffee Vincom Center',
        address: '456 Lê Thánh Tôn, Quận 1, TP.HCM',
        phone: '028 3822 5678',
        email: 'vincom@highlandcoffee.com',
        coordinates: { lat: 10.7770, lng: 106.7010 },
        hours: {
            monday: '07:00-22:00',
            tuesday: '07:00-22:00',
            wednesday: '07:00-22:00',
            thursday: '07:00-22:00',
            friday: '07:00-23:00',
            saturday: '07:00-23:00',
            sunday: '08:00-22:00'
        },
        services: ['Dine-in', 'Takeaway', 'Delivery', 'WiFi'],
        rating: 4.7,
        reviewCount: 980,
        images: ['/images/stores/store-2.webp'],
        isOpen: true,
        deliveryRadius: 3,
        deliveryFee: 12000,
        minOrderAmount: 40000
    }
];

// Enhanced Notifications
export const notifications: Notification[] = [
    {
        id: 'notif-1',
        type: 'order',
        title: 'Đơn hàng đã được xác nhận',
        message: 'Đơn hàng #HC001234 đã được xác nhận và đang được chuẩn bị',
        data: { orderId: 'HC001234' },
        read: false,
        createdAt: '2024-01-15T10:30:00Z',
        priority: 'medium'
    },
    {
        id: 'notif-2',
        type: 'promotion',
        title: 'Khuyến mãi đặc biệt',
        message: 'Giảm giá 20% cho tất cả sản phẩm cà phê trong tuần này',
        data: { promotionId: 'PROMO001' },
        read: false,
        createdAt: '2024-01-14T09:00:00Z',
        priority: 'high'
    },
    {
        id: 'notif-3',
        type: 'membership',
        title: 'Chúc mừng bạn đã lên cấp Gold',
        message: 'Bạn đã tích đủ điểm để lên cấp thành viên Gold. Hưởng nhiều ưu đãi hơn!',
        data: { membershipLevel: 'Gold' },
        read: true,
        createdAt: '2024-01-13T15:20:00Z',
        priority: 'high'
    }
];

// Sample Orders
export const sampleOrders: DeliveryOrder[] = [
    {
        id: 'HC001234',
        userId: 'user-1',
        items: [
            {
                product: coffeeProducts[0],
                quantity: 2,
                size: 'M',
                customizations: { 'Đường': 'Vừa', 'Sữa': 'Sữa tươi' }
            }
        ],
        total: 90000,
        deliveryFee: 15000,
        discount: 5000,
        finalTotal: 100000,
        status: 'delivered',
        paymentMethod: 'cash',
        deliveryAddress: {
            name: 'Nhà riêng',
            address: '123 Đường ABC, Quận 1, TP.HCM',
            phone: '0123456789',
            coordinates: { lat: 10.7769, lng: 106.7009 }
        },
        estimatedDeliveryTime: '2024-01-15T11:30:00Z',
        actualDeliveryTime: '2024-01-15T11:25:00Z',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T11:25:00Z',
        notes: 'Giao hàng nhanh, đúng giờ',
        rating: 5,
        review: 'Cà phê ngon, giao hàng nhanh chóng'
    }
];

// Helper functions
export const getProductById = (id: string): CoffeeProduct | undefined => {
    return coffeeProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: ProductCategory): CoffeeProduct[] => {
    return coffeeProducts.filter(product => product.category === category);
};

export const getBestSellers = (): CoffeeProduct[] => {
    return coffeeProducts.filter(product => product.isBestSeller);
};

export const getNewProducts = (): CoffeeProduct[] => {
    return coffeeProducts.filter(product => product.isNew);
};

export const searchProducts = (query: string): CoffeeProduct[] => {
    const lowercaseQuery = query.toLowerCase();
    return coffeeProducts.filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
};

export const getReviewsByProductId = (productId: string): ProductReview[] => {
    return productReviews.filter(review => review.productId === productId);
};

export const getUserMembership = (points: number): Membership => {
    return memberships.find(membership =>
        points >= membership.minPoints && points <= membership.maxPoints
    ) || memberships[0];
};

export const getStoreById = (id: string): Store | undefined => {
    return stores.find(store => store.id === id);
};

export const getNearbyStores = (coordinates: { lat: number; lng: number }, radius: number = 5): Store[] => {
    // Simple distance calculation (in real app, use proper geolocation library)
    return stores.filter(store => {
        const distance = Math.sqrt(
            Math.pow(store.coordinates.lat - coordinates.lat, 2) +
            Math.pow(store.coordinates.lng - coordinates.lng, 2)
        );
        return distance <= radius;
    });
};
