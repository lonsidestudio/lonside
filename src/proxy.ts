import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, pathnames } from './lib/i18n/config';

const i18nProxy = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  pathnames,
});

export function proxy(request: NextRequest) {
  return i18nProxy(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|icon|apple-icon|og|.*\\..*).*)'],
};
