import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AuthUser } from '@/types';
import AuthContext from '@/hooks/context/AuthContext';

const keyName = 'coffee-shop-auth-user';

type AuthProviderProps = {
  children: JSX.Element | JSX.Element[];
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useLocalStorage<AuthUser>(keyName, null);
  // Router
  const navigate = useNavigate();

  const login = useCallback(
    async (data: AuthUser, redirectUrl?: string) => {
      setUser(data);
      navigate(redirectUrl || '/', { replace: true });
    },
    [navigate, setUser]
  );

  const logout = useCallback(() => {
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate, setUser]);

  const register = useCallback(async (data: { name: string; email: string; password: string; phone: string }) => {
    // Mock registration - trong thực tế sẽ gọi API
    const newUser: AuthUser = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      image: '/images/male-avatar.png',
    };

    // Lưu user vào localStorage
    localStorage.setItem('coffee-shop-users', JSON.stringify([
      ...JSON.parse(localStorage.getItem('coffee-shop-users') || '[]'),
      { ...data, id: newUser.id }
    ]));

    // Không tự động login sau khi register
    // User cần login riêng
  }, []);

  // Event Listener for localstorage changes
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onStorageUpdate = (e: any) => {
      const { key, newValue } = e;

      if (key === null) {
        logout();
      }

      if (key === keyName) {
        if (!newValue) {
          logout();
        }
        const objVal = JSON.parse(newValue as string) as AuthUser | null;
        if (objVal?.id) {
          login(objVal);
        }
      }
    };

    window.addEventListener('storage', onStorageUpdate);
    return () => {
      window.removeEventListener('storage', onStorageUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      register,
    }),
    [login, logout, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
