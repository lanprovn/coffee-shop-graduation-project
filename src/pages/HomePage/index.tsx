import UserAddressCard from './UserAddressCard';
import SearchBox from './SearchBox';
import PopularProductList from './PopularProductList';
import PopularHotDrinkList from './PopularHotDrinkList';
import PopularColdDrinkList from './PopularColdDrinkList';
import BannerSlider from '@/components/shared/BannerSlider';
import HeroSection from '@/components/shared/HeroSection';
import SEO from '@/components/shared/SEO';
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
import { useOptimizedCallback, useOptimizedMemo } from '@/hooks/usePerformance';
import { memo } from 'react';

function HomePage() {
  const navigate = useNavigate();

  // Memoized features data
  const features = useOptimizedMemo(() => [
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: 'Cà phê chất lượng cao',
      description: 'Sử dụng hạt cà phê Arabica và Robusta được tuyển chọn kỹ lưỡng'
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: 'Phục vụ nhanh chóng',
      description: 'Đặt hàng và nhận đồ uống trong vòng 5-10 phút'
    },
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: 'Giao hàng tận nơi',
      description: 'Miễn phí giao hàng cho đơn từ 100.000đ trong bán kính 5km'
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Đảm bảo chất lượng',
      description: 'Cam kết đồ uống tươi ngon và đóng gói an toàn'
    }
  ], []);

  // Memoized stats data
  const stats = useOptimizedMemo(() => [
    { number: '30+', label: 'Sản phẩm đa dạng' },
    { number: '12', label: 'Chi nhánh' },
    { number: '10K+', label: 'Khách hàng hài lòng' },
    { number: '4.8', label: 'Đánh giá trung bình' }
  ], []);

  // Optimized navigation callbacks
  const navigateToProducts = useOptimizedCallback((category?: string) => {
    const url = category ? `/products?category=${category}` : '/products';
    navigate(url);
  }, [navigate]);

  const navigateToStores = useOptimizedCallback(() => {
    navigate('/stores');
  }, [navigate]);

  return (
    <>
      <SEO
        title="Highland Coffee - Premium Coffee & Beverages | Trang Chủ"
        description="Khám phá thế giới cà phê cao cấp tại Highland Coffee. Từ cà phê truyền thống đến các thức uống hiện đại, chúng tôi mang đến trải nghiệm tuyệt vời nhất với chất lượng cao và dịch vụ chuyên nghiệp."
        keywords="highland coffee, cà phê, coffee, thức uống, beverage, coffee shop, cà phê cao cấp, espresso, latte, cappuccino, đặt hàng online, giao hàng tận nơi"
        image="/images/home-open-graph.png"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Highland Coffee",
          "description": "Premium Coffee & Beverages",
          "url": window.location.origin,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <div className="bg-cream min-h-screen main-content">
        {/* Banner Slider - Mobile Optimized */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <BannerSlider slides={bannerSlides} />
        </div>

        {/* Hero Section - Mobile Optimized */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <HeroSection />
        </div>

        {/* Stats Section - Highland Style */}
        <div className="highland-gradient py-6 sm:py-8 lg:py-12 mb-6 sm:mb-8 lg:mb-12">
          <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-cream text-xs sm:text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section - Highland Style */}
        <div className="bg-white py-8 sm:py-12 lg:py-16 mb-6 sm:mb-8 lg:mb-12">
          <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <Title2 className="heading-highland mb-2 sm:mb-4 text-lg sm:text-xl lg:text-2xl">Tại sao chọn Highland Coffee?</Title2>
              <p className="text-highland text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                Chúng tôi cam kết mang đến trải nghiệm cà phê tuyệt vời nhất với chất lượng cao và dịch vụ chuyên nghiệp
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div key={index} className="card-highland text-center p-6">
                  <div className="text-primary mb-3 sm:mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-800 mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 text-xs sm:text-sm">
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

        {/* Product Categories Section - Highland Style */}
        <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8 mb-6 sm:mb-8 lg:mb-12">
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <Title1 className="heading-highland mb-2 sm:mb-4 text-lg sm:text-xl lg:text-2xl">Khám phá menu Highland</Title1>
            <p className="text-highland text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              Từ cà phê truyền thống đến các thức uống hiện đại, chúng tôi có đầy đủ lựa chọn cho bạn
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
            <ButtonFilled
              onClick={() => navigateToProducts('coffee')}
              className="btn-primary h-16 sm:h-18 lg:h-20 flex flex-col items-center justify-center gap-1 sm:gap-2"
            >
              <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-medium">Cà phê</span>
            </ButtonFilled>
            <ButtonFilled
              onClick={() => navigateToProducts('tea')}
              className="btn-secondary h-16 sm:h-18 lg:h-20 flex flex-col items-center justify-center gap-1 sm:gap-2"
            >
              <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-medium">Trà</span>
            </ButtonFilled>
            <ButtonFilled
              onClick={() => navigateToProducts('freeze')}
              className="btn-outline h-16 sm:h-18 lg:h-20 flex flex-col items-center justify-center gap-1 sm:gap-2"
            >
              <StarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-medium">Đá xay</span>
            </ButtonFilled>
            <ButtonFilled
              onClick={() => navigateToProducts('cake')}
              className="btn-primary h-16 sm:h-18 lg:h-20 flex flex-col items-center justify-center gap-1 sm:gap-2"
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

        {/* Call to Action - Highland Style */}
        <div className="highland-gradient text-white py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">
          <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8 text-center">
            <Title2 className="text-white mb-2 sm:mb-4 text-lg sm:text-xl lg:text-2xl">Sẵn sàng thưởng thức Highland?</Title2>
            <p className="text-cream text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto">
              Khám phá menu đa dạng của chúng tôi và đặt hàng ngay hôm nay để trải nghiệm hương vị cà phê tuyệt hảo
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <ButtonFilled
                onClick={() => navigateToProducts()}
                className="btn-primary bg-white text-primary hover:bg-cream px-6 sm:px-8 py-3"
              >
                Xem toàn bộ menu
              </ButtonFilled>
              <ButtonFilled
                onClick={navigateToStores}
                className="btn-outline border-2 border-white text-white hover:bg-white hover:text-primary px-6 sm:px-8 py-3"
              >
                Tìm cửa hàng gần nhất
              </ButtonFilled>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Memoize HomePage to prevent unnecessary re-renders
export default memo(HomePage);