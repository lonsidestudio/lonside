import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('contact API route escapes HTML, bounds rate limiter, and validates Origin in production', () => {
  const src = fs.readFileSync('src/app/api/contact/route.ts', 'utf8');
  assert.ok(src.includes('function escapeHtml('), 'contact route must define escapeHtml');
  assert.ok(src.includes('const safeName = escapeHtml(name)'), 'name must be HTML-escaped');
  assert.ok(src.includes('const safeMessage = escapeHtml(message)'), 'message must be HTML-escaped');
  assert.ok(src.includes('MAX_RATE_LIMIT_ENTRIES'), 'rate limiter map must be bounded');
  assert.ok(src.includes('isAllowedOrigin(request)'), 'contact route must check Origin in production');
});

test('OG image route sanitizes and bounds title/description and sets Edge cache headers', () => {
  const src = fs.readFileSync('src/app/og/route.tsx', 'utf8');
  assert.ok(src.includes('MAX_TITLE_LENGTH'), 'OG route must bound title length');
  assert.ok(src.includes('MAX_DESCRIPTION_LENGTH'), 'OG route must bound description length');
  assert.ok(src.includes('Cache-Control'), 'OG route must set Cache-Control header');
});

test('Keystatic admin layout sets noindex and API route blocks unconfigured production runtime', () => {
  const layoutSrc = fs.readFileSync('src/app/keystatic/layout.tsx', 'utf8');
  assert.ok(layoutSrc.includes('index: false'), 'Keystatic layout must declare index: false');
  assert.ok(layoutSrc.includes('follow: false'), 'Keystatic layout must declare follow: false');

  const apiSrc = fs.readFileSync('src/app/api/keystatic/[...params]/route.ts', 'utf8');
  assert.ok(apiSrc.includes('isKeystaticEnabledInRuntime'), 'Keystatic API must guard unconfigured prod mode');
});

test('Supervision API route supports timing-safe bearer auth and redacts internal env details in production', () => {
  const src = fs.readFileSync('src/app/api/supervision/route.ts', 'utf8');
  assert.ok(src.includes('timingSafeEqual'), 'Supervision route must use timingSafeEqual for token checks');
  assert.ok(src.includes('safeReport'), 'Supervision route must redact internal details in unauthenticated prod mode');
});
