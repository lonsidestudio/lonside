import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

function loadModule(filePath, mockModules = {}) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const transpiled = ts.transpileModule(fileContent, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  const exports = {};
  const moduleContext = {
    exports,
    module: { exports },
    process,
    Date,
    require: (moduleName) => {
      if (mockModules[moduleName]) {
        return mockModules[moduleName];
      }
      throw new Error(`Unexpected import in test harness: ${moduleName}`);
    },
  };

  vm.runInNewContext(transpiled, moduleContext);
  return moduleContext.module.exports;
}

// 1. Charger site-config
const siteConfigModule = loadModule('src/lib/site-config.ts');
const siteConfig = siteConfigModule.siteConfig;

// 2. Charger seo-helpers
const seoHelpers = loadModule('src/lib/seo-helpers.ts', {
  '@/lib/site-config': siteConfigModule,
  './site-config': siteConfigModule,
});

// 3. Charger sitemap
const sitemapModule = loadModule('src/app/sitemap.ts', {
  '@/lib/site-config': siteConfigModule,
});
const sitemap = sitemapModule.default;

// 4. Charger robots
const robotsModule = loadModule('src/app/robots.ts', {
  '@/lib/site-config': siteConfigModule,
});
const robots = robotsModule.default;

// 5. Charger proxy
const proxyModule = loadModule('src/proxy.ts', {
  'next-intl/middleware': { default: () => () => {} },
  './lib/i18n/config': {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    pathnames: {},
  },
});
const proxyConfig = proxyModule.config;

test('siteConfig points to official Lonside domain, email and GitHub organisation', () => {
  assert.equal(siteConfig.siteUrl, 'https://www.lonside.com');
  assert.equal(siteConfig.contactEmail, 'hello@lonside.com');
  assert.equal(siteConfig.githubUrl, 'https://github.com/lonsidestudio');
});

test('sitemap generates strictly 200 OK canonical URLs with valid hreflang', async () => {
  const entries = await sitemap();
  assert.equal(entries.length, 10, 'Sitemap must contain exactly 10 URLs (5 FR, 5 EN)');

  const expectedUrls = [
    'https://www.lonside.com/',
    'https://www.lonside.com/en',
    'https://www.lonside.com/legal/mentions-legales',
    'https://www.lonside.com/en/legal/legal-notice',
    'https://www.lonside.com/legal/politique-confidentialite',
    'https://www.lonside.com/en/legal/privacy-policy',
    'https://www.lonside.com/legal/cgv',
    'https://www.lonside.com/en/legal/terms-of-sale',
    'https://www.lonside.com/legal/cookies',
    'https://www.lonside.com/en/legal/cookie-policy',
  ];

  for (const expected of expectedUrls) {
    const match = entries.find((e) => e.url === expected);
    assert.ok(match, `URL ${expected} must be present in sitemap`);
    assert.ok(match.alternates?.languages?.fr, `Hreflang fr must be set on ${expected}`);
    assert.ok(match.alternates?.languages?.en, `Hreflang en must be set on ${expected}`);
    assert.ok(match.alternates?.languages?.['x-default'], `Hreflang x-default must be set on ${expected}`);
    assert.ok(match.lastModified instanceof Date, `lastModified must be a valid Date on ${expected}`);
  }

  // Ensure NO redirected URLs (e.g. non-www or unlocalized slugs)
  for (const entry of entries) {
    assert.ok(entry.url.startsWith('https://www.lonside.com'), `All URLs must use www.lonside.com: ${entry.url}`);
    assert.ok(!entry.url.includes('/fr/legal/'), `URL must not contain /fr/ prefix on legal pages: ${entry.url}`);
    assert.ok(!entry.url.includes('/en/legal/cgv'), `English CGV must use localized slug /terms-of-sale: ${entry.url}`);
    assert.ok(!entry.url.includes('/en/legal/mentions-legales'), `English mentions must use /legal-notice: ${entry.url}`);
  }
});

test('robots.txt points to canonical sitemap and allows search and AI crawlers', () => {
  const rules = robots();
  assert.equal(rules.sitemap, 'https://www.lonside.com/sitemap.xml');
  assert.ok(Array.isArray(rules.rules), 'Robots rules must be an array');

  const generalRule = rules.rules.find((r) => r.userAgent === '*');
  assert.ok(generalRule, 'General wildcard rule must exist');
  assert.equal(generalRule.allow, '/');

  const aiRule = rules.rules.find((r) => Array.isArray(r.userAgent) && r.userAgent.includes('GPTBot'));
  assert.ok(aiRule, 'AI agent crawl rule must exist');
  assert.ok(Array.isArray(aiRule.allow) && aiRule.allow.includes('/llms.txt'));
});

