import { AuthUser } from '@/types';

// Mock auth hook for POS - no authentication needed
export const useAuth = () => {
  // Return a mock user for POS system
  const mockUser: AuthUser = {
    id: 'pos-user',
    name: 'POS User',
    email: 'pos@highlandcoffee.com',
    image: '/images/male-avatar.png'
  };

  return {
    user: mockUser,
    login: async () => {},
    logout: () => {},
    register: async () => {}
  };
};
