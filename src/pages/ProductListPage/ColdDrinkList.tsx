import { useProduct } from '@/hooks/useProduct';
import ProductsByCategory from './ProductsByCategory';

export default function ColdDrinkList() {
  // Product Provider
  const { icedCoffees } = useProduct();

  return <ProductsByCategory title="Đồ uống lạnh" coffees={icedCoffees} />;
}
