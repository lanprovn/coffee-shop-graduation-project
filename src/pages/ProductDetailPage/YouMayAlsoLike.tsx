import { useProduct } from '@/hooks/useProduct';
import ProductCardSmall from '@/components/shared/card/ProductCardSmall';

type Props = {
    currentProductId: string;
    category?: string;
};

/**
 * YouMayAlsoLike: Gợi ý sản phẩm liên quan cùng loại
 */
export default function YouMayAlsoLike({ currentProductId, category }: Props) {
  const { coffees } = useProduct();
  const related = coffees
    .filter((p) => p.id !== currentProductId && (!category || (p as any).category === category))
    .slice(0, 3);

  if (!related.length) {return null;}

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3">You May Also Like</h3>
      <div className="grid grid-cols-2 gap-3">
        {related.map((p) => (
          <ProductCardSmall key={p.id} coffee={p as any} />
        ))}
      </div>
    </div>
  );
}
