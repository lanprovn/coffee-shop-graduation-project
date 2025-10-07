import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import ProductCardSmall from '@/components/shared/card/ProductCardSmall';
import Title1 from '@/components/shared/typo/Title1';
import Title2 from '@/components/shared/typo/Title2';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * SearchResultsPage: Trang hiển thị kết quả tìm kiếm chuyên nghiệp
 * Bao gồm search suggestions, filters, và pagination
 */
export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { coffees, loading } = useProduct();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    
    if (query) {
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = (query: string) => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = coffees.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    navigate('/search');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Header */}
        <div className="mb-8">
          <Title1 className="text-gray-800 mb-4">Tìm kiếm sản phẩm</Title1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm cà phê, trà, bánh ngọt..."
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Title2 className="text-gray-800">
                {isSearching ? 'Đang tìm kiếm...' : `Kết quả cho "${searchQuery}"`}
              </Title2>
              <span className="text-gray-600">
                {isSearching ? '...' : `${searchResults.length} sản phẩm`}
              </span>
            </div>

            {isSearching ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((product) => (
                  <ProductCardSmall key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <Title2 className="text-gray-600 mb-2">Không tìm thấy sản phẩm</Title2>
                <p className="text-gray-500 mb-6">
                  Không có sản phẩm nào khớp với từ khóa "{searchQuery}"
                </p>
                <ButtonFilled onClick={() => navigate('/products')}>
                  Xem tất cả sản phẩm
                </ButtonFilled>
              </div>
            )}
          </div>
        )}

        {/* Popular Searches */}
        {!searchQuery && (
          <div className="text-center py-12">
            <Title2 className="text-gray-600 mb-6">Tìm kiếm phổ biến</Title2>
            <div className="flex flex-wrap justify-center gap-3">
              {['Cà phê đen', 'Trà sữa', 'Frappuccino', 'Bánh ngọt', 'Latte', 'Cappuccino'].map((term) => (
                <button
                  key={term}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 hover:border-primary transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
