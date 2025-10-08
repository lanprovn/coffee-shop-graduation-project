import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import useDebounce from '@/hooks/useDebounce';
import { useProduct } from '@/hooks/useProduct';
import { CoffeeProduct, ProductCategory } from '@/types';

interface SearchSuggestion {
  id: string;
  type: 'product' | 'category' | 'recent' | 'popular';
  title: string;
  subtitle?: string;
  image?: string;
  category?: string;
  rating?: number;
  price?: number;
}

interface AdvancedSearchProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSelect?: (suggestion: SearchSuggestion) => void;
  showSuggestions?: boolean;
  maxSuggestions?: number;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  className = '',
  placeholder = 'Tìm kiếm sản phẩm...',
  onSearch,
  onSelect,
  showSuggestions = true,
  maxSuggestions = 8,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { products, searchProducts } = useProduct();
  
  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('highland-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Generate suggestions based on query
  useEffect(() => {
    if (!debouncedQuery.trim() || !showSuggestions) {
      setSuggestions([]);
      return;
    }

    const generateSuggestions = (): SearchSuggestion[] => {
      const suggestions: SearchSuggestion[] = [];
      const queryLower = debouncedQuery.toLowerCase();

      // Product suggestions
      const matchingProducts = products.filter(product =>
        product.name.toLowerCase().includes(queryLower) ||
        product.description.toLowerCase().includes(queryLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(queryLower))
      ).slice(0, 4);

      matchingProducts.forEach(product => {
        suggestions.push({
          id: `product-${product.id}`,
          type: 'product',
          title: product.name,
          subtitle: product.description,
          image: product.image,
          category: product.category,
          rating: product.rating,
          price: product.price,
        });
      });

      // Category suggestions
      const categories: ProductCategory[] = ['hot-drinks', 'cold-drinks', 'food', 'desserts'];
      const matchingCategories = categories.filter(category =>
        category.toLowerCase().includes(queryLower)
      );

      matchingCategories.forEach(category => {
        suggestions.push({
          id: `category-${category}`,
          type: 'category',
          title: getCategoryDisplayName(category),
          subtitle: `Xem tất cả ${getCategoryDisplayName(category).toLowerCase()}`,
        });
      });

      // Recent searches
      const matchingRecent = recentSearches.filter(search =>
        search.toLowerCase().includes(queryLower) && search !== debouncedQuery
      ).slice(0, 2);

      matchingRecent.forEach(search => {
        suggestions.push({
          id: `recent-${search}`,
          type: 'recent',
          title: search,
          subtitle: 'Tìm kiếm gần đây',
        });
      });

      return suggestions.slice(0, maxSuggestions);
    };

    setSuggestions(generateSuggestions());
  }, [debouncedQuery, products, recentSearches, maxSuggestions, showSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, suggestions, selectedIndex]);

  // Handle suggestion selection
  const handleSelectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    // Add to recent searches
    const newRecent = [suggestion.title, ...recentSearches.filter(s => s !== suggestion.title)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('highland-recent-searches', JSON.stringify(newRecent));
    
    onSelect?.(suggestion);
  }, [recentSearches, onSelect]);

  // Handle search
  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    
    setIsOpen(false);
    setSelectedIndex(-1);
    
    // Add to recent searches
    const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('highland-recent-searches', JSON.stringify(newRecent));
    
    onSearch?.(query);
  }, [query, recentSearches, onSearch]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    setSelectedIndex(-1);
  }, []);

  // Handle clear
  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryDisplayName = (category: ProductCategory): string => {
    const names: Record<ProductCategory, string> = {
      'hot-drinks': 'Đồ uống nóng',
      'cold-drinks': 'Đồ uống lạnh',
      'food': 'Đồ ăn',
      'desserts': 'Tráng miệng',
    };
    return names[category] || category;
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return <StarIcon className="w-4 h-4 text-primary" />;
      case 'category':
        return <MagnifyingGlassIcon className="w-4 h-4 text-secondary" />;
      case 'recent':
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
      default:
        return <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(query.length > 0)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          {query && (
            <button
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="ml-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                  index === selectedIndex ? 'bg-primary/10' : ''
                } ${index === 0 ? 'rounded-t-lg' : ''} ${
                  index === suggestions.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-100'
                }`}
                onClick={() => handleSelectSuggestion(suggestion)}
                whileHover={{ backgroundColor: 'rgba(196, 30, 58, 0.05)' }}
              >
                {getSuggestionIcon(suggestion.type)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {suggestion.title}
                  </div>
                  {suggestion.subtitle && (
                    <div className="text-sm text-gray-500 truncate">
                      {suggestion.subtitle}
                    </div>
                  )}
                  {suggestion.price && (
                    <div className="text-sm font-semibold text-primary">
                      {suggestion.price.toLocaleString()}đ
                    </div>
                  )}
                </div>
                {suggestion.image && (
                  <img
                    src={suggestion.image}
                    alt={suggestion.title}
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch;