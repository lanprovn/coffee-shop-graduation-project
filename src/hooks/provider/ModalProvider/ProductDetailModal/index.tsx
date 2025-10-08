import BaseModal from '@/components/shared/modal/BaseModal';
import { CoffeeProduct, ProductSize } from '@/types';
import Footer from './Footer';
import ProductSizeSwitch from './ProductSizeSwitch';
import ProductInfo from './ProductInfo';
import ProductImage from './ProductImage';
import { useMemo, useState } from 'react';

interface ProductDetailModalProps {
  product: CoffeeProduct | null;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  const defaultSize: ProductSize | undefined = product?.sizes?.[0]?.size;
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(defaultSize);

  const selectedPrice = useMemo(() => {
    if (!product) {return undefined;}
    if (!selectedSize) {return undefined;}
    const opt = product.sizes.find(s => s.size === selectedSize);
    return opt?.price ?? product.basePrice;
  }, [product, selectedSize]);

  return (
    <BaseModal show={!!product} onClose={onClose}>
      {product && (
        <>
          <ProductImage product={product} onClose={onClose} />
          <div className="p-4 pb-8">
            <ProductInfo product={product} price={selectedPrice} />
            <hr className="my-4" />
            <ProductSizeSwitch
              sizes={product.sizes}
              selectedSize={selectedSize}
              onChange={setSelectedSize}
            />
          </div>
          <Footer product={product} selectedSize={selectedSize} onClose={onClose} />
        </>
      )}
    </BaseModal>
  );
}
