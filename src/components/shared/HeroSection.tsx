import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

/**
 * HeroSection: Section hero cho homepage với search box
 * Bao gồm welcome message và tìm kiếm sản phẩm
 */
export default function HeroSection() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const quickSearchItems = [
        { label: 'Cà phê', query: 'coffee' },
        { label: 'Trà', query: 'tea' },
        { label: 'Đá xay', query: 'freeze' },
        { label: 'Bánh ngọt', query: 'cake' },
    ];

    return (
        <div className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-3xl p-8 md:p-12 mb-8 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-primary rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Welcome Message */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                        Chào mừng đến với
                        <span className="text-primary block">Coffee Shop</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Khám phá thế giới cà phê đa dạng với những hương vị tuyệt vời,
                        từ cà phê truyền thống đến những thức uống hiện đại.
                    </p>
                </div>

                {/* Search Box */}
                <div className="mb-8">
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm sản phẩm yêu thích..."
                                className="w-full px-6 py-4 pr-14 text-lg border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none transition-all duration-300 shadow-lg"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-600 text-white p-2 rounded-xl transition-all duration-300"
                            >
                                <MagnifyingGlassIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Quick Search Tags */}
                <div className="flex flex-wrap justify-center gap-3">
                    <span className="text-gray-600 font-medium">Tìm nhanh:</span>
                    {quickSearchItems.map((item) => (
                        <button
                            key={item.query}
                            onClick={() => navigate(`/products?search=${item.query}`)}
                            className="px-4 py-2 bg-white hover:bg-primary hover:text-white text-gray-700 rounded-full border border-gray-200 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-primary mb-2">50+</div>
                        <div className="text-gray-600">Sản phẩm đa dạng</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                        <div className="text-gray-600">Khách hàng hài lòng</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                        <div className="text-gray-600">Hỗ trợ khách hàng</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
