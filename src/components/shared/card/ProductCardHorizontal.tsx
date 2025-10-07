import { PlusIcon } from '@heroicons/react/24/solid';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useModal } from '@/hooks/useModal';
import { classNames, priceWithSign } from '@/utils/helper';
import { ProductCardProps } from './type';

export default function ProductCardHorizontal({ coffee }: ProductCardProps) {
  // Shopping Cart
  const { items, addItem } = useShoppingCart();
  const isSameItem = items?.filter((i) => i.product.id === coffee.id)[0];
  // Modal Provider
  const { showProductModal } = useModal();

  const handleClick = () => {
    showProductModal(coffee);
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

  return (
    <button
      onClick={handleClick}
      className="relative flex flex-row bg-white hover:bg-primary-50 border rounded-2xl p-2 ease-in"
    >
      <img
        src={coffee.image}
        alt={coffee.displayName}
        className="w-24 h-24 object-cover bg-gray-300 rounded-xl"
      />
      <div className="flex flex-col justify-between h-full pl-2">
        <div>
          <p className="text-left text-lg font-bold text-neutral-800 line-clamp-1">
            {coffee.displayName}
          </p>
          <p className="text-left text-xs font-medium text-neutral-500 line-clamp-2">
            {coffee.description}
          </p>
        </div>
        <p className="text-left font-semibold text-teal-900">
          {priceWithSign((coffee as any)?.basePrice ?? (coffee as any)?.price)}
        </p>
      </div>
      <div className="absolute bottom-2 right-2">
        <div
          className={classNames(
            "inline-flex items-center justify-center w-7 h-7 rounded-full cursor-pointer transition-all duration-200",
            isSameItem ? "text-primary border border-primary hover:bg-primary/5" : "bg-primary text-white hover:bg-primary-600 hover:scale-110"
          )}
          onClick={handleAddToCart}
          title={isSameItem ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
        >
          {isSameItem ? <span className='text-sm font-semibold'>{isSameItem.quantity}</span> : <PlusIcon className="h-5 w-5" />}
        </div>
      </div>
    </button>
  );
}
