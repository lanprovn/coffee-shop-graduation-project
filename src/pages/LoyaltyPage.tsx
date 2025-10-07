import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Title1 from '@/components/shared/typo/Title1';
import Title2 from '@/components/shared/typo/Title2';
import Title3 from '@/components/shared/typo/Title3';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';
import { 
  GiftIcon, 
  StarIcon, 
  TrophyIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

/**
 * LoyaltyPage: Trang chương trình khách hàng thân thiết
 * Bao gồm điểm tích lũy, cấp độ thành viên, và phần thưởng
 */
export default function LoyaltyPage() {
  const { user } = useAuth();
  const [loyaltyData, setLoyaltyData] = useState({
    currentLevel: 'Gold',
    currentPoints: 1250,
    nextLevelPoints: 2000,
    totalPointsEarned: 3500,
    totalPointsRedeemed: 2250,
    availableRewards: [],
    recentActivities: []
  });

  useEffect(() => {
    // Mock loyalty data
    setLoyaltyData({
      currentLevel: 'Gold',
      currentPoints: 1250,
      nextLevelPoints: 2000,
      totalPointsEarned: 3500,
      totalPointsRedeemed: 2250,
      availableRewards: [
        {
          id: 1,
          name: 'Giảm giá 10%',
          description: 'Áp dụng cho đơn hàng tiếp theo',
          pointsRequired: 100,
          type: 'discount',
          available: true
        },
        {
          id: 2,
          name: 'Cà phê miễn phí',
          description: '1 ly cà phê đen size M',
          pointsRequired: 200,
          type: 'free_item',
          available: true
        },
        {
          id: 3,
          name: 'Giảm giá 20%',
          description: 'Áp dụng cho đơn hàng từ 100k',
          pointsRequired: 500,
          type: 'discount',
          available: true
        },
        {
          id: 4,
          name: 'Bánh ngọt miễn phí',
          description: '1 bánh ngọt bất kỳ',
          pointsRequired: 300,
          type: 'free_item',
          available: false
        }
      ],
      recentActivities: [
        {
          id: 1,
          type: 'earned',
          description: 'Tích điểm từ đơn hàng #12345',
          points: 50,
          date: '2024-01-15',
          status: 'completed'
        },
        {
          id: 2,
          type: 'redeemed',
          description: 'Đổi giảm giá 10%',
          points: -100,
          date: '2024-01-10',
          status: 'completed'
        },
        {
          id: 3,
          type: 'earned',
          description: 'Tích điểm từ đơn hàng #12344',
          points: 75,
          date: '2024-01-08',
          status: 'completed'
        }
      ]
    });
  }, []);

  const getLevelInfo = (level: string) => {
    const levels = {
      'Bronze': { color: 'bg-amber-500', benefits: ['Giảm giá 5%', 'Tích điểm 1x'] },
      'Silver': { color: 'bg-gray-400', benefits: ['Giảm giá 7%', 'Tích điểm 1.2x', 'Ưu tiên giao hàng'] },
      'Gold': { color: 'bg-yellow-500', benefits: ['Giảm giá 10%', 'Tích điểm 1.5x', 'Ưu tiên giao hàng', 'Quà sinh nhật'] },
      'Diamond': { color: 'bg-blue-500', benefits: ['Giảm giá 15%', 'Tích điểm 2x', 'Ưu tiên giao hàng', 'Quà sinh nhật', 'Tư vấn riêng'] }
    };
    return levels[level] || levels['Bronze'];
  };

  const progressPercentage = (loyaltyData.currentPoints / loyaltyData.nextLevelPoints) * 100;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Title1 className="text-gray-800 mb-4">Cần đăng nhập</Title1>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem chương trình khách hàng thân thiết</p>
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
          <Title1 className="text-gray-800 mb-2">Chương trình khách hàng thân thiết</Title1>
          <p className="text-gray-600">Tích điểm và nhận nhiều phần thưởng hấp dẫn</p>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 ${getLevelInfo(loyaltyData.currentLevel).color} rounded-full flex items-center justify-center`}>
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <Title2 className="text-gray-800">{loyaltyData.currentLevel} Member</Title2>
                <p className="text-gray-600">{loyaltyData.currentPoints} điểm hiện tại</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Điểm đến cấp tiếp theo</p>
              <p className="text-lg font-semibold text-gray-800">
                {loyaltyData.nextLevelPoints - loyaltyData.currentPoints} điểm
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tiến độ</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${getLevelInfo(loyaltyData.currentLevel).color}`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getLevelInfo(loyaltyData.currentLevel).benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Points Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <SparklesIcon className="w-6 h-6 text-green-600" />
            </div>
            <Title3 className="text-gray-800 mb-1">Điểm đã tích</Title3>
            <p className="text-2xl font-bold text-green-600">{loyaltyData.totalPointsEarned}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <GiftIcon className="w-6 h-6 text-blue-600" />
            </div>
            <Title3 className="text-gray-800 mb-1">Điểm đã đổi</Title3>
            <p className="text-2xl font-bold text-blue-600">{loyaltyData.totalPointsRedeemed}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <StarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <Title3 className="text-gray-800 mb-1">Điểm hiện có</Title3>
            <p className="text-2xl font-bold text-purple-600">{loyaltyData.currentPoints}</p>
          </div>
        </div>

        {/* Available Rewards */}
        <div className="mb-8">
          <Title2 className="text-gray-800 mb-6">Phần thưởng có sẵn</Title2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loyaltyData.availableRewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      reward.type === 'discount' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {reward.type === 'discount' ? (
                        <GiftIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <StarIcon className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <Title3 className="text-gray-800">{reward.name}</Title3>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Cần</p>
                    <p className="text-lg font-semibold text-primary">{reward.pointsRequired} điểm</p>
                  </div>
                </div>
                
                <ButtonFilled 
                  disabled={!reward.available || loyaltyData.currentPoints < reward.pointsRequired}
                  className="w-full"
                >
                  {!reward.available ? 'Hết hàng' : 
                   loyaltyData.currentPoints < reward.pointsRequired ? 'Không đủ điểm' : 
                   'Đổi ngay'}
                </ButtonFilled>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <Title2 className="text-gray-800 mb-6">Hoạt động gần đây</Title2>
          <div className="space-y-4">
            {loyaltyData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {activity.type === 'earned' ? (
                      <SparklesIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <GiftIcon className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    activity.points > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {activity.points > 0 ? '+' : ''}{activity.points}
                  </p>
                  <p className="text-xs text-gray-500">điểm</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
