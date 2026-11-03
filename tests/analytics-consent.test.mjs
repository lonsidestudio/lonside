import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

function harness() {
  const target = new EventTarget();
  let stored = null;
  let unavailable = false;
  const window = {
    localStorage: { getItem() { if (unavailable) throw Error('storage blocked'); return stored; } },
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
  };
  const compile = (path, imports = {}) => {
    const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const exports = {};
    vm.runInNewContext(code, { exports, window, URL, require: (name) => {
      if (!(name in imports)) throw Error('Unexpected import: ' + name);
      return imports[name];
    } });
    return exports;
  };
  const consent = compile('src/lib/analytics-consent.ts');
  const component = compile('src/components/layout/ConsentAnalytics.tsx', {
    react: { useSyncExternalStore: (_subscribe, snapshot) => snapshot() },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) },
    '@vercel/analytics/next': { Analytics: 'Analytics' },
    '@/lib/analytics-consent': consent,
  }).default;
  return {
    consent, component, target,
    set(value) { stored = value; },
    block() { unavailable = true; },
  };
}

test('no analytics without explicit consent or outside production', () => {
  const h = harness();
  for (const value of [null, '{}', 'null', 'invalid', '{"accepted":true,"analytics":false}', '{"accepted":true,"analytics":"true"}']) {
    h.set(value);
    assert.equal(h.component({ enabled: true }), null);
  }
  h.set('{"accepted":true,"analytics":true}');
  assert.equal(h.component({ enabled: false }), null);
  assert.ok(h.component({ enabled: true }));
  h.block();
  assert.equal(h.component({ enabled: true }), null);
});

test('loaded callback blocks events immediately after withdrawal and redacts URLs', () => {
  const h = harness();
  h.set('{"accepted":true,"analytics":true}');
  const filter = h.component({ enabled: true }).props.beforeSend;
  assert.equal(filter({ type: 'pageview', url: 'https://lonside.ai/contact?email=private#secret' }).url, 'https://lonside.ai/contact');
  for (const path of ['/keystatic', '/keystatic/edit', '/en/keystatic/edit']) {
    assert.equal(filter({ type: 'pageview', url: 'https://lonside.ai' + path }), null);
  }
  h.set('{"accepted":true,"analytics":false}');
  for (const type of ['pageview', 'event']) assert.equal(filter({ type, url: 'https://lonside.ai/' }), null);
  h.set('{"accepted":true,"analytics":true}');
  assert.ok(filter({ type: 'pageview', url: 'https://lonside.ai/en' }));
});

test('consent subscriptions handle same-tab updates, cross-tab changes and cleanup', () => {
  const h = harness();
  let calls = 0;
  const unsubscribe = h.consent.subscribeToConsent(() => calls++);
  h.target.dispatchEvent(new Event(h.consent.CONSENT_EVENT));
  const storage = (key) => { const e = new Event('storage'); e.key = key; h.target.dispatchEvent(e); };
  storage('unrelated');
  storage(h.consent.CONSENT_KEY);
  storage(null);
  assert.equal(calls, 3);
  unsubscribe();
  h.target.dispatchEvent(new Event(h.consent.CONSENT_EVENT));
  storage(h.consent.CONSENT_KEY);
  assert.equal(calls, 3);
});
