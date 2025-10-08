import { ProductReview } from '@/types';

interface ReviewListProps {
    reviews: ProductReview[];
}

/**
 * Component hiển thị danh sách reviews của sản phẩm
 * Hiển thị avatar, tên user, rating, comment và thời gian
 */
export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Chưa có đánh giá nào cho sản phẩm này.</p>
        <p className="text-sm mt-1">Hãy là người đầu tiên đánh giá!</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-sm ${i <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
                    ★
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
          <div className="flex items-start gap-3">
            <img
              src={review.userAvatar || '/images/male-avatar.png'}
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800">
                  {review.userName}
                </span>
                {review.isVerified && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        Đã mua
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              <p className="text-gray-700">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
