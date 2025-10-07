import PriceRow from '@/components/shared/PriceRow';
import Title6 from '@/components/shared/typo/Title6';
import { OrderItem } from '@/types';
import { priceWithSign } from '@/utils/helper';

interface OrderSummaryProps {
  orderItems: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  voucherDiscount: number;
  totalPayment: number;
}

export default function OrderSummary({
  orderItems,
  subtotal,
  deliveryFee,
  voucherDiscount,
  totalPayment
}: OrderSummaryProps) {
  return (
    <div>
      <Title6>Tóm tắt đơn hàng</Title6>
      <div className="space-y-2 mt-2">
        {orderItems?.map((item, index) => (
          <div
            key={`${item.productId}-${index}`}
            className="flex items-center justify-between text-sm font-normal text-neutral-800"
          >
            <div className="flex-1">
              <div className="font-medium">{item.productName}</div>
              <div className="text-xs text-gray-500">
                Size: {item.size}
                {item.toppings.length > 0 && (
                  <span> | Topping: {item.toppings.map(t => t.name).join(', ')}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{priceWithSign(item.totalPrice)}</div>
              <div className="text-xs text-gray-500">
                {priceWithSign(item.unitPrice)} x {item.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr className="my-3" />
      <PriceRow lable="Tạm tính" amount={subtotal} />
      <PriceRow lable="Phí giao hàng" amount={deliveryFee} />
      {voucherDiscount > 0 && (
        <PriceRow lable="Giảm giá voucher" amount={-voucherDiscount} />
      )}
      <hr className="my-3" />
      <PriceRow lable="Tổng thanh toán" amount={totalPayment} />
    </div>
  );
}
