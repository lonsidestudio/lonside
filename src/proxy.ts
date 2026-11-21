import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale, pathnames } from './lib/i18n/config';

const i18nProxy = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  pathnames,
});

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Normalise les trailing slashes sur les routes publiques (skipTrailingSlashRedirect est activé pour /ingest/*)
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(cleanUrl, 308);
  }
  return i18nProxy(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|ingest|icon|apple-icon|og|.*\\..*).*)'],
};
