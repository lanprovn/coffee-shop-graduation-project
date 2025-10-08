import React, { useState, useCallback, useRef } from 'react';
import { useOfflineStore } from './useOfflineStore';

interface OptimisticUpdateConfig<T> {
  optimisticData: T;
  rollbackData: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  timeout?: number;
}

interface OptimisticUpdateState<T> {
  data: T;
  isUpdating: boolean;
  error: string | null;
  lastUpdate: string | null;
}

export const useOptimisticUpdate = <T>(
  initialData: T,
  updateFunction: (data: T) => Promise<T>
) => {
  const [state, setState] = useState<OptimisticUpdateState<T>>({
    data: initialData,
    isUpdating: false,
    error: null,
    lastUpdate: null,
  });

  const rollbackRef = useRef<T>(initialData);
  const { addPendingAction, isOnline } = useOfflineStore();

  const update = useCallback(async (config: OptimisticUpdateConfig<T>) => {
    const { optimisticData, rollbackData, onSuccess, onError, timeout = 5000 } = config;

    // Store rollback data
    rollbackRef.current = rollbackData;

    // Apply optimistic update immediately
    setState(prev => ({
      ...prev,
      data: optimisticData,
      isUpdating: true,
      error: null,
    }));

    try {
      // If offline, add to pending actions
      if (!isOnline) {
        addPendingAction({
          type: 'update_cart', // This would be dynamic based on context
          data: optimisticData,
        });

        setState(prev => ({
          ...prev,
          isUpdating: false,
          lastUpdate: new Date().toISOString(),
        }));

        onSuccess?.(optimisticData);
        return;
      }

      // Perform actual update
      const result = await Promise.race([
        updateFunction(optimisticData),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Update timeout')), timeout)
        ),
      ]);

      // Update successful
      setState(prev => ({
        ...prev,
        data: result,
        isUpdating: false,
        error: null,
        lastUpdate: new Date().toISOString(),
      }));

      onSuccess?.(result);
    } catch (error) {
      // Rollback on error
      setState(prev => ({
        ...prev,
        data: rollbackRef.current,
        isUpdating: false,
        error: error instanceof Error ? error.message : 'Update failed',
      }));

      onError?.(error instanceof Error ? error : new Error('Update failed'));
    }
  }, [updateFunction, addPendingAction, isOnline]);

  const rollback = useCallback(() => {
    setState(prev => ({
      ...prev,
      data: rollbackRef.current,
      error: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    data: state.data,
    isUpdating: state.isUpdating,
    error: state.error,
    lastUpdate: state.lastUpdate,
    update,
    rollback,
    clearError,
  };
};

// Optimistic Cart Hook
export const useOptimisticCart = () => {
  const { cart, addProductToCart, removeProductFromCart, updateCartItemQuantity } = useShoppingCart();
  const { isOnline } = useOfflineStore();

  const optimisticAddToCart = useOptimisticUpdate(
    cart,
    async (newCart) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return newCart;
    }
  );

  const addToCart = useCallback(async (
    product: CoffeeProduct,
    quantity: number,
    size: string,
    customizations?: Record<string, string>
  ) => {
    const currentCart = optimisticAddToCart.data;
    const newItem: CartItem = {
      id: `cart-${Date.now()}`,
      product,
      quantity,
      size,
      customizations,
    };

    const updatedCart = [...currentCart, newItem];

    await optimisticAddToCart.update({
      optimisticData: updatedCart,
      rollbackData: currentCart,
      onSuccess: () => {
        // Update actual cart state
        addProductToCart(product, quantity, size, customizations);
      },
      onError: (error) => {
        console.error('Failed to add to cart:', error);
      },
    });
  }, [optimisticAddToCart, addProductToCart]);

  const removeFromCart = useCallback(async (itemId: string) => {
    const currentCart = optimisticAddToCart.data;
    const updatedCart = currentCart.filter(item => item.id !== itemId);

    await optimisticAddToCart.update({
      optimisticData: updatedCart,
      rollbackData: currentCart,
      onSuccess: () => {
        removeProductFromCart(itemId);
      },
      onError: (error) => {
        console.error('Failed to remove from cart:', error);
      },
    });
  }, [optimisticAddToCart, removeProductFromCart]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    const currentCart = optimisticAddToCart.data;
    const updatedCart = currentCart.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );

    await optimisticAddToCart.update({
      optimisticData: updatedCart,
      rollbackData: currentCart,
      onSuccess: () => {
        updateCartItemQuantity(itemId, quantity);
      },
      onError: (error) => {
        console.error('Failed to update quantity:', error);
      },
    });
  }, [optimisticAddToCart, updateCartItemQuantity]);

  return {
    cart: optimisticAddToCart.data,
    isUpdating: optimisticAddToCart.isUpdating,
    error: optimisticAddToCart.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    rollback: optimisticAddToCart.rollback,
  };
};

