import LabelValueRow from '@/components/shared/LabelValueRow';
import { DeliOption, Order, OrderStatus } from '@/types';

interface OrderInfosProps {
  order: Order;
}

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

export default function OrderInfos({ order }: OrderInfosProps) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');

  return (
    <div className="mt-4">
      <LabelValueRow lable="Mã đơn hàng" value={`#${order.id}`} />
      <LabelValueRow lable="Trạng thái" value={getStatusText(order.status)} />
      <LabelValueRow lable="Ngày đặt hàng" value={orderDate} />
      {order.deliOption === DeliOption.DELIVER ? (
        <LabelValueRow lable="Địa chỉ giao hàng" value={order.customer.address} />
      ) : (
        <LabelValueRow lable="Hình thức nhận hàng" value="Tự đến lấy" />
      )}
      {order.voucherCode && (
        <LabelValueRow lable="Mã voucher" value={order.voucherCode} />
      )}
      {order.notes && (
        <LabelValueRow lable="Ghi chú" value={order.notes} />
      )}
    </div>
  );
}
