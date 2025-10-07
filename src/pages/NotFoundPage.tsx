import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import ButtonOutline from '@/components/shared/button/ButtonOutline';
import Title3 from '@/components/shared/typo/Title3';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center w-full py-20 px-10">
      <img
        src="/images/empty-folder.png"
        alt="Không tìm thấy trang"
        className="w-3/4 mx-auto"
      />
      <div className="text-center mt-2 mb-4">
        <Title3>Không tìm thấy kết quả</Title3>
        <p className="text-gray-500 mt-2">
          Chúng tôi không thể tìm thấy nội dung bạn đang tìm kiếm.
        </p>
      </div>
      <ButtonOutline onClick={() => navigate(-1)} className="w-fit">
        <span>Quay lại</span>
        <ArrowRightIcon className="w-4 h-4" />
      </ButtonOutline>
    </div>
  );
}
