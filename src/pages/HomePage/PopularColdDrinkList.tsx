import ProductCardSmall from '@/components/shared/card/ProductCardSmall';
import CategoryTitle from './CategoryTitle';
import { useProduct } from '@/hooks/useProduct';
import ButtonOutline from '@/components/shared/button/ButtonOutline';
import { useNavigate } from 'react-router-dom';

export default function PopularColdDrinkList() {
  // Product Provider
  const { icedCoffees } = useProduct();
  const navigate = useNavigate();

  // Get cold drinks (iced coffee + freeze + smoothies)
  const coldDrinks = icedCoffees?.slice(0, 6) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CategoryTitle>Đồ uống lạnh</CategoryTitle>
        <ButtonOutline
          onClick={() => navigate('/products?category=freeze')}
          className="text-sm px-4 py-2"
        >
          Xem tất cả
        </ButtonOutline>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {coldDrinks.map((coffee) => (
          <ProductCardSmall key={coffee.id} coffee={coffee} />
        ))}
      </div>

      {coldDrinks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❄️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Đang tải đồ uống lạnh...
          </h3>
          <p className="text-gray-600">
            Vui lòng chờ trong giây lát
          </p>
        </div>
      )}
    </div>
  );
}
