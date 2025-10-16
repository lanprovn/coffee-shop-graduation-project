import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';
import { useNavigate } from 'react-router-dom';
import type { CustomerInfo, PaymentMethodType } from '@/types';

/**
 * CheckoutPage Component
 * Handles the checkout process including customer information and payment
 * Features:
 * - Order summary display
 * - Customer information form
 * - Payment method selection
 * - Order completion and navigation
 */
const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    table: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cash');

  /**
   * Handle input changes for customer information form
   * @param e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle payment method selection
   * @param method - Selected payment method
   */
  const handlePaymentMethodChange = (method: PaymentMethodType): void => {
    setPaymentMethod(method);
  };

  /**
   * Handle order completion
   * Processes payment and navigates to success page
   */
  const handleCompleteOrder = (): void => {
    // Mock order completion
    const paymentMethods: Record<PaymentMethodType, string> = {
      'cash': 'Tiền mặt',
      'card': 'Thẻ ngân hàng',
      'qr': 'Quét mã QR'
    };
    
    alert(`Thanh toán ${paymentMethods[paymentMethod]} thành công!`);
    clearCart();
    navigate('/pos');
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Đơn hàng</h2>
          
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">🛒</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-3">
                Giỏ hàng trống
              </h3>
              <p className="text-gray-500">
                Vui lòng thêm sản phẩm vào giỏ hàng
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <span className="text-lg font-semibold text-orange-500">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Số lượng: {item.quantity}
                  </div>
                  {item.selectedSize && (
                    <div className="text-xs text-gray-600 mb-1">
                      Size: {item.selectedSize.name}
                      {item.selectedSize.extraPrice > 0 && ` (+${formatPrice(item.selectedSize.extraPrice)})`}
                    </div>
                  )}
                  {item.selectedToppings.length > 0 && (
                    <div className="text-xs text-gray-600 mb-1">
                      Topping: {item.selectedToppings.map(t => 
                        `${t.name}${t.extraPrice > 0 ? ` (+${formatPrice(t.extraPrice)})` : ''}`
                      ).join(', ')}
                    </div>
                  )}
                  {item.note && (
                    <div className="text-xs text-gray-600">
                      Ghi chú: {item.note}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">Tạm tính:</span>
                  <span className="font-semibold text-gray-800">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Phí dịch vụ:</span>
                  <span className="text-gray-600">0₫</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">VAT:</span>
                  <span className="text-gray-600">0₫</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                  <span className="text-xl font-bold text-orange-500">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Thông tin khách hàng</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-800">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="table" className="block text-sm font-semibold text-gray-800">
                  Số bàn
                </label>
                <input
                  type="text"
                  id="table"
                  name="table"
                  value={customerInfo.table}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Nhập số bàn"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-800">
                  Ghi chú đặc biệt
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={customerInfo.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                  rows={3}
                  placeholder="Ghi chú đặc biệt cho đơn hàng"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Phương thức thanh toán</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => handlePaymentMethodChange('cash')}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  paymentMethod === 'cash'
                    ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-sm'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">💵</div>
                  <div className="font-semibold">Tiền mặt</div>
                </div>
              </button>
              
              <button
                onClick={() => handlePaymentMethodChange('card')}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-sm'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">💳</div>
                  <div className="font-semibold">Thẻ</div>
                </div>
              </button>
              
              <button
                onClick={() => handlePaymentMethodChange('qr')}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  paymentMethod === 'qr'
                    ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-sm'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">📱</div>
                  <div className="font-semibold">QR Code</div>
                </div>
              </button>
            </div>
          </div>

          {/* Complete Order Button */}
          <div className="text-center">
            <button
              onClick={handleCompleteOrder}
              disabled={!customerInfo.name || !customerInfo.phone || items.length === 0}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mx-auto"
            >
              <span>✓</span>
              <span>Hoàn tất đơn hàng</span>
              <span className="opacity-80">({formatPrice(totalPrice)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;