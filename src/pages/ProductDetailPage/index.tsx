import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProduct } from '@/hooks/useProduct';
import { useReview } from '@/hooks/useReview';
import { useAuth } from '@/hooks/useAuth';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { ProductSize, Topping } from '@/types';
import { priceWithSign } from '@/utils/helper';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import Title1 from '@/components/shared/typo/Title1';
import Title3 from '@/components/shared/typo/Title3';
import PageLoading from '@/components/shared/PageLoading';
import ProductRatingDisplay from './ProductRatingDisplay';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import BackButtonWithText from '@/components/shared/BackButton';

/**
 * Trang chi tiết sản phẩm với đánh giá và review
 * Hiển thị thông tin sản phẩm, rating, và cho phép user thêm review
 */
export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useShoppingCart();
    const { getProductById } = useProduct();
    const { getProductReviews, getProductRating, addReview, hasUserReviewed } = useReview();

    const [selectedSize, setSelectedSize] = useState<ProductSize>(ProductSize.Medium);
    const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const product = getProductById(id || '');
    const reviews = getProductReviews(id || '');
    const rating = getProductRating(id || '');

    if (!product) {
        return (
            <div className="max-w-screen-sm mx-auto p-4 mt-20">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-600 mb-4">Sản phẩm không tồn tại</h1>
                    <ButtonFilled onClick={() => navigate('/products')}>
                        Quay lại danh sách
                    </ButtonFilled>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedSize, selectedToppings);
        navigate('/checkout');
    };

    const handleReviewSubmit = (rating: number, comment: string) => {
        if (!user) {
            alert('Vui lòng đăng nhập để đánh giá sản phẩm');
            return;
        }

        addReview({
            productId: product.id,
            userId: user.id,
            userName: user.name,
            userAvatar: user.image,
            rating,
            comment,
            isVerified: true, // Mock: giả sử user đã mua sản phẩm
        });

        setShowReviewForm(false);
        alert('Cảm ơn bạn đã đánh giá sản phẩm!');
    };

    const canReview = user && !hasUserReviewed(product.id, user.id);

    return (
        <div className="max-w-screen-sm mx-auto p-4 mt-20">
            {/* Back Button */}
            <div className="mb-4">
                <BackButtonWithText text="Quay lại danh sách" />
            </div>
            
            {/* Thông tin sản phẩm */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.displayName}
                    className="w-full h-64 object-cover"
                />

                <div className="p-6">
                    <Title1>{product.displayName}</Title1>
                    <p className="text-gray-600 mt-2">{product.description}</p>

                    {/* Rating */}
                    <ProductRatingDisplay rating={rating} />

                    {/* Giá */}
                    <div className="mt-4">
                        <span className="text-2xl font-bold text-primary">
                            {priceWithSign(product.sizes.find(s => s.size === selectedSize)?.price || product.basePrice)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Chọn size và topping */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <Title3>Chọn size</Title3>
                <div className="flex gap-2 mt-3">
                    {product.sizes.map((size) => (
                        <button
                            key={size.size}
                            onClick={() => setSelectedSize(size.size)}
                            className={`px-4 py-2 rounded-lg border ${selectedSize === size.size
                                    ? 'bg-primary text-white border-primary'
                                    : 'border-gray-300 text-gray-700'
                                }`}
                        >
                            {size.size} - {priceWithSign(size.price)}
                        </button>
                    ))}
                </div>

                {product.toppings.length > 0 && (
                    <>
                        <Title3 className="mt-6">Topping</Title3>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            {product.toppings.map((topping) => (
                                <label key={topping.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedToppings.some(t => t.id === topping.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedToppings([...selectedToppings, topping]);
                                            } else {
                                                setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
                                            }
                                        }}
                                        className="rounded"
                                    />
                                    <span className="text-sm">
                                        {topping.name} (+{priceWithSign(topping.price)})
                                    </span>
                                </label>
                            ))}
                        </div>
                    </>
                )}

                {/* Số lượng */}
                <div className="mt-6">
                    <Title3>Số lượng</Title3>
                    <div className="flex items-center gap-3 mt-3">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                            -
                        </button>
                        <span className="text-lg font-semibold">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Nút thêm vào giỏ */}
                <div className="mt-6">
                    <ButtonFilled onClick={handleAddToCart} className="w-full">
                        Thêm vào giỏ hàng
                    </ButtonFilled>
                </div>
            </div>

            {/* Đánh giá */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                    <Title3>Đánh giá sản phẩm</Title3>
                    {canReview && (
                        <ButtonFilled onClick={() => setShowReviewForm(true)}>
                            Viết đánh giá
                        </ButtonFilled>
                    )}
                </div>

                {showReviewForm && (
                    <ReviewForm
                        onSubmit={handleReviewSubmit}
                        onCancel={() => setShowReviewForm(false)}
                    />
                )}

                <ReviewList reviews={reviews} />
            </div>
        </div>
    );
}
