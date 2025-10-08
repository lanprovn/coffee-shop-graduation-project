import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { CartItem, CoffeeProduct, DeliOption, PaymentMethod, ProductSize, Topping } from '@/types';
import ShoppingCartContext from '@/hooks/context/ShoppingCartContext';
import { getSumFromArr } from '@/utils/helper';
import { defaultDeliFee } from '@/constants/constants';
import { trackAddToCart, trackRemoveFromCart, trackBeginCheckout } from '@/utils/analytics';

interface ShoppingCartProviderProps {
  children: ReactNode;
}

const ShoppingCartProvider: React.FC<ShoppingCartProviderProps> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliOption, setDeliOption] = useState(DeliOption.DELIVER);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CASH);

  const cartItemIds = items?.map((ci) => ci.product.id);
  const itemCount = items.length;
  const subTotal = getSumFromArr(
    items?.map((item) => item.totalPrice)
  );
  const deliFee = deliOption === DeliOption.DELIVER ? defaultDeliFee : 0;
  const totalPayment = subTotal + deliFee;

  const addToCart = (
    product: CoffeeProduct,
    quantity: number,
    selectedSize: ProductSize = ProductSize.Medium,
    selectedToppings: Topping[] = []
  ) => {
    // Tính giá dựa trên size và topping
    const sizePrice = product.sizes.find(s => s.size === selectedSize)?.price || product.basePrice;
    const toppingPrice = selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
    const unitPrice = sizePrice + toppingPrice;
    const totalPrice = unitPrice * quantity;

    const newItem: CartItem = {
      product,
      quantity,
      selectedSize,
      selectedToppings,
      unitPrice,
      totalPrice,
    };

    // Kiểm tra xem đã có sản phẩm với cùng size và topping chưa
    const existingItemIndex = items.findIndex(
      item =>
        item.product.id === product.id &&
        item.selectedSize === selectedSize &&
        JSON.stringify(item.selectedToppings.sort()) === JSON.stringify(selectedToppings.sort())
    );

    if (existingItemIndex !== -1) {
      // Cập nhật số lượng nếu đã có
      updateQuantity(existingItemIndex, quantity);
    } else {
      // Thêm mới
      setItems((prevCart) => [...prevCart, newItem]);

      // Track analytics
      trackAddToCart(
        product.id,
        product.displayName,
        product.category,
        quantity,
        unitPrice
      );
    }
  };

  const updateQuantity = (itemIndex: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemIndex);
      return;
    }

    setItems((prevCart) =>
      prevCart.map((item, index) => {
        if (index === itemIndex) {
          const newItem: CartItem = {
            ...item,
            quantity: newQuantity,
            totalPrice: item.unitPrice * newQuantity,
          };
          return newItem;
        } else {
          return item;
        }
      })
    );
  };

  const removeFromCart = (itemIndex: number) => {
    const itemToRemove = items[itemIndex];
    if (itemToRemove) {
      // Track analytics
      trackRemoveFromCart(
        itemToRemove.product.id,
        itemToRemove.product.displayName,
        itemToRemove.product.category,
        itemToRemove.quantity,
        itemToRemove.unitPrice
      );
    }

    setItems((prevCart) =>
      prevCart.filter((_, index) => index !== itemIndex)
    );
  };

  const updateDeliOption = useCallback((value: DeliOption) => {
    setDeliOption(value);
  }, []);

  const updatePaymentMethod = useCallback((value: PaymentMethod) => {
    setPaymentMethod(value);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      deliOption,
      updateDeliOption,
      subTotal,
      deliFee,
      totalPayment,
      paymentMethod,
      updatePaymentMethod,
      clearCart,
    }),
    [items, deliOption, paymentMethod]
  );

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;
