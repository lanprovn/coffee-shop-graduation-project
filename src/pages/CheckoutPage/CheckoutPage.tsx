import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { priceWithSign } from '@/utils/helper';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';
import Title1 from '@/components/shared/typo/Title1';
import Title3 from '@/components/shared/typo/Title3';
import { PaymentMethod, Voucher, DeliOption } from '@/types';
import { useShoppingCart } from '@/hooks/useShoppingCart';
// import { useApi } from '@/hooks/useApi'; // Removed API dependency
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/hooks/useAuth';
import { useUserAddress } from '@/hooks/useUserAddress';
import {
    CreditCardIcon,
    BanknotesIcon,
    TruckIcon,
    BuildingStorefrontIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

/**
 * CheckoutPage: Trang thanh toán với UX được cải thiện
 * Bao gồm địa chỉ giao hàng, phương thức thanh toán, voucher, và xác nhận đơn hàng
 */
export default function CheckoutPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { address } = useUserAddress();
    const {
        items,
        subTotal,
        deliFee,
        totalPayment,
        deliOption,
        clearCart
    } = useShoppingCart();
    // Mock API functions - no real API calls
    const validateVoucher = async (code: string, orderAmount: number) => {
        // Mock voucher validation
        const mockVouchers: Voucher[] = [
            {
                id: 'voucher_1',
                code: 'WELCOME10',
                name: 'Chào mừng khách hàng mới',
                description: 'Giảm giá cho khách hàng mới',
                discountType: 'percentage',
                discountValue: 10,
                minOrderAmount: 50000,
                isActive: true
            },
            {
                id: 'voucher_2',
                code: 'SAVE20',
                name: 'Tiết kiệm lớn',
                description: 'Giảm giá cố định cho đơn hàng lớn',
                discountType: 'fixed',
                discountValue: 20000,
                minOrderAmount: 100000,
                isActive: true
            }
        ];

        const voucher = mockVouchers.find(v => v.code === code);
        if (!voucher) {
            return { success: false, message: 'Mã voucher không hợp lệ' };
        }

        if (orderAmount < voucher.minOrderAmount) {
            return { success: false, message: `Đơn hàng tối thiểu ${voucher.minOrderAmount.toLocaleString('vi-VN')}đ` };
        }

        return { success: true, data: voucher };
    };

    const createOrder = async (orderData: any) => {
        // Mock order creation
        const mockOrder = {
            id: `order_${Date.now()}`,
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Save to localStorage for demo
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(mockOrder);
        localStorage.setItem('orders', JSON.stringify(existingOrders));

        return { success: true, data: mockOrder, message: 'Đặt hàng thành công' };
    };
    const { notifyOrderSuccess } = useNotification();

    // Redirect if no items
    useEffect(() => {
        if (!state && items.length === 0) {
            navigate('/cart');
        }
    }, [state, navigate, items.length]);

    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
    const [voucherCode, setVoucherCode] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
    const [voucherError, setVoucherError] = useState('');
    const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate final total with voucher
    const voucherDiscount = appliedVoucher ? (() => {
        if (appliedVoucher.discountType === 'percentage') {
            const discount = (subTotal * appliedVoucher.discountValue) / 100;
            return appliedVoucher.maxDiscountAmount ? Math.min(discount, appliedVoucher.maxDiscountAmount) : discount;
        } else {
            return appliedVoucher.discountValue;
        }
    })() : 0;

    const finalTotal = Math.max(0, totalPayment - voucherDiscount);

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return;

        setIsApplyingVoucher(true);
        setVoucherError('');

        try {
            const response = await validateVoucher(voucherCode, subTotal);
            if (response.success && response.data) {
                setAppliedVoucher(response.data);
                setVoucherError('');
            } else {
                setVoucherError(response.message || 'Mã voucher không hợp lệ hoặc đã hết hạn');
            }
        } catch (error) {
            setVoucherError('Có lỗi xảy ra khi áp dụng voucher');
        } finally {
            setIsApplyingVoucher(false);
        }
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        setVoucherCode('');
        setVoucherError('');
    };

    const handleOrderNow = async () => {
        if (!user) {
            navigate('/login', { state: { redirectTo: '/checkout' } });
            return;
        }

        setIsProcessing(true);

        try {
            const orderData = {
                customer: {
                    id: user.id,
                    name: user.name,
                    address: address?.fullAddress || 'Chưa cập nhật địa chỉ',
                    coordinates: address?.coordinates || { lat: 0, lng: 0 }
                },
                items: items.map(item => ({
                    productId: item.product.id,
                    productName: item.product.displayName,
                    quantity: item.quantity,
                    size: item.selectedSize,
                    toppings: item.selectedToppings,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice
                })),
                deliOption,
                paymentMethod: selectedMethod,
                subtotal: subTotal,
                deliveryFee: deliOption === DeliOption.DELIVER ? deliFee : 0,
                voucherDiscount,
                totalPayment: finalTotal,
                voucherCode: appliedVoucher?.code || undefined
            };

            const response = await createOrder(orderData);

            if (response.success) {
                clearCart();
                notifyOrderSuccess(response.data);
                navigate('/orders', { state: { orderId: response.data.id } });
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra khi tạo đơn hàng');
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
        } finally {
            setIsProcessing(false);
        }
    };

    const paymentMethods = [
        {
            value: PaymentMethod.CASH,
            label: 'Thanh toán khi nhận hàng',
            icon: BanknotesIcon,
            description: 'Thanh toán bằng tiền mặt khi nhận hàng'
        },
        {
            value: PaymentMethod.KBZ_PAY,
            label: 'KBZ Pay',
            icon: CreditCardIcon,
            description: 'Thanh toán qua ứng dụng KBZ Pay'
        },
        {
            value: PaymentMethod.WAVE_MONEY,
            label: 'Wave Money',
            icon: CreditCardIcon,
            description: 'Thanh toán qua ứng dụng Wave Money'
        }
    ];

    if (items.length === 0) {
        return (
            <div className="max-w-screen-lg mx-auto p-4 mt-20 bg-gray-50 min-h-screen">
                <div className="text-center py-16">
                    <div className="text-8xl mb-6">🛒</div>
                    <Title1 className="text-gray-800 mb-4">Giỏ hàng trống</Title1>
                    <p className="text-gray-600 mb-8">
                        Bạn cần có sản phẩm trong giỏ hàng để thanh toán
                    </p>
                    <ButtonFilled onClick={() => navigate('/products')}>
                        Khám phá sản phẩm
                    </ButtonFilled>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-screen-lg mx-auto p-4 mt-20 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <Title1 className="text-gray-800 mb-2">Thanh toán</Title1>
                <p className="text-gray-600">
                    Hoàn tất đơn hàng của bạn một cách an toàn và nhanh chóng
                </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                {step}
                            </div>
                            <span className={`ml-2 text-sm ${step === 1 ? 'text-primary font-medium' : 'text-gray-500'
                                }`}>
                                {step === 1 ? 'Thông tin' : step === 2 ? 'Thanh toán' : 'Xác nhận'}
                            </span>
                            {step < 3 && (
                                <div className={`w-8 h-0.5 ml-4 ${step === 1 ? 'bg-primary' : 'bg-gray-200'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Delivery Information */}
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <Title3 className="mb-4">Thông tin giao hàng</Title3>

                        <div className="mb-4">
                            <div className="flex items-center gap-3 mb-2">
                                {deliOption === DeliOption.DELIVER ? (
                                    <TruckIcon className="w-6 h-6 text-primary" />
                                ) : (
                                    <BuildingStorefrontIcon className="w-6 h-6 text-primary" />
                                )}
                                <span className="font-semibold">
                                    {deliOption === DeliOption.DELIVER ? 'Giao hàng tận nơi' : 'Tự lấy tại cửa hàng'}
                                </span>
                            </div>

                            {deliOption === DeliOption.DELIVER ? (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    {address ? (
                                        <div>
                                            <p className="font-medium text-gray-800">{address.fullAddress}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                📍 {address.coordinates.lat.toFixed(4)}, {address.coordinates.lng.toFixed(4)}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-600 mb-2">Chưa có địa chỉ giao hàng</p>
                                            <ButtonOutline onClick={() => navigate('/profile')}>
                                                Thêm địa chỉ
                                            </ButtonOutline>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-600">
                                        Bạn sẽ đến cửa hàng để lấy hàng. Thời gian chuẩn bị: 15-20 phút.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <Title3 className="mb-4">Phương thức thanh toán</Title3>
                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method.value}
                                    onClick={() => setSelectedMethod(method.value)}
                                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${selectedMethod === method.value
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <method.icon className="w-6 h-6" />
                                        <div className="text-left">
                                            <div className="font-semibold">{method.label}</div>
                                            <div className="text-sm text-gray-600">{method.description}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Voucher */}
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <Title3 className="mb-4">Mã giảm giá</Title3>

                        {appliedVoucher ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="font-semibold text-green-800">{appliedVoucher.name}</p>
                                            <p className="text-sm text-green-600">
                                                Giảm {appliedVoucher.discountType === 'percentage'
                                                    ? `${appliedVoucher.discountValue}%`
                                                    : priceWithSign(appliedVoucher.discountValue)
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRemoveVoucher}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <XCircleIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    placeholder="Nhập mã giảm giá"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <ButtonFilled
                                    onClick={handleApplyVoucher}
                                    disabled={!voucherCode.trim() || isApplyingVoucher}
                                >
                                    {isApplyingVoucher ? 'Đang áp dụng...' : 'Áp dụng'}
                                </ButtonFilled>
                            </div>
                        )}

                        {voucherError && (
                            <p className="text-red-600 text-sm mt-2">{voucherError}</p>
                        )}
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="bg-white border rounded-2xl p-6 shadow-sm">
                            <Title3 className="mb-4">Tóm tắt đơn hàng</Title3>

                            {/* Order Items */}
                            <div className="space-y-3 mb-4">
                                {items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.displayName}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 text-sm truncate">
                                                {item.product.displayName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.selectedSize} • {item.quantity}x
                                            </p>
                                        </div>
                                        <div className="text-sm font-semibold text-primary">
                                            {priceWithSign(item.totalPrice)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-4" />

                            {/* Price Breakdown */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span>{priceWithSign(subTotal)}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Phí giao hàng</span>
                                    <span>{deliOption === DeliOption.DELIVER ? priceWithSign(deliFee) : 'Miễn phí'}</span>
                                </div>

                                {appliedVoucher && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá</span>
                                        <span>-{priceWithSign(voucherDiscount)}</span>
                                    </div>
                                )}

                                <hr className="my-3" />

                                <div className="flex justify-between text-xl font-bold text-primary">
                                    <span>Tổng cộng</span>
                                    <span>{priceWithSign(finalTotal)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 space-y-3">
                                <ButtonFilled
                                    onClick={handleOrderNow}
                                    className="w-full"
                                    disabled={isProcessing || (deliOption === DeliOption.DELIVER && !address)}
                                >
                                    {isProcessing ? 'Đang xử lý...' : 'Đặt hàng ngay'}
                                </ButtonFilled>

                                <ButtonOutline
                                    onClick={() => navigate('/cart')}
                                    className="w-full"
                                >
                                    Quay lại giỏ hàng
                                </ButtonOutline>
                            </div>

                            {/* Security Notice */}
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