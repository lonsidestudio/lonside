import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

function harness({ env = {}, pathname = '/' } = {}) {
  const target = new EventTarget();
  let stored = null;
  const scripts = [];

  const document = {
    head: {
      appendChild(el) {
        scripts.push(el);
        return el;
      },
    },
    getElementById(id) {
      return scripts.find((s) => s.id === id) ?? null;
    },
    createElement(tag) {
      return { tag, id: '', async: false, src: '' };
    },
  };

  const window = {
    location: { pathname },
    localStorage: {
      getItem() {
        return stored;
      },
    },
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
  };

  const compile = (filePath, imports = {}) => {
    const code = ts.transpileModule(fs.readFileSync(filePath, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const exports = {};
    vm.runInNewContext(code, {
      exports,
      window,
      document,
      Date,
      encodeURIComponent,
      process: { env },
      require: (name) => {
        if (!(name in imports)) throw Error('Unexpected import: ' + name);
        return imports[name];
      },
    });
    return exports;
  };

  const consent = compile('src/lib/analytics-consent.ts');
  const gtm = compile('src/lib/gtm.ts', {
    '@/lib/analytics-consent': consent,
  });

  return {
    gtm,
    window,
    scripts,
    set(val) {
      stored = val;
    },
    setPath(p) {
      window.location.pathname = p;
    },
  };
}

test('GTM stays completely unloaded without consent, outside production, or on /keystatic', () => {
  const h = harness();
  assert.equal(h.gtm.syncGtmConsent(true), false);
  assert.equal(h.scripts.length, 0);
  assert.equal(h.window.dataLayer, undefined);

  h.set('{"accepted":true,"analytics":true}');
  assert.equal(h.gtm.syncGtmConsent(false), false);
  assert.equal(h.scripts.length, 0);

  h.setPath('/keystatic/edit');
  assert.equal(h.gtm.syncGtmConsent(true), false);
  assert.equal(h.scripts.length, 0);
});

test('GTM initializes dataLayer, Consent Mode v2, and injects GTM-M5WCHWX3 once, then revokes on withdrawal', () => {
  const h = harness();
  h.set('{"accepted":true,"analytics":true}');

  assert.equal(h.gtm.syncGtmConsent(true), true);
  assert.equal(h.scripts.length, 1);
  assert.equal(h.scripts[0].async, true);
  assert.equal(h.scripts[0].src, 'https://www.googletagmanager.com/gtm.js?id=GTM-M5WCHWX3');

  // Verify Consent Mode v2 + gtag('js', new Date()) + gtm.start
  assert.ok(Array.isArray(h.window.dataLayer));
  assert.equal(h.window.dataLayer[0][0], 'consent');
  assert.equal(h.window.dataLayer[0][1], 'default');
  assert.equal(h.window.dataLayer[0][2].analytics_storage, 'denied');
  assert.equal(h.window.dataLayer[1][0], 'consent');
  assert.equal(h.window.dataLayer[1][1], 'update');
  assert.equal(h.window.dataLayer[1][2].analytics_storage, 'granted');
  assert.equal(h.window.dataLayer[2][0], 'js');
  assert.equal(h.window.dataLayer[3].event, 'gtm.js');

  // Re-calling does not inject a duplicate script
  assert.equal(h.gtm.syncGtmConsent(true), true);
  assert.equal(h.scripts.length, 1);

  // Withdrawal updates consent to denied immediately
  h.set('{"accepted":true,"analytics":false}');
  assert.equal(h.gtm.syncGtmConsent(true), false);
  const lastEntry = h.window.dataLayer[h.window.dataLayer.length - 1];
  assert.equal(lastEntry[0], 'consent');
  assert.equal(lastEntry[1], 'update');
  assert.equal(lastEntry[2].analytics_storage, 'denied');
});

test('CSP in next.config.ts explicitly allows Google Tag Manager and Google Analytics domains', () => {
  const nextConfigSource = fs.readFileSync('next.config.ts', 'utf8');
  assert.ok(nextConfigSource.includes('https://www.googletagmanager.com'));
  assert.ok(nextConfigSource.includes('https://www.google-analytics.com'));
  assert.ok(nextConfigSource.includes('https://*.google-analytics.com'));
});
