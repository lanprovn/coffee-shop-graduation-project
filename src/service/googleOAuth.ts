/**
 * Mock Google OAuth Service - Frontend Only
 * 
 * Thay thế Google OAuth API calls bằng mock data
 * Không có API calls thực đến Google
 */

export interface GoogleUser {
  id: string;
  email: string;
  verifiedEmail: boolean;
  name: string;
  givenName: string;
  familyName: string;
  picture: string;
  locale: string;
}

export const getUserFromGoogleOAuthAPI = async (
  _accessToken: string
): Promise<GoogleUser | null> => {
  try {
    // Mock implementation - simulate API delay
    const API_DELAY_MS = 1000;
    await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

    // Mock user data
    const mockUser: GoogleUser = {
      id: 'google_' + Date.now(),
      email: 'demo.user@example.com',
      verifiedEmail: true,
      name: 'Mock Google User',
      givenName: 'Mock',
      familyName: 'User',
      picture: '/images/male-avatar.png',
      locale: 'vi'
    };

    // Mock OAuth response logged for development
    // console.log('Mock Google OAuth: Returning mock user data');
    return mockUser;
  } catch (error: unknown) {
    // Mock OAuth error logged for development
    // console.error('❌ Mock Google OAuth Error:', error);
    return null;
  }
};