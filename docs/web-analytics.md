# Web Analytics operations

Vercel Web Analytics replaces Plausible. Only Vercel Production deployments
(`VERCEL_ENV=production`) render the analytics component, after explicit statistics
consent. Preview and local deployments do not collect events.

Preferences are saved in `lonside-cookie-consent` in localStorage. Same-tab and
cross-tab changes update the component. The beforeSend callback rechecks storage
for every event, so withdrawal blocks subsequent events even if the SDK script
is already loaded. Invalid or unavailable storage disables analytics.
URL queries/fragments and Keystatic page views are filtered out.

## Deployment

1. Enable Web Analytics for the lonside project in the Vercel dashboard.
2. Deploy after activation (redeploy if it was enabled after the build).
3. On Production, with browser blockers disabled, check:
   - New visitor/refusal: no Analytics script or page-view requests.
   - Acceptance: script loads and page-view requests succeed, including navigation.
   - Withdrawal: subsequent events stop; reload still does not load the script.
   - No query strings or fragments appear in collected page URLs.
4. Confirm visits appear in the dashboard. Preview success alone does not prove
   collection works because collection is deliberately disabled in Preview.

The former `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` variable can be removed from Vercel;
it is no longer read by this implementation.

## Checks

- `node --test tests/analytics-consent.test.mjs`
- `npx tsc --noEmit`
- `VERCEL_ENV=production npm run build`
- `npm run lint`

The consent tests exercise the real consent/filter code with mocked React
rendering and storage; they do not validate Vercel's remote collector.
At the time of this change, the full lint command reports 8 existing errors and
14 warnings in untouched estimation, not-found, flagship offers and in-view code.
Changed code passes targeted ESLint.
