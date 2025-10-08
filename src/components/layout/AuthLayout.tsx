import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function AuthLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {navigate('/');}
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-primary-50 to-gray-100">
      {/* Chỉ render nội dung con (LoginPage) ở giữa màn hình */}
      <Outlet />
    </div>
  );
}
