import { ProductRating } from '@/types';

interface ProductRatingDisplayProps {
    rating: ProductRating;
}

/**
 * Component hiển thị rating của sản phẩm
 * Hiển thị số sao trung bình, tổng số review và phân bố rating
 */
export default function ProductRatingDisplay({ rating }: ProductRatingDisplayProps) {
    const renderStars = (averageRating: number) => {
        const stars = [];
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <span key={i} className="text-yellow-400 text-xl">☆</span>
                );
            } else {
                stars.push(
                    <span key={i} className="text-gray-300 text-xl">☆</span>
                );
            }
        }
        return stars;
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                {renderStars(rating.averageRating)}
                <span className="text-lg font-semibold text-gray-700">
                    {rating.averageRating.toFixed(1)}
                </span>
            </div>
            <span className="text-gray-500">
                ({rating.totalReviews} đánh giá)
            </span>
        </div>
    );
}