test('proxy middleware matcher excludes dynamic asset routes to prevent 404', () => {
  const matcher = proxyConfig.matcher[0];
  const regex = new RegExp(`^${matcher}$`);

  // Routes that MUST bypass the i18n proxy (return false)
  const excludedRoutes = [
    '/icon',
    '/apple-icon',
    '/og',
    '/api/contact',
    '/sitemap.xml',
    '/robots.txt',
    '/manifest.webmanifest',
    '/llms.txt',
  ];

  for (const route of excludedRoutes) {
    const isMatched = regex.test(route);
    assert.equal(isMatched, false, `Route ${route} must bypass proxy to avoid 404`);
  }

  // Routes that MUST go through proxy (return true)
  const proxyRoutes = ['/', '/en', '/legal/cgv', '/en/legal/terms-of-sale'];
  for (const route of proxyRoutes) {
    const isMatched = regex.test(route);
    assert.equal(isMatched, true, `Route ${route} must be handled by i18n proxy`);
  }
});

test('legal canonical and breadcrumbs helpers generate valid Schema.org structure', () => {
  const { canonical, alternates } = seoHelpers.getLegalCanonicalAndAlternates('mentions-legales', 'en');
  assert.equal(canonical, 'https://www.lonside.com/en/legal/legal-notice');
  assert.equal(alternates.languages.fr, 'https://www.lonside.com/legal/mentions-legales');
  assert.equal(alternates.languages.en, 'https://www.lonside.com/en/legal/legal-notice');

  const breadcrumbs = seoHelpers.buildLegalBreadcrumbJsonLd('Legal Notice', canonical, 'en');
  assert.equal(breadcrumbs['@type'], 'BreadcrumbList');
  assert.equal(breadcrumbs.itemListElement.length, 2);
  assert.equal(breadcrumbs.itemListElement[0].item, 'https://www.lonside.com/en');
  assert.equal(breadcrumbs.itemListElement[1].item, canonical);
});

test('not-found page explicitly defines noindex metadata for search crawlers', () => {
  const notFoundContent = fs.readFileSync('src/app/not-found.tsx', 'utf8');
  assert.ok(notFoundContent.includes('index: false'), 'NotFound must declare index: false');
  assert.ok(notFoundContent.includes('follow: false'), 'NotFound must declare follow: false');
});

test('brand identity integrity: strictly zero occurrences of taboo word "agence" in src and content', () => {
  function scan(dir) {
    const hits = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', '.next', '.git'].includes(entry.name)) {
          hits.push(...scan(fullPath));
        }
      } else if (/\.(tsx|ts|json|yaml|yml)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (/\b(agence|agences)\b/i.test(content)) {
          hits.push(fullPath);
        }
      }
    }
    return hits;
  }

  const hitsInSrc = scan('src');
  const hitsInContent = scan('content');
  assert.deepEqual(hitsInSrc, [], `Forbidden word "agence" found in src files: ${hitsInSrc.join(', ')}`);
  assert.deepEqual(hitsInContent, [], `Forbidden word "agence" found in content files: ${hitsInContent.join(', ')}`);
});

test('supervision module produces structured service telemetry and status metadata', async () => {
  const supervisionModule = loadModule('src/lib/supervision.ts');
  const report = await supervisionModule.getSupervisionReport();

  assert.ok(report.timestamp, 'Report must have a timestamp');
  assert.ok(Array.isArray(report.services), 'Services must be an array');
  assert.equal(report.services.length, 4, 'Must monitor 4 core services');

  const names = report.services.map((s) => s.name);
  assert.ok(names.includes('PostHog Analytics'), 'Must monitor PostHog Analytics');
  assert.ok(names.includes('Service de Contact (Resend)'), 'Must monitor Resend Messaging');
  assert.ok(names.includes('Vercel Edge Network & Speed Insights'), 'Must monitor Edge Infrastructure');
  assert.ok(names.includes('Moteurs de Recherche & Indexation IA'), 'Must monitor SEO & Search Engines');

  const statusPageContent = fs.readFileSync('src/app/[locale]/status/page.tsx', 'utf8');
  assert.ok(statusPageContent.includes('index: false'), 'Status page must be noindex');
  assert.ok(statusPageContent.includes('follow: false'), 'Status page must be nofollow');
});
