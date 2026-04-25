import { api } from '../api/axios';

export interface User {
  id: string | number;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  firstName: string;
  lastName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  message?: string;
}

// Token management utilities
class TokenManager {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  // Get tokens from secure storage
  getTokens(): AuthTokens | null {
    try {
      const accessToken = this.getCookie(this.ACCESS_TOKEN_KEY);
      const refreshToken = this.getCookie(this.REFRESH_TOKEN_KEY);
      
      if (!accessToken) {
        return null;
      }

      return { 
        accessToken, 
        refreshToken: refreshToken || accessToken // Fallback to access token if refresh is missing
      };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  }

  // Set tokens in secure storage
  setTokens(tokens: AuthTokens): void {
    try {
      // Set cookies - Note: httpOnly cannot be set from JS, but we'll use secure cookies
      this.setCookie(this.ACCESS_TOKEN_KEY, tokens.accessToken, {
        secure: window.location.protocol === 'https:',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days (as per backend expiration)
      });

      if (tokens.refreshToken) {
        this.setCookie(this.REFRESH_TOKEN_KEY, tokens.refreshToken, {
          secure: window.location.protocol === 'https:',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });
      }
    } catch (error) {
      console.error('Error setting tokens:', error);
      throw error;
    }
  }

  // Clear all tokens
  clearTokens(): void {
    try {
      this.deleteCookie(this.ACCESS_TOKEN_KEY);
      this.deleteCookie(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // Get user data from localStorage (non-sensitive data only)
  getUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Set user data in localStorage (non-sensitive data only)
  setUser(user: User): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  }

  // Clear user data
  clearUser(): void {
    try {
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const user = this.getUser();
    return !!(accessToken && user);
  }

  // Get access token for API calls
  getAccessToken(): string | null {
    return this.getCookie(this.ACCESS_TOKEN_KEY);
  }

  // Refresh access token
  async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = this.getCookie(this.REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        return null;
      }

      // If backend doesn't support refresh yet, just return current
      // const response = await api.post('/auth/refresh', { refreshToken });
      // return response.data.accessToken;
      return refreshToken; 
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  // Cookie utilities
  private setCookie(name: string, value: string, options: {
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
    path?: string;
  }): void {
    let cookieString = `${name}=${value};`;
    
    if (options.secure) cookieString += ' Secure;';
    if (options.sameSite) cookieString += ` SameSite=${options.sameSite};`;
    if (options.maxAge) cookieString += ` Max-Age=${options.maxAge};`;
    cookieString += ` Path=${options.path || '/'};`;
    
    document.cookie = cookieString;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        return cookie.substring(nameEQ.length);
      }
    }
    
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=0; Path=/;`;
  }
}

// Create singleton instance
export const tokenManager = new TokenManager();

// Authentication service
export class AuthService {
  // Login with email and password
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // Register new user
  async register(userData: {
    email: string;
    password: string;
    role: 'PATIENT' | 'DOCTOR';
    firstName?: string;
    lastName?: string;
  }): Promise<void> {
    try {
      await api.post('/auth/register', userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call server to invalidate tokens
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local tokens
      tokenManager.clearTokens();
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return tokenManager.getUser();
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put<User>('/auth/profile', userData);
      const updatedUser = response.data;
      
      // Update stored user data
      tokenManager.setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/auth/request-password-reset', { email });
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Verify email with token
  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }

  // Admin: Get all users
  async getAllUsers(): Promise<UserCredentials[]> {
    const response = await api.get('/auth/users');
    return response.data;
  }

  // Admin: Update user status
  async updateUserStatus(id: number, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Promise<void> {
    await api.put(`/auth/users/${id}/status`, { status });
  }
}

interface UserCredentials {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  status: string;
}

// Create singleton instance
export const authService = new AuthService();

// Utility functions for components
export const getAuthHeaders = () => {
  const token = tokenManager.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const requireAuth = () => {
  if (!tokenManager.isAuthenticated()) {
    throw new Error('Authentication required');
  }
};

export const hasRole = (role: string): boolean => {
  const user = tokenManager.getUser();
  return user?.role === role;
};

export const hasAnyRole = (roles: string[]): boolean => {
  const user = tokenManager.getUser();
  return user ? roles.includes(user.role) : false;
};
