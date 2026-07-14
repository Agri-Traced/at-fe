import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/batch', '/company', '/user', '/dashboard', '/profile', '/settings'];

const protectedApiRoutes = ['/api/batch'];

const guestRoutes = ['/login'];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('auth_token')?.value;

  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    console.log('caused by', pathname);
    const url = new URL('/login', request.url);
    const searchQuery = request.nextUrl.search;
    const callbackUrl = searchQuery ? pathname + searchQuery : pathname;
    url.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(url);
  }

  if (token && guestRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && protectedApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.json(
      { error: { message: 'Unauthorized. Please login first.', code: 'UNAUTHORIZED' } },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  // Bỏ qua các tệp hệ thống, ảnh và API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};