// Optimistic Wishlist Hook
export const useOptimisticWishlist = () => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isOnline } = useOfflineStore();

  const optimisticWishlist = useOptimisticUpdate(
    wishlist,
    async (newWishlist) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return newWishlist;
    }
  );

  const addToWishlistOptimistic = useCallback(async (productId: string) => {
    const currentWishlist = optimisticWishlist.data;
    const updatedWishlist = [...currentWishlist, productId];

    await optimisticWishlist.update({
      optimisticData: updatedWishlist,
      rollbackData: currentWishlist,
      onSuccess: () => {
        addToWishlist(productId);
      },
      onError: (error) => {
        console.error('Failed to add to wishlist:', error);
      },
    });
  }, [optimisticWishlist, addToWishlist]);

  const removeFromWishlistOptimistic = useCallback(async (productId: string) => {
    const currentWishlist = optimisticWishlist.data;
    const updatedWishlist = currentWishlist.filter(id => id !== productId);

    await optimisticWishlist.update({
      optimisticData: updatedWishlist,
      rollbackData: currentWishlist,
      onSuccess: () => {
        removeFromWishlist(productId);
      },
      onError: (error) => {
        console.error('Failed to remove from wishlist:', error);
      },
    });
  }, [optimisticWishlist, removeFromWishlist]);

  return {
    wishlist: optimisticWishlist.data,
    isUpdating: optimisticWishlist.isUpdating,
    error: optimisticWishlist.error,
    addToWishlist: addToWishlistOptimistic,
    removeFromWishlist: removeFromWishlistOptimistic,
    rollback: optimisticWishlist.rollback,
  };
};

// Optimistic Address Hook
export const useOptimisticAddresses = () => {
  const { userAddresses, addOrUpdateUserAddress, removeUserAddress } = useUserAddress();
  const { isOnline } = useOfflineStore();

  const optimisticAddresses = useOptimisticUpdate(
    userAddresses,
    async (newAddresses) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      return newAddresses;
    }
  );

  const addAddress = useCallback(async (address: UserAddress) => {
    const currentAddresses = optimisticAddresses.data;
    const updatedAddresses = [...currentAddresses, address];

    await optimisticAddresses.update({
      optimisticData: updatedAddresses,
      rollbackData: currentAddresses,
      onSuccess: () => {
        addOrUpdateUserAddress(address);
      },
      onError: (error) => {
        console.error('Failed to add address:', error);
      },
    });
  }, [optimisticAddresses, addOrUpdateUserAddress]);

  const removeAddress = useCallback(async (addressId: string) => {
    const currentAddresses = optimisticAddresses.data;
    const updatedAddresses = currentAddresses.filter(addr => addr.id !== addressId);

    await optimisticAddresses.update({
      optimisticData: updatedAddresses,
      rollbackData: currentAddresses,
      onSuccess: () => {
        removeUserAddress(addressId);
      },
      onError: (error) => {
        console.error('Failed to remove address:', error);
      },
    });
  }, [optimisticAddresses, removeUserAddress]);

  return {
    addresses: optimisticAddresses.data,
    isUpdating: optimisticAddresses.isUpdating,
    error: optimisticAddresses.error,
    addAddress,
    removeAddress,
    rollback: optimisticAddresses.rollback,
  };
};

export default useOptimisticUpdate;
