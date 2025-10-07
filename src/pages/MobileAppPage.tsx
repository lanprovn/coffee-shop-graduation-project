import { useState } from 'react';
import Title1 from '@/components/shared/typo/Title1';
import Title2 from '@/components/shared/typo/Title2';
import Title3 from '@/components/shared/typo/Title3';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';
import { 
  DevicePhoneMobileIcon,
  QrCodeIcon,
  CheckCircleIcon,
  SparklesIcon,
  ClockIcon,
  GiftIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

/**
 * MobileAppPage: Trang tải ứng dụng mobile
 * Bao gồm QR code, features, và download links
 */
export default function MobileAppPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android'>('ios');

  const features = [
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: "Đặt hàng nhanh chóng",
      description: "Đặt cà phê yêu thích chỉ với vài thao tác"
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: "Theo dõi đơn hàng",
      description: "Xem trạng thái đơn hàng real-time"
    },
    {
      icon: <GiftIcon className="w-6 h-6" />,
      title: "Tích điểm & đổi quà",
      description: "Tích điểm mỗi lần mua và đổi nhiều phần thưởng"
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "Thanh toán an toàn",
      description: "Hỗ trợ nhiều phương thức thanh toán bảo mật"
    }
  ];

  const appStats = [
    { number: "50K+", label: "Downloads" },
    { number: "4.8", label: "Rating" },
    { number: "99%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Title1 className="text-gray-800 mb-4">Tải ứng dụng Coffee Shop</Title1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Trải nghiệm mua sắm tiện lợi hơn với ứng dụng mobile của chúng tôi. 
            Đặt hàng nhanh chóng, tích điểm và nhận nhiều ưu đãi độc quyền.
          </p>
          
          {/* App Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
            {appStats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">{stat.number}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          
          {/* Left Side - App Preview */}
          <div className="text-center lg:text-left">
            <div className="relative mb-8">
              {/* Mock Phone */}
              <div className="relative mx-auto lg:mx-0 w-64 h-[500px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                  {/* Mock App Interface */}
                  <div className="h-full bg-gradient-to-b from-primary/10 to-white">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-8 h-8 bg-primary rounded-lg"></div>
                        <div className="text-sm font-semibold text-gray-800">Coffee Shop</div>
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-6">
                          <div className="h-20 bg-gray-200 rounded-lg"></div>
                          <div className="h-20 bg-gray-200 rounded-lg"></div>
                          <div className="h-20 bg-gray-200 rounded-lg"></div>
                          <div className="h-20 bg-gray-200 rounded-lg"></div>
                        </div>
                        
                        <div className="mt-8 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Right Side - Download Options */}
          <div>
            <Title2 className="text-gray-800 mb-6">Tải ứng dụng ngay</Title2>
            
            {/* Platform Selector */}
            <div className="flex space-x-2 mb-6">
              <ButtonOutline
                onClick={() => setSelectedPlatform('ios')}
                className={selectedPlatform === 'ios' ? 'bg-primary text-white border-primary' : ''}
              >
                iOS
              </ButtonOutline>
              <ButtonOutline
                onClick={() => setSelectedPlatform('android')}
                className={selectedPlatform === 'android' ? 'bg-primary text-white border-primary' : ''}
              >
                Android
              </ButtonOutline>
            </div>

            {/* Download Buttons */}
            <div className="space-y-4 mb-8">
              {selectedPlatform === 'ios' ? (
                <div className="space-y-3">
                  <ButtonFilled className="w-full h-14 flex items-center justify-center space-x-3">
                    <DevicePhoneMobileIcon className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-sm">Tải về</div>
                      <div className="text-lg font-semibold">App Store</div>
                    </div>
                  </ButtonFilled>
                  <p className="text-sm text-gray-500 text-center">
                    Yêu cầu iOS 14.0 trở lên
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <ButtonFilled className="w-full h-14 flex items-center justify-center space-x-3">
                    <DevicePhoneMobileIcon className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-sm">Tải về</div>
                      <div className="text-lg font-semibold">Google Play</div>
                    </div>
                  </ButtonFilled>
                  <p className="text-sm text-gray-500 text-center">
                    Yêu cầu Android 8.0 trở lên
                  </p>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="text-center">
              <div className="inline-block p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <QrCodeIcon className="w-24 h-24 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Quét mã QR để tải ứng dụng
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <Title2 className="text-gray-800 text-center mb-12">Tại sao chọn ứng dụng của chúng tôi?</Title2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                <Title3 className="text-gray-800 mb-2">{feature.title}</Title3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary rounded-2xl p-8 text-center text-white">
          <Title2 className="text-white mb-4">Sẵn sàng trải nghiệm?</Title2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Tải ứng dụng ngay hôm nay và nhận ngay ưu đãi đặc biệt cho người dùng mới!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonOutline className="bg-white text-primary hover:bg-gray-50">
              Tải cho iOS
            </ButtonOutline>
            <ButtonOutline className="bg-white text-primary hover:bg-gray-50">
              Tải cho Android
            </ButtonOutline>
          </div>
        </div>
      </div>
    </div>
  );
}
