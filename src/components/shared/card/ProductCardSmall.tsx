import { PlusIcon, StarIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useModal } from '@/hooks/useModal';
import { useReview } from '@/hooks/useReview';
import { classNames } from '@/utils/helper';
import { ProductCardProps } from './type';

export default function ProductCardSmall({ coffee }: ProductCardProps) {
  // Shopping Cart
  const { items, addItem } = useShoppingCart();
  const isSameItem = items?.filter((i) => i.product.id === coffee.id)[0];
  // Modal Provider
  const { showProductModal } = useModal();
  // Review
  const { getProductRating } = useReview();
  const rating = getProductRating(coffee.id);
  // Navigation
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${coffee.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSameItem) {
      // Add to cart with default size (Medium)
      const defaultSize = coffee.sizes.find(s => s.size === 'M') || coffee.sizes[0];
      addItem({
        product: coffee,
        quantity: 1,
        selectedSize: defaultSize.size,
        selectedToppings: [],
        unitPrice: defaultSize.price,
        totalPrice: defaultSize.price
      });
    }
  };

  // Price handling: show message if size pricing undefined
  const basePrice = (coffee as any)?.basePrice ?? (coffee as any)?.price;
  const hasSizePrices = Array.isArray((coffee as any)?.sizes) && (coffee as any).sizes.length > 0;
  const displayPrice = typeof basePrice === 'number' && !Number.isNaN(basePrice)
    ? `${basePrice.toLocaleString('vi-VN')} VND`
    : hasSizePrices
      ? 'Chọn size để xem giá'
      : '';

  // Category-based styling
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'coffee':
        return {
          badge: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
          accent: 'border-amber-200',
          hover: 'hover:border-amber-300'
        };
      case 'tea':
        return {
          badge: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
          accent: 'border-green-200',
          hover: 'hover:border-green-300'
        };
      case 'freeze':
        return {
          badge: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
          accent: 'border-blue-200',
          hover: 'hover:border-blue-300'
        };
      case 'cake':
        return {
          badge: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
          accent: 'border-pink-200',
          hover: 'hover:border-pink-300'
        };
      default:
        return {
          badge: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
          accent: 'border-gray-200',
          hover: 'hover:border-gray-300'
        };
    }
  };

  const categoryStyle = getCategoryStyle((coffee as any)?.category || 'coffee');

  // Badge: Best Seller / New / Popular
  const tag = (coffee as any)?.tag as string | undefined;
  const randomBestSeller = Math.random() < 0.15;
  const randomNew = Math.random() < 0.1;
  const randomPopular = Math.random() < 0.2;

  let badge = tag;
  if (!badge) {
    if (randomBestSeller) badge = 'Bán chạy';
    else if (randomNew) badge = 'Mới';
    else if (randomPopular) badge = 'Phổ biến';
  }

  const badgeStyle = badge === 'Bán chạy'
    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900'
    : badge === 'Mới'
      ? 'bg-gradient-to-r from-green-400 to-green-500 text-green-900'
      : 'bg-gradient-to-r from-blue-400 to-blue-500 text-blue-900';

  return (
    <div
      onClick={handleClick}
      className={`relative w-full bg-white border-2 ${categoryStyle.accent} rounded-3xl p-5 cursor-pointer group hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] ${categoryStyle.hover} hover:shadow-primary/10`}
    >
      {/* Category Badge */}
      <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full ${categoryStyle.badge} shadow-lg z-10`}>
        {(coffee as any)?.category === 'coffee' ? 'Cà phê' :
          (coffee as any)?.category === 'tea' ? 'Trà' :
            (coffee as any)?.category === 'freeze' ? 'Đá xay' :
              (coffee as any)?.category === 'cake' ? 'Bánh ngọt' : 'Sản phẩm'}
      </div>

      {/* Product Badge */}
      {badge && (
        <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full ${badgeStyle} shadow-lg z-10`}>
          {badge}
        </div>
      )}

      {/* Product Image */}
      <div className="relative overflow-hidden rounded-2xl mb-5">
        <img
          src={coffee.image}
          alt={coffee.displayName}
          className="w-full h-40 sm:h-44 object-cover bg-gray-100 transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Image overlay with product name */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm font-medium line-clamp-2">
            {(coffee as any)?.description || 'Thưởng thức hương vị tuyệt vời'}
          </p>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        {/* Product Name */}
        <h3 className="font-bold text-gray-800 line-clamp-2 text-base sm:text-lg leading-tight group-hover:text-primary transition-colors duration-200 min-h-[3rem] flex items-center">
          {coffee.displayName}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-gray-700 ml-1">
              {rating.averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            ({rating.totalReviews} đánh giá)
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <p className="font-bold text-primary text-lg">
              {displayPrice}
            </p>
            {hasSizePrices && (
              <p className="text-xs text-gray-500">3 size có sẵn</p>
            )}
          </div>

          {/* Add to Cart Button */}
          <div
            className={classNames(
              'inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 shadow-lg',
              isSameItem
                ? 'text-primary border-2 border-primary bg-white hover:bg-primary/5'
                : 'bg-primary text-white hover:bg-primary-600 hover:shadow-xl hover:scale-110'
            )}
            title={isSameItem ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
            onClick={handleAddToCart}
          >
            {isSameItem ? (
              <span className="text-sm font-bold">{isSameItem.quantity}</span>
            ) : (
              <PlusIcon className="h-6 w-6" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}