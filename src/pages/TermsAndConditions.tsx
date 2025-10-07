import { Link } from 'react-router-dom';
import PageContainer from '@/components/shared/docs-page/PageContainer';
import DocTitle1 from '@/components/shared/docs-page/DocTitle1';
import DocTitle2 from '@/components/shared/docs-page/DocTitle2';
import DocTitle3 from '@/components/shared/docs-page/DocTitle3';

export default function TermsAndConditions() {
  return (
    <PageContainer>
      <DocTitle1>Điều khoản sử dụng</DocTitle1>

      <DocTitle2>1. Chấp nhận điều khoản</DocTitle2>
      <p>
        Khi sử dụng ứng dụng cửa hàng cà phê thương mại điện tử của chúng tôi,
        bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản dưới đây. Nếu
        bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng ứng
        dụng.
      </p>

      <DocTitle2>2. Mục đích sử dụng ứng dụng</DocTitle2>
      <p>
        Bạn đồng ý chỉ sử dụng ứng dụng cho các mục đích hợp pháp và chính đáng.
        Bạn không được phép vi phạm bất kỳ luật hoặc quy định nào trong quá
        trình sử dụng ứng dụng.
      </p>

      <DocTitle2>3. Tài khoản người dùng</DocTitle2>
      <p>
        Nếu bạn tạo tài khoản với chúng tôi, bạn có trách nhiệm giữ bí mật thông
        tin tài khoản của mình, bao gồm cả mật khẩu. Bạn đồng ý chịu trách nhiệm
        cho mọi hoạt động được thực hiện dưới tài khoản của bạn.
      </p>

      <DocTitle2>4. Chính sách bảo mật</DocTitle2>
      <p>
        Việc bạn sử dụng ứng dụng cũng được điều chỉnh bởi{' '}
        <Link to="/privacy-policy" className="underline">
          Chính sách bảo mật
        </Link>
        . Vui lòng đọc kỹ để hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ
        liệu cá nhân của bạn.
      </p>

      <DocTitle2>5. Giới hạn trách nhiệm</DocTitle2>
      <p>
        Chúng tôi không chịu trách nhiệm đối với bất kỳ thiệt hại trực tiếp,
        gián tiếp, ngẫu nhiên, hệ quả hoặc hình phạt nào phát sinh từ việc bạn
        sử dụng ứng dụng.
      </p>

      <DocTitle2>6. Thay đổi điều khoản</DocTitle2>
      <p>
        Chúng tôi có quyền cập nhật hoặc thay đổi các điều khoản này bất kỳ lúc
        nào. Mọi thay đổi sẽ có hiệu lực ngay khi được đăng tải trên ứng dụng.
      </p>

      <DocTitle2>7. Sử dụng hình ảnh</DocTitle2>
      <p>
        Chúng tôi xin ghi nhận rằng một số hình ảnh trong ứng dụng được lấy từ
        Starbucks và Flaticon. Các hình ảnh này tuân theo điều khoản sử dụng của
        từng bên tương ứng.
      </p>

      <DocTitle3>Hình ảnh từ Starbucks:</DocTitle3>
      <p>
        Các hình ảnh lấy từ Starbucks là tài sản của Công ty Starbucks và chỉ
        được sử dụng cho mục đích trưng bày và thử nghiệm. Chúng tôi không tuyên
        bố quyền sở hữu đối với những hình ảnh này.
      </p>

      <DocTitle3>Biểu tượng từ Flaticon:</DocTitle3>
      <p>
        Các biểu tượng (icon) lấy từ Flaticon tuân theo điều khoản cấp phép của
        Flaticon. Chúng được sử dụng cho mục đích trưng bày và thử nghiệm, và
        chúng tôi không tuyên bố quyền sở hữu đối với các biểu tượng đó.
      </p>

      <DocTitle2>8. Quyền sở hữu trí tuệ</DocTitle2>
      <p>
        Tất cả quyền sở hữu trí tuệ liên quan đến nội dung của ứng dụng, bao gồm
        hình ảnh, logo và biểu tượng, đều thuộc về chủ sở hữu hợp pháp của
        chúng. Mọi hành vi sử dụng hoặc sao chép trái phép đều bị nghiêm cấm.
      </p>

      <DocTitle2>9. Liên hệ</DocTitle2>
      <p>
        Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về các điều khoản này, vui
        lòng liên hệ với chúng tôi qua email:{' '}
        <a
          href="mailto:info@coffeeshop.com"
          className="text-primary underline"
        >
          info@coffeeshop.com
        </a>
        .
      </p>

      <p>
        Các điều khoản này được cập nhật lần cuối vào{' '}
        <strong>ngày 25 tháng 1 năm 2024</strong>.
      </p>
    </PageContainer>
  );
}
