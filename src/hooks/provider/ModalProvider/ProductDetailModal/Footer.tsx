import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoffeeProduct, ProductSize } from '@/types';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import CounterInput from '@/components/shared/CounterInput';
import { useShoppingCart } from '@/hooks/useShoppingCart';

interface ProductDetailModalProps {
  product: CoffeeProduct;
  selectedSize?: ProductSize;
  onClose: () => void;
}

export default function Footer({ product, selectedSize, onClose }: ProductDetailModalProps) {
  // Shopping Cart
  const { addToCart } = useShoppingCart();
  const navigate = useNavigate();
  // Local State
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handelAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    onClose();
    // Chuyển thẳng đến trang checkout sau khi thêm vào giỏ
    navigate('/checkout');
  };

  return (
    <div className="flex items-center justify-between w-full bg-white border-t p-4">
      <CounterInput value={quantity} onChange={handleQuantityChange} />
      <ButtonFilled onClick={handelAddToCart}>Add to Cart</ButtonFilled>
    </div>
  );
}
