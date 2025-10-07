import { useEffect, useState } from 'react';
import { monthlyStats } from '@/data/adminStats';
import LineChart from '@/components/shared/charts/LineChart';
import PieChart from '@/components/shared/charts/PieChart';
import BarChart from '@/components/shared/charts/BarChart';
import Title1 from '@/components/shared/typo/Title1';
import { lsGet, lsSet } from '@/utils/localStorageHelper';

type Stat = { month: string; revenue: number; orders: number };

const LS_KEY = 'admin_monthly_stats';

/**
 * RevenueDashboardPage: Trang thống kê doanh thu với biểu đồ tương tác
 * Bao gồm line chart doanh thu, pie chart sản phẩm bán chạy, bar chart đơn hàng
 */
export default function RevenueDashboardPage() {
    const [stats, setStats] = useState<Stat[]>([]);

    useEffect(() => {
        setStats(lsGet<Stat[]>(LS_KEY, monthlyStats));
    }, []);

    useEffect(() => { lsSet(LS_KEY, stats); }, [stats]);

    // Mock data for charts
    const revenueData = stats.map(stat => ({
        month: stat.month,
        revenue: stat.revenue,
        orders: stat.orders
    }));

    const topProductsData = [
        { label: 'Americano', value: 125, color: '#EF4444' },
        { label: 'Latte', value: 98, color: '#10B981' },
        { label: 'Mocha', value: 76, color: '#3B82F6' },
        { label: 'Matcha', value: 54, color: '#F59E0B' },
        { label: 'Cappuccino', value: 43, color: '#8B5CF6' },
    ];

    const orderStatusData = [
        { label: 'Hoàn thành', value: 156, color: '#10B981' },
        { label: 'Đang xử lý', value: 23, color: '#F59E0B' },
        { label: 'Đang giao', value: 12, color: '#3B82F6' },
        { label: 'Đã hủy', value: 8, color: '#EF4444' },
    ];

    const totalRevenue = stats.reduce((sum, stat) => sum + stat.revenue, 0);
    const totalOrders = stats.reduce((sum, stat) => sum + stat.orders, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <Title1 className="text-gray-800 mb-2">Thống kê doanh thu</Title1>
                <p className="text-gray-600">
                    Phân tích chi tiết về doanh thu và hiệu suất kinh doanh
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Tổng doanh thu</p>
                            <p className="text-3xl font-bold">{totalRevenue.toLocaleString('vi-VN')} VND</p>
                        </div>
                        <div className="text-4xl opacity-20">💰</div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Tổng đơn hàng</p>
                            <p className="text-3xl font-bold">{totalOrders.toLocaleString('vi-VN')}</p>
                        </div>
                        <div className="text-4xl opacity-20">📦</div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Giá trị đơn hàng TB</p>
                            <p className="text-3xl font-bold">{Math.round(averageOrderValue).toLocaleString('vi-VN')} VND</p>
                        </div>
                        <div className="text-4xl opacity-20">📊</div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue Line Chart */}
                <div className="lg:col-span-2">
                    <LineChart 
                        data={revenueData} 
                        title="Doanh thu theo tháng" 
                        height={350}
                    />
                </div>

                {/* Top Products Pie Chart */}
                <div>
                    <PieChart 
                        data={topProductsData} 
                        title="Sản phẩm bán chạy" 
                        size={280}
                    />
                </div>

                {/* Order Status Bar Chart */}
                <div>
                    <BarChart 
                        data={orderStatusData} 
                        title="Đơn hàng theo trạng thái" 
                        height={350}
                    />
                </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê chi tiết</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tháng có doanh thu cao nhất:</span>
                            <span className="font-semibold">
                                {stats.length > 0 ? stats.reduce((max, stat) => 
                                    stat.revenue > max.revenue ? stat : max
                                ).month : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tăng trưởng so với tháng trước:</span>
                            <span className="font-semibold text-green-600">+12.5%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tỷ lệ đơn hàng hoàn thành:</span>
                            <span className="font-semibold text-green-600">94.2%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Dự báo</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Doanh thu dự kiến tháng tới:</span>
                            <span className="font-semibold">
                                {Math.round(totalRevenue * 1.15).toLocaleString('vi-VN')} VND
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Đơn hàng dự kiến:</span>
                            <span className="font-semibold">
                                {Math.round(totalOrders * 1.08).toLocaleString('vi-VN')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Xu hướng:</span>
                            <span className="font-semibold text-green-600">Tăng trưởng</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}