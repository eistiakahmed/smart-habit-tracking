'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService, LoginCredentials, RegisterData } from '@/lib/auth';
import { setAuthCookies, clearAuthCookies, getCookie } from '@/lib/cookies';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (updatedUser: User) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Consolidated auth state initialization with proper error handling
  useEffect(() => {
    if (isInitialized) return;

    const initializeAuth = () => {
      try {
        setLoading(true);
        setError(null);

        // Try localStorage first (primary storage)
        let storedUser = authService.getUser();
        let token = authService.getToken();

        // Only fallback to cookies if localStorage is completely empty
        if (!storedUser && !token) {
          const cookieUserStr = getCookie('user');
          const cookieToken = getCookie('access_token');

          if (cookieUserStr && cookieToken) {
            try {
              storedUser = JSON.parse(cookieUserStr);
              token = cookieToken;

              // Sync to localStorage (primary storage)
              if (storedUser) {
                authService.setUser(storedUser);
                authService.setToken(token);
              }

              const refreshT = getCookie('refresh_token');
              if (refreshT) {
                authService.setRefreshToken(refreshT);
              }
            } catch (e) {
              // Clear corrupted cookie data
              clearAuthCookies();
              setError('Failed to restore session. Please login again.');
            }
          }
        }

        // Validate that we have both user and token
        if (storedUser && token) {
          setUser(storedUser);
        } else if (storedUser || token) {
          // Incomplete auth data - clear everything
          authService.clearAuth();
          clearAuthCookies();
        }
      } catch (e) {
        setError('Authentication initialization failed');
        console.error('Auth initialization error:', e);
        authService.clearAuth();
        clearAuthCookies();
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [isInitialized]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.login(credentials);

      setUser(response.user);
      setAuthCookies(
        {
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken,
        },
        response.user
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.register(userData);

      setUser(response.user);
      setAuthCookies(
        {
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken,
        },
        response.user
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      clearAuthCookies();
      setLoading(false);
    }
  };

  const refreshSession = useCallback(async () => {
    try {
      const newToken = await authService.refreshAccessToken();
      if (newToken && user) {
        setUser({ ...user });
      } else {
        // Token refresh failed - clear auth
        setUser(null);
        clearAuthCookies();
      }
    } catch (err) {
      console.error('Session refresh error:', err);
      setUser(null);
      clearAuthCookies();
    }
  }, [user]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    authService.setUser(updatedUser);
    setAuthCookies(
      {
        accessToken: authService.getToken() || '',
        refreshToken: authService.getRefreshToken() || '',
      },
      updatedUser
    );
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshSession,
        isAuthenticated: !!user,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
