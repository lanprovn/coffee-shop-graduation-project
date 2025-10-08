import { Order, OrderStatus } from '@/types';
import { priceWithSign } from '@/utils/helper';
import { Link } from 'react-router-dom';

interface OrderCardProps {
  order: Order;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
  case OrderStatus.Pending:
    return 'text-yellow-600 bg-yellow-50';
  case OrderStatus.Confirmed:
    return 'text-blue-600 bg-blue-50';
  case OrderStatus.Preparing:
    return 'text-orange-600 bg-orange-50';
  case OrderStatus.Ready:
    return 'text-green-600 bg-green-50';
  case OrderStatus.Delivered:
    return 'text-green-700 bg-green-100';
  case OrderStatus.Cancelled:
    return 'text-red-600 bg-red-50';
  default:
    return 'text-gray-600 bg-gray-50';
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
  case OrderStatus.Pending:
    return 'Chờ xác nhận';
  case OrderStatus.Confirmed:
    return 'Đã xác nhận';
  case OrderStatus.Preparing:
    return 'Đang chuẩn bị';
  case OrderStatus.Ready:
    return 'Sẵn sàng';
  case OrderStatus.Delivered:
    return 'Đã giao';
  case OrderStatus.Cancelled:
    return 'Đã hủy';
  default:
    return status;
  }
};

export default function OrderCard({ order }: OrderCardProps) {
  const orderItemsText = order?.items?.map((i) => `${i.quantity}x ${i.productName} (${i.size})`)?.join(', ');
  const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');

  return (
    <Link
      to={`/orders/${order.id}`}
      className="w-full flex gap-3 bg-white hover:bg-primary-50 p-3 rounded-lg border border-gray-100"
    >
      <div className="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-bold text-lg">☕</span>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 justify-between">
        <div className="flex justify-between gap-2 font-semibold">
          <h6 className="text-gray-800 line-clamp-1">{`#${order.id}`}</h6>
          <p className="text-primary">{priceWithSign(order.totalPayment)}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">
            {orderDate}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2">
          {orderItemsText}
        </p>
        {order.voucherCode && (
          <p className="text-green-600 text-xs">
            Voucher: {order.voucherCode}
          </p>
        )}
      </div>
    </Link>
  );
}
