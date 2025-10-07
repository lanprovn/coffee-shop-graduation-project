import { useEffect, useState } from 'react';
import { Order } from '@/types';
// import { useApi } from '@/hooks/useApi'; // Removed API dependency

export default function useOrders() {
  const [data, setData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Mock API function - no real API calls
  const getOrders = async () => {
    // Get orders from localStorage (mock data)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

    // If no orders, create some mock data
    if (orders.length === 0) {
      const mockOrders = [
        {
          id: 'order_1',
          customer: { id: 'user_1', name: 'John Doe', address: '123 Main St', coordinates: { lat: 16.785692464382592, lng: 96.17045650343823 } },
          items: [{ productId: 'hot-americano', productName: 'Americano', quantity: 2, size: 'M', toppings: [], unitPrice: 25000, totalPrice: 50000 }],
          deliOption: 'delivery',
          paymentMethod: 'cash',
          subtotal: 50000,
          deliveryFee: 2000,
          voucherDiscount: 0,
          totalPayment: 52000,
          status: 'delivered',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'order_2',
          customer: { id: 'user_2', name: 'Jane Smith', address: '456 Oak Ave', coordinates: { lat: 16.785692464382592, lng: 96.17045650343823 } },
          items: [{ productId: 'hot-latte', productName: 'Latte', quantity: 1, size: 'L', toppings: [], unitPrice: 30000, totalPrice: 30000 }],
          deliOption: 'pick-up',
          paymentMethod: 'kbz-pay',
          subtotal: 30000,
          deliveryFee: 0,
          voucherDiscount: 0,
          totalPayment: 30000,
          status: 'preparing',
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      localStorage.setItem('orders', JSON.stringify(mockOrders));
      return mockOrders;
    }

    return orders;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const orders = await getOrders();
      if (orders) {
        setData(orders);
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, [getOrders]);

  return { data, isLoading };
}
