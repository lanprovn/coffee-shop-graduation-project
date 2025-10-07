import { useState } from 'react';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';

interface ReviewFormProps {
    onSubmit: (rating: number, comment: string) => void;
    onCancel: () => void;
}

/**
 * Form để user thêm review cho sản phẩm
 * Cho phép chọn rating (1-5 sao) và nhập comment
 */
export default function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            onSubmit(rating, comment.trim());
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    className={`text-2xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                >
                    ★
                </button>
            );
        }
        return stars;
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">Viết đánh giá của bạn</h4>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá
                </label>
                <div className="flex items-center gap-1">
                    {renderStars()}
                    <span className="ml-2 text-sm text-gray-600">
                        {rating} sao
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={4}
                    required
                />
            </div>

            <div className="flex gap-2">
                <ButtonFilled type="submit" disabled={!comment.trim()}>
                    Gửi đánh giá
                </ButtonFilled>
                <ButtonOutline onClick={onCancel}>
                    Hủy
                </ButtonOutline>
            </div>
        </form>
    );
}
