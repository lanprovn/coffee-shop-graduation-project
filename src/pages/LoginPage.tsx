import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageLoading from '@/components/shared/PageLoading';
import Title1 from '@/components/shared/typo/Title1';

export default function LoginPage() {
  const [isLoading, setLoading] = useState(false);
  const [fbBtnClick, setFbBtnClick] = useState(false);
  const navigate = useNavigate(); // ✅ thêm dòng này

  const handleFakeLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Đăng nhập thành công (demo giao diện)');
      navigate('/'); // ✅ chuyển về trang chính
    }, 1000);
  };

  const handleFaceBookLoginClick = () => {
    setFbBtnClick(true);
    setTimeout(() => {
      setFbBtnClick(false);
    }, 2000);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200 p-6">
        <div className="flex flex-col w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 mx-auto border border-primary/10">
          <div className="flex items-center gap-3 mb-10 mx-auto">
            <img
              src="/images/app-logo.svg"
              alt="Logo ứng dụng"
              className="w-20 h-20 rounded-full object-cover"
            />
            <p className="text-primary">
              <span className="block text-xl font-thin">Coffee</span>
              <span className="block text-2xl font-semibold">Shop</span>
            </p>
          </div>

          <Title1 className="text-primary">Đăng nhập</Title1>
          <p className="text-gray-500 font-medium mt-2 text-center">
            Đăng nhập để tiếp tục hành trình thưởng thức cà phê của bạn
          </p>

          <div className="space-y-4 mt-12">
            <button
              onClick={handleFakeLogin}
              type="button"
              className="inline-flex items-center justify-center gap-2 w-full bg-white text-gray-800 text-sm font-medium border rounded-lg px-5 py-2.5 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-100 transition"
            >
              <svg
                className="w-5 h-5"
                viewBox="-3 0 262 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <path
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  fill="#4285F4"
                />
                <path
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  fill="#34A853"
                />
                <path
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  fill="#FBBC05"
                />
                <path
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  fill="#EB4335"
                />
              </svg>
              Đăng nhập bằng Google
            </button>

            <hr />

            <button
              type="button"
              onClick={handleFaceBookLoginClick}
              className="inline-flex items-center justify-center gap-2 w-full bg-[#3b5998] hover:bg-[#3b5998]/90 text-white text-sm font-medium border rounded-lg px-5 py-2.5 focus:outline-none focus:ring-2 focus:[#3b5998]/50 transition"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 8 19"
              >
                <path
                  fillRule="evenodd"
                  d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                  clipRule="evenodd"
                />
              </svg>
              Đăng nhập bằng Facebook
            </button>

            {fbBtnClick && (
              <p className="text-red-600 text-sm font-medium text-center">
                Tính năng này hiện chưa được hỗ trợ!
              </p>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
      <PageLoading show={isLoading} />
    </>
  );
}
