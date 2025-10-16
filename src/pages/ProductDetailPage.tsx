import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Size, Topping } from '@/types';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { StarIcon } from '@heroicons/react/24/solid';
import { formatPrice } from '@/utils/formatPrice';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<Size | undefined>(undefined);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const product = products.find(p => p.id === id);

  // Initialize with first size if available
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize({
        name: product.sizes[0].name,
        extraPrice: product.sizes[0].price
      });
    }
  }, [product?.sizes, selectedSize]);

  const calculateTotalPrice = () => {
    if (!product) return 0;
    const base = product.price;
    const sizePrice = selectedSize?.extraPrice || 0;
    const toppingPrice = selectedToppings.reduce((sum, t) => sum + t.extraPrice, 0);
    return (base + sizePrice + toppingPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const totalPrice = calculateTotalPrice();
    
    addToCart({
      productId: parseInt(product.id),
      name: product.displayName,
      image: product.image,
      basePrice: product.price,
      selectedSize,
      selectedToppings,
      note,
      quantity,
      totalPrice,
    });
    
    // Reset form
    setSelectedSize(product.sizes?.[0] ? {
      name: product.sizes[0].name,
      extraPrice: product.sizes[0].price
    } : undefined);
    setSelectedToppings([]);
    setQuantity(1);
    setNote('');
  };

  const handleToppingToggle = (topping: Topping) => {
    setSelectedToppings(prev => {
      const isSelected = prev.some(t => t.name === topping.name);
      if (isSelected) {
        return prev.filter(t => t.name !== topping.name);
      } else {
        return [...prev, topping];
      }
    });
  };

  if (!product) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-3">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-gray-500 mb-6">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate('/pos')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Quay lại POS
          </button>
        </div>
      </div>
    );
  }

  // Mock sizes and toppings for demonstration
  const mockSizes: Size[] = [
    { name: 'Nhỏ', extraPrice: 0 },
    { name: 'Vừa', extraPrice: 5000 },
    { name: 'Lớn', extraPrice: 10000 }
  ];

  const mockToppings: Topping[] = [
    { name: 'Thêm đường', extraPrice: 0 },
    { name: 'Thêm sữa', extraPrice: 3000 },
    { name: 'Kem tươi', extraPrice: 5000 },
    { name: 'Caramel', extraPrice: 8000 }
  ];

  return (
    <div className="w-full">
      {/* Mobile Category Filter */}
      <div className="lg:hidden mb-6">
        <div className="flex overflow-x-auto pb-2">
          <button
            onClick={() => {}}
            className="flex-shrink-0 px-4 py-2 rounded-full mr-2 transition-all duration-300 bg-orange-500 text-white"
          >
            Chi tiết sản phẩm
          </button>
        </div>
      </div>

      {/* Product Detail Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/coffee/coffee-black.webp';
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.displayName}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-gray-600 font-medium">
                    {product.rating} • Highland Coffee
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-500">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Chọn size</h3>
              <div className="grid grid-cols-3 gap-3">
                {mockSizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedSize?.name === size.name
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-semibold text-sm">{size.name}</div>
                    {size.extraPrice > 0 && (
                      <div className="text-xs text-gray-500">
                        +{formatPrice(size.extraPrice)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Topping Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Chọn topping</h3>
              <div className="grid grid-cols-2 gap-3">
                {mockToppings.map((topping) => {
                  const isSelected = selectedToppings.some(t => t.name === topping.name);
                  return (
                    <button
                      key={topping.name}
                      onClick={() => handleToppingToggle(topping)}
                      className={`p-3 rounded-lg border-2 transition-colors text-left ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold text-sm">{topping.name}</div>
                      {topping.extraPrice > 0 && (
                        <div className="text-xs text-gray-500">
                          +{formatPrice(topping.extraPrice)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Số lượng</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition-colors duration-200"
                >
                  -
                </button>
                <span className="text-lg font-semibold text-gray-800 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Note */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Ghi chú đặc biệt</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Không cay, ít đường..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                rows={3}
              />
            </div>

            {/* Total Price */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
                <span className="text-2xl font-bold text-orange-500">
                  {formatPrice(calculateTotalPrice())}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;