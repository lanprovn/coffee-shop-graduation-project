export interface BannerSlide {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    buttonText: string;
    buttonLink: string;
    backgroundColor?: string;
}

/**
 * Mock data cho banner slider homepage
 * Các slide quảng cáo sản phẩm và khuyến mãi
 */
export const bannerSlides: BannerSlide[] = [
  {
    id: 'slide_1',
    title: 'Cà Phê Tươi Mới',
    subtitle: 'Hương vị đậm đà, chất lượng cao',
    description: 'Khám phá bộ sưu tập cà phê mới với hương vị đậm đà và chất lượng cao nhất. Từ Americano cổ điển đến Latte hiện đại.',
    image: '/images/coffee/Slide1.webp',
    buttonText: 'Khám phá ngay',
    buttonLink: '/products?category=coffee',
    backgroundColor: '#8B4513'
  },
  {
    id: 'slide_2',
    title: 'Khuyến Mãi Đặc Biệt',
    subtitle: 'Giảm giá lên đến 30%',
    description: 'Ưu đãi đặc biệt cho đơn hàng đầu tiên. Giảm giá lên đến 30% cho tất cả sản phẩm cà phê và trà.',
    image: '/images/coffee/Slide2.webp',
    buttonText: 'Mua ngay',
    buttonLink: '/products',
    backgroundColor: '#DC2626'
  },
  {
    id: 'slide_3',
    title: 'Trà Matcha Premium',
    subtitle: 'Tươi mát, bổ dưỡng',
    description: 'Thưởng thức trà Matcha cao cấp với hương vị tươi mát và giàu chất chống oxy hóa. Hoàn hảo cho ngày hè.',
    image: '/images/coffee/Slide3.webp',
    buttonText: 'Thử ngay',
    buttonLink: '/products?category=tea',
    backgroundColor: '#059669'
  }
];
