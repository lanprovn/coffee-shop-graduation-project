import { useEffect, useState } from 'react';
import { Order } from '@/types';
// import { useApi } from '@/hooks/useApi'; // Removed API dependency

export default function useOrder(id: string | undefined) {
  const [data, setData] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Mock API function - no real API calls
  const getOrderById = async (id: string) => {
    // Get orders from localStorage (mock data)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.find((order: Order) => order.id === id) || null;
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      setIsLoading(true);
      const order = await getOrderById(id);
      if (order) {
        setData(order);
      }
      setIsLoading(false);
    };

    fetchOrder();
  }, [id, getOrderById]);

  return { data, isLoading };
}
