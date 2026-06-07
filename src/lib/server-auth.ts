import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAccessToken, getRefreshToken, getUserFromCookie } from './server-cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ServerUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export async function getServerUser(): Promise<ServerUser | null> {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      const accessToken = await getAccessToken();
      if (!accessToken) return null;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.data;
    }
    return user;
  } catch (error) {
    console.error('Error fetching server user:', error);
    return null;
  }
}

export async function refreshServerAccessToken(): Promise<string | null> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const authResponse = data.data;

    const cookieStore = await cookies();
    cookieStore.set('access_token', authResponse.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    });

    return authResponse.tokens.accessToken;
  } catch (error) {
    console.error('Server token refresh error:', error);
    return null;
  }
}

export async function requireAuth(): Promise<ServerUser> {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

export async function makeAuthenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token = await getAccessToken();

  if (!token) {
    redirect('/login');
  }

  const makeRequest = async (accessToken: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
      cache: 'no-store',
    });

    if (response.status === 401) {
      const newToken = await refreshServerAccessToken();
      if (newToken) {
        return makeRequest(newToken);
      }
      redirect('/login');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || `API error: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.data || data;
  };

  return makeRequest(token);
}
