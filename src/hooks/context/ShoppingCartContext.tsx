import { createContext } from 'react';
import { CartItem, CoffeeProduct, DeliOption, PaymentMethod, ProductSize, Topping } from '@/types';

export interface ShoppingCartContextProps {
  // Cart Item
  items: CartItem[];
  addToCart: (product: CoffeeProduct, quantity: number, selectedSize?: ProductSize, selectedToppings?: Topping[]) => void;
  updateQuantity: (itemIndex: number, newQuantity: number) => void;
  removeFromCart: (itemIndex: number) => void;
  clearCart: () => void;
  // Delivery Option
  deliOption: DeliOption;
  updateDeliOption: (value: DeliOption) => void;
  // Payment Method
  paymentMethod: PaymentMethod;
  updatePaymentMethod: (value: PaymentMethod) => void;
  // Other
  itemCount: number;
  subTotal: number;
  deliFee: number;
  totalPayment: number;
}

const ShoppingCartContext = createContext<ShoppingCartContextProps | null>(
  null
);

export default ShoppingCartContext;
