/**
 * Advanced Analytics Dashboard - Frontend only
 * Thống kê và phân tích chi tiết cho admin
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  EyeIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const ANALYTICS_KEY = 'coffee-shop-analytics';

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  averageOrderValue: number;
  totalRevenue: number;
  totalOrders: number;
  popularProducts: Array<{
    id: string;
    name: string;
    views: number;
    orders: number;
    revenue: number;
  }>;
  userBehavior: {
    timeOnSite: number;
    bounceRate: number;
    pagesPerSession: number;
    returningVisitors: number;
  };
  salesData: Array<{
    date: string;
    revenue: number;
    orders: number;
    visitors: number;
  }>;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  trafficSources: {
    direct: number;
    search: number;
    social: number;
    referral: number;
  };
}

export function useAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock analytics data
  const generateMockData = useMemo((): AnalyticsData => {
    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 5000000) + 1000000,
        orders: Math.floor(Math.random() * 100) + 20,
        visitors: Math.floor(Math.random() * 500) + 100
      };
    }).reverse();

    return {
      pageViews: Math.floor(Math.random() * 50000) + 10000,
      uniqueVisitors: Math.floor(Math.random() * 20000) + 5000,
      conversionRate: Math.random() * 5 + 2, // 2-7%
      averageOrderValue: Math.floor(Math.random() * 100000) + 50000,
      totalRevenue: last30Days.reduce((sum, day) => sum + day.revenue, 0),
      totalOrders: last30Days.reduce((sum, day) => sum + day.orders, 0),
      popularProducts: [
        { id: '1', name: 'Americano', views: 1250, orders: 89, revenue: 2225000 },
        { id: '2', name: 'Latte', views: 1100, orders: 76, revenue: 1900000 },
        { id: '3', name: 'Mocha', views: 980, orders: 65, revenue: 1625000 },
        { id: '4', name: 'Cappuccino', views: 850, orders: 58, revenue: 1450000 },
        { id: '5', name: 'Matcha Latte', views: 720, orders: 45, revenue: 1125000 }
      ],
      userBehavior: {
        timeOnSite: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
        bounceRate: Math.random() * 30 + 20, // 20-50%
        pagesPerSession: Math.random() * 3 + 2, // 2-5 pages
        returningVisitors: Math.floor(Math.random() * 40) + 30 // 30-70%
      },
      salesData: last30Days,
      deviceStats: {
        mobile: Math.floor(Math.random() * 30) + 50, // 50-80%
        desktop: Math.floor(Math.random() * 20) + 15, // 15-35%
        tablet: Math.floor(Math.random() * 10) + 5 // 5-15%
      },
      trafficSources: {
        direct: Math.floor(Math.random() * 20) + 40, // 40-60%
        search: Math.floor(Math.random() * 15) + 20, // 20-35%
        social: Math.floor(Math.random() * 10) + 10, // 10-20%
        referral: Math.floor(Math.random() * 10) + 5 // 5-15%
      }
    };
  }, []);

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const saved = localStorage.getItem(ANALYTICS_KEY);
        if (saved) {
          setAnalyticsData(JSON.parse(saved));
        } else {
          setAnalyticsData(generateMockData);
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
        setAnalyticsData(generateMockData);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [generateMockData]);

  // Save analytics data
  useEffect(() => {
    if (analyticsData) {
      try {
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analyticsData));
      } catch (error) {
        console.error('Error saving analytics:', error);
      }
    }
  }, [analyticsData]);

  // Refresh analytics data
  const refreshAnalytics = () => {
    setAnalyticsData(generateMockData);
  };

  return {
    analyticsData,
    isLoading,
    refreshAnalytics
  };
}

/**
 * Analytics Dashboard Component
 */
export function AdvancedAnalyticsDashboard() {
  const { analyticsData, isLoading, refreshAnalytics } = useAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không có dữ liệu phân tích</p>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return num.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartBarIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
        </div>
        <button
          onClick={refreshAnalytics}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Làm mới dữ liệu
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng lượt xem</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.pageViews)}
              </p>
            </div>
            <EyeIcon className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            +12.5% so với tháng trước
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.uniqueVisitors)}
              </p>
            </div>
            <UsersIcon className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            +8.2% so với tháng trước
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.totalRevenue)}
              </p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            +15.3% so với tháng trước
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ chuyển đổi</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.conversionRate.toFixed(1)}%
              </p>
            </div>
            <ShoppingBagIcon className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2 flex items-center text-sm text-red-600">
            <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
            -2.1% so với tháng trước
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Doanh thu 30 ngày qua
          </h3>
          <div className="h-64 flex items-end justify-between gap-1">
            {analyticsData.salesData.slice(-7).map((day, index) => (
              <div key={day.date} className="flex flex-col items-center">
                <div
                  className="bg-primary rounded-t w-8 mb-2"
                  style={{
                    height: `${(day.revenue / Math.max(...analyticsData.salesData.map(d => d.revenue))) * 200}px`
                  }}
                ></div>
                <span className="text-xs text-gray-500">
                  {new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thiết bị truy cập
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Mobile</span>
              </div>
              <span className="text-sm font-medium">{analyticsData.deviceStats.mobile}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${analyticsData.deviceStats.mobile}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Desktop</span>
              </div>
              <span className="text-sm font-medium">{analyticsData.deviceStats.desktop}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${analyticsData.deviceStats.desktop}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Tablet</span>
              </div>
              <span className="text-sm font-medium">{analyticsData.deviceStats.tablet}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${analyticsData.deviceStats.tablet}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sản phẩm phổ biến
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Sản phẩm</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Lượt xem</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Đơn hàng</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.popularProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                  <td className="py-3 px-4 text-gray-600">{formatNumber(product.views)}</td>
                  <td className="py-3 px-4 text-gray-600">{product.orders}</td>
                  <td className="py-3 px-4 text-gray-600">{formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Behavior */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {Math.floor(analyticsData.userBehavior.timeOnSite / 60)}m {analyticsData.userBehavior.timeOnSite % 60}s
          </div>
          <p className="text-sm text-gray-600">Thời gian trung bình</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.userBehavior.bounceRate.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600">Tỷ lệ thoát</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.userBehavior.pagesPerSession.toFixed(1)}
          </div>
          <p className="text-sm text-gray-600">Trang/phiên</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.userBehavior.returningVisitors}%
          </div>
          <p className="text-sm text-gray-600">Khách quay lại</p>
        </div>
      </div>
    </div>
  );
}
