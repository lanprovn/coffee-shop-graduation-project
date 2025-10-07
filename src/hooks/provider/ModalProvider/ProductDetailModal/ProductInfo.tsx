import { CoffeeProduct } from '@/types';
import { priceWithSign } from '@/utils/helper';

interface ProductInfoProps {
  product: CoffeeProduct;
  price?: number;
}

export default function ProductInfo({ product, price }: ProductInfoProps) {
  return (
    <div>
      <p className="text-xl font-semibold text-neutral-800">
        {product?.displayName}
      </p>
      <p className="text-sm font-normal text-neutral-400 mt-1">
        {product?.description}
      </p>
      <p className="text-lg font-semibold text-primary-600 mt-2">
        {typeof price === 'number' ? priceWithSign(price) : 'Chọn size để xem giá'}
      </p>
    </div>
  );
}
