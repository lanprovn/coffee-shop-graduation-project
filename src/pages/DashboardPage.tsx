import { useState, useEffect } from 'react';
import { DashboardStats } from '@/types';
// import { useApi } from '@/hooks/useApi'; // Removed API dependency
import Title1 from '@/components/shared/typo/Title1';
import Title3 from '@/components/shared/typo/Title3';
import { priceWithSign } from '@/utils/helper';

/**
 * Trang dashboard admin với thống kê
 * Hiển thị doanh thu, đơn hàng, khách hàng và biểu đồ
 */
export default function DashboardPage() {
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const orders = await getOrders();

        // Tính toán thống kê từ orders
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPayment, 0);
        const totalOrders = orders.length;
        const totalCustomers = new Set(orders.map(order => order.customer.id)).size;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Revenue by month (last 6 months)
        const revenueByMonth = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const month = date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });

          const monthOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === date.getMonth() &&
              orderDate.getFullYear() === date.getFullYear();
          });

          const monthRevenue = monthOrders.reduce((sum, order) => sum + order.totalPayment, 0);
          revenueByMonth.push({ month, revenue: monthRevenue });
        }

        // Orders by status
        const ordersByStatus = [
          { status: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
          { status: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length },
          { status: 'Preparing', count: orders.filter(o => o.status === 'Preparing').length },
          { status: 'Ready', count: orders.filter(o => o.status === 'Ready').length },
          { status: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
          { status: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length },
        ];

        // Top products (mock data)
        const topProducts = [
          { productId: 'hot-americano', productName: 'Americano', sales: 45 },
          { productId: 'hot-latte', productName: 'Latte', sales: 38 },
          { productId: 'iced-mocha', productName: 'Iced Mocha', sales: 32 },
          { productId: 'hot-cappuccino', productName: 'Cappuccino', sales: 28 },
          { productId: 'iced-latte', productName: 'Iced Latte', sales: 25 },
        ];

        setStats({
          totalRevenue,
          totalOrders,
          totalCustomers,
          averageOrderValue,
          revenueByMonth,
          ordersByStatus,
          topProducts,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [getOrders]);

  if (loading) {
    return (
      <div className="max-w-screen-lg mx-auto p-4 mt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-screen-lg mx-auto p-4 mt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Không có dữ liệu</h1>
          <p className="text-gray-500">Chưa có dữ liệu thống kê để hiển thị.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4 mt-20">
      <Title1>Dashboard</Title1>
      <p className="text-gray-600 mb-8">
        Tổng quan về hoạt động kinh doanh của cửa hàng
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {priceWithSign(stats.totalRevenue)}
              </p>
            </div>
            <div className="text-3xl text-green-500">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="text-3xl text-blue-500">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="text-3xl text-purple-500">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Giá trị đơn TB</p>
              <p className="text-2xl font-bold text-gray-900">
                {priceWithSign(stats.averageOrderValue)}
              </p>
            </div>
            <div className="text-3xl text-orange-500">📊</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <Title3>Doanh thu theo tháng</Title3>
          <div className="mt-4 space-y-3">
            {stats.revenueByMonth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(item.revenue / Math.max(...stats.revenueByMonth.map(r => r.revenue))) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {priceWithSign(item.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <Title3>Đơn hàng theo trạng thái</Title3>
          <div className="mt-4 space-y-3">
            {stats.ordersByStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.status}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(item.count / Math.max(...stats.ordersByStatus.map(o => o.count))) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <Title3>Sản phẩm bán chạy</Title3>
          <div className="mt-4 space-y-3">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{product.productName}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(product.sales / Math.max(...stats.topProducts.map(p => p.sales))) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{product.sales}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <Title3>Thao tác nhanh</Title3>
          <div className="mt-4 space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📊</div>
                <div>
                  <p className="font-medium text-gray-800">Xem báo cáo chi tiết</p>
                  <p className="text-sm text-gray-500">Xuất báo cáo doanh thu</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎫</div>
                <div>
                  <p className="font-medium text-gray-800">Quản lý voucher</p>
                  <p className="text-sm text-gray-500">Tạo và quản lý mã giảm giá</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="text-2xl">👥</div>
                <div>
                  <p className="font-medium text-gray-800">Quản lý khách hàng</p>
                  <p className="text-sm text-gray-500">Xem danh sách khách hàng</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
