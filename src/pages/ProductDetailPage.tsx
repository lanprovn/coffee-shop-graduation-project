import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { CoffeeProduct } from '@/types';
import { 
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import ProductCustomizer from '@/components/ProductCustomizer';
import { getProductTotalPrice } from '@/utils/pricing';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products } = useProduct();
  const { addToCart } = useShoppingCart();
  
  const [selectedSize, setSelectedSize] = useState('Nhỏ');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Find product by ID
  const product = products?.find(p => p.id === productId);

  const sizeOptions = [
    { name: 'Nhỏ', price: 0 },
    { name: 'Vừa', price: 5000 },
    { name: 'Lớn', price: 10000 }
  ];

  const toppingOptions = [
    { name: 'Thêm đường', price: 0 },
    { name: 'Thêm sữa', price: 3000 },
    { name: 'Kem tươi', price: 5000 },
    { name: 'Caramel', price: 8000 }
  ];

  // Calculate total price using helper function
  const calculateTotalPrice = useMemo(() => {
    if (!product) return 0;
    return getProductTotalPrice(
      product.price,
      selectedSize,
      selectedToppings,
      sizeOptions,
      toppingOptions
    );
  }, [product, selectedSize, selectedToppings]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    // Create a custom product with size and toppings
    const customProduct: CoffeeProduct = {
      ...product,
      displayName: `${product.displayName} (${selectedSize})`,
      price: calculateTotalPrice
    };
    
    // Add to cart
    addToCart(customProduct, quantity);
    
    // Navigate back to POS
    navigate('/pos');
  }, [product, selectedSize, calculateTotalPrice, quantity, addToCart, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h2>
          <button
            onClick={() => navigate('/pos')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            Quay lại POS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Product Image */}
      <div className="w-1/3 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="aspect-square bg-orange-500 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Center - Product Customization */}
      <div className="flex-1 bg-white flex flex-col justify-center p-8">
        <div className="max-w-2xl mx-auto w-full">
          <ProductCustomizer
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedToppings={selectedToppings}
            setSelectedToppings={setSelectedToppings}
            quantity={quantity}
            setQuantity={setQuantity}
            notes={notes}
            setNotes={setNotes}
            sizeOptions={sizeOptions}
            toppingOptions={toppingOptions}
          />

          {/* Total */}
          <div className="mb-8">
            <div className="text-2xl font-bold text-orange-500">
              Tổng cộng: {calculateTotalPrice.toLocaleString('vi-VN')} ₫
            </div>
          </div>

          {/* Add to Cart Button */}
          <div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center space-x-2 text-lg"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Cart Preview */}
      <div className="w-80 bg-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="mr-2">🛒</span>
              Giỏ hàng
            </h3>
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
              {quantity} món
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* Product Preview */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{product.displayName}</div>
                  <div className="text-sm text-gray-600">Size: {selectedSize}</div>
                  {selectedToppings.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Topping: {selectedToppings.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="font-bold text-orange-500">
                  {calculateTotalPrice.toLocaleString('vi-VN')} ₫
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Total and Checkout */}
          <div className="space-y-4">
            {/* Total */}
            <div className="text-2xl font-bold text-orange-500 text-center">
              Tổng cộng: {calculateTotalPrice.toLocaleString('vi-VN')} ₫
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center space-x-2 text-lg"
            >
              <span>Thanh toán</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}