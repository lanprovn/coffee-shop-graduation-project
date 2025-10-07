/**
 * Mock Google OAuth Service - Frontend Only
 * 
 * Thay thế Google OAuth API calls bằng mock data
 * Không có API calls thực đến Google
 */

export interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export const getUserFromGoogleOAuthAPI = async (
  accessToken: string
): Promise<GoogleUser | null> => {
  try {
    // Mock implementation - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user data
    const mockUser: GoogleUser = {
      id: 'google_' + Date.now(),
      email: 'demo.user@example.com',
      verified_email: true,
      name: 'Mock Google User',
      given_name: 'Mock',
      family_name: 'User',
      picture: '/images/male-avatar.png',
      locale: 'vi'
    };

    console.log('Mock Google OAuth: Returning mock user data');
    return mockUser;
  } catch (error: any) {
    console.error('❌ Mock Google OAuth Error:', error);
    return null;
  }
};