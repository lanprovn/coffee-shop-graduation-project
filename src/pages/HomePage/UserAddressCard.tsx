import { useEffect, useState } from 'react';

const banners = [
  {
    id: 1,
    image: '/images/coffee/latte-nong.webp',
    title: 'HƯƠNG VỊ ĐẬM ĐÀ TỪ HOT LATTE',
  },
  {
    id: 2,
    image: '/images/coffee/bac-xiu.webp',
    title: 'TƯƠI MÁT TỪNG NGỤM MATCHA',
  },
  {
    id: 3,
    image: '/images/coffee/phin-den-da.webp',
    title: 'SẢNG KHOÁI VỚI COLD BREW MÁT LẠNH',
  },
];

export default function UserAddressCard() {
  const [current, setCurrent] = useState(0);

  // Tự động chuyển ảnh sau 4 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-80 sm:h-[420px] rounded-2xl overflow-hidden mb-6">
      {banners.map((banner, index) => (
        <img
          key={banner.id}
          src={banner.image}
          alt={banner.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Overlay chữ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
        <h2 className="text-white text-3xl sm:text-4xl font-extrabold drop-shadow-lg">
          {banners[current].title}
        </h2>
      </div>

      {/* Dấu chấm chuyển slide */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${i === current ? 'bg-white' : 'bg-white/50'
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
