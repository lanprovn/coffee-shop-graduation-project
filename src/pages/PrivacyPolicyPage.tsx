import PageContainer from '@/components/shared/docs-page/PageContainer';
import DocTitle1 from '@/components/shared/docs-page/DocTitle1';
import DocTitle2 from '@/components/shared/docs-page/DocTitle2';
import DocTitle3 from '@/components/shared/docs-page/DocTitle3';

export default function PrivacyPolicyPage() {
  return (
    <PageContainer>
      <DocTitle1>Chính sách bảo mật</DocTitle1>
      <p>
        Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ
        thông tin mà bạn cung cấp khi sử dụng ứng dụng cửa hàng cà phê thương
        mại điện tử này. Ứng dụng được xây dựng với mục đích trưng bày danh mục
        dự án và thử nghiệm. Chúng tôi cam kết bảo đảm tính riêng tư và an toàn
        cho thông tin cá nhân của bạn.
      </p>

      <DocTitle2>Thông tin chúng tôi thu thập</DocTitle2>

      <DocTitle3>Đăng nhập bằng Google:</DocTitle3>
      <p>
        Ứng dụng cho phép người dùng đăng nhập bằng tài khoản Google. Khi bạn
        đăng nhập, ứng dụng sẽ nhận được thông tin cơ bản như họ tên và địa chỉ
        email của bạn.
      </p>

      <DocTitle3>Lưu trữ cục bộ (Local Storage):</DocTitle3>
      <p>
        Ứng dụng lưu một số dữ liệu trong trình duyệt của bạn (localStorage) để
        duy trì phiên đăng nhập.
      </p>

      <DocTitle2>Cách chúng tôi sử dụng thông tin của bạn</DocTitle2>
      <p>
        Thông tin thu thập qua đăng nhập Google chỉ được dùng cho mục đích xác
        thực. Dữ liệu lưu trong trình duyệt được dùng để duy trì phiên làm việc
        của bạn trong ứng dụng.
      </p>

      <DocTitle2>Bảo mật dữ liệu</DocTitle2>
      <p>
        Chúng tôi cam kết bảo đảm an toàn cho thông tin của bạn. Mặc dù áp dụng
        các biện pháp bảo mật tiêu chuẩn, xin lưu ý rằng không có phương thức
        truyền tải hoặc lưu trữ điện tử nào an toàn tuyệt đối 100%. Thông tin
        đăng nhập Google của bạn được xử lý an toàn thông qua dịch vụ xác thực
        của Google.
      </p>

      <DocTitle2>Lưu trữ và xóa dữ liệu</DocTitle2>
      <p>
        Toàn bộ dữ liệu được lưu trong localStorage của trình duyệt sẽ bị xóa tự
        động khi bạn đăng xuất khỏi ứng dụng. Chúng tôi không lưu giữ bất kỳ dữ
        liệu người dùng nào sau khi kết thúc giai đoạn thử nghiệm hoặc trình
        diễn danh mục.
      </p>

      <DocTitle2>Dịch vụ của bên thứ ba</DocTitle2>
      <p>
        Ứng dụng sử dụng dịch vụ đăng nhập Google cho mục đích xác thực. Vui lòng
        tham khảo{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chính sách bảo mật của Google
        </a>{' '}
        để biết thêm chi tiết về cách Google xử lý dữ liệu người dùng.
      </p>

      <DocTitle2>Thay đổi đối với Chính sách bảo mật</DocTitle2>
      <p>
        Chúng tôi có quyền cập nhật hoặc thay đổi Chính sách bảo mật này bất kỳ
        lúc nào. Mọi thay đổi sẽ có hiệu lực ngay khi phiên bản mới được đăng
        tải trên ứng dụng.
      </p>

      <DocTitle2>Liên hệ với chúng tôi</DocTitle2>
      <p>
        Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về Chính sách bảo mật này,
        vui lòng liên hệ qua email:{' '}
        <a
          href="mailto:info@coffeeshop.com"
          className="text-primary underline"
        >
          info@coffeeshop.com
        </a>
        .
      </p>

      <p>
        Chính sách bảo mật này được cập nhật lần cuối vào{' '}
        <strong>ngày 25 tháng 1 năm 2024</strong>.
      </p>
    </PageContainer>
  );
}
