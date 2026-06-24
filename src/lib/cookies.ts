const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const USER_COOKIE = 'user';

export const COOKIE_OPTIONS = {
  access_token: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 15 * 60,
    path: '/',
  },
  refresh_token: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  },
  user: {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  },
};

export function setAuthCookies(tokens: { accessToken: string; refreshToken: string }, user: any) {
  const cookieList = [
    { name: ACCESS_TOKEN_COOKIE, value: tokens.accessToken, options: COOKIE_OPTIONS.access_token },
    { name: REFRESH_TOKEN_COOKIE, value: tokens.refreshToken, options: COOKIE_OPTIONS.refresh_token },
    { name: USER_COOKIE, value: JSON.stringify(user), options: COOKIE_OPTIONS.user },
  ];

  cookieList.forEach(cookie => {
    // client-side cookies cannot have HttpOnly set via document.cookie
    const serializedCookie = `${cookie.name}=${encodeURIComponent(cookie.value)}; ` +
      `Max-Age=${cookie.options.maxAge}; Path=${cookie.options.path}; ` +
      `${cookie.options.secure ? 'Secure; ' : ''}SameSite=${cookie.options.sameSite}`;

    if (typeof document !== 'undefined') {
      document.cookie = serializedCookie;
    }
  });
}

export function clearAuthCookies() {
  const cookiesToClear = [ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, USER_COOKIE];

  cookiesToClear.forEach(name => {
    const cookie = `${name}=; Max-Age=0; Path=/; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=lax`;
    if (typeof document !== 'undefined') {
      document.cookie = cookie;
    }
  });
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}
