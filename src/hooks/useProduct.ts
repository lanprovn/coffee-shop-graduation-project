import { useContext } from 'react';
import ProductContext from './context/ProductContext';

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductContext');
  }

  const getProductById = (id: string) => {
    return context.coffees.find(product => product.id === id);
  };

  return {
    ...context,
    getProductById,
  };
};
