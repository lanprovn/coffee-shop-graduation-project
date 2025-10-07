import { NewsArticle } from '@/types';

/**
 * Mock data cho hệ thống tin tức và khuyến mãi
 * Danh sách bài viết, tin tức và sự kiện
 */
export const newsArticles: NewsArticle[] = [
  {
    id: 'news_1',
    title: 'Coffee Shop ra mắt menu mùa hè 2024',
    content: `
      <p>Mùa hè 2024, Coffee Shop tự hào giới thiệu menu mới với những thức uống tươi mát, 
      phù hợp với thời tiết nóng bức của Sài Gòn.</p>
      
      <p>Điểm nổi bật của menu mới:</p>
      <ul>
        <li>Cold Brew Latte - Vị cà phê đậm đà, mát lạnh</li>
        <li>Iced Matcha Latte - Matcha thơm ngon, bổ dưỡng</li>
        <li>Fruit Smoothies - Nước ép trái cây tươi ngon</li>
        <li>Ice Cream Coffee - Cà phê kem lạnh độc đáo</li>
      </ul>
      
      <p>Tất cả sản phẩm đều được chế biến từ nguyên liệu tươi ngon, 
      đảm bảo chất lượng và hương vị tuyệt vời.</p>
    `,
    excerpt: 'Menu mùa hè 2024 với những thức uống tươi mát, phù hợp với thời tiết nóng bức của Sài Gòn.',
    author: 'Coffee Shop',
    publishedAt: '2024-01-15T10:00:00Z',
    image: '/images/news/summer-menu-2024.jpg',
    category: 'news',
    tags: ['menu', 'mùa hè', 'đồ uống'],
    isFeatured: true,
  },
  {
    id: 'news_2',
    title: 'Khuyến mãi đặc biệt - Giảm 20% cho đơn hàng đầu tiên',
    content: `
      <p>Chào mừng khách hàng mới! Coffee Shop dành tặng ưu đãi đặc biệt 
      cho đơn hàng đầu tiên của bạn.</p>
      
      <p><strong>Ưu đãi:</strong></p>
      <ul>
        <li>Giảm 20% cho đơn hàng đầu tiên</li>
        <li>Áp dụng cho tất cả sản phẩm</li>
        <li>Không giới hạn số lượng</li>
        <li>Thời gian: 15/01/2024 - 15/02/2024</li>
      </ul>
      
      <p><strong>Cách sử dụng:</strong></p>
      <ol>
        <li>Đăng ký tài khoản mới</li>
        <li>Thêm sản phẩm vào giỏ hàng</li>
        <li>Nhập mã giảm giá: WELCOME20</li>
        <li>Thanh toán và nhận ưu đãi</li>
      </ol>
    `,
    excerpt: 'Ưu đãi đặc biệt giảm 20% cho đơn hàng đầu tiên của khách hàng mới.',
    author: 'Marketing Team',
    publishedAt: '2024-01-10T09:00:00Z',
    image: '/images/news/welcome-promotion.jpg',
    category: 'promotion',
    tags: ['khuyến mãi', 'đơn hàng đầu tiên', 'giảm giá'],
    isFeatured: true,
  },
  {
    id: 'news_3',
    title: 'Sự kiện cà phê cuối tuần - Workshop Latte Art',
    content: `
      <p>Tham gia workshop Latte Art miễn phí tại Coffee Shop!</p>
      
      <p><strong>Thông tin sự kiện:</strong></p>
      <ul>
        <li>Thời gian: 20/01/2024, 14:00 - 16:00</li>
        <li>Địa điểm: Coffee Shop - Trung tâm thành phố</li>
        <li>Giảng viên: Barista chuyên nghiệp</li>
        <li>Miễn phí tham gia</li>
      </ul>
      
      <p><strong>Nội dung workshop:</strong></p>
      <ul>
        <li>Học cách tạo hình latte art cơ bản</li>
        <li>Kỹ thuật đánh sữa</li>
        <li>Thực hành tạo hình trái tim, lá</li>
        <li>Chụp ảnh và chia sẻ</li>
      </ul>
      
      <p>Đăng ký ngay để không bỏ lỡ cơ hội học hỏi kỹ thuật latte art từ chuyên gia!</p>
    `,
    excerpt: 'Workshop Latte Art miễn phí với barista chuyên nghiệp vào cuối tuần.',
    author: 'Event Team',
    publishedAt: '2024-01-08T15:00:00Z',
    image: '/images/news/latte-art-workshop.jpg',
    category: 'event',
    tags: ['workshop', 'latte art', 'miễn phí'],
    isFeatured: false,
  },
  {
    id: 'news_4',
    title: 'Coffee Shop mở rộng hệ thống giao hàng',
    content: `
      <p>Để phục vụ khách hàng tốt hơn, Coffee Shop đã mở rộng hệ thống giao hàng 
      đến nhiều khu vực mới trong thành phố.</p>
      
      <p><strong>Khu vực mới được phục vụ:</strong></p>
      <ul>
        <li>Quận 9, 12, Thủ Đức</li>
        <li>Huyện Bình Chánh, Hóc Môn</li>
        <li>Quận 8, 11</li>
        <li>Và nhiều khu vực khác</li>
      </ul>
      
      <p><strong>Ưu đãi giao hàng:</strong></p>
      <ul>
        <li>Miễn phí giao hàng cho đơn từ 100.000đ</li>
        <li>Phí giao hàng chỉ 20.000đ cho đơn dưới 100.000đ</li>
        <li>Thời gian giao hàng: 30-45 phút</li>
        <li>Hỗ trợ thanh toán khi nhận hàng</li>
      </ul>
    `,
    excerpt: 'Mở rộng hệ thống giao hàng đến nhiều khu vực mới với ưu đãi đặc biệt.',
    author: 'Delivery Team',
    publishedAt: '2024-01-05T11:00:00Z',
    image: '/images/news/delivery-expansion.jpg',
    category: 'news',
    tags: ['giao hàng', 'mở rộng', 'dịch vụ'],
    isFeatured: false,
  },
  {
    id: 'news_5',
    title: 'Chương trình tích điểm - Đổi quà hấp dẫn',
    content: `
      <p>Tham gia chương trình tích điểm và đổi quà hấp dẫn từ Coffee Shop!</p>
      
      <p><strong>Cách tích điểm:</strong></p>
      <ul>
        <li>1 điểm = 1.000đ chi tiêu</li>
        <li>Thành viên Silver: x1.2 điểm</li>
        <li>Thành viên Gold: x1.5 điểm</li>
        <li>Thành viên Diamond: x2.0 điểm</li>
      </ul>
      
      <p><strong>Quà tặng có thể đổi:</strong></p>
      <ul>
        <li>50 điểm = 1 ly cà phê miễn phí</li>
        <li>100 điểm = 1 bánh ngọt miễn phí</li>
        <li>200 điểm = 1 combo cà phê + bánh</li>
        <li>500 điểm = 1 voucher giảm 50.000đ</li>
        <li>1000 điểm = 1 voucher giảm 100.000đ</li>
      </ul>
    `,
    excerpt: 'Chương trình tích điểm với nhiều quà tặng hấp dẫn cho khách hàng.',
    author: 'Loyalty Team',
    publishedAt: '2024-01-03T14:00:00Z',
    image: '/images/news/loyalty-program.jpg',
    category: 'promotion',
    tags: ['tích điểm', 'quà tặng', 'thành viên'],
    isFeatured: false,
  },
];
