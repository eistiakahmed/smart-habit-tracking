import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isProtectedPath =
    pathname === '/' ||
    pathname.startsWith('/habits') ||
    pathname.startsWith('/goals') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/social') ||
    pathname.startsWith('/achievements') ||
    pathname.startsWith('/challenges') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/progress') ||
    pathname.startsWith('/mobile');

  // If user is authenticated and tries to access login/register, redirect to home
  if (isPublicPath && accessToken && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not authenticated and tries to access protected path, redirect to login
  if (isProtectedPath && !accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)'],
};
