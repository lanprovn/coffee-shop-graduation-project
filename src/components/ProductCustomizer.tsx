import React from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ProductCustomizerProps {
  selectedSize: string;
  setSelectedSize: (value: string) => void;
  selectedToppings: string[];
  setSelectedToppings: (value: string[]) => void;
  quantity: number;
  setQuantity: (value: number) => void;
  notes: string;
  setNotes: (value: string) => void;
  sizeOptions: { name: string; price: number }[];
  toppingOptions: { name: string; price: number }[];
}

export default function ProductCustomizer({
  selectedSize,
  setSelectedSize,
  selectedToppings,
  setSelectedToppings,
  quantity,
  setQuantity,
  notes,
  setNotes,
  sizeOptions,
  toppingOptions
}: ProductCustomizerProps) {
  const toggleTopping = (toppingName: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingName) 
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  return (
    <>
      {/* Size Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Chọn size</h3>
        <div className="grid grid-cols-3 gap-4">
          {sizeOptions.map((size) => (
            <button
              key={size.name}
              onClick={() => setSelectedSize(size.name)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedSize === size.name
                  ? 'border-orange-500 bg-white text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
            >
              <div className="font-semibold text-lg">{size.name}</div>
              {size.price > 0 && (
                <div className="text-sm text-gray-600 mt-1">+{size.price.toLocaleString('vi-VN')} ₫</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Topping Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Chọn topping</h3>
        <div className="grid grid-cols-2 gap-4">
          {toppingOptions.map((topping) => (
            <button
              key={topping.name}
              onClick={() => toggleTopping(topping.name)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedToppings.includes(topping.name)
                  ? 'border-orange-500 bg-white text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
            >
              <div className="font-semibold text-lg">{topping.name}</div>
              {topping.price > 0 && (
                <div className="text-sm text-gray-600 mt-1">+{topping.price.toLocaleString('vi-VN')} ₫</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Số lượng</h3>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center"
          >
            <MinusIcon className="w-6 h-6" />
          </button>
          <span className="text-3xl font-bold px-6">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Special Notes */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Ghi chú đặc biệt</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ví dụ: Không cay, ít đường..."
          className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          rows={3}
        />
      </div>
    </>
  );
}
