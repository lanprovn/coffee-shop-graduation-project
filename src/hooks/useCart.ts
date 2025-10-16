import { useState, useCallback } from 'react';
import { CartItemNew } from '@/types';

export const useCart = () => {
  const [items, setItems] = useState<CartItemNew[]>([]);

  const addToCart = useCallback((item: Omit<CartItemNew, 'id'>) => {
    const newItem: CartItemNew = {
      ...item,
      id: `${item.productId}-${Date.now()}`
    };
    
    setItems(prev => [...prev, newItem]);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity, totalPrice: item.basePrice * quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems
  };
};
