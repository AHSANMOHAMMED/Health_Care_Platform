import React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, authService, tokenManager } from '../utils/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      userId: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (token: string, user: User) => {
        // Persist tokens and user data
        tokenManager.setTokens({ accessToken: token, refreshToken: token });
        tokenManager.setUser(user);
        
        set({
          user,
          token,
          role: user.role,
          userId: typeof user.id === 'string' ? parseInt(user.id) : user.id,
          isAuthenticated: true,
          isLoading: false
        });
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            role: null,
            userId: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      updateUser: async (userData: Partial<User>) => {
        const { user } = get();
        if (!user) throw new Error('No user logged in');

        set({ isLoading: true });

        try {
          const updatedUser = await authService.updateProfile(userData);
          set({ 
            user: updatedUser, 
            role: updatedUser.role,
            userId: typeof updatedUser.id === 'string' ? parseInt(updatedUser.id) : updatedUser.id,
            isLoading: false 
          });
        } catch (error) {
          console.error('Update user error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      checkAuth: async (): Promise<boolean> => {
        const { isAuthenticated } = get();
        
        // If already authenticated, verify token is still valid
        if (isAuthenticated) {
          try {
            const tokens = tokenManager.getTokens();
            if (tokens) {
              // Token exists, user is authenticated
              return true;
            } else {
              // Tokens missing, clear auth state
              get().clearAuth();
              return false;
            }
          } catch (error) {
            console.error('Auth check error:', error);
            get().clearAuth();
            return false;
          }
        }

        // Try to restore auth from secure storage
        try {
          const tokens = tokenManager.getTokens();
          const user = tokenManager.getUser();

          if (tokens && user) {
            // Try to refresh the access token
            const newAccessToken = await tokenManager.refreshAccessToken();
            
            set({
              user,
              token: newAccessToken || tokens.accessToken,
              role: user.role,
              userId: user.id ? parseInt(user.id.toString()) : null,
              isAuthenticated: true,
              isLoading: false
            });
            return true;
          }
        } catch (error) {
          console.error('Auth restoration error:', error);
        }

        // No valid auth found
        get().clearAuth();
        return false;
      },

      clearAuth: () => {
        tokenManager.clearTokens();
        set({
          user: null,
          token: null,
          role: null,
          userId: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist non-sensitive data
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
        // Don't persist token - it's stored in httpOnly cookies
      }),
      // On rehydrate, check if auth is still valid
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check authentication status on app load
          state.checkAuth();
        }
      }
    }
  )
);

// Selectors for commonly used values
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthActions = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return {
    login: async (email: string, password: string) => {
      useAuthStore.setState({ isLoading: true });
      try {
        const response = await authService.login(email, password);
        setAuth(response.tokens.accessToken, response.user);
      } catch (error) {
        useAuthStore.setState({ isLoading: false });
        throw error;
      }
    },
    register: async (userData: {
      email: string;
      password: string;
      role: 'PATIENT' | 'DOCTOR';
      firstName?: string;
      lastName?: string;
    }) => {
      useAuthStore.setState({ isLoading: true });
      try {
        await authService.register(userData);
        useAuthStore.setState({ isLoading: false });
      } catch (error) {
        useAuthStore.setState({ isLoading: false });
        throw error;
      }
    },
    logout,
    updateUser,
    checkAuth,
    clearAuth
  };
};

// Utility hooks
export const useRequireAuth = () => {
  const isAuthenticated = useIsAuthenticated();
  const { checkAuth } = useAuthActions();

  React.useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  return isAuthenticated;
};

export const useRole = () => {
  const user = useUser();
  return user?.role;
};
