import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useAuth } from '@/hooks/useAuth';
import { priceWithSign } from '@/utils/helper';
import { DeliOption } from '@/types';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';
import Title1 from '@/components/shared/typo/Title1';
import Title3 from '@/components/shared/typo/Title3';
import CounterInputSm from '@/components/shared/CounterInputSm';
import { TrashIcon, TruckIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

/**
 * CartPage: Trang giỏ hàng với UX được cải thiện
 * Bao gồm delivery options, item management, và payment summary
 */
export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    deliOption,
    updateDeliOption,
    subTotal,
    deliFee,
    totalPayment,
    itemCount
  } = useShoppingCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = async () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/checkout' } });
      return;
    }

    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      navigate('/checkout', { state: { deliOption, total: totalPayment } });
      setIsProcessing(false);
    }, 500);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleEmptyCart = () => {
    items.forEach((_, index) => removeFromCart(index));
  };

  if (itemCount === 0) {
    return (
      <div className="max-w-screen-lg mx-auto p-4 mt-20">
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🛒</div>
          <Title1 className="text-gray-800 mb-4">Giỏ hàng trống</Title1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá menu và thêm những món yêu thích!
          </p>
          <div className="flex gap-4 justify-center">
            <ButtonFilled onClick={handleContinueShopping}>
              Khám phá menu
            </ButtonFilled>
            <ButtonOutline onClick={() => navigate('/')}>
              Về trang chủ
            </ButtonOutline>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4 mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Title1 className="text-gray-800 mb-2">Giỏ hàng của bạn</Title1>
          <p className="text-gray-600">
            {itemCount} sản phẩm • Tổng cộng {priceWithSign(totalPayment)}
          </p>
        </div>
        <ButtonOutline onClick={handleEmptyCart} className="text-red-600 border-red-200 hover:bg-red-50">
          <TrashIcon className="w-4 h-4 mr-2" />
          Xóa tất cả
        </ButtonOutline>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Options */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <Title3 className="mb-4">Hình thức nhận hàng</Title3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => updateDeliOption(DeliOption.DELIVER)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${deliOption === DeliOption.DELIVER
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <TruckIcon className="w-6 h-6" />
                  <span className="font-semibold">Giao hàng</span>
                </div>
                <p className="text-sm text-gray-600">
                  Giao hàng tận nơi • Phí giao hàng {priceWithSign(deliFee)}
                </p>
              </button>

              <button
                onClick={() => updateDeliOption(DeliOption.PICK_UP)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${deliOption === DeliOption.PICK_UP
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <BuildingStorefrontIcon className="w-6 h-6" />
                  <span className="font-semibold">Tự lấy</span>
                </div>
                <p className="text-sm text-gray-600">
                  Đến cửa hàng lấy hàng • Miễn phí
                </p>
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedToppings.map(t => t.id).join(',')}`}
                className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.displayName}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">
                      {item.product.displayName}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Size: <span className="font-medium">{item.selectedSize}</span></p>
                      {item.selectedToppings.length > 0 && (
                        <p>
                          Topping: <span className="font-medium">
                            {item.selectedToppings.map(t => t.name).join(', ')}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-lg font-semibold text-primary">
                        {priceWithSign(item.totalPrice)}
                      </div>
                      <div className="flex items-center gap-3">
                        <CounterInputSm
                          value={item.quantity}
                          onChange={(value) => updateQuantity(index, value)}
                        />
                        <button
                          onClick={() => removeFromCart(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <Title3 className="mb-4">Tóm tắt đơn hàng</Title3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({itemCount} sản phẩm)</span>
                  <span>{priceWithSign(subTotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Phí giao hàng</span>
                  <span>{deliOption === DeliOption.DELIVER ? priceWithSign(deliFee) : 'Miễn phí'}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>Tổng cộng</span>
                  <span>{priceWithSign(totalPayment)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <ButtonFilled
                  onClick={handleNext}
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
                </ButtonFilled>

                <ButtonOutline
                  onClick={handleContinueShopping}
                  className="w-full"
                >
                  Tiếp tục mua sắm
                </ButtonOutline>
              </div>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>🔒</span>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
