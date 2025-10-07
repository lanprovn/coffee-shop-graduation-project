import { useState } from 'react';
import { BarsArrowUpIcon, BarsArrowDownIcon } from '@heroicons/react/24/outline';

export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rating_desc';

interface ProductSortProps {
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
    totalProducts: number;
}

/**
 * ProductSort: Component sắp xếp sản phẩm
 * Bao gồm các tùy chọn sắp xếp theo giá, tên, rating
 */
export default function ProductSort({
    sortOption,
    onSortChange,
    totalProducts
}: ProductSortProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const sortOptions = [
        { value: 'default', label: 'Mặc định', icon: '🔄' },
        { value: 'price_asc', label: 'Giá tăng dần', icon: '💰' },
        { value: 'price_desc', label: 'Giá giảm dần', icon: '💰' },
        { value: 'name_asc', label: 'Tên A-Z', icon: '🔤' },
        { value: 'name_desc', label: 'Tên Z-A', icon: '🔤' },
        { value: 'rating_desc', label: 'Đánh giá cao nhất', icon: '⭐' },
    ];

    const getSortIcon = (option: SortOption) => {
        switch (option) {
            case 'price_asc':
                return <BarsArrowUpIcon className="w-4 h-4" />;
            case 'price_desc':
                return <BarsArrowDownIcon className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const currentSort = sortOptions.find(opt => opt.value === sortOption);

    return (
        <div className="bg-white border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
                {/* Results Count */}
                <div className="text-sm text-gray-600">
                    Hiển thị <span className="font-semibold text-gray-800">{totalProducts}</span> sản phẩm
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary transition-colors"
                    >
                        <span className="text-sm font-medium text-gray-700">
                            Sắp xếp: {currentSort?.label}
                        </span>
                        {getSortIcon(sortOption)}
                        <svg
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isExpanded && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="py-2">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onSortChange(option.value as SortOption);
                                            setIsExpanded(false);
                                        }}
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${sortOption === option.value ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'
                                            }`}
                                    >
                                        <span>{option.icon}</span>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Sort Buttons */}
            <div className="mt-3 flex gap-2">
                {sortOptions.slice(1, 4).map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onSortChange(option.value as SortOption)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${sortOption === option.value
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
