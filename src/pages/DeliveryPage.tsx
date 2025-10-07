import PageContainer from '@/components/shared/docs-page/PageContainer';
import DocTitle1 from '@/components/shared/docs-page/DocTitle1';
import DocTitle2 from '@/components/shared/docs-page/DocTitle2';

export default function DeliveryPage() {
    return (
        <PageContainer>
            <DocTitle1>Giao hàng tận nơi</DocTitle1>
            <p className="text-gray-600 mb-6">
                Coffee Shop mang đến dịch vụ giao hàng nhanh chóng và tiện lợi.
                Bạn có thể đặt món yêu thích và nhận tại nhà chỉ trong vài phút!
            </p>

            <DocTitle2>🚚 Khu vực giao hàng</DocTitle2>
            <ul className="list-disc ml-5 space-y-2">
                <li>Hiện hỗ trợ giao hàng tại TP. Hồ Chí Minh và Hà Nội.</li>
                <li>Đang mở rộng sang các tỉnh lân cận (Bình Dương, Đồng Nai...)</li>
                <li>Với đơn hàng 200.000₫, miễn phí giao trong bán kính 3km.</li>
            </ul>

            <DocTitle2>💵 Phí giao hàng</DocTitle2>
            <ul className="list-disc ml-5 space-y-2">
                <li>Phí giao hàng tiêu chuẩn: <strong>20.000₫ / đơn</strong></li>
                <li>Miễn phí cho đơn từ <strong>200.000₫</strong> trở lên</li>
                <li>Phí có thể thay đổi tùy vị trí hoặc thời tiết</li>
            </ul>

            <DocTitle2>⏰ Thời gian giao hàng</DocTitle2>
            <p>
                Giao hàng từ <strong>7:00 – 21:00</strong> mỗi ngày.
                Thời gian giao dự kiến từ <strong>15 – 45 phút</strong> tuỳ khoảng cách.
            </p>

            <DocTitle2>📱 Cách đặt hàng</DocTitle2>
            <ul className="list-disc ml-5 space-y-2">
                <li>Chọn món từ mục <strong>Thực đơn</strong></li>
                <li>Thêm vào giỏ hàng và chọn phương thức <strong>Giao tận nơi</strong></li>
                <li>Thanh toán bằng tiền mặt hoặc ví điện tử</li>
            </ul>

            <DocTitle2>📦 Theo dõi đơn hàng</DocTitle2>
            <p>
                Sau khi đặt hàng, bạn có thể theo dõi tình trạng đơn tại trang{' '}
                <strong>“Lịch sử đơn hàng”</strong> hoặc kiểm tra trong ứng dụng.
            </p>

            <DocTitle2>📞 Liên hệ hỗ trợ</DocTitle2>
            <p>
                Nếu đơn hàng của bạn bị trễ hoặc cần thay đổi, vui lòng liên hệ Hotline:{' '}
                <a href="tel:18001234" className="text-primary underline">
                    1800 1234
                </a>
            </p>

            <p className="text-sm text-gray-500 mt-8">
                Chính sách giao hàng được cập nhật lần cuối: <strong>Tháng 10/2025</strong>.
            </p>
        </PageContainer>
    );
}
