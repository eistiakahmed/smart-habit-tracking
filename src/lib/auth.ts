import { api } from './api';
import { User } from '@/types';
import { config } from '@/config';
import { logError, getUserMessage } from '@/utils/errorHandler';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: File | null;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export class AuthService {
  private static TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';
  private static USER_KEY = 'user';

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }

  static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to localStorage:', error);
    }
  }

  static clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${config.api.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    const authResponse = data.data;

    this.setToken(authResponse.tokens.accessToken);
    this.setRefreshToken(authResponse.tokens.refreshToken);
    this.setUser(authResponse.user);

    return authResponse;
  }

  static async register(userData: RegisterData): Promise<AuthResponse> {
    let body: FormData | string;
    let headers: Record<string, string> = {};

    if (userData.avatar) {
      const formData = new FormData();
      formData.append('avatar', userData.avatar);
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      if (userData.firstName) formData.append('firstName', userData.firstName);
      if (userData.lastName) formData.append('lastName', userData.lastName);
      body = formData;
      // Do not set Content-Type header so the browser sets the boundary automatically
    } else {
      headers['Content-Type'] = 'application/json';
      const { avatar, ...jsonFields } = userData;
      body = JSON.stringify(jsonFields);
    }

    const response = await fetch(`${config.api.baseUrl}/auth/register`, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    const authResponse = data.data;

    this.setToken(authResponse.tokens.accessToken);
    this.setRefreshToken(authResponse.tokens.refreshToken);
    this.setUser(authResponse.user);

    return authResponse;
  }

  static async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await api.logout(refreshToken);
      }
    } catch (error) {
      logError(error, 'AUTH_LOGOUT');
    } finally {
      this.clearAuth();
    }
  }

  static async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${config.api.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearAuth();
        return null;
      }

      const data = await response.json();
      const authResponse = data.data;

      this.setToken(authResponse.tokens.accessToken);

      return authResponse.tokens.accessToken;
    } catch (error) {
      logError(error, 'TOKEN_REFRESH');
      this.clearAuth();
      return null;
    }
  }
}

export const authService = AuthService;
