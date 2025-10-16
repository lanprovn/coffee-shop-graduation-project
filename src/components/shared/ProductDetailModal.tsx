import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CoffeeProduct } from '@/types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CoffeeProduct | null;
  onAddToCart: (product: CoffeeProduct, quantity: number, size: string, toppings: string[], notes: string) => void;
}

export default function ProductDetailModal({ isOpen, onClose, product, onAddToCart }: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState('Nhỏ');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!product) return null;

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
    onAddToCart(product, quantity, selectedSize, selectedToppings, notes);
    onClose();
    // Reset form
    setSelectedSize('Nhỏ');
    setSelectedToppings([]);
    setQuantity(1);
    setNotes('');
  };

  const toggleTopping = (toppingName: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingName) 
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex h-full">
            {/* Left side - Product details */}
            <div className="flex-1 p-8 overflow-y-auto">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>

              {/* Product image */}
              <div className="mb-6">
                <div className="aspect-square bg-orange-100 rounded-2xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product info */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">{product.displayName}</h2>
                
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

              {/* Size selection */}
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

              {/* Topping selection */}
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

              {/* Special notes */}
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
            </div>

            {/* Right side - Cart summary */}
            <div className="w-80 bg-gray-50 p-6 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🛒</span>
                Giỏ hàng
              </h3>

              {/* Cart items preview */}
              <div className="flex-1 space-y-4">
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

              {/* Total and checkout */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-2xl font-bold text-orange-500 mb-4">
                  Tổng cộng: {calculateTotalPrice().toLocaleString('vi-VN')} ₫
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
