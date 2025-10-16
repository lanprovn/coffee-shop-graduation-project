import { useState, useEffect } from 'react';
import { CoffeeProduct } from '@/types';

// Mock product data with enhanced structure
const mockProducts: CoffeeProduct[] = [
  {
    id: '1',
    name: 'Cà phê đen',
    displayName: 'Cà phê đen truyền thống',
    description: 'Cà phê đen nguyên chất, đậm đà hương vị truyền thống Việt Nam',
    basePrice: 25000,
    price: 25000,
    image: '/images/coffee/coffee-black.webp',
    category: 'coffee' as any,
    rating: 4.5,
    reviewCount: 128,
    isNew: false,
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { name: 'Nhỏ', price: 0, volume: '200ml' },
      { name: 'Vừa', price: 5000, volume: '300ml' },
      { name: 'Lớn', price: 10000, volume: '400ml' }
    ],
    customizations: [
      { name: 'Độ ngọt', options: ['Không đường', 'Ít đường', 'Vừa', 'Nhiều đường'] },
      { name: 'Đá', options: ['Không đá', 'Ít đá', 'Vừa', 'Nhiều đá'] }
    ],
    nutrition: { calories: 5, protein: 0.3, carbs: 0, fat: 0 },
    allergens: [],
    preparationTime: 3,
    tags: ['truyền thống', 'đậm đà']
  },
  {
    id: '2',
    name: 'Cà phê sữa',
    displayName: 'Cà phê sữa đá',
    description: 'Cà phê pha với sữa đặc, ngọt ngào và thơm ngon',
    basePrice: 30000,
    price: 30000,
    image: '/images/coffee/coffee-milk.webp',
    category: 'coffee' as any,
    rating: 4.7,
    reviewCount: 256,
    isNew: false,
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { name: 'Nhỏ', price: 0, volume: '200ml' },
      { name: 'Vừa', price: 5000, volume: '300ml' },
      { name: 'Lớn', price: 10000, volume: '400ml' }
    ],
    customizations: [
      { name: 'Độ ngọt', options: ['Ít ngọt', 'Vừa', 'Nhiều ngọt'] },
      { name: 'Đá', options: ['Không đá', 'Ít đá', 'Vừa', 'Nhiều đá'] }
    ],
    nutrition: { calories: 120, protein: 3, carbs: 15, fat: 4 },
    allergens: ['sữa'],
    preparationTime: 4,
    tags: ['sữa', 'ngọt ngào']
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<CoffeeProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, []);

  return {
    products,
    loading,
    getProductById: (id: string) => products.find(p => p.id === id)
  };
};
