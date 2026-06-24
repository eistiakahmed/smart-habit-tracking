'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginCredentials, RegisterData } from '@/lib/auth';
import { setAuthCookies, clearAuthCookies, getCookie } from '@/lib/cookies';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      let storedUser = authService.getUser();
      let token = authService.getToken();

      // Fallback to cookies if localStorage is empty
      if (!storedUser || !token) {
        const cookieUserStr = getCookie('user');
        const cookieToken = getCookie('access_token');
        if (cookieUserStr && cookieToken) {
          try {
            storedUser = JSON.parse(cookieUserStr);
            token = cookieToken;
            authService.setUser(storedUser);
            authService.setToken(token);
            const refreshT = getCookie('refresh_token');
            if (refreshT) {
              authService.setRefreshToken(refreshT);
            }
          } catch (e) {
            console.error('Error restoring session from cookies:', e);
          }
        }
      }

      if (storedUser && token) {
        setUser(storedUser);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser(response.user as User);

    setAuthCookies(
      {
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
      },
      response.user
    );
  };

  const register = async (userData: RegisterData) => {
    const response = await authService.register(userData);
    setUser(response.user as User);

    setAuthCookies(
      {
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
      },
      response.user
    );
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    clearAuthCookies();
  };

  const refreshSession = async () => {
    const newToken = await authService.refreshAccessToken();
    if (newToken && user) {
      setUser({ ...user });
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    authService.setUser(updatedUser);
    setAuthCookies(
      {
        accessToken: authService.getToken() || '',
        refreshToken: authService.getRefreshToken() || '',
      },
      updatedUser
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshSession,
        isAuthenticated: !!user,
        updateUser,
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
