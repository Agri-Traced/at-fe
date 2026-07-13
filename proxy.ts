import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './app/i18n-config';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Let public assets and other file requests pass through unchanged.
  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // Kiểm tra xem URL đã có tiền tố ngôn ngữ chưa
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Nếu chưa có, tự động chuyển hướng sang ngôn ngữ mặc định
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${i18n.defaultLocale}${pathname}`, request.url)
    );
  }
}

export const config = {
  // Bỏ qua các tệp hệ thống, ảnh và API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};