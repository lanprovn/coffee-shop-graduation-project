import React, { useState, useEffect } from 'react';
import { useKiosk } from '@/hooks/context/KioskContext';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useProduct } from '@/hooks/useProduct';
import { KioskMode, CoffeeProduct, CartItem, ProductCategory } from '@/types';
import { KIOSK_TOUCH_TARGET_SIZE } from '@/constants/constants';
import { 
  PlusIcon, 
  MinusIcon, 
  ShoppingCartIcon,
  TrashIcon,
  CreditCardIcon,
  PrinterIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { priceWithSign } from '@/utils/helper';

// Category Sidebar Component
const CategorySidebar: React.FC<{
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  productCounts: Record<string, number>;
}> = ({ categories, selectedCategory, onCategorySelect, productCounts }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'all': return '🍽️';
      case 'coffee': return '☕';
      case 'cake': return '🧁';
      case 'food': return '🍔';
      case 'dessert': return '🍰';
      case 'tea': return '🍵';
      case 'freeze': return '🧊';
      default: return '🍽️';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'all': return 'Tất cả món';
      case 'coffee': return 'Cà Phê';
      case 'cake': return 'Bánh Ngọt';
      case 'food': return 'Đồ Ăn';
      case 'dessert': return 'Tráng Miệng';
      case 'tea': return 'Trà';
      case 'freeze': return 'Đồ Uống Lạnh';
      default: return category;
    }
  };

  return (
    <div className="w-80 bg-gray-50 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Danh mục</h2>
      </div>
      
      {/* Categories */}
      <div className="flex-1 p-4 space-y-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-orange-100 border-l-4 border-orange-500 text-orange-700'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getCategoryIcon(category)}</span>
              <span className="font-medium">{getCategoryName(category)}</span>
            </div>
            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
              {productCounts[category] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Product Grid Component
const ProductGrid: React.FC<{ 
  products: CoffeeProduct[]; 
  onAddToCart: (product: CoffeeProduct) => void;
  category?: string;
}> = ({ products, onAddToCart, category }) => {
  return (
    <div className="flex-1 bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hệ thống Order</h1>
        <p className="text-gray-600">Chọn món ăn và thức uống từ menu bên dưới</p>
      </div>
      
      {/* Products Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative">
                <div className="aspect-square bg-orange-100 rounded-t-xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.isBestSeller && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Phổ biến
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {product.displayName}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">(Highland Coffee)</span>
                </div>
                
                {/* Price */}
                <div className="text-xl font-bold text-gray-900 mb-3">
                  {priceWithSign(product.price)}
                </div>
                
                {/* Options */}
                <div className="flex items-center space-x-4 text-sm text-blue-600">
                  <span>{product.sizes?.length || 3} size</span>
                  <span>{product.customizations?.length || 4} topping</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty state */}
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-400 text-2xl">🍽️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có sản phẩm</h3>
            <p className="text-gray-600">Chọn danh mục khác để xem sản phẩm</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Cart Sidebar Component
const CartSidebar: React.FC<{
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onProceedToPayment: () => void;
}> = ({ 
  items, 
  subtotal, 
  tax, 
  total, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onProceedToPayment 
}) => {
  return (
    <div className="w-80 bg-white shadow-lg flex flex-col">
      {/* Cart Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Giỏ hàng</h2>
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            {items.length} món
          </span>
        </div>
      </div>
      
      {/* Cart Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCartIcon className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có món nào</h3>
            <p className="text-gray-600">Chọn món từ menu để thêm vào giỏ hàng</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{item.product.displayName}</h4>
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(index, Math.max(0, item.quantity - 1))}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-gray-900">
                    {priceWithSign(item.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Cart Footer */}
      {items.length > 0 && (
        <div className="p-6 border-t border-gray-200 space-y-4 flex-shrink-0">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tạm tính:</span>
              <span className="font-semibold">{priceWithSign(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Thuế (5%):</span>
              <span className="font-semibold">{priceWithSign(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
              <span>Tổng cộng:</span>
              <span className="text-orange-600">{priceWithSign(total)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={onProceedToPayment}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors"
            >
              <CreditCardIcon className="w-6 h-6 inline mr-2" />
              Thanh toán
            </button>
            <button
              onClick={onClearCart}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              <TrashIcon className="w-5 h-5 inline mr-2" />
              Xóa giỏ hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function POSKioskPage() {
  const { 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    items, 
    clearCart,
    subTotal,
    totalPayment 
  } = useShoppingCart();
  const { products, categories, isLoading } = useProduct();
  
  // Debug: Log products and categories
  console.log('POS Debug - Products:', products?.length || 0);
  console.log('POS Debug - Categories:', categories);
  console.log('POS Debug - IsLoading:', isLoading);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tax] = useState(0.05); // 5% tax

  // Create new order when component mounts
  useEffect(() => {
    // Initialize with empty cart
    clearCart();
  }, [clearCart]);

  const handleAddToCart = (product: CoffeeProduct) => {
    addToCart(product, 1);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(index);
    } else {
      updateQuantity(index, quantity);
    }
  };

  const handleRemoveItem = (index: number) => {
    removeFromCart(index);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleProceedToPayment = () => {
    // Navigate to payment page
    window.location.href = '/payment';
  };

  // Calculate totals
  const subtotal = subTotal;
  const taxAmount = subtotal * tax;
  const total = totalPayment;

  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? products || []
    : (products || []).filter(product => product.category === selectedCategory);

  // Calculate product counts for each category
  const productCounts = categories?.reduce((acc, category) => {
    acc[category] = (products || []).filter(p => p.category === category).length;
    return acc;
  }, {} as Record<string, number>) || {};

  // Add "all" category count
  productCounts.all = products?.length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có sản phẩm</h3>
          <p className="text-gray-600 mb-4">Không thể tải danh sách sản phẩm</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Sidebar - Categories */}
      <CategorySidebar
        categories={['all', ...(categories || [])]}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        productCounts={productCounts}
      />
      
      {/* Main Content - Products */}
      <ProductGrid
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        category={selectedCategory}
      />
      
      {/* Right Sidebar - Cart */}
      <CartSidebar
        items={items}
        subtotal={subtotal}
        tax={taxAmount}
        total={total}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToPayment={handleProceedToPayment}
      />
    </div>
  );
}