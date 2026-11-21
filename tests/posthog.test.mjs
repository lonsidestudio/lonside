import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

function harness() {
  let consent = false;
  let imported = 0;
  let initialized = 0;
  let optedOut = false;
  let options;
  const captured = [];
  const window = { location: { pathname: '/fr/contact' } };
  const sdk = {
    init(_token, config) { initialized++; options = config; return sdk; },
    opt_out_capturing() { optedOut = true; },
    has_opted_out_capturing() { return optedOut; },
    opt_in_capturing() { optedOut = false; },
    capture(event, properties) { captured.push({ event, properties }); },
  };
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync('src/lib/posthog.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports, window, URL,
    process: { env: { NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: 'test', NEXT_PUBLIC_POSTHOG_HOST: 'https://example.test' } },
    require(name) {
      if (name === './analytics-consent') return { hasAnalyticsConsent: () => consent };
      if (name === 'posthog-js') { imported++; return { default: sdk }; }
      throw Error(name);
    },
  });
  return { api: exports, window, captured, consent(value) { consent = value; }, stats() { return { imported, initialized, optedOut, options }; } };
}

test('SDK stays unloaded without consent and outside production, then initializes once', async () => {
  const h = harness();
  await h.api.syncPostHogConsent(true);
  h.consent(true);
  await h.api.syncPostHogConsent(false);
  assert.equal(h.stats().imported, 0);
  await Promise.all([h.api.syncPostHogConsent(true), h.api.syncPostHogConsent(true)]);
  assert.equal(h.stats().initialized, 1);
  assert.equal(h.stats().options.autocapture, false);
  assert.equal(h.stats().options.disable_session_recording, true);
  assert.equal(h.stats().options.capture_pageview, 'history_change');
});

test('withdrawal blocks even queued events and reacceptance restores collection', async () => {
  const h = harness();
  h.consent(true);
  await h.api.syncPostHogConsent(true);
  const filter = h.stats().options.before_send;
  h.api.captureLeadEvent('contact_form_submitted');
  assert.equal(h.captured.length, 1);
  h.consent(false);
  assert.equal(filter({ event: '$pageview', properties: {} }), null);
  h.api.captureLeadEvent('contact_form_submitted');
  assert.equal(h.captured.length, 1);
  await h.api.syncPostHogConsent(true);
  assert.equal(h.stats().optedOut, true);
  h.consent(true);
  await h.api.syncPostHogConsent(true);
  assert.equal(h.stats().initialized, 1);
  assert.equal(h.captured.at(-1).event, '$pageview');
});

test('URLs are sanitized recursively and admin pages are excluded', async () => {
  const h = harness();
  h.consent(true);
  await h.api.syncPostHogConsent(true);
  const filter = h.stats().options.before_send;
  const event = filter({ event: '$pageview', properties: {
    $current_url: 'https://example.test/contact?email=private#secret',
    $set_once: { $initial_referrer: 'https://referrer.test/?secret=value' },
  } });
  assert.equal(event.properties.$current_url, 'https://example.test/contact');
  assert.equal(event.properties.$set_once.$initial_referrer, 'https://referrer.test/');
  for (const path of ['/keystatic', '/en/keystatic/edit', '/fr/keystatic']) {
    h.window.location.pathname = path;
    assert.equal(filter({ event: '$pageview', properties: {} }), null);
    h.api.captureLeadEvent('contact_cta_clicked');
  }
  assert.equal(h.captured.length, 0);
});

test('withdrawing consent while the SDK loads cancels initialization', async () => {
  const h = harness();
  h.consent(true);
  const pending = h.api.syncPostHogConsent(true);
  h.consent(false);
  await h.api.syncPostHogConsent(true);
  await pending;
  assert.equal(h.stats().initialized, 0);
});

test('secret keys (phs_/phx_) are refused and EU host routes via /ingest reverse proxy', () => {
  const h = harness();
  assert.equal(h.api.isSecretPostHogKey('phs_secret123'), true);
  assert.equal(h.api.isSecretPostHogKey('phx_personal123'), true);
  assert.equal(h.api.isSecretPostHogKey('phc_public123'), false);
  const eu = h.api.resolvePostHogHosts('https://eu.i.posthog.com');
  assert.equal(eu.apiHost, '/ingest');
  assert.equal(eu.uiHost, 'https://eu.posthog.com');
  const fallback = h.api.resolvePostHogHosts(undefined);
  assert.equal(fallback.apiHost, '/ingest');
  assert.equal(fallback.uiHost, 'https://eu.posthog.com');
});
