import React, { useState } from 'react';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useKiosk } from '@/hooks/context/KioskContext';
import { KioskMode } from '@/types';
import { 
  ArrowLeftIcon,
  CreditCardIcon,
  BanknotesIcon,
  QrCodeIcon,
  PrinterIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { priceWithSign } from '@/utils/helper';

export default function CheckoutPage() {
  const { items, subTotal, totalPayment, clearCart } = useShoppingCart();
  const { setMode } = useKiosk();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qr'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const tax = 0.05; // 5% tax
  const taxAmount = subTotal * tax;
  const total = totalPayment;

  const handleBackToOrder = () => {
    setMode(KioskMode.ORDER);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      
      // Clear cart after successful payment
      setTimeout(() => {
        clearCart();
        setMode(KioskMode.ORDER);
      }, 3000);
    }, 2000);
  };

  const handlePrintReceipt = () => {
    // Simulate receipt printing
    console.log('Printing receipt...');
  };

  if (isCompleted) {
    return (
      <div className="h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Thanh toán thành công!</h2>
          <p className="text-gray-600 mb-6">Cảm ơn bạn đã sử dụng dịch vụ</p>
          <div className="text-sm text-gray-500">
            Tự động quay lại trang order trong 3 giây...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Side - Order Summary */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToOrder}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
            </div>
            <button
              onClick={handlePrintReceipt}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <PrinterIcon className="w-5 h-5" />
              <span>In hóa đơn</span>
            </button>
          </div>
        </div>

        {/* Order Items */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-lg overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{item.product.displayName}</h3>
                    <p className="text-gray-600">{item.product.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{item.quantity}x</div>
                    <div className="text-lg font-bold text-orange-500">
                      {priceWithSign(item.totalPrice)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt thanh toán</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-semibold">{priceWithSign(subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thuế (5%):</span>
                <span className="font-semibold">{priceWithSign(taxAmount)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-orange-500">{priceWithSign(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Payment Methods */}
      <div className="w-96 bg-gray-50 flex flex-col">
        {/* Payment Methods */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Phương thức thanh toán</h2>
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'cash'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BanknotesIcon className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Tiền mặt</div>
                  <div className="text-sm text-gray-600">Thanh toán bằng tiền mặt</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'card'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CreditCardIcon className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Thẻ</div>
                  <div className="text-sm text-gray-600">Visa, Mastercard</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('qr')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'qr'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <QrCodeIcon className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">QR Code</div>
                  <div className="text-sm text-gray-600">MoMo, ZaloPay, ViettelPay</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Actions */}
        <div className="flex-1 p-6 flex flex-col justify-end">
          <div className="space-y-4">
            {/* Cash Amount Input (only for cash payment) */}
            {paymentMethod === 'cash' && (
              <div className="bg-white rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền khách đưa
                </label>
                <input
                  type="number"
                  placeholder="Nhập số tiền..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="mt-2 text-sm text-gray-600">
                  Tiền thừa: <span className="font-semibold text-green-600">0 ₫</span>
                </div>
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing || items.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                isProcessing || items.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                `Thanh toán ${priceWithSign(total)}`
              )}
            </button>

            {/* Back Button */}
            <button
              onClick={handleBackToOrder}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Quay lại đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
