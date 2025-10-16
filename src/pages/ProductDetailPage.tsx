import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { CoffeeProduct } from '@/types';
import { 
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { priceWithSign } from '@/utils/helper';

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

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
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

  const calculateTotalPrice = () => {
    const basePrice = product.price;
    const sizePrice = sizeOptions.find(s => s.name === selectedSize)?.price || 0;
    const toppingPrice = selectedToppings.reduce((total, toppingName) => {
      const topping = toppingOptions.find(t => t.name === toppingName);
      return total + (topping?.price || 0);
    }, 0);
    
    return (basePrice + sizePrice + toppingPrice) * quantity;
  };

  const handleAddToCart = () => {
    // Create a custom product with size and toppings
    const customProduct: CoffeeProduct = {
      ...product,
      displayName: `${product.displayName} (${selectedSize})`,
      price: product.price + (selectedSize === 'Vừa' ? 5000 : selectedSize === 'Lớn' ? 10000 : 0)
    };
    
    // Add toppings price
    const toppingPrices = {
      'Thêm sữa': 3000,
      'Kem tươi': 5000,
      'Caramel': 8000
    };
    
    const totalToppingPrice = selectedToppings.reduce((total, topping) => {
      return total + (toppingPrices[topping as keyof typeof toppingPrices] || 0);
    }, 0);
    
    customProduct.price += totalToppingPrice;
    
    // Add to cart
    addToCart(customProduct, quantity);
    
    // Navigate back to POS
    navigate('/pos');
  };

  const toggleTopping = (toppingName: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingName) 
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Side - Categories (Empty for now) */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => navigate('/pos')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Quay lại POS</span>
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh mục</h3>
          <div className="space-y-2">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <span className="text-orange-700 font-medium">Chi tiết sản phẩm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center - Product Details */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900">{product.displayName}</h1>
          <p className="text-gray-600 mt-2">Chọn size, topping và số lượng cho sản phẩm</p>
        </div>

        {/* Product Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="max-w-4xl mx-auto">
            {/* Product Image */}
            <div className="mb-8">
              <div className="aspect-square bg-orange-100 rounded-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="text-lg font-semibold">{product.rating}</span>
                <span className="text-gray-600">Highland Coffee</span>
              </div>

              <p className="text-gray-600 text-lg">{product.description}</p>

              <div className="text-3xl font-bold text-orange-500">
                {calculateTotalPrice().toLocaleString('vi-VN')} ₫
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chọn size</h3>
              <div className="grid grid-cols-3 gap-4">
                {sizeOptions.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedSize === size.name
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{size.name}</div>
                    {size.price > 0 && (
                      <div className="text-sm text-gray-600">+{size.price.toLocaleString('vi-VN')} ₫</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Topping Selection */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chọn topping</h3>
              <div className="grid grid-cols-2 gap-4">
                {toppingOptions.map((topping) => (
                  <button
                    key={topping.name}
                    onClick={() => toggleTopping(topping.name)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedToppings.includes(topping.name)
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{topping.name}</div>
                    {topping.price > 0 && (
                      <div className="text-sm text-gray-600">+{topping.price.toLocaleString('vi-VN')} ₫</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Số lượng</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <MinusIcon className="w-5 h-5" />
                </button>
                <span className="text-2xl font-bold px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Special Notes */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ghi chú đặc biệt</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Không cay, ít đường..."
                className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Add to Cart Button - Center */}
            <div className="mt-8">
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
      </div>

      {/* Right Side - Cart Preview */}
      <div className="w-80 bg-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="mr-2">🛒</span>
            Giỏ hàng
          </h3>
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
                  {calculateTotalPrice().toLocaleString('vi-VN')} ₫
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Total and Add to Cart */}
          <div className="space-y-4">
            {/* Total */}
            <div className="text-2xl font-bold text-orange-500 text-center">
              Tổng cộng: {calculateTotalPrice().toLocaleString('vi-VN')} ₫
            </div>

            {/* Add to Cart Button */}
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
    </div>
  );
}
