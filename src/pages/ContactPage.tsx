import { useState } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { ContactMessage } from '@/types';
import Title1 from '@/components/shared/typo/Title1';
import Title3 from '@/components/shared/typo/Title3';
import ButtonFilled from '@/components/shared/button/ButtonFilled';

/**
 * Trang liên hệ
 * Form gửi thông tin liên hệ và thông tin cửa hàng
 */
export default function ContactPage() {
  const { notifySystem } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock: Lưu thông tin liên hệ vào localStorage
      const contactMessage: ContactMessage = {
        id: `contact_${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'new',
      };

      const savedMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      savedMessages.push(contactMessage);
      localStorage.setItem('contact_messages', JSON.stringify(savedMessages));

      // Thông báo thành công
      notifySystem(
        'Gửi liên hệ thành công!',
        'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
        'success'
      );

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4 mt-20">
      <Title1>Liên hệ với chúng tôi</Title1>
      <p className="text-gray-600 mb-8">
        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi
        qua các kênh dưới đây hoặc gửi tin nhắn trực tiếp.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form liên hệ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <Title3>Gửi tin nhắn</Title3>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Nhập email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chủ đề *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Chọn chủ đề</option>
                <option value="feedback">Góp ý về dịch vụ</option>
                <option value="complaint">Khiếu nại</option>
                <option value="suggestion">Đề xuất cải tiến</option>
                <option value="partnership">Hợp tác kinh doanh</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Nhập nội dung tin nhắn"
              />
            </div>

            <ButtonFilled type="submit" className="w-full" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </ButtonFilled>
          </form>
        </div>

        {/* Thông tin liên hệ */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <Title3>Thông tin liên hệ</Title3>
            <div className="space-y-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📞</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Điện thoại</h4>
                  <p className="text-gray-600">028 3822 1234</p>
                  <p className="text-sm text-gray-500">Thứ 2 - Chủ nhật: 7:00 - 22:00</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">✉️</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600">info@coffeeshop.com</p>
                  <p className="text-sm text-gray-500">Phản hồi trong 24h</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">📍</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Địa chỉ</h4>
                  <p className="text-gray-600">
                    123 Nguyễn Huệ, Quận 1<br />
                    TP. Hồ Chí Minh
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <Title3>Mạng xã hội</Title3>
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📘</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Facebook</h4>
                  <p className="text-gray-600">@coffeeshop</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-2xl">📷</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Instagram</h4>
                  <p className="text-gray-600">@coffeeshop</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-2xl">🐦</div>
                <div>
                  <h4 className="font-semibold text-gray-800">Twitter</h4>
                  <p className="text-gray-600">@coffeeshop</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <Title3>Giờ mở cửa</Title3>
            <div className="space-y-2 mt-4 text-sm">
              <div className="flex justify-between">
                <span>Thứ 2 - Thứ 6:</span>
                <span>7:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Thứ 7:</span>
                <span>7:00 - 23:00</span>
              </div>
              <div className="flex justify-between">
                <span>Chủ nhật:</span>
                <span>7:00 - 23:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
