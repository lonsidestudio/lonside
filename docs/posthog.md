# PostHog — Lonside

Production only, after statistics consent in the existing cookie banner.
The SDK is loaded once, after consent; refusal and withdrawal block collection.
Keystatic routes and URL query strings/fragments are excluded. No form values,
names, email addresses or message contents are sent. Autocapture, session replay,
heatmaps and person profiles are disabled.

## Vercel configuration

Add these to the Production environment before deploying:

```dotenv
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=<public project token from PostHog project 332784>
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

Redeploy after changing these build-time variables. Without both, analytics is
disabled. Preview and local builds do not send events. Existing Vercel analytics
remains enabled under the same consent control.

## Events

- `$pageview`: initial visit after consent and SPA navigation.
- `$pageleave`: page departure (only with consent).
- `contact_cta_clicked`: contact, email or appointment link clicked; `channel`
  is `contact`, `email`, or `appointment`. This is not a booking or lead.
- `contact_form_started`: first form edit per mounted form.
- `contact_form_submitted`: the contact API confirmed the email provider accepted
  the message. This is a lead, not a signed customer or confirmed inbox delivery.
- `contact_form_failed`: request or provider failure.

Missing production email configuration returns 503 rather than reporting a
successful lead. Client-side analytics can be blocked; email records are the
source of truth for actual inquiries. Accepted quotes need a later CRM event.

## Verify after deployment

1. Refuse statistics: no PostHog requests.
2. Accept statistics: visit home, services, contact; check `$pageview` in PostHog.
3. Check recorded URLs contain no parameters or fragments.
4. Edit the contact form; check `contact_form_started`.
5. Submit an authorized test inquiry; verify one `contact_form_submitted` only
   after the provider accepts it. A 4xx/5xx must produce no successful lead.
6. Withdraw consent and navigate: no further events, including from another tab.
7. Use Web Analytics for pages and referrers, then build a funnel from `$pageview`
   to `contact_form_started` to `contact_form_submitted` once events arrive.

Dashboard: https://eu.posthog.com/project/332784/dashboard/1080593
Setup reference: https://posthog.com/docs/libraries/next-js
