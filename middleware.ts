import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is an admin route
  if (pathname.startsWith('/admin')) {
    // Get the token from cookies
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Verify token (basic check - in production you'd want to verify with your backend)
    try {
      // For now, just check if token exists and has basic structure
      if (token.length < 10) {
        throw new Error('Invalid token');
      }
    } catch (error) {
      // Token is invalid, redirect to login
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Check if user is already logged in and trying to access login page
  if (pathname === '/auth/login') {
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (token && token.length >= 10) {
      // User is already logged in, redirect to admin dashboard
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/login',
  ],
};
