# Consent Mode v2 Integration

The Marver GTM template integrates with [Google's Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent) using the `analytics_storage` consent type.

## Default behavior (Wait for Consent = ON)

- If `analytics_storage = denied` at page load: SDK does **not** load. Events queued in `window.dwbq`.
- When user grants consent (e.g., clicks accept on your CMP): SDK loads, queue drains, tracking begins.

## Wait for Consent = OFF

- SDK loads immediately. Per-event consent enforcement happens inside the SDK.
- Use this if your CMP fires too late or you have a different consent model.

## CMP integration

Most consent management platforms (OneTrust, Cookiebot, Iubenda, etc.) call `gtag('consent', 'update', { analytics_storage: 'granted' })` automatically when the user accepts. The Marver template subscribes to that signal — no additional wiring needed.

## Verifying

In GTM Preview Mode with consent denied:
- Init tag should show **"running"** (deferred)
- No requests to your Sensor should appear

After granting consent:
- Init tag completes (green checkmark)
- Queued events fire in order
