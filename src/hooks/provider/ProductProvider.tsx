import React, { ReactNode, useEffect, useMemo } from 'react';
import { CoffeeProduct, ProductCategory } from '@/types';
import { products } from '@/data/products';
import ProductContext from '@/hooks/context/ProductContext';

interface ProductProviderProps {
  children: ReactNode;
}

const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [coffees, setCoffees] = React.useState<CoffeeProduct[]>([]);

  // Filter products by category
  const coffeeProducts: CoffeeProduct[] = coffees?.filter(
    (c) => c.category === ProductCategory.Coffee
  );
  const teaProducts: CoffeeProduct[] = coffees?.filter(
    (c) => c.category === ProductCategory.Tea
  );
  const freezeProducts: CoffeeProduct[] = coffees?.filter(
    (c) => c.category === ProductCategory.Freeze
  );
  const cakeProducts: CoffeeProduct[] = coffees?.filter(
    (c) => c.category === ProductCategory.Cake
  );

  // Filter hot and cold products by name (since we removed CoffeeType)
  const hotCoffees: CoffeeProduct[] = coffees?.filter(
    (c) => c.displayName.toLowerCase().includes('nóng') || c.displayName.toLowerCase().includes('hot')
  );
  const icedCoffees: CoffeeProduct[] = coffees?.filter(
    (c) => c.displayName.toLowerCase().includes('đá') || c.displayName.toLowerCase().includes('iced')
  );

  // Get Coffee List
  useEffect(() => {
    const fetchCoffeeList = () => {
      setCoffees(products);
    };

    fetchCoffeeList();
  }, []);

  const value = useMemo(
    () => ({
      coffees,
      icedCoffees,
      hotCoffees,
      coffeeProducts,
      teaProducts,
      freezeProducts,
      cakeProducts,
    }),
    [coffees, icedCoffees, hotCoffees, coffeeProducts, teaProducts, freezeProducts, cakeProducts]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductProvider;
