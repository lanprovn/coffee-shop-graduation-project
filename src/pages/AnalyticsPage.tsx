import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Title1 from '@/components/shared/typo/Title1';
import Title2 from '@/components/shared/typo/Title2';
import Title3 from '@/components/shared/typo/Title3';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

/**
 * AnalyticsPage: Trang thống kê và phân tích cho user
 * Hiển thị lịch sử mua hàng, thống kê cá nhân, và insights
 */
export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30days');
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    favoriteCategory: '',
    totalReviews: 0,
    averageRating: 0,
    monthlyTrend: [],
    categoryBreakdown: []
  });

  useEffect(() => {
    // Mock analytics data
    setAnalytics({
      totalOrders: 24,
      totalSpent: 1250000,
      averageOrderValue: 52000,
      favoriteCategory: 'Coffee',
      totalReviews: 8,
      averageRating: 4.8,
      monthlyTrend: [
        { month: 'Tháng 1', orders: 5, spent: 250000 },
        { month: 'Tháng 2', orders: 8, spent: 400000 },
        { month: 'Tháng 3', orders: 11, spent: 600000 }
      ],
      categoryBreakdown: [
        { category: 'Coffee', count: 15, percentage: 62.5 },
        { category: 'Tea', count: 5, percentage: 20.8 },
        { category: 'Freeze', count: 3, percentage: 12.5 },
        { category: 'Cake', count: 1, percentage: 4.2 }
      ]
    });
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon, trend, trendValue }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="flex items-center space-x-2">
          {icon}
          {trend && (
            <div className={`flex items-center text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <TrendingUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDownIcon className="w-4 h-4 mr-1" />
              )}
              {trendValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Title1 className="text-gray-800 mb-4">Cần đăng nhập</Title1>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem thống kê cá nhân</p>
          <ButtonFilled onClick={() => window.location.href = '/login'}>
            Đăng nhập
          </ButtonFilled>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Title1 className="text-gray-800 mb-2">Thống kê cá nhân</Title1>
          <p className="text-gray-600">Phân tích hoạt động mua hàng và sở thích của bạn</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {[
              { value: '7days', label: '7 ngày' },
              { value: '30days', label: '30 ngày' },
              { value: '90days', label: '90 ngày' },
              { value: '1year', label: '1 năm' }
            ].map((range) => (
              <ButtonOutline
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={timeRange === range.value ? 'bg-primary text-white border-primary' : ''}
              >
                {range.label}
              </ButtonOutline>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng đơn hàng"
            value={analytics.totalOrders}
            icon={<ShoppingBagIcon className="w-8 h-8 text-blue-500" />}
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Tổng chi tiêu"
            value={formatCurrency(analytics.totalSpent)}
            icon={<CurrencyDollarIcon className="w-8 h-8 text-green-500" />}
            trend="up"
            trendValue="+8%"
          />
          <StatCard
            title="Giá trị TB/đơn"
            value={formatCurrency(analytics.averageOrderValue)}
            icon={<ChartBarIcon className="w-8 h-8 text-purple-500" />}
            trend="down"
            trendValue="-2%"
          />
          <StatCard
            title="Đánh giá TB"
            value={`${analytics.averageRating}/5`}
            icon={<StarIcon className="w-8 h-8 text-yellow-500" />}
            trend="up"
            trendValue="+0.2"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Monthly Trend */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <Title2 className="text-gray-800 mb-4">Xu hướng mua hàng</Title2>
            <div className="space-y-4">
              {analytics.monthlyTrend.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{item.orders} đơn</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.spent)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <Title2 className="text-gray-800 mb-4">Phân loại yêu thích</Title2>
            <div className="space-y-4">
              {analytics.categoryBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.count} đơn ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <Title2 className="text-gray-800 mb-4">Insights cá nhân</Title2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUpIcon className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div>
                <Title3 className="text-gray-800 mb-1">Xu hướng tích cực</Title3>
                <p className="text-gray-600 text-sm">
                  Bạn đã tăng tần suất mua hàng 12% so với tháng trước. Tiếp tục phát huy!
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <StarIcon className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div>
                <Title3 className="text-gray-800 mb-1">Khách hàng VIP</Title3>
                <p className="text-gray-600 text-sm">
                  Với {analytics.totalOrders} đơn hàng, bạn đang ở cấp độ Gold và được giảm giá 10%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
