import PageContainer from '@/components/shared/docs-page/PageContainer';
import DocTitle1 from '@/components/shared/docs-page/DocTitle1';
import DocTitle2 from '@/components/shared/docs-page/DocTitle2';
import DocTitle3 from '@/components/shared/docs-page/DocTitle3';

export default function AboutPage() {
    return (
        <PageContainer>
            <DocTitle1>Về Coffee Shop</DocTitle1>
            <p>
                Mỗi quán cà phê đều bắt đầu từ một hạt – hạt cà phê và hạt ý tưởng.
                <strong> Coffee Shop </strong> ra đời với mong muốn mang đến không gian nơi con người
                có thể dừng lại, hít thở và cảm nhận hương vị thật của cuộc sống.
            </p>
            <p>
                Ở đây, mỗi tách cà phê là một câu chuyện, một khoảnh khắc kết nối giữa con người và cảm xúc.
                Chúng tôi tin rằng hương thơm, âm nhạc và ánh sáng dịu là ba nốt nhạc
                giúp cuộc sống chậm lại — nhưng sâu hơn.
            </p>

            <DocTitle2>Tầm nhìn</DocTitle2>
            <p>
                Coffee Shop hướng tới việc xây dựng một không gian cà phê hiện đại nhưng vẫn giữ được hồn Việt —
                nơi công nghệ, con người và cảm xúc hòa quyện.
                Chúng tôi không chỉ phục vụ cà phê, mà tạo nên trải nghiệm.
            </p>

            <DocTitle2>Sứ mệnh</DocTitle2>
            <p>
                - Mang đến chất lượng nguyên bản trong từng tách cà phê, từ hạt chọn đến tay pha. <br />
                - Tạo ra không gian kết nối, nơi mỗi cuộc trò chuyện đều đáng nhớ. <br />
                - Lan tỏa lối sống chậm rãi, tinh tế, và đầy cảm hứng.
            </p>

            <DocTitle2>Giá trị cốt lõi</DocTitle2>
            <DocTitle3>Chân thật</DocTitle3>
            <p>
                Chúng tôi không tìm cách phô trương — chỉ mong hương vị tự thân của cà phê
                nói thay điều chúng tôi tin tưởng.
            </p>

            <DocTitle3>Tận tâm</DocTitle3>
            <p>
                Mỗi chi tiết trong không gian, mỗi ly cà phê được pha ra,
                đều là kết quả của sự chăm chút và tình yêu dành cho nghề.
            </p>

            <DocTitle3>Cởi mở</DocTitle3>
            <p>
                Coffee Shop luôn chào đón mọi câu chuyện, mọi con người.
                Một nơi để bạn làm việc, sẻ chia, hoặc chỉ đơn giản là yên tĩnh bên tách cà phê của riêng mình.
            </p>

            <DocTitle2>Liên hệ</DocTitle2>
            <p>
                Mọi góp ý và phản hồi xin gửi về:{' '}
                <a
                    href="mailto:info@coffeeshop.com"
                    className="text-primary underline"
                >
                    info@coffeeshop.com
                </a>
            </p>
        </PageContainer>
    );
}
