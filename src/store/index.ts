import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CoffeeProduct, AuthUser, ProductReview, UserProfile, DeliveryOrder, CartItem, WishlistItem, Notification } from '@/types';

// Global App State
interface AppState {
    // User & Auth
    user: AuthUser | null;
    userProfile: UserProfile | null;

    // Products & Reviews
    products: CoffeeProduct[];
    reviews: ProductReview[];

    // Shopping
    cart: CartItem[];
    wishlist: WishlistItem[];
    recentViewed: CoffeeProduct[];

    // Orders
    orders: DeliveryOrder[];

    // UI State
    notifications: Notification[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setUser: (user: AuthUser | null) => void;
    setUserProfile: (profile: UserProfile | null) => void;
    setProducts: (products: CoffeeProduct[]) => void;
    addToCart: (product: CoffeeProduct, quantity?: number, size?: string) => void;
    removeFromCart: (productId: string, size?: string) => void;
    updateCartQuantity: (productId: string, quantity: number, size?: string) => void;
    clearCart: () => void;
    addToWishlist: (product: CoffeeProduct) => void;
    removeFromWishlist: (productId: string) => void;
    addToRecentViewed: (product: CoffeeProduct) => void;
    addOrder: (order: DeliveryOrder) => void;
    addNotification: (notification: Notification) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial State
            user: null,
            userProfile: null,
            products: [],
            reviews: [],
            cart: [],
            wishlist: [],
            recentViewed: [],
            orders: [],
            notifications: [],
            isLoading: false,
            error: null,

            // Actions
            setUser: (user) => set({ user }),

            setUserProfile: (profile) => set({ userProfile: profile }),

            setProducts: (products) => set({ products }),

            addToCart: (product, quantity = 1, size = 'medium') => {
                const { cart } = get();
                const existingItem = cart.find(
                    item => item.product.id === product.id && item.size === size
                );

                if (existingItem) {
                    set({
                        cart: cart.map(item =>
                            item.product.id === product.id && item.size === size
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    });
                } else {
                    set({
                        cart: [...cart, { product, quantity, size, id: `${product.id}_${size}` }]
                    });
                }
            },

            removeFromCart: (productId, size = 'medium') => {
                const { cart } = get();
                set({
                    cart: cart.filter(item => !(item.product.id === productId && item.size === size))
                });
            },

            updateCartQuantity: (productId, quantity, size = 'medium') => {
                const { cart } = get();
                if (quantity <= 0) {
                    get().removeFromCart(productId, size);
                    return;
                }

                set({
                    cart: cart.map(item =>
                        item.product.id === productId && item.size === size
                            ? { ...item, quantity }
                            : item
                    )
                });
            },

            clearCart: () => set({ cart: [] }),

            addToWishlist: (product) => {
                const { wishlist } = get();
                const exists = wishlist.some(item => item.product.id === product.id);
                if (!exists) {
                    set({
                        wishlist: [...wishlist, { product, addedAt: new Date().toISOString() }]
                    });
                }
            },

            removeFromWishlist: (productId) => {
                const { wishlist } = get();
                set({
                    wishlist: wishlist.filter(item => item.product.id !== productId)
                });
            },

            addToRecentViewed: (product) => {
                const { recentViewed } = get();
                const filtered = recentViewed.filter(item => item.id !== product.id);
                set({
                    recentViewed: [product, ...filtered].slice(0, 20) // Keep only last 20
                });
            },

            addOrder: (order) => {
                const { orders } = get();
                set({
                    orders: [order, ...orders]
                });
            },

            addNotification: (notification) => {
                const { notifications } = get();
                set({
                    notifications: [notification, ...notifications].slice(0, 50) // Keep only last 50
                });
            },

            removeNotification: (id) => {
                const { notifications } = get();
                set({
                    notifications: notifications.filter(notif => notif.id !== id)
                });
            },

            clearNotifications: () => set({ notifications: [] }),

            setLoading: (loading) => set({ isLoading: loading }),

            setError: (error) => set({ error }),
        }),
        {
            name: 'highland-coffee-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                userProfile: state.userProfile,
                cart: state.cart,
                wishlist: state.wishlist,
                recentViewed: state.recentViewed,
                orders: state.orders,
                notifications: state.notifications,
            }),
        }
    )
);

// Selectors for better performance
export const useCart = () => useAppStore(state => state.cart);
export const useWishlist = () => useAppStore(state => state.wishlist);
export const useUser = () => useAppStore(state => state.user);
export const useUserProfile = () => useAppStore(state => state.userProfile);
export const useProducts = () => useAppStore(state => state.products);
export const useOrders = () => useAppStore(state => state.orders);
export const useNotifications = () => useAppStore(state => state.notifications);
export const useRecentViewed = () => useAppStore(state => state.recentViewed);

// Computed selectors
export const useCartTotal = () => useAppStore(state => {
    return state.cart.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
});

export const useCartItemCount = () => useAppStore(state => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
});

export const useIsInWishlist = (productId: string) => useAppStore(state => {
    return state.wishlist.some(item => item.product.id === productId);
});

export const useIsInCart = (productId: string, size?: string) => useAppStore(state => {
    return state.cart.some(item =>
        item.product.id === productId && (size ? item.size === size : true)
    );
});
