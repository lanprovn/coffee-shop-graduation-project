import UserAddressCard from './UserAddressCard';
import SearchBox from './SearchBox';
import PopularProductList from './PopularProductList';
import PopularHotDrinkList from './PopularHotDrinkList';
import PopularColdDrinkList from './PopularColdDrinkList';
import BannerSlider from '@/components/shared/BannerSlider';
import HeroSection from '@/components/shared/HeroSection';
import { bannerSlides } from '@/data/bannerSlides';
import Title1 from '@/components/shared/typo/Title1';
import Title2 from '@/components/shared/typo/Title2';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  CakeIcon,
  StarIcon,
  ClockIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: "Cà phê chất lượng cao",
      description: "Sử dụng hạt cà phê Arabica và Robusta được tuyển chọn kỹ lưỡng"
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "Phục vụ nhanh chóng",
      description: "Đặt hàng và nhận đồ uống trong vòng 5-10 phút"
    },
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: "Giao hàng tận nơi",
      description: "Miễn phí giao hàng cho đơn từ 100.000đ trong bán kính 5km"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Đảm bảo chất lượng",
      description: "Cam kết đồ uống tươi ngon và đóng gói an toàn"
    }
  ];

  const stats = [
    { number: "30+", label: "Sản phẩm đa dạng" },
    { number: "12", label: "Chi nhánh" },
    { number: "10K+", label: "Khách hàng hài lòng" },
    { number: "4.8", label: "Đánh giá trung bình" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen main-content">
      {/* Banner Slider - Mobile Optimized */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <BannerSlider slides={bannerSlides} />
      </div>

      {/* Hero Section - Mobile Optimized */}
      <div className="mb-6 sm:mb-8 lg:mb-12">
        <HeroSection />
      </div>

      {/* Stats Section - Mobile Optimized */}
      <div className="bg-white py-6 sm:py-8 lg:py-12 mb-6 sm:mb-8 lg:mb-12">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-xs sm:text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section - Mobile Optimized */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 py-8 sm:py-12 lg:py-16 mb-6 sm:mb-8 lg:mb-12">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <Title2 className="text-gray-800 mb-2 sm:mb-4 text-lg sm:text-xl lg:text-2xl">Tại sao chọn Coffee Shop?</Title2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm cà phê tuyệt vời nhất với chất lượng cao và dịch vụ chuyên nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="mobile-card text-center">
                <div className="text-primary mb-3 sm:mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Address Card - Mobile Optimized */}
      <div className="mb-6 sm:mb-8 lg:mb-12">
        <UserAddressCard />
      </div>

      {/* Search Box - Mobile Optimized */}
      <div className="mb-6 sm:mb-8 lg:mb-12">
        <SearchBox />
      </div>

      {/* Product Categories Section - Mobile Optimized */}
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8 mb-6 sm:mb-8 lg:mb-12">
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <Title1 className="text-gray-800 mb-2 sm:mb-4 text-lg sm:text-xl lg:text-2xl">Khám phá menu</Title1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Từ cà phê truyền thống đến các thức uống hiện đại, chúng tôi có đầy đủ lựa chọn cho bạn
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
          <ButtonFilled
            onClick={() => navigate('/products?category=coffee')}
            className="mobile-btn h-16 sm:h-18 lg:h-20 flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm font-medium">Cà phê</span>
          </ButtonFilled>
          <ButtonFilled
            onClick={() => navigate('/products?category=tea')}
            className="mobile-btn h-16 sm:h-18 lg:h-20 flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm font-medium">Trà</span>
          </ButtonFilled>
          <ButtonFilled
            onClick={() => navigate('/products?category=freeze')}
            className="mobile-btn h-16 sm:h-18 lg:h-20 flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <StarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm font-medium">Đá xay</span>
          </ButtonFilled>
          <ButtonFilled
            onClick={() => navigate('/products?category=cake')}
            className="mobile-btn h-16 sm:h-18 lg:h-20 flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <CakeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm font-medium">Bánh ngọt</span>
          </ButtonFilled>
        </div>
      </div>

      {/* Product Lists - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 space-y-8 sm:space-y-12 lg:space-y-16">
        <PopularProductList />
        <PopularHotDrinkList />
        <PopularColdDrinkList />
      </div>

      {/* Call to Action - Mobile Optimized */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">
        <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8 text-center">
          <Title2 className="text-white mb-2 sm:mb-4 text-lg sm:text-xl lg:text-2xl">Sẵn sàng thưởng thức?</Title2>
          <p className="text-primary-100 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto">
            Khám phá menu đa dạng của chúng tôi và đặt hàng ngay hôm nay để trải nghiệm hương vị cà phê tuyệt hảo
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <ButtonFilled
              onClick={() => navigate('/products')}
              className="mobile-btn bg-white text-primary hover:bg-gray-100 px-6 sm:px-8 py-3"
            >
              Xem toàn bộ menu
            </ButtonFilled>
            <ButtonFilled
              onClick={() => navigate('/stores')}
              className="mobile-btn border-2 border-white text-white hover:bg-white hover:text-primary px-6 sm:px-8 py-3"
            >
              Tìm cửa hàng gần nhất
            </ButtonFilled>
          </div>
        </div>
      </div>
    </div>
  );
}