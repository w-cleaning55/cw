import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateAuth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is an admin route
  if (pathname.startsWith('/admin')) {
    try {
      // Validate authentication
      const { user, isValid } = await validateAuth(request);
      
      if (!isValid || !user) {
        // Redirect to login with return URL
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check if user has admin access
      if (!['admin', 'manager'].includes(user.role)) {
        // Redirect to unauthorized page
        return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
      }

      // Add user info to headers for use in components
      const response = NextResponse.next();
      response.headers.set('x-user-id', user.id);
      response.headers.set('x-user-role', user.role);
      response.headers.set('x-user-permissions', JSON.stringify(user.permissions));
      
      return response;
    } catch (error) {
      console.error('Middleware authentication error:', error);
      // Redirect to login on error
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Check if user is already logged in and trying to access login page
  if (pathname === '/auth/login') {
    try {
      const { user, isValid } = await validateAuth(request);
      
      if (isValid && user) {
        // User is already logged in, redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch (error) {
      // Continue to login page if there's an error
      console.error('Middleware login check error:', error);
    }
  }

  // Check if user is trying to access unauthorized page while not authenticated
  if (pathname === '/auth/unauthorized') {
    try {
      const { user, isValid } = await validateAuth(request);
      
      if (!isValid || !user) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('next', '/admin');
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // Redirect to login on error
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('next', '/admin');
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/login',
    '/auth/unauthorized',
  ],
};
