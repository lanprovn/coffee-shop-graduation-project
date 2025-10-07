import { useMembership } from '@/hooks/useMembership';
import { useAuth } from '@/hooks/useAuth';
import { priceWithSign } from '@/utils/helper';
import Title1 from '@/components/shared/typo/Title1';
import Title3 from '@/components/shared/typo/Title3';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';
import {
    StarIcon,
    GiftIcon,
    TrophyIcon,
    SparklesIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

/**
 * MembershipPage: Trang thông tin thành viên với UI/UX cải thiện
 * Hiển thị cấp độ thành viên hiện tại, quyền lợi và tiến độ lên cấp
 */
export default function MembershipPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const {
        userProfile,
        memberships,
        getCurrentMembership,
        getNextMembership,
        getProgressToNextLevel,
    } = useMembership();

    if (!user) {
        return (
            <div className="max-w-screen-lg mx-auto p-4 mt-20">
                <div className="text-center py-16">
                    <div className="text-8xl mb-6">👑</div>
                    <Title1 className="text-gray-800 mb-4">Chương trình thành viên</Title1>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Đăng nhập để tham gia chương trình thành viên và nhận nhiều ưu đãi hấp dẫn!
                    </p>
                    <div className="flex gap-4 justify-center">
                        <ButtonFilled onClick={() => navigate('/login')}>
                            Đăng nhập
                        </ButtonFilled>
                        <ButtonOutline onClick={() => navigate('/register')}>
                            Đăng ký
                        </ButtonOutline>
                    </div>
                </div>
            </div>
        );
    }

    const currentMembership = getCurrentMembership();
    const nextMembership = getNextMembership();
    const progress = getProgressToNextLevel();

    const handleShopNow = () => {
        navigate('/products');
    };

    return (
        <div className="max-w-screen-lg mx-auto p-4 mt-20">
            {/* Header */}
            <div className="text-center mb-8">
                <Title1 className="text-gray-800 mb-2">Chương trình thành viên</Title1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Tích điểm với mỗi lần mua sắm và nhận nhiều ưu đãi độc quyền từ Coffee Shop
                </p>
            </div>

            {/* Current Membership Card */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-3xl p-8 mb-8 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl backdrop-blur-sm">
                            {currentMembership.icon}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-1">
                                {currentMembership.name}
                            </h2>
                            <p className="text-primary-100">
                                Cấp độ thành viên hiện tại
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">{userProfile?.points || 0}</div>
                        <div className="text-primary-100 text-sm">điểm tích lũy</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                        <CurrencyDollarIcon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-lg font-semibold">{priceWithSign(userProfile?.totalSpent || 0)}</div>
                        <div className="text-xs text-primary-100">Tổng chi tiêu</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                        <ShoppingBagIcon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-lg font-semibold">{userProfile?.totalOrders || 0}</div>
                        <div className="text-xs text-primary-100">Đơn hàng</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                        <GiftIcon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-lg font-semibold">{currentMembership.discountPercentage}%</div>
                        <div className="text-xs text-primary-100">Giảm giá</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                        <StarIcon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-lg font-semibold">{currentMembership.pointsMultiplier}x</div>
                        <div className="text-xs text-primary-100">Tích điểm</div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Current Benefits */}
                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        <Title3>Quyền lợi hiện tại</Title3>
                    </div>
                    <div className="space-y-3">
                        {currentMembership.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-gray-700">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Level Progress */}
                {nextMembership && (
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <TrophyIcon className="w-6 h-6 text-yellow-500" />
                            <Title3>Tiến độ lên cấp {nextMembership.level}</Title3>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Tiến độ</span>
                                <span>{progress.progress.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${progress.progress}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Còn <span className="font-semibold text-primary">{priceWithSign(progress.remaining)}</span> để lên cấp {nextMembership.level}
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <SparklesIcon className="w-5 h-5 text-yellow-500" />
                                <span className="font-semibold text-gray-800">Quyền lợi khi lên cấp</span>
                            </div>
                            <div className="space-y-2">
                                {nextMembership.benefits.slice(0, 3).map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <ArrowRightIcon className="w-4 h-4 text-yellow-500" />
                                        <span className="text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* All Membership Levels */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm mb-8">
                <Title3 className="mb-6">Tất cả cấp độ thành viên</Title3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {memberships.map((membership) => (
                        <div
                            key={membership.id}
                            className={`p-6 rounded-xl border-2 transition-all duration-200 ${membership.id === currentMembership.id
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }`}
                        >
                            <div className="text-center mb-4">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
                                    style={{ backgroundColor: membership.color }}
                                >
                                    {membership.icon}
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg mb-1">
                                    {membership.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Từ {priceWithSign(membership.minSpent)} chi tiêu
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Giảm giá</span>
                                    <span className="font-semibold text-green-600">{membership.discountPercentage}%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Tích điểm</span>
                                    <span className="font-semibold text-blue-600">{membership.pointsMultiplier}x</span>
                                </div>
                            </div>

                            {membership.id === currentMembership.id && (
                                <div className="mt-4 text-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                                        Cấp độ hiện tại
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* How to Earn Points */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <StarIcon className="w-6 h-6 text-blue-500" />
                    <Title3>Cách tích điểm</Title3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">Mua sắm</h4>
                        <p className="text-sm text-gray-600">1 điểm = 1.000đ chi tiêu</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <GiftIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">Đánh giá sản phẩm</h4>
                        <p className="text-sm text-gray-600">10 điểm/đánh giá</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <SparklesIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">Sinh nhật</h4>
                        <p className="text-sm text-gray-600">100 điểm miễn phí</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
                <ButtonFilled onClick={handleShopNow} className="px-8 py-3 text-lg">
                    <ShoppingBagIcon className="w-5 h-5 mr-2" />
                    Mua sắm ngay để tích điểm
                </ButtonFilled>
                <p className="text-sm text-gray-500 mt-3">
                    Mỗi lần mua sắm đều được tích điểm và áp dụng giảm giá tự động
                </p>
            </div>
        </div>
    );
